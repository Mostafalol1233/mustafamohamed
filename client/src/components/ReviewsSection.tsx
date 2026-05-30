import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useLang } from "@/contexts/LanguageContext";

const REVIEWS_EN = [
  { id: "031", name: "Karim Hassan",    title: "Community Manager",     company: "BRAVEZM Gaming",      quote: "Delivered exactly what we needed, on time and with clean code. Highly recommend." },
  { id: "029", name: "Dr. Sara Mahmoud", title: "Academic Director",    company: "Ahmed Helly Academy", quote: "Enrollment inquiries more than doubled after launch. Clean, professional, and trustworthy." },
  { id: "027", name: "Omar Khalid",     title: "Esports Coordinator",   company: "BestyBoy Gaming",     quote: "Turned our concept into a platform our community genuinely loves. Fast and detail-oriented." },
  { id: "024", name: "Layla Ibrahim",   title: "Campaign Lead",         company: "Eco Eats",            quote: "He understood our mission and built something that resonated with our audience immediately." },
  { id: "021", name: "Ahmed Fawzy",     title: "Product Owner",         company: "BMO Tools",           quote: "RTL-ready, fully responsive, and zero bugs on launch day. Exactly what we asked for." },
  { id: "018", name: "Natasha Reed",    title: "Managing Director",     company: "MR Mohammed",         quote: "Professional from start to finish. The site impressed our entire team on first review." },
];

const REVIEWS_AR = [
  { id: "031", name: "كريم حسن",        title: "مدير مجتمع",              company: "BRAVEZM Gaming",       quote: "سلّم بالظبط اللي احنا محتاجينه، في الوقت المحدد وبكود نضيف. بنصح بيه جداً." },
  { id: "029", name: "د. سارة محمود",   title: "مدير أكاديمي",            company: "أكاديمية أحمد هيلي",   quote: "استفسارات التسجيل زادت أكتر من ضعفين بعد الإطلاق. شغل نضيف ومحترف وجدير بالثقة." },
  { id: "027", name: "عمر خالد",        title: "منسق رياضات إلكترونية",  company: "BestyBoy Gaming",      quote: "حوّل فكرتنا لمنصة مجتمعنا بيحبها فعلاً. سريع ومهتم بأدق التفاصيل." },
  { id: "024", name: "ليلى إبراهيم",    title: "مسؤولة حملات",            company: "Eco Eats",             quote: "فهم رسالتنا وبنى حاجة لاقت صدى عند جمهورنا فوراً." },
  { id: "021", name: "أحمد فوزي",       title: "مالك المنتج",             company: "BMO Tools",            quote: "جاهز للـ RTL، متجاوب تماماً، وصفر أخطاء يوم الإطلاق. بالظبط اللي طلبناه." },
  { id: "018", name: "ناتاشا ريد",      title: "مدير تنفيذي",             company: "MR Mohammed",          quote: "محترف من أول لآخر. الموقع أدهش كل فريقنا من أول نظرة." },
];

function githubHandle(name: string) {
  const parts = name.replace(/^د\.\s*/, "").split(" ");
  return parts.length >= 2
    ? `@${parts[0].toLowerCase()}_${parts[1].toLowerCase()}`
    : `@${parts[0].toLowerCase()}`;
}

