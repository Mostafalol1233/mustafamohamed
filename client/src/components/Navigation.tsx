import { useState, useEffect } from "react";
import { Menu, X, Settings, Moon, Sun, Monitor, Globe } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useLang } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function Navigation({ showAdminButton = false }: { showAdminButton?: boolean }) {
  const { isDark, mode: themeMode, toggle: toggleTheme } = useTheme();
  const { lang, setLang, t } = useLang();
  const [, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  const { data: settings = [] } = useQuery<{ key: string; value: string }[]>({
    queryKey: ["sb-site-settings"],
    queryFn: () => import("@/lib/supabase").then(m => m.fetchSiteSettings()),
    staleTime: 60_000,
  });
  const logoImageUrl = settings.find(s => s.key === "logo_image_url")?.value;
  const siteName = settings.find(s => s.key === "site_name")?.value || "mmohamed";

  const navLinks = [
    { label: t.nav.home, id: "home" },
    { label: t.nav.skills, id: "skills" },
    { label: t.nav.portfolio, id: "portfolio" },
    { label: (t.nav as any).stack || "Stack", id: "reviews" },
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
    window.history.replaceState(null, "", base);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => window.scrollTo(0, scrollY));
    });
  };

  const navBg = scrolled
    ? isDark
      ? "bg-[#0d1117]/95 backdrop-blur-md border-b border-[#21262d]"
      : "bg-white/95 backdrop-blur-md border-b border-border"
    : "bg-transparent";

  const utilBtn = `flex items-center justify-center w-8 h-8 transition-all duration-200 rounded-md ${
    isDark
      ? "text-[#8b949e] hover:text-[#e6edf3]"
      : "text-muted-foreground hover:text-foreground"
  }`;

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${navBg}`}>
        <div className="container-max px-6">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <button
              onClick={() => go("home")}
              className="flex items-center gap-2 group"
              data-testid="nav-logo"
            >
              <div className="w-7 h-7 bg-foreground rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
                {logoImageUrl ? (
                  <img src={logoImageUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-background font-bold text-sm leading-none">M</span>
                )}
              </div>
              <span
                className="font-semibold text-sm tracking-tight"
                style={{
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  color: isDark ? "#e6edf3" : "hsl(var(--foreground))",
                }}
              >
                {siteName}
                <span style={{ color: "hsl(var(--primary))" }}> ~/</span>
              </span>
            </button>

            {/* ── Desktop nav links ── */}
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map(({ label, id }) => {
                const isActive = active === id;
                return (
                  <button
                    key={id}
                    onClick={() => go(id)}
                    data-testid={`nav-${id}`}
                    className="relative px-3 py-1.5 text-sm transition-all duration-200 group"
                    style={{
                      fontFamily: isActive ? "'JetBrains Mono', 'Fira Code', monospace" : "inherit",
                      color: isActive
                        ? "hsl(var(--primary))"
                        : isDark ? "#8b949e" : "hsl(var(--muted-foreground))",
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {isActive ? (
                      <span>
                        <span style={{ opacity: 0.6 }}>[</span>
                        {label}
                        <span style={{ opacity: 0.6 }}>]</span>
                      </span>
                    ) : (
                      <span className="group-hover:text-foreground transition-colors">{label}</span>
                    )}
                    {/* active underline */}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-3 right-3 h-px"
                        style={{ background: "hsl(var(--primary))", opacity: 0.6 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── Right controls: utility only ── */}
            <div className="flex items-center gap-1">
              {/* Language */}
              <button
                onClick={switchLang}
                className={utilBtn}
                title={lang === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}
                data-testid="nav-lang"
              >
                <Globe className="w-4 h-4" />
              </button>

              {/* Theme cycle: light → dark → system */}
              <button
                onClick={toggleTheme}
                className={utilBtn}
                title={themeMode === "light" ? "Switch to dark" : themeMode === "dark" ? "Follow system" : "Switch to light"}
                data-testid="nav-theme"
              >
                {themeMode === "light"  && <Moon className="w-4 h-4" />}
                {themeMode === "dark"   && <Sun className="w-4 h-4" />}
                {themeMode === "system" && <Monitor className="w-4 h-4" />}
              </button>

              {/* Admin */}
              {showAdminButton && (
                <a
                  href="/admin"
                  className={`hidden md:flex items-center gap-1.5 text-xs px-3 py-1.5 ml-1 rounded-md border border-border transition-all ${
                    isDark ? "text-[#8b949e] hover:text-[#e6edf3] hover:border-[#484f58]" : "text-muted-foreground hover:text-foreground hover:border-foreground/20"
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" /> {t.nav.admin}
                </a>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(o => !o)}
                className={`md:hidden p-2 rounded-md transition-all ${utilBtn}`}
                data-testid="nav-mobile-toggle"
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
        <div
          className={`absolute top-0 right-0 h-full w-64 border-l shadow-xl transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
          style={{ background: isDark ? "#0d1117" : "#fff", borderColor: isDark ? "#21262d" : "hsl(var(--border))" }}
        >
          <div className="flex items-center justify-between p-4" style={{ borderBottom: `1px solid ${isDark ? "#21262d" : "hsl(var(--border))"}` }}>
            <span
              className="text-sm font-semibold"
              style={{ fontFamily: "monospace", color: isDark ? "#e6edf3" : "hsl(var(--foreground))" }}
            >
              mmohamed <span style={{ color: "hsl(var(--primary))" }}>~/</span>
            </span>
            <div className="flex items-center gap-2">
              <button onClick={toggleTheme} className={utilBtn}>
                {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
              <button onClick={switchLang} className={utilBtn}>
                <Globe className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setMobileOpen(false)} className={utilBtn}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-3 space-y-0.5">
            {navLinks.map(({ label, id }) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  onClick={() => go(id)}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all"
                  style={{
                    fontFamily: isActive ? "monospace" : "inherit",
                    color: isActive
                      ? "hsl(var(--primary))"
                      : isDark ? "#8b949e" : "hsl(var(--muted-foreground))",
                    background: isActive ? (isDark ? "#161b22" : "hsl(var(--secondary))") : "transparent",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {isActive ? `[${label}]` : label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
