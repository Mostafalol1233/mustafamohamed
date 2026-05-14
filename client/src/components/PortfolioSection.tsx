import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import { Search, X, ExternalLink, Github, Layers } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

function PortfolioSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const allTechnologies = Array.from(
    new Set(projects.flatMap((p) => p.technologies || []))
  ).sort();

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchTerm === "" ||
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTech =
      selectedTech === null ||
      (project.technologies && project.technologies.includes(selectedTech));
    return matchesSearch && matchesTech;
  });

  return (
    <section id="portfolio" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(hsl(239 84% 67%) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container-max relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">What I've built</p>
          <h2 className="section-title gradient-text">Portfolio</h2>
          <p className="section-subtitle mt-4">
            Featured projects that showcase technical depth, creative thinking, and real-world impact.
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 space-y-5"
        >
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-search-projects"
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                data-testid="button-clear-search"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {allTechnologies.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedTech(null)}
                data-testid="button-filter-all"
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedTech === null
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "bg-card border border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                }`}
              >
                All
              </button>
              {allTechnologies.map((tech) => (
                <button
                  key={tech}
                  onClick={() => setSelectedTech(tech === selectedTech ? null : tech)}
                  data-testid={`button-filter-${tech.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedTech === tech
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "bg-card border border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Project Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card h-72 animate-pulse" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Layers className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No projects match your search.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={cardVariants}
                  layout
                  className="group gradient-border overflow-hidden flex flex-col hover:glow-primary transition-all duration-500"
                  data-testid={`card-project-${project.id}`}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-secondary/50">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <Layers className="w-8 h-8 text-primary/50" />
                        </div>
                      </div>
                    )}
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-4">
                      <div className="flex gap-3">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
                            data-testid={`link-live-${project.id}`}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Live Demo
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 bg-secondary text-foreground text-xs font-semibold px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors border border-border"
                            data-testid={`link-github-${project.id}`}
                          >
                            <Github className="w-3.5 h-3.5" />
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
                      {project.description}
                    </p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <span key={tech} className="tag-badge text-[11px]">{tech}</span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="tag-badge text-[11px]">+{project.technologies.length - 4}</span>
                        )}
                      </div>
                    )}
                  </div>
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
