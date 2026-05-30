import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/hooks/useTheme";
import { useLang } from "@/contexts/LanguageContext";
import type { Client } from "@shared/schema";

const STATS = [
  { value: "9+",   label: "projects delivered" },
  { value: "100%", label: "on-time delivery" },
  { value: "0",    label: "launch-day bugs" },
  { value: "4+",   label: "years active" },
];

/* ── SVG logo icons per brand ───────────────────────────────────────────── */
function BravezMLogo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
      <path d="M20 4L6 12v16l14 8 14-8V12L20 4z" fill="#ff4444" opacity="0.15" stroke="#ff4444" strokeWidth="1.5"/>
      <path d="M13 18l7-4 7 4v6l-7 4-7-4v-6z" fill="#ff4444" opacity="0.4"/>
      <path d="M17 21l3-6 3 6" stroke="#ff5555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 26l2-2 3 3 3-3 2 2" stroke="#ff7777" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BestyBoyLogo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
      <rect x="8" y="14" width="24" height="16" rx="4" stroke="#ff6b35" strokeWidth="1.5" fill="#ff6b35" fillOpacity="0.1"/>
      <circle cx="14" cy="22" r="3" fill="#ff6b35" opacity="0.8"/>
      <circle cx="26" cy="22" r="3" fill="none" stroke="#ff6b35" strokeWidth="1.5"/>
      <path d="M22 19v3M20.5 20.5h3" stroke="#ff6b35" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 10l-2 4M28 10l2 4" stroke="#ff8855" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function AhmedHellyLogo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
      <path d="M20 6l13 5v9c0 7-6 12-13 14C13 32 7 27 7 20v-9l13-5z" fill="#4f9eff" fillOpacity="0.1" stroke="#4f9eff" strokeWidth="1.5"/>
      <path d="M15 20h10M17 17l3 3-3 3" stroke="#4f9eff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function EcoEatsLogo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
      <path d="M20 8c-6 0-10 5-10 11 0 8 6 13 10 13s10-5 10-13c0-6-4-11-10-11z" fill="#22c55e" fillOpacity="0.15" stroke="#22c55e" strokeWidth="1.5"/>
      <path d="M16 24c1-4 4-8 8-10M20 14v10" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="20" cy="14" r="2" fill="#22c55e"/>
    </svg>
  );
}

function BMOToolsLogo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
      <circle cx="20" cy="20" r="12" stroke="#a855f7" strokeWidth="1.5" fill="#a855f7" fillOpacity="0.1"/>
      <circle cx="20" cy="20" r="4" fill="#a855f7" opacity="0.7"/>
      <path d="M20 8v4M20 28v4M8 20h4M28 20h4" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M11.5 11.5l2.8 2.8M25.7 25.7l2.8 2.8M11.5 28.5l2.8-2.8M25.7 14.3l2.8-2.8" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function OneTeamLogo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
      <circle cx="20" cy="14" r="4" fill="#f59e0b" opacity="0.8"/>
      <circle cx="11" cy="22" r="3.5" fill="#f59e0b" opacity="0.6"/>
      <circle cx="29" cy="22" r="3.5" fill="#f59e0b" opacity="0.6"/>
      <path d="M20 18v4M20 22l-6 4M20 22l6 4" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M11 18v8M29 18v8" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function BemoraLogo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
      <rect x="8" y="8" width="24" height="24" rx="6" stroke="#06b6d4" strokeWidth="1.5" fill="#06b6d4" fillOpacity="0.1"/>
      <path d="M14 14h6c2.5 0 4 1.2 4 3s-1.5 3-4 3h-6v-6z" stroke="#06b6d4" strokeWidth="1.5" strokeLinejoin="round" fill="#06b6d4" fillOpacity="0.2"/>
      <path d="M14 20h7c2.5 0 4 1.2 4 3s-1.5 3-4 3h-7v-6z" stroke="#06b6d4" strokeWidth="1.5" strokeLinejoin="round" fill="#06b6d4" fillOpacity="0.35"/>
    </svg>
  );
}

function MRMohammedLogo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
      <path d="M20 6l2.5 7.5H30l-6.3 4.6 2.4 7.4L20 21l-6.1 4.5 2.4-7.4L10 13.5h7.5L20 6z" fill="#ec4899" fillOpacity="0.2" stroke="#ec4899" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

