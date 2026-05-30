import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendContactMessage } from "@/lib/supabase";
import { Mail } from "lucide-react";
import { SiGithub, SiLinkedin, SiWhatsapp } from "react-icons/si";
import profileImage from "@assets/image_1756332525184.png";
import { useLang } from "@/contexts/LanguageContext";

type LineType = "out" | "user" | "ok" | "err" | "blank";
interface TLine { id: number; text: string; type: LineType; display: string; isProgress?: boolean; }
type Step = "boot" | "name" | "method" | "contact" | "project" | "sending" | "done" | "fail" | "bye";

const SOCIALS = [
  { Icon: Mail,        label: "Email",    href: "mailto:overthegardenwall317@gmail.com", tip: "overthegardenwall317@gmail.com" },
  { Icon: SiGithub,   label: "GitHub",   href: "https://github.com/Bemora",             tip: "github.com/Bemora" },
  { Icon: SiLinkedin, label: "LinkedIn", href: "https://linkedin.com/in/mustafa-bemo",  tip: "linkedin.com/in/mustafa-bemo" },
  { Icon: SiWhatsapp, label: "WhatsApp", href: "https://wa.me/",                        tip: "WhatsApp" },
];

const lineColor = (type: LineType) => {
  if (type === "user") return "#e6edf3";
  if (type === "ok")   return "#3fb950";
  if (type === "err")  return "#f85149";
  return "#8b949e";
};

