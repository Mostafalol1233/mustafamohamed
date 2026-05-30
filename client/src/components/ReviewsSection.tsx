import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/hooks/useTheme";
import { useLang } from "@/contexts/LanguageContext";
import type { Client } from "@shared/schema";

const FALLBACK_BRANDS = [
  { id: -1, name: "BRAVEZM Gaming",      initials: "BZ", color: "#ff4444", imageUrl: null, isVisible: true, sortOrder: 0, createdAt: null },
  { id: -2, name: "BestyBoy Gaming",     initials: "BB", color: "#ff6b35", imageUrl: null, isVisible: true, sortOrder: 1, createdAt: null },
  { id: -3, name: "Ahmed Helly Academy", initials: "AH", color: "#4f9eff", imageUrl: null, isVisible: true, sortOrder: 2, createdAt: null },
  { id: -4, name: "Eco Eats",            initials: "EE", color: "#22c55e", imageUrl: null, isVisible: true, sortOrder: 3, createdAt: null },
  { id: -5, name: "BMO Tools",           initials: "BM", color: "#a855f7", imageUrl: null, isVisible: true, sortOrder: 4, createdAt: null },
  { id: -6, name: "OneTeam",             initials: "OT", color: "#f59e0b", imageUrl: null, isVisible: true, sortOrder: 5, createdAt: null },
  { id: -7, name: "Bemora",              initials: "BR", color: "#06b6d4", imageUrl: null, isVisible: true, sortOrder: 6, createdAt: null },
  { id: -8, name: "MR Mohammed",         initials: "MM", color: "#ec4899", imageUrl: null, isVisible: true, sortOrder: 7, createdAt: null },
  { id: -9, name: "Diaa Elden Shop",     initials: "DE", color: "#84cc16", imageUrl: null, isVisible: true, sortOrder: 8, createdAt: null },
];

const STATS = [
  { value: "9+",   label: "projects delivered" },
  { value: "100%", label: "on-time delivery" },
  { value: "0",    label: "launch-day bugs" },
  { value: "4+",   label: "years active" },
];

function BrandChip({ name, initials, color, imageUrl, dark }: { name: string; initials: string; color: string; imageUrl?: string | null; dark: boolean }) {
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
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
        style={{ background: imageUrl ? "transparent" : color, border: imageUrl ? `1px solid ${border}` : "none" }}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-contain" />
        ) : (
          <span className="text-xs font-bold text-white">{initials}</span>
        )}
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

  const { data: apiClients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
    staleTime: 60_000,
  });

  const brands = apiClients.length > 0 ? apiClients : FALLBACK_BRANDS;

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
            {[...brands, ...brands, ...brands].map((b, i) => (
              <BrandChip key={i} name={b.name} initials={b.initials} color={b.color} imageUrl={b.imageUrl} dark={isDark} />
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
