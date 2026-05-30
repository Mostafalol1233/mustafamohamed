import { useEffect, useRef, useState, KeyboardEvent, ElementType } from "react";
import {
  SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiTailwindcss,
  SiNodedotjs, SiExpress, SiPostgresql, SiMongodb, SiSupabase,
  SiHtml5, SiCss3, SiFigma, SiShadcnui, SiFramer,
  SiGit, SiGithub, SiDocker, SiLinux, SiVercel,
  SiOpenai, SiPostman,
} from "react-icons/si";

const SKILL_ICONS: Record<string, ElementType> = {
  "JavaScript":         SiJavascript,
  "TypeScript":         SiTypescript,
  "React":              SiReact,
  "Next.js":            SiNextdotjs,
  "Tailwind CSS":       SiTailwindcss,
  "Node.js":            SiNodedotjs,
  "Express":            SiExpress,
  "PostgreSQL":         SiPostgresql,
  "MongoDB":            SiMongodb,
  "Supabase":           SiSupabase,
  "HTML5":              SiHtml5,
  "CSS3":               SiCss3,
  "Figma":              SiFigma,
  "Shadcn/UI":          SiShadcnui,
  "Framer Motion":      SiFramer,
  "Git":                SiGit,
  "GitHub":             SiGithub,
  "Docker":             SiDocker,
  "Linux / CLI":        SiLinux,
  "Vercel":             SiVercel,
  "Prompt Engineering": SiOpenai,
  "LLM APIs":           SiOpenai,
  "REST API Design":    SiPostman,
};

// ─── Types ────────────────────────────────────────────────────────────────────

type Seg = {
  text: string;
  color?: string;
  bold?: boolean;
  clickCmd?: string;
};

type TermLine =
  | { kind: "segs"; segs: Seg[] }
  | { kind: "blank" }
  | { kind: "skill"; name: string; percent: number; desc: string; icon: string; tags: string[] };

// ─── Skill data ───────────────────────────────────────────────────────────────

const MODULES: Record<
  string,
  { title: string; icon: string; color: string; skills: { name: string; percent: number; desc: string; icon: string; tags: string[] }[]; next: string }
