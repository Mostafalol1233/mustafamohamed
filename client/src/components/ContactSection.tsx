import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Mail } from "lucide-react";
import { SiGithub, SiLinkedin, SiWhatsapp } from "react-icons/si";
import profileImage from "@assets/image_1756332525184.png";

type LineType = "out" | "user" | "ok" | "err" | "blank";
interface TLine {
  id: number;
  text: string;
  type: LineType;
  display: string;
  isProgress?: boolean;
}
type Step = "boot" | "name" | "method" | "contact" | "project" | "sending" | "done" | "fail" | "bye";

const SOCIALS = [
  { Icon: Mail, label: "Email", href: "mailto:overthegardenwall317@gmail.com", tip: "overthegardenwall317@gmail.com" },
  { Icon: SiGithub, label: "GitHub", href: "https://github.com/Bemora", tip: "github.com/Bemora" },
  { Icon: SiLinkedin, label: "LinkedIn", href: "https://linkedin.com/in/mustafa-bemo", tip: "linkedin.com/in/mustafa-bemo" },
  { Icon: SiWhatsapp, label: "WhatsApp", href: "https://wa.me/", tip: "WhatsApp" },
];

export default function ContactSection() {
  const [lines, setLines] = useState<TLine[]>([]);
  const [val, setVal] = useState("");
  const [step, setStep] = useState<Step>("boot");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  const userData = useRef({ name: "", method: "email", contact: "" });
  const lineId = useRef(0);
  const termRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scroll = () => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  };

  const addLine = (text: string, type: LineType = "out", instant = false): Promise<void> =>
    new Promise((resolve) => {
      const id = ++lineId.current;
      setLines((prev) => [...prev, { id, text, type, display: instant || type === "blank" ? text : "" }]);
      if (instant || !text || type === "blank") { scroll(); resolve(); return; }
      let i = 0;
      const tick = () => {
        i++;
        setLines((prev) => prev.map((l) => l.id === id ? { ...l, display: text.slice(0, i) } : l));
        scroll();
        if (i < text.length) setTimeout(tick, 25);
        else resolve();
      };
      setTimeout(tick, 25);
    });

  const seq = async (
    items: Array<{ text: string; type?: LineType; delay?: number; instant?: boolean }>,
    next?: Step
  ) => {
    setBusy(true);
    for (const item of items) {
      if (item.delay) await new Promise((r) => setTimeout(r, item.delay));
      await addLine(item.text, item.type ?? "out", item.instant);
    }
    setBusy(false);
    if (next) setStep(next);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const progressBar = (): Promise<void> =>
    new Promise((resolve) => {
      const id = ++lineId.current;
      setLines((prev) => [...prev, { id, text: "", type: "out", display: "", isProgress: true }]);
      setProgress(0);
      let p = 0;
      const tick = () => {
        p = Math.min(p + 4, 100);
        setProgress(p);
        scroll();
        if (p < 100) setTimeout(tick, 40);
        else resolve();
      };
      setTimeout(tick, 40);
    });

  const mutation = useMutation({
    mutationFn: (payload: { name: string; email: string; subject: string; message: string }) =>
      apiRequest("POST", "/api/contact", payload),
    onSuccess: () => {
      seq([
        { text: "✓ Message delivered.", type: "ok" },
        { text: "> Expected response time: within 24h", delay: 300 },
        { text: "> Type 'restart' to send another message.", delay: 200 },
      ], "done");
    },
    onError: () => {
      setBusy(false);
      seq([{ text: "> Connection failed. Try again? [y/n]", type: "err" }], "fail");
    },
  });

  const doRestart = () => {
    setLines([]);
    setProgress(0);
    userData.current = { name: "", method: "email", contact: "" };
    seq([
      { text: "> Initializing contact protocol...", delay: 400 },
      { text: "> Encryption: enabled", delay: 150 },
      { text: "> Ready to establish connection.", delay: 150 },
      { text: "", type: "blank", delay: 800 },
      { text: "> What's your name?" },
    ], "name");
  };

  useEffect(() => {
    seq([
      { text: "> Initializing contact protocol...", delay: 400 },
      { text: "> Encryption: enabled", delay: 150 },
      { text: "> Ready to establish connection.", delay: 150 },
      { text: "", type: "blank", delay: 800 },
      { text: "> What's your name?" },
    ], "name");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (raw: string) => {
    if (busy) return;
    const v = raw.trim();
    if (!v) return;
    setVal("");
    await addLine(`~ ${v}`, "user", true);

    if (v.toLowerCase() === "restart") { doRestart(); return; }

    if (step === "fail") {
      if (v.toLowerCase() === "y") {
        const d = userData.current;
        setBusy(true);
        await addLine("> Retransmitting...", "out");
        await progressBar();
        mutation.mutate({
          name: d.name,
          email: d.method === "email" ? d.contact : `phone:${d.contact}`,
          subject: d.method === "phone" ? "Phone Contact" : "Portfolio Contact",
          message: "(retry)",
        });
      } else {
        await seq([{ text: "> Goodbye. Feel free to reach out anytime." }], "bye");
      }
      return;
    }

    if (step === "done" || step === "bye") return;

    if (step === "name") {
      userData.current.name = v;
      await seq([
        { text: `> Hey ${v}! Good to meet you.` },
        { text: "> How would you like to connect?" },
        { text: "  [1] Email" },
        { text: "  [2] Phone number" },
      ], "method");

    } else if (step === "method") {
      if (v === "1" || v.toLowerCase() === "email") {
        userData.current.method = "email";
        await seq([{ text: "> Enter your email address:" }], "contact");
      } else if (v === "2" || v.toLowerCase() === "phone") {
        userData.current.method = "phone";
        await seq([{ text: "> Enter your phone number:" }], "contact");
      } else {
        await seq([{ text: "> Please type 1 for Email or 2 for Phone.", type: "err" }]);
      }

    } else if (step === "contact") {
      if (userData.current.method === "email") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
          await seq([{ text: "> Invalid email format. Please re-enter:", type: "err" }]);
          return;
        }
      } else {
        if (!/^[\+\d][\d\s\-\(\)]{6,19}$/.test(v)) {
          await seq([{ text: "> Invalid phone number. Please re-enter:", type: "err" }]);
          return;
        }
      }
      userData.current.contact = v;
      await seq([{ text: "> What would you like to work on?" }], "project");

    } else if (step === "project") {
      setStep("sending");
      setBusy(true);
      await addLine("> Transmitting message...", "out");
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

  const lineColor = (type: LineType) => {
    if (type === "user") return "#ffffff";
    if (type === "ok") return "#3fb950";
    if (type === "err") return "#f85149";
    return "#c9d1d9";
  };

  const active = !busy && ["name", "method", "contact", "project", "fail", "done"].includes(step);

  return (
    <section id="contact" className="section-padding bg-[#fafafa] border-t border-border">
      <div className="container-max">
        <div className="max-w-2xl mb-14">
          <span className="section-eyebrow">Contact</span>
          <h2 className="section-title">Let's Work Together</h2>
          <p className="section-subtitle">Have a project in mind or just want to say hello? My inbox is always open.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* ── Terminal ── */}
          <div className="lg:col-span-3">
            <div className="rounded-xl overflow-hidden border border-[#30363d]" style={{ background: "#0d1117" }}>
              {/* macOS titlebar */}
              <div
                className="flex items-center gap-2 px-4 py-3 border-b border-[#21262d]"
                style={{ background: "#161b22" }}
              >
                <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <span
                  className="ml-4 text-xs text-[#8b949e]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  contact.sh
                </span>
              </div>

              {/* Terminal body */}
              <div
                ref={termRef}
                className="p-5 h-[420px] overflow-y-auto text-sm leading-7 cursor-text"
                style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
                onClick={() => inputRef.current?.focus()}
                data-testid="terminal-body"
              >
                {lines.map((line) =>
                  line.type === "blank" ? (
                    <div key={line.id} className="h-2" />
                  ) : line.isProgress ? (
                    <div key={line.id} className="flex items-center gap-1 my-1 flex-wrap">
                      <span style={{ color: "#58a6ff" }}>{">"}</span>
                      <span style={{ color: "#c9d1d9" }}>&nbsp;[</span>
                      <span style={{ color: "#3fb950", letterSpacing: "-1px" }}>
                        {"█".repeat(Math.floor(progress / 5))}
                      </span>
                      <span style={{ color: "#21262d", letterSpacing: "-1px" }}>
                        {"░".repeat(20 - Math.floor(progress / 5))}
                      </span>
                      <span style={{ color: "#c9d1d9" }}>]&nbsp;</span>
                      <span style={{ color: "#c9d1d9" }}>{progress}%</span>
                    </div>
                  ) : (
                    <div key={line.id} style={{ color: lineColor(line.type) }}>
                      {line.display}
                    </div>
                  )
                )}

                {/* Clickable method buttons */}
                {step === "method" && !busy && (
                  <div className="flex gap-3 mt-3 mb-1">
                    {[
                      { v: "1", label: "[1] Email" },
                      { v: "2", label: "[2] Phone" },
                    ].map((opt) => (
                      <button
                        key={opt.v}
                        onClick={() => submit(opt.v)}
                        className="px-3 py-1 text-xs border rounded transition-colors"
                        style={{
                          fontFamily: "inherit",
                          borderColor: "#30363d",
                          color: "#c9d1d9",
                          background: "transparent",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3fb950")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#30363d")}
                        data-testid={`btn-method-${opt.v === "1" ? "email" : "phone"}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input row */}
                {active && (
                  <div className="flex items-center gap-2 mt-2">
                    <span style={{ color: "#58a6ff" }}>~</span>
                    <input
                      ref={inputRef}
                      value={val}
                      onChange={(e) => setVal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          submit(val);
                        }
                      }}
                      className="flex-1 bg-transparent border-none outline-none text-sm"
                      style={{ fontFamily: "inherit", color: "#ffffff", caretColor: "#ffffff" }}
                      autoFocus
                      autoComplete="off"
                      spellCheck={false}
                      data-testid="input-terminal"
                    />
                    {!val && (
                      <span className="animate-blink select-none" style={{ color: "#ffffff" }}>
                        ▌
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Info card ── */}
          <div className="lg:col-span-2">
            <div className="card-base p-8 flex flex-col items-center text-center gap-5">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={profileImage}
                  alt="Mustafa Mohamed"
                  className="w-20 h-20 rounded-full object-cover border-2 border-border pointer-events-none"
                  style={{ objectPosition: "center 20%" }}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
                <span
                  className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-white animate-pulse-dot"
                  style={{ background: "#3fb950" }}
                />
              </div>

              <div>
                <p className="font-semibold text-foreground">Mustafa Mohamed</p>
                <p className="text-xs text-muted-foreground mt-0.5">Full-Stack Developer & Content Strategist</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span
                  className="w-2 h-2 rounded-full animate-pulse-dot"
                  style={{ background: "#3fb950" }}
                />
                <span>Online</span>
                <span>·</span>
                <span>Responds within 24h</span>
              </div>

              <div className="w-full border-t border-border" />

              {/* Social icon buttons with tooltips */}
              <div className="flex gap-3 justify-center">
                {SOCIALS.map(({ Icon, label, href, tip }) => (
                  <div key={label} className="relative group">
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                      aria-label={label}
                      data-testid={`link-social-${label.toLowerCase()}`}
                    >
                      <Icon size={18} />
                    </a>
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs font-medium bg-foreground text-background whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {tip}
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-full border-t border-border" />

              <p className="text-xs text-muted-foreground leading-relaxed italic">
                "Creating digital experiences that make a difference, one project at a time."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
