import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import SkillsSection from "@/components/SkillsSection";
import CertificationsSection from "@/components/CertificationsSection";
import PortfolioSection from "@/components/PortfolioSection";
import ReviewsSection from "@/components/ReviewsSection";
import ContactSection from "@/components/ContactSection";
import { Code2, Twitter, Youtube, Mail, Link2, ArrowUp } from "lucide-react";

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/40 hover:bg-primary/90 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      data-testid="button-back-to-top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation showAdminButton={false} />

      <main>
        <HeroSection />
        <SkillsSection />
        <PortfolioSection />
        <CertificationsSection />
        <ReviewsSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container-max">
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-primary" />
                </div>
                <span className="font-bold text-xl">
                  <span className="gradient-text">Mustafa</span>
                  <span className="text-muted-foreground font-normal text-sm ml-1">dev</span>
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Full-Stack Developer & Content Strategist building high-performance digital experiences.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Navigate</h4>
              <div className="grid grid-cols-2 gap-2">
                {["home", "skills", "portfolio", "certifications", "reviews", "contact"].map((id) => (
                  <button
                    key={id}
                    onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                    className="text-left text-muted-foreground hover:text-primary transition-colors text-sm capitalize"
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Connect</h4>
              <div className="flex gap-3">
                {[
                  { icon: Twitter, href: "https://x.com/Bemora_BEMO", label: "Twitter" },
                  { icon: Youtube, href: "https://youtube.com/@Bemora-site", label: "YouTube" },
                  { icon: Mail, href: "mailto:overthegardenwall317@gmail.com", label: "Email" },
                  { icon: Link2, href: "https://linktr.ee/Mustafa_Bemo", label: "Linktree" },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
                    aria-label={label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
              <p className="text-muted-foreground text-xs mt-4 leading-relaxed">
                Available for freelance projects and full-time opportunities.
              </p>
            </div>
          </div>

          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>© 2025 Mustafa Mohamed. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with <span className="text-primary">♥</span> using React, TypeScript & Tailwind
            </p>
          </div>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
}
