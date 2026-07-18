import { useEffect, useRef, useState, KeyboardEvent } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Seg = {
  text: string;
  color?: string;
  bold?: boolean;
  dim?: boolean;
  clickCmd?: string;
};

type TermLine =
  | { kind: "segs"; segs: Seg[] }
  | { kind: "blank" }
  | { kind: "method"; category: string; name: string; desc: string; free: boolean }
  | { kind: "banner" };

// ─── Theme ───────────────────────────────────────────────────────────────────

const T = {
  bg:          "#0a0e1a",
  titleBg:     "#0f1420",
  border:      "#1e2a45",
  innerBorder: "#141c30",
  text:        "#c8d3f0",
  textDim:     "#6b7a99",
  textFaint:   "#3a4560",
  accent:      "#7c6af7",   // bemora purple
  accentAlt:   "#4fc3f7",   // cyan
  green:       "#43e97b",
  orange:      "#f9a825",
  pink:        "#f06292",
  inputText:   "#e8eeff",
  skillBorder: "#1a2340",
  skillHoverBg:"rgba(124,106,247,0.08)",
  skillBg:     "rgba(10,14,26,0.7)",
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: "weather",  icon: "🌤", color: T.accentAlt,  count: 8,  label: "Weather & Climate"   },
  { name: "crypto",   icon: "₿",  color: T.orange,      count: 24, label: "Crypto & Coin Wizard"},
  { name: "ai",       icon: "🤖", color: T.accent,      count: 18, label: "AI / LLM Providers"  },
  { name: "gaming",   icon: "🎮", color: T.green,       count: 22, label: "Gaming Suite"         },
  { name: "news",     icon: "📰", color: T.textDim,     count: 6,  label: "News & RSS"           },
  { name: "finance",  icon: "📈", color: T.orange,      count: 12, label: "Stocks & Finance"     },
  { name: "space",    icon: "🚀", color: T.accentAlt,   count: 5,  label: "Space & Astronomy"    },
  { name: "tools",    icon: "🔧", color: "#e57373",     count: 30, label: "Dev Tools & Utils"    },
  { name: "sports",   icon: "⚽", color: T.green,       count: 14, label: "Sports & Football"    },
  { name: "realtime", icon: "⚡", color: T.pink,        count: 8,  label: "WebSocket Streams"    },
];

const METHODS: Record<string, { name: string; desc: string; free: boolean }[]> = {
  weather: [
    { name: "getWeather(city)",          desc: "Current conditions — temp, humidity, wind, UV",  free: true  },
    { name: "getForecast(city, days)",   desc: "Daily forecast up to 16 days ahead",              free: true  },
    { name: "getAlerts(lat, lon)",       desc: "Severe weather alerts for a coordinate",          free: true  },
    { name: "getAQI(city)",              desc: "Real-time air quality index",                     free: true  },
  ],
  crypto: [
    { name: "getPrice(symbol)",          desc: "Live price from Binance + CoinGecko fallback",   free: true  },
    { name: "streamPrice(symbol, cb)",   desc: "Real-time price stream via WebSocket",            free: true  },
    { name: "coinWizard(query)",         desc: "Smart crypto query — trends, volume, history",   free: true  },
    { name: "getMarketCap(top)",         desc: "Top-N coins by market cap",                      free: true  },
  ],
  ai: [
    { name: "chat(prompt, model?)",      desc: "Multi-provider: OpenAI, Groq, Claude, fallback", free: false },
    { name: "streamChat(prompt, cb)",    desc: "Streaming completions with token callbacks",      free: false },
    { name: "embedText(text)",           desc: "Text embeddings for semantic search",             free: false },
    { name: "classifyImage(url)",        desc: "Vision API with provider fallback chain",         free: false },
  ],
  gaming: [
    { name: "getPokemon(name)",          desc: "Full Pokédex entry — stats, moves, evolution",   free: true  },
    { name: "getFortniteStats(user)",    desc: "Fortnite player stats and season data",           free: true  },
    { name: "getChessGames(username)",   desc: "Chess.com / Lichess game history",                free: true  },
    { name: "getCrossfireData()",        desc: "CrossFire weapons, maps, characters",             free: true  },
  ],
  realtime: [
    { name: "ws.crypto(symbols[], cb)",  desc: "Multi-symbol price stream (Binance + Kraken)",   free: true  },
    { name: "ws.monitor(url, cb)",       desc: "Website uptime monitor via WebSocket",            free: true  },
    { name: "ws.forex(pairs[], cb)",     desc: "Live FX rate stream",                             free: true  },
    { name: "mcp.start(port?)",          desc: "Launch MCP server for AI agent tool calls",       free: true  },
  ],
};

