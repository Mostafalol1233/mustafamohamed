import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Download } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

const ROLES_EN = ["Full-Stack Developer", "Game Developer", "Bot & Automation Engineer", "Software Engineer"];
const ROLES_AR = ["مطور ويب متكامل", "مطور ألعاب", "مهندس أتمتة وبوتات", "مهندس برمجيات"];

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


function QuoteCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
      className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 w-80 flex-col"
      style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: "16px", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.35)" }}
    >
      <div style={{ height: "3px", background: "linear-gradient(90deg, #58a6ff 0%, #bc8cff 50%, #3fb950 100%)" }} />

      <div className="p-6 flex flex-col gap-5">
        <div style={{ borderLeft: "2px solid #30363d", paddingLeft: "14px" }}>
          <p style={{ color: "#c9d1d9", fontSize: "13.5px", lineHeight: "1.8", fontWeight: 400, letterSpacing: "0.01em" }}>
            The difference between the novice and the master is that the master has failed more times than the novice has tried.
          </p>
        </div>

        <div style={{ borderTop: "1px solid #161b22", paddingTop: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#161b22", border: "1px solid #30363d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
            🎯
          </div>
          <div>
            <p style={{ color: "#58a6ff", fontSize: "12px", fontWeight: 600, letterSpacing: "0.03em" }}>Korosensei</p>
            <p style={{ color: "#484f58", fontSize: "11px", marginTop: "2px", fontStyle: "italic" }}>Assassination Classroom</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  const { lang, t } = useLang();
  const roles = lang === "ar" ? ROLES_AR : ROLES_EN;
  const role = useTypewriter(roles);

  const stats = [
    { value: "4+",  label: t.hero.stats.years },
    { value: "15+", label: t.hero.stats.projects },
    { value: "6+",  label: t.hero.stats.certs },
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
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-xs text-muted-foreground mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot" />
            {t.hero.available}
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
              ? "أبني تطبيقات ويب كاملة، ألعاب، وبوتات أتمتة. من قواعد البيانات إلى واجهة المستخدم — أهتم بالإنجاز الحقيقي."
              : "I build web apps, games, and automation bots. Full-stack to game loops to scrapers — I ship real, complete software across the stack."}
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
            <a href="/api/resume" target="_blank" rel="noopener noreferrer"
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
        </div>
      </div>

      <QuoteCard />
    </section>
  );
}
