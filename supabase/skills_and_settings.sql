-- Paste this into Supabase SQL Editor and click Run
-- Creates the skills table and site_settings table with initial data

-- ─────────────────────────────────────────────────────────────────────────────
-- SKILLS TABLE
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS skills (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  percent INTEGER NOT NULL DEFAULT 80 CHECK (percent >= 0 AND percent <= 100),
  description TEXT,
  icon TEXT,
  tags TEXT[],
  sort_order INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read skills" ON skills;
CREATE POLICY "Public read skills"
  ON skills FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access skills" ON skills;
CREATE POLICY "Admin full access skills"
  ON skills FOR ALL USING (true) WITH CHECK (true);

-- Insert all skills (matching SkillsSection.tsx data)
INSERT INTO skills (category, name, percent, description, icon, tags, sort_order) VALUES
  -- Frontend
  ('frontend', 'React',         85, 'UI components, hooks, state management, context API', '⚛', ARRAY['hooks','JSX','vdom'], 1),
  ('frontend', 'TypeScript',    78, 'typed JS, interfaces, generics, utility types',       'Ⓣ', ARRAY['types','generics','safety'], 2),
  ('frontend', 'Next.js',       82, 'SSR, ISR, routing, API routes, middleware',           '▲', ARRAY['SSR','ISR','edge'], 3),
  ('frontend', 'Tailwind CSS',  90, 'utility-first styling, JIT, dark mode, animations',   '◈', ARRAY['JIT','responsive','DX'], 4),
  ('frontend', 'Framer Motion', 65, 'animations, transitions, gestures, layout effects',   '◎', ARRAY['spring','gesture','exit'], 5),
  -- Backend
  ('backend', 'Node.js',    82, 'server runtime, async I/O, streams, event loop',   '⬡', ARRAY['async','streams','event'], 6),
  ('backend', 'Express',    84, 'REST APIs, middleware chains, routing, auth',        '⚡', ARRAY['REST','middleware','auth'], 7),
  ('backend', 'REST APIs',  88, 'endpoint design, versioning, auth, documentation',  '⇌', ARRAY['OpenAPI','JWT','CORS'], 8),
  ('backend', 'MongoDB',    65, 'document store, aggregation pipelines, indexing',   '◉', ARRAY['NoSQL','aggregate','Atlas'], 9),
  ('backend', 'PostgreSQL', 80, 'relational DB, SQL queries, Drizzle ORM, joins',    '◫', ARRAY['SQL','Drizzle','ACID'], 10),
  -- Design
  ('design', 'Figma',             70, 'wireframes, components, dev handoff, prototyping', '◈', ARRAY['components','auto-layout','tokens'], 11),
  ('design', 'Shadcn/UI',         88, 'accessible component library, theming, Radix',     '◉', ARRAY['a11y','Radix','CVA'], 12),
  ('design', 'Radix UI',          72, 'headless primitives, ARIA compliance, composable', '◎', ARRAY['ARIA','headless','composable'], 13),
  ('design', 'Responsive Design', 93, 'mobile-first layout, CSS Grid & Flexbox, clamp',  '⊡', ARRAY['Grid','Flex','clamp'], 14),
  -- Tools
  ('tools', 'Git',     85, 'branching, rebasing, clean history, conflict resolution', '◈', ARRAY['rebase','hooks','flow'], 15),
  ('tools', 'GitHub',  87, 'PRs, Actions CI/CD, code review, Discussions',            '◉', ARRAY['Actions','CI/CD','review'], 16),
  ('tools', 'VS Code', 95, 'extensions, debugger, multi-cursor, snippets',            '⬡', ARRAY['extensions','debug','vim'], 17),
  ('tools', 'Linux',   68, 'CLI navigation, bash scripting, server ops, cron',        '◫', ARRAY['bash','cron','ssh'], 18),
  ('tools', 'Vercel',  85, 'deployments, edge functions, previews, env management',   '▲', ARRAY['edge','preview','ISR'], 19),
  -- AI
  ('ai', 'Prompt Engineering', 86, 'system prompts, few-shot, chain-of-thought, eval',  '◎', ARRAY['CoT','few-shot','eval'], 20),
  ('ai', 'AI Integration',     80, 'OpenAI/Claude APIs, streaming, function calling',   '⚡', ARRAY['streaming','tools','RAG'], 21),
  ('ai', 'Data Analysis',      62, 'SQL reports, charts, metrics, pivot tables',        '◉', ARRAY['SQL','charts','pivot'], 22),
  ('ai', 'RAG Systems',        70, 'embeddings, vector search, chunking, pipelines',    '⬡', ARRAY['pgvector','embed','chunk'], 23);

-- ─────────────────────────────────────────────────────────────────────────────
-- SITE SETTINGS TABLE
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read site settings" ON site_settings;
CREATE POLICY "Public read site settings"
  ON site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access site settings" ON site_settings;
CREATE POLICY "Admin full access site settings"
  ON site_settings FOR ALL USING (true) WITH CHECK (true);

-- Insert default settings
INSERT INTO site_settings (key, value) VALUES
  ('hero_name',             'Mustafa Mohamed'),
  ('hero_title',            'Full-Stack'),
  ('hero_tagline',          'I build fast, elegant web apps and craft content that converts. Precision engineering meets creative strategy — every project, every time.'),
  ('hero_available',        'true'),
  ('footer_copyright',      '© 2025 Mustafa Mohamed. All rights reserved.'),
  ('social_twitter',        'https://x.com/Bemora_BEMO'),
  ('social_youtube',        'https://youtube.com/@Bemora-site'),
  ('social_email',          'mailto:overthegardenwall317@gmail.com'),
  ('section_reviews',       'true'),
  ('section_portfolio',     'true'),
  ('section_skills',        'true'),
  ('section_contact',       'true')
ON CONFLICT (key) DO NOTHING;
