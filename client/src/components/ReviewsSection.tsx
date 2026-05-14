const TESTIMONIALS = [
  {
    name: "Karim Hassan",
    role: "Community Manager",
    company: "BRAVEZM Gaming",
    icon: "ti-device-gamepad-2",
    quote: "Mustafa built our gaming platform exactly the way we envisioned. The site performs flawlessly under heavy traffic and the UI keeps our community engaged. Truly a class act.",
  },
  {
    name: "Dr. Sara Mahmoud",
    role: "Academic Director",
    company: "Ahmed Helly Academy",
    icon: "ti-school",
    quote: "Our online academy needed a clean, trustworthy presence. Mustafa nailed it. Enrollment inquiries have more than doubled since we launched the new site.",
  },
  {
    name: "Omar Khalid",
    role: "Esports Coordinator",
    company: "BestyBoy Gaming",
    icon: "ti-device-gamepad-2",
    quote: "Professional, fast, and detail-oriented. He turned our concept into a real platform that our community loves. Highly recommend for any gaming project.",
  },
  {
    name: "Layla Ibrahim",
    role: "Campaign Lead",
    company: "Eco Eats",
    icon: "ti-speakerphone",
    quote: "Mustafa understood our sustainability mission and translated it into a beautiful, impactful campaign site. The feedback from our audience has been overwhelmingly positive.",
  },
  {
    name: "Ahmed Fawzy",
    role: "Product Owner",
    company: "BMO Tools",
    icon: "ti-briefcase",
    quote: "Building an RTL-ready Arabic tools platform is no small task. Mustafa handled every edge case with precision, and the result is smooth and highly usable.",
  },
  {
    name: "Nour El-Sayed",
    role: "Head of Content",
    company: "BRAVEZM Gaming",
    icon: "ti-speakerphone",
    quote: "The design Mustafa delivered stands out in the gaming space — dark, sharp, and professional. Our player sign-ups jumped noticeably after the launch.",
  },
  {
    name: "Youssef Gamal",
    role: "Curriculum Developer",
    company: "Ahmed Helly Academy",
    icon: "ti-school",
    quote: "The website Mustafa created reflects our brand perfectly. Easy to navigate, fast to load, and students find it intuitive. Outstanding work from start to finish.",
  },
  {
    name: "Mariam Adel",
    role: "Operations Lead",
    company: "OneTeam",
    icon: "ti-briefcase",
    quote: "Mustafa delivered a modern team collaboration landing page that communicates our value instantly. Clean code, responsive design, no corners cut.",
  },
  {
    name: "Hassan Diab",
    role: "Store Manager",
    company: "Diaa Elden Shop",
    icon: "ti-briefcase",
    quote: "Our e-commerce shop now loads in under two seconds and the checkout flow is seamless. Mustafa's attention to performance really shows in our conversion rates.",
  },
  {
    name: "Fatima Al-Rashid",
    role: "Managing Director",
    company: "MR Mohammed",
    icon: "ti-crown",
    quote: "Working with Mustafa was straightforward and professional. He delivered a polished business site on time, and the attention to detail in the typography impressed our whole team.",
  },
];

const row1 = [...TESTIMONIALS.slice(0, 5), ...TESTIMONIALS.slice(0, 5)];
const row2 = [...TESTIMONIALS.slice(5), ...TESTIMONIALS.slice(5)];

function Card({ t }: { t: typeof TESTIMONIALS[0] }) {
  return (
    <div
      className="flex-shrink-0 flex flex-col gap-3 rounded-[10px] p-4 select-none"
      style={{
        width: 240,
        background: "#0d1117",
        border: "1px solid #21262d",
      }}
      data-testid={`card-testimonial-${t.name.replace(/\s+/g, "-").toLowerCase()}`}
    >
      {/* Stars */}
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} style={{ color: "#f59e0b", fontSize: 13 }}>★</span>
        ))}
      </div>
      {/* Quote */}
      <p style={{ color: "#c9d1d9", fontSize: 13, lineHeight: "1.6" }}>
        "{t.quote}"
      </p>
      {/* Author */}
      <div className="flex items-center gap-2.5 mt-auto pt-1">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "#1a1a2e" }}
        >
          <i
            className={`ti ${t.icon}`}
            style={{ color: "hsl(234, 89%, 65%)", fontSize: 18 }}
          />
        </div>
        <div className="min-w-0">
          <p style={{ color: "#ffffff", fontWeight: 500, fontSize: 13 }} className="truncate">
            {t.name}
          </p>
          <p style={{ color: "#666", fontSize: 11 }} className="truncate">
            {t.role} · {t.company}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <section id="reviews" className="section-padding bg-white overflow-hidden">
      <div className="container-max mb-12">
        <span className="section-eyebrow">Testimonials</span>
        <h2 className="section-title">What clients say</h2>
        <p className="section-subtitle">Trusted by teams across different industries.</p>
      </div>

      {/* Marquee area */}
      <div className="relative">
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 h-full w-28 pointer-events-none z-10"
          style={{ background: "linear-gradient(to right, white 20%, transparent)" }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 h-full w-28 pointer-events-none z-10"
          style={{ background: "linear-gradient(to left, white 20%, transparent)" }}
        />

        {/* Row 1 — scrolls left */}
        <div className="marquee-wrapper overflow-hidden mb-4">
          <div
            className="marquee-track flex gap-4"
            style={{ animation: "marquee-left 28s linear infinite" }}
          >
            {row1.map((t, i) => (
              <Card key={`r1-${i}`} t={t} />
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="marquee-wrapper overflow-hidden">
          <div
            className="marquee-track flex gap-4"
            style={{ animation: "marquee-right 32s linear infinite" }}
          >
            {row2.map((t, i) => (
              <Card key={`r2-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
