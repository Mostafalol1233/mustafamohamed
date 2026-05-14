import { useState, useEffect } from "react";
import { Menu, X, Settings, Moon, Sun, Globe } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useLang } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";

export default function Navigation({ showAdminButton = false }: { showAdminButton?: boolean }) {
  const { isDark, toggle: toggleTheme } = useTheme();
  const { lang, setLang, t } = useLang();
  const [, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  const navLinks = [
    { label: t.nav.home, id: "home" },
    { label: t.nav.skills, id: "skills" },
    { label: t.nav.portfolio, id: "portfolio" },
    { label: t.nav.blog, id: "blog" },
    { label: t.nav.reviews, id: "reviews" },
    { label: t.nav.contact, id: "contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    navLinks.forEach(({ id }) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [lang]);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const switchLang = () => {
    const scrollY = window.scrollY;
    const next = lang === "en" ? "ar" : "en";
    setLang(next);
    const base = next === "ar" ? "/ar" : "/";
    // Use replaceState to update URL without triggering scroll-to-top
    window.history.replaceState(null, "", base);
    // Restore scroll position after React re-renders
    requestAnimationFrame(() => {
      requestAnimationFrame(() => window.scrollTo(0, scrollY));
    });
  };

  const navBg = scrolled
    ? isDark ? "bg-gray-950/95 backdrop-blur-md border-b border-gray-800 shadow-sm" : "bg-white/95 backdrop-blur-md border-b border-border shadow-sm"
    : "bg-transparent";

  const iconBtn = `flex items-center justify-center w-8 h-8 rounded-md border transition-all duration-200 ${
    isDark ? "border-gray-700 text-gray-400 hover:text-gray-100 hover:border-gray-500" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
  }`;

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${navBg}`}>
        <div className="container-max px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button onClick={() => go("home")} className="flex items-center gap-3 group" data-testid="nav-logo">
              <div className="w-7 h-7 bg-foreground rounded-md flex items-center justify-center">
                <span className="text-background font-bold text-sm leading-none">M</span>
              </div>
              <span className="font-semibold text-sm text-foreground tracking-tight">Mustafa Mohamed</span>
              <span className="hidden sm:block text-border">|</span>
              <span className="hidden sm:block text-xs text-muted-foreground">Developer</span>
            </button>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map(({ label, id }) => (
                <button key={id} onClick={() => go(id)} data-testid={`nav-${id}`}
                  className={`px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${
                    active === id
                      ? "text-foreground font-medium bg-secondary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}>
                  {label}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5">
              {/* Social links - desktop */}
              <div className="hidden md:flex items-center gap-1 mr-1">
                {[
                  { href: "https://x.com/Bemora_BEMO", icon: "ti-brand-x", label: "Twitter" },
                  { href: "https://youtube.com/@Bemora-site", icon: "ti-brand-youtube", label: "YouTube" },
                  { href: "mailto:overthegardenwall317@gmail.com", icon: "ti-mail", label: "Email" },
                ].map(({ href, icon, label }) => (
                  <a key={label} href={href} target={href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer"
                    aria-label={label}
                    className={iconBtn}
                    style={{ width: 34, height: 34, borderRadius: "50%" }}>
                    <i className={`ti ${icon}`} style={{ fontSize: 15 }} />
                  </a>
                ))}
              </div>

              {/* Language switcher */}
              <button onClick={switchLang} className={iconBtn} title={lang === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"} data-testid="nav-lang">
                <Globe className="w-4 h-4" />
              </button>

              {/* Dark mode toggle */}
              <button onClick={toggleTheme} className={iconBtn} title={isDark ? "Light mode" : "Dark mode"} data-testid="nav-theme">
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Admin link */}
              {showAdminButton && (
                <a href="/admin" className={`hidden md:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md border border-border hover:border-foreground/20 transition-all`}>
                  <Settings className="w-3.5 h-3.5" /> {t.nav.admin}
                </a>
              )}

              <button onClick={() => setMobileOpen(o => !o)} className={`md:hidden p-2 rounded-md transition-all ${isDark ? "text-gray-400 hover:text-gray-100" : "text-muted-foreground hover:text-foreground"}`} data-testid="nav-mobile-toggle">
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-64 border-l shadow-xl transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full"} ${isDark ? "bg-gray-950 border-gray-800" : "bg-white border-border"}`}>
          <div className={`flex items-center justify-between p-4 border-b ${isDark ? "border-gray-800" : "border-border"}`}>
            <span className="font-semibold text-sm text-foreground">Menu</span>
            <div className="flex items-center gap-2">
              <button onClick={toggleTheme} className={iconBtn}>
                {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
              <button onClick={switchLang} className={iconBtn}>
                <Globe className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-3 space-y-1">
            {navLinks.map(({ label, id }) => (
              <button key={id} onClick={() => go(id)} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${active === id ? "bg-secondary text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