function DiaaEldenLogo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
      <path d="M12 12h16l-2 14H14L12 12z" stroke="#84cc16" strokeWidth="1.5" strokeLinejoin="round" fill="#84cc16" fillOpacity="0.1"/>
      <path d="M9 12h3M28 12h3" stroke="#84cc16" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="17" cy="30" r="2" fill="#84cc16" opacity="0.8"/>
      <circle cx="24" cy="30" r="2" fill="#84cc16" opacity="0.8"/>
      <path d="M16 18h8M17 22h6" stroke="#84cc16" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

const BRAND_LOGOS: Record<string, () => JSX.Element> = {
  "BRAVEZM Gaming":      BravezMLogo,
  "BestyBoy Gaming":     BestyBoyLogo,
  "Ahmed Helly Academy": AhmedHellyLogo,
  "Eco Eats":            EcoEatsLogo,
  "BMO Tools":           BMOToolsLogo,
  "OneTeam":             OneTeamLogo,
  "Bemora":              BemoraLogo,
  "MR Mohammed":         MRMohammedLogo,
  "Diaa Elden Shop":     DiaaEldenLogo,
};

const FALLBACK_BRANDS = [
  { id: -1, name: "BRAVEZM Gaming",      color: "#ff4444", imageUrl: null },
  { id: -2, name: "BestyBoy Gaming",     color: "#ff6b35", imageUrl: null },
  { id: -3, name: "Ahmed Helly Academy", color: "#4f9eff", imageUrl: null },
  { id: -4, name: "Eco Eats",            color: "#22c55e", imageUrl: null },
  { id: -5, name: "BMO Tools",           color: "#a855f7", imageUrl: null },
  { id: -6, name: "OneTeam",             color: "#f59e0b", imageUrl: null },
  { id: -7, name: "Bemora",              color: "#06b6d4", imageUrl: null },
  { id: -8, name: "MR Mohammed",         color: "#ec4899", imageUrl: null },
  { id: -9, name: "Diaa Elden Shop",     color: "#84cc16", imageUrl: null },
];

function LogoChip({ name, color, imageUrl, dark }: { name: string; color: string; imageUrl?: string | null; dark: boolean }) {
  const LogoSVG = BRAND_LOGOS[name];
  const border = dark ? "hsl(222 28% 19%)" : "#e5e7eb";
  const bg = dark ? "hsl(222 42% 12%)" : "#ffffff";

  return (
    <div
      className="flex items-center justify-center flex-shrink-0 rounded-2xl"
      style={{
        width: "72px",
        height: "72px",
        background: bg,
        border: `1px solid ${border}`,
        boxShadow: dark
          ? "0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px hsl(222 28% 16%)"
          : "0 4px 16px rgba(0,0,0,0.06)",
        transition: "transform 0.2s",
      }}
      title={name}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="w-10 h-10 object-contain" />
      ) : LogoSVG ? (
        <LogoSVG />
      ) : (
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: color }}
        >
          <span className="text-sm font-bold text-white">{name.slice(0, 2).toUpperCase()}</span>
        </div>
      )}
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

  const brands = (apiClients.length > 0 ? apiClients : FALLBACK_BRANDS) as typeof FALLBACK_BRANDS;

  const bg    = isDark ? "hsl(var(--background))" : "#f9fafb";
  const text  = isDark ? "hsl(var(--foreground))" : "#111827";
  const muted = isDark ? "hsl(var(--muted-foreground))" : "#6b7280";
  const statBorder = isDark ? "hsl(var(--border))" : "#e5e7eb";
  const statBg     = isDark ? "hsl(var(--card))" : "#ffffff";

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

      {/* SVG logo marquee — logos only, no text */}
      <div className="relative py-4">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: `linear-gradient(to right, ${bg}, transparent)` }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: `linear-gradient(to left, ${bg}, transparent)` }} />

        <div className="overflow-hidden">
          <div
            className="flex items-center gap-5"
            style={{ animation: "marquee-ltr 28s linear infinite", width: "max-content" }}
          >
            {[...brands, ...brands, ...brands, ...brands].map((b, i) => (
              <LogoChip key={i} name={b.name} color={b.color} imageUrl={b.imageUrl} dark={isDark} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee-ltr {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 4)); }
        }
      `}</style>
    </section>
  );
}
