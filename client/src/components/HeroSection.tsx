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

type Tok = { t: string; c: string };
const K  = (t: string): Tok => ({ t, c: "#ff7b72" });
const FN = (t: string): Tok => ({ t, c: "#d2a8ff" });
const BI = (t: string): Tok => ({ t, c: "#79c0ff" });
const OP = (t: string): Tok => ({ t, c: "#e6edf3" });
const CM = (t: string): Tok => ({ t, c: "#8b949e" });
const ST = (t: string): Tok => ({ t, c: "#a5d6ff" });
const NM = (t: string): Tok => ({ t, c: "#f8c555" });

const CODE_LINES: Tok[][] = [
  [CM("# game_ai/pathfinder.py")],
  [K("import"), OP(" heapq")],
  [],
  [K("def "), FN("a_star"), OP("(grid, start, goal):")],
  [OP("    h "), K("= lambda"), OP(" n: "), BI("abs"), OP("(n["), NM("0"), OP("]-goal["), NM("0"), OP("]) + "), BI("abs"), OP("(n["), NM("1"), OP("]-goal["), NM("1"), OP("])")],
  [OP("    pq = [("), NM("0"), OP(", start)]")],
  [OP("    dist, prev = {start: "), NM("0"), OP("}, {}")],
  [],
  [K("    while"), OP(" pq:")],
  [OP("        _, cur = heapq."), BI("heappop"), OP("(pq)")],
  [K("        if"), OP(" cur == goal:"), K(" return"), OP(" "), BI("build_path"), OP("(prev, cur)")],
  [K("        for"), OP(" dx, dy "), K("in"), OP(" (("), NM("0"), OP(","), NM("1"), OP("),("), NM("1"), OP(","), NM("0"), OP("),("), NM("0"), OP(",-"), NM("1"), OP("),(-"), NM("1"), OP(","), NM("0"), OP(")):")],
  [OP("            nb = (cur["), NM("0"), OP("]+dx, cur["), NM("1"), OP("]+dy)")],
  [K("            if"), OP(" grid."), BI("walkable"), OP("(nb) "), K("and"), OP(" dist[cur]+"), NM("1"), OP(" < dist."), BI("get"), OP("(nb, "), NM("9e9"), OP("):")],
  [OP("                prev[nb] = cur; dist[nb] = dist[cur]+"), NM("1")],
  [OP("                heapq."), BI("heappush"), OP("(pq, (dist[nb] + h(nb), nb))")],
];

function CodeCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
      className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 w-[400px] flex-col"
      style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: "14px", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.35)" }}
    >
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: "1px solid #21262d" }}>
        <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
        <span className="ml-3 text-xs select-none" style={{ color: "#8b949e", fontFamily: "monospace" }}>game_ai/pathfinder.py</span>
        <span className="ml-auto text-xs px-2 py-0.5 rounded" style={{ background: "#1f2937", color: "#58a6ff", fontFamily: "monospace" }}>Python</span>
      </div>
      <div className="p-4 overflow-auto" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace", fontSize: "11px", lineHeight: "1.75" }}>
        {CODE_LINES.map((line, i) => (
          <div key={i} className="flex">
            <span className="select-none w-5 mr-3 text-right flex-shrink-0" style={{ color: "#30363d" }}>{i + 1}</span>
            <span>
              {line.length === 0
                ? <>&nbsp;</>
                : line.map((tok, j) => <span key={j} style={{ color: tok.c }}>{tok.t}</span>)
              }
            </span>
          </div>
        ))}
        <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: "1px solid #21262d" }}>
          <span style={{ color: "#3fb950", fontSize: "10px", fontFamily: "monospace" }}>● ALGO</span>
          <span style={{ color: "#484f58", fontSize: "10px" }}>·</span>
          <span style={{ color: "#58a6ff", fontSize: "10px", fontFamily: "monospace" }}>A* Search</span>
          <span style={{ color: "#484f58", fontSize: "10px" }}>·</span>
          <span style={{ color: "#8b949e", fontSize: "10px", fontFamily: "monospace" }}>O(E log V)</span>
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

      <CodeCard />
    </section>
  );
}
