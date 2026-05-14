import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X, Settings } from "lucide-react";

const navLinks = [
  { label: "Home", id: "home" },
  { label: "Skills", id: "skills" },
  { label: "Portfolio", id: "portfolio" },
  { label: "Reviews", id: "reviews" },
  { label: "Contact", id: "contact" },
];

export default function Navigation({ showAdminButton = true }: { showAdminButton?: boolean }) {
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

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
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"
      }`}>
        <div className="container-max px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo — Vercel style wordmark */}
            <button onClick={() => go("home")} className="flex items-center gap-3 group" data-testid="nav-logo">
              <div className="w-7 h-7 bg-foreground rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm leading-none">M</span>
              </div>
              <span className="font-semibold text-sm text-foreground tracking-tight">Mustafa Mohamed</span>
              <span className="hidden sm:block text-border">|</span>
              <span className="hidden sm:block text-xs text-muted-foreground">Developer</span>
            </button>

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-1">
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

            <div className="flex items-center gap-2">
              {showAdminButton && isAuthenticated && (
                <a href="/admin" className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md border border-border hover:border-foreground/20 transition-all">
                  <Settings className="w-3.5 h-3.5" /> Admin
                </a>
              )}
              <button onClick={() => setMobileOpen(o => !o)} className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all" data-testid="nav-mobile-toggle">
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-64 bg-white border-l border-border shadow-xl transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="font-semibold text-sm">Menu</span>
            <button onClick={() => setMobileOpen(false)} className="p-1 rounded text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
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
