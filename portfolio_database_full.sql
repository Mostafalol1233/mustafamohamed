-- ===================================================
-- Portfolio Website - Complete Database Export
-- Generated: October 19, 2025
-- ===================================================

-- Drop existing tables if they exist (be careful in production!)
DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ===================================================
-- CREATE TABLES
-- ===================================================

-- Sessions table (required for session management)
CREATE TABLE sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);
CREATE INDEX IDX_session_expire ON sessions(expire);

-- Users table (required for authentication)
CREATE TABLE users (
  id VARCHAR PRIMARY KEY NOT NULL,
  email VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Certificates table
CREATE TABLE certificates (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  issue_date TEXT,
  image_url TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  rating INTEGER NOT NULL,
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  technologies TEXT[],
  live_url TEXT,
  github_url TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics table
CREATE TABLE analytics (
  id SERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ===================================================
-- INSERT DATA
-- ===================================================

-- Projects
INSERT INTO projects (id, title, description, image_url, technologies, live_url, github_url, is_visible, created_at) VALUES
(1, 'BRAVEZM Gaming', 'Professional gaming platform and community hub for gamers', 'https://images.unsplash.com/photo-1542751371-adc38448a05e', ARRAY['React', 'Node.js', 'MongoDB'], 'https://bravegame.vercel.app', 'https://github.com/mustafa/bravezm', FALSE, '2025-10-19 20:34:27.707414'),
(2, 'BestyBoy Gaming', 'Gaming content creation and streaming platform', 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f', ARRAY['Vue.js', 'Express', 'PostgreSQL'], 'https://bestyboy.com', 'https://github.com/mustafa/bestyboy', TRUE, '2025-10-19 20:34:27.707414'),
(3, 'Ahmed Helly Academy', 'Educational platform for online learning and courses', 'https://images.unsplash.com/photo-1501504905252-473c47e087f8', ARRAY['Next.js', 'TypeScript', 'Tailwind CSS'], 'https://ahmedhelly.com', 'https://github.com/mustafa/ahmed-helly', TRUE, '2025-10-19 20:34:27.707414'),
(4, 'Eco Eats', 'Food waste awareness campaign promoting sustainability', 'https://images.unsplash.com/photo-1542838132-92c53300491e', ARRAY['React', 'Firebase', 'Tailwind CSS'], 'https://ecoeats.app', 'https://github.com/mustafa/eco-eats', TRUE, '2025-10-19 20:34:27.707414'),
(5, 'BMO Tools', 'Arabic calculator tools with RTL support', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f', ARRAY['JavaScript', 'CSS', 'HTML'], 'https://bmotools.com', 'https://github.com/mustafa/bmo-tools', TRUE, '2025-10-19 20:34:27.707414'),
(6, 'OneTeam', 'Team collaboration and project management platform', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c', ARRAY['React', 'TypeScript', 'Node.js'], 'https://oneteamss.vercel.app', 'https://github.com/mustafa/oneteam', TRUE, '2025-10-19 20:34:27.707414'),
(7, 'Bemora', 'Modern business management solution', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', ARRAY['Angular', 'Express', 'MongoDB'], 'https://bemora.netlify.app', 'https://github.com/mustafa/bemora', TRUE, '2025-10-19 20:34:27.707414'),
(8, 'MR Mohammed', 'Professional business consultancy website', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab', ARRAY['WordPress', 'PHP', 'MySQL'], 'https://mrmohammed.com', NULL, TRUE, '2025-10-19 20:34:27.707414'),
(9, 'Diaa Elden Shop', 'Gaming platform and digital marketplace', 'https://images.unsplash.com/photo-1511512578047-dfb367046420', ARRAY['React', 'Stripe', 'Node.js'], 'https://diaaelden.shop', 'https://github.com/mustafa/diaa-shop', TRUE, '2025-10-19 20:34:27.707414'),
(10, 'E-Commerce Platform', 'A full-stack e-commerce platform with payment integration, product management, and user authentication.', '/uploads/ecommerce.jpg', ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe'], 'https://example.com', 'https://github.com/example/ecommerce', TRUE, '2025-10-19 21:13:51.667613'),
(11, 'Task Management App', 'A collaborative task management application with real-time updates and team collaboration features.', '/uploads/taskmanager.jpg', ARRAY['Vue.js', 'Express', 'MongoDB', 'Socket.io'], 'https://tasks.example.com', 'https://github.com/example/tasks', TRUE, '2025-10-19 21:13:51.667613'),
(12, 'Weather Dashboard', 'A weather forecasting dashboard with interactive charts and location-based weather data.', '/uploads/weather.jpg', ARRAY['React', 'TypeScript', 'Chart.js', 'OpenWeather API'], 'https://weather.example.com', NULL, TRUE, '2025-10-19 21:13:51.667613');

-- Update sequence for projects
SELECT setval('projects_id_seq', (SELECT MAX(id) FROM projects));

-- Certificates
INSERT INTO certificates (id, title, description, issue_date, image_url, is_visible, created_at) VALUES
(1, 'Full Stack Web Development', 'Certificate of completion for advanced web development course', '2024', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173', TRUE, '2025-10-19 20:34:27.8815'),
(2, 'React Advanced Patterns', 'Certification in advanced React.js patterns and practices', '2024', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3', TRUE, '2025-10-19 20:34:27.8815'),
(3, 'Cloud Architecture', 'AWS Certified Solutions Architect certification', '2023', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa', TRUE, '2025-10-19 20:34:27.8815'),
(7, 'AWS Certified Developer', 'Amazon Web Services Certified Developer - Associate', '2024-01-15', '/uploads/aws-cert.jpg', TRUE, '2025-10-19 21:13:51.861565'),
(8, 'React Professional Certification', 'Advanced React and Redux certification from Meta', '2023-11-20', '/uploads/react-cert.jpg', TRUE, '2025-10-19 21:13:51.861565'),
(9, 'Full Stack Web Development', 'Complete full-stack web development bootcamp certification', '2023-08-10', '/uploads/fullstack-cert.jpg', TRUE, '2025-10-19 21:13:51.861565');

-- Update sequence for certificates
SELECT setval('certificates_id_seq', (SELECT MAX(id) FROM certificates));

-- Reviews
INSERT INTO reviews (id, name, email, rating, comment, is_approved, created_at) VALUES
(1, 'Ahmed Hassan', 'ahmed@example.com', 5, 'Excellent work! Very professional and delivered on time.', TRUE, '2025-10-19 20:34:28.03752'),
(2, 'Sara Mohammed', 'sara@example.com', 5, 'Amazing developer with great communication skills.', TRUE, '2025-10-19 20:34:28.03752'),
(3, 'Omar Ali', 'omar@example.com', 4, 'Good quality work, would recommend.', TRUE, '2025-10-19 20:34:28.03752'),
(4, 'mostafa', 'admin@ahmedhelly.com', 5, 'top 11', TRUE, '2025-10-19 20:47:58.272397'),
(5, 'John Smith', 'john@example.com', 5, 'Excellent work! Very professional and delivered ahead of schedule. Highly recommended!', TRUE, '2025-10-19 21:13:52.868534'),
(6, 'Sarah Johnson', 'sarah@example.com', 5, 'Outstanding developer with great communication skills. The project exceeded our expectations.', TRUE, '2025-10-19 21:13:52.868534'),
(7, 'Michael Chen', 'michael@example.com', 4, 'Great technical skills and problem-solving ability. Would definitely work together again.', TRUE, '2025-10-19 21:13:52.868534');

-- Update sequence for reviews
SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM reviews));

-- Notifications
INSERT INTO notifications (id, title, message, type, is_active, created_at) VALUES
(1, 'hello every nyan', 'how are you', 'success', FALSE, '2025-10-19 20:49:51.939547'),
(2, 'Welcome to My Portfolio!', 'Thanks for visiting! Feel free to explore my projects and get in touch.', 'info', TRUE, '2025-10-19 21:13:53.039374');

-- Update sequence for notifications
SELECT setval('notifications_id_seq', (SELECT MAX(id) FROM notifications));

-- ===================================================
-- NOTES
-- ===================================================
-- 
-- 1. Admin credentials are stored in the application code (server/adminAuth.ts):
--    Email: admin@portfolio.com
--    Password: admin123
--
-- 2. To use this file:
--    - Copy all content
--    - Paste in your SQL Editor (Neon, pgAdmin, etc.)
--    - Execute the script
--
-- 3. This will:
--    - Drop existing tables (BE CAREFUL!)
--    - Create fresh tables
--    - Insert all data
--
-- 4. For production use:
--    - Remove the DROP TABLE statements
--    - Adjust the data as needed
--
-- ===================================================
