import { Switch, Route, useLocation } from "wouter";
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
import { useEffect, useState } from "react";

// Prevent browser from restoring scroll position automatically
if (typeof window !== "undefined") {
  history.scrollRestoration = "manual";
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  useKeyboard({ 
    onAdminShortcut: () => setShowAdminLogin(true) 
  });

  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={isAuthenticated ? Home : Landing} />
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
