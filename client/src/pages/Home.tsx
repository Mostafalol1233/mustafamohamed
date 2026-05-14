import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import SkillsSection from "@/components/SkillsSection";
import PortfolioSection from "@/components/PortfolioSection";
import ReviewsSection from "@/components/ReviewsSection";
import ContactSection from "@/components/ContactSection";
import EnhancedAdminDashboard from "@/components/EnhancedAdminDashboard";
import DragonCanvas from "@/components/DragonCanvas";
import { ArrowUp, Mail } from "lucide-react";
import { SiGithub, SiLinkedin, SiX, SiYoutube } from "react-icons/si";

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
        <DragonCanvas />
        <SkillsSection />
        <PortfolioSection />
        <ReviewsSection />
        <ContactSection />
      </main>

      <footer className="border-t border-border bg-white">
        <div className="container-max px-6">
          {/* Row 1 */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-foreground rounded-md flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-semibold text-sm text-foreground">Mustafa Mohamed</span>
            </div>
            <nav className="flex items-center gap-6">
              {["home", "skills", "portfolio", "reviews", "contact"].map((id) => (
                <button
                  key={id}
                  onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors capitalize"
                  data-testid={`footer-link-${id}`}
                >
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Row 2 */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-5">
            <p className="text-xs text-muted-foreground">
              © 2025 Mustafa Mohamed. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              {[
                { Icon: Mail, label: "Email", href: "mailto:overthegardenwall317@gmail.com" },
                { Icon: SiGithub, label: "GitHub", href: "https://github.com/Bemora" },
                { Icon: SiLinkedin, label: "LinkedIn", href: "https://linkedin.com/in/mustafa-bemo" },
                { Icon: SiX, label: "X", href: "https://x.com/Bemora_BEMO" },
                { Icon: SiYoutube, label: "YouTube", href: "https://youtube.com/@Bemora-site" },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                  data-testid={`footer-social-${label.toLowerCase()}`}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <EnhancedAdminDashboard />
      <BackToTop />
    </div>
  );
}
