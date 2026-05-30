---
name: Profile Settings Table
description: SQL required for the admin Profile tab + ContactSection dynamic data; fetchProfileSettings returns defaults if table missing.
---

Run this in Supabase SQL Editor before using the Profile tab:

```sql
CREATE TABLE IF NOT EXISTS profile_settings (
  id INT PRIMARY KEY DEFAULT 1,
  display_name TEXT DEFAULT 'Mustafa Mohamed',
  role TEXT DEFAULT 'Full-Stack Developer',
  email TEXT DEFAULT 'overthegardenwall317@gmail.com',
  github_url TEXT DEFAULT 'https://github.com/Bemora',
  linkedin_url TEXT DEFAULT 'https://linkedin.com/in/mustafa-bemo',
  whatsapp_url TEXT DEFAULT 'https://wa.me/',
  contact_quote TEXT DEFAULT 'I build things that didn''t exist before I opened my editor.',
  is_available BOOLEAN DEFAULT true,
  avatar_url TEXT,
  logo_text TEXT DEFAULT 'M',
  site_name TEXT DEFAULT 'mmohamed ~/.'
);
INSERT INTO profile_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
ALTER TABLE profile_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON profile_settings FOR SELECT USING (true);
CREATE POLICY "auth_write"  ON profile_settings FOR ALL USING (auth.role() = 'authenticated');
```

**Why:** ProfileTab in AdminDashboard uses upsert on id=1. fetchProfileSettings silently returns defaults if the table doesn't exist, so the app never breaks.
