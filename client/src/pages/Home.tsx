import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import SkillsSection from "@/components/SkillsSection";
import PortfolioSection from "@/components/PortfolioSection";
import ReviewsSection from "@/components/ReviewsSection";
import ContactSection from "@/components/ContactSection";
import EnhancedAdminDashboard from "@/components/EnhancedAdminDashboard";
import { ArrowUp } from "lucide-react";

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-foreground text-white flex items-center justify-center shadow-lg hover:bg-foreground/80 transition-all duration-300 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`}
      data-testid="button-back-to-top">
      <ArrowUp className="w-4 h-4" />
    </button>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <HeroSection />
        <SkillsSection />
        <PortfolioSection />
        <ReviewsSection />
        <ContactSection />
      </main>

      <footer className="border-t border-border py-10 px-6 bg-white">
        <div className="container-max">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-foreground rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-semibold text-sm text-foreground">Mustafa Mohamed</span>
            </div>
            <div className="flex items-center gap-5">
              {["home", "skills", "portfolio", "reviews", "contact"].map(id => (
                <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors capitalize">
                  {id}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              {[
                { label: "X", href: "https://x.com/Bemora_BEMO" },
                { label: "YT", href: "https://youtube.com/@Bemora-site" },
                { label: "Email", href: "mailto:overthegardenwall317@gmail.com" },
              ].map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all">
                  {label}
                </a>
              ))}
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
            © 2025 Mustafa Mohamed. Built with React, TypeScript & Tailwind CSS.
          </div>
        </div>
      </footer>

      <EnhancedAdminDashboard />
      <BackToTop />
    </div>
  );
}
