-- ============================================
-- PORTFOLIO DATABASE SETUP FOR NEON
-- ============================================
-- This file contains all SQL scripts needed to set up
-- your portfolio database in Neon SQL editor
-- ============================================

-- ============================================
-- 1. CREATE TABLES (IF NOT EXISTS)
-- ============================================

-- Sessions table (required for authentication)
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire);

-- Users table (required for authentication)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY NOT NULL,
  email VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  issue_date TEXT,
  image_url TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
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
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id SERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. INSERT SAMPLE DATA
-- ============================================

-- Sample Projects
INSERT INTO projects (title, description, technologies, image_url, live_url, github_url, is_visible)
VALUES 
  (
    'E-Commerce Platform',
    'A full-stack e-commerce platform with payment integration, product management, and user authentication.',
    ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    '/uploads/ecommerce.jpg',
    'https://example.com',
    'https://github.com/example/ecommerce',
    TRUE
  ),
  (
    'Task Management App',
    'A collaborative task management application with real-time updates and team collaboration features.',
    ARRAY['Vue.js', 'Express', 'MongoDB', 'Socket.io'],
    '/uploads/taskmanager.jpg',
    'https://tasks.example.com',
    'https://github.com/example/tasks',
    TRUE
  ),
  (
    'Weather Dashboard',
    'A weather forecasting dashboard with interactive charts and location-based weather data.',
    ARRAY['React', 'TypeScript', 'Chart.js', 'OpenWeather API'],
    '/uploads/weather.jpg',
    'https://weather.example.com',
    NULL,
    TRUE
  )
ON CONFLICT DO NOTHING;

-- Sample Certificates
INSERT INTO certificates (title, description, issue_date, image_url, is_visible)
VALUES 
  (
    'AWS Certified Developer',
    'Amazon Web Services Certified Developer - Associate',
    '2024-01-15',
    '/uploads/aws-cert.jpg',
    TRUE
  ),
  (
    'React Professional Certification',
    'Advanced React and Redux certification from Meta',
    '2023-11-20',
    '/uploads/react-cert.jpg',
    TRUE
  ),
  (
    'Full Stack Web Development',
    'Complete full-stack web development bootcamp certification',
    '2023-08-10',
    '/uploads/fullstack-cert.jpg',
    TRUE
  )
ON CONFLICT DO NOTHING;

-- Sample Approved Reviews
INSERT INTO reviews (name, email, rating, comment, is_approved)
VALUES 
  (
    'John Smith',
    'john@example.com',
    5,
    'Excellent work! Very professional and delivered ahead of schedule. Highly recommended!',
    TRUE
  ),
  (
    'Sarah Johnson',
    'sarah@example.com',
    5,
    'Outstanding developer with great communication skills. The project exceeded our expectations.',
    TRUE
  ),
  (
    'Michael Chen',
    'michael@example.com',
    4,
    'Great technical skills and problem-solving ability. Would definitely work together again.',
    TRUE
  )
ON CONFLICT DO NOTHING;

-- Sample Notification (Welcome message)
INSERT INTO notifications (title, message, type, is_active)
VALUES 
  (
    'Welcome to My Portfolio!',
    'Thanks for visiting! Feel free to explore my projects and get in touch.',
    'info',
    TRUE
  )
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. USEFUL QUERIES FOR MANAGEMENT
-- ============================================

-- View all projects with their technologies
-- SELECT id, title, description, technologies, is_visible, created_at FROM projects ORDER BY created_at DESC;

-- View pending reviews (not yet approved)
-- SELECT id, name, email, rating, comment, created_at FROM reviews WHERE is_approved = FALSE ORDER BY created_at DESC;

-- View unread contact messages
-- SELECT id, name, email, subject, message, created_at FROM contact_messages WHERE is_read = FALSE ORDER BY created_at DESC;

-- View active notifications
-- SELECT id, title, message, type, created_at FROM notifications WHERE is_active = TRUE ORDER BY created_at DESC;

-- View all certificates
-- SELECT id, title, description, issue_date, is_visible FROM certificates ORDER BY created_at DESC;

-- ============================================
-- 4. ADMIN OPERATIONS
-- ============================================

-- Approve a review (replace <id> with actual review ID)
-- UPDATE reviews SET is_approved = TRUE WHERE id = <id>;

-- Mark a contact message as read (replace <id> with actual message ID)
-- UPDATE contact_messages SET is_read = TRUE WHERE id = <id>;

-- Toggle project visibility (replace <id> with actual project ID)
-- UPDATE projects SET is_visible = NOT is_visible WHERE id = <id>;

-- Delete a project (replace <id> with actual project ID)
-- DELETE FROM projects WHERE id = <id>;

-- ============================================
-- 5. ANALYTICS QUERIES
-- ============================================

-- Count total views by event type
-- SELECT event_type, COUNT(*) as count FROM analytics GROUP BY event_type ORDER BY count DESC;

-- Recent activity (last 100 events)
-- SELECT event_type, created_at FROM analytics ORDER BY created_at DESC LIMIT 100;

-- Daily page views
-- SELECT DATE(created_at) as date, COUNT(*) as views FROM analytics WHERE event_type = 'page_view' GROUP BY DATE(created_at) ORDER BY date DESC;

-- ============================================
-- 6. DATABASE MAINTENANCE
-- ============================================

-- Clean up old sessions (older than 30 days)
-- DELETE FROM sessions WHERE expire < NOW() - INTERVAL '30 days';

-- Clean up old analytics data (older than 90 days)
-- DELETE FROM analytics WHERE created_at < NOW() - INTERVAL '90 days';

-- ============================================
-- 7. ADMIN CREDENTIALS
-- ============================================
-- 
-- The admin login is handled in the application code.
-- Default credentials are:
--   Email: admin@portfolio.com
--   Password: admin123
-- 
-- IMPORTANT: Change these credentials in server/adminAuth.ts
-- for production use!
--
-- To change the admin password, edit the ADMIN_PASSWORD
-- constant in server/adminAuth.ts
-- ============================================

-- ============================================
-- NOTES:
-- ============================================
-- 1. All tables are created with IF NOT EXISTS to prevent errors
-- 2. Sample data uses ON CONFLICT DO NOTHING to prevent duplicates
-- 3. The sessions table is required for authentication to work
-- 4. All admin operations must be done through the dashboard
--    or using the queries provided above
-- 5. Regular users cannot modify data - only admins can
-- ============================================
