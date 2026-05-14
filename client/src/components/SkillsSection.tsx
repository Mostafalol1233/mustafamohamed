import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Terminal } from "lucide-react";

const SKILL_GROUPS = [
  {
    category: "Frontend",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    category: "Backend",
    skills: ["Node.js", "Express", "REST APIs", "MongoDB", "PostgreSQL"],
  },
  {
    category: "Design & UI",
    skills: ["Figma", "Shadcn/UI", "Radix UI", "Responsive Design"],
  },
  {
    category: "Dev Tools",
    skills: ["Git", "GitHub", "VS Code", "Linux", "Vercel"],
  },
  {
    category: "AI & Data",
    skills: ["Prompt Engineering", "AI Integration", "Data Analysis"],
  },
];

type SkillInfo = {
  what: string;
  proficiency: string;
  level: number;
  uses: string[];
  next: string;
};

const SKILL_DATA: Record<string, SkillInfo> = {
  "React": {
    what: "A JavaScript library for building fast, component-based user interfaces.",
    proficiency: "Expert",
    level: 92,
    uses: [
      "Building full portfolio sites and SaaS dashboards with reusable component systems",
      "Managing complex UI state with hooks, context, and React Query",
      "Optimizing rendering performance with memoization and lazy loading",
    ],
    next: "Next.js",
  },
  "TypeScript": {
    what: "A strongly-typed superset of JavaScript that catches errors at compile time.",
    proficiency: "Advanced",
    level: 85,
    uses: [
      "Typing API responses and shared schemas across frontend and backend",
      "Writing self-documenting code that scales across team projects",
      "Catching runtime bugs before they reach production",
    ],
    next: "Zod",
  },
  "Next.js": {
    what: "A React framework with SSR, SSG, and file-based routing built in.",
    proficiency: "Advanced",
    level: 80,
    uses: [
      "Building SEO-optimized marketing pages with static generation",
      "Deploying full-stack apps with serverless API routes",
      "Leveraging the App Router for nested layouts and streaming",
    ],
    next: "Vercel",
  },
  "Tailwind CSS": {
    what: "A utility-first CSS framework for building custom designs without leaving your HTML.",
    proficiency: "Expert",
    level: 95,
    uses: [
      "Rapidly prototyping and shipping pixel-perfect responsive UIs",
      "Creating consistent design systems with custom config tokens",
      "Building dark mode support across entire projects",
    ],
    next: "Shadcn/UI",
  },
  "Framer Motion": {
    what: "A production-ready animation library for React with a declarative API.",
    proficiency: "Intermediate",
    level: 68,
    uses: [
      "Adding stagger, slide, and fade animations to page sections",
      "Building interactive drag-and-drop UI elements",
      "Creating smooth route transition animations",
    ],
    next: "React",
  },
  "Node.js": {
    what: "A JavaScript runtime built on Chrome's V8 engine for building server-side applications.",
    proficiency: "Advanced",
    level: 82,
    uses: [
      "Building REST APIs and backend services for portfolio and client apps",
      "Running scripts for data processing and automation tasks",
      "Serving static assets and proxying requests in development",
    ],
    next: "Express",
  },
  "Express": {
    what: "A minimal and flexible Node.js web application framework for building APIs.",
    proficiency: "Advanced",
    level: 84,
    uses: [
      "Creating RESTful API servers with route handlers and middleware",
      "Handling file uploads, sessions, and authentication logic",
      "Integrating with PostgreSQL and ORMs like Drizzle",
    ],
    next: "REST APIs",
  },
  "REST APIs": {
    what: "An architectural style for building stateless, scalable web services over HTTP.",
    proficiency: "Advanced",
    level: 88,
    uses: [
      "Designing and documenting clean API contracts for frontend consumption",
      "Handling authentication with sessions, JWTs, and OAuth flows",
      "Building webhook integrations with third-party platforms",
    ],
    next: "PostgreSQL",
  },
  "MongoDB": {
    what: "A document-oriented NoSQL database that stores data in flexible JSON-like format.",
    proficiency: "Intermediate",
    level: 65,
    uses: [
      "Storing flexible, schema-less content for rapid prototyping",
      "Querying nested documents and arrays for analytics",
      "Powering real-time apps with Change Streams",
    ],
    next: "PostgreSQL",
  },
  "PostgreSQL": {
    what: "A powerful, open-source relational database system known for reliability and performance.",
    proficiency: "Advanced",
    level: 80,
    uses: [
      "Designing normalized relational schemas for production apps",
      "Writing complex queries with joins, CTEs, and window functions",
      "Managing migrations and schema changes with Drizzle ORM",
    ],
    next: "Node.js",
  },
  "Figma": {
    what: "A collaborative vector design tool for creating UI mockups and design systems.",
    proficiency: "Intermediate",
    level: 70,
    uses: [
      "Wireframing user flows before writing a single line of code",
      "Creating component libraries and design tokens for dev handoff",
      "Prototyping interactive flows for client reviews",
    ],
    next: "Shadcn/UI",
  },
  "Shadcn/UI": {
    what: "A collection of beautifully designed, accessible React components built on Radix UI.",
    proficiency: "Advanced",
    level: 88,
    uses: [
      "Building consistent admin dashboards and form UIs quickly",
      "Customizing components at the source level to match brand styles",
      "Combining with Tailwind for full design control without fighting the library",
    ],
    next: "Radix UI",
  },
  "Radix UI": {
    what: "Unstyled, accessible component primitives for building high-quality design systems.",
    proficiency: "Intermediate",
    level: 72,
    uses: [
      "Implementing accessible dialogs, dropdowns, and tooltips from scratch",
      "Building composable headless components with full style control",
      "Passing WAI-ARIA compliance checks without extra effort",
    ],
    next: "Figma",
  },
  "Responsive Design": {
    what: "The practice of building UIs that adapt fluidly to any screen size or device.",
    proficiency: "Expert",
    level: 93,
    uses: [
      "Designing mobile-first layouts that scale gracefully to desktop",
      "Using CSS Grid and Flexbox for complex adaptive layouts",
      "Testing and debugging breakpoints across real device sizes",
    ],
    next: "Tailwind CSS",
  },
  "Git": {
    what: "A distributed version control system for tracking code changes and collaborating.",
    proficiency: "Advanced",
    level: 85,
    uses: [
      "Managing feature branches, rebasing, and clean commit histories",
      "Resolving merge conflicts and reviewing diffs before pushing",
      "Using hooks and aliases to automate repetitive workflows",
    ],
    next: "GitHub",
  },
  "GitHub": {
    what: "A platform for hosting Git repositories with collaboration and CI/CD tooling.",
    proficiency: "Advanced",
    level: 87,
    uses: [
      "Managing open-source and private project repositories",
      "Setting up GitHub Actions for automated tests and deployments",
      "Code review workflows with pull requests and branch protection",
    ],
    next: "Vercel",
  },
  "VS Code": {
    what: "A lightweight but powerful source-code editor by Microsoft with rich extension support.",
    proficiency: "Expert",
    level: 95,
    uses: [
      "Configuring workspace settings, keybindings, and snippets for max efficiency",
      "Using the integrated debugger and terminal for faster iteration",
      "Extending with language servers, linters, and Git integrations",
    ],
    next: "Linux",
  },
  "Linux": {
    what: "An open-source operating system kernel powering most servers and developer machines.",
    proficiency: "Intermediate",
    level: 68,
    uses: [
      "Navigating filesystems, managing processes, and writing shell scripts",
      "Deploying and maintaining Node.js apps on Ubuntu/Debian servers",
      "Using SSH and CLI tools for remote server management",
    ],
    next: "Git",
  },
  "Vercel": {
    what: "A cloud platform for frontend frameworks with zero-config deployments and edge functions.",
    proficiency: "Advanced",
    level: 85,
    uses: [
      "Deploying Next.js and Vite apps with automatic preview URLs per branch",
      "Configuring custom domains, redirects, and environment variables",
      "Using Analytics and Speed Insights to monitor production performance",
    ],
    next: "Next.js",
  },
  "Prompt Engineering": {
    what: "The practice of crafting effective inputs to guide large language models toward desired outputs.",
    proficiency: "Advanced",
    level: 86,
    uses: [
      "Designing system prompts for product features and internal tools",
      "Iterating on prompts to improve output accuracy and consistency",
      "Building few-shot examples for specialized domain tasks",
    ],
    next: "AI Integration",
  },
  "AI Integration": {
    what: "Connecting AI models and APIs into real products to add intelligent functionality.",
    proficiency: "Advanced",
    level: 80,
    uses: [
      "Integrating OpenAI and Claude APIs into web apps via streaming",
      "Building RAG pipelines for document-aware AI assistants",
      "Adding AI-powered features like auto-tagging, summarization, and search",
    ],
    next: "Prompt Engineering",
  },
  "Data Analysis": {
    what: "Extracting meaningful insights from datasets using statistical and visual techniques.",
    proficiency: "Intermediate",
    level: 62,
    uses: [
      "Analyzing user behavior metrics and funnel performance in dashboards",
      "Writing SQL queries to generate reports from production databases",
      "Visualizing trends with charts and tables inside web apps",
    ],
    next: "PostgreSQL",
  },
};

