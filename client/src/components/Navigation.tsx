import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface NavigationProps {
  showAdminButton?: boolean;
}

export default function Navigation({ showAdminButton = true }: NavigationProps) {
  const { isAuthenticated } = useAuth();
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
                <button 
                  onClick={() => setIsAdminOpen(true)}
                  className="bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors duration-300"
                >
                  <i className="fas fa-cog mr-2"></i>Admin
                </button>
              )}
              {showAdminButton && !isAuthenticated && (
                <a 
                  href="/api/login"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-300"
                >
                  <i className="fas fa-sign-in-alt mr-2"></i>Login
                </a>
              )}
              <button className="md:hidden text-foreground">
                <i className="fas fa-bars text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Pass admin modal state to parent or handle globally */}
      {isAdminOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0" 
            onClick={() => setIsAdminOpen(false)}
          ></div>
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative z-10">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary">Admin Dashboard</h2>
              <button 
                onClick={() => setIsAdminOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Admin dashboard content will be implemented here.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
