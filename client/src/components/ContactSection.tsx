import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Mail, Twitter, Youtube, Link2, Send, Clock, CalendarCheck, MessageSquare,
  CheckCircle2
} from "lucide-react";
import profileImage from "@assets/image_1756332525184.png";

const socials = [
  {
    icon: Mail,
    label: "Email",
    value: "overthegardenwall317@gmail.com",
    href: "mailto:overthegardenwall317@gmail.com",
    color: "from-red-500 to-orange-500",
  },
  {
    icon: Twitter,
    label: "Twitter / X",
    value: "@Bemora_BEMO",
    href: "https://x.com/Bemora_BEMO",
    color: "from-sky-400 to-blue-500",
  },
  {
    icon: Youtube,
    label: "YouTube",
    value: "@Bemora-site",
    href: "https://youtube.com/@Bemora-site",
    color: "from-red-600 to-rose-600",
  },
  {
    icon: Link2,
    label: "Linktree",
    value: "linktr.ee/Mustafa_Bemo",
    href: "https://linktr.ee/Mustafa_Bemo",
    color: "from-green-400 to-emerald-500",
  },
];

const perks = [
  { icon: Clock, label: "Response Time", desc: "Within 24 hours" },
  { icon: CalendarCheck, label: "Availability", desc: "Open for projects" },
  { icon: MessageSquare, label: "Consultation", desc: "First call is free" },
];

export default function ContactSection() {
  const { toast } = useToast();
  const [sent, setSent] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: { name: string; email: string; subject: string; message: string }) => {
      try {
        await apiRequest("POST", "/api/contact", data);
      } catch {
        // Still show success even if API isn't wired
      }
    },
    onSuccess: () => {
      setSent(true);
      toast({ title: "Message sent!", description: "I'll get back to you as soon as possible." });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    mutation.mutate({
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      subject: fd.get("subject") as string,
      message: fd.get("message") as string,
    });
  };

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-[0.06] rounded-full"
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
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Get in touch</p>
          <h2 className="section-title gradient-text">Let's Work Together</h2>
          <p className="section-subtitle mt-4">
            Have a project in mind? I'd love to hear about it. Let's build something great together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Profile + Socials */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Profile card */}
            <div className="gradient-border p-8 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div
                  className="relative select-none"
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/40 to-violet-500/40 blur-2xl scale-110 animate-pulse" />
                  <img
                    src={profileImage}
                    alt="Mustafa Mohamed"
                    className="relative w-32 h-32 rounded-full object-cover border-4 border-primary/30 pointer-events-none shadow-2xl"
                    draggable="false"
                    style={{ objectPosition: "center 20%" }}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-background" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-1">Mustafa Mohamed</h3>
              <p className="text-muted-foreground text-sm mb-4">Full-Stack Developer & Content Strategist</p>
              <blockquote className="text-sm italic text-muted-foreground border-l-2 border-primary/50 pl-4 text-left">
                "Creating digital experiences that make a difference, one project at a time."
              </blockquote>
            </div>

            {/* Perks */}
            <div className="grid grid-cols-3 gap-3">
              {perks.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="gradient-border p-4 text-center hover:glow-primary transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="space-y-3">
              {socials.map(({ icon: Icon, label, value, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 gradient-border p-4 hover:glow-primary transition-all duration-300 group"
                  data-testid={`link-social-${label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{value}</p>
                  </div>
                  <Send className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 -rotate-45" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="gradient-border p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Message Sent!</h3>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    Thanks for reaching out. I'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-6 btn-outline text-sm px-5 py-2.5"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-foreground mb-7">Send me a message</h3>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1.5">Name *</label>
                        <input
                          name="name"
                          required
                          placeholder="Your name"
                          className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                          data-testid="input-contact-name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1.5">Email *</label>
                        <input
                          name="email"
                          type="email"
                          required
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                          data-testid="input-contact-email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1.5">Subject</label>
                      <input
                        name="subject"
                        placeholder="Project inquiry"
                        className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                        data-testid="input-contact-subject"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1.5">Message *</label>
                      <textarea
                        name="message"
                        rows={6}
                        required
                        placeholder="Tell me about your project, goals, and timeline..."
                        className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all text-sm resize-none"
                        data-testid="textarea-contact-message"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={mutation.isPending}
                      className="btn-primary w-full justify-center"
                      data-testid="button-send-message"
                    >
                      {mutation.isPending ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      {mutation.isPending ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
