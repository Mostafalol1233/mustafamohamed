import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import { ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";
import { DragonConsole } from "./DragonConsole";
import { useLang } from "@/contexts/LanguageContext";

function inferCategory(p: Project): string {
  const t = (p.title + " " + (p.description ?? "")).toLowerCase();
  if (/gaming|game|gamer|bravezm|bestyboy/i.test(t)) return "Gaming";
  if (/academy|education|learn|course|school|helly/i.test(t)) return "Education";
  if (/shop|store|ecommerce|e-commerce|diaa|bemora/i.test(t)) return "E-commerce";
  if (/tool|calc|bmo|util/i.test(t)) return "Tools";
  if (/eco|sustain|food|green/i.test(t)) return "Sustainability";
  if (/team|squad|oneteam/i.test(t)) return "SaaS";
  if (/business|mr mo/i.test(t)) return "Business";
  return "Web App";
}

function extractDomain(url?: string | null): string {
  if (!url) return "portfolio.dev";
  try { return new URL(url).hostname.replace(/^www\./, ""); }
  catch { return url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]; }
}

const IMPACT_METRICS: Record<string, { label: string; value: string }[]> = {};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Gaming:         { bg: "#fff1f2", text: "#be123c", border: "#fecdd3" },
  Education:      { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  "E-commerce":   { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
  Tools:          { bg: "#fefce8", text: "#a16207", border: "#fef08a" },
  Sustainability: { bg: "#f0fdf4", text: "#166534", border: "#86efac" },
  SaaS:           { bg: "#f5f3ff", text: "#6d28d9", border: "#ddd6fe" },
  Business:       { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  "Web App":      { bg: "#f8fafc", text: "#475569", border: "#e2e8f0" },
};

function ProjectImage({ project, domain }: { project: Project; domain: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [project.id, project.imageUrl]);

  // Only use imageUrl if the admin has set one directly — no unreliable third-party screenshot services
  const imgSrc = project.imageUrl || null;

  if (!imgSrc || failed) {
    // Styled placeholder that looks intentional
    const cat = inferCategory(project);
    const catStyle = CATEGORY_COLORS[cat] ?? CATEGORY_COLORS["Web App"];
    return (
      <div style={{
        width: "100%", height: "100%",
        background: `linear-gradient(135deg, ${catStyle.bg} 0%, #f8fafc 100%)`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
      }}>
        {/* Fake browser chrome */}
        <div style={{
          width: "72%", borderRadius: 10, overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.10)", border: "1px solid #e5e7eb",
        }}>
          <div style={{ height: 28, background: "#f0f0f0", borderBottom: "1px solid #ddd", display: "flex", alignItems: "center", padding: "0 10px", gap: 6 }}>
            {["#ff5f57","#febc2e","#28c840"].map(c => <span key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, display: "block" }} />)}
            <div style={{ flex: 1, height: 14, background: "#fff", borderRadius: 4, border: "1px solid #ddd", marginLeft: 8, display: "flex", alignItems: "center", paddingLeft: 8 }}>
              <span style={{ fontSize: 9, color: "#9ca3af", fontFamily: "system-ui", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{domain}</span>
            </div>
          </div>
          <div style={{ height: 90, background: catStyle.bg, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "0 16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
              <div style={{ height: 8, background: catStyle.border, borderRadius: 4, width: "60%" }} />
              <div style={{ height: 6, background: catStyle.border, borderRadius: 4, width: "80%", opacity: 0.6 }} />
              <div style={{ height: 6, background: catStyle.border, borderRadius: 4, width: "45%", opacity: 0.4 }} />
            </div>
          </div>
        </div>
        <span style={{ fontSize: 12, color: catStyle.text, fontFamily: "system-ui", fontWeight: 500, opacity: 0.7 }}>
          {domain}
        </span>
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, #f1f5f9 25%, #e8edf4 50%, #f1f5f9 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s infinite",
        }} />
      )}
      <img
        src={imgSrc}
        alt={project.title}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        style={{
          width: "100%", height: "100%", objectFit: "cover", objectPosition: "top",
          opacity: loaded ? 1 : 0, transition: "opacity 0.4s ease",
          position: "absolute", inset: 0,
        }}
      />
    </>
  );
}

