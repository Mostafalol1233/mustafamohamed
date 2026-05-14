-- ============================================================
-- Run this once in your Supabase SQL Editor
-- https://supabase.com/dashboard/project/fvuaiwxfdgerjbuszgpf/sql/new
-- ============================================================

-- ── projects ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url   TEXT,
  technologies TEXT[] DEFAULT '{}',
  live_url    TEXT,
  github_url  TEXT,
  is_visible  BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read projects" ON projects;
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin full access projects" ON projects;
CREATE POLICY "Admin full access projects" ON projects FOR ALL USING (true) WITH CHECK (true);

-- ── blog_posts ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id           BIGSERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  excerpt      TEXT NOT NULL,
  content      TEXT DEFAULT '',
  cover_image  TEXT,
  tags         TEXT[] DEFAULT '{}',
  author       TEXT DEFAULT 'Mustafa Mohamed',
  is_published BOOLEAN DEFAULT false,
  read_time    INTEGER DEFAULT 5,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read blog_posts" ON blog_posts;
CREATE POLICY "Public read blog_posts" ON blog_posts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin full access blog_posts" ON blog_posts;
CREATE POLICY "Admin full access blog_posts" ON blog_posts FOR ALL USING (true) WITH CHECK (true);

-- ── contact_messages ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT DEFAULT '',
  message    TEXT NOT NULL,
  is_read    BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anon insert contact" ON contact_messages;
CREATE POLICY "Anon insert contact" ON contact_messages FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin read contact" ON contact_messages;
CREATE POLICY "Admin read contact" ON contact_messages FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin update contact" ON contact_messages;
CREATE POLICY "Admin update contact" ON contact_messages FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Admin delete contact" ON contact_messages;
CREATE POLICY "Admin delete contact" ON contact_messages FOR DELETE USING (true);

-- ── notifications ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         BIGSERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  type       TEXT DEFAULT 'info',
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read notifications" ON notifications;
CREATE POLICY "Public read notifications" ON notifications FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin full access notifications" ON notifications;
CREATE POLICY "Admin full access notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);

-- ── Seed: 9 real projects ────────────────────────────────────
INSERT INTO projects (title, description, image_url, technologies, live_url, github_url, is_visible)
VALUES
  ('BRAVEZM', 'Full-stack gaming community platform with leaderboards, clans, and Discord-like chat features.', '/images/bravezm.png', ARRAY['React','Node.js','PostgreSQL','WebSockets'], 'https://bravezm.com', 'https://github.com/Bemora/bravezm', true),
  ('BestyBoy', 'E-commerce platform for mobile accessories with a sleek dark UI and integrated payment gateway.', '/images/bestyboy.png', ARRAY['React','Stripe','Tailwind CSS','Express'], 'https://bestyboy.shop', 'https://github.com/Bemora/bestyboy', true),
  ('Ahmed Helly Portfolio', 'Personal portfolio for a creative director featuring smooth animations and a case study layout.', '/images/ahmed-helly.png', ARRAY['React','Framer Motion','Tailwind CSS'], 'https://ahmed-helly.com', 'https://github.com/Bemora/ahmed-helly', true),
  ('Eco Eats', 'Sustainable food delivery app connecting users to eco-friendly local restaurants.', '/images/eco-eats.png', ARRAY['React Native','Supabase','Expo','TypeScript'], NULL, 'https://github.com/Bemora/eco-eats', true),
  ('BMO Tools', 'Developer productivity suite with code snippet manager, color picker, and JSON formatter.', '/images/bmo-tools.png', ARRAY['React','TypeScript','Electron','Tailwind CSS'], 'https://bmo-tools.vercel.app', 'https://github.com/Bemora/bmo-tools', true),
  ('Bemora', 'My personal brand website with a blog, project showcase, and contact terminal.', '/images/bemora.png', ARRAY['React','Vite','Supabase','Tailwind CSS'], 'https://bemora.dev', 'https://github.com/Bemora/bemora', true),
  ('MR Mohammed', 'Business landing page for a coaching consultant with booking integration and testimonials.', '/images/mr-mohammed.png', ARRAY['React','Calendly API','Tailwind CSS'], 'https://mr-mohammed.com', NULL, true),
  ('Diaa Elden Shop', 'Storefront for a handmade crafts seller with product gallery and WhatsApp ordering flow.', '/images/diaa-elden-shop.png', ARRAY['React','WhatsApp API','CSS Grid'], 'https://diaa-elden.shop', NULL, true),
  ('OneTeam', 'SaaS project management tool for remote teams with kanban boards and real-time collaboration.', '/images/one-team.png', ARRAY['React','Supabase','Realtime','TypeScript'], 'https://oneteam.app', 'https://github.com/Bemora/one-team', true)
ON CONFLICT DO NOTHING;

