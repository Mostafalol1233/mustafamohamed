import { QueryClient, QueryFunction } from "@tanstack/react-query";
import {
  fetchProjects, fetchBlogPosts, fetchBlogPost,
  fetchNotifications, fetchMessages, getAdminUser,
} from "./supabase";

// ─── Route all /api/* keys to Supabase ───────────────────────────────────────

async function supabaseQueryFn(url: string): Promise<unknown> {
  if (url === "/api/projects")       return fetchProjects(false);
  if (url === "/api/blog")           return fetchBlogPosts(false);
  if (url === "/api/notifications")  return fetchNotifications();
  if (url === "/api/contact")        return fetchMessages();
  if (url === "/api/auth/user") {
    const user = await getAdminUser();
    if (!user) throw Object.assign(new Error("Unauthorized"), { status: 401 });
    return user;
  }
  // Admin all-data endpoints
  if (url === "/api/admin/projects") return fetchProjects(true);
  if (url === "/api/admin/blog")     return fetchBlogPosts(true);
  if (url === "/api/admin/notifications") {
    const { data, error } = await (await import("./supabase")).supabase
      .from("notifications").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((await import("./supabase")).toNotification);
  }

  // /api/blog/:slug
  const blogMatch = url.match(/^\/api\/blog\/(.+)$/);
  if (blogMatch) return fetchBlogPost(blogMatch[1]);

  throw new Error(`No Supabase handler for: ${url}`);
}

// ─── apiRequest — used by mutations (contact form, admin CRUD) ────────────────
// For the contact form we call sendContactMessage() directly from ContactSection.
// This shim is kept for legacy calls from AdminDashboard that haven't been
// converted yet; they fall back to a no-op that throws clearly.
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown,
): Promise<Response> {
  // Return a fake Response-like object for callers that do .json()
  const fake = (body: unknown) => ({
    ok: true, status: 200,
    json: async () => body,
    text: async () => JSON.stringify(body),
  }) as unknown as Response;

  if (method === "POST" && url === "/api/contact") {
    // handled directly by ContactSection via sendContactMessage()
    return fake({ ok: true });
  }

  throw new Error(`apiRequest is deprecated for Supabase build. Use supabase helpers directly. (${method} ${url})`);
}

// ─── QueryClient setup ───────────────────────────────────────────────────────

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    try {
      return await supabaseQueryFn(url) as T;
    } catch (err: any) {
      if (unauthorizedBehavior === "returnNull" && err?.status === 401) return null as T;
      throw err;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: { retry: false },
  },
});