// ─── Line factories ───────────────────────────────────────────────────────────

function welcomeLines(): TermLine[] {
  return [
    { kind: "banner" },
    { kind: "blank" },
    {
      kind: "segs", segs: [
        { text: "  Welcome to ", color: T.textDim },
        { text: "bemora", color: T.accent, bold: true },
        { text: " — the ultimate API library for developers & AI agents.", color: T.textDim },
      ],
    },
    {
      kind: "segs", segs: [
        { text: "  Type ", color: T.textFaint },
        { text: "help", color: T.accent, clickCmd: "help" },
        { text: "  or click any ", color: T.textFaint },
        { text: "highlighted command", color: T.accentAlt },
        { text: " to explore.", color: T.textFaint },
      ],
    },
  ];
}

function helpLines(): TermLine[] {
  const row = (cmd: string, desc: string, color: string): TermLine => ({
    kind: "segs",
    segs: [
      { text: "  $ bemora ", color: T.textDim },
      { text: cmd.padEnd(14), color, clickCmd: cmd, bold: true },
      { text: desc, color: T.textDim },
    ],
  });
  return [
    { kind: "segs", segs: [{ text: "> Available commands", color: T.text, bold: true }] },
    { kind: "blank" },
    row("install",    "— setup guide & quick start",     T.accent),
    row("categories", "— browse all 94+ API categories", T.accentAlt),
    row("weather",    "— weather & climate methods",     T.accentAlt),
    row("crypto",     "— crypto & Coin Wizard toolkit",  T.orange),
    row("ai",         "— multi-provider AI / LLM APIs",  T.accent),
    row("gaming",     "— gaming suite (10+ platforms)",  T.green),
    row("realtime",   "— WebSocket streams & MCP",       T.pink),
    row("demo",       "— show a live code snippet",      T.textDim),
    row("clear",      "— clear terminal",                T.textFaint),
    { kind: "blank" },
    {
      kind: "segs", segs: [
        { text: "  📦 ", color: T.accent },
        { text: "94+ categories  ·  320+ methods  ·  zero-key free tier  ·  MCP server", color: T.textDim },
      ],
    },
  ];
}

function installLines(): TermLine[] {
  return [
    { kind: "segs", segs: [{ text: "> Installation", color: T.text, bold: true }] },
    { kind: "blank" },
    {
      kind: "segs", segs: [
        { text: "  $ ", color: T.textDim },
        { text: "npm install bemora", color: T.green, bold: true },
      ],
    },
    { kind: "blank" },
    { kind: "segs", segs: [{ text: "  Quick start:", color: T.textDim }] },
    {
      kind: "segs", segs: [
        { text: "  import ", color: T.accent },
        { text: "{ bemora } ", color: T.text },
        { text: "from ", color: T.accent },
        { text: "'bemora'", color: T.green },
        { text: ";", color: T.textDim },
      ],
    },
    { kind: "blank" },
    {
      kind: "segs", segs: [
        { text: "  const ", color: T.accent },
        { text: "weather ", color: T.text },
        { text: "= await ", color: T.accent },
        { text: "bemora", color: T.accentAlt },
        { text: ".getWeather(", color: T.text },
        { text: "'Cairo'", color: T.green },
        { text: ");", color: T.textDim },
      ],
    },
    {
      kind: "segs", segs: [
        { text: "  const ", color: T.accent },
        { text: "price  ", color: T.text },
        { text: "= await ", color: T.accent },
        { text: "bemora", color: T.accentAlt },
        { text: ".getPrice(", color: T.text },
        { text: "'BTC'", color: T.orange },
        { text: ");", color: T.textDim },
      ],
    },
    {
      kind: "segs", segs: [
        { text: "  const ", color: T.accent },
        { text: "poke   ", color: T.text },
        { text: "= await ", color: T.accent },
        { text: "bemora", color: T.accentAlt },
        { text: ".getPokemon(", color: T.text },
        { text: "'pikachu'", color: T.green },
        { text: ");", color: T.textDim },
      ],
    },
    { kind: "blank" },
    {
      kind: "segs", segs: [
        { text: "  CLI:  $ ", color: T.textDim },
        { text: "bemora weather Cairo", color: T.accentAlt, bold: true },
      ],
    },
    {
      kind: "segs", segs: [
        { text: "  MCP:  $ ", color: T.textDim },
        { text: "bemora-mcp --port 3100", color: T.pink, bold: true },
      ],
    },
    { kind: "blank" },
    {
      kind: "segs", segs: [
        { text: "  🔗 ", color: T.accent },
        { text: "github.com/Demon-radio/Bemora.lol", color: T.accentAlt },
        { text: "   ·   npm i bemora", color: T.textDim },
      ],
    },
  ];
}