const STAGGER_MS = 180;
const LEVEL_COLORS: Record<string, string> = {
  Expert: "#3fb950",
  Advanced: "#58a6ff",
  Intermediate: "#d29922",
};

function SkillPanel({
  skill,
  onClose,
  onNavigate,
}: {
  skill: string;
  onClose: () => void;
  onNavigate: (s: string) => void;
}) {
  const info = SKILL_DATA[skill];
  if (!info) return null;

  const levelColor = LEVEL_COLORS[info.proficiency] ?? "#8b949e";

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Panel — slides in from right on desktop, up from bottom on mobile */}
      <motion.div
        className="fixed z-50 flex flex-col overflow-hidden shadow-2xl
          bottom-0 left-0 right-0 rounded-t-2xl h-[82vh]
          md:bottom-auto md:top-0 md:left-auto md:right-0 md:rounded-l-2xl md:rounded-r-none md:w-[420px] md:h-full"
        style={{ background: "#0d1117", border: "1px solid #30363d" }}
        initial={{ y: "100%", x: 0 }}
        animate={{ y: 0, x: 0 }}
        exit={{ y: "100%", x: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        // Desktop overrides via inline style won't work cleanly; handle via media query in className
      >
        {/* Terminal header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b shrink-0"
          style={{ background: "#161b22", borderColor: "#21262d" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Terminal className="w-4 h-4 shrink-0" style={{ color: "#58a6ff" }} />
            <span
              className="text-xs truncate"
              style={{ color: "#8b949e", fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
            >
              <span style={{ color: "#58a6ff" }}>~</span>{" "}
              <span style={{ color: "#e6edf3" }}>skill --info</span>{" "}
              <span style={{ color: "#f78166", fontWeight: "bold" }}>[{skill.toUpperCase()}]</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 ml-3 w-7 h-7 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors"
            style={{ color: "#8b949e" }}
            data-testid="button-close-skill-panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Panel body — clean readable font */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ color: "#e6edf3" }}>
          {/* What is it */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#8b949e" }}>
              Overview
            </p>
            <p className="text-base leading-relaxed" style={{ color: "#e6edf3" }}>
              {info.what}
            </p>
          </div>

          {/* Proficiency */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#8b949e" }}>
              Proficiency
            </p>
            <div className="flex items-center gap-3">
              <span
                className="text-sm font-semibold px-2.5 py-1 rounded-full"
                style={{
                  color: levelColor,
                  background: `${levelColor}18`,
                  border: `1px solid ${levelColor}40`,
                }}
              >
                {info.proficiency}
              </span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#21262d" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: levelColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${info.level}%` }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs" style={{ color: "#8b949e" }}>{info.level}%</span>
            </div>
          </div>

          {/* How I use it */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#8b949e" }}>
              How I use it
            </p>
            <ul className="space-y-2.5">
              {info.uses.map((u, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed" style={{ color: "#cdd9e5" }}>
                  <span className="mt-1 shrink-0" style={{ color: "#3fb950" }}>▸</span>
                  <span>{u}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Next skill recommendation */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#8b949e" }}>
              Explore next
            </p>
            <button
              onClick={() => onNavigate(info.next)}
              className="group flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg border transition-all duration-200 hover:border-[#58a6ff] hover:text-[#58a6ff]"
              style={{
                border: "1px solid #30363d",
                color: "#8b949e",
                background: "#161b22",
              }}
              data-testid={`button-next-skill-${info.next.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <span style={{ color: "#58a6ff" }} className="font-mono text-xs">~/</span>
              <span>{info.next}</span>
              <span className="ml-auto group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState(0);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();

        const total = 1 + SKILL_GROUPS.length * 2 + 1;
        for (let i = 0; i <= total; i++) {
          const t = setTimeout(() => setVisibleLines(i + 1), i * STAGGER_MS);
          timerRef.current.push(t);
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);

    return () => {
      obs.disconnect();
      timerRef.current.forEach(clearTimeout);
    };
  }, []);

  // Close panel on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedSkill(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const commandVisible = visibleLines >= 1;
  const cursorLine = 1 + SKILL_GROUPS.length * 2 + 1;

  return (
    <section id="skills" ref={sectionRef} className="section-padding bg-white border-t border-border">
      <div className="container-max">
        {/* Section header */}
        <div className="max-w-2xl mb-10">
          <span className="section-eyebrow">Expertise</span>
          <h2 className="section-title">Skills &amp; Tools</h2>
          <p className="section-subtitle">
            A versatile toolkit shaped by shipping real products — from pixel-perfect UIs to scalable backends.{" "}
            <span className="text-sm opacity-60">Click any tag to explore.</span>
          </p>
        </div>

        {/* Terminal window */}
        <div
          className="rounded-xl overflow-hidden shadow-2xl border border-[#30363d]"
          style={{ background: "#0d1117", fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#21262d]" style={{ background: "#161b22" }}>
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-xs text-[#8b949e]">terminal — mustafa@portfolio</span>
          </div>

          {/* Terminal body */}
          <div className="p-6 md:p-8 space-y-3 min-h-[340px]">
            {/* Command line */}
            {commandVisible && (
              <div className="flex items-center gap-2 text-sm">
                <span style={{ color: "#58a6ff" }}>~</span>
                <span style={{ color: "#8b949e" }}>$</span>
                <span style={{ color: "#e6edf3" }}>scan --skills</span>
              </div>
            )}

            {/* Skill groups */}
            {SKILL_GROUPS.map((group, i) => {
              const headerLine = 1 + i * 2 + 1;
              const pillsLine = 1 + i * 2 + 2;
              return (
                <div key={group.category} className="space-y-2">
                  {visibleLines >= headerLine && (
                    <div className="flex items-center gap-2 text-sm mt-4 first:mt-2">
                      <span style={{ color: "#3fb950" }}>✓</span>
                      <span
                        style={{ color: "#f78166", fontWeight: "bold" }}
                        className="uppercase tracking-wide text-xs"
                      >
                        {group.category}
                      </span>
                    </div>
                  )}

                  {visibleLines >= pillsLine && (
                    <div className="flex flex-wrap gap-2 pl-5">
                      {group.skills.map((skill) => (
                        <button
                          key={skill}
                          onClick={() => setSelectedSkill(skill)}
                          data-testid={`button-skill-${skill.toLowerCase().replace(/\s+/g, "-")}`}
                          className="text-xs px-3 py-1 rounded-md transition-all duration-150 cursor-pointer
                            hover:border-[#58a6ff] hover:text-[#58a6ff] hover:bg-[#58a6ff]/10
                            active:scale-95"
                          style={{
                            border: `1px solid ${selectedSkill === skill ? "#58a6ff" : "#30363d"}`,
                            color: selectedSkill === skill ? "#58a6ff" : "#8b949e",
                            background: selectedSkill === skill ? "rgba(88,166,255,0.1)" : "#161b22",
                            fontFamily: "inherit",
                          }}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Blinking cursor */}
            {visibleLines >= cursorLine && (
              <div className="flex items-center gap-2 text-sm mt-6">
                <span style={{ color: "#58a6ff" }}>~</span>
                <span style={{ color: "#8b949e" }}>$</span>
                <span
                  style={{ color: "#58a6ff", display: "inline-block", width: "9px", height: "16px", background: "#58a6ff", verticalAlign: "middle" }}
                  className="animate-blink"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Skill info panel */}
      <AnimatePresence>
        {selectedSkill && (
          <SkillPanel
            skill={selectedSkill}
            onClose={() => setSelectedSkill(null)}
            onNavigate={(s) => setSelectedSkill(s)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
