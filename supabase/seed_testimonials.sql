-- Paste this into Supabase SQL Editor and click Run

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  quote TEXT NOT NULL,
  stars INTEGER NOT NULL DEFAULT 5 CHECK (stars >= 1 AND stars <= 5),
  icon TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Drop policies if they already exist, then recreate
DROP POLICY IF EXISTS "Public read visible testimonials" ON testimonials;
CREATE POLICY "Public read visible testimonials"
  ON testimonials FOR SELECT
  USING (visible = true);

DROP POLICY IF EXISTS "Admin full access testimonials" ON testimonials;
CREATE POLICY "Admin full access testimonials"
  ON testimonials FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert current testimonials from the portfolio
INSERT INTO testimonials (name, role, company, quote, stars, visible) VALUES
  (
    'Karim Hassan',
    'Community Manager',
    'BRAVEZM Gaming',
    'Delivered exactly what we needed, on time and with clean code. Highly recommend.',
    5,
    true
  ),
  (
    'Dr. Sara Mahmoud',
    'Academic Director',
    'Ahmed Helly Academy',
    'Enrollment inquiries more than doubled after launch. Clean, professional, and trustworthy.',
    5,
    true
  ),
  (
    'Omar Khalid',
    'Esports Coordinator',
    'BestyBoy Gaming',
    'Turned our concept into a platform our community genuinely loves. Fast and detail-oriented.',
    5,
    true
  ),
  (
    'Layla Ibrahim',
    'Campaign Lead',
    'Eco Eats',
    'He understood our mission and built something that resonated with our audience immediately.',
    5,
    true
  ),
  (
    'Ahmed Fawzy',
    'Product Owner',
    'BMO Tools',
    'RTL-ready, fully responsive, and zero bugs on launch day. Exactly what we asked for.',
    5,
    true
  ),
  (
    'Natasha Reed',
    'Managing Director',
    'MR Mohammed',
    'Professional from start to finish. The site impressed our entire team on first review.',
    5,
    true
  );