function categoriesLines(): TermLine[] {
  return [
    { kind: "segs", segs: [{ text: "> Scanning 94 categories…", color: T.text, bold: true }] },
    { kind: "segs", segs: [{ text: "> [████████████████████] 100%", color: T.green }] },
    { kind: "blank" },
    ...CATEGORIES.map((cat): TermLine => ({
      kind: "segs",
      segs: [
        { text: "  ✓ ", color: T.green },
        { text: cat.icon + "  ", color: cat.color },
        { text: cat.name.padEnd(12), color: cat.color, clickCmd: cat.name, bold: true },
        { text: `${String(cat.count).padStart(2)} methods`, color: T.textDim },
        { text: "  ·  ", color: T.textFaint },
        { text: cat.label, color: T.textFaint },
      ],
    })),
    { kind: "blank" },
    {
      kind: "segs", segs: [
        { text: "  …+84 more categories.", color: T.textFaint },
        { text: "  Click any name above to explore.", color: T.textDim },
      ],
    },
  ];
}

function methodLines(cmd: string): TermLine[] {
  const meta = CATEGORIES.find(c => c.name === cmd)!;
  const methods = METHODS[cmd] ?? [];
  return [
    {
      kind: "segs", segs: [
        { text: `> ${meta.icon}  `, color: meta.color },
        { text: meta.label, color: meta.color, bold: true },
      ],
    },
    { kind: "blank" },
    ...methods.map((m): TermLine => ({ kind: "method", category: cmd, name: m.name, desc: m.desc, free: m.free })),
    { kind: "blank" },
    {
      kind: "segs", segs: [
        { text: "  > Next: ", color: T.textDim },
        { text: "categories", color: T.accent, clickCmd: "categories" },
        { text: "  ·  ", color: T.textFaint },
        { text: "install", color: T.accentAlt, clickCmd: "install" },
        { text: "  ·  ", color: T.textFaint },
        { text: "help", color: T.textDim, clickCmd: "help" },
      ],
    },
  ];
}

function demoLines(): TermLine[] {
  return [
    { kind: "segs", segs: [{ text: "> Live example — multi-API in one call:", color: T.text, bold: true }] },
    { kind: "blank" },
    {
      kind: "segs", segs: [
        { text: "  import ", color: T.accent },
        { text: "{ bemora } ", color: T.text },
        { text: "from ", color: T.accent },
        { text: "'bemora'", color: T.green },
        { text: ";", color: T.textDim },
      ],
    },
    { kind: "blank" },
    {
      kind: "segs", segs: [
        { text: "  // Parallel calls — smart fallback chains under the hood", color: T.textFaint },
      ],
    },
    {
      kind: "segs", segs: [
        { text: "  const ", color: T.accent },
        { text: "[weather, btc, poke] = await ", color: T.text },
        { text: "Promise.all", color: T.accentAlt },
        { text: "([", color: T.text },
      ],
    },
    {
      kind: "segs", segs: [
        { text: "    bemora", color: T.accentAlt },
        { text: ".getWeather(", color: T.text },
        { text: "'Cairo'", color: T.green },
        { text: "),", color: T.text },
      ],
    },
    {
      kind: "segs", segs: [
        { text: "    bemora", color: T.accentAlt },
        { text: ".getPrice(", color: T.text },
        { text: "'BTC'", color: T.orange },
        { text: "),", color: T.text },
      ],
    },
    {
      kind: "segs", segs: [
        { text: "    bemora", color: T.accentAlt },
        { text: ".getPokemon(", color: T.text },
        { text: "'pikachu'", color: T.green },
        { text: "),", color: T.text },
      ],
    },
    { kind: "segs", segs: [{ text: "  ]);", color: T.text }] },
    { kind: "blank" },
    {
      kind: "segs", segs: [
        { text: "  // Output:", color: T.textFaint },
      ],
    },
    {
      kind: "segs", segs: [
        { text: "  weather", color: T.text },
        { text: " → ", color: T.textFaint },
        { text: "{ city: 'Cairo', temp: 38, condition: 'Sunny', humidity: 22 }", color: T.green },
      ],
    },
    {
      kind: "segs", segs: [
        { text: "  btc    ", color: T.text },
        { text: " → ", color: T.textFaint },
        { text: "{ symbol: 'BTC', price: 67420.15, change24h: +2.3 }", color: T.orange },
      ],
    },
    {
      kind: "segs", segs: [
        { text: "  poke   ", color: T.text },
        { text: " → ", color: T.textFaint },
        { text: "{ name: 'pikachu', type: 'Electric', hp: 35, speed: 90 }", color: T.accentAlt },
      ],
    },
    { kind: "blank" },
    {
      kind: "segs", segs: [
        { text: "  ✓ ", color: T.green },
        { text: "Zero API keys required for free-tier endpoints.", color: T.textDim },
      ],
    },
  ];
}

