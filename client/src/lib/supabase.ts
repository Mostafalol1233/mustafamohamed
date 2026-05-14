import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://fvuaiwxfdgerjbuszgpf.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_AaONMTrQmwsiQIA_-V6fjQ_zrH3u2hB";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type DbProject = {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  technologies: string[] | null;
  live_url: string | null;
  github_url: string | null;
  is_visible: boolean;
  created_at: string;
};

export type DbReview = {
  id: number;
  name: string;
  email: string | null;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
};

export type DbMessage = {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type DbCertificate = {
  id: number;
  title: string;
  description: string | null;
  issue_date: string | null;
  image_url: string | null;
  is_visible: boolean;
  created_at: string;
};

export type DbNotification = {
  id: number;
  title: string;
  message: string;
  type: string;
  is_active: boolean;
  created_at: string;
};

export type DbTestimonial = {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  stars: number;
  icon: string | null;
  visible: boolean;
  created_at: string;
};

export type DbSkill = {
  id: number;
  category: string;
  name: string;
  percent: number;
  description: string | null;
  icon: string | null;
  tags: string[] | null;
  sort_order: number;
};

export type DbSiteSetting = {
  key: string;
  value: string;
  updated_at: string;
};
