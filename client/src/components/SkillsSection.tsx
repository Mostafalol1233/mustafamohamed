import { useEffect, useRef, useState, KeyboardEvent } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Seg = { text: string; color?: string; bold?: boolean; clickCmd?: string };
type TermLine =
  | { kind: "segs"; segs: Seg[] }
  | { kind: "blank" }
  | { kind: "method"; name: string; desc: string; free: boolean };

// ─── Palette — minimal: 2 colors only ────────────────────────────────────────
const BG      = "#0f0f0f";
const ACCENT  = "#a78bfa";   // bemora purple — the ONLY accent color
const DIM     = "#52525b";
const MUTED   = "#3f3f46";
const BRIGHT  = "#e4e4e7";
const GREEN   = "#4ade80";

// ─── CLI data ─────────────────────────────────────────────────────────────────
const CATS = [
  { name: "weather",  count: 8,  label: "Weather & Climate"  },
  { name: "crypto",   count: 24, label: "Crypto & Coin Wizard"},
  { name: "ai",       count: 18, label: "AI / LLM Providers" },
  { name: "gaming",   count: 22, label: "Gaming Suite"        },
  { name: "news",     count: 6,  label: "News & RSS"          },
  { name: "realtime", count: 8,  label: "WebSocket Streams"   },
  { name: "space",    count: 5,  label: "Space & Astronomy"   },
  { name: "tools",    count: 30, label: "Dev Tools & Utils"   },
];

const METHODS: Record<string, { name: string; desc: string; free: boolean }[]> = {
  weather: [
    { name: "getWeather(city)",        desc: "Current conditions — temp, humidity, wind, UV index", free: true },
    { name: "getForecast(city, days)", desc: "Daily forecast up to 16 days ahead",                  free: true },
    { name: "getAQI(city)",            desc: "Real-time air quality index",                         free: true },
    { name: "getAlerts(lat, lon)",     desc: "Severe weather alerts for a coordinate",              free: true },
  ],
  crypto: [
    { name: "getPrice(symbol)",        desc: "Live price — Binance + CoinGecko fallback chain",     free: true },
    { name: "streamPrice(sym, cb)",    desc: "Real-time price stream via WebSocket",                free: true },
    { name: "coinWizard(query)",       desc: "Smart crypto query — trends, volume, history",        free: true },
    { name: "getMarketCap(topN)",      desc: "Top-N coins by market cap",                          free: true },
  ],
  ai: [
    { name: "chat(prompt, model?)",    desc: "Multi-provider: OpenAI · Groq · Claude, with fallback", free: false },
    { name: "streamChat(prompt, cb)",  desc: "Streaming completions with token callbacks",             free: false },
    { name: "embedText(text)",         desc: "Text embeddings for semantic search",                    free: false },
  ],
  gaming: [
    { name: "getPokemon(name)",        desc: "Full Pokédex entry — stats, moves, evolution", free: true },
    { name: "getFortniteStats(user)",  desc: "Fortnite player stats and season data",         free: true },
    { name: "getChessGames(user)",     desc: "Chess.com / Lichess game history",              free: true },
    { name: "getCrossfireData()",      desc: "CrossFire weapons, maps, characters",           free: true },
  ],
  realtime: [
    { name: "ws.crypto(syms[], cb)",   desc: "Multi-symbol price stream (Binance + Kraken)", free: true },
    { name: "ws.monitor(url, cb)",     desc: "Website uptime monitor via WebSocket",         free: true },
    { name: "mcp.start(port?)",        desc: "Launch MCP server for AI agent tool calls",    free: true },
  ],
  space: [
    { name: "getAPOD()",               desc: "NASA Astronomy Picture of the Day",            free: true },
    { name: "getISS()",                desc: "International Space Station live position",    free: true },
    { name: "getSunrise(lat, lon)",    desc: "Sunrise / sunset times for any coordinate",   free: true },
  ],
  news: [
    { name: "getNews(query)",          desc: "Top news articles via RSS aggregation",        free: true },
    { name: "getHeadlines(country?)",  desc: "Breaking headlines by country",               free: true },
  ],
  tools: [
    { name: "uuid()",                  desc: "Generate a v4 UUID",                          free: true },
    { name: "hash(text, algo?)",       desc: "SHA-256 / MD5 / SHA-1 hash",                  free: true },
    { name: "base64.encode(str)",      desc: "Base64 encode / decode",                      free: true },
    { name: "translateText(text, to)", desc: "Translate text to any language",              free: true },
  ],
};

