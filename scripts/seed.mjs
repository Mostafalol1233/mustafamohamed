import pg from "pg";
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const projects = [
  {
    title: "BRAVEZM Gaming Platform",
    description: "A full-featured esports community platform with tournament brackets, team management, and live leaderboards for a thriving Egyptian gaming community.",
    image_url: "/images/bravezm.png",
    technologies: ["React", "Node.js", "PostgreSQL", "Tailwind CSS", "WebSocket"],
    live_url: "https://bravezm.com",
    github_url: null,
  },
  {
    title: "BestyBoy Gaming",
    description: "Esports brand website with dynamic roster pages, match schedules, sponsor showcases, and an interactive highlight reel section.",
    image_url: "/images/bestyboy.png",
    technologies: ["React", "Framer Motion", "Node.js", "MongoDB"],
    live_url: "https://bestyboy.gg",
    github_url: null,
  },
  {
    title: "Ahmed Helly Academy",
    description: "Online learning platform for a leading Egyptian education provider — enrollment flows, course management, and a student dashboard with progress tracking.",
    image_url: "/images/ahmed-helly.png",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Tailwind CSS"],
    live_url: "https://ahmedhelly.com",
    github_url: null,
  },
  {
    title: "Eco Eats",
    description: "Sustainable food delivery marketplace connecting eco-conscious consumers with local green restaurants, with real-time order tracking and a carbon footprint calculator.",
    image_url: "/images/eco-eats.png",
    technologies: ["React", "Express", "PostgreSQL", "Google Maps API", "Tailwind CSS"],
    live_url: "https://ecoeats.app",
    github_url: null,
  },
  {
    title: "BMO Tools Suite",
    description: "Developer productivity toolkit with code formatters, regex testers, JSON validators, and color pickers — all in one fast, offline-capable web app.",
    image_url: "/images/bmo-tools.png",
    technologies: ["Vue.js", "TypeScript", "Vite", "IndexedDB"],
    live_url: "https://bmo.tools",
    github_url: null,
  },
  {
    title: "Bemora",
    description: "Personal brand and e-commerce platform showcasing premium products with smooth animations and a polished checkout experience.",
    image_url: "/images/bemora.png",
    technologies: ["Next.js", "Stripe", "Tailwind CSS", "TypeScript"],
    live_url: null,
    github_url: "https://github.com/Bemora",
  },
  {
    title: "MR Mohammed",
    description: "Professional corporate website for a UK-based business consultancy — multilingual (EN/AR), fully accessible, and optimised for lead generation.",
    image_url: "/images/mr-mohammed.png",
    technologies: ["Next.js", "i18n", "Tailwind CSS", "Vercel"],
    live_url: "https://mrmohammed.co.uk",
    github_url: null,
  },
  {
    title: "Diaa Elden Shop",
    description: "E-commerce storefront with product catalogue, cart, and secure checkout — built for a local Egyptian retailer expanding online.",
    image_url: "/images/diaa-elden-shop.png",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    live_url: null,
    github_url: null,
  },
  {
    title: "OneTeam",
    description: "SaaS platform for managing remote teams — task boards, real-time chat, time tracking, and role-based dashboards for distributed teams.",
    image_url: "/images/one-team.png",
    technologies: ["React", "Node.js", "PostgreSQL", "WebSocket", "Redis"],
    live_url: null,
    github_url: null,
  },
];