function errorLines(raw: string): TermLine[] {
  return [
    {
      kind: "segs", segs: [
        { text: "  ✗ command not found: ", color: "#f06292" },
        { text: raw, color: "#f06292", bold: true },
        { text: "   try ", color: T.textDim },
        { text: "help", color: T.accent, clickCmd: "help" },
      ],
    },
  ];
}

const VALID_CMDS = new Set(["help","install","categories","demo","clear","weather","crypto","ai","gaming","realtime"]);

function getLines(cmd: string): TermLine[] {
  const c = cmd.trim().toLowerCase();
  if (c === "help")       return helpLines();
  if (c === "install")    return installLines();
  if (c === "categories") return categoriesLines();
  if (c === "demo")       return demoLines();
  if (c === "clear")      return [];
  if (CATEGORIES.find(x => x.name === c)) return methodLines(c);
  return errorLines(cmd.trim());
}

// ─── Particle/Stars background ───────────────────────────────────────────────

function StarField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = 0, H = 0;

    type Star = { x: number; y: number; r: number; speed: number; opacity: number; color: string };
    let stars: Star[] = [];

    const COLORS = ["#7c6af7","#4fc3f7","#43e97b","#ffffff"];
    const resize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
      stars = Array.from({ length: 80 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.2 + 0.2,
        speed: Math.random() * 0.15 + 0.03,
        opacity: Math.random() * 0.5 + 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };
    resize();

    let raf: number;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color + Math.round(s.opacity * 255).toString(16).padStart(2,"0");
        ctx.fill();
        s.y -= s.speed;
        if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }
      }
    };
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return (
    <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.45 }} />
  );
}

// ─── Banner ───────────────────────────────────────────────────────────────────

function BannerLine() {
  return (
    <div style={{ padding: "6px 0 2px", userSelect: "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: "linear-gradient(135deg, #7c6af7, #4fc3f7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, flexShrink: 0,
        }}>
          📦
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: T.accent, letterSpacing: "-0.02em" }}>bemora</span>
            <span style={{ fontSize: 11, color: T.green, border: `1px solid ${T.green}33`, borderRadius: 4, padding: "1px 6px" }}>v3.6.0</span>
            <span style={{ fontSize: 11, color: T.textDim }}>MIT</span>
          </div>
          <div style={{ fontSize: 11, color: T.textDim, marginTop: 1 }}>
            94+ categories · 320+ methods · zero-key free tier · MCP server · real-time WebSockets
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Method line card ─────────────────────────────────────────────────────────

function MethodLine({ name, desc, free }: { category: string; name: string; desc: string; free: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        margin: "2px 0",
        padding: "5px 10px",
        borderRadius: 5,
        border: `1px solid ${hovered ? T.border : T.skillBorder}`,
        background: hovered ? T.skillHoverBg : T.skillBg,
        transition: "all 0.15s",
        cursor: "default",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 0, fontSize: 13, whiteSpace: "pre", fontFamily: "inherit" }}>
        <span style={{ color: T.green, marginRight: 8, fontSize: 11 }}>fn</span>
        <span style={{ color: T.accentAlt, minWidth: 270 }}>{name}</span>
        <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 3, background: free ? T.green + "22" : T.accent + "22", color: free ? T.green : T.accent, border: `1px solid ${free ? T.green : T.accent}44`, marginRight: 10 }}>
          {free ? "free" : "key"}
        </span>
      </div>
      {hovered && (
        <div style={{ fontSize: 11, color: T.textDim, marginTop: 2, paddingLeft: 26 }}>
          └ {desc}
        </div>
      )}
    </div>
  );
}

