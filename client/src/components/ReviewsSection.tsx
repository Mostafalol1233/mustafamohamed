const TESTIMONIALS = [
  {
    name: "Karim Hassan",
    role: "Community Manager",
    company: "BRAVEZM Gaming",
    icon: "ti-device-gamepad-2",
    lang: "en",
    quote: "Mustafa built our platform exactly as we envisioned. Performs great under heavy traffic and the UI keeps our community engaged.",
  },
  {
    name: "أحمد سامي",
    role: "صاحب بيزنس",
    company: "القاهرة",
    icon: "ti-briefcase",
    lang: "ar",
    quote: "شغل محترم جداً وسريع، فهم اللي أنا عايزه من أول مرة وعمل موقع أحسن مما كنت متصور.",
  },
  {
    name: "Dr. Sara Mahmoud",
    role: "Academic Director",
    company: "Ahmed Helly Academy",
    icon: "ti-school",
    lang: "en",
    quote: "Our academy needed a clean, trustworthy presence. Enrollment inquiries more than doubled since launch.",
  },
  {
    name: "محمود طارق",
    role: "فريلانسر",
    company: "الإسكندرية",
    icon: "ti-star",
    lang: "ar",
    quote: "تعاملت معاه في مشروع عاجل وسلّم في الموعد بالظبط. الشغل نضيف وما فيش مشاكل تقنية خالص.",
  },
  {
    name: "Layla Ibrahim",
    role: "Campaign Lead",
    company: "Eco Eats",
    icon: "ti-speakerphone",
    lang: "en",
    quote: "Mustafa understood our sustainability mission and turned it into an impactful site. Audience feedback has been overwhelmingly positive.",
  },
  {
    name: "نور الهدى",
    role: "مديرة تسويق",
    company: "القاهرة",
    icon: "ti-chart-bar",
    lang: "ar",
    quote: "أنا مبسوطة جداً من النتيجة، الموقع بقى أحسن بكتير وعدد الزيارات زاد في أول أسبوع.",
  },
  {
    name: "Omar Khalid",
    role: "Esports Coordinator",
    company: "BestyBoy Gaming",
    icon: "ti-device-gamepad-2",
    lang: "en",
    quote: "Professional and detail-oriented. He turned our concept into a real platform that our community loves.",
  },
  {
    name: "Ahmed Fawzy",
    role: "Product Owner",
    company: "BMO Tools",
    icon: "ti-settings",
    lang: "en",
    quote: "Building an RTL-ready Arabic tools platform is no small task. Mustafa handled every edge case with precision.",
  },
  {
    name: "سارة خالد",
    role: "مصممة مستقلة",
    company: "الجيزة",
    icon: "ti-palette",
    lang: "ar",
    quote: "بيشتغل بجدية وبيفهم التفاصيل كويس. قدّر يحوّل الفكرة بتاعتي لموقع شكله احترافي وأنيق.",
  },
];

const TRACK = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

function Card({ t, idx }: { t: typeof TESTIMONIALS[0]; idx: number }) {
  const isArabic = t.lang === "ar";
  return (
    <div
      className="flex-shrink-0 flex flex-col gap-2 rounded-lg p-4 select-none"
      style={{
        width: 210,
        background: "#0d1117",
        border: "1px solid #21262d",
        direction: isArabic ? "rtl" : "ltr",
      }}
      data-testid={`card-testimonial-${idx}`}
    >
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} style={{ color: "#f59e0b", fontSize: 11 }}>★</span>
        ))}
      </div>
      <p style={{ color: "#c9d1d9", fontSize: 12, lineHeight: "1.6", fontFamily: isArabic ? "system-ui, sans-serif" : "inherit" }}>
        {isArabic ? `"${t.quote}"` : `"${t.quote}"`}
      </p>
      <div className="flex items-center gap-2 mt-auto pt-1.5">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "#1a1a2e" }}
        >
          <i className={`ti ${t.icon}`} style={{ color: "#818cf8", fontSize: 14 }} />
        </div>
        <div className="min-w-0">
          <p style={{ color: "#ffffff", fontWeight: 500, fontSize: 12 }} className="truncate">{t.name}</p>
          <p style={{ color: "#555", fontSize: 10 }} className="truncate">{t.role} · {t.company}</p>
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
            className="marquee-track flex gap-3"
            style={{ animation: "marquee-left 45s linear infinite" }}
          >
            {TRACK.map((t, i) => <Card key={i} t={t} idx={i} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
