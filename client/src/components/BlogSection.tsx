import { useRef, useEffect } from "react";
import { ArrowRight, Clock } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

const POSTS_EN = [
  {
    id: 1,
    title: "Building RTL-Ready React Apps with Tailwind CSS",
    excerpt: "A deep dive into supporting Arabic and Hebrew layouts without rewriting your entire stylesheet. Covers logical properties, dir attribute, and Tailwind's RTL plugin.",
    date: "June 2025",
    readTime: 8,
    tags: ["React", "Tailwind", "RTL", "i18n"],
    emoji: "🌐",
  },
  {
    id: 2,
    title: "From Supabase to PostgreSQL: A Migration Guide",
    excerpt: "How to move from client-side Supabase calls to a secure Express + Drizzle ORM architecture — without losing any data or breaking your app.",
    date: "May 2025",
    readTime: 12,
    tags: ["PostgreSQL", "Drizzle", "Node.js", "Architecture"],
    emoji: "🗄️",
  },
  {
    id: 3,
    title: "The Dragon Effect: Physics-Based Animations in React",
    excerpt: "Recreating the famous Wyvern dragon cursor effect using canvas, requestAnimationFrame, and spring physics. No external library needed.",
    date: "April 2025",
    readTime: 10,
    tags: ["Canvas", "Animation", "React", "Creative"],
    emoji: "🐉",
  },
  {
    id: 4,
    title: "Content Strategy for Developer Portfolios",
    excerpt: "Why most developer portfolios fail to convert visitors into clients, and how to write copy that actually gets responses. Real examples from my own projects.",
    date: "March 2025",
    readTime: 6,
    tags: ["Content", "Marketing", "Portfolio", "Copywriting"],
    emoji: "✍️",
  },
  {
    id: 5,
    title: "Zero to Deployed: Full-Stack App in 48 Hours",
    excerpt: "A case study of building and deploying a gaming community platform from scratch in a weekend. Tech decisions, tradeoffs, and what I'd do differently.",
    date: "February 2025",
    readTime: 15,
    tags: ["Case Study", "Full-Stack", "Gaming", "Deployment"],
    emoji: "🚀",
  },
  {
    id: 6,
    title: "Prompt Engineering Patterns for Developers",
    excerpt: "Beyond basic prompts — how to use chain-of-thought, few-shot examples, and function calling to build reliable AI features into production apps.",
    date: "January 2025",
    readTime: 9,
    tags: ["AI", "OpenAI", "Prompt Engineering", "LLM"],
    emoji: "🤖",
  },
];

const POSTS_AR = [
  {
    id: 1,
    title: "بناء تطبيقات React تدعم RTL مع Tailwind CSS",
    excerpt: "تعمق في دعم تخطيطات اللغة العربية والعبرية دون إعادة كتابة قواعد CSS بالكامل.",
    date: "يونيو 2025",
    readTime: 8,
    tags: ["React", "Tailwind", "RTL", "i18n"],
    emoji: "🌐",
  },
  {
    id: 2,
    title: "الانتقال من Supabase إلى PostgreSQL",
    excerpt: "كيفية الانتقال من استدعاءات Supabase من جانب العميل إلى بنية Express + Drizzle ORM آمنة.",
    date: "مايو 2025",
    readTime: 12,
    tags: ["PostgreSQL", "Drizzle", "Node.js"],
    emoji: "🗄️",
  },
  {
    id: 3,
    title: "تأثير التنين: الرسوم المتحركة المستندة إلى الفيزياء",
    excerpt: "إعادة إنشاء تأثير مؤشر التنين باستخدام canvas و requestAnimationFrame وفيزياء الزنبرك.",
    date: "أبريل 2025",
    readTime: 10,
    tags: ["Canvas", "Animation", "React"],
    emoji: "🐉",
  },
  {
    id: 4,
    title: "استراتيجية المحتوى لملفات تعريف المطورين",
    excerpt: "لماذا تفشل معظم ملفات المطورين في تحويل الزوار إلى عملاء، وكيفية كتابة نصوص تحقق نتائج.",
    date: "مارس 2025",
    readTime: 6,
    tags: ["محتوى", "تسويق", "ملف التعريف"],
    emoji: "✍️",
  },
  {
    id: 5,
    title: "من الصفر إلى الإنتاج: تطبيق كامل في 48 ساعة",
    excerpt: "دراسة حالة لبناء ونشر منصة مجتمع الألعاب من الصفر خلال عطلة نهاية الأسبوع.",
    date: "فبراير 2025",
    readTime: 15,
    tags: ["دراسة حالة", "Full-Stack", "نشر"],
    emoji: "🚀",
  },
  {
    id: 6,
    title: "أنماط هندسة الـ Prompt للمطورين",
    excerpt: "ما وراء الـ Prompts الأساسية — كيفية استخدام سلسلة التفكير والأمثلة القليلة لبناء ميزات AI موثوقة.",
    date: "يناير 2025",
    readTime: 9,
    tags: ["AI", "OpenAI", "هندسة Prompt"],
    emoji: "🤖",
  },
];

const TAG_COLORS: Record<string, string> = {
  React: "#61dafb22",
  Tailwind: "#06b6d422",
  RTL: "#8b5cf622",
  "Node.js": "#68a06322",
  AI: "#f59e0b22",
  Canvas: "#ec489922",
  Content: "#10b98122",
  "Case Study": "#6366f122",
};

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.classList.add("visible"); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function PostCard({ post, delay, isRtl }: { post: typeof POSTS_EN[0]; delay: number; isRtl: boolean }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal card-hover flex flex-col" style={{ transitionDelay: `${delay}ms` }}>
      <div className="p-6 flex-1 flex flex-col">
        {/* Emoji + tags */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-3xl">{post.emoji}</span>
          <div className="flex gap-1.5 flex-wrap justify-end">
            {post.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-xs font-medium px-2 py-0.5 rounded-full border border-border" style={{ background: TAG_COLORS[tag] || "hsl(var(--secondary))" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <h3 className="font-bold text-foreground mb-2 leading-snug text-base">{post.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{post.excerpt}</p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{post.date}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime} min</span>
          </div>
          <button className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            Read <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BlogSection() {
  const { lang, t, isRtl } = useLang();
  const posts = lang === "ar" ? POSTS_AR : POSTS_EN;

  return (
    <section id="blog" className="section-padding border-t border-border">
      <div className="container-max">
        <div className="max-w-2xl mb-14">
          <span className="section-eyebrow">{t.blog.eyebrow}</span>
          <h2 className="section-title">{t.blog.title}</h2>
          <p className="section-subtitle">{t.blog.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} delay={i * 80} isRtl={isRtl} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="btn-outline">
            View all articles <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
