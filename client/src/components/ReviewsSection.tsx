const ROW1 = [
  {
    name: "Karim Hassan",
    role: "Community Manager",
    company: "BRAVEZM Gaming",
    icon: "ti-device-gamepad-2",
    quote: "Mustafa built our gaming platform exactly the way we envisioned. The site performs flawlessly under heavy traffic and the UI keeps our community engaged.",
  },
  {
    name: "Dr. Sara Mahmoud",
    role: "Academic Director",
    company: "Ahmed Helly Academy",
    icon: "ti-school",
    quote: "Our online academy needed a clean, trustworthy presence. Mustafa nailed it. Enrollment inquiries more than doubled since we launched the new site.",
  },
  {
    name: "Layla Ibrahim",
    role: "Campaign Lead",
    company: "Eco Eats",
    icon: "ti-speakerphone",
    quote: "Mustafa understood our sustainability mission and translated it into a beautiful, impactful site. The feedback from our audience has been overwhelmingly positive.",
  },
];

const ROW2 = [
  {
    name: "Omar Khalid",
    role: "Esports Coordinator",
    company: "BestyBoy Gaming",
    icon: "ti-device-gamepad-2",
    quote: "Professional, fast, and detail-oriented. He turned our concept into a real platform that our community loves. Highly recommend for any gaming project.",
  },
  {
    name: "Ahmed Fawzy",
    role: "Product Owner",
    company: "BMO Tools",
    icon: "ti-briefcase",
    quote: "Building an RTL-ready Arabic tools platform is no small task. Mustafa handled every edge case with precision, and the result is smooth and highly usable.",
  },
  {
    name: "Fatima Al-Rashid",
    role: "Managing Director",
    company: "MR Mohammed",
    icon: "ti-crown",
    quote: "Working with Mustafa was straightforward and professional. He delivered a polished business site on time, and the attention to detail in the layout impressed our whole team.",
  },
];

function Card({ t }: { t: typeof ROW1[0] }) {
  return (
    <div
      className="flex-shrink-0 flex flex-col gap-3 rounded-[10px] p-5 select-none"
      style={{ width: 260, background: "#0d1117", border: "1px solid #21262d" }}
      data-testid={`card-testimonial-${t.name.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} style={{ color: "#f59e0b", fontSize: 13 }}>★</span>
        ))}
      </div>
      <p style={{ color: "#c9d1d9", fontSize: 13, lineHeight: "1.65" }}>
        "{t.quote}"
      </p>
      <div className="flex items-center gap-3 mt-auto pt-2">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "#1a1a2e" }}
        >
          <i className={`ti ${t.icon}`} style={{ color: "#818cf8", fontSize: 18 }} />
        </div>
        <div className="min-w-0">
          <p style={{ color: "#ffffff", fontWeight: 500, fontSize: 13 }} className="truncate">{t.name}</p>
          <p style={{ color: "#666", fontSize: 11 }} className="truncate">{t.role} · {t.company}</p>
        </div>
      </div>
    </div>
  );
}

const track1 = [...ROW1, ...ROW1, ...ROW1, ...ROW1];
const track2 = [...ROW2, ...ROW2, ...ROW2, ...ROW2];

export default function ReviewsSection() {
  return (
    <section id="reviews" className="section-padding bg-white overflow-hidden">
      <div className="container-max mb-12">
        <span className="section-eyebrow">Testimonials</span>
        <h2 className="section-title">What clients say</h2>
        <p className="section-subtitle">Trusted by teams across different industries.</p>
      </div>

      <div className="relative">
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 h-full w-32 pointer-events-none z-10"
          style={{ background: "linear-gradient(to right, white 30%, transparent)" }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 h-full w-32 pointer-events-none z-10"
          style={{ background: "linear-gradient(to left, white 30%, transparent)" }}
        />

        {/* Row 1 — left */}
        <div className="marquee-wrapper overflow-hidden mb-4">
          <div
            className="marquee-track flex gap-4"
            style={{ animation: "marquee-left 28s linear infinite" }}
          >
            {track1.map((t, i) => <Card key={`r1-${i}`} t={t} />)}
          </div>
        </div>

        {/* Row 2 — right */}
        <div className="marquee-wrapper overflow-hidden">
          <div
            className="marquee-track flex gap-4"
            style={{ animation: "marquee-right 32s linear infinite" }}
          >
            {track2.map((t, i) => <Card key={`r2-${i}`} t={t} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
