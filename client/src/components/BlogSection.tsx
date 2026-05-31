import { useRef, useEffect, useState } from "react";
import { ArrowRight, Clock, Calendar, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useLang } from "@/contexts/LanguageContext";
import type { BlogPost } from "@shared/schema";

const FALLBACK_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "Building RTL-Ready React Apps with Tailwind CSS",
    slug: "rtl-react-tailwind",
    excerpt: "A deep dive into supporting Arabic and Hebrew layouts without rewriting your entire stylesheet. Covers logical properties, dir attribute, and Tailwind CSS utilities.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop&auto=format",
    tags: ["React", "Tailwind", "RTL", "i18n"],
    author: "Mustafa Mohamed",
    isPublished: true,
    readTime: 8,
    publishedAt: new Date("2025-06-01"),
    createdAt: new Date("2025-06-01"),
  },
  {
    id: 2,
    title: "From Supabase to PostgreSQL: A Migration Guide",
    slug: "supabase-to-postgresql",
    excerpt: "How to move from client-side Supabase calls to a secure Express + Drizzle ORM architecture — without losing any data or breaking your app.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=450&fit=crop&auto=format",
    tags: ["PostgreSQL", "Drizzle", "Node.js", "Architecture"],
    author: "Mustafa Mohamed",
    isPublished: true,
    readTime: 12,
    publishedAt: new Date("2025-05-01"),
    createdAt: new Date("2025-05-01"),
  },
  {
    id: 3,
    title: "Content Strategy for Developer Portfolios",
    slug: "content-strategy-developer-portfolios",
    excerpt: "Why most developer portfolios fail to convert visitors into clients, and how to write copy that actually gets responses. Real examples from real projects.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=450&fit=crop&auto=format",
    tags: ["Content", "Marketing", "Portfolio", "Copywriting"],
    author: "Mustafa Mohamed",
    isPublished: true,
    readTime: 6,
    publishedAt: new Date("2025-04-01"),
    createdAt: new Date("2025-04-01"),
  },
  {
    id: 4,
    title: "Zero to Deployed: Full-Stack App in 48 Hours",
    slug: "zero-to-deployed-48-hours",
    excerpt: "A case study of building and deploying a gaming community platform from scratch in a weekend. Tech decisions, tradeoffs, and what I'd do differently.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop&auto=format",
    tags: ["Case Study", "Full-Stack", "Gaming", "Deployment"],
    author: "Mustafa Mohamed",
    isPublished: true,
    readTime: 15,
    publishedAt: new Date("2025-03-01"),
    createdAt: new Date("2025-03-01"),
  },
  {
    id: 5,
    title: "Prompt Engineering Patterns for Developers",
    slug: "prompt-engineering-patterns",
    excerpt: "Beyond basic prompts — how to use chain-of-thought, few-shot examples, and function calling to build reliable AI features into production apps.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=450&fit=crop&auto=format",
    tags: ["AI", "OpenAI", "Prompt Engineering", "LLM"],
    author: "Mustafa Mohamed",
    isPublished: true,
    readTime: 9,
    publishedAt: new Date("2025-02-01"),
    createdAt: new Date("2025-02-01"),
  },
  {
    id: 6,
    title: "Responsive Design Mastery: CSS Grid & Flexbox",
    slug: "responsive-design-grid-flexbox",
    excerpt: "A practical guide to building pixel-perfect responsive layouts using CSS Grid and Flexbox together — with real patterns you can use immediately.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=450&fit=crop&auto=format",
    tags: ["CSS", "Responsive", "Grid", "Flexbox"],
    author: "Mustafa Mohamed",
    isPublished: true,
    readTime: 10,
    publishedAt: new Date("2025-01-01"),
    createdAt: new Date("2025-01-01"),
  },
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function fmtDate(d: Date | string | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function PostCard({ post, delay }: { post: BlogPost; delay: number }) {
  const ref = useReveal();
  const [, setLocation] = useLocation();

  return (
    <div
      ref={ref}
      className="reveal card-hover flex flex-col group cursor-pointer"
      style={{ transitionDelay: `${delay}ms` }}
      onClick={() => setLocation(`/blog/${post.slug}`)}
    >
      {/* Cover image */}
      <div className="relative overflow-hidden rounded-t-xl" style={{ aspectRatio: "16/9" }}>
        <img
          src={post.coverImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop&auto=format"}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Tags overlay */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {(post.tags || []).slice(0, 2).map(tag => (
            <span key={tag} className="text-xs font-medium px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-foreground mb-2 leading-snug text-base group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {fmtDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime} min
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs font-medium text-primary group-hover:underline">
            Read <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default function BlogSection() {
  const { t } = useLang();
  const [showAll, setShowAll] = useState(false);

  const { data: apiPosts } = useQuery<BlogPost[]>({
    queryKey: ["sb-blog"],
    queryFn: () => import("@/lib/supabase").then(m => m.fetchBlogPosts(false)),
  });

  const posts = (apiPosts && apiPosts.length > 0 ? apiPosts : FALLBACK_POSTS).filter(p => p.isPublished);
  const visible = showAll ? posts : posts.slice(0, 3);
  const hasMore = posts.length > 3;

  return (
    <section id="blog" className="section-padding border-t border-border">
      <div className="container-max">
        <div className="max-w-2xl mb-14">
          <span className="section-eyebrow">{t.blog?.eyebrow ?? "Writing"}</span>
          <h2 className="section-title">{t.blog?.title ?? "Articles & Insights"}</h2>
          <p className="section-subtitle">
            {t.blog?.subtitle ?? "Practical guides, case studies, and deep dives on web development, design, and building for the web."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((post, i) => (
            <PostCard key={post.id} post={post} delay={i * 80} />
          ))}
        </div>

        {hasMore && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll(v => !v)}
              className="btn-outline inline-flex items-center gap-2"
            >
              {showAll ? "Show less" : `View all ${posts.length} articles`}
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAll ? "rotate-180" : ""}`} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