// ─── Line factories ───────────────────────────────────────────────────────────
function helpLines(): TermLine[] {
  const row = (cmd: string, desc: string): TermLine => ({
    kind: "segs",
    segs: [
      { text: "  $ bemora ", color: MUTED },
      { text: cmd.padEnd(13), color: ACCENT, clickCmd: cmd, bold: true },
      { text: desc, color: DIM },
    ],
  });
  return [
    { kind: "segs", segs: [{ text: "> commands", color: BRIGHT, bold: true }] },
    { kind: "blank" },
    row("install",    "— setup guide & quick start"),
    row("categories", "— browse all 94+ API categories"),
    row("demo",       "— show a code example"),
    row("weather",    "— weather & climate methods"),
    row("crypto",     "— crypto & Coin Wizard"),
    row("ai",         "— multi-provider LLM APIs"),
    row("gaming",     "— gaming suite methods"),
    row("realtime",   "— WebSocket & MCP"),
    row("clear",      "— clear screen"),
    { kind: "blank" },
    {
      kind: "segs", segs: [
        { text: "  94+ categories · 320+ methods · zero-key free tier · MCP server", color: MUTED },
      ],
    },
  ];
}

function installLines(): TermLine[] {
  return [
    { kind: "segs", segs: [{ text: "> installation", color: BRIGHT, bold: true }] },
    { kind: "blank" },
    { kind: "segs", segs: [{ text: "  $ npm install bemora", color: GREEN, bold: true }] },
    { kind: "blank" },
    {
      kind: "segs", segs: [
        { text: "  import ", color: ACCENT },
        { text: "{ bemora } from ", color: BRIGHT },
        { text: "'bemora'", color: GREEN },
      ],
    },
    { kind: "blank" },
    {
      kind: "segs", segs: [
        { text: "  const weather = await bemora", color: BRIGHT },
        { text: ".getWeather(", color: ACCENT },
        { text: "'Cairo'", color: GREEN },
        { text: ");", color: DIM },
      ],
    },
    {
      kind: "segs", segs: [
        { text: "  const price   = await bemora", color: BRIGHT },
        { text: ".getPrice(", color: ACCENT },
        { text: "'BTC'", color: GREEN },
        { text: ");", color: DIM },
      ],
    },
    {
      kind: "segs", segs: [
        { text: "  const poke    = await bemora", color: BRIGHT },
        { text: ".getPokemon(", color: ACCENT },
        { text: "'pikachu'", color: GREEN },
        { text: ");", color: DIM },
      ],
    },
    { kind: "blank" },
    {
      kind: "segs", segs: [
        { text: "  CLI  $ bemora weather Cairo", color: DIM },
      ],
    },
    {
      kind: "segs", segs: [
        { text: "  MCP  $ bemora-mcp --port 3100", color: DIM },
      ],
    },
    { kind: "blank" },
    {
      kind: "segs", segs: [
        { text: "  github.com/Demon-radio/Bemora.lol", color: ACCENT },
      ],
    },
  ];
}

function categoriesLines(): TermLine[] {
  return [
    { kind: "segs", segs: [{ text: "> 94 categories", color: BRIGHT, bold: true }] },
    { kind: "blank" },
    ...CATS.map((c): TermLine => ({
      kind: "segs",
      segs: [
        { text: "  ✓ ", color: GREEN },
        { text: c.name.padEnd(12), color: ACCENT, clickCmd: c.name, bold: true },
        { text: `${String(c.count).padStart(2)} methods`, color: DIM },
        { text: "  ·  ", color: MUTED },
        { text: c.label, color: MUTED },
      ],
    })),
    { kind: "blank" },
    {
      kind: "segs", segs: [
        { text: "  …and 86 more. Click any name to inspect.", color: DIM },
      ],
    },
  ];
}

