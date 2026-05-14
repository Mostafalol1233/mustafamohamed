import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ExternalLink, Github, Mail, Sparkles } from "lucide-react";

const ROLES = [
  "Full-Stack Developer",
  "Content Strategist",
  "UI/UX Enthusiast",
  "Problem Solver",
];

function useTypewriter(words: string[], speed = 80, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else {
      setDeleting(false);
      setWordIdx((w) => (w + 1) % words.length);
    }

    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

const stats = [
  { value: "4+", label: "Years Exp." },
  { value: "12+", label: "Projects" },
  { value: "6+", label: "Certs" },
  { value: "100%", label: "Dedicated" },
];

export default function HeroSection() {
  const role = useTypewriter(ROLES);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background orbs */}
      <div className="hero-orb w-[600px] h-[600px] top-[-200px] left-[-200px] opacity-20"
        style={{ background: "radial-gradient(circle, hsl(239 84% 67%), transparent 70%)" }} />
      <div className="hero-orb w-[400px] h-[400px] bottom-[-100px] right-[-100px] opacity-15"
        style={{ background: "radial-gradient(circle, hsl(263 70% 65%), transparent 70%)" }} />
      <div className="hero-orb w-[300px] h-[300px] top-[30%] right-[20%] opacity-10"
        style={{ background: "radial-gradient(circle, hsl(300 70% 65%), transparent 70%)" }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(hsl(239 84% 67%) 1px, transparent 1px), linear-gradient(to right, hsl(239 84% 67%) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container-max relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Available for new projects
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight leading-none"
          >
            <span className="text-foreground">Mustafa</span>
            <br />
            <span className="gradient-text">Mohamed</span>
          </motion.h1>

          {/* Typewriter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-xl md:text-2xl text-muted-foreground font-medium mb-8 h-9"
          >
            <span className="text-primary font-semibold">{role}</span>
            <span className="animate-blink text-primary ml-0.5">|</span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            I craft high-performance web applications and compelling digital content that drives
            real results. Precision, creativity, and clean code — every single time.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <button
              onClick={() => scrollTo("portfolio")}
              className="btn-primary"
              data-testid="hero-cta-portfolio"
            >
              <ExternalLink className="w-4 h-4" />
              View My Work
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="btn-outline"
              data-testid="hero-cta-contact"
            >
              <Mail className="w-4 h-4" />
              Let's Talk
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-16"
          >
            {stats.map(({ value, label }) => (
              <div key={label} className="glass-card px-4 py-5 text-center">
                <div className="text-2xl font-bold gradient-text mb-1">{value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.button
            onClick={() => scrollTo("skills")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 mx-auto group"
            data-testid="hero-scroll-indicator"
          >
            <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300 animate-bounce" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
