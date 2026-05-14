import { useEffect, useRef, useState } from "react";

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

// Total "lines" = 1 command line + 5 groups × (1 header + 1 skills row) = 11 lines
const STAGGER_MS = 180;

export default function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();

        // Total lines: 1 command + (1 header + 1 pills) × 5 groups + 1 cursor = 12
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

  // line index mapping:
  // line 0 = command
  // line 1+2i+1 = category header for group i
  // line 1+2i+2 = skills pills for group i
  // line 11 = cursor

  const commandVisible = visibleLines >= 1;
  const cursorLine = 1 + SKILL_GROUPS.length * 2 + 1;

  return (
    <section id="skills" ref={sectionRef} className="section-padding bg-white border-t border-border">
      <div className="container-max">
        {/* Section header — light theme */}
        <div className="max-w-2xl mb-10">
          <span className="section-eyebrow">Expertise</span>
          <h2 className="section-title">Skills &amp; Tools</h2>
          <p className="section-subtitle">
            A versatile toolkit shaped by shipping real products — from pixel-perfect UIs to scalable backends.
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
                  {/* Category header */}
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

                  {/* Skill tags */}
                  {visibleLines >= pillsLine && (
                    <div className="flex flex-wrap gap-2 pl-5">
                      {group.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs px-3 py-1 rounded-md"
                          style={{
                            border: "1px solid #30363d",
                            color: "#8b949e",
                            background: "#161b22",
                            fontFamily: "inherit",
                          }}
                        >
                          {skill}
                        </span>
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
    </section>
  );
}