function BrowserMockup({ project, visible }: { project: Project; visible: boolean }) {
  const domain = extractDomain(project.liveUrl);
  return (
    <div style={{
      opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0.96)",
      transition: "opacity 0.4s ease-in-out, transform 0.4s ease-in-out",
      position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
      pointerEvents: visible ? "auto" : "none",
    }}>
      <div style={{
        width: "100%", maxWidth: "780px", borderRadius: "12px", overflow: "hidden",
        boxShadow: "0 24px 80px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.08)",
        border: "1px solid #e5e7eb", background: "#fff",
      }} data-testid={`browser-mockup-${project.id}`}>
        <div style={{ height: "36px", background: "#f0f0f0", borderBottom: "1px solid #ddd", display: "flex", alignItems: "center", padding: "0 14px", gap: 12, userSelect: "none" }}>
          <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
            {["#ff5f57","#febc2e","#28c840"].map(c => <span key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c, display: "block" }} />)}
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <div style={{ width: "44%", background: "#fff", border: "1px solid #ddd", borderRadius: "6px", height: "22px", display: "flex", alignItems: "center", paddingLeft: 10, paddingRight: 10, gap: 5 }}>
              <span style={{ fontSize: 11, color: "#555", fontFamily: "system-ui, sans-serif", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{domain}</span>
            </div>
          </div>
        </div>
        <div style={{ height: "340px", background: "#f8f9fa", overflow: "hidden", position: "relative" }}>
          <ProjectImage project={project} domain={domain} />
        </div>
      </div>
    </div>
  );
}

function ProjectInfo({ project, visible }: { project: Project; visible: boolean }) {
  const { t } = useLang();
  const cat = inferCategory(project);
  const catStyle = CATEGORY_COLORS[cat] ?? CATEGORY_COLORS["Web App"];
  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(6px)", transition: "opacity 0.35s ease 0.08s, transform 0.35s ease 0.08s", textAlign: "left" }}>
      <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "hsl(var(--foreground))", margin: "0 0 8px 0", letterSpacing: "-0.02em" }}>{project.title}</h3>
      <p style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))", margin: "0 0 16px 0", maxWidth: 520, lineHeight: 1.6 }}>{project.description}</p>

      {project.technologies && project.technologies.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "flex-start", marginBottom: 16 }}>
          {project.technologies.map(tech => (
            <span key={tech} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 99, background: "hsl(var(--secondary))", color: "hsl(var(--secondary-foreground))", border: "1px solid hsl(var(--border))", fontWeight: 500 }}>{tech}</span>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-start" }}>
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" data-testid={`link-live-${project.id}`}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, background: "#0f172a", color: "#fff", textDecoration: "none", transition: "background 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#1e293b")}
            onMouseLeave={e => (e.currentTarget.style.background = "#0f172a")}>
            <ExternalLink size={13} /> {t.portfolio.live_demo}
          </a>
        )}
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" data-testid={`link-github-${project.id}`}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, background: "hsl(var(--card))", color: "hsl(var(--foreground))", textDecoration: "none", border: "1px solid hsl(var(--border))", transition: "border-color 0.15s" }}>
            <Github size={13} /> {t.portfolio.github}
          </a>
        )}
      </div>
    </div>
  );
}

