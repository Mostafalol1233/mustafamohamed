import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { Certificate } from "@shared/schema";
import certificateImage from "@assets/113-alx-ai-starter-kit-certificate-mustafa-muhammad.png";
import { useLang } from "@/contexts/LanguageContext";

const staticCerts = [
  { id: "cert-1", title: "ALX AI Starter Kit", issuer: "ALX Africa", issueDate: "2024", category: "Artificial Intelligence", imageUrl: certificateImage as string, color: "#7c3aed", emoji: "🤖" },
  { id: "cert-2", title: "Full-Stack Web Development", issuer: "Meta (Facebook)", issueDate: "2023", category: "Web Development", imageUrl: null, color: "#0866ff", emoji: "💻" },
  { id: "cert-3", title: "Content Strategy & Digital Marketing", issuer: "Google Digital Marketing", issueDate: "2023", category: "Digital Marketing", imageUrl: null, color: "#ea4335", emoji: "📊" },
  { id: "cert-4", title: "Advanced JavaScript & TypeScript", issuer: "Microsoft", issueDate: "2022", category: "Programming", imageUrl: null, color: "#0078d4", emoji: "⚡" },
  { id: "cert-5", title: "Cloud Computing Fundamentals", issuer: "Amazon Web Services", issueDate: "2022", category: "Cloud", imageUrl: null, color: "#ff9900", emoji: "☁️" },
  { id: "cert-6", title: "Database Design & Management", issuer: "Oracle Corporation", issueDate: "2021", category: "Database", imageUrl: null, color: "#c74634", emoji: "🗄️" },
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

function CertCard({ cert, delay }: { cert: typeof staticCerts[0]; delay: number }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal card-hover overflow-hidden" style={{ transitionDelay: `${delay}ms` }} data-testid={`card-cert-${cert.id}`}>
      {cert.id === "cert-1" && cert.imageUrl ? (
        <div className="h-36 overflow-hidden select-none" onContextMenu={e => e.preventDefault()} onDragStart={e => e.preventDefault()}>
          <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover pointer-events-none" draggable="false" />
        </div>
      ) : (
        <div className="h-20 flex items-center px-5" style={{ background: `${cert.color}12` }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{cert.emoji}</span>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: cert.color }}>{cert.category}</span>
          </div>
        </div>
      )}
      <div className="p-5">
        <h3 className="font-semibold text-sm text-foreground mb-1 leading-snug">{cert.title}</h3>
        <p className="text-xs text-muted-foreground mb-3">{cert.issuer}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{cert.issueDate}</span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">✓ Verified</span>
        </div>
      </div>
    </div>
  );
}

export default function CertificationsSection() {
  const { t } = useLang();
  const { data: dbCerts = [] } = useQuery<Certificate[]>({
    queryKey: ["sb-certificates"],
    queryFn: async () => {
      const { supabase } = await import("@/lib/supabase");
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("is_visible", true)
        .order("created_at", { ascending: false });
      if (error) return [];
      return (data ?? []).map((c: any) => ({
        id: c.id, title: c.title, imageUrl: c.image_url ?? null,
        issueDate: c.issue_date ?? null, isVisible: c.is_visible ?? true, createdAt: c.created_at,
      }));
    },
  });

  const extraCerts = dbCerts.map(c => ({
    id: `db-${c.id}`,
    title: c.title,
    issuer: (c as any).issuer || "",
    issueDate: c.issueDate || "",
    category: (c as any).category || "Certification",
    imageUrl: c.imageUrl || null,
    color: "#4f46e5",
    emoji: "🎓",
  }));

  const all = [...staticCerts, ...extraCerts];

  return (
    <section id="certifications" className="section-padding bg-background border-t border-border">
      <div className="container-max">
        <div className="max-w-2xl mb-14">
          <span className="section-eyebrow">Credentials</span>
          <h2 className="section-title">{t.sections.certifications}</h2>
          <p className="section-subtitle">A proven track record of learning across AI, full-stack development, cloud, and digital marketing.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {all.map((cert, i) => <CertCard key={cert.id} cert={cert} delay={i * 70} />)}
        </div>
        <div className="grid grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {[
            { value: `${all.length}+`, label: "Certifications" },
            { value: "4+", label: "Years Experience" },
            { value: "10+", label: "Technology Stacks" },
          ].map(({ value, label }) => (
            <div key={label} className="bg-card px-8 py-6 text-center">
              <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
