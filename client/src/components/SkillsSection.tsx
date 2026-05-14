import { motion } from "framer-motion";
import {
  Code2, Database, Globe, Palette, Server, Smartphone,
  GitBranch, Layers, Cpu, Zap
} from "lucide-react";

const skillGroups = [
  {
    icon: Code2,
    label: "Frontend",
    color: "from-blue-500 to-cyan-400",
    skills: ["React", "TypeScript", "Next.js", "Vite", "HTML5", "CSS3"],
  },
  {
    icon: Server,
    label: "Backend",
    color: "from-violet-500 to-purple-400",
    skills: ["Node.js", "Express", "REST APIs", "PostgreSQL", "Drizzle ORM"],
  },
  {
    icon: Palette,
    label: "Design & UI",
    color: "from-pink-500 to-rose-400",
    skills: ["Tailwind CSS", "Framer Motion", "Figma", "Shadcn/UI", "Radix UI"],
  },
  {
    icon: Zap,
    label: "Tools & DevOps",
    color: "from-amber-500 to-orange-400",
    skills: ["Git", "GitHub", "Vercel", "Netlify", "Linux", "VS Code"],
  },
  {
    icon: Globe,
    label: "Content & SEO",
    color: "from-green-500 to-emerald-400",
    skills: ["Content Strategy", "SEO", "Copywriting", "Analytics", "Social Media"],
  },
  {
    icon: Cpu,
    label: "AI & Data",
    color: "from-indigo-500 to-blue-400",
    skills: ["Machine Learning", "Prompt Engineering", "Data Analysis", "AI Tools"],
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function SkillsSection() {
  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      {/* Subtle bg glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-[0.04] rounded-full"
        style={{ background: "radial-gradient(ellipse, hsl(239 84% 67%), transparent 70%)" }} />

      <div className="container-max relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">What I work with</p>
          <h2 className="section-title gradient-text">Skills & Expertise</h2>
          <p className="section-subtitle mt-4">
            A versatile toolkit built through years of building real products and shipping production-ready code.
          </p>
        </motion.div>

        {/* Skill Groups */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillGroups.map(({ icon: Icon, label, color, skills }) => (
            <motion.div
              key={label}
              variants={itemVariants}
              className="gradient-border p-6 hover:glow-primary transition-all duration-500 group"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-lg text-foreground">{label}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="tag-badge group-hover:border-primary/40 transition-colors duration-300">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom divider */}
        <div className="mt-20 flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Layers className="w-4 h-4" />
            <span>Always learning, always building</span>
          </div>
          <div className="flex-1 h-px bg-border" />
        </div>
      </div>
    </section>
  );
}
