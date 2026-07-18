import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Download } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { getDailyWisdom } from "@/data/wisdomQuotes";

const ROLES_EN = ["Full-Stack Developer", "Game Developer", "Bot & Automation Engineer", "Software Engineer"];
const ROLES_AR = ["مطور ويب متكامل", "مطور ألعاب", "مهندس أتمتة وبوتات", "مهندس برمجيات"];

function useTypewriter(words: string[], speed = 75, pause = 2000) {
  const [display, setDisplay] = useState(() => words[0] ?? "");
  const [wi, setWi] = useState(0);
  const [ci, setCi] = useState(() => words[0]?.length ?? 0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    setWi(0); setCi(words[0]?.length ?? 0); setDel(false); setDisplay(words[0] ?? "");
  }, [words]);

  useEffect(() => {
    const w = words[wi];
    if (!w) return;
    let t: ReturnType<typeof setTimeout>;
    if (!del && ci < w.length) t = setTimeout(() => setCi(c => c + 1), speed);
    else if (!del && ci === w.length) t = setTimeout(() => setDel(true), pause);
    else if (del && ci > 0) t = setTimeout(() => setCi(c => c - 1), speed / 2);
    else { setDel(false); setWi(i => (i + 1) % words.length); }
    setDisplay(w.slice(0, ci));
    return () => clearTimeout(t);
  }, [ci, del, wi, words, speed, pause]);
  return display;
}

