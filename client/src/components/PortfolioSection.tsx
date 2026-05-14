import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import { supabase } from "@/lib/supabase";
import { ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";
import { DragonConsole } from "./DragonConsole";

// ── Category inference ────────────────────────────────────────────────────────

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
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];
  }
}

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

// ── macOS Browser Mockup ──────────────────────────────────────────────────────

function BrowserMockup({ project, visible }: { project: Project; visible: boolean }) {
  const domain = extractDomain(project.liveUrl);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.96)",
        transition: "opacity 0.4s ease-in-out, transform 0.4s ease-in-out",
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "780px",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
          background: "#fff",
        }}
        data-testid={`browser-mockup-${project.id}`}
      >
        {/* Title bar / chrome */}
        <div
          style={{
            height: "36px",
            background: "#f0f0f0",
            borderBottom: "1px solid #ddd",
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            gap: 12,
            userSelect: "none",
          }}
        >
          {/* Traffic lights */}
          <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57", display: "block" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e", display: "block" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840", display: "block" }} />
          </div>

          {/* URL bar */}
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: "44%",
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "6px",
                height: "22px",
                display: "flex",
                alignItems: "center",
                paddingLeft: 10,
                paddingRight: 10,
                gap: 5,
              }}
            >
              {/* Lock icon */}
              <svg width="9" height="10" viewBox="0 0 9 10" fill="none">
                <rect x="1" y="4" width="7" height="6" rx="1.5" fill="#aaa" />
                <path d="M2.5 4V3a2 2 0 014 0v1" stroke="#aaa" strokeWidth="1.2" fill="none" />
              </svg>
              <span style={{ fontSize: 11, color: "#555", fontFamily: "system-ui, sans-serif", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                {domain}
              </span>
            </div>
          </div>
        </div>

        {/* Screenshot area */}
        <div style={{ height: "380px", background: "#f8f9fa", overflow: "hidden", position: "relative" }}>
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
            />
          ) : (
            <div style={{
              width: "100%", height: "100%", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 12,
              background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
            }}>
              <div style={{ fontSize: 48 }}>🖥️</div>
              <span style={{ fontSize: 13, color: "#94a3b8", fontFamily: "system-ui" }}>{domain}</span>
            </div>
          )}
          {/* Subtle overlay gradient at bottom for depth */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 40,
            background: "linear-gradient(to top, rgba(255,255,255,0.3), transparent)",
            pointerEvents: "none",
          }} />
        </div>
      </div>
    </div>
  );
}

// ── Project Info ──────────────────────────────────────────────────────────────

function ProjectInfo({ project, visible }: { project: Project; visible: boolean }) {
  const cat = inferCategory(project);
  const catStyle = CATEGORY_COLORS[cat] ?? CATEGORY_COLORS["Web App"];

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 0.35s ease 0.08s, transform 0.35s ease 0.08s",
        textAlign: "center",
      }}
    >
      <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#0f172a", margin: "0 0 8px 0", letterSpacing: "-0.02em" }}>
        {project.title}
      </h3>
      <p style={{ fontSize: "0.875rem", color: "#64748b", margin: "0 0 14px 0", maxWidth: 520, lineHeight: 1.6 }}>
        {project.description}
      </p>

      {/* Tech tags */}
      {project.technologies && project.technologies.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginBottom: 16 }}>
          {project.technologies.map(t => (
            <span key={t} style={{
              fontSize: 11, padding: "3px 9px", borderRadius: 99,
              background: "#f1f5f9", color: "#475569",
              border: "1px solid #e2e8f0", fontWeight: 500,
            }}>
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Links */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={`link-live-${project.id}`}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: "#0f172a", color: "#fff", textDecoration: "none",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#1e293b")}
            onMouseLeave={e => (e.currentTarget.style.background = "#0f172a")}
          >
            <ExternalLink size={13} /> Live Demo
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={`link-github-${project.id}`}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: "#fff", color: "#0f172a", textDecoration: "none",
              border: "1px solid #e2e8f0", transition: "border-color 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#94a3b8")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#e2e8f0")}
          >
            <Github size={13} /> GitHub
          </a>
        )}
      </div>
    </div>
  );
}

// ── Main Viewer ───────────────────────────────────────────────────────────────