function ProjectViewer({ projects }: { projects: Project[] }) {
  const { t } = useLang();
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const count = projects.length;

  const navigate = useCallback((next: number) => {
    if (next === current) return;
    setVisible(false);
    setTimeout(() => { setCurrent(next); setVisible(true); }, 320);
  }, [current]);

  const prev = () => navigate(current === 0 ? count - 1 : current - 1);
  const next = () => navigate(current === count - 1 ? 0 : current + 1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "ArrowLeft") prev(); if (e.key === "ArrowRight") next(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current]);

  if (count === 0) return null;
  const project = projects[current];
  const cat = inferCategory(project);
  const catStyle = CATEGORY_COLORS[cat] ?? CATEGORY_COLORS["Web App"];
  const idx = String(current + 1).padStart(2, "0");
  const total = String(count).padStart(2, "0");

  return (
    <div style={{ background: "hsl(var(--card))", borderRadius: 16, padding: "28px 0 32px", border: "1px solid hsl(var(--border))" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px 20px" }}>
        <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 99, background: catStyle.bg, color: catStyle.text, border: `1px solid ${catStyle.border}`, opacity: visible ? 1 : 0, transition: "opacity 0.25s ease", letterSpacing: "0.03em", textTransform: "uppercase" }} data-testid="tag-category">{cat}</span>
        <span style={{ fontSize: 13, fontFamily: "monospace", color: "hsl(var(--muted-foreground))", letterSpacing: "0.05em", opacity: visible ? 1 : 0, transition: "opacity 0.25s ease" }} data-testid="text-counter">{idx} / {total}</span>
      </div>

      <div style={{ padding: "0 28px", position: "relative" }}>
        <div style={{ position: "relative", height: 376, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {projects.map((p, i) => <BrowserMockup key={p.id} project={p} visible={visible && i === current} />)}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "24px 28px 0" }}>
        <button onClick={prev} data-testid="button-prev-project"
          style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "hsl(var(--muted-foreground))", transition: "all 0.15s", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", flexShrink: 0 }}>
          <ChevronLeft size={18} />
        </button>
        <div style={{ flex: 1, padding: "0 24px" }}><ProjectInfo project={project} visible={visible} /></div>
        <button onClick={next} data-testid="button-next-project"
          style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "hsl(var(--muted-foreground))", transition: "all 0.15s", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", flexShrink: 0 }}>
          <ChevronRight size={18} />
        </button>
      </div>

      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 20 }}>
        {projects.map((_, i) => (
          <button key={i} onClick={() => navigate(i)} data-testid={`button-dot-${i}`}
            style={{ width: i === current ? 20 : 7, height: 7, borderRadius: 99, border: "none", background: i === current ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground) / 0.4)", cursor: "pointer", padding: 0, transition: "all 0.25s ease" }} />
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 12 }}>
        <span style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", fontFamily: "monospace", letterSpacing: "0.04em" }}>{t.portfolio.navigate}</span>
      </div>
    </div>
  );
}

function ViewerSkeleton() {
  return (
    <div style={{ background: "hsl(var(--card))", borderRadius: 16, padding: "28px", border: "1px solid hsl(var(--border))" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div className="skeleton" style={{ width: 72, height: 22, borderRadius: 99 }} />
        <div className="skeleton" style={{ width: 42, height: 22 }} />
      </div>
      <div className="skeleton" style={{ height: 376, borderRadius: 12 }} />
      <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: 10, marginTop: 28 }}>
        <div className="skeleton" style={{ width: 180, height: 22 }} />
        <div className="skeleton" style={{ width: 300, height: 16 }} />
      </div>
    </div>
  );
}

export default function PortfolioSection() {
  const { t } = useLang();
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["sb-projects"],
    queryFn: () => import("@/lib/supabase").then(m => m.fetchProjects(false)),
  });

  return (
    <section id="portfolio" className="section-padding">
      <div className="container-max">
        <div className="max-w-2xl mb-14">
          <span className="section-eyebrow">{t.portfolio.eyebrow}</span>
          <h2 className="section-title">{t.portfolio.title}</h2>
          <p className="section-subtitle">{t.portfolio.subtitle}</p>
        </div>

        {isLoading ? <ViewerSkeleton /> : projects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "hsl(var(--muted-foreground))", fontSize: 14 }}>No projects to display yet.</div>
        ) : <ProjectViewer projects={projects} />}
      </div>
    </section>
  );
}
