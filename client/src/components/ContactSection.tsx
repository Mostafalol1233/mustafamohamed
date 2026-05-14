import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Send, CheckCircle2 } from "lucide-react";
import profileImage from "@assets/image_1756332525184.png";

const socials = [
  { emoji: "✉️", label: "Email", value: "overthegardenwall317@gmail.com", href: "mailto:overthegardenwall317@gmail.com" },
  { emoji: "𝕏", label: "Twitter / X", value: "@Bemora_BEMO", href: "https://x.com/Bemora_BEMO" },
  { emoji: "▶️", label: "YouTube", value: "@Bemora-site", href: "https://youtube.com/@Bemora-site" },
  { emoji: "🔗", label: "Linktree", value: "linktr.ee/Mustafa_Bemo", href: "https://linktr.ee/Mustafa_Bemo" },
];

const input = "w-full px-3.5 py-3 text-sm rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all";

export default function ContactSection() {
  const { toast } = useToast();
  const [sent, setSent] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: { name: string; email: string; subject: string; message: string }) => {
      try { await apiRequest("POST", "/api/contact", data); } catch {}
    },
    onSuccess: () => { setSent(true); toast({ title: "Message sent!", description: "I'll get back to you within 24 hours." }); },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    mutation.mutate({ name: fd.get("name") as string, email: fd.get("email") as string, subject: fd.get("subject") as string, message: fd.get("message") as string });
  };

  return (
    <section id="contact" className="section-padding bg-[#fafafa] border-t border-border">
      <div className="container-max">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <span className="section-eyebrow">Contact</span>
          <h2 className="section-title">Let's Work Together</h2>
          <p className="section-subtitle">Have a project in mind or just want to say hello? My inbox is always open.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile */}
            <div className="card-base p-6 flex flex-col items-center text-center">
              <div className="relative mb-4 select-none" onContextMenu={e => e.preventDefault()} onDragStart={e => e.preventDefault()}>
                <img src={profileImage} alt="Mustafa Mohamed"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg pointer-events-none ring-1 ring-border"
                  draggable="false" style={{ objectPosition: "center 20%" }} onContextMenu={e => e.preventDefault()} />
                <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <p className="font-semibold text-foreground">Mustafa Mohamed</p>
              <p className="text-xs text-muted-foreground mt-0.5 mb-4">Full-Stack Developer & Content Strategist</p>
              <blockquote className="text-xs text-muted-foreground italic leading-relaxed border-l-2 border-border pl-3 text-left">
                "Creating digital experiences that make a difference, one project at a time."
              </blockquote>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-px bg-border rounded-xl overflow-hidden border border-border">
              {[{ v: "24h", l: "Response" }, { v: "Open", l: "Status" }, { v: "Free", l: "First call" }].map(({ v, l }) => (
                <div key={l} className="bg-white py-4 text-center">
                  <div className="font-bold text-sm text-foreground">{v}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{l}</div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="space-y-2">
              {socials.map(({ emoji, label, value, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 card-base px-4 py-3 hover:border-primary/30 hover:bg-white transition-all group"
                  data-testid={`link-social-${label.toLowerCase().replace(/\s+/g, "-")}`}>
                  <span className="text-lg w-7 text-center flex-shrink-0">{emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-muted-foreground">{label}</p>
                    <p className="text-sm text-foreground font-medium truncate group-hover:text-primary transition-colors">{value}</p>
                  </div>
                  <span className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity text-xs">↗</span>
                </a>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3">
            <div className="card-base p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-5">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Message Sent!</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">Thanks for reaching out. I'll get back to you within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="btn-outline mt-6 text-xs">Send another</button>
                </div>
              ) : (
                <>
                  <h3 className="font-semibold text-foreground mb-6">Send me a message</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Name *</label>
                        <input name="name" required placeholder="Your name" className={input} data-testid="input-contact-name" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email *</label>
                        <input name="email" type="email" required placeholder="your@email.com" className={input} data-testid="input-contact-email" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Subject</label>
                      <input name="subject" placeholder="Project inquiry" className={input} data-testid="input-contact-subject" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Message *</label>
                      <textarea name="message" rows={6} required placeholder="Tell me about your project, timeline, and goals..."
                        className={`${input} resize-none`} data-testid="textarea-contact-message" />
                    </div>
                    <button type="submit" disabled={mutation.isPending} className="btn-primary w-full justify-center" data-testid="button-send-message">
                      {mutation.isPending
                        ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <Send className="w-4 h-4" />}
                      {mutation.isPending ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
