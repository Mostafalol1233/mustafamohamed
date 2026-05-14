import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import SkillsSection from "@/components/SkillsSection";
import PortfolioSection from "@/components/PortfolioSection";
import ReviewsSection from "@/components/ReviewsSection";
import ContactSection from "@/components/ContactSection";
import BlogSection from "@/components/BlogSection";
import { ArrowUp } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg hover:opacity-80 transition-all duration-300 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`}
      data-testid="button-back-to-top">
      <ArrowUp className="w-4 h-4" />
    </button>
  );
}

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="h-16 bg-card border-b border-border" />
      <div className="container-max px-6 pt-32 pb-20">
        <div className="skeleton h-4 w-32 rounded-full mb-8" />
        <div className="skeleton h-16 w-96 mb-4 rounded-lg" />
        <div className="skeleton h-16 w-72 mb-6 rounded-lg" />
        <div className="skeleton h-5 w-[500px] mb-2 rounded" />
        <div className="skeleton h-5 w-80 mb-8 rounded" />
        <div className="flex gap-3">
          <div className="skeleton h-10 w-36 rounded-lg" />
          <div className="skeleton h-10 w-32 rounded-lg" />
          <div className="skeleton h-10 w-40 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const { isRtl } = useLang();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Brief skeleton then reveal
    const t = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);

  if (!loaded) return <PageSkeleton />;

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <Navigation />
      <main>
        <HeroSection />
        <SkillsSection />
        <PortfolioSection />
        <BlogSection />
        <ReviewsSection />
        <ContactSection />
      </main>

      <footer className="border-t border-border bg-card">
        <div className="container-max px-6">
          <div className="grid grid-cols-3 items-center py-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-foreground rounded-md flex items-center justify-center flex-shrink-0">
                <span className="text-background font-bold text-sm">M</span>
              </div>
              <span className="font-semibold text-sm text-foreground hidden sm:inline">Mustafa Mohamed</span>
            </div>
            <nav className="flex items-center justify-center gap-4 flex-wrap">
              {["home", "skills", "portfolio", "blog", "reviews", "contact"].map(id => (
                <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors capitalize" data-testid={`footer-link-${id}`}>
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </button>
              ))}
            </nav>
            <div className="flex items-center justify-end gap-2">
              {[
                { href: "https://x.com/Bemora_BEMO", icon: "ti-brand-x", label: "Twitter" },
                { href: "https://youtube.com/@Bemora-site", icon: "ti-brand-youtube", label: "YouTube" },
                { href: "mailto:overthegardenwall317@gmail.com", icon: "ti-mail", label: "Email" },
              ].map(({ href, icon, label }) => (
                <a key={label} href={href} target={href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer" aria-label={label} data-testid={`footer-social-${label.toLowerCase()}`}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", border: "0.5px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))", textDecoration: "none", transition: "all 200ms", flexShrink: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.color = "hsl(var(--primary))"; e.currentTarget.style.borderColor = "hsl(var(--primary))"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "hsl(var(--muted-foreground))"; e.currentTarget.style.borderColor = "hsl(var(--border))"; }}>
                  <i className={`ti ${icon}`} style={{ fontSize: 17 }} />
                </a>
              ))}
            </div>
          </div>
          <div className="border-t border-border" />
          <div className="py-5 text-center">
            <p className="text-xs text-muted-foreground">© 2025 Mustafa Mohamed. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
}
