import { useTheme } from "@/hooks/useTheme";
import { useLang } from "@/contexts/LanguageContext";

const TESTIMONIALS_EN = [
  { name: "Karim Hassan",   title: "Community Manager",  company: "BRAVEZM Gaming",      quote: "Delivered exactly what we needed, on time and with clean code. Highly recommend." },
  { name: "Dr. Sara Mahmoud", title: "Academic Director", company: "Ahmed Helly Academy", quote: "Enrollment inquiries more than doubled after launch. Clean, professional, and trustworthy." },
  { name: "Omar Khalid",    title: "Esports Coordinator", company: "BestyBoy Gaming",    quote: "Turned our concept into a platform our community genuinely loves. Fast and detail-oriented." },
  { name: "Layla Ibrahim",  title: "Campaign Lead",      company: "Eco Eats",             quote: "He understood our mission and built something that resonated with our audience immediately." },
  { name: "Ahmed Fawzy",    title: "Product Owner",      company: "BMO Tools",            quote: "RTL-ready, fully responsive, and zero bugs on launch day. Exactly what we asked for." },
  { name: "Natasha Reed",   title: "Managing Director",  company: "MR Mohammed",          quote: "Professional from start to finish. The site impressed our entire team on first review." },
];

const TESTIMONIALS_AR = [
  { name: "كريم حسن",      title: "مدير مجتمع",         company: "BRAVEZM Gaming",       quote: "سلّم بالظبط اللي احنا محتاجينه، في الوقت المحدد وبكود نضيف. بنصح بيه جداً." },
  { name: "د. سارة محمود",  title: "مدير أكاديمي",       company: "أكاديمية أحمد هيلي",   quote: "استفسارات التسجيل زادت أكتر من ضعفين بعد الإطلاق. شغل نضيف ومحترف وجدير بالثقة." },
  { name: "عمر خالد",       title: "منسق رياضات إلكترونية", company: "BestyBoy Gaming",   quote: "حوّل فكرتنا لمنصة مجتمعنا بيحبها فعلاً. سريع ومهتم بأدق التفاصيل." },
  { name: "ليلى إبراهيم",   title: "مسؤولة حملات",       company: "Eco Eats",             quote: "فهم رسالتنا وبنى حاجة لاقت صدى عند جمهورنا فوراً." },
  { name: "أحمد فوزي",      title: "مالك المنتج",        company: "BMO Tools",            quote: "جاهز للـ RTL، متجاوب تماماً، وصفر أخطاء يوم الإطلاق. بالظبط اللي طلبناه." },
  { name: "ناتاشا ريد",     title: "مدير تنفيذي",        company: "MR Mohammed",          quote: "محترف من أول لآخر. الموقع أدهش كل فريقنا من أول نظرة." },
];

const TRACK_EN = [...TESTIMONIALS_EN, ...TESTIMONIALS_EN, ...TESTIMONIALS_EN, ...TESTIMONIALS_EN];
const TRACK_AR = [...TESTIMONIALS_AR, ...TESTIMONIALS_AR, ...TESTIMONIALS_AR, ...TESTIMONIALS_AR];

function Card({ name, title, company, quote, isDark, idx }: {
  name: string; title: string; company: string; quote: string; isDark: boolean; idx: number;
}) {
  const cardBg     = isDark ? "#0d1117" : "#0f172a";
  const cardBorder = isDark ? "#21262d" : "#1e293b";
  const quoteColor = isDark ? "#c9d1d9" : "#cbd5e1";
  const nameColor  = isDark ? "#e6edf3" : "#f1f5f9";
  const metaColor  = isDark ? "#555"    : "#475569";
  const avatarBg   = isDark ? "#1c2333" : "#1e293b";

  return (
    <div
      className="flex-shrink-0 flex flex-col gap-3 rounded-lg p-5 select-none"
      style={{ width: 240, background: cardBg, border: `1px solid ${cardBorder}` }}
      data-testid={`card-testimonial-${idx}`}
    >
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} style={{ color: "#f59e0b", fontSize: 12 }}>★</span>
        ))}
      </div>
      <p style={{ color: quoteColor, fontSize: 13, lineHeight: "1.65" }}>"{quote}"</p>
      <div className="flex items-center gap-2.5 mt-auto pt-2 border-t" style={{ borderColor: cardBorder }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold"
          style={{ background: avatarBg, color: "#818cf8" }}>
          {name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p style={{ color: nameColor, fontWeight: 600, fontSize: 13 }} className="truncate">{name}</p>
          <p style={{ color: metaColor, fontSize: 11 }} className="truncate">{title} · {company}</p>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const { isDark } = useTheme();
  const { lang, t } = useLang();

  const track = lang === "ar" ? TRACK_AR : TRACK_EN;

  const fadeBg = isDark ? "hsl(var(--background))" : "hsl(var(--background))";
  const fadeL = `linear-gradient(to right, ${fadeBg} 0%, transparent 100%)`;
  const fadeR = `linear-gradient(to left,  ${fadeBg} 0%, transparent 100%)`;

  return (
    <section id="reviews" className="section-padding bg-background overflow-hidden border-t border-border">
      <div className="container-max mb-10">
        <span className="section-eyebrow">{t.reviews.eyebrow}</span>
        <h2 className="section-title">{t.reviews.title}</h2>
        <p className="section-subtitle">{t.reviews.subtitle}</p>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 h-full w-28 pointer-events-none z-10" style={{ background: fadeL }} />
        <div className="absolute right-0 top-0 h-full w-28 pointer-events-none z-10" style={{ background: fadeR }} />

        <div className="marquee-wrapper overflow-hidden">
          <div className="marquee-track flex gap-4" style={{ animation: "marquee-left 40s linear infinite" }}>
            {track.map((item, i) => (
              <Card key={i} idx={i} isDark={isDark} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