function QuoteCard({ mobile = false }: { mobile?: boolean }) {
  const { lang } = useLang();
  const quote = getDailyWisdom();
  const displayQuote = lang === "ar" && quote.quote_ar ? quote.quote_ar : quote.quote;

  return (
    <motion.div
      initial={{ opacity: 0, x: mobile ? 0 : 40, y: mobile ? 10 : 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.7, delay: mobile ? 0.65 : 0.4 }}
      className={mobile
        ? "flex flex-col w-full lg:hidden mt-8"
        : "hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 w-[340px] flex-col"
      }
      style={{
        background: "hsl(222 42% 10%)",
        border: "1px solid hsl(222 28% 19%)",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px hsl(222 28% 14%)",
      }}
    >
      {/* macOS-style title bar */}
      <div
        className="flex items-center gap-2 px-4"
        style={{
          height: "38px",
          background: "hsl(222 42% 12%)",
          borderBottom: "1px solid hsl(222 28% 17%)",
        }}
      >
        <div className="flex items-center gap-1.5">
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
        </div>
        <div
          className="flex items-center gap-1.5 ml-3 px-3 py-1 rounded-md"
          style={{ background: "hsl(222 36% 15%)", border: "1px solid hsl(222 28% 20%)" }}
        >
          <span style={{ fontSize: "10px", color: "hsl(211 90% 65%)" }}>✦</span>
          <span style={{ fontSize: "11px", color: "hsl(215 18% 62%)", fontFamily: "system-ui, sans-serif", letterSpacing: "0.02em" }}>
            thought of the day
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-4">
        <div className="flex gap-2 items-start">
          <span style={{ fontSize: "28px", lineHeight: 1, color: "hsl(211 90% 60%)", fontFamily: "Georgia, serif", marginTop: "-2px", opacity: 0.9 }}>"</span>
          <p
            style={{
              color: "hsl(213 40% 86%)",
              fontSize: "12.5px",
              lineHeight: "1.9",
              fontFamily: lang === "ar" ? "system-ui, sans-serif" : "'JetBrains Mono', 'Fira Code', monospace",
              letterSpacing: "0.01em",
              flex: 1,
              direction: lang === "ar" ? "rtl" : "ltr",
            }}
          >
            {displayQuote}
          </p>
          <span style={{ fontSize: "28px", lineHeight: 1, color: "hsl(211 90% 60%)", fontFamily: "Georgia, serif", marginTop: "auto", opacity: 0.9, alignSelf: "flex-end" }}>"</span>
        </div>

        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: "1px solid hsl(222 28% 17%)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              style={{
                width: "32px", height: "32px", borderRadius: "8px",
                background: "hsl(211 90% 60% / 0.12)",
                border: "1px solid hsl(211 90% 60% / 0.25)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="hsl(211 90% 65%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
              </svg>
            </div>
            <div>
              <p style={{ color: "hsl(211 90% 65%)", fontSize: "11.5px", fontWeight: 600, fontFamily: "monospace" }}>
                — {quote.author}
              </p>
            </div>
          </div>
          <span
            style={{
              fontSize: "10px",
              color: "hsl(215 18% 40%)",
              fontFamily: "monospace",
              background: "hsl(222 36% 15%)",
              padding: "2px 8px",
              borderRadius: "4px",
              border: "1px solid hsl(222 28% 20%)",
            }}
          >
            quote of the day
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  const { lang, t } = useLang();
  const roles = lang === "ar" ? ROLES_AR : ROLES_EN;
  const role = useTypewriter(roles);

  const { data: settings = [] } = useQuery<{ key: string; value: string }[]>({
    queryKey: ["sb-site-settings"],
    queryFn: () => import("@/lib/supabase").then(m => m.fetchSiteSettings()),
    staleTime: 60_000,
  });

  const isAvailable = settings.find(s => s.key === "available_for_projects")?.value !== "false";

  const stats = [
    { value: "4+",  label: t.hero.stats.years },
    { value: "15+", label: t.hero.stats.projects },
    { value: "94+", label: lang === "ar" ? "واجهة API مدمجة" : "APIs Integrated" },
  ];

  const techStack = ["React", "TypeScript", "Python", "C++", "Node.js", "Ruby", "Godot"];

  return (
    <section id="home" className="min-h-screen flex items-center pt-16 section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 0%, black 40%, transparent 100%)"
        }}
      />

      <div className="container-max w-full relative z-10">
        <div className="max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="flex flex-wrap items-center gap-2 mb-8">
            {isAvailable && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-xs text-muted-foreground shadow-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot" />
                {t.hero.available}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-xs text-muted-foreground shadow-sm">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {lang === "ar" ? "القاهرة، مصر · متاح للعمل عن بُعد" : "Cairo, Egypt · Remote-friendly"}
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
            className="text-5xl md:text-7xl font-bold text-foreground tracking-tight leading-[1.05] mb-4">
            Mustafa<br /><span style={{ color: "hsl(234 89% 57%)" }}>Mohamed</span>
          </motion.h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground font-medium mb-6 h-8 flex items-center gap-1">
            <span>{role}</span>
            <span className="animate-blink text-primary font-light">|</span>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
            className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
            {lang === "ar"
              ? "مطور ويب متكامل متخصص في تطبيقات الإنتاج وأدوات المطورين. من منصات التجارة الإلكترونية إلى مكتبات npm — أحوّل الأفكار إلى برمجيات حقيقية تعمل بكفاءة."
              : "Full-stack developer specialized in JavaScript/TypeScript. I build fast, production-ready web apps and open-source tools."}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}
            className="flex flex-wrap gap-3 mb-12">
            <button onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-primary" data-testid="hero-view-work">
              {t.hero.cta_work} <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-outline" data-testid="hero-contact">
              <Mail className="w-4 h-4" /> {t.hero.cta_contact}
            </button>
            <a href={settings.find(s => s.key === "resume_url")?.value || "/resume"}
              target="_blank" rel="noopener noreferrer"
              className="btn-outline" data-testid="hero-resume">
              <Download className="w-4 h-4" /> {t.hero.cta_resume}
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex items-center gap-10 mb-10 flex-wrap">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span key={tech} className="tag">{tech}</span>
            ))}
          </motion.div>

          {/* Mobile quote card — shown below tech tags on small screens */}
          <QuoteCard mobile />
        </div>
      </div>

      {/* Desktop quote card — absolute positioned on right */}
      <QuoteCard />
    </section>
  );
}