// ─── Segment line ─────────────────────────────────────────────────────────────

function SegLine({ segs, onCommand }: { segs: Seg[]; onCommand: (cmd: string) => void }) {
  return (
    <div style={{ fontSize: 13, lineHeight: "1.75", whiteSpace: "pre", fontFamily: "inherit" }}>
      {segs.map((seg, i) =>
        seg.clickCmd ? (
          <span key={i} onClick={() => onCommand(seg.clickCmd!)}
            style={{ color: seg.color ?? T.text, fontWeight: seg.bold ? "700" : undefined, cursor: "pointer", textDecoration: "underline", textDecorationColor: (seg.color ?? T.accent) + "55" }}
          >{seg.text}</span>
        ) : (
          <span key={i} style={{ color: seg.color ?? T.text, fontWeight: seg.bold ? "700" : undefined }}>{seg.text}</span>
        )
      )}
    </div>
  );
}

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

  const killTimers = () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };
  const push = (t: ReturnType<typeof setTimeout>) => timersRef.current.push(t);

  const reveal = (newLines: TermLine[]) => {
    setLines(newLines);
    setVisibleCount(0);
    setBusy(true);
    newLines.forEach((_, i) => {
      push(setTimeout(() => {
        setVisibleCount(i + 1);
        if (i === newLines.length - 1) setBusy(false);
      }, i * 75));
    });
    if (newLines.length === 0) setBusy(false);
  };

  const execute = (cmd: string) => {
    const c = cmd.trim().toLowerCase();
    if (!c) return;
    killTimers();
    setFading(true);
    push(setTimeout(() => { setFading(false); reveal(getLines(c)); }, 150));
  };

  const handleLinkClick = (cmd: string) => {
    if (busy) return;
    setInput("");
    let idx = 0;
    const typeNext = () => {
      idx += 1;
      setInput(cmd.slice(0, idx));
      if (idx < cmd.length) push(setTimeout(typeNext, 45));
      else push(setTimeout(() => { setInput(""); execute(cmd); }, 200));
    };
    push(setTimeout(typeNext, 40));
  };

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !busy) { const val = input; setInput(""); execute(val); }
  };

  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [visibleCount]);

  // Boot: show welcome then auto-type "help"
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || booted) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      setBooted(true);
      const boot = welcomeLines();
      reveal(boot);
      const delay = boot.length * 75 + 500;
      push(setTimeout(() => {
        const cmd = "help";
        let idx = 0;
        const typeNext = () => {
          idx++;
          setInput(cmd.slice(0, idx));
          if (idx < cmd.length) push(setTimeout(typeNext, 55));
          else push(setTimeout(() => { setInput(""); execute(cmd); }, 250));
        };
        typeNext();
      }, delay));
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [booted]);

  useEffect(() => () => killTimers(), []);

  const QUICK_CMDS = ["help","install","categories","demo","weather","crypto","ai","gaming","realtime","clear"];

  return (
    <section id="skills" ref={sectionRef} className="section-padding bg-white border-t border-border">
      <div className="container-max">
        {/* Section header */}
        <div className="max-w-2xl mb-10">
          <span className="section-eyebrow">Open Source</span>
          <h2 className="section-title">My Package — Bemora</h2>
          <p className="section-subtitle">
            An API library I built and maintain — 94+ categories, 320+ methods, zero-key free tier, MCP server for AI agents. Type a command or click any highlighted text.
          </p>
        </div>

        {/* Terminal */}
        <div
          className="rounded-xl overflow-hidden shadow-2xl"
          style={{
            background: T.bg,
            border: `1px solid ${T.border}`,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
          }}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Title bar */}
          <div style={{ background: T.titleBg, borderBottom: `1px solid ${T.innerBorder}`, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
            <span style={{ marginLeft: 10, fontSize: 12, color: T.textDim }}>
              bemora — npm package terminal
            </span>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
              <a
                href="https://www.npmjs.com/package/bemora"
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{ fontSize: 11, color: T.accent, textDecoration: "none", border: `1px solid ${T.border}`, borderRadius: 4, padding: "2px 8px", fontFamily: "inherit" }}
              >
                npm ↗
              </a>
              <a
                href="https://github.com/Demon-radio/Bemora.lol"
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{ fontSize: 11, color: T.textDim, textDecoration: "none", border: `1px solid ${T.border}`, borderRadius: 4, padding: "2px 8px", fontFamily: "inherit" }}
              >
                GitHub ↗
              </a>
              <span style={{ fontSize: 11, color: T.green, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, display: "inline-block", animation: "pulse 2s infinite" }} />
                LIVE
              </span>
            </div>
          </div>

          {/* Output area */}
          <div style={{ position: "relative", minHeight: 360, maxHeight: 480, overflow: "hidden" }}>
            <StarField />
            {/* Subtle glow overlay */}
            <div aria-hidden style={{
              position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
              background: "radial-gradient(ellipse at 50% 0%, rgba(124,106,247,0.06) 0%, transparent 70%)",
            }} />
            <div
              ref={outputRef}
              style={{
                minHeight: 360, maxHeight: 480,
                overflowY: "auto", padding: "20px 28px 12px",
                position: "relative", zIndex: 2,
                opacity: fading ? 0 : 1, transition: "opacity 0.14s ease",
              }}
            >
              {lines.slice(0, visibleCount).map((line, i) => {
                if (line.kind === "blank")  return <div key={i} style={{ height: 4 }} />;
                if (line.kind === "banner") return <BannerLine key={i} />;
                if (line.kind === "method") return <MethodLine key={i} category={line.category} name={line.name} desc={line.desc} free={line.free} />;
                return <SegLine key={i} segs={line.segs} onCommand={handleLinkClick} />;
              })}
              {!fading && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, fontSize: 13 }}>
                  <span style={{ color: T.accent }}>❯</span>
                  <span style={{ width: 8, height: 15, background: T.accent, display: "inline-block", verticalAlign: "middle", opacity: 0.8, animation: "blink 1.1s step-end infinite" }} />
                </div>
              )}
            </div>
          </div>

          {/* Input row */}
          <div style={{ background: T.bg, borderTop: `1px solid ${T.innerBorder}`, padding: "10px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: T.accent, fontSize: 14 }}>❯</span>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleEnter}
                placeholder="type a command and press Enter…"
                autoComplete="off"
                spellCheck={false}
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  fontSize: 13, color: T.inputText, caretColor: T.accent,
                  fontFamily: "inherit", minWidth: 0,
                }}
                data-testid="input-terminal-command"
              />
              <button
                onClick={() => { if (input.trim() && !busy) { const v = input; setInput(""); execute(v); } }}
                disabled={!input.trim() || busy}
                style={{
                  fontSize: 12, padding: "3px 10px", borderRadius: 4, border: `1px solid ${T.border}`,
                  background: "transparent", color: T.accent, cursor: "pointer",
                  fontFamily: "inherit", opacity: (!input.trim() || busy) ? 0.3 : 1,
                }}
                data-testid="button-terminal-enter"
              >↵</button>
            </div>
          </div>

          {/* Quick-cmd bar */}
          <div style={{ background: T.titleBg, borderTop: `1px solid ${T.innerBorder}`, padding: "8px 16px", display: "flex", flexWrap: "wrap", gap: 6 }}>
            {QUICK_CMDS.map(cmd => (
              <button
                key={cmd}
                onClick={() => handleLinkClick(cmd)}
                style={{
                  fontSize: 11, padding: "3px 10px", borderRadius: 4,
                  border: `1px solid ${T.innerBorder}`, background: T.bg,
                  color: VALID_CMDS.has(cmd) ? T.accent : T.textDim,
                  cursor: "pointer", fontFamily: "inherit",
                  transition: "border-color 0.15s",
                }}
                data-testid={`button-quick-cmd-${cmd}`}
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
