import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Download } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

const ROLES_EN = ["Full-Stack Developer", "Content Strategist", "UI/UX Enthusiast", "Problem Solver"];
const ROLES_AR = ["مطور ويب متكامل", "استراتيجي محتوى", "مصمم واجهات", "حلّال مشكلات"];

function useTypewriter(words: string[], speed = 75, pause = 2000) {
  const [display, setDisplay] = useState("");
  const [wi, setWi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    setWi(0); setCi(0); setDel(false); setDisplay("");
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

export default function HeroSection() {
  const { lang, t, isRtl } = useLang();
  const roles = lang === "ar" ? ROLES_AR : ROLES_EN;
  const role = useTypewriter(roles);

  const stats = [
    { value: "4+",  label: t.hero.stats.years },
    { value: "12+", label: t.hero.stats.projects },
    { value: "6+",  label: t.hero.stats.certs },
  ];

  const techStack = ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS", "Python"];

  return (
    <section id="home" className="min-h-screen flex items-center pt-16 section-padding relative overflow-hidden">
      {/* Grid bg */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 0%, black 40%, transparent 100%)"
        }}
      />

      <div className="container-max w-full relative z-10">
        <div className="max-w-3xl">
          {/* Available badge */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-xs text-muted-foreground mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot" />
            {t.hero.available}
          </motion.div>

          {/* Name */}
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
            className="text-5xl md:text-7xl font-bold text-foreground tracking-tight leading-[1.05] mb-4">
            {isRtl ? <>مصطفى<br /><span style={{ color: "hsl(234 89% 57%)" }}>محمد</span></> : <>Mustafa<br /><span style={{ color: "hsl(234 89% 57%)" }}>Mohamed</span></>}
          </motion.h1>

          {/* Typewriter */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground font-medium mb-6 h-8 flex items-center gap-1">
            <span>{role}</span>
            <span className="animate-blink text-primary font-light">|</span>
          </motion.div>

          {/* Description */}
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
            className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
            {isRtl
              ? "أبني منتجات ويب من الألف للياء — من تصميم قاعدة البيانات لآخر بكسل في الواجهة. أهتم بالشحن والإنجاز أكثر من المظاهر."
              : "I build complete web products — database design to final pixel. React and Node.js are my daily tools. I care more about shipping than looking clever."}
          </motion.p>

          {/* CTAs */}
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
            <a href="/resume.html" target="_blank" rel="noopener noreferrer"
              className="btn-outline" data-testid="hero-resume">
              <Download className="w-4 h-4" /> {t.hero.cta_resume}
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex items-center gap-10 mb-10 flex-wrap">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </motion.div>

          {/* Tech stack */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-2">
            {techStack.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right side — Quote card */}
      <motion.div
        initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
        className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 w-80 flex-col"
        style={{
          background: "#0d1117",
          border: "1px solid #30363d",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
        }}
      >
        {/* Chrome bar */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid #21262d" }}>
          <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
          <span className="ml-2 text-xs select-none" style={{ color: "#8b949e", fontFamily: "monospace" }}>
            philosophy.md
          </span>
        </div>

        {/* Quote body */}
        <div className="p-6 flex flex-col gap-4">
          {/* Opening mark */}
          <span style={{ color: "#3fb950", fontSize: "38px", lineHeight: 1, fontFamily: "Georgia, serif", opacity: 0.6 }}>"</span>

          <p style={{
            color: "#e6edf3",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "14px",
            lineHeight: 1.75,
            fontStyle: "italic",
            marginTop: "-16px",
          }}>
            The difference between the novice and the master is that the master has failed more times than the novice has tried.
          </p>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #21262d", paddingTop: "14px" }}>
            <p style={{ color: "#8b949e", fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.04em" }}>
              — a reminder I keep close
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