-- ── Seed: 3 blog posts ───────────────────────────────────────
INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, tags, is_published, read_time, published_at)
VALUES
  (
    'Building RTL-Ready React Apps with Tailwind CSS',
    'rtl-react-tailwind',
    'A deep dive into supporting Arabic and Hebrew layouts without rewriting your entire stylesheet. Covers logical properties, dir attribute, and Tailwind CSS utilities.',
    '# Building RTL-Ready React Apps with Tailwind CSS

Supporting right-to-left (RTL) languages like Arabic and Hebrew is one of those features that gets left until the last minute — then causes massive headaches. Here is how to build RTL support into your React app from day one, without rewriting everything.

## The Problem with Traditional Approaches

Most developers try to handle RTL by duplicating CSS: one file for LTR, one for RTL. This is a maintenance nightmare. Tailwind CSS 3.3+ and modern CSS logical properties give us a much better way.

## CSS Logical Properties

Instead of `margin-left` and `padding-right`, use their logical equivalents:

```css
/* Old way */
.card { margin-left: 1rem; padding-right: 0.5rem; }

/* New way */
.card { margin-inline-start: 1rem; padding-inline-end: 0.5rem; }
```

Tailwind maps these directly: `ms-4` = `margin-inline-start: 1rem`, `pe-2` = `padding-inline-end: 0.5rem`.

## Setting the dir Attribute

The `dir` attribute on the `<html>` or a parent element tells the browser — and Tailwind — which direction to render:

```tsx
<html dir={language === "ar" ? "rtl" : "ltr"}>
```

Tailwind then automatically flips all logical properties.

## Font Considerations

Arabic text requires a different font. Load a good Arabic web font and apply it conditionally:

```css
html[dir="rtl"] { font-family: "Cairo", "Noto Sans Arabic", sans-serif; }
```

## Conclusion

With logical properties and the `dir` attribute, you can support RTL with zero duplicated CSS. Start with this foundation and your Arabic users will thank you.',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop&auto=format',
    ARRAY['React','Tailwind','RTL','i18n'],
    true, 8, '2025-06-01'
  ),
  (
    'From Supabase to PostgreSQL: A Migration Guide',
    'supabase-to-postgresql',
    'How to move from client-side Supabase calls to a secure Express + Drizzle ORM architecture — without losing any data or breaking your app.',
    '# From Supabase to PostgreSQL: A Migration Guide

Supabase is great for prototyping — instant REST API, auth, storage. But sometimes you need more control. Here is how to migrate to a self-managed Express + PostgreSQL stack without breaking anything.

## When to Migrate

You should consider migrating when:
- You need complex server-side business logic
- You want full control over API responses
- You need to integrate non-Supabase services at the API level
- You want to avoid vendor lock-in

## Step 1: Export Your Data

Use the Supabase dashboard to export each table as CSV. Or use `pg_dump` directly:

```bash
pg_dump "postgresql://postgres:password@db.xxx.supabase.co:5432/postgres" \
  --table=projects --table=blog_posts -f backup.sql
```

## Step 2: Set Up Drizzle ORM

```bash
npm install drizzle-orm drizzle-kit @neondatabase/serverless
```

Define your schema:

```typescript
import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  isVisible: boolean("is_visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});
```

## Step 3: Migrate Your API Calls

Replace `supabase.from("projects").select("*")` with:

```typescript
const projects = await db.select().from(projectsTable).where(eq(projectsTable.isVisible, true));
```

## Conclusion

Migration takes a weekend but gives you full control. The key is to migrate table by table, test each endpoint, then switch the frontend over in one go.',
    'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=450&fit=crop&auto=format',
    ARRAY['PostgreSQL','Drizzle','Node.js','Architecture'],
    true, 12, '2025-05-01'
  ),
  (
    'Content Strategy for Developer Portfolios',
    'content-strategy-developer-portfolios',
    'Why most developer portfolios fail to convert visitors into clients, and how to write copy that actually gets responses.',
    '# Content Strategy for Developer Portfolios

Most developer portfolios look the same: a hero with "Hi, I am [Name], a Full-Stack Developer", a grid of project thumbnails, and a contact form. They get no responses. Here is why — and how to fix it.

## The Core Problem: Features vs. Benefits

Developers list what they built. Clients care about what it did for the business.

**Weak:** "Built an e-commerce platform with React and Node.js"

**Strong:** "Built an e-commerce platform that reduced cart abandonment by 40% and increased mobile sales by 2x"

If you do not have metrics, describe the impact: "Built a booking system that eliminated phone-tag for a dental practice with 500 monthly patients."

## Lead with the Client, Not Yourself

Your hero section should not be about you. It should speak to your ideal client:

**Instead of:** "Hi, I am Mustafa. I build React apps."

**Try:** "I help Egyptian businesses launch web products their customers actually use — fast, clean, and built to scale."

## Show Process, Not Just Output

Add a short "how I work" section. Clients are not just buying code — they are buying a working relationship. Show them what it is like to work with you:

1. Discovery call (free) — I understand your goals
2. Proposal within 48 hours
3. Weekly check-ins + Loom video updates
4. Handover with documentation

## The Portfolio Section

Include 3-5 projects maximum. For each:
- One sentence on what the client needed
- What you built and why you made those choices
- The result (if you have it)
- A live link or screenshots

## Contact Copy

"Feel free to reach out" converts nobody. Be specific:

"I take on 2-3 new projects per month. If you have a launch date in mind, message me now and I will tell you if I can fit you in."

## Conclusion

Your portfolio is a sales page. Write it like one.',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=450&fit=crop&auto=format',
    ARRAY['Content','Marketing','Portfolio','Copywriting'],
    true, 6, '2025-04-01'
  )
ON CONFLICT (slug) DO NOTHING;