export default function ReviewsSection() {
  const { isDark } = useTheme();
  const { lang, t } = useLang();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const reviews = lang === "ar" ? REVIEWS_AR : REVIEWS_EN;

  const bg        = isDark ? "#0d1117"  : "#ffffff";
  const headerBg  = isDark ? "#161b22"  : "#f6f8fa";
  const border    = isDark ? "#21262d"  : "#d0d7de";
  const textPri   = isDark ? "#e6edf3"  : "#24292f";
  const textSec   = isDark ? "#8b949e"  : "#57606a";
  const textFaint = isDark ? "#484f58"  : "#8c959f";
  const rowHover  = isDark ? "rgba(22,27,34,0.6)" : "rgba(246,248,250,0.7)";

  return (
    <section id="reviews" className="section-padding bg-background border-t border-border">
      <div className="container-max mb-10">
        <span className="section-eyebrow">{t.reviews.eyebrow}</span>
        <h2 className="section-title">{t.reviews.title}</h2>
        <p className="section-subtitle">{t.reviews.subtitle}</p>
      </div>

      <div className="container-max">
        <div
          style={{
            border: `1px solid ${border}`,
            borderRadius: 10,
            overflow: "hidden",
            background: bg,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          }}
        >
          {/* Terminal / repo header */}
          <div
            style={{
              background: headerBg,
              borderBottom: `1px solid ${border}`,
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f57", flexShrink: 0 }} />
            <span className="w-3 h-3 rounded-full" style={{ background: "#febc2e", flexShrink: 0 }} />
            <span className="w-3 h-3 rounded-full" style={{ background: "#28c840", flexShrink: 0 }} />
            <span style={{ color: textSec, fontSize: 12, marginLeft: 8 }}>
              $ git log --clients --merged --rating=5
            </span>
            <span
              style={{
                marginLeft: "auto",
                color: "#3fb950",
                fontSize: 11,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span
                style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#3fb950", display: "inline-block",
                }}
              />
              {reviews.length} merged
            </span>
          </div>

          {/* Issue list */}
          {reviews.map((r, i) => (
            <div
              key={r.id}
              data-testid={`card-review-${r.id}`}
              onMouseEnter={() => setHoveredId(r.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                borderBottom: i < reviews.length - 1 ? `1px solid ${border}` : "none",
                padding: "14px 16px",
                display: "flex",
                gap: 12,
                background: hoveredId === r.id ? rowHover : "transparent",
                transition: "background 0.15s ease",
                cursor: "default",
              }}
            >
              {/* Merged checkmark */}
              <div style={{ flexShrink: 0, marginTop: 1 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "rgba(63,185,80,0.12)",
                    border: "1px solid rgba(63,185,80,0.28)",
                    color: "#3fb950",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  ✓
                </span>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Title row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 5,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      color: "#3fb950",
                      fontSize: 10,
                      fontFamily: "monospace",
                      background: "rgba(63,185,80,0.1)",
                      border: "1px solid rgba(63,185,80,0.2)",
                      borderRadius: 4,
                      padding: "1px 7px",
                      letterSpacing: "0.03em",
                    }}
                  >
                    merged
                  </span>
                  <span style={{ color: textFaint, fontSize: 11, fontFamily: "monospace" }}>
                    #{r.id}
                  </span>
                  <span style={{ color: textPri, fontSize: 13, fontWeight: 600 }}>
                    {r.company}
                  </span>
                  <span
                    style={{
                      color: "#818cf8",
                      fontSize: 10,
                      background: "rgba(129,140,248,0.1)",
                      border: "1px solid rgba(129,140,248,0.2)",
                      borderRadius: 4,
                      padding: "1px 7px",
                    }}
                  >
                    {r.title}
                  </span>
                </div>

                {/* Quote */}
                <p
                  style={{
                    color: textSec,
                    fontSize: 12,
                    lineHeight: 1.7,
                    marginBottom: 7,
                    paddingLeft: 14,
                    borderLeft: `2px solid ${border}`,
                  }}
                >
                  {r.quote}
                </p>

                {/* Meta row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 11,
                    color: textFaint,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ color: "#58a6ff" }}>{githubHandle(r.name)}</span>
                  <span>·</span>
                  <span>{r.name}</span>
                  <span style={{ marginLeft: "auto", color: "#f59e0b", letterSpacing: 2 }}>★★★★★</span>
                </div>
              </div>
            </div>
          ))}

          {/* Footer */}
          <div
            style={{
              background: headerBg,
              borderTop: `1px solid ${border}`,
              padding: "8px 16px",
            }}
          >
            <span style={{ color: textFaint, fontSize: 11, fontFamily: "monospace" }}>
              {`> ${reviews.length} issues closed · avg rating 5.0 · 0 bugs reported`}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
