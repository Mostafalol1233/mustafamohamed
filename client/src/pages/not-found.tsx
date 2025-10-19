import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md mx-4 shadow-lg">
        <CardContent className="pt-8 pb-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-100 dark:bg-red-900 rounded-full">
              <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" data-testid="icon-error" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2" data-testid="text-error-code">
            404
          </h1>
          
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4" data-testid="text-error-title">
            الصفحة غير موجودة
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-6" data-testid="text-error-message">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
          </p>

          <Link href="/">
            <Button className="gap-2" size="lg" data-testid="button-home">
              <Home className="h-5 w-5" />
              العودة للصفحة الرئيسية
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