function methodLines(cmd: string): TermLine[] {
  const cat = CATS.find(c => c.name === cmd)!;
  const methods = METHODS[cmd] ?? [];
  return [
    { kind: "segs", segs: [{ text: `> ${cat.label}`, color: BRIGHT, bold: true }] },
    { kind: "blank" },
    ...methods.map((m): TermLine => ({ kind: "method", name: m.name, desc: m.desc, free: m.free })),
    { kind: "blank" },
    {
      kind: "segs", segs: [
        { text: "  ", color: DIM },
        { text: "categories", color: ACCENT, clickCmd: "categories" },
        { text: "  ·  ", color: MUTED },
        { text: "help", color: ACCENT, clickCmd: "help" },
      ],
    },
  ];
}

function demoLines(): TermLine[] {
  return [
    { kind: "segs", segs: [{ text: "> live example", color: BRIGHT, bold: true }] },
    { kind: "blank" },
    {
      kind: "segs", segs: [
        { text: "  import ", color: ACCENT },
        { text: "{ bemora } from ", color: BRIGHT },
        { text: "'bemora'", color: GREEN },
      ],
    },
    { kind: "blank" },
    { kind: "segs", segs: [{ text: "  // Parallel calls — smart fallback under the hood", color: MUTED }] },
    {
      kind: "segs", segs: [
        { text: "  const [w, btc, p] = await Promise.all([", color: BRIGHT },
      ],
    },
    { kind: "segs", segs: [{ text: "    bemora.getWeather('Cairo'),", color: DIM }] },
    { kind: "segs", segs: [{ text: "    bemora.getPrice('BTC'),", color: DIM }] },
    { kind: "segs", segs: [{ text: "    bemora.getPokemon('pikachu'),", color: DIM }] },
    { kind: "segs", segs: [{ text: "  ]);", color: BRIGHT }] },
    { kind: "blank" },
    {
      kind: "segs", segs: [
        { text: "  w   → ", color: DIM },
        { text: "{ city: 'Cairo', temp: 38, condition: 'Sunny' }", color: GREEN },
      ],
    },
    {
      kind: "segs", segs: [
        { text: "  btc → ", color: DIM },
        { text: "{ symbol: 'BTC', price: 67420, change24h: +2.3 }", color: ACCENT },
      ],
    },
    {
      kind: "segs", segs: [
        { text: "  p   → ", color: DIM },
        { text: "{ name: 'pikachu', type: 'Electric', speed: 90 }", color: BRIGHT },
      ],
    },
    { kind: "blank" },
    {
      kind: "segs", segs: [
        { text: "  ✓ zero API keys for free-tier endpoints", color: GREEN },
      ],
    },
  ];
}

function errorLine(raw: string): TermLine[] {
  return [{
    kind: "segs", segs: [
      { text: "  command not found: ", color: "#f87171" },
      { text: raw, color: "#f87171", bold: true },
      { text: "  — try ", color: DIM },
      { text: "help", color: ACCENT, clickCmd: "help" },
    ],
  }];
}

function getLines(cmd: string): TermLine[] {
  const c = cmd.trim().toLowerCase();
  if (c === "help")       return helpLines();
  if (c === "install")    return installLines();
  if (c === "categories") return categoriesLines();
  if (c === "demo")       return demoLines();
  if (c === "clear")      return [];
  if (CATS.find(x => x.name === c)) return methodLines(c);
  return errorLine(cmd.trim());
}

// ─── Method row ───────────────────────────────────────────────────────────────
function MethodRow({ name, desc, free }: { name: string; desc: string; free: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        margin: "1px 0", padding: "4px 8px", borderRadius: 4,
        background: hov ? "#1c1c1c" : "transparent",
        border: `1px solid ${hov ? MUTED : "transparent"}`,
        cursor: "default", transition: "all 0.12s",
      }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, whiteSpace: "pre", fontFamily: "inherit" }}>
        <span style={{ color: DIM, fontSize: 10 }}>fn</span>
        <span style={{ color: ACCENT, minWidth: 260 }}>{name}</span>
        <span style={{
          fontSize: 9, padding: "1px 5px", borderRadius: 3,
          color: free ? GREEN : ACCENT,
          border: `1px solid ${free ? GREEN : ACCENT}55`,
        }}>{free ? "free" : "key"}</span>
      </div>
      {hov && <div style={{ fontSize: 11, color: DIM, marginTop: 2, paddingLeft: 22 }}>└ {desc}</div>}
    </div>
  );
}

