-- ============================================================
--  COMPLETE SUPABASE SETUP for Mustafa Mohamed Portfolio
--  Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ── 1. PROJECTS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  image_url   TEXT,
  technologies TEXT[] DEFAULT '{}',
  live_url    TEXT,
  github_url  TEXT,
  is_visible  BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. BLOG POSTS (with Arabic columns) ──────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id           BIGSERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  excerpt      TEXT,
  content      TEXT DEFAULT '',
  title_ar     TEXT,
  excerpt_ar   TEXT,
  content_ar   TEXT,
  cover_image  TEXT,
  tags         TEXT[] DEFAULT '{}',
  author       TEXT DEFAULT 'Mustafa Mohamed',
  is_published BOOLEAN DEFAULT false,
  read_time    INTEGER DEFAULT 5,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Add Arabic columns if table already exists (safe to re-run)
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS title_ar    TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS excerpt_ar  TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content_ar  TEXT;

-- ── 3. CONTACT MESSAGES ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT DEFAULT '',
  message    TEXT NOT NULL,
  is_read    BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. NOTIFICATIONS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         BIGSERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  type       TEXT DEFAULT 'info',
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 5. SITE SETTINGS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  key   TEXT PRIMARY KEY,
  value TEXT
);

-- Default site settings
INSERT INTO site_settings (key, value)
VALUES
  ('resume_url',             ''),
  ('site_name',              'mmohamed ~/.'),
  ('logo_image_url',         ''),
  ('available_for_projects', 'true')
ON CONFLICT (key) DO NOTHING;

-- ── 6. PROFILE SETTINGS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS profile_settings (
  id             INTEGER PRIMARY KEY DEFAULT 1,
  display_name   TEXT DEFAULT 'Mustafa Mohamed',
  role           TEXT DEFAULT 'Full-Stack Developer',
  email          TEXT DEFAULT 'overthegardenwall317@gmail.com',
  github_url     TEXT DEFAULT 'https://github.com/Bemora',
  linkedin_url   TEXT DEFAULT 'https://linkedin.com/in/mustafa-bemo',
  whatsapp_url   TEXT DEFAULT 'https://wa.me/',
  contact_quote  TEXT DEFAULT 'I build things that didn''t exist before I opened my editor.',
  is_available   BOOLEAN DEFAULT true,
  avatar_url     TEXT,
  logo_text      TEXT DEFAULT 'M',
  site_name      TEXT DEFAULT 'mmohamed ~/.',
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default profile row if missing
INSERT INTO profile_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ── 7. SUPABASE STORAGE BUCKET (project images) ──────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- ── 8. ROW LEVEL SECURITY ────────────────────────────────────
ALTER TABLE projects          ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_settings  ENABLE ROW LEVEL SECURITY;

-- Drop old policies first (safe to re-run)
DROP POLICY IF EXISTS "Public read visible projects"     ON projects;
DROP POLICY IF EXISTS "Auth full access projects"        ON projects;
DROP POLICY IF EXISTS "Public read published posts"      ON blog_posts;
DROP POLICY IF EXISTS "Auth full access posts"           ON blog_posts;
DROP POLICY IF EXISTS "Public insert messages"           ON contact_messages;
DROP POLICY IF EXISTS "Auth manage messages"             ON contact_messages;
DROP POLICY IF EXISTS "Public read active notifications" ON notifications;
DROP POLICY IF EXISTS "Auth manage notifications"        ON notifications;
DROP POLICY IF EXISTS "Public read site settings"        ON site_settings;
DROP POLICY IF EXISTS "Auth manage site settings"        ON site_settings;
DROP POLICY IF EXISTS "Public read profile"              ON profile_settings;
DROP POLICY IF EXISTS "Auth manage profile"              ON profile_settings;

-- Projects policies
CREATE POLICY "Public read visible projects"
  ON projects FOR SELECT USING (is_visible = true);
CREATE POLICY "Auth full access projects"
  ON projects FOR ALL USING (auth.role() = 'authenticated');

-- Blog posts policies
CREATE POLICY "Public read published posts"
  ON blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Auth full access posts"
  ON blog_posts FOR ALL USING (auth.role() = 'authenticated');

-- Contact messages policies
CREATE POLICY "Public insert messages"
  ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth manage messages"
  ON contact_messages FOR ALL USING (auth.role() = 'authenticated');

-- Notifications policies
CREATE POLICY "Public read active notifications"
  ON notifications FOR SELECT USING (is_active = true);
CREATE POLICY "Auth manage notifications"
  ON notifications FOR ALL USING (auth.role() = 'authenticated');

-- Site settings policies
CREATE POLICY "Public read site settings"
  ON site_settings FOR SELECT USING (true);
CREATE POLICY "Auth manage site settings"
  ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- Profile settings policies
CREATE POLICY "Public read profile"
  ON profile_settings FOR SELECT USING (true);
CREATE POLICY "Auth manage profile"
  ON profile_settings FOR ALL USING (auth.role() = 'authenticated');

-- Storage policy for project-images bucket
CREATE POLICY "Public read images"
  ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
CREATE POLICY "Auth upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');

-- ── DONE ─────────────────────────────────────────────────────
-- After running this SQL, go to Supabase → Authentication → Users
-- and create an admin user with your email/password to log in to /admin
