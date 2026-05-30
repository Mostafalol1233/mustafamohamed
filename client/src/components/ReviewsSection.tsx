import { useTheme } from "@/hooks/useTheme";
import { useLang } from "@/contexts/LanguageContext";

const BRANDS = [
  { name: "BRAVEZM Gaming",      initials: "BZ", color: "#ff4444" },
  { name: "BestyBoy Gaming",     initials: "BB", color: "#ff6b35" },
  { name: "Ahmed Helly Academy", initials: "AH", color: "#4f9eff" },
  { name: "Eco Eats",            initials: "EE", color: "#22c55e" },
  { name: "BMO Tools",           initials: "BM", color: "#a855f7" },
  { name: "OneTeam",             initials: "OT", color: "#f59e0b" },
  { name: "Bemora",              initials: "BR", color: "#06b6d4" },
  { name: "MR Mohammed",         initials: "MM", color: "#ec4899" },
  { name: "Diaa Elden Shop",     initials: "DE", color: "#84cc16" },
];

const STATS = [
  { value: "9+",   label: "projects delivered" },
  { value: "100%", label: "on-time delivery" },
  { value: "0",    label: "launch-day bugs" },
  { value: "4+",   label: "years active" },
];

function BrandChip({ name, initials, color, dark }: { name: string; initials: string; color: string; dark: boolean }) {
  const bg     = dark ? "#0d1117" : "#ffffff";
  const border = dark ? "#21262d" : "#e5e7eb";
  const text   = dark ? "#e6edf3" : "#111827";
  const sub    = dark ? "#484f58" : "#9ca3af";

  return (
    <div
      className="flex items-center gap-3 px-5 py-3 rounded-xl flex-shrink-0 select-none"
      style={{ background: bg, border: `1px solid ${border}`, boxShadow: dark ? "0 2px 12px rgba(0,0,0,0.25)" : "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
        style={{ background: color }}
      >
        {initials}
      </div>
      <div>
        <p className="text-sm font-semibold whitespace-nowrap" style={{ color: text }}>{name}</p>
        <p className="text-xs whitespace-nowrap" style={{ color: sub }}>client project</p>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const { isDark } = useTheme();
  const { t } = useLang();

  const bg    = isDark ? "#080c12" : "#f9fafb";
  const text  = isDark ? "#e6edf3" : "#111827";
  const muted = isDark ? "#8b949e" : "#6b7280";
  const statBorder = isDark ? "#21262d" : "#e5e7eb";
  const statBg     = isDark ? "#0d1117" : "#ffffff";

  return (
    <section id="reviews" className="section-padding border-t border-border overflow-hidden" style={{ background: bg }}>
      <div className="container-max mb-12">
        <span className="section-eyebrow">{t.reviews.eyebrow}</span>
        <h2 className="section-title" style={{ color: text }}>Built for real clients</h2>
        <p className="section-subtitle" style={{ color: muted }}>
          From gaming communities to e-commerce platforms — shipped, live, and used by real people.
        </p>
      </div>

      {/* Stats row */}
      <div className="container-max mb-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(({ value, label }) => (
            <div key={label} className="rounded-xl p-5 text-center" style={{ background: statBg, border: `1px solid ${statBorder}` }}>
              <div className="text-3xl font-bold mb-1" style={{ color: "hsl(var(--primary))" }}>{value}</div>
              <div className="text-xs font-medium" style={{ color: muted }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scrolling marquee */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: `linear-gradient(to right, ${bg}, transparent)` }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: `linear-gradient(to left, ${bg}, transparent)` }} />

        <div className="overflow-hidden">
          <div
            className="flex gap-4"
            style={{
              animation: "marquee 30s linear infinite",
              width: "max-content",
            }}
          >
            {[...BRANDS, ...BRANDS, ...BRANDS].map((b, i) => (
              <BrandChip key={i} {...b} dark={isDark} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
      `}</style>
    </section>
  );
}
