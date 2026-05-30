import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/hooks/useTheme";
import { useLang } from "@/contexts/LanguageContext";
import type { Client } from "@shared/schema";

/* ── High-tech SVG logo icons per brand ─────────────────────────────────── */

function BravezMLogo() {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" width="44" height="44">
      <defs>
        <clipPath id="bz-hex"><polygon points="22,3 39,12.5 39,31.5 22,41 5,31.5 5,12.5" /></clipPath>
      </defs>
      <polygon points="22,3 39,12.5 39,31.5 22,41 5,31.5 5,12.5"
        fill="#ff3333" fillOpacity="0.12" stroke="#ff3333" strokeWidth="1.4" />
      <path d="M14 28 L20 14 L22 20 L24 14 L30 28" stroke="#ff4444" strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M16 28 L28 28" stroke="#ff6666" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="22" cy="14" r="2" fill="#ff4444" />
    </svg>
  );
}

function BestyBoyLogo() {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" width="44" height="44">
      <rect x="7" y="14" width="30" height="18" rx="5" stroke="#ff6b35" strokeWidth="1.4"
        fill="#ff6b35" fillOpacity="0.1" />
      <circle cx="15" cy="23" r="3.5" fill="#ff6b35" fillOpacity="0.85" />
      <rect x="23" y="21" width="6" height="1.5" rx="0.75" fill="#ff6b35" />
      <rect x="25.25" y="19" width="1.5" height="6" rx="0.75" fill="#ff6b35" />
      <rect x="12" y="9" width="3" height="5" rx="1.5" fill="#ff6b35" fillOpacity="0.7" />
      <rect x="29" y="9" width="3" height="5" rx="1.5" fill="#ff6b35" fillOpacity="0.7" />
      <path d="M10 32 L7 37 M34 32 L37 37" stroke="#ff6b35" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function AhmedHellyLogo() {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" width="44" height="44">
      <circle cx="22" cy="22" r="16" stroke="#4f9eff" strokeWidth="1.4" fill="#4f9eff" fillOpacity="0.08" />
      <circle cx="22" cy="22" r="10" stroke="#4f9eff" strokeWidth="1" strokeDasharray="2 3" />
      <path d="M16 27 L22 14 L28 27" stroke="#4f9eff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 23 L26 23" stroke="#4f9eff" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M19 8 L22 5 L25 8" stroke="#4f9eff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
        fill="none" />
    </svg>
  );
}

function EcoEatsLogo() {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" width="44" height="44">
      <path d="M22 8 C14 8 10 14 10 20 C10 28 16 35 22 37 C28 35 34 28 34 20 C34 14 30 8 22 8Z"
        fill="#22c55e" fillOpacity="0.1" stroke="#22c55e" strokeWidth="1.4" />
      <path d="M22 37 L22 18" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M22 18 C22 18 28 14 32 10" stroke="#22c55e" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M22 22 C22 22 16 18 12 15" stroke="#22c55e" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="22" cy="18" r="2.5" fill="#22c55e" />
      <path d="M15 27 L29 27" stroke="#22c55e" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 2" />
    </svg>
  );
}

function BMOToolsLogo() {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" width="44" height="44">
      <path d="M22 6 L29 9.5 L32 16.5 L29 23.5 L22 27 L15 23.5 L12 16.5 L15 9.5 Z"
        stroke="#a855f7" strokeWidth="1.4" fill="#a855f7" fillOpacity="0.1" />
      <circle cx="22" cy="17" r="4.5" stroke="#a855f7" strokeWidth="1.6" fill="none" />
      <circle cx="22" cy="17" r="1.5" fill="#a855f7" />
      <path d="M20 30 L20 38 M24 30 L24 38" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M17 38 L27 38" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function OneTeamLogo() {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" width="44" height="44">
      <circle cx="22" cy="13" r="5" fill="#f59e0b" fillOpacity="0.85" />
      <circle cx="12" cy="30" r="4.5" fill="#f59e0b" fillOpacity="0.65" />
      <circle cx="32" cy="30" r="4.5" fill="#f59e0b" fillOpacity="0.65" />
      <path d="M22 18 L12 26 M22 18 L32 26 M12 26 L32 26"
        stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M22 18 L22 26" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
    </svg>
  );
}

function BemoraLogo() {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" width="44" height="44">
      <rect x="7" y="7" width="30" height="30" rx="8" stroke="#06b6d4" strokeWidth="1.4"
        fill="#06b6d4" fillOpacity="0.08" />
      <path d="M14 13 L14 31" stroke="#06b6d4" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M14 13 L23 13 C26.3 13 28 14.8 28 17.5 C28 20.2 26.3 22 23 22 L14 22"
        stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M14 22 L24 22 C27.3 22 30 23.8 30 26.5 C30 29.2 27.3 31 24 31 L14 31"
        stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function MRMohammedLogo() {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" width="44" height="44">
      <path d="M22 5 L26 15 L37 15 L28 22 L31 33 L22 27 L13 33 L16 22 L7 15 L18 15 Z"
        fill="#ec4899" fillOpacity="0.15" stroke="#ec4899" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M14 22 L19 17 L22 22 L25 17 L30 22"
        stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function DiaaEldenLogo() {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" width="44" height="44">
      <path d="M10 10 L34 10 L31 34 L13 34 Z"
        fill="#84cc16" fillOpacity="0.1" stroke="#84cc16" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M7 10 L10 10 M34 10 L37 10" stroke="#84cc16" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="17" cy="37" r="2.5" fill="#84cc16" />
      <circle cx="27" cy="37" r="2.5" fill="#84cc16" />
      <path d="M15 18 L29 18 M16 23 L28 23 M18 28 L26 28"
        stroke="#84cc16" strokeWidth="1.3" strokeLinecap="round" />
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
        width: "76px",
        height: "76px",
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

  return (
    <section id="reviews" className="section-padding border-t border-border overflow-hidden" style={{ background: bg }}>
      <div className="container-max mb-12">
        <span className="section-eyebrow">{t.reviews.eyebrow}</span>
        <h2 className="section-title" style={{ color: text }}>Clients I've worked with</h2>
        <p className="section-subtitle" style={{ color: muted }}>
          From gaming communities to e-commerce platforms — shipped, live, and used by real people.
        </p>
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
