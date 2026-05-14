import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

const skillGroups = [
  {
    label: "Frontend",
    emoji: "🎨",
    color: "#4f46e5",
    bg: "#eef2ff",
    skills: ["React", "TypeScript", "Next.js", "Vite", "Tailwind CSS", "Framer Motion"],
  },
  {
    label: "Backend",
    emoji: "⚙️",
    color: "#0891b2",
    bg: "#ecfeff",
    skills: ["Node.js", "Express", "REST APIs", "PostgreSQL", "Drizzle ORM", "Auth"],
  },
  {
    label: "Design & UI",
    emoji: "✏️",
    color: "#db2777",
    bg: "#fdf2f8",
    skills: ["Figma", "Shadcn/UI", "Radix UI", "Responsive Design", "Accessibility"],
  },
  {
    label: "Dev Tools",
    emoji: "🛠",
    color: "#d97706",
    bg: "#fffbeb",
    skills: ["Git", "GitHub", "Vercel", "Netlify", "Linux", "VS Code"],
  },
  {
    label: "Content & SEO",
    emoji: "📝",
    color: "#16a34a",
    bg: "#f0fdf4",
    skills: ["Content Strategy", "Copywriting", "SEO", "Analytics", "Social Media"],
  },
  {
    label: "AI & Data",
    emoji: "🤖",
    color: "#7c3aed",
    bg: "#f5f3ff",
    skills: ["Machine Learning", "Prompt Engineering", "Data Analysis", "AI Integration"],
  },
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.classList.add("visible"); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function SkillCard({ group, delay }: { group: typeof skillGroups[0]; delay: number }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal card-hover p-6" style={{ transitionDelay: `${delay}ms` }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{ background: group.bg }}>
          {group.emoji}
        </div>
        <h3 className="font-semibold text-sm text-foreground">{group.label}</h3>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {group.skills.map((s) => (
          <span key={s} className="text-xs px-2.5 py-1 rounded-md bg-secondary text-muted-foreground font-medium">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SkillsSection() {
  return (
    <section id="skills" className="section-padding bg-[#fafafa] border-t border-b border-border">
      <div className="container-max">
        <div className="max-w-2xl mb-14">
          <span className="section-eyebrow">Expertise</span>
          <h2 className="section-title">Skills & Tools</h2>
          <p className="section-subtitle">
            A versatile toolkit shaped by years of shipping real products — from pixel-perfect UIs to scalable backends.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillGroups.map((g, i) => (
            <SkillCard key={g.label} group={g} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