const blogPosts = [
  {
    title: "Building RTL-Ready React Apps with Tailwind CSS",
    slug: "rtl-react-tailwind",
    excerpt: "A deep dive into supporting Arabic and Hebrew layouts without rewriting your entire stylesheet. Covers logical properties, the dir attribute, and Tailwind v3 utilities.",
    content: `## Introduction

Building a right-to-left (RTL) interface in React is simpler than it sounds when you lean into CSS logical properties and Tailwind CSS v3. Most developers reach for duplicate stylesheets or wrapper hacks — you don't need any of that.

## Setting the dir Attribute

The first step is applying \`dir="rtl"\` on your root element. In React you can do this dynamically based on the active language:

\`\`\`tsx
useEffect(() => {
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
}, [lang]);
\`\`\`

This single change tells the browser to mirror flex rows, scroll bars, and inline text direction automatically.

## Tailwind Logical Utilities

Tailwind v3 ships logical-property utilities out of the box. Use these instead of physical counterparts and your layout mirrors itself automatically:

| Physical | Logical (RTL-safe) |
|---|---|
| \`ml-4\` | \`ms-4\` (margin-inline-start) |
| \`pr-6\` | \`pe-6\` (padding-inline-end) |
| \`rounded-l-lg\` | \`rounded-s-lg\` |
| \`text-left\` | \`text-start\` |

## Handling Fonts

Arabic text needs a dedicated font. Load a high-quality Arabic typeface (e.g. IBM Plex Arabic, Noto Sans Arabic) and switch it conditionally:

\`\`\`css
:lang(ar) body {
  font-family: 'IBM Plex Arabic', sans-serif;
}
\`\`\`

## When NOT to flip layout

Some elements should stay LTR even on RTL pages: code blocks, URLs, phone numbers, and currency values. Wrap them in \`<span dir="ltr">\` or use the CSS \`unicode-bidi\` property.

## Conclusion

With logical properties, a single \`dir\` toggle, and Tailwind utilities you can ship a fully bilingual layout without maintaining two separate stylesheets. The result is less code, fewer bugs, and a better reading experience for your Arabic users.`,
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

Supabase is great for rapid prototyping, but exposing your database directly to the browser raises serious security concerns as your app matures. Moving to a dedicated Express API layer gives you:

- Fine-grained access control (users only see what they're allowed to)
- Server-side validation before anything touches the DB
- A clean separation between your UI and your data layer
- Easier testing and debugging

## Step 1: Export Your Data

Use \`pg_dump\` or the Supabase dashboard CSV export to back up every table before touching anything.

\`\`\`bash
pg_dump --data-only --format=plain "postgresql://..." > backup.sql
\`\`\`

## Step 2: Define Your Schema with Drizzle ORM

Drizzle gives you type-safe database queries with a schema that lives in your codebase:

\`\`\`typescript
import { pgTable, serial, text, boolean } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  isVisible: boolean("is_visible").default(true),
});
\`\`\`

Run \`drizzle-kit push\` to sync your schema to the database.

## Step 3: Replace Supabase Calls with API Routes

Every \`supabase.from("projects").select()\` becomes a typed Express endpoint:

\`\`\`typescript
// Before (client-side, public)
const { data } = await supabase.from("projects").select();

// After (server-side, secured)
app.get("/api/projects", async (req, res) => {
  const projects = await db.select().from(projectsTable);
  res.json(projects);
});
\`\`\`

## Step 4: Protect Write Routes

Add session-based auth to any route that modifies data:

\`\`\`typescript
app.post("/api/projects", requireAdmin, async (req, res) => {
  const project = await db.insert(projects).values(req.body).returning();
  res.json(project[0]);
});
\`\`\`

## Conclusion

The migration is straightforward and the result is a much more secure, testable, and maintainable architecture. Your data never touches the browser unless you explicitly decide it should.`,
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

Most developer portfolios are written for other developers — full of tech jargon, GitHub links, and framework logos — when the real audience is clients, hiring managers, and decision-makers who care about business outcomes, not stack details.

The result? A portfolio that impresses peers but fails to convert visitors into work.

## Lead with Value, Not Technology

This is the single highest-impact change you can make. Compare:

**Weak:** "Built with React, Node.js, and MongoDB"

**Strong:** "Reduced page load time by 60%, increasing client conversions by 3× for a gaming platform serving 10,000 monthly users."

Outcomes always beat acronyms. Clients don't hire React — they hire results.

## Write a Headline That Answers "Why You?"

Your hero section has 3 seconds to make a case. Skip the "I'm a passionate developer" opener. Instead:

- Name what you do
- Name who you do it for
- Name the result they can expect

Example: "I build fast, conversion-focused web apps for Egyptian businesses ready to grow online."

## Social Proof is Non-Negotiable

Testimonials, case study metrics, and client logos turn browsers into buyers. A single quantified result ("enrollment inquiries doubled in the first month") is worth ten bullet-pointed features.

Ask past clients for a one-sentence quote. Most will say yes if you make it easy.

## The CTA Hierarchy

Every section should guide the visitor toward one action. The golden path is:

**Hero → Portfolio → Contact**

Remove anything that breaks that flow — excessive links, unrelated side projects, or walls of text about your learning journey.

## Keep the Tech Stack Secondary

List your technologies, but put them below the fold. Lead with impact, follow with proof, close with capability.

## Conclusion

Treat your portfolio as a product you're selling to a specific customer — not a résumé you're submitting to a recruiter. Write for your client's problem, not your own achievements.`,
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
    await pool.query("DELETE FROM projects");
    for (const p of projects) {
      await pool.query(
        `INSERT INTO projects (title, description, image_url, technologies, live_url, github_url, is_visible)
         VALUES ($1,$2,$3,$4,$5,$6,true)`,
        [p.title, p.description, p.image_url, p.technologies, p.live_url, p.github_url]
      );
    }
    console.log("Projects seeded:", projects.length);

    await pool.query("DELETE FROM blog_posts");
    for (const b of blogPosts) {
      await pool.query(
        `INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, tags, author, is_published, read_time, published_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
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
