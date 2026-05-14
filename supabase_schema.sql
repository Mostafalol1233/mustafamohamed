-- Run this entire script in your Supabase SQL editor (supabase.com -> SQL Editor)

-- Projects
create table if not exists projects (
  id bigint primary key generated always as identity,
  title text not null,
  description text not null,
  image_url text,
  technologies text[],
  live_url text,
  github_url text,
  is_visible boolean default true,
  created_at timestamptz default now()
);

-- Reviews
create table if not exists reviews (
  id bigint primary key generated always as identity,
  name text not null,
  email text,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null,
  is_approved boolean default false,
  created_at timestamptz default now()
);

-- Contact Messages
create table if not exists contact_messages (
  id bigint primary key generated always as identity,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Certificates
create table if not exists certificates (
  id bigint primary key generated always as identity,
  title text not null,
  description text,
  issue_date text,
  image_url text,
  is_visible boolean default true,
  created_at timestamptz default now()
);

-- Notifications
create table if not exists notifications (
  id bigint primary key generated always as identity,
  title text not null,
  message text not null,
  type text not null default 'info',
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Disable RLS on all tables (portfolio site — admin protected by session auth)
alter table projects disable row level security;
alter table reviews disable row level security;
alter table contact_messages disable row level security;
alter table certificates disable row level security;
alter table notifications disable row level security;

-- Seed initial projects
insert into projects (title, description, image_url, technologies, live_url, github_url, is_visible) values
('BRAVEZM Gaming', 'منصة العاب تجمع بين التسلية والتنافس في عالم الألعاب الإلكترونية', null, array['React', 'TypeScript', 'Tailwind CSS'], 'https://bravezm.vercel.app', 'https://github.com/Bemora/bravezm', true),
('BestyBoy Gaming', 'تطبيق ويب متقدم للألعاب مع واجهة مستخدم عصرية وتجربة تفاعلية ممتازة', null, array['React', 'Node.js', 'Express'], 'https://bestyboy.vercel.app', 'https://github.com/Bemora/bestyboy', true),
('Ahmed Helly Academy', 'منصة تعليمية شاملة لتعلم البرمجة وتطوير المهارات التقنية', null, array['React', 'TypeScript', 'Tailwind CSS'], 'https://ahmed-helly-academy.vercel.app', null, true),
('Eco Eats', 'حملة توعوية لتقليل هدر الطعام وتعزيز الاستدامة البيئية', null, array['React', 'CSS3'], 'https://eco-eats-campaign.vercel.app', null, true),
('BMO Tools', 'مجموعة أدوات الحاسبة العربية مع دعم كامل للغة العربية والتصميم RTL', null, array['React', 'RTL Support', 'Arabic UI'], 'https://bmo-tools.vercel.app', null, true),
('OneTeam', 'منصة إدارة الفرق والمشاريع مع أدوات التعاون المتقدمة', null, array['React', 'Team Management'], 'https://oneteamss.vercel.app', null, true),
('Bemora', 'تطبيق متقدم للإدارة والتنظيم مع واجهة مستخدم حديثة', null, array['React', 'Modern UI'], 'https://bemora.netlify.app', null, true),
('MR Mohammed', 'موقع أعمال متخصص في الخدمات التجارية والاستشارات', null, array['React', 'Business'], 'https://mr-mohammed-business.vercel.app', null, true),
('Diaa Elden Shop', 'متجر إلكتروني متطور للألعاب مع نظام دفع آمن وإدارة متقدمة', null, array['React', 'E-commerce'], 'https://diaa-elden-shop.vercel.app', null, true)
on conflict do nothing;

-- Seed initial certificate
insert into certificates (title, description, issue_date, image_url, is_visible) values
('ALX AI Starter Kit Certificate', 'شهادة متقدمة في الذكاء الاصطناعي من برنامج ALX', '2024', null, true)
on conflict do nothing;
