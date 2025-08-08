-- Portfolio Database Backup and Restore Script
-- Use this file to restore database data when doing remixes

-- First, create the tables (this should happen automatically with npm run db:push)
-- But if needed, here are the table structures:

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    live_url TEXT,
    github_url TEXT,
    technologies TEXT[],
    is_visible BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    issuer VARCHAR(255),
    issue_date VARCHAR(100),
    is_visible BOOLEAN DEFAULT true,
    verified BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data (this will be overridden by the real data)

-- Sample Reviews
INSERT INTO reviews (name, email, rating, comment, is_approved, created_at) VALUES
('أحمد محمد', 'ahmed@example.com', 5, 'مطور ممتاز ومتميز في عمله، يقدم حلول إبداعية ومبتكرة', true, '2024-01-15 10:00:00+00'),
('فاطمة علي', 'fatima@example.com', 5, 'تعامل راقي ومهني، وجودة عمل عالية جداً', true, '2024-01-10 14:30:00+00'),
('محمد حسن', 'mohammed@example.com', 5, 'استجابة سريعة وحلول فعالة للمشاكل التقنية', true, '2024-01-05 09:15:00+00'),
('Sarah Johnson', 'sarah@example.com', 5, 'Outstanding developer with excellent communication skills and attention to detail', true, '2024-01-20 16:45:00+00'),
('علي عبدالله', 'ali@example.com', 5, 'مشاريع احترافية وتسليم في الوقت المحدد، أنصح بالتعامل معه', true, '2024-01-25 11:20:00+00')
ON CONFLICT DO NOTHING;

-- Sample Certificates
INSERT INTO certificates (title, description, image_url, issuer, issue_date, is_visible, verified, created_at) VALUES
('ALX AI Starter Kit Certificate', 'شهادة متقدمة في الذكاء الاصطناعي من برنامج ALX', '/assets/113-alx-ai-starter-kit-certificate-mustafa-muhammad.png', 'ALX Programme', '2024', true, true, NOW()),
('Full Stack Web Development', 'Advanced web development with modern frameworks and technologies', null, 'Tech Academy', '2023', true, true, NOW()),
('Database Design & Management', 'Professional database design, optimization and management certification', null, 'Database Institute', '2023', true, true, NOW()),
('Cloud Computing Fundamentals', 'AWS and cloud infrastructure deployment and management', null, 'Cloud Academy', '2022', true, true, NOW()),
('Cybersecurity Essentials', 'Network security, ethical hacking and security best practices', null, 'Security Institute', '2022', true, true, NOW()),
('Project Management Professional', 'Agile methodology and project lifecycle management certification', null, 'PM Institute', '2021', true, true, NOW())
ON CONFLICT DO NOTHING;

-- Sample Projects  
INSERT INTO projects (title, description, image_url, live_url, github_url, technologies, is_visible, featured, created_at) VALUES
('BRAVEZM Gaming', 'Advanced gaming platform built for professional esports tournaments and casual gaming with real-time matchmaking, comprehensive player statistics, tournament management, and streaming integration.', '/assets/image_1748447815242.png', 'https://bravezm.vercel.app/', 'https://github.com/mustafa-mohamed', ARRAY['React', 'Node.js', 'WebSocket', 'Gaming APIs', 'Tournament Management'], true, true, NOW()),
('BestyBoy Gaming', 'Next-generation gaming companion platform featuring game discovery, achievement tracking, social gaming features, and personalized gaming recommendations.', '/assets/image_1748447890581.png', 'https://bestyboy.vercel.app/', 'https://github.com/mustafa-mohamed', ARRAY['Next.js', 'TypeScript', 'Gaming APIs', 'Social Features', 'Achievement System'], true, true, NOW()),
('Ahmed Helly Academy', 'Complete educational platform for online learning with course management, interactive lessons, progress tracking, certification system, and student-teacher communication tools.', '/assets/image_1748448070181.png', 'https://ahmed-helly.vercel.app/', 'https://github.com/mustafa-mohamed', ARRAY['React', 'Express', 'Educational Tools', 'Certificate System', 'Progress Tracking'], true, true, NOW()),
('Eco Eats', 'Environmental awareness platform focused on sustainable food choices and waste reduction. Features meal planning, carbon footprint tracking, local sustainable restaurant finder, and community challenges for eco-friendly eating habits.', '/assets/eco-eats-preview.png', 'https://eco-eats.vercel.app/', 'https://github.com/mustafa-mohamed', ARRAY['React', 'Node.js', 'Environmental APIs', 'Sustainability', 'Community Features'], true, false, NOW()),
('BMO Tools', 'Arabic Calculator Tools - Comprehensive website for daily tools and calculators in Arabic and English with full RTL support. Features 10 advanced calculators, BMO advanced encryption system, smart encryption detector, comprehensive unit converter, and bilingual support.', '/assets/bmo-tools-preview.png', 'https://bmo-tools.netlify.app/', 'https://github.com/mustafa-mohamed', ARRAY['React', 'JavaScript', 'RTL Support', 'Encryption', 'Calculators'], true, false, NOW()),
('OneTeam', 'HR company platform for workforce management and team collaboration with comprehensive employee management features.', 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400', 'https://oneteamss.vercel.app/', 'https://github.com/mustafa-mohamed', ARRAY['Vue.js', 'Laravel', 'HR Management', 'MySQL'], true, false, NOW()),
('Bemora', 'Content creator blog platform with rich media support and audience engagement features for modern content creators.', '/assets/bemora-new.png', 'https://bemora.netlify.app/', 'https://github.com/mustafa-mohamed', ARRAY['WordPress', 'PHP', 'Content Management', 'SEO'], true, false, NOW()),
('MR Mohammed', 'Professional business portfolio and consulting services platform showcasing expertise in digital transformation and business strategy.', '/assets/mr-mohammed.png', 'https://mrmo.vercel.app/', 'https://github.com/mustafa-mohamed', ARRAY['React', 'TypeScript', 'Business Portfolio', 'Consulting'], true, false, NOW()),
('Diaa Elden Shop', 'Comprehensive e-commerce platform featuring modern shopping experience, secure payment processing, inventory management, and customer support.', '/assets/diaa-elden-shop.png', 'https://diaa-elden.vercel.app/', 'https://github.com/mustafa-mohamed', ARRAY['React', 'Node.js', 'E-commerce', 'Payment Integration', 'MongoDB'], true, false, NOW())
ON CONFLICT DO NOTHING;

-- Instructions for use:
-- 1. When you remix this project, make sure PostgreSQL database is enabled
-- 2. Run: npm run db:push (to create tables)
-- 3. Then run this SQL file in the database to populate with data
-- 4. Make sure all environment variables are set:
--    - DATABASE_URL (and other POSTGRES_ variables)
--    - Check that admin credentials are set in server/adminAuth.ts

-- Quick restore command for admin:
-- You can run this entire file in the Replit database pane or via the SQL tool