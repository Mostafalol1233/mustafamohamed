import { useLang } from "@/contexts/LanguageContext";
import {
  SiGoogle, SiStripe, SiGithub, SiVercel, SiSupabase,
  SiAmazon, SiCloudflare, SiMongodb, SiShopify, SiNetlify,
  SiDigitalocean, SiFigma, SiDocker, SiRedis, SiOpenai,
  SiMeta, SiApple, SiSlack, SiAtlassian, SiLinear,
} from "react-icons/si";

interface BrandItem {
  name: string;
  Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
}

const BRANDS: BrandItem[] = [
  { name: "Google",       Icon: SiGoogle },
  { name: "Amazon AWS",   Icon: SiAmazon },
  { name: "Apple",        Icon: SiApple },
  { name: "Meta",         Icon: SiMeta },
  { name: "OpenAI",       Icon: SiOpenai },
  { name: "Stripe",       Icon: SiStripe },
  { name: "Cloudflare",   Icon: SiCloudflare },
  { name: "GitHub",       Icon: SiGithub },
  { name: "Vercel",       Icon: SiVercel },
  { name: "Supabase",     Icon: SiSupabase },
  { name: "Shopify",      Icon: SiShopify },
  { name: "Slack",        Icon: SiSlack },
  { name: "Atlassian",    Icon: SiAtlassian },
  { name: "Netlify",      Icon: SiNetlify },
  { name: "Docker",       Icon: SiDocker },
  { name: "MongoDB",      Icon: SiMongodb },
  { name: "Redis",        Icon: SiRedis },
  { name: "DigitalOcean", Icon: SiDigitalocean },
  { name: "Linear",       Icon: SiLinear },
  { name: "Figma",        Icon: SiFigma },
];

function BrandName({ brand }: { brand: BrandItem }) {
  return (
    <span className="inline-flex items-center gap-2 flex-shrink-0 select-none px-2">
      <brand.Icon
        size={20}
        style={{ color: "hsl(var(--muted-foreground))", flexShrink: 0 }}
      />
      <span
        style={{
          fontSize: "15px",
          fontWeight: 500,
          color: "hsl(var(--muted-foreground))",
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
      style={{ color: "hsl(var(--border))", fontSize: "18px", padding: "0 20px", lineHeight: 1 }}
    >
      /
    </span>
  );
}

export default function ReviewsSection() {
  const { t } = useLang();

  const repeated = [0, 1, 2, 3].flatMap(copy =>
    BRANDS.flatMap((b, i) => [
      <BrandName key={`b-${copy}-${i}`} brand={b} />,
      <Separator key={`s-${copy}-${i}`} />,
    ])
  );

  return (
    <section
      id="reviews"
      className="border-t border-border overflow-hidden"
      style={{ padding: "28px 0" }}
    >
      <div className="container-max mb-5">
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "hsl(var(--muted-foreground))", letterSpacing: "0.12em" }}
        >
          {t.reviews?.eyebrow ?? "Platforms & Services I Work With"}
        </p>
      </div>

      <div className="relative">
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, hsl(var(--background)), transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, hsl(var(--background)), transparent)" }}
        />

        <div className="overflow-hidden">
          <div
            className="flex items-center"
            style={{ animation: "marquee-ltr 38s linear infinite", width: "max-content" }}
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
