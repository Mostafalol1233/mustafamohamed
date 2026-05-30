import { QueryClient, QueryFunction } from "@tanstack/react-query";
import {
  fetchProjects, fetchBlogPosts, fetchNotifications,
  fetchMessages, getAdminUser, toNotification, supabase,
} from "@/lib/supabase";

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    credentials: "include",
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw Object.assign(new Error(err.message || "Request failed"), { status: res.status });
  }
  return res;
}

async function resolveQuery(url: string): Promise<unknown> {
  if (url === "/api/projects")                                          return fetchProjects(false);
  if (url === "/api/projects/all" || url === "/api/admin/projects")    return fetchProjects(true);
  if (url === "/api/blog")                                              return fetchBlogPosts(false);
  if (url === "/api/blog/all"     || url === "/api/admin/blog")        return fetchBlogPosts(true);
  if (url === "/api/notifications")                                     return fetchNotifications();
  if (url === "/api/admin/notifications") {
    const { data, error } = await supabase
      .from("notifications").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toNotification);
  }
  if (url === "/api/contact")  return fetchMessages();
  if (url === "/api/auth/user") return getAdminUser();

  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw Object.assign(new Error(err.message || "Request failed"), { status: res.status });
  }
  return res.json();
}

export const getQueryFn = <T>({ on401 }: { on401: "returnNull" | "throw" }): QueryFunction<T> =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    try {
      return (await resolveQuery(url)) as T;
    } catch (err: any) {
      if (on401 === "returnNull" && err?.status === 401) return null as T;
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