function ProjectViewer({ projects }: { projects: Project[] }) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  const count = projects.length;

  const navigate = useCallback((next: number) => {
    if (next === current) return;
    setVisible(false);
    setTimeout(() => {
      setCurrent(next);
      setVisible(true);
    }, 320);
  }, [current]);

  const prev = () => navigate(current === 0 ? count - 1 : current - 1);
  const next = () => navigate(current === count - 1 ? 0 : current + 1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
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
    <div style={{ background: "#fafafa", borderRadius: 16, padding: "28px 0 32px", border: "1px solid #f1f5f9" }}>
      {/* Top bar: category pill + counter */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px 20px" }}>
        {/* Category pill */}
        <span
          style={{
            fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 99,
            background: catStyle.bg, color: catStyle.text,
            border: `1px solid ${catStyle.border}`,
            opacity: visible ? 1 : 0,
            transition: "opacity 0.25s ease",
            letterSpacing: "0.03em",
            textTransform: "uppercase",
          }}
          data-testid="tag-category"
        >
          {cat}
        </span>

        {/* Counter */}
        <span
          style={{
            fontSize: 13, fontFamily: "monospace", color: "#94a3b8", letterSpacing: "0.05em",
            opacity: visible ? 1 : 0, transition: "opacity 0.25s ease",
          }}
          data-testid="text-counter"
        >
          {idx} <span style={{ color: "#cbd5e1" }}>/</span> {total}
        </span>
      </div>

      {/* Browser window area */}
      <div style={{ padding: "0 28px", position: "relative" }}>
        <div style={{ position: "relative", height: 416, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {projects.map((p, i) => (
            <BrowserMockup key={p.id} project={p} visible={visible && i === current} />
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "24px 28px 0" }}>
        {/* Left arrow */}
        <button
          onClick={prev}
          data-testid="button-prev-project"
          style={{
            width: 40, height: 40, borderRadius: "50%", border: "1px solid #e2e8f0",
            background: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#64748b", transition: "all 0.15s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#94a3b8"; e.currentTarget.style.color = "#0f172a"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b"; }}
        >
          <ChevronLeft size={18} />
        </button>

        {/* Project info */}
        <div style={{ flex: 1, padding: "0 24px" }}>
          <ProjectInfo project={project} visible={visible} />
        </div>

        {/* Right arrow */}
        <button
          onClick={next}
          data-testid="button-next-project"
          style={{
            width: 40, height: 40, borderRadius: "50%", border: "1px solid #e2e8f0",
            background: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#64748b", transition: "all 0.15s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#94a3b8"; e.currentTarget.style.color = "#0f172a"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b"; }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Dot indicators */}
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 20 }}>
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => navigate(i)}
            data-testid={`button-dot-${i}`}
            style={{
              width: i === current ? 20 : 7,
              height: 7, borderRadius: 99, border: "none",
              background: i === current ? "#0f172a" : "#cbd5e1",
              cursor: "pointer", padding: 0,
              transition: "all 0.25s ease",
            }}
          />
        ))}
      </div>

      {/* Keyboard hint */}
      <div style={{ textAlign: "center", marginTop: 12 }}>
        <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace", letterSpacing: "0.04em" }}>
          ← → to navigate
        </span>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function ViewerSkeleton() {
  return (
    <div style={{ background: "#fafafa", borderRadius: 16, padding: "28px", border: "1px solid #f1f5f9" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ width: 72, height: 22, borderRadius: 99, background: "#e2e8f0" }} />
        <div style={{ width: 42, height: 22, borderRadius: 6, background: "#e2e8f0" }} />
      </div>
      <div style={{ height: 416, borderRadius: 12, background: "#e2e8f0", animation: "pulse 2s infinite" }} />
      <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: 10, marginTop: 28 }}>
        <div style={{ width: 180, height: 22, borderRadius: 6, background: "#e2e8f0" }} />
        <div style={{ width: 300, height: 16, borderRadius: 6, background: "#f1f5f9" }} />
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          {[60, 80, 70].map((w, i) => <div key={i} style={{ width: w, height: 22, borderRadius: 99, background: "#f1f5f9" }} />)}
        </div>
      </div>
    </div>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────

function PortfolioSection() {
  const { data: allProjects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["sb", "projects", "visible"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("is_visible", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        imageUrl: p.image_url,
        technologies: p.technologies || [],
        liveUrl: p.live_url,
        githubUrl: p.github_url,
        isVisible: p.is_visible,
        createdAt: p.created_at,
      })) as Project[];
    },
  });

  const projects = allProjects;

  return (
    <section id="portfolio" className="section-padding">
      <div className="container-max">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <span className="section-eyebrow">Work</span>
          <h2 className="section-title">Portfolio</h2>
          <p className="section-subtitle">
            Real projects, real impact. Each one built to solve a problem and ship clean, fast, and maintainable code.
          </p>
        </div>

        {/* Dragon Console */}
        <div className="mb-16">
          <div className="mb-4">
            <p className="text-sm font-semibold text-foreground mb-1">Interactive AI Console</p>
            <p className="text-xs text-muted-foreground">
              Move your mouse over the canvas to control the physics-based dragon — a showcase of creative frontend engineering.
            </p>
          </div>
          <DragonConsole />
        </div>

        {/* Project Viewer */}
        {isLoading ? (
          <ViewerSkeleton />
        ) : projects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#94a3b8", fontSize: 14 }}>
            No projects to display yet.
          </div>
        ) : (
          <ProjectViewer projects={projects} />
        )}
      </div>
    </section>
  );
}

export default PortfolioSection;
