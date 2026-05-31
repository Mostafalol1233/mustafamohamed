import { useTheme } from "@/hooks/useTheme";
import { useLang } from "@/contexts/LanguageContext";
import {
  SiGoogle, SiStripe, SiGithub, SiVercel, SiSupabase,
  SiReact, SiTypescript, SiNodedotjs, SiFigma, SiTailwindcss,
  SiNextdotjs, SiPostgresql,
} from "react-icons/si";

interface BrandItem {
  name: string;
  Icon?: React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }>;
  color: string;
  customLogo?: React.ReactNode;
}

function PayMobLogo({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="14" width="56" height="36" rx="8" stroke={color} strokeWidth="2.5" fill={color} fillOpacity="0.08" />
      <path d="M12 26 L12 38" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M12 26 L22 26 C25 26 27 28 27 31 C27 34 25 36 22 36 L12 36" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M31 26 L36 38 L41 26" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="52" cy="32" r="6" stroke={color} strokeWidth="2.5" fill="none" />
      <circle cx="52" cy="32" r="2" fill={color} />
    </svg>
  );
}

const BRANDS: BrandItem[] = [
  { name: "Google",     Icon: SiGoogle,     color: "#4285F4" },
  { name: "Stripe",     Icon: SiStripe,     color: "#635BFF" },
  { name: "PayMob",     color: "#00B862",   customLogo: null },
  { name: "GitHub",     Icon: SiGithub,     color: "#24292F" },
  { name: "Vercel",     Icon: SiVercel,     color: "#000000" },
  { name: "Supabase",   Icon: SiSupabase,   color: "#3ECF8E" },
  { name: "React",      Icon: SiReact,      color: "#61DAFB" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "Node.js",    Icon: SiNodedotjs,  color: "#339933" },
  { name: "Next.js",    Icon: SiNextdotjs,  color: "#000000" },
  { name: "Tailwind",   Icon: SiTailwindcss,color: "#06B6D4" },
  { name: "PostgreSQL", Icon: SiPostgresql, color: "#4169E1" },
  { name: "Figma",      Icon: SiFigma,      color: "#F24E1E" },
];

function BrandChip({ brand, dark }: { brand: BrandItem; dark: boolean }) {
  const border = dark ? "hsl(222 28% 19%)" : "#e5e7eb";
  const bg     = dark ? "hsl(222 42% 12%)" : "#ffffff";
  const iconColor = dark
    ? brand.color === "#000000" ? "#ffffff" : brand.color
    : brand.color;

  return (
    <div
      className="flex flex-col items-center justify-center flex-shrink-0 rounded-2xl gap-2 select-none"
      style={{
        width: "88px",
        height: "88px",
        background: bg,
        border: `1px solid ${border}`,
        boxShadow: dark
          ? "0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px hsl(222 28% 16%)"
          : "0 4px 16px rgba(0,0,0,0.06)",
        transition: "transform 0.2s",
      }}
      title={brand.name}
    >
      {brand.name === "PayMob" ? (
        <PayMobLogo color={iconColor} size={32} />
      ) : brand.Icon ? (
        <brand.Icon size={28} style={{ color: iconColor, flexShrink: 0 }} />
      ) : null}
      <span
        style={{
          fontSize: "9.5px",
          fontWeight: 600,
          letterSpacing: "0.04em",
          color: dark ? "hsl(215 18% 52%)" : "#6b7280",
          fontFamily: "system-ui, sans-serif",
          lineHeight: 1,
        }}
      >
        {brand.name}
      </span>
    </div>
  );
}

export default function ReviewsSection() {
  const { isDark } = useTheme();
  const { t } = useLang();

  const bg    = isDark ? "hsl(var(--background))" : "#f9fafb";
  const text  = isDark ? "hsl(var(--foreground))" : "#111827";
  const muted = isDark ? "hsl(var(--muted-foreground))" : "#6b7280";

  return (
    <section id="reviews" className="section-padding border-t border-border overflow-hidden" style={{ background: bg }}>
      <div className="container-max mb-12">
        <span className="section-eyebrow">{t.reviews?.eyebrow ?? "Stack & Tools"}</span>
        <h2 className="section-title" style={{ color: text }}>Tools &amp; Technologies I Work With</h2>
        <p className="section-subtitle" style={{ color: muted }}>
          From authentication to deployment — the stack behind every project I ship.
        </p>
      </div>

      <div className="relative py-4">
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: `linear-gradient(to right, ${bg}, transparent)` }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: `linear-gradient(to left, ${bg}, transparent)` }}
        />

        <div className="overflow-hidden">
          <div
            className="flex items-center gap-5"
            style={{ animation: "marquee-ltr 32s linear infinite", width: "max-content" }}
          >
            {[...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS].map((b, i) => (
              <BrandChip key={i} brand={b} dark={isDark} />
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