export default function ContactSection() {
  const { t } = useLang();
  const tRef = useRef(t);
  useEffect(() => { tRef.current = t; }, [t]);

  const [lines, setLines]       = useState<TLine[]>([]);
  const [val, setVal]           = useState("");
  const [step, setStep]         = useState<Step>("boot");
  const [busy, setBusy]         = useState(false);
  const [progress, setProgress] = useState(0);
  const userData = useRef({ name: "", method: "email", contact: "" });
  const lineId   = useRef(0);
  const termRef  = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scroll = () => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  };

  const addLine = (text: string, type: LineType = "out", instant = false): Promise<void> =>
    new Promise(resolve => {
      const id = ++lineId.current;
      setLines(prev => [...prev, { id, text, type, display: instant || type === "blank" ? text : "" }]);
      if (instant || !text || type === "blank") { scroll(); resolve(); return; }
      let i = 0;
      const tick = () => {
        i++;
        setLines(prev => prev.map(l => l.id === id ? { ...l, display: text.slice(0, i) } : l));
        scroll();
        if (i < text.length) setTimeout(tick, 20);
        else resolve();
      };
      setTimeout(tick, 20);
    });

  const seq = async (
    items: Array<{ text: string; type?: LineType; delay?: number; instant?: boolean }>,
    next?: Step,
  ) => {
    setBusy(true);
    for (const item of items) {
      if (item.delay) await new Promise(r => setTimeout(r, item.delay));
      await addLine(item.text, item.type ?? "out", item.instant);
    }
    setBusy(false);
    if (next) setStep(next);
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 50);
  };

  const progressBar = (): Promise<void> =>
    new Promise(resolve => {
      const id = ++lineId.current;
      setLines(prev => [...prev, { id, text: "", type: "out", display: "", isProgress: true }]);
      setProgress(0);
      let p = 0;
      const tick = () => {
        p = Math.min(p + 3, 100);
        setProgress(p);
        scroll();
        if (p < 100) setTimeout(tick, 40);
        else resolve();
      };
      setTimeout(tick, 40);
    });

  const mutation = useMutation({
    mutationFn: async (payload: { name: string; email: string; subject: string; message: string }) => {
      await sendContactMessage(payload);
    },
    onSuccess: () => {
      const c = tRef.current.contact;
      seq([
        { text: c.success1, type: "ok" },
        { text: c.success2, delay: 300 },
        { text: c.success3, delay: 200 },
      ], "done");
    },
    onError: () => {
      setBusy(false);
      seq([{ text: tRef.current.contact.err_conn, type: "err" }], "fail");
    },
  });

  const doRestart = () => {
    setLines([]); setProgress(0);
    userData.current = { name: "", method: "email", contact: "" };
    const c = tRef.current.contact;
    seq([
      { text: c.boot1, delay: 300 },
      { text: c.boot2, delay: 120 },
      { text: c.boot3, delay: 120 },
      { text: "", type: "blank", delay: 500 },
      { text: c.ask_name },
    ], "name");
  };

  useEffect(() => { doRestart(); }, []);

  const submit = async (raw: string) => {
    if (busy) return;
    const v = raw.trim();
    if (!v) return;
    setVal("");
    await addLine(`$ ${v}`, "user", true);
    const c = tRef.current.contact;
    if (v.toLowerCase() === "restart") { doRestart(); return; }
    if (step === "fail") {
      if (v.toLowerCase() === "y") {
        const d = userData.current;
        setBusy(true);
        await addLine(c.retransmit, "out");
        await progressBar();
        mutation.mutate({
          name: d.name,
          email: d.method === "email" ? d.contact : `phone:${d.contact}`,
          subject: d.method === "phone" ? "Phone Contact" : "Portfolio Contact",
          message: "(retry)",
        });
      } else {
        seq([{ text: c.goodbye }], "bye");
      }
      return;
    }
    if (step === "done" || step === "bye") return;
    if (step === "name") {
      userData.current.name = v;
      seq([
        { text: c.greet.replace("{name}", v) },
        { text: c.ask_method },
        { text: `  ${c.opt_email}` },
        { text: `  ${c.opt_phone}` },
      ], "method");
    } else if (step === "method") {
      if (v === "1" || v.toLowerCase() === "email") {
        userData.current.method = "email";
        seq([{ text: c.ask_email }], "contact");
      } else if (v === "2" || v.toLowerCase() === "phone") {
        userData.current.method = "phone";
        seq([{ text: c.ask_phone }], "contact");
      } else {
        seq([{ text: c.err_method, type: "err" }]);
      }
    } else if (step === "contact") {
      if (userData.current.method === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        seq([{ text: c.err_invalid_email, type: "err" }]); return;
      }
      if (userData.current.method === "phone" && !/^[\+\d][\d\s\-\(\)]{6,19}$/.test(v)) {
        seq([{ text: c.err_invalid_phone, type: "err" }]); return;
      }
      userData.current.contact = v;
      seq([{ text: c.ask_project }], "project");
    } else if (step === "project") {
      setStep("sending"); setBusy(true);
      await addLine(c.sending, "out");
      await progressBar();
      const d = userData.current;
      mutation.mutate({
        name: d.name,
        email: d.method === "email" ? d.contact : `phone:${d.contact}`,
        subject: d.method === "phone" ? "Phone Contact" : "Portfolio Contact",
        message: v,
      });
    }
  };

  const active = !busy && ["name", "method", "contact", "project", "fail", "done"].includes(step);

  return (
    <section id="contact" className="section-padding bg-background border-t border-border">
      <div className="container-max">
        <div className="max-w-2xl mb-14">
          <span className="section-eyebrow">{t.sections.contact}</span>
          <h2 className="section-title">{t.contact.title}</h2>
          <p className="section-subtitle">{t.contact.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* ── Terminal ── */}
          <div className="lg:col-span-3">
            <div
              className="rounded-xl overflow-hidden shadow-xl"
              style={{ background: "#0d1117", border: "1px solid #30363d" }}
            >
              {/* Title bar */}
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{ background: "#161b22", borderBottom: "1px solid #21262d" }}
              >
                <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f56" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "#27c93f" }} />
                <span
                  className="ml-4 text-xs select-none"
                  style={{ color: "#8b949e", fontFamily: "monospace" }}
                >
                  contact.sh
                </span>
              </div>

              {/* Body */}
              <div
                ref={termRef}
                className="p-5 overflow-y-auto cursor-text"
                style={{
                  height: "380px",
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  fontSize: "13px",
                  lineHeight: "1.8",
                }}
                onClick={() => inputRef.current?.focus()}
                data-testid="terminal-body"
              >
                {lines.map(line =>
                  line.type === "blank" ? (
                    <div key={line.id} style={{ height: 4 }} />
                  ) : line.isProgress ? (
                    <div
                      key={line.id}
                      className="flex items-center gap-1 flex-wrap"
                      style={{ color: "#8b949e" }}
                    >
                      <span style={{ color: "#58a6ff" }}>{">"}</span>
                      &nbsp;[
                      <span style={{ color: "#3fb950", letterSpacing: "-1px" }}>
                        {"█".repeat(Math.floor(progress / 5))}
                      </span>
                      <span style={{ color: "#21262d", letterSpacing: "-1px" }}>
                        {"░".repeat(20 - Math.floor(progress / 5))}
                      </span>
                      ]&nbsp;{progress}%
                    </div>
                  ) : (
                    <div key={line.id} style={{ color: lineColor(line.type) }}>
                      {line.type === "out" && (
                        <span style={{ color: "#58a6ff", marginRight: 6 }}>{">"}</span>
                      )}
                      {line.display}
                    </div>
                  )
                )}

                {/* Method buttons */}
                {step === "method" && !busy && (
                  <div className="flex gap-2 mt-2 mb-1">
                    {[
                      { v: "1", label: t.contact.opt_email },
                      { v: "2", label: t.contact.opt_phone },
                    ].map(opt => (
                      <button
                        key={opt.v}
                        onClick={() => submit(opt.v)}
                        className="px-3 py-0.5 text-xs rounded border transition-colors"
                        style={{
                          fontFamily: "inherit",
                          borderColor: "#30363d",
                          color: "#8b949e",
                          background: "transparent",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = "#3fb950";
                          e.currentTarget.style.color = "#3fb950";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = "#30363d";
                          e.currentTarget.style.color = "#8b949e";
                        }}
                        data-testid={`btn-method-${opt.v === "1" ? "email" : "phone"}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input row */}
                {active && (
                  <div className="flex items-center gap-2 mt-1">
                    <span style={{ color: "#8b949e", userSelect: "none" }}>~$</span>
                    <div className="relative flex-1 flex items-center">
                      <input
                        ref={inputRef}
                        value={val}
                        onChange={e => setVal(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            submit(val);
                          }
                        }}
                        className="w-full bg-transparent border-none outline-none"
                        style={{
                          fontFamily: "inherit",
                          fontSize: "inherit",
                          color: "#e6edf3",
                          caretColor: "#e6edf3",
                        }}
                        autoComplete="off"
                        spellCheck={false}
                        data-testid="input-terminal"
                      />
                      {!val && (
                        <span
                          className="animate-blink absolute left-0 pointer-events-none"
                          style={{ color: "#e6edf3" }}
                        >
                          ▌
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {(step === "done" || step === "bye") && (
                  <div className="mt-3">
                    <button
                      onClick={doRestart}
                      className="text-xs px-3 py-1 rounded border transition-colors"
                      style={{
                        fontFamily: "inherit",
                        borderColor: "#30363d",
                        color: "#8b949e",
                        background: "transparent",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = "#3fb950";
                        e.currentTarget.style.color = "#3fb950";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = "#30363d";
                        e.currentTarget.style.color = "#8b949e";
                      }}
                    >
                      restart
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Info card ── */}
          <div className="lg:col-span-2">
            <div
              className="p-8 flex flex-col items-center text-center gap-5 rounded-xl"
              style={{
                background: "#0d1117",
                border: "1px solid #30363d",
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              }}
            >
              <div className="relative">
                <img
                  src={profileImage}
                  alt="Mustafa Mohamed"
                  className="w-20 h-20 rounded-full object-cover pointer-events-none"
                  style={{
                    objectPosition: "center 20%",
                    border: "2px solid #30363d",
                    boxShadow: "0 0 0 3px rgba(88,166,255,0.1)",
                  }}
                  draggable={false}
                  onContextMenu={e => e.preventDefault()}
                />
                <span
                  className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full animate-pulse-dot"
                  style={{ background: "#3fb950", border: "2px solid #0d1117" }}
                />
              </div>
              <div>
                <p className="font-semibold" style={{ color: "#e6edf3" }}>Mustafa Mohamed</p>
                <p className="text-xs mt-0.5" style={{ color: "#58a6ff", fontFamily: "inherit" }}>
                  Full-Stack Developer
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: "#8b949e" }}>
                <span
                  className="w-2 h-2 rounded-full animate-pulse-dot"
                  style={{ background: "#3fb950" }}
                />
                <span>{t.contact.online}</span>
              </div>
              <div className="w-full" style={{ borderTop: "1px solid #21262d" }} />
              <div className="flex gap-3 justify-center">
                {SOCIALS.map(({ Icon, label, href, tip }) => (
                  <div key={label} className="relative group">
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-all"
                      style={{
                        border: "1px solid #30363d",
                        color: "#8b949e",
                        background: "transparent",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = "#58a6ff";
                        e.currentTarget.style.color = "#58a6ff";
                        e.currentTarget.style.background = "rgba(88,166,255,0.08)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = "#30363d";
                        e.currentTarget.style.color = "#8b949e";
                        e.currentTarget.style.background = "transparent";
                      }}
                      aria-label={label}
                      data-testid={`link-social-${label.toLowerCase()}`}
                    >
                      <Icon size={18} />
                    </a>
                    <div
                      className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
                      style={{ background: "#161b22", color: "#e6edf3", border: "1px solid #30363d" }}
                    >
                      {tip}
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-full" style={{ borderTop: "1px solid #21262d" }} />
              <p className="text-xs leading-relaxed italic" style={{ color: "#484f58", fontFamily: "inherit" }}>
                "{t.contact.quote}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
