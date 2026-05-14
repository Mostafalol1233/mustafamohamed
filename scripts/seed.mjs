import pg from "pg";
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const projects = [
  {
    title: "BRAVEZM Gaming Platform",
    description: "A full-featured esports community platform with tournament brackets, team management, and live leaderboards. Built for a thriving Egyptian gaming community.",
    image_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=900&h=500&fit=crop",
    technologies: ["React", "Node.js", "PostgreSQL", "Tailwind CSS", "WebSocket"],
    live_url: "https://bravezm.com",
    github_url: null,
  },
  {
    title: "Ahmed Helly Academy",
    description: "Online learning platform for a leading Egyptian education provider. Features course management, enrollment flows, and a student dashboard with progress tracking.",
    image_url: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?w=900&h=500&fit=crop",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Tailwind CSS"],
    live_url: "https://ahmedhelly.com",
    github_url: null,
  },
  {
    title: "BestyBoy Gaming",
    description: "Esports brand website with dynamic roster pages, match schedules, sponsor showcases, and an interactive highlight reel section.",
    image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&h=500&fit=crop",
    technologies: ["React", "Framer Motion", "Node.js", "MongoDB"],
    live_url: "https://bestyboy.gg",
    github_url: null,
  },
  {
    title: "Eco Eats",
    description: "Sustainable food delivery marketplace connecting eco-conscious consumers with local green restaurants. Includes real-time order tracking and a carbon footprint calculator.",
    image_url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=900&h=500&fit=crop",
    technologies: ["React", "Express", "PostgreSQL", "Google Maps API", "Tailwind CSS"],
    live_url: "https://ecoeats.app",
    github_url: null,
  },
  {
    title: "BMO Tools Suite",
    description: "A developer productivity toolkit with code formatters, regex testers, JSON validators, and color pickers — all in one fast, offline-capable web app.",
    image_url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&h=500&fit=crop",
    technologies: ["Vue.js", "TypeScript", "Vite", "IndexedDB"],
    live_url: "https://bmo.tools",
    github_url: null,
  },
  {
    title: "MR Mohammed Business Site",
    description: "Professional corporate website for a UK-based business consultancy. Multilingual (EN/AR), fully accessible, and optimised for lead generation.",
    image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&h=500&fit=crop",
    technologies: ["Next.js", "i18n", "Tailwind CSS", "Vercel"],
    live_url: "https://mrmohammed.co.uk",
    github_url: null,
  },
];

const blogPosts = [
  {
    title: "Building RTL-Ready React Apps with Tailwind CSS",
    slug: "rtl-react-tailwind",
    excerpt: "A deep dive into supporting Arabic and Hebrew layouts without rewriting your entire stylesheet. Covers logical properties, dir attribute, and Tailwind v3 utilities.",
    content: `## Introduction

Building a right-to-left (RTL) interface in React is simpler than it sounds when you lean into CSS logical properties and Tailwind CSS v3.

## Setting the dir Attribute

The first step is applying \`dir="rtl"\` on your root element. In React you can do this dynamically:

\`\`\`tsx
document.documentElement.dir = isRtl ? "rtl" : "ltr";
\`\`\`

## Tailwind Logical Utilities

Tailwind v3 ships logical-property utilities: \`ms-4\` (margin-inline-start), \`pe-6\` (padding-inline-end), \`rounded-s-lg\`. Use these instead of physical counterparts (\`ml-4\`, \`pr-6\`) and your layout automatically mirrors in RTL.

## Conclusion

With logical properties, a single \`dir\` toggle, and Tailwind utilities you can ship a fully bilingual layout without maintaining two separate stylesheets.`,
    cover_image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&h=500&fit=crop",
    tags: ["React", "Tailwind CSS", "RTL", "i18n"],
    author: "Mustafa Mohamed",
    is_published: true,
    read_time: 8,
    published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    title: "From Supabase to PostgreSQL: A Migration Guide",
    slug: "supabase-to-postgresql",
    excerpt: "How to move from client-side Supabase calls to a secure Express + Drizzle ORM architecture without losing any data or breaking your app.",
    content: `## Why Migrate?

Supabase is great for rapid prototyping, but exposing your DB directly to the browser raises security concerns as your app grows. Moving to a dedicated Express API layer gives you fine-grained access control and server-side validation.

## Step 1: Export Your Data

Use \`pg_dump\` or the Supabase dashboard CSV export to back up every table.

## Step 2: Define Your Schema with Drizzle

\`\`\`ts
import { pgTable, serial, text } from "drizzle-orm/pg-core";
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
});
\`\`\`

## Step 3: Replace Supabase Calls with API Routes

Every \`supabase.from("projects").select()\` becomes a \`GET /api/projects\` endpoint in Express, secured with session auth.

## Conclusion

The migration is straightforward and the result is a much more secure, testable architecture.`,
    cover_image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=900&h=500&fit=crop",
    tags: ["PostgreSQL", "Drizzle ORM", "Node.js", "Security"],
    author: "Mustafa Mohamed",
    is_published: true,
    read_time: 12,
    published_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Content Strategy for Developer Portfolios",
    slug: "content-strategy-developer-portfolios",
    excerpt: "Why most developer portfolios fail to convert visitors into clients, and how to write copy that actually gets responses.",
    content: `## The Problem

Most developer portfolios are written for other developers — full of tech jargon and GitHub links — when the real audience is clients and decision-makers who care about outcomes, not stack details.

## Lead with Value, Not Technology

Instead of "Built with React and Node.js", write "Cut load time by 60% and increased conversions by 3x for a gaming platform serving 10,000 users." Outcomes always beat acronyms.

## Social Proof is Non-Negotiable

Testimonials, metrics, and case studies turn browsers into buyers. A single quantified result is worth ten bullet-pointed features.

## Conclusion

Treat your portfolio as a product, not a résumé. Write for your client, not your peer.`,
    cover_image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&h=500&fit=crop",
    tags: ["Content Strategy", "Marketing", "Portfolio", "Copywriting"],
    author: "Mustafa Mohamed",
    is_published: true,
    read_time: 6,
    published_at: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000),
  },
];

async function seed() {
  try {
    for (const p of projects) {
      await pool.query(
        `INSERT INTO projects (title, description, image_url, technologies, live_url, github_url, is_visible)
         VALUES ($1,$2,$3,$4,$5,$6,true) ON CONFLICT DO NOTHING`,
        [p.title, p.description, p.image_url, p.technologies, p.live_url, p.github_url]
      );
    }
    console.log("Projects seeded:", projects.length);

    for (const b of blogPosts) {
      await pool.query(
        `INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, tags, author, is_published, read_time, published_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (slug) DO NOTHING`,
        [b.title, b.slug, b.excerpt, b.content, b.cover_image, b.tags, b.author, b.is_published, b.read_time, b.published_at]
      );
    }
    console.log("Blog posts seeded:", blogPosts.length);
  } catch (e) {
    console.error("Seed error:", e.message);
  } finally {
    await pool.end();
  }
}

seed();
