import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export const supabase = createClient(url, key);

// ─── Row → camelCase transforms ──────────────────────────────────────────────

export function toProject(r: any) {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    imageUrl: r.image_url ?? null,
    technologies: r.technologies ?? [],
    liveUrl: r.live_url ?? null,
    githubUrl: r.github_url ?? null,
    isVisible: r.is_visible ?? true,
    createdAt: r.created_at,
  };
}

export function toBlogPost(r: any) {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    excerpt: r.excerpt,
    content: r.content ?? "",
    coverImage: r.cover_image ?? null,
    tags: r.tags ?? [],
    author: r.author ?? "Mustafa Mohamed",
    isPublished: r.is_published ?? false,
    readTime: r.read_time ?? 5,
    publishedAt: r.published_at,
    createdAt: r.created_at,
  };
}

export function toNotification(r: any) {
  return {
    id: r.id,
    title: r.title,
    message: r.message,
    type: r.type ?? "info",
    isActive: r.is_active ?? true,
    createdAt: r.created_at,
  };
}

export function toMessage(r: any) {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    subject: r.subject ?? "",
    message: r.message,
    isRead: r.is_read ?? false,
    createdAt: r.created_at,
  };
}

// ─── Query helpers ────────────────────────────────────────────────────────────

export async function fetchProjects(adminAll = false) {
  let q = supabase.from("projects").select("*").order("created_at", { ascending: false });
  if (!adminAll) q = (q as any).eq("is_visible", true);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []).map(toProject);
}

export async function fetchBlogPosts(adminAll = false) {
  let q = supabase.from("blog_posts").select("*").order("published_at", { ascending: false });
  if (!adminAll) q = (q as any).eq("is_published", true);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []).map(toBlogPost);
}

export async function fetchBlogPost(slug: string) {
  const { data, error } = await supabase
    .from("blog_posts").select("*").eq("slug", slug).single();
  if (error) throw new Error(error.message);
  return toBlogPost(data);
}

export async function fetchNotifications() {
  const { data, error } = await supabase
    .from("notifications").select("*").eq("is_active", true);
  if (error) throw new Error(error.message);
  return (data ?? []).map(toNotification);
}

export async function fetchMessages() {
  const { data, error } = await supabase
    .from("contact_messages").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(toMessage);
}

// ─── Mutation helpers ─────────────────────────────────────────────────────────

export async function sendContactMessage(payload: {
  name: string; email: string; subject: string; message: string;
}) {
  const { error } = await supabase.from("contact_messages").insert([payload]);
  if (error) throw new Error(error.message);
}

export async function adminLogin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

export async function adminLogout() {
  await supabase.auth.signOut();
}

export async function getAdminUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// Projects CRUD
export async function createProject(p: {
  title: string; description: string; imageUrl?: string;
  technologies?: string[]; liveUrl?: string; githubUrl?: string;
}) {
  const { data, error } = await supabase.from("projects").insert([{
    title: p.title, description: p.description,
    image_url: p.imageUrl ?? null, technologies: p.technologies ?? [],
    live_url: p.liveUrl ?? null, github_url: p.githubUrl ?? null, is_visible: true,
  }]).select().single();
  if (error) throw new Error(error.message);
  return toProject(data);
}

export async function updateProject(id: number, p: Partial<{
  title: string; description: string; imageUrl: string;
  technologies: string[]; liveUrl: string; githubUrl: string; isVisible: boolean;
}>) {
  const patch: Record<string, any> = {};
  if (p.title !== undefined) patch.title = p.title;
  if (p.description !== undefined) patch.description = p.description;
  if (p.imageUrl !== undefined) patch.image_url = p.imageUrl;
  if (p.technologies !== undefined) patch.technologies = p.technologies;
  if (p.liveUrl !== undefined) patch.live_url = p.liveUrl;
  if (p.githubUrl !== undefined) patch.github_url = p.githubUrl;
  if (p.isVisible !== undefined) patch.is_visible = p.isVisible;
  const { data, error } = await supabase.from("projects").update(patch).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return toProject(data);
}

export async function deleteProject(id: number) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// Blog CRUD
export async function createBlogPost(p: {
  title: string; slug: string; excerpt: string; content?: string;
  coverImage?: string; tags?: string[]; readTime?: number; isPublished?: boolean;
}) {
  const { data, error } = await supabase.from("blog_posts").insert([{
    title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content ?? "",
    cover_image: p.coverImage ?? null, tags: p.tags ?? [],
    author: "Mustafa Mohamed", is_published: p.isPublished ?? false,
    read_time: p.readTime ?? 5, published_at: new Date().toISOString(),
  }]).select().single();
  if (error) throw new Error(error.message);
  return toBlogPost(data);
}

export async function updateBlogPost(id: number, p: Partial<{
  title: string; slug: string; excerpt: string; content: string;
  coverImage: string; tags: string[]; readTime: number; isPublished: boolean;
}>) {
  const patch: Record<string, any> = {};
  if (p.title !== undefined) patch.title = p.title;
  if (p.slug !== undefined) patch.slug = p.slug;
  if (p.excerpt !== undefined) patch.excerpt = p.excerpt;
  if (p.content !== undefined) patch.content = p.content;
  if (p.coverImage !== undefined) patch.cover_image = p.coverImage;
  if (p.tags !== undefined) patch.tags = p.tags;
  if (p.readTime !== undefined) patch.read_time = p.readTime;
  if (p.isPublished !== undefined) patch.is_published = p.isPublished;
  const { data, error } = await supabase.from("blog_posts").update(patch).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return toBlogPost(data);
}

export async function deleteBlogPost(id: number) {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// Notifications CRUD (admin)
export async function createNotification(n: { title: string; message: string; type?: string }) {
  const { data, error } = await supabase.from("notifications").insert([{
    title: n.title, message: n.message, type: n.type ?? "info", is_active: true,
  }]).select().single();
  if (error) throw new Error(error.message);
  return toNotification(data);
}

export async function deleteNotification(id: number) {
  const { error } = await supabase.from("notifications").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
