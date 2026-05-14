import { useEffect, useRef, useState, KeyboardEvent } from "react";

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
  | { kind: "skill"; name: string; percent: number; desc: string };

// ─── Skill data ───────────────────────────────────────────────────────────────

const MODULES: Record<
  string,
  { title: string; skills: { name: string; percent: number; desc: string }[]; next: string }
> = {
  frontend: {
    title: "FRONTEND SKILLS",
    skills: [
      { name: "React",         percent: 85, desc: "UI components, hooks, state management" },
      { name: "TypeScript",    percent: 78, desc: "typed JS, interfaces, generics" },
      { name: "Next.js",       percent: 82, desc: "SSR, routing, API routes" },
      { name: "Tailwind CSS",  percent: 90, desc: "utility-first styling system" },
      { name: "Framer Motion", percent: 65, desc: "animations, transitions, gestures" },
    ],
    next: "backend",
  },
  backend: {
    title: "BACKEND SKILLS",
    skills: [
      { name: "Node.js",    percent: 82, desc: "server runtime, async I/O, streams" },
      { name: "Express",    percent: 84, desc: "REST APIs, middleware, routing" },
      { name: "REST APIs",  percent: 88, desc: "endpoint design, auth, documentation" },
      { name: "MongoDB",    percent: 65, desc: "document store, aggregation pipelines" },
      { name: "PostgreSQL", percent: 80, desc: "relational DB, SQL queries, Drizzle ORM" },
    ],
    next: "design",
  },
  design: {
    title: "DESIGN & UI SKILLS",
    skills: [
      { name: "Figma",             percent: 70, desc: "wireframes, components, dev handoff" },
      { name: "Shadcn/UI",         percent: 88, desc: "accessible component library" },
      { name: "Radix UI",          percent: 72, desc: "headless primitives, ARIA compliance" },
      { name: "Responsive Design", percent: 93, desc: "mobile-first, CSS Grid & Flexbox" },
    ],
    next: "tools",
  },
  tools: {
    title: "DEV TOOLS & ENVIRONMENT",
    skills: [
      { name: "Git",     percent: 85, desc: "branching, rebasing, clean history" },
      { name: "GitHub",  percent: 87, desc: "PRs, Actions CI/CD, code review" },
      { name: "VS Code", percent: 95, desc: "extensions, debugger, snippets" },
      { name: "Linux",   percent: 68, desc: "CLI navigation, scripting, server ops" },
      { name: "Vercel",  percent: 85, desc: "deployments, edge functions, previews" },
    ],
    next: "ai",
  },
  ai: {
    title: "AI & DATA SKILLS",
    skills: [
      { name: "Prompt Engineering", percent: 86, desc: "system prompts, few-shot examples" },
      { name: "AI Integration",     percent: 80, desc: "OpenAI/Claude APIs, streaming" },
      { name: "Data Analysis",      percent: 62, desc: "SQL reports, charts, metrics" },
      { name: "RAG Systems",        percent: 70, desc: "embeddings, vector search, pipelines" },
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
        { text: "> Type ", color: "#8b949e" },
        { text: "help", color: "#58a6ff", clickCmd: "help" },
        { text: "  to see available commands", color: "#8b949e" },
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
    row("frontend", "frontend skills & stats"),
    row("backend",  "backend skills & stats"),
    row("tools",    "dev tools & environment"),
    row("design",   "UI/UX & design skills"),
    row("ai",       "AI & data skills"),
    row("clear",    "clear terminal"),
  ];
}

function scanLines(): TermLine[] {
  const cat = (cmd: string, count: number, pad: number): TermLine => ({
    kind: "segs",
    segs: [
      { text: "✓ ", color: "#3fb950" },
      { text: cmd.padEnd(pad), color: "#58a6ff", clickCmd: cmd },
      { text: `— ${count} skills detected`, color: "#8b949e" },
    ],
  });
  return [
    { kind: "segs", segs: [{ text: "> Running skill scan...", color: "#c9d1d9" }] },
    { kind: "segs", segs: [{ text: "> [██████████] Scanning modules...", color: "#3fb950" }] },
    { kind: "blank" },
    cat("frontend", 5, 13),
    cat("backend",  5, 13),
    cat("design",   4, 13),
    cat("tools",    5, 13),
    cat("ai",       4, 13),
    { kind: "blank" },
    {
      kind: "segs",
      segs: [{ text: "> Scan complete. Click any category or type its name.", color: "#c9d1d9" }],
    },
  ];
}

function moduleLines(cmd: string): TermLine[] {
  const mod = MODULES[cmd];
  if (!mod) return [];
  return [
    { kind: "segs", segs: [{ text: `> Loading ${cmd} module...`, color: "#c9d1d9" }] },
    { kind: "blank" },
    { kind: "segs", segs: [{ text: `[ ${mod.title} ]`, color: "#f78166", bold: true }] },
    { kind: "blank" },
    ...mod.skills.map(
      (s): TermLine => ({ kind: "skill", name: s.name, percent: s.percent, desc: s.desc })
    ),
    { kind: "blank" },
    {
      kind: "segs",
      segs: [
        { text: "> Type ", color: "#8b949e" },
        { text: mod.next, color: "#58a6ff", clickCmd: mod.next },
        { text: "  to continue exploring.", color: "#8b949e" },
      ],
    },
    {
      kind: "segs",
      segs: [
        { text: "> Type ", color: "#8b949e" },
        { text: "help", color: "#58a6ff", clickCmd: "help" },
        { text: "  to see all commands.", color: "#8b949e" },
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

// ─── Animated skill bar ───────────────────────────────────────────────────────

function SkillLine({ name, percent, desc }: { name: string; percent: number; desc: string }) {
  const total = Math.round(percent / 10);
  const [filled, setFilled] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let count = 0;
    const iv = setInterval(() => {
      count += 1;
      setFilled(count);
      if (count >= total) clearInterval(iv);
    }, 55);
    return () => clearInterval(iv);
  }, [total]);

  const empty = 10 - filled;

  return (
    <div
      className="flex items-baseline gap-0 text-sm leading-7 cursor-default select-none"
      style={{ fontFamily: "inherit" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-testid={`skill-row-${name.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <span style={{ color: "#c9d1d9", whiteSpace: "pre", display: "inline-block", minWidth: "160px" }}>
        {name}
      </span>
      <span style={{ color: "#8b949e" }}>[</span>
      <span style={{ color: "#3fb950" }}>{"█".repeat(filled)}</span>
      <span style={{ color: "#30363d" }}>{"░".repeat(empty)}</span>
      <span style={{ color: "#8b949e" }}>]</span>
      <span style={{ color: "#8b949e", whiteSpace: "pre" }}>{"  "}</span>
      <span style={{ color: "#8b949e" }}>{percent}%</span>
      {hovered && (
        <span style={{ color: "#6e7681" }}>
          {"  "}— {desc}
        </span>
      )}
    </div>
  );
}

// ─── Segment line ─────────────────────────────────────────────────────────────

function SegLine({
  segs,
  onCommand,
}: {
  segs: Seg[];
  onCommand: (cmd: string) => void;
}) {
  return (
    <div className="text-sm leading-7" style={{ whiteSpace: "pre" }}>
      {segs.map((seg, i) =>
        seg.clickCmd ? (
          <span
            key={i}
            onClick={() => onCommand(seg.clickCmd!)}
            className="cursor-pointer hover:underline"
            style={{
              color: seg.color ?? "#c9d1d9",
              fontWeight: seg.bold ? "bold" : undefined,
            }}
          >
            {seg.text}
          </span>
        ) : (
          <span
            key={i}
            style={{
              color: seg.color ?? "#c9d1d9",
              fontWeight: seg.bold ? "bold" : undefined,
            }}
          >
            {seg.text}
          </span>
        )
      )}
    </div>
  );
}

// ─── Mobile quick-command bar ─────────────────────────────────────────────────

const MOBILE_CMDS = ["help", "scan", "frontend", "backend", "tools", "design", "ai", "clear"];

// ─── Main component ───────────────────────────────────────────────────────────

export default function SkillsSection() {
  const [lines, setLines]               = useState<TermLine[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [fading, setFading]             = useState(false);
  const [input, setInput]               = useState("");
  const [busy, setBusy]                 = useState(false);
  const [booted, setBooted]             = useState(false);

  const outputRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const timersRef  = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  const killTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const push = (t: ReturnType<typeof setTimeout>) => timersRef.current.push(t);

  // Reveal `newLines` one by one with stagger
  const reveal = (newLines: TermLine[]) => {
    setLines(newLines);
    setVisibleCount(0);
    setBusy(true);
    newLines.forEach((_, i) => {
      push(
        setTimeout(() => {
          setVisibleCount(i + 1);
          if (i === newLines.length - 1) setBusy(false);
        }, i * 32)
      );
    });
    // If empty (clear), unblock immediately
    if (newLines.length === 0) setBusy(false);
  };

  // Execute a command: fade out → swap → reveal
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

  // Click a link inside terminal output: type it into input then submit
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

  // Auto-scroll output to bottom whenever visible lines grow
  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [visibleCount]);

  // Boot sequence when section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || booted) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        setBooted(true);
        reveal(bootLines());
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
            A live terminal — type a command or click any highlighted word to explore.
          </p>
        </div>

        {/* ── Terminal window ── */}
        <div
          className="rounded-xl overflow-hidden shadow-2xl border border-[#30363d]"
          style={{
            background: "#0d1117",
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
          }}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Title bar */}
          <div
            className="flex items-center gap-2 px-4 py-3 border-b border-[#21262d]"
            style={{ background: "#161b22" }}
          >
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-xs" style={{ color: "#8b949e" }}>
              terminal — mustafa@portfolio:~
            </span>
          </div>

          {/* Output area */}
          <div
            ref={outputRef}
            className="overflow-y-auto px-6 pt-6 pb-2 md:px-8"
            style={{
              minHeight: "320px",
              maxHeight: "420px",
              opacity: fading ? 0 : 1,
              transition: "opacity 0.14s ease",
            }}
          >
            {lines.slice(0, visibleCount).map((line, i) => {
              if (line.kind === "blank") return <div key={i} className="h-1" />;
              if (line.kind === "skill")
                return <SkillLine key={i} name={line.name} percent={line.percent} desc={line.desc} />;
              return <SegLine key={i} segs={line.segs} onCommand={handleLinkClick} />;
            })}

            {/* Blinking cursor always at bottom */}
            {!fading && (
              <div className="flex items-center gap-2 text-sm mt-3 mb-4">
                <span style={{ color: "#58a6ff" }}>~</span>
                <span style={{ color: "#8b949e" }}>$</span>
                <span
                  className="animate-blink inline-block"
                  style={{
                    width: "8px",
                    height: "15px",
                    background: "#58a6ff",
                    verticalAlign: "middle",
                  }}
                />
              </div>
            )}
          </div>

          {/* Input area */}
          <div
            className="border-t border-[#21262d] px-6 py-3 md:px-8"
            style={{ background: "#0d1117" }}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm shrink-0" style={{ color: "#58a6ff" }}>~</span>
              <span className="text-sm shrink-0" style={{ color: "#8b949e" }}>$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleEnter}
                placeholder="type a command and press Enter…"
                autoComplete="off"
                spellCheck={false}
                className="flex-1 bg-transparent outline-none text-sm caret-[#58a6ff]"
                style={{
                  color: "#e6edf3",
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
                  color: "#58a6ff",
                  borderColor: "#30363d",
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
            className="md:hidden border-t border-[#21262d] px-4 py-3 flex flex-wrap gap-2"
            style={{ background: "#161b22" }}
          >
            {MOBILE_CMDS.map((cmd) => (
              <button
                key={cmd}
                onClick={() => handleLinkClick(cmd)}
                className="text-xs px-2.5 py-1 rounded border transition-colors hover:border-[#58a6ff] hover:text-[#58a6ff]"
                style={{
                  color: "#8b949e",
                  borderColor: "#30363d",
                  background: "#0d1117",
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
