import { useEffect, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, Calendar, User, Globe, Moon, Sun } from "lucide-react";
import { marked } from "marked";
import type { BlogPost } from "@shared/schema";
import { useLang } from "@/contexts/LanguageContext";
import { useTheme } from "@/hooks/useTheme";

marked.setOptions({ breaks: true, gfm: true });

function fmtDate(d: Date | string | null | undefined, lang: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { lang, setLang, t } = useLang();
  const { isDark, toggle: toggleTheme } = useTheme();

  const { data: post, isLoading, isError } = useQuery<BlogPost>({
    queryKey: ["sb-blog-post", slug],
    queryFn: () => import("@/lib/supabase").then(m => m.fetchBlogPost(slug!)),
    enabled: !!slug,
  });

  const htmlContent = useMemo(() => {
    if (!post?.content) return "";
    return marked(post.content) as string;
  }, [post?.content]);

  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} — Mustafa Mohamed`;

    const setMeta = (sel: string, attr: string, val: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement | HTMLLinkElement>(sel);
      if (!el) {
        el = document.createElement(attr === "property" || attr === "name" ? "meta" : "link") as any;
        if (attr === "rel") (el as HTMLLinkElement).rel = val;
        else el!.setAttribute(attr, val);
        document.head.appendChild(el!);
      }
      (el as any).content !== undefined ? ((el as any).content = content) : ((el as any).href = content);
    };

    setMeta('meta[name="description"]', "name", "description", post.excerpt);
    setMeta('meta[property="og:title"]', "property", "og:title", post.title);
    setMeta('meta[property="og:description"]', "property", "og:description", post.excerpt);
    if (post.coverImage) setMeta('meta[property="og:image"]', "property", "og:image", post.coverImage);
    setMeta('link[rel="canonical"]', "rel", "canonical", `${window.location.origin}/blog/${slug}`);

    return () => { document.title = "Mustafa Mohamed — Full-Stack Developer"; };
  }, [post, slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold text-foreground">Article not found</h1>
        <p className="text-muted-foreground">This article may have been moved or deleted.</p>
        <button onClick={() => setLocation("/")} className="btn-primary mt-2">Back to home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky top bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="container-max px-6 h-14 flex items-center gap-3">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === "ar" ? "الرجوع" : "Back"}</span>
          </button>

          <div className="h-4 w-px bg-border" />
          <span className="text-sm text-muted-foreground truncate flex-1 hidden sm:block">{post.title}</span>

          <div className="ml-auto flex items-center gap-1">
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              title={lang === "ar" ? "Switch to English" : "التبديل للعربية"}
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
            >
              <Globe className="w-4 h-4" />
            </button>
            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              title="Toggle theme"
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <article className="container-max px-6 py-12 max-w-3xl mx-auto">
        {/* Tags */}
        {(post.tags || []).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {(post.tags || []).map(tag => (
              <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full border border-border bg-secondary text-secondary-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight tracking-tight mb-6">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
          <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{post.author}</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{fmtDate(post.publishedAt, lang)}</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {post.readTime} {t.blog.min_read}
          </span>
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div className="mb-10 rounded-2xl overflow-hidden shadow-lg" style={{ aspectRatio: "16/9" }}>
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Excerpt as lead */}
        <p className="text-lg text-muted-foreground leading-relaxed mb-10 font-medium border-l-4 border-primary pl-5 italic">
          {post.excerpt}
        </p>

        {/* Markdown content */}
        {post.content ? (
          <div
            className="prose prose-neutral dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-5
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-code:bg-secondary prose-code:text-foreground prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
              prose-pre:bg-secondary prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-pre:text-sm
              prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-blockquote:italic
              prose-strong:text-foreground prose-strong:font-semibold
              prose-table:text-sm prose-th:text-foreground prose-td:text-foreground/80
              prose-li:text-foreground/90 prose-li:leading-relaxed
              prose-hr:border-border"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        ) : (
          <div className="rounded-xl border border-border bg-secondary/30 p-8 text-center">
            <p className="text-muted-foreground">Full article content coming soon.</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {lang === "ar" ? "كتبه" : "Written by"} {post.author}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Full-Stack Developer & Content Strategist
            </p>
          </div>
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            {lang === "ar" ? "كل المقالات" : "All articles"}
          </button>
        </div>
      </article>
    </div>
  );
}
