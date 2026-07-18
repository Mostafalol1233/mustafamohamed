import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import SkillsSection from "@/components/SkillsSection";
import PortfolioSection from "@/components/PortfolioSection";
import ReviewsSection from "@/components/ReviewsSection";
import ContactSection from "@/components/ContactSection";
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

export default function Landing() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation showAdminButton={false} />
      <main>
        <HeroSection />
        <SkillsSection />
        <PortfolioSection />
        <ReviewsSection />
        <ContactSection />
      </main>

      <footer className="border-t border-border bg-white">
        <div className="container-max px-6">
          {/* Row 1: logo | nav | socials */}
          <div className="grid grid-cols-3 items-center py-6 gap-4">
            {/* Left: logo + name */}
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-foreground rounded-md flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-semibold text-sm text-foreground hidden sm:inline">Mustafa Mohamed</span>
            </div>

            {/* Center: nav links */}
            <nav className="flex items-center justify-center gap-5 flex-wrap">
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

            {/* Right: social icons */}
            <div className="flex items-center justify-end gap-2">
              <a
                href="https://x.com/Bemora_BEMO"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                data-testid="footer-social-twitter"
                style={{ display:"flex", alignItems:"center", justifyContent:"center", width:36, height:36, borderRadius:"50%", border:"0.5px solid #e5e5e5", color:"#888", textDecoration:"none", transition:"color 200ms, border-color 200ms", flexShrink:0 }}
                onMouseEnter={(e) => { e.currentTarget.style.color="#3b82f6"; e.currentTarget.style.borderColor="#3b82f6"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color="#888"; e.currentTarget.style.borderColor="#e5e5e5"; }}
              >
                <i className="ti ti-brand-x" style={{ fontSize:17 }} />
              </a>
              <a
                href="https://youtube.com/@Bemora-site"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                data-testid="footer-social-youtube"
                style={{ display:"flex", alignItems:"center", justifyContent:"center", width:36, height:36, borderRadius:"50%", border:"0.5px solid #e5e5e5", color:"#888", textDecoration:"none", transition:"color 200ms, border-color 200ms", flexShrink:0 }}
                onMouseEnter={(e) => { e.currentTarget.style.color="#3b82f6"; e.currentTarget.style.borderColor="#3b82f6"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color="#888"; e.currentTarget.style.borderColor="#e5e5e5"; }}
              >
                <i className="ti ti-brand-youtube" style={{ fontSize:17 }} />
              </a>
              <a
                href="mailto:contact@crossfire.wiki"
                aria-label="Email"
                data-testid="footer-social-email"
                style={{ display:"flex", alignItems:"center", justifyContent:"center", width:36, height:36, borderRadius:"50%", border:"0.5px solid #e5e5e5", color:"#888", textDecoration:"none", transition:"color 200ms, border-color 200ms", flexShrink:0 }}
                onMouseEnter={(e) => { e.currentTarget.style.color="#3b82f6"; e.currentTarget.style.borderColor="#3b82f6"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color="#888"; e.currentTarget.style.borderColor="#e5e5e5"; }}
              >
                <i className="ti ti-mail" style={{ fontSize:17 }} />
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Row 2: centered copyright */}
          <div className="py-5 text-center">
            <p className="text-xs text-muted-foreground">
              © 2025 Mustafa Mohamed. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
}