> = {
  frontend: {
    title: "FRONTEND",
    icon: "⬡",
    color: "#58a6ff",
    skills: [
      { name: "JavaScript",   percent: 90, desc: "ES6+, async/await, closures, DOM manipulation, modules", icon: "JS", tags: ["ES6+", "async", "DOM"] },
      { name: "TypeScript",   percent: 80, desc: "typed JS, interfaces, generics, utility types",          icon: "TS", tags: ["types", "generics", "safety"] },
      { name: "React",        percent: 87, desc: "hooks, context API, state management, custom hooks",     icon: "⚛",  tags: ["hooks", "JSX", "context"] },
      { name: "Next.js",      percent: 82, desc: "SSR, ISR, App Router, API routes, middleware",           icon: "▲",  tags: ["SSR", "ISR", "edge"] },
      { name: "Tailwind CSS", percent: 90, desc: "utility-first styling, JIT, responsive, dark mode",      icon: "◈",  tags: ["JIT", "responsive", "DX"] },
    ],
    next: "backend",
  },
  backend: {
    title: "BACKEND & DATABASES",
    icon: "⬡",
    color: "#3fb950",
    skills: [
      { name: "Node.js",         percent: 85, desc: "server runtime, async I/O, streams, event loop",         icon: "⬡", tags: ["async", "streams", "event"] },
      { name: "Express",         percent: 85, desc: "REST APIs, middleware chains, routing, error handling",   icon: "⚡", tags: ["REST", "middleware", "auth"] },
      { name: "PostgreSQL",      percent: 82, desc: "relational DB, SQL queries, Drizzle ORM, joins, indexes", icon: "◫", tags: ["SQL", "Drizzle", "ACID"] },
      { name: "MongoDB",         percent: 67, desc: "document store, aggregation pipelines, Atlas",            icon: "◉", tags: ["NoSQL", "aggregate", "Atlas"] },
      { name: "Supabase",        percent: 78, desc: "Auth, realtime, storage, RLS policies, edge functions",   icon: "◈", tags: ["auth", "realtime", "RLS"] },
    ],
    next: "markup",
  },
  markup: {
    title: "MARKUP & UI",
    icon: "⬡",
    color: "#f78166",
    skills: [
      { name: "HTML5",          percent: 95, desc: "semantic HTML, accessibility, SEO structure, meta",      icon: "H5", tags: ["a11y", "SEO", "semantic"] },
      { name: "CSS3",           percent: 90, desc: "Grid, Flexbox, custom properties, animations, clamp",    icon: "C3", tags: ["Grid", "Flex", "clamp"] },
      { name: "Figma",          percent: 72, desc: "wireframes, components, dev handoff, auto-layout",       icon: "◈", tags: ["components", "handoff", "tokens"] },
      { name: "Shadcn/UI",      percent: 88, desc: "accessible components, theming, CVA, Radix primitives",  icon: "◉", tags: ["a11y", "Radix", "CVA"] },
      { name: "Framer Motion",  percent: 68, desc: "spring animations, transitions, gesture-based UI",       icon: "◎", tags: ["spring", "gesture", "layout"] },
    ],
    next: "tools",
  },
  tools: {
    title: "DEV TOOLS",
    icon: "⬡",
    color: "#e3b341",
    skills: [
      { name: "Git",        percent: 87, desc: "branching strategies, rebasing, clean commit history",     icon: "◈", tags: ["rebase", "hooks", "flow"] },
      { name: "GitHub",     percent: 88, desc: "PRs, Actions CI/CD, code review, project management",      icon: "◉", tags: ["Actions", "CI/CD", "review"] },
      { name: "Docker",     percent: 62, desc: "containers, docker-compose, environment reproducibility",  icon: "◫", tags: ["compose", "image", "devops"] },
      { name: "Linux / CLI",percent: 70, desc: "bash scripting, server ops, cron, process management",    icon: "⬡", tags: ["bash", "cron", "ssh"] },
      { name: "Vercel",     percent: 85, desc: "deployments, edge functions, preview URLs, env vars",      icon: "▲", tags: ["edge", "preview", "ISR"] },
    ],
    next: "ai",
  },
  ai: {
    title: "AI & APIs",
    icon: "⬡",
    color: "#bc8cff",
    skills: [
      { name: "REST API Design",    percent: 88, desc: "endpoint design, versioning, JWT auth, OpenAPI docs", icon: "⇌", tags: ["OpenAPI", "JWT", "CORS"] },
      { name: "Prompt Engineering", percent: 85, desc: "system prompts, few-shot, chain-of-thought, evals",   icon: "◎", tags: ["CoT", "few-shot", "eval"] },
      { name: "LLM APIs",           percent: 78, desc: "OpenAI/Claude integration, streaming, function calls", icon: "⚡", tags: ["streaming", "tools", "Claude"] },
    ],
    next: "frontend",
  },
};

// ─── Line factories ───────────────────────────────────────────────────────────

function bootLines(): TermLine[] {
  return [
    { kind: "segs", segs: [{ text: "> Initializing portfolio.exe...", color: "#c9d1d9" }] },
    {
      kind: "segs",
      segs: [
        { text: "> Loading skill modules... ", color: "#c9d1d9" },
        { text: "done", color: "#3fb950" },
      ],
    },
    {
      kind: "segs",
      segs: [
        { text: "> Click ", color: "#8b949e" },
        { text: "scan", color: "#58a6ff", clickCmd: "scan" },
        { text: "  to explore all skill packages", color: "#8b949e" },
      ],
    },
  ];
}

function helpLines(): TermLine[] {
  const row = (cmd: string, desc: string): TermLine => ({
    kind: "segs",
    segs: [
      { text: `  ${cmd.padEnd(12)}`, color: "#58a6ff", clickCmd: cmd },
      { text: `— ${desc}`, color: "#8b949e" },
    ],
  });
  return [
    { kind: "segs", segs: [{ text: "> Available commands:", color: "#c9d1d9" }] },
    { kind: "blank" },
    row("scan",     "scan all skill categories"),
    row("frontend", "frontend skills & packages"),
    row("backend",  "backend & databases"),
    row("markup",   "HTML, CSS & UI libraries"),
    row("tools",    "dev tools & environment"),
    row("ai",       "AI & API design"),
    row("clear",    "clear terminal"),
  ];
}

