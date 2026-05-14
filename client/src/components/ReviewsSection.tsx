const TESTIMONIALS = [
  {
    name: "Karim Hassan",
    title: "Community Manager",
    company: "BRAVEZM Gaming",
    quote: "Delivered exactly what we needed, on time and with clean code. Highly recommend.",
  },
  {
    name: "Dr. Sara Mahmoud",
    title: "Academic Director",
    company: "Ahmed Helly Academy",
    quote: "Enrollment inquiries more than doubled after launch. Clean, professional, and trustworthy.",
  },
  {
    name: "Omar Khalid",
    title: "Esports Coordinator",
    company: "BestyBoy Gaming",
    quote: "Turned our concept into a platform our community genuinely loves. Fast and detail-oriented.",
  },
  {
    name: "Layla Ibrahim",
    title: "Campaign Lead",
    company: "Eco Eats",
    quote: "He understood our mission and built something that resonated with our audience immediately.",
  },
  {
    name: "Ahmed Fawzy",
    title: "Product Owner",
    company: "BMO Tools",
    quote: "RTL-ready, fully responsive, and zero bugs on launch day. Exactly what we asked for.",
  },
  {
    name: "Natasha Reed",
    title: "Managing Director",
    company: "MR Mohammed",
    quote: "Professional from start to finish. The site impressed our entire team on first review.",
  },
];

const TRACK = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

function Card({ t, idx }: { t: typeof TESTIMONIALS[0]; idx: number }) {
  return (
    <div
      className="flex-shrink-0 flex flex-col gap-3 rounded-lg p-5 select-none"
      style={{ width: 230, background: "#0d1117", border: "1px solid #21262d" }}
      data-testid={`card-testimonial-${idx}`}
    >
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} style={{ color: "#f59e0b", fontSize: 12 }}>★</span>
        ))}
      </div>
      <p style={{ color: "#c9d1d9", fontSize: 13, lineHeight: "1.65" }}>
        "{t.quote}"
      </p>
      <div className="flex items-center gap-2.5 mt-auto pt-2 border-t" style={{ borderColor: "#21262d" }}>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold"
          style={{ background: "#1c2333", color: "#818cf8" }}
        >
          {t.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p style={{ color: "#e6edf3", fontWeight: 600, fontSize: 13 }} className="truncate">{t.name}</p>
          <p style={{ color: "#555", fontSize: 11 }} className="truncate">{t.title} · {t.company}</p>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <section id="reviews" className="section-padding bg-white overflow-hidden">
      <div className="container-max mb-10">
        <span className="section-eyebrow">Testimonials</span>
        <h2 className="section-title">What clients say</h2>
        <p className="section-subtitle">Trusted by teams across different industries.</p>
      </div>

      <div className="relative">
        <div
          className="absolute left-0 top-0 h-full w-28 pointer-events-none z-10"
          style={{ background: "linear-gradient(to right, white 30%, transparent)" }}
        />
        <div
          className="absolute right-0 top-0 h-full w-28 pointer-events-none z-10"
          style={{ background: "linear-gradient(to left, white 30%, transparent)" }}
        />

        <div className="marquee-wrapper overflow-hidden">
          <div
            className="marquee-track flex gap-4"
            style={{ animation: "marquee-left 40s linear infinite" }}
          >
            {TRACK.map((t, i) => <Card key={i} t={t} idx={i} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
