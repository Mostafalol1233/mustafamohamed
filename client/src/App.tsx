import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useKeyboard } from "@/hooks/useKeyboard";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import NotificationBanner from "@/components/NotificationBanner";
import { Analytics } from "@vercel/analytics/react";
import { useState } from "react";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  useKeyboard({ 
    onAdminShortcut: () => setShowAdminLogin(true) 
  });

  return (
    <>
      <Switch>
        <Route path="/" component={isLoading || !isAuthenticated ? Landing : Home} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
      
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0" onClick={() => setShowAdminLogin(false)}></div>
          <div className="relative z-10">
            <AdminLogin />
          </div>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <NotificationBanner />
        <Toaster />
        <Router />
        <Analytics />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