function scanLines(): TermLine[] {
  const cat = (cmd: string, count: number, icon: string, color: string): TermLine => ({
    kind: "segs",
    segs: [
      { text: "  ✓ ", color: "#3fb950" },
      { text: icon + " ", color },
      { text: cmd.padEnd(12), color: "#58a6ff", clickCmd: cmd },
      { text: `${count} packages`, color: "#8b949e" },
      { text: "  ·  ", color: "#30363d" },
      { text: "click to inspect", color: "#484f58" },
    ],
  });
  return [
    { kind: "segs", segs: [{ text: "> Running skill scan...", color: "#c9d1d9" }] },
    { kind: "segs", segs: [{ text: "> [██████████] Scanning packages...", color: "#3fb950" }] },
    { kind: "blank" },
    cat("frontend", 5, "⬡", "#58a6ff"),
    cat("backend",  5, "⬡", "#3fb950"),
    cat("markup",   5, "⬡", "#f78166"),
    cat("tools",    5, "⬡", "#e3b341"),
    cat("ai",       3, "⬡", "#bc8cff"),
    { kind: "blank" },
    {
      kind: "segs",
      segs: [{ text: "> 23 packages found. Click any category to open its bag.", color: "#c9d1d9" }],
    },
  ];
}

function moduleLines(cmd: string): TermLine[] {
  const mod = MODULES[cmd];
  if (!mod) return [];
  return [
    {
      kind: "segs",
      segs: [
        { text: `> Opening `, color: "#c9d1d9" },
        { text: `${cmd}.bag`, color: mod.color, bold: true },
        { text: "...", color: "#c9d1d9" },
      ],
    },
    { kind: "blank" },
    {
      kind: "segs",
      segs: [
        { text: `┌─── `, color: "#30363d" },
        { text: mod.icon + " ", color: mod.color },
        { text: mod.title, color: mod.color, bold: true },
        { text: ` ───┐`, color: "#30363d" },
      ],
    },
    { kind: "blank" },
    ...mod.skills.map(
      (s): TermLine => ({ kind: "skill", name: s.name, percent: s.percent, desc: s.desc, icon: s.icon, tags: s.tags })
    ),
    { kind: "blank" },
    {
      kind: "segs",
      segs: [
        { text: `└─── `, color: "#30363d" },
        { text: `${mod.skills.length} packages installed`, color: "#484f58" },
        { text: ` ───┘`, color: "#30363d" },
      ],
    },
    { kind: "blank" },
    {
      kind: "segs",
      segs: [
        { text: "> Next: ", color: "#8b949e" },
        { text: `${mod.next}.bag`, color: "#58a6ff", clickCmd: mod.next },
        { text: "  ·  ", color: "#30363d" },
        { text: "help", color: "#58a6ff", clickCmd: "help" },
        { text: " for all commands", color: "#8b949e" },
      ],
    },
  ];
}

function errorLines(raw: string): TermLine[] {
  return [
    {
      kind: "segs",
      segs: [
        { text: "> command not found: ", color: "#f85149" },
        { text: raw, color: "#f85149", bold: true },
        { text: "   try ", color: "#8b949e" },
        { text: "help", color: "#58a6ff", clickCmd: "help" },
      ],
    },
  ];
}

function getLines(cmd: string): TermLine[] {
  const c = cmd.trim().toLowerCase();
  if (c === "help")    return helpLines();
  if (c === "scan")    return scanLines();
  if (c === "clear")   return [];
  if (MODULES[c])      return moduleLines(c);
  return errorLines(cmd.trim());
}

// ─── Matrix rain canvas ───────────────────────────────────────────────────────

const MATRIX_CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノ01ABCDEFabcdef<>/{}[]#@!";

function MatrixRain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let W = 0, H = 0;
    const FONT_SZ = 13;
    let columns: number[] = [];

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W;
      canvas.height = H;
      const cols = Math.floor(W / FONT_SZ);
      columns = Array.from({ length: cols }, () => Math.random() * -H);
    };
    resize();

    let raf: number;
    let lastT = 0;

    const draw = (ts: number) => {
      raf = requestAnimationFrame(draw);
      if (ts - lastT < 60) return;
      lastT = ts;

      ctx.fillStyle = "rgba(13,17,23,0.18)";
      ctx.fillRect(0, 0, W, H);

      ctx.font = `${FONT_SZ}px 'JetBrains Mono', monospace`;

      columns.forEach((y, i) => {
        const ch = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        const x  = i * FONT_SZ;
        ctx.fillStyle = "rgba(63,185,80,0.85)";
        ctx.fillText(ch, x, y);
        ctx.fillStyle = "rgba(56,139,253,0.18)";
        ctx.fillText(MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)], x, y - FONT_SZ);
        columns[i] = y > H + FONT_SZ * 2 ? -FONT_SZ * Math.random() * 20 : y + FONT_SZ;
      });
    };

    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.055,
      }}
    />
  );
}

