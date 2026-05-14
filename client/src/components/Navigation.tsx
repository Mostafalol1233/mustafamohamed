import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X, Code2, Settings } from "lucide-react";

const navLinks = [
  { label: "Home", id: "home" },
  { label: "Skills", id: "skills" },
  { label: "Portfolio", id: "portfolio" },
  { label: "Certifications", id: "certifications" },
  { label: "Reviews", id: "reviews" },
  { label: "Contact", id: "contact" },
];

export default function Navigation() {
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    navLinks.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-xl shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="container-max">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <button
              onClick={() => scrollTo("home")}
              className="flex items-center gap-2.5 group"
              data-testid="nav-logo"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
                <Code2 className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-xl">
                <span className="gradient-text">Mustafa</span>
                <span className="text-muted-foreground font-normal text-sm ml-1">dev</span>
              </span>
            </button>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ label, id }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  data-testid={`nav-link-${id}`}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    activeSection === id
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {label}
                  {activeSection === id && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {isAuthenticated && (
                <a
                  href="/admin"
                  data-testid="nav-admin"
                  className="hidden md:flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300"
                >
                  <Settings className="w-4 h-4" />
                  Admin
                </a>
              )}
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:border-primary/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300"
                data-testid="nav-mobile-toggle"
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-card border-l border-border shadow-2xl transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-5 border-b border-border">
            <span className="font-bold text-lg gradient-text">Menu</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary/50 text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 space-y-1">
            {navLinks.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeSection === id
                    ? "bg-primary/15 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {label}
              </button>
            ))}
            {isAuthenticated && (
              <a
                href="/admin"
                className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 mt-2 border border-border"
              >
                <Settings className="w-4 h-4" />
                Admin Dashboard
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
