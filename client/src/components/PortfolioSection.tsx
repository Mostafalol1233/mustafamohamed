import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import { Search, X, ExternalLink, Github } from "lucide-react";
import { DragonConsole } from "./DragonConsole";

/* ── 3D Tilt Card ─────────────────────────────────────────────────── */
function TiltCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    // Max 12° tilt
    const rotX = ((y - cy) / cy) * -12;
    const rotY = ((x - cx) / cx) * 12;
    el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
    // Subtle shine
    const shine = el.querySelector<HTMLElement>(".tilt-shine");
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.18) 0%, transparent 70%)`;
    }
  }, []);

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)";
    const shine = el.querySelector<HTMLElement>(".tilt-shine");
    if (shine) shine.style.background = "none";
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      data-testid={`card-project-${project.id}`}
      style={{ transition: "transform 0.15s ease", willChange: "transform", transformStyle: "preserve-3d" }}
      className="relative bg-white rounded-2xl border border-border overflow-hidden group cursor-default"
    >
      {/* Shine overlay */}
      <div className="tilt-shine absolute inset-0 pointer-events-none z-10 rounded-2xl" />

      {/* Image */}
      <div className="relative h-48 bg-secondary overflow-hidden">
        {project.imageUrl ? (
          <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl select-none">🖥️</div>
        )}
        {/* Hover action buttons */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-20">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-white text-foreground text-xs font-semibold px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors shadow-lg"
              data-testid={`link-live-${project.id}`} onClick={e => e.stopPropagation()}>
              <ExternalLink className="w-3.5 h-3.5" /> Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-white text-foreground text-xs font-semibold px-4 py-2 rounded-lg hover:bg-foreground hover:text-white transition-colors shadow-lg"
              data-testid={`link-github-${project.id}`} onClick={e => e.stopPropagation()}>
              <Github className="w-3.5 h-3.5" /> GitHub
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-base text-foreground mb-1.5 group-hover:text-primary transition-colors">{project.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{project.description}</p>
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map(t => <span key={t} className="tag text-[11px]">{t}</span>)}
            {project.technologies.length > 4 && <span className="tag text-[11px]">+{project.technologies.length - 4}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Section ─────────────────────────────────────────────────── */
function PortfolioSection() {
  const [search, setSearch] = useState("");
  const [tech, setTech] = useState<string | null>(null);

  const { data: projects = [], isLoading } = useQuery<Project[]>({ queryKey: ["/api/projects"] });

  const allTech = Array.from(new Set(projects.flatMap(p => p.technologies || []))).sort();

  const filtered = projects.filter(p => {
    const s = search === "" || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const t = tech === null || (p.technologies && p.technologies.includes(tech));
    return s && t;
  });

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
            <p className="text-xs text-muted-foreground">Move your mouse over the canvas to control the physics-based dragon — a showcase of creative frontend engineering.</p>
          </div>
          <DragonConsole />
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)}
              data-testid="input-search-projects"
              className="w-full pl-9 pr-9 py-2.5 text-sm rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all" />
            {search && (
              <button onClick={() => setSearch("")} data-testid="button-clear-search" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {allTech.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setTech(null)} data-testid="button-filter-all"
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${tech === null ? "bg-foreground text-white" : "border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground bg-white"}`}>
                All
              </button>
              {allTech.map(t => (
                <button key={t} onClick={() => setTech(t === tech ? null : t)} data-testid={`button-filter-${t.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${tech === t ? "bg-foreground text-white" : "border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground bg-white"}`}>
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-72 rounded-2xl bg-secondary animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm">No projects match your search.</div>
        ) : (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map(p => (
                <motion.div key={p.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25 }}>
                  <TiltCard project={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default PortfolioSection;
