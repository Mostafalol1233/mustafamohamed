import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import BlogPostPage from "@/pages/BlogPost";
import ResumePage from "@/pages/Resume";
import NotificationBanner from "@/components/NotificationBanner";
import { LanguageProvider } from "@/contexts/LanguageContext";
import type { Lang } from "@/lib/i18n";
import { useEffect, useState } from "react";

if (typeof window !== "undefined") {
  history.scrollRestoration = "manual";
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location]);
  return null;
}

function detectLang(): Lang {
  if (typeof window === "undefined") return "en";
  if (window.location.pathname.startsWith("/ar")) return "ar";
  const stored = localStorage.getItem("portfolio-lang") as Lang | null;
  if (stored === "ar" || stored === "en") return stored;
  return "en";
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <NotificationBanner />
      <Switch>
        <Route path="/ar" component={Home} />
        <Route path="/ar/:rest*" component={Home} />
        <Route path="/" component={Home} />
        <Route path="/blog/:slug" component={BlogPostPage} />
        <Route path="/resume" component={ResumePage} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

export default function App() {
  const [initialLang] = useState<Lang>(detectLang);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider initialLang={initialLang}>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
