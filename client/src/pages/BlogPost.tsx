import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import type { BlogPost } from "@shared/schema";

function fmtDate(d: Date | string | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();

  const { data: post, isLoading, isError } = useQuery<BlogPost>({
    queryKey: [`/api/blog/${slug}`],
    enabled: !!slug,
  });

  useEffect(() => {
    if (post) {
      document.title = `${post.title} — Mustafa Mohamed`;
      let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = post.excerpt;

      let ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
      if (!ogTitle) { ogTitle = document.createElement("meta"); ogTitle.setAttribute("property", "og:title"); document.head.appendChild(ogTitle); }
      ogTitle.content = post.title;

      let ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
      if (!ogDesc) { ogDesc = document.createElement("meta"); ogDesc.setAttribute("property", "og:description"); document.head.appendChild(ogDesc); }
      ogDesc.content = post.excerpt;

      if (post.coverImage) {
        let ogImage = document.querySelector<HTMLMetaElement>('meta[property="og:image"]');
        if (!ogImage) { ogImage = document.createElement("meta"); ogImage.setAttribute("property", "og:image"); document.head.appendChild(ogImage); }
        ogImage.content = post.coverImage;
      }

      let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
      canonical.href = `${window.location.origin}/blog/${slug}`;
    }
    return () => {
      document.title = "Mustafa Mohamed — Full-Stack Developer";
    };
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
        <button onClick={() => setLocation("/")} className="btn-primary mt-2">
          Back to home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="container-max px-6 h-14 flex items-center gap-4">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="h-4 w-px bg-border" />
          <span className="text-sm text-muted-foreground truncate hidden sm:block">{post.title}</span>
        </div>
      </header>

      <article className="container-max px-6 py-12 max-w-3xl mx-auto">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(post.tags || []).map(tag => (
            <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full border border-border bg-secondary text-secondary-foreground">
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-6">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {fmtDate(post.publishedAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {post.readTime} min read
          </span>
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div className="mb-10 rounded-2xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Excerpt as lead */}
        <p className="text-lg text-muted-foreground leading-relaxed mb-8 font-medium border-l-4 border-primary pl-4">
          {post.excerpt}
        </p>

        {/* Content */}
        {post.content ? (
          <div
            className="prose prose-neutral max-w-none text-foreground prose-headings:text-foreground prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br/>") }}
          />
        ) : (
          <div className="rounded-xl border border-border bg-secondary/30 p-8 text-center">
            <p className="text-muted-foreground">Full article content coming soon.</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">Written by {post.author}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Full-Stack Developer & Content Strategist</p>
          </div>
          <button
            onClick={() => setLocation("/")}
            className="btn-outline text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            All articles
          </button>
        </div>
      </article>
    </div>
  );
}
