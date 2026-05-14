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
    { value: "4+", label: t.hero.stats.years },
    { value: "12+", label: t.hero.stats.projects },
    { value: "6+", label: t.hero.stats.certs },
    { value: "∞", label: t.hero.stats.coffee },
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
              ? "أبني تطبيقات ويب سريعة وأنيقة وأصمّم محتوى يحقق نتائج. هندسة دقيقة تلتقي باستراتيجية إبداعية — في كل مشروع."
              : "I build fast, elegant web apps and craft content that converts. Precision engineering meets creative strategy — every project, every time."}
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
            <a href="/api/resume" target="_blank" rel="noopener noreferrer"
              className="btn-outline" data-testid="hero-resume">
              <Download className="w-4 h-4" /> {t.hero.cta_resume}
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex items-center gap-8 mb-10 flex-wrap">
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

      {/* Right side code block */}
      <motion.div
        initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
        className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 w-80 bg-[#0d1117] rounded-xl shadow-2xl overflow-hidden border border-[#30363d] text-[13px] font-mono"
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#21262d]">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-[#8b949e] text-xs">mustafa.ts</span>
        </div>
        <div className="p-4 leading-relaxed">
          <div><span className="text-[#ff7b72]">const</span> <span className="text-[#79c0ff]">developer</span> <span className="text-white">=</span> <span className="text-[#ff7b72]">{`{`}</span></div>
          <div className="pl-4"><span className="text-[#79c0ff]">name</span><span className="text-white">:</span> <span className="text-[#a5d6ff]">"Mustafa Mohamed"</span><span className="text-white">,</span></div>
          <div className="pl-4"><span className="text-[#79c0ff]">role</span><span className="text-white">:</span> <span className="text-[#a5d6ff]">"Full-Stack Dev"</span><span className="text-white">,</span></div>
          <div className="pl-4"><span className="text-[#79c0ff]">stack</span><span className="text-white">: [</span></div>
          <div className="pl-8"><span className="text-[#a5d6ff]">"React"</span><span className="text-white">,</span> <span className="text-[#a5d6ff]">"Node.js"</span><span className="text-white">,</span></div>
          <div className="pl-8"><span className="text-[#a5d6ff]">"TypeScript"</span><span className="text-white">,</span> <span className="text-[#a5d6ff]">"PostgreSQL"</span></div>
          <div className="pl-4"><span className="text-white">],</span></div>
          <div className="pl-4"><span className="text-[#79c0ff]">available</span><span className="text-white">:</span> <span className="text-[#79c0ff]">true</span></div>
          <div><span className="text-[#ff7b72]">{`}`}</span><span className="text-white">;</span></div>
          <div className="mt-3 text-[#8b949e]">{"// Ready to build something great"}</div>
        </div>
      </motion.div>
    </section>
  );
}
