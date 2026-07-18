import { useLang } from "@/contexts/LanguageContext";
import {
  SiGoogle, SiStripe, SiGithub, SiVercel, SiSupabase,
  SiAmazon, SiCloudflare, SiMongodb, SiShopify, SiNetlify,
  SiDigitalocean, SiFigma, SiDocker, SiRedis, SiOpenai,
  SiMeta, SiApple, SiSlack, SiAtlassian, SiLinear,
} from "react-icons/si";
import { useTheme } from "@/hooks/useTheme";

interface BrandItem {
  name: string;
  Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  color: string;
  colorDark?: string;
}

const BRANDS: BrandItem[] = [
  { name: "Google",       Icon: SiGoogle,       color: "#4285F4" },
  { name: "Amazon AWS",   Icon: SiAmazon,       color: "#FF9900" },
  { name: "OpenAI",       Icon: SiOpenai,       color: "#10a37f" },
  { name: "Stripe",       Icon: SiStripe,       color: "#635BFF" },
  { name: "Cloudflare",   Icon: SiCloudflare,   color: "#F6821F" },
  { name: "GitHub",       Icon: SiGithub,       color: "#24292F",  colorDark: "#e6edf3" },
  { name: "Vercel",       Icon: SiVercel,       color: "#111111",  colorDark: "#e6edf3" },
  { name: "Supabase",     Icon: SiSupabase,     color: "#3ECF8E" },
  { name: "Shopify",      Icon: SiShopify,      color: "#96BF48" },
  { name: "Slack",        Icon: SiSlack,        color: "#E01E5A" },
  { name: "Atlassian",    Icon: SiAtlassian,    color: "#0052CC" },
  { name: "Netlify",      Icon: SiNetlify,      color: "#00C7B7" },
  { name: "Docker",       Icon: SiDocker,       color: "#2496ED" },
  { name: "MongoDB",      Icon: SiMongodb,      color: "#47A248" },
  { name: "Redis",        Icon: SiRedis,        color: "#FF4438" },
  { name: "DigitalOcean", Icon: SiDigitalocean, color: "#0080FF" },
  { name: "Linear",       Icon: SiLinear,       color: "#5E6AD2" },
  { name: "Figma",        Icon: SiFigma,        color: "#F24E1E" },
  { name: "Meta",         Icon: SiMeta,         color: "#0081FB" },
  { name: "Apple",        Icon: SiApple,        color: "#555555",  colorDark: "#cccccc" },
];

function BrandName({ brand, isDark }: { brand: BrandItem; isDark: boolean }) {
  const iconColor = isDark && brand.colorDark ? brand.colorDark : brand.color;
  return (
    <span
      className="inline-flex items-center gap-2.5 flex-shrink-0 select-none"
      style={{ padding: "8px 18px" }}
    >
      <brand.Icon
        size={26}
        style={{ color: iconColor, flexShrink: 0, transition: "opacity 0.2s" }}
      />
      <span
        style={{
          fontSize: "15px",
          fontWeight: 500,
          color: "hsl(var(--foreground) / 0.55)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
        }}
      >
        {brand.name}
      </span>
    </span>
  );
}

function Separator() {
  return (
    <span
      className="flex-shrink-0 select-none"
      style={{
        color: "hsl(var(--border))",
        fontSize: "20px",
        padding: "0 8px",
        lineHeight: 1,
        opacity: 0.6,
      }}
    >
      /
    </span>
  );
}

export default function ReviewsSection() {
  const { t } = useLang();
  const { mode } = useTheme();
  const isDark = mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const repeated = [0, 1, 2, 3].flatMap(copy =>
    BRANDS.flatMap((b, i) => [
      <BrandName key={`b-${copy}-${i}`} brand={b} isDark={isDark} />,
      <Separator key={`s-${copy}-${i}`} />,
    ])
  );

  return (
    <section
      id="reviews"
      className="border-t border-border overflow-hidden"
      style={{ padding: "40px 0 36px" }}
    >
      <div className="container-max mb-6">
        <span className="section-eyebrow">Tools I use</span>
        <h2
          className="text-xl font-bold text-foreground mt-2 mb-1"
        >
          Technologies &amp; platforms I build with daily
        </h2>
        <p className="text-sm text-muted-foreground">
          These are not employers or clients — this is my active tech stack.
        </p>
      </div>

      <div className="relative">
        <div
          className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, hsl(var(--background)), transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, hsl(var(--background)), transparent)" }}
        />

        <div className="overflow-hidden">
          <div
            className="flex items-center"
            style={{ animation: "marquee-ltr 50s linear infinite", width: "max-content" }}
          >
            {repeated}
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