// ─── Seg line ─────────────────────────────────────────────────────────────────
function SegLine({ segs, onCmd }: { segs: Seg[]; onCmd: (c: string) => void }) {
  return (
    <div style={{ fontSize: 13, lineHeight: "1.7", whiteSpace: "pre", fontFamily: "inherit" }}>
      {segs.map((s, i) =>
        s.clickCmd ? (
          <span key={i} onClick={() => onCmd(s.clickCmd!)}
            style={{ color: s.color ?? BRIGHT, fontWeight: s.bold ? 700 : undefined, cursor: "pointer", textDecoration: "underline", textDecorationColor: (s.color ?? ACCENT) + "55" }}
          >{s.text}</span>
        ) : (
          <span key={i} style={{ color: s.color ?? BRIGHT, fontWeight: s.bold ? 700 : undefined }}>{s.text}</span>
        )
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SkillsSection() {
  const [phase, setPhase]               = useState<"welcome" | "terminal">("welcome");
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
    newLines.forEach((_, i) =>
      push(setTimeout(() => {
        setVisibleCount(i + 1);
        if (i === newLines.length - 1) setBusy(false);
      }, i * 65))
    );
    if (!newLines.length) setBusy(false);
  };

  const execute = (cmd: string) => {
    const c = cmd.trim();
    if (!c) return;
    killTimers();
    setFading(true);
    push(setTimeout(() => { setFading(false); reveal(getLines(c)); }, 140));
  };

  const handleLink = (cmd: string) => {
    if (busy) return;
    setInput("");
    let idx = 0;
    const type = () => {
      idx++;
      setInput(cmd.slice(0, idx));
      if (idx < cmd.length) push(setTimeout(type, 45));
      else push(setTimeout(() => { setInput(""); execute(cmd); }, 200));
    };
    push(setTimeout(type, 40));
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !busy) { const v = input; setInput(""); execute(v); }
  };

  const enterTerminal = () => {
    setPhase("terminal");
    push(setTimeout(() => {
      reveal(helpLines());
      inputRef.current?.focus();
    }, 80));
  };

  // Welcome → auto-enter after 3.5s, or on keypress
  useEffect(() => {
    if (phase !== "welcome" || !booted) return;
    const t = setTimeout(enterTerminal, 3500);
    const onKey = (e: globalThis.KeyboardEvent) => { if (e.key === "Enter") { clearTimeout(t); enterTerminal(); } };
    window.addEventListener("keydown", onKey);
    return () => { clearTimeout(t); window.removeEventListener("keydown", onKey); };
  }, [phase, booted]);

  // IntersectionObserver boot
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || booted) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      setBooted(true);
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [booted]);

  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [visibleCount]);

  useEffect(() => () => killTimers(), []);

  const QUICK = ["help","install","categories","demo","weather","crypto","ai","gaming","realtime"];

  return (
    <section id="skills" ref={sectionRef} className="section-padding bg-white border-t border-border">
      <div className="container-max">
        {/* Section header */}
        <div className="max-w-2xl mb-10">
          <span className="section-eyebrow">Open Source</span>
          <h2 className="section-title">My Package — Bemora</h2>
          <p className="section-subtitle">
            An open-source API library I built — 94+ categories, 320+ methods, zero-key free tier, MCP server for AI agents.
          </p>
        </div>

        {/* Terminal window */}
        <div
          className="rounded-xl overflow-hidden shadow-2xl"
          style={{
            background: BG,
            border: `1px solid #27272a`,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          }}
        >
          {/* Title bar */}
          <div style={{
            background: "#0a0a0a", borderBottom: "1px solid #27272a",
            padding: "10px 16px", display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
            <span style={{ marginLeft: 10, fontSize: 12, color: MUTED }}>
              {phase === "welcome" ? "bemora — welcome" : "bemora — npm package terminal"}
            </span>
            {phase === "terminal" && (
              <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
                <a href="https://www.npmjs.com/package/bemora" target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{ fontSize: 11, color: ACCENT, textDecoration: "none", border: `1px solid ${MUTED}`, borderRadius: 4, padding: "2px 8px" }}>
                  npm ↗
                </a>
                <a href="https://github.com/Demon-radio/Bemora.lol" target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{ fontSize: 11, color: DIM, textDecoration: "none", border: `1px solid ${MUTED}`, borderRadius: 4, padding: "2px 8px" }}>
                  GitHub ↗
                </a>
              </div>
            )}
          </div>

          {/* ── WELCOME PHASE ── */}
          {phase === "welcome" && (
            <div
              onClick={enterTerminal}
              style={{
                minHeight: 420, padding: "36px 40px 32px",
                display: "flex", flexDirection: "column",
                cursor: "pointer", userSelect: "none",
              }}
            >
              {/* "Welcome to bemora" badge */}
              <div style={{ marginBottom: "auto" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  fontSize: 13, color: BRIGHT,
                  border: `1px solid #27272a`, borderRadius: 4,
                  padding: "6px 14px",
                }}>
                  <span style={{ color: ACCENT }}>✦</span>
                  Welcome to{" "}
                  <strong style={{ color: ACCENT }}>bemora</strong>
                </span>
              </div>

              {/* Big pixel name */}
              <div style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                padding: "20px 0",
              }}>
                <div style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "clamp(28px, 5vw, 58px)",
                  color: ACCENT,
                  lineHeight: 1.4,
                  textAlign: "center",
                  letterSpacing: "0.05em",
                  textShadow: `0 0 40px ${ACCENT}44`,
                }}>
                  BEMORA
                </div>
              </div>

              {/* "Press Enter" */}
              <div style={{ fontSize: 13, color: DIM }}>
                Press <strong style={{ color: BRIGHT }}>Enter</strong> to continue
              </div>
            </div>
          )}

          {/* ── TERMINAL PHASE ── */}
          {phase === "terminal" && (
            <>
              {/* Output */}
              <div style={{ position: "relative", minHeight: 360, maxHeight: 480 }}>
                <div
                  ref={outputRef}
                  style={{
                    minHeight: 360, maxHeight: 480,
                    overflowY: "auto", padding: "20px 28px 12px",
                    opacity: fading ? 0 : 1, transition: "opacity 0.14s",
                  }}
                >
                  {lines.slice(0, visibleCount).map((line, i) => {
                    if (line.kind === "blank") return <div key={i} style={{ height: 4 }} />;
                    if (line.kind === "method") return <MethodRow key={i} name={line.name} desc={line.desc} free={line.free} />;
                    return <SegLine key={i} segs={line.segs} onCmd={handleLink} />;
                  })}
                  {!fading && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, fontSize: 13 }}>
                      <span style={{ color: ACCENT }}>❯</span>
                      <span style={{
                        width: 8, height: 15, background: ACCENT,
                        display: "inline-block", verticalAlign: "middle", opacity: 0.8,
                        animation: "blink 1.1s step-end infinite",
                      }} />
                    </div>
                  )}
                </div>
              </div>

              {/* Input */}
              <div style={{ background: BG, borderTop: "1px solid #27272a", padding: "10px 28px" }}
                onClick={() => inputRef.current?.focus()}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: ACCENT, fontSize: 14 }}>❯</span>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="type a command and press Enter…"
                    autoComplete="off" spellCheck={false}
                    style={{
                      flex: 1, background: "transparent", border: "none", outline: "none",
                      fontSize: 13, color: BRIGHT, caretColor: ACCENT,
                      fontFamily: "inherit", minWidth: 0,
                    }}
                    data-testid="input-terminal-command"
                  />
                  <button
                    onClick={() => { if (input.trim() && !busy) { const v = input; setInput(""); execute(v); } }}
                    disabled={!input.trim() || busy}
                    style={{
                      fontSize: 12, padding: "3px 10px", borderRadius: 4,
                      border: `1px solid ${MUTED}`, background: "transparent",
                      color: ACCENT, cursor: "pointer", fontFamily: "inherit",
                      opacity: (!input.trim() || busy) ? 0.3 : 1,
                    }}
                  >↵</button>
                </div>
              </div>

              {/* Quick-cmd bar */}
              <div style={{
                background: "#0a0a0a", borderTop: "1px solid #27272a",
                padding: "8px 16px", display: "flex", flexWrap: "wrap", gap: 6,
              }}>
                {QUICK.map(cmd => (
                  <button key={cmd} onClick={() => handleLink(cmd)}
                    style={{
                      fontSize: 11, padding: "3px 10px", borderRadius: 4,
                      border: `1px solid #27272a`, background: BG,
                      color: ACCENT, cursor: "pointer", fontFamily: "inherit",
                    }}
                    data-testid={`button-quick-cmd-${cmd}`}
                  >{cmd}</button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