// ─── Skill bag card ───────────────────────────────────────────────────────────

type Theme = typeof DARK_T;

function SkillLine({ name, percent, desc, tags, theme: T }: {
  name: string; percent: number; desc: string; icon: string; tags: string[]; theme: Theme;
}) {
  const total = Math.round(percent / 10);
  const [filled, setFilled] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let count = 0;
    const iv = setInterval(() => {
      count += 1;
      setFilled(count);
      if (count >= total) clearInterval(iv);
    }, 60);
    return () => clearInterval(iv);
  }, [total]);

  const empty = 10 - filled;
  const level   = percent >= 80 ? "advanced" : percent >= 65 ? "proficient" : "familiar";
  const barColor = percent >= 80 ? T.green    : percent >= 65 ? T.accent     : "#e3b341";
  const levelColor = barColor;

  const IconComp = SKILL_ICONS[name];

  return (
    <div
      className="my-1 cursor-default select-none rounded"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "inherit",
        border: `1px solid ${hovered ? T.border : T.skillBorder}`,
        background: hovered ? T.skillHoverBg : T.skillBg,
        transition: "all 0.15s ease",
        padding: "6px 10px",
      }}
      data-testid={`skill-row-${name.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {/* Top row: icon + name + bar + level */}
      <div className="flex items-center gap-0 text-sm leading-6" style={{ whiteSpace: "pre" }}>
        <span style={{ color: barColor, marginRight: 8, display: "flex", alignItems: "center", flexShrink: 0 }}>
          {IconComp
            ? <IconComp size={14} />
            : <span style={{ fontSize: 12 }}>·</span>
          }
        </span>
        <span style={{ color: T.inputText, minWidth: "156px", display: "inline-block" }}>
          {name}
        </span>
        <span style={{ color: T.textFaint }}>[</span>
        <span style={{ color: barColor }}>{"█".repeat(filled)}</span>
        <span style={{ color: T.skillBorder }}>{"░".repeat(empty)}</span>
        <span style={{ color: T.textFaint }}>]</span>
        <span style={{ color: levelColor, marginLeft: 10, fontSize: "10px", letterSpacing: "0.05em" }}>
          {level}
        </span>
      </div>

      {/* Bottom row: desc + tags (on hover) */}
      {hovered && (
        <div className="flex items-center gap-3 mt-0.5" style={{ whiteSpace: "pre" }}>
          <span style={{ color: T.textFaint, fontSize: "11px" }}>  └ {desc}</span>
          <span style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
            {tags.map(t => (
              <span key={t} style={{
                fontSize: "9px",
                color: T.textFaint,
                border: `1px solid ${T.skillBorder}`,
                borderRadius: 3,
                padding: "0 4px",
                letterSpacing: "0.02em",
              }}>
                {t}
              </span>
            ))}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Segment line ─────────────────────────────────────────────────────────────

function SegLine({ segs, onCommand, fallbackColor }: {
  segs: Seg[];
  onCommand: (cmd: string) => void;
  fallbackColor?: string;
}) {
  return (
    <div className="text-sm leading-7" style={{ whiteSpace: "pre" }}>
      {segs.map((seg, i) =>
        seg.clickCmd ? (
          <span
            key={i}
            onClick={() => onCommand(seg.clickCmd!)}
            className="cursor-pointer hover:underline"
            style={{ color: seg.color ?? fallbackColor ?? "#c9d1d9", fontWeight: seg.bold ? "bold" : undefined }}
          >
            {seg.text}
          </span>
        ) : (
          <span
            key={i}
            style={{ color: seg.color ?? fallbackColor ?? "#c9d1d9", fontWeight: seg.bold ? "bold" : undefined }}
          >
            {seg.text}
          </span>
        )
      )}
    </div>
  );
}

// ─── Mobile quick-command bar ─────────────────────────────────────────────────

const MOBILE_CMDS = ["scan", "frontend", "backend", "tools", "design", "ai", "help", "clear"];

// ─── Theme colours ────────────────────────────────────────────────────────────

const DARK_T = {
  bg:            "#0d1117",
  titleBg:       "#161b22",
  border:        "#30363d",
  innerBorder:   "#21262d",
  text:          "#c9d1d9",
  textDim:       "#8b949e",
  textFaint:     "#484f58",
  textMuted:     "#30363d",
  accent:        "#58a6ff",
  green:         "#3fb950",
  inputText:     "#e6edf3",
  skillBorder:   "#21262d",
  skillHoverBg:  "rgba(22,27,34,0.8)",
  skillBg:       "rgba(13,17,23,0.6)",
};

const LIGHT_T = {
  bg:            "#ffffff",
  titleBg:       "#f6f8fa",
  border:        "#d0d7de",
  innerBorder:   "#d8dee4",
  text:          "#24292f",
  textDim:       "#57606a",
  textFaint:     "#6e7781",
  textMuted:     "#8c959f",
  accent:        "#0969da",
  green:         "#1a7f37",
  inputText:     "#24292f",
  skillBorder:   "#d0d7de",
  skillHoverBg:  "rgba(246,248,250,0.9)",
  skillBg:       "rgba(255,255,255,0.7)",
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function SkillsSection() {
  const [lines, setLines]               = useState<TermLine[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [fading, setFading]             = useState(false);
  const [input, setInput]               = useState("");
  const [busy, setBusy]                 = useState(false);
  const [booted, setBooted]             = useState(false);
  const [lightMode, setLightMode]       = useState(false);

  const T = lightMode ? LIGHT_T : DARK_T;

  const outputRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const timersRef  = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  const killTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const push = (t: ReturnType<typeof setTimeout>) => timersRef.current.push(t);

  // Slower reveal: 90ms per line for a satisfying terminal feel
  const reveal = (newLines: TermLine[]) => {
    setLines(newLines);
    setVisibleCount(0);
    setBusy(true);
    newLines.forEach((_, i) => {
      push(
        setTimeout(() => {
          setVisibleCount(i + 1);
          if (i === newLines.length - 1) setBusy(false);
        }, i * 90)
      );
    });
    if (newLines.length === 0) setBusy(false);
  };

  const execute = (cmd: string) => {
    const c = cmd.trim().toLowerCase();
    if (!c) return;
    killTimers();
    setFading(true);
    push(
      setTimeout(() => {
        setFading(false);
        reveal(getLines(c));
      }, 160)
    );
  };

  const handleLinkClick = (cmd: string) => {
    if (busy) return;
    setInput("");
    let idx = 0;
    const typeNext = () => {
      idx += 1;
      setInput(cmd.slice(0, idx));
      if (idx < cmd.length) {
        push(setTimeout(typeNext, 55));
      } else {
        push(setTimeout(() => { setInput(""); execute(cmd); }, 220));
      }
    };
    push(setTimeout(typeNext, 60));
  };

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !busy) {
      const val = input;
      setInput("");
      execute(val);
    }
  };

  const handleSubmitBtn = () => {
    if (!input.trim() || busy) return;
    const val = input;
    setInput("");
    execute(val);
  };

  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [visibleCount]);

  // On boot: show boot lines then auto-run scan after a short delay
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || booted) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        setBooted(true);
        // Show boot lines, then auto-type and run "scan"
        const boot = bootLines();
        reveal(boot);
        // After boot lines finish, auto-type "scan"
        const bootDelay = boot.length * 90 + 600;
        push(setTimeout(() => {
          let idx = 0;
          const cmd = "scan";
          const typeNext = () => {
            idx++;
            setInput(cmd.slice(0, idx));
            if (idx < cmd.length) {
              push(setTimeout(typeNext, 60));
            } else {
              push(setTimeout(() => { setInput(""); execute(cmd); }, 280));
            }
          };
          typeNext();
        }, bootDelay));
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [booted]);

  useEffect(() => () => killTimers(), []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="section-padding bg-white border-t border-border"
    >
      <div className="container-max">
        {/* Section header */}
        <div className="max-w-2xl mb-10">
          <span className="section-eyebrow">Expertise</span>
          <h2 className="section-title">Skills &amp; Tools</h2>
          <p className="section-subtitle">
            A live terminal — type a command or click any highlighted word to open a skill bag.
          </p>
        </div>

        {/* ── Terminal window ── */}
        <div
          className="rounded-xl overflow-hidden shadow-2xl transition-colors duration-300"
          style={{
            background: T.bg,
            border: `1px solid ${T.border}`,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
          }}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Title bar */}
          <div
            className="flex items-center gap-2 px-4 py-3 transition-colors duration-300"
            style={{ background: T.titleBg, borderBottom: `1px solid ${T.innerBorder}` }}
          >
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-xs" style={{ color: T.textDim }}>
              skills.bag — mustafa@portfolio:~
            </span>
            <div className="ml-auto flex items-center gap-3">
              {/* Light/Dark toggle */}
              <button
                onClick={(e) => { e.stopPropagation(); setLightMode(m => !m); }}
                className="text-xs px-2 py-0.5 rounded transition-colors duration-200"
                style={{
                  color: T.textDim,
                  border: `1px solid ${T.innerBorder}`,
                  background: "transparent",
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
                title="Toggle light/dark mode"
                data-testid="button-theme-toggle"
              >
                {lightMode ? "◑ dark" : "◐ light"}
              </button>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: T.green }}>
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: T.green }}
                />
                LIVE
              </span>
            </div>
          </div>

          {/* Output area */}
          <div
            className="relative"
            style={{ minHeight: "340px", maxHeight: "460px", overflow: "hidden" }}
          >
            {!lightMode && <MatrixRain />}

            {/* Scanlines overlay — only in dark mode */}
            {!lightMode && (
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  zIndex: 1,
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
                }}
              />
            )}

            {/* Scrollable text */}
            <div
              ref={outputRef}
              className="overflow-y-auto px-6 pt-6 pb-2 md:px-8 relative transition-colors duration-300"
              style={{
                minHeight: "340px",
                maxHeight: "460px",
                zIndex: 2,
                opacity: fading ? 0 : 1,
                transition: "opacity 0.14s ease",
                background: lightMode ? T.bg : "transparent",
              }}
            >
              {lines.slice(0, visibleCount).map((line, i) => {
                if (line.kind === "blank") return <div key={i} className="h-1" />;
                if (line.kind === "skill")
                  return (
                    <SkillLine
                      key={i}
                      name={line.name}
                      percent={line.percent}
                      desc={line.desc}
                      icon={line.icon}
                      tags={line.tags}
                      theme={T}
                    />
                  );
                return <SegLine key={i} segs={line.segs} onCommand={handleLinkClick} fallbackColor={T.text} />;
              })}

              {/* Blinking cursor */}
              {!fading && (
                <div className="flex items-center gap-2 text-sm mt-3 mb-1">
                  <span style={{ color: T.accent }}>~</span>
                  <span style={{ color: T.textDim }}>$</span>
                  <span
                    className="animate-blink inline-block"
                    style={{ width: "8px", height: "15px", background: T.accent, verticalAlign: "middle" }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Input area */}
          <div
            className="px-6 py-3 md:px-8 transition-colors duration-300"
            style={{ background: T.bg, borderTop: `1px solid ${T.innerBorder}` }}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm shrink-0" style={{ color: T.accent }}>~</span>
              <span className="text-sm shrink-0" style={{ color: T.textDim }}>$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleEnter}
                placeholder="type a command and press Enter…"
                autoComplete="off"
                spellCheck={false}
                className="flex-1 bg-transparent outline-none text-sm"
                style={{
                  color: T.inputText,
                  caretColor: T.accent,
                  fontFamily: "inherit",
                  border: "none",
                  minWidth: 0,
                }}
                data-testid="input-terminal-command"
              />
              <button
                onClick={handleSubmitBtn}
                disabled={!input.trim() || busy}
                className="shrink-0 text-xs px-3 py-1 rounded border transition-colors disabled:opacity-30"
                style={{
                  color: T.accent,
                  borderColor: T.border,
                  background: "transparent",
                  fontFamily: "inherit",
                }}
                data-testid="button-terminal-enter"
              >
                ↵
              </button>
            </div>
          </div>

          {/* Mobile quick-command buttons */}
          <div
            className="md:hidden px-4 py-3 flex flex-wrap gap-2 transition-colors duration-300"
            style={{ background: T.titleBg, borderTop: `1px solid ${T.innerBorder}` }}
          >
            {MOBILE_CMDS.map((cmd) => (
              <button
                key={cmd}
                onClick={() => handleLinkClick(cmd)}
                className="text-xs px-2.5 py-1 rounded border transition-colors"
                style={{
                  color: T.textDim,
                  borderColor: T.innerBorder,
                  background: T.bg,
                  fontFamily: "inherit",
                }}
                data-testid={`button-mobile-cmd-${cmd}`}
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
