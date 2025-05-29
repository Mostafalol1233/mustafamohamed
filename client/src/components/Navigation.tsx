import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface NavigationProps {
  showAdminButton?: boolean;
}

export default function Navigation({ showAdminButton = true }: NavigationProps) {
  const { isAuthenticated, login, logout, isLoginPending, loginError } = useAuth();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم المستخدم وكلمة المرور",
        variant: "destructive",
      });
      return;
    }
    
    login({ username, password }, {
      onSuccess: () => {
        setIsLoginOpen(false);
        setUsername("");
        setPassword("");
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في لوحة التحكم",
        });
      },
      onError: () => {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "اسم المستخدم أو كلمة المرور غير صحيحة",
          variant: "destructive",
        });
      },
    });
  };

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        setIsAdminOpen(false);
        toast({
          title: "تم تسجيل الخروج",
          description: "تم تسجيل خروجك بنجاح",
        });
      },
    });
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 glass-effect backdrop-blur-lg border-b border-border">
        <div className="container-max">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold text-primary">
              <span className="text-accent">M</span>ustafa
            </div>
            <div className="hidden md:flex space-x-8">
              <button 
                onClick={() => scrollToSection('home')} 
                className="text-foreground hover:text-accent transition-colors duration-300"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className="text-foreground hover:text-accent transition-colors duration-300"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('certifications')} 
                className="text-foreground hover:text-accent transition-colors duration-300"
              >
                Certifications
              </button>
              <button 
                onClick={() => scrollToSection('portfolio')} 
                className="text-foreground hover:text-accent transition-colors duration-300"
              >
                Portfolio
              </button>
              <button 
                onClick={() => scrollToSection('reviews')} 
                className="text-foreground hover:text-accent transition-colors duration-300"
              >
                Reviews
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="text-foreground hover:text-accent transition-colors duration-300"
              >
                Contact
              </button>
            </div>
            <div className="flex items-center space-x-4">
              {showAdminButton && isAuthenticated && (
                <>
                  <button 
                    onClick={() => setIsAdminOpen(true)}
                    className="bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors duration-300"
                  >
                    <i className="fas fa-cog mr-2"></i>Admin
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:bg-destructive/90 transition-colors duration-300"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>Logout
                  </button>
                </>
              )}
              {showAdminButton && !isAuthenticated && (
                <button 
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-300"
                >
                  <i className="fas fa-sign-in-alt mr-2"></i>Login
                </button>
              )}
              <button className="md:hidden text-foreground">
                <i className="fas fa-bars text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0" 
            onClick={() => setIsLoginOpen(false)}
          ></div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full relative z-10">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary">تسجيل الدخول</h2>
              <button 
                onClick={() => setIsLoginOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleLogin} className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">اسم المستخدم</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    disabled={isLoginPending}
                  />
                </div>
                <div>
                  <Label htmlFor="password">كلمة المرور</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="admin123"
                    disabled={isLoginPending}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoginPending}
                >
                  {isLoginPending ? "جاري تسجيل الدخول..." : "دخول"}
                </Button>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  اسم المستخدم: admin | كلمة المرور: admin123
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Dashboard Modal */}
      {isAdminOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0" 
            onClick={() => setIsAdminOpen(false)}
          ></div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden relative z-10">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary">لوحة التحكم</h2>
              <button 
                onClick={() => setIsAdminOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">إدارة الشهادات</h3>
                  <p className="text-blue-600 dark:text-blue-300 mb-4">إضافة وإدارة شهاداتك المهنية</p>
                  <Button className="w-full">إدارة الشهادات</Button>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4">إدارة المراجعات</h3>
                  <p className="text-green-600 dark:text-green-300 mb-4">مراجعة وموافقة على التقييمات</p>
                  <Button className="w-full">إدارة المراجعات</Button>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-4">رسائل التواصل</h3>
                  <p className="text-purple-600 dark:text-purple-300 mb-4">عرض والرد على رسائل العملاء</p>
                  <Button className="w-full">عرض الرسائل</Button>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-4">إدارة المشاريع</h3>
                  <p className="text-orange-600 dark:text-orange-300 mb-4">إضافة وتحديث مشاريعك</p>
                  <Button className="w-full">إدارة المشاريع</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
