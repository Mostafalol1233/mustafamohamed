import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  LayoutDashboard, FolderOpen, Star, MessageSquare, Award, Bell, BarChart2,
  Download, Settings, LogOut, Plus, Trash2, CheckCircle, Eye, EyeOff,
  RefreshCw, Key, Check, AlertCircle, Loader2, FileText, ExternalLink, User, Save, ToggleLeft, ToggleRight,
} from "lucide-react";
import type { Project, ContactMessage, Notification, BlogPost } from "@shared/schema";
import {
  adminLogin, adminLogout, getAdminUser,
  createProject, updateProject, deleteProject,
  createBlogPost, updateBlogPost, deleteBlogPost,
  createNotification, deleteNotification,
  updateProfileSettings,
  supabase,
} from "@/lib/supabase";
import type { ProfileSettings } from "@/lib/supabase";
import { queryClient as qcInstance } from "@/lib/queryClient";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function fmtDate(d: string | Date | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "green" | "yellow" | "red" | "blue" }) {
  const styles: Record<string, string> = {
    default: "bg-gray-100 text-gray-700 border-gray-200",
    green:   "bg-green-50 text-green-700 border-green-200",
    yellow:  "bg-yellow-50 text-yellow-700 border-yellow-200",
    red:     "bg-red-50 text-red-700 border-red-200",
    blue:    "bg-blue-50 text-blue-700 border-blue-200",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[variant]}`}>{children}</span>;
}

function Btn({ children, onClick, variant = "primary", size = "md", disabled, className, type = "button" }: {
  children: React.ReactNode; onClick?: () => void; variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md"; disabled?: boolean; className?: string; type?: "button" | "submit";
}) {
  const vs: Record<string, string> = {
    primary: "bg-gray-900 text-white hover:bg-gray-800 border-transparent",
    outline: "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
    ghost:   "bg-transparent text-gray-600 border-transparent hover:bg-gray-100",
    danger:  "bg-red-600 text-white border-transparent hover:bg-red-700",
  };
  const ss: Record<string, string> = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm" };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={cn(`inline-flex items-center gap-1.5 font-medium rounded-lg border transition-all ${vs[variant]} ${ss[size]}`, disabled && "opacity-50 cursor-not-allowed", className)}>
      {children}
    </button>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number | string; icon: any; color: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-xs text-gray-500 mt-0.5">{label}</div>
      </div>
    </div>
  );
}

// ─── Auth Hook ────────────────────────────────────────────────────────────────

function useAdminAuth() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });
  return { isAuth: !error && !!data, isLoading };
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS = [
  { id: "overview",      label: "Overview",       icon: LayoutDashboard },
  { id: "projects",      label: "Projects",       icon: FolderOpen },
  { id: "articles",      label: "Articles",       icon: FileText },
  { id: "messages",      label: "Messages",       icon: MessageSquare },
  { id: "notifications", label: "Notifications",  icon: Bell },
  { id: "profile",       label: "Profile",        icon: User },
  { id: "analytics",     label: "Analytics",      icon: BarChart2 },
  { id: "settings",      label: "Settings",       icon: Settings },
] as const;
type Tab = typeof TABS[number]["id"];

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab() {
  const { data: projects = [] } = useQuery<Project[]>({ queryKey: ["/api/projects/all"] });
  const { data: messages = [] } = useQuery<ContactMessage[]>({ queryKey: ["/api/contact"] });

  const unread = (messages as ContactMessage[]).filter(m => !m.isRead).length;
  const weekData = [
    { day: "Mon", visits: 12 }, { day: "Tue", visits: 19 }, { day: "Wed", visits: 8 },
    { day: "Thu", visits: 24 }, { day: "Fri", visits: 31 }, { day: "Sat", visits: 14 }, { day: "Sun", visits: 9 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Projects"   value={projects.length} icon={FolderOpen}    color="bg-blue-500" />
        <StatCard label="Unread Messages"  value={unread}          icon={MessageSquare} color="bg-green-500" />
        <StatCard label="Active Since"       value="2021"            icon={BarChart2}     color="bg-indigo-500" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4 text-sm">Weekly Visits (sample)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="visits" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4 text-sm">Recent Messages</h3>
          <div className="space-y-3">
            {(messages as ContactMessage[]).slice(0, 4).map(m => (
              <div key={m.id} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {m.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-900">{m.name}</span>
                    {!m.isRead && <Badge variant="blue">New</Badge>}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{m.message}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{fmtDate(m.createdAt)}</span>
              </div>
            ))}
            {messages.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No messages yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Projects Tab ─────────────────────────────────────────────────────────────

function ProjectsTab() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: projects = [], isLoading } = useQuery<Project[]>({ queryKey: ["/api/admin/projects"] });
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", description: "", technologies: "", liveUrl: "", githubUrl: "", imageUrl: "", isVisible: true });
  const [showForm, setShowForm] = useState(false);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["/api/admin/projects"] });
    qc.invalidateQueries({ queryKey: ["/api/projects"] });
  };

  const createMut = useMutation({
    mutationFn: () => createProject({
      title: form.title, description: form.description,
      technologies: form.technologies.split(",").map(t => t.trim()).filter(Boolean),
      liveUrl: form.liveUrl, githubUrl: form.githubUrl, imageUrl: form.imageUrl,
    }),
    onSuccess: () => { invalidate(); setShowForm(false); resetForm(); toast({ title: "Project created" }); },
    onError: (e: any) => toast({ title: "Failed to create project", description: e.message, variant: "destructive" }),
  });

  const updateMut = useMutation({
    mutationFn: (id: number) => updateProject(id, {
      title: form.title, description: form.description,
      technologies: form.technologies.split(",").map(t => t.trim()).filter(Boolean),
      liveUrl: form.liveUrl, githubUrl: form.githubUrl, imageUrl: form.imageUrl, isVisible: form.isVisible,
    }),
    onSuccess: () => { invalidate(); setEditId(null); setShowForm(false); toast({ title: "Project updated" }); },
    onError: (e: any) => toast({ title: "Failed to update", description: e.message, variant: "destructive" }),
  });

  const toggleMut = useMutation({
    mutationFn: ({ id, isVisible }: { id: number; isVisible: boolean }) => updateProject(id, { isVisible }),
    onSuccess: invalidate,
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteProject(id),
    onSuccess: () => { invalidate(); toast({ title: "Project deleted" }); },
    onError: (e: any) => toast({ title: "Failed to delete", description: e.message, variant: "destructive" }),
  });

  const startEdit = (p: Project) => {
    setForm({
      title: p.title, description: p.description,
      technologies: (p.technologies || []).join(", "),
      liveUrl: p.liveUrl || "", githubUrl: p.githubUrl || "",
      imageUrl: p.imageUrl || "", isVisible: p.isVisible ?? true,
    });
    setEditId(p.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ title: "", description: "", technologies: "", liveUrl: "", githubUrl: "", imageUrl: "", isVisible: true });
    setEditId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Projects ({projects.length})</h2>
        <Btn onClick={() => { resetForm(); setShowForm(v => !v); }}><Plus size={14} /> New Project</Btn>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h3 className="font-medium text-gray-900 text-sm">{editId ? "Edit Project" : "New Project"}</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {([["title", "Title *"], ["description", "Description *"], ["technologies", "Technologies (comma separated)"], ["liveUrl", "Live URL"], ["githubUrl", "GitHub URL"], ["imageUrl", "Image URL"]] as [string, string][]).map(([key, label]) => (
              <div key={key} className={key === "description" ? "md:col-span-2" : ""}>
                <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                {key === "description" ? (
                  <textarea rows={2} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900 resize-none" />
                ) : (
                  <input type="text" value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900" />
                )}
              </div>
            ))}
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isVisible} onChange={e => setForm(f => ({ ...f, isVisible: e.target.checked }))} />
            <span className="text-sm text-gray-700">Visible on portfolio</span>
          </label>
          <div className="flex gap-2">
            <Btn onClick={() => editId ? updateMut.mutate(editId) : createMut.mutate()} disabled={!form.title || !form.description || createMut.isPending || updateMut.isPending}>
              {(createMut.isPending || updateMut.isPending) && <Loader2 size={13} className="animate-spin" />}
              {editId ? "Save Changes" : "Create Project"}
            </Btn>
            <Btn variant="ghost" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</Btn>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100 bg-gray-50">
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Title</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden md:table-cell">Technologies</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr><td colSpan={4} className="text-center py-12 text-gray-400 text-sm"><Loader2 className="animate-spin inline-block mr-2" size={14} />Loading...</td></tr>
            ) : (projects as Project[]).map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900 truncate max-w-[160px]">{p.title}</div>
                  <div className="text-xs text-gray-400 truncate max-w-[160px]">{p.description}</div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {(p.technologies || []).slice(0, 3).map(t => <Badge key={t}>{t}</Badge>)}
                    {(p.technologies || []).length > 3 && <Badge>+{(p.technologies||[]).length - 3}</Badge>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={p.isVisible ? "green" : "default"}>{p.isVisible ? "Visible" : "Hidden"}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <Btn size="sm" variant="ghost" onClick={() => toggleMut.mutate({ id: p.id, isVisible: !p.isVisible })}>
                      {p.isVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                    </Btn>
                    <Btn size="sm" variant="outline" onClick={() => startEdit(p)}>Edit</Btn>
                    <Btn size="sm" variant="danger" onClick={() => { if (confirm("Delete this project?")) deleteMut.mutate(p.id); }}><Trash2 size={13} /></Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isLoading && projects.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No projects yet. Click "New Project" to add one.</div>
        )}
      </div>
    </div>
  );
}

// ─── Articles Tab ─────────────────────────────────────────────────────────────

function ArticlesTab() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({ queryKey: ["/api/admin/blog"] });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "", coverImage: "", tags: "",
    readTime: 5, isPublished: true,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["/api/admin/blog"] });
    qc.invalidateQueries({ queryKey: ["/api/blog"] });
  };

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const createMut = useMutation({
    mutationFn: () => createBlogPost({
      ...form,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      slug: form.slug || slugify(form.title),
    }),
    onSuccess: () => { invalidate(); setShowForm(false); resetForm(); toast({ title: "Article created" }); },
    onError: (e: any) => toast({ title: "Failed to create article", description: e.message, variant: "destructive" }),
  });

  const updateMut = useMutation({
    mutationFn: (id: number) => updateBlogPost(id, {
      ...form,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
    }),
    onSuccess: () => { invalidate(); setShowForm(false); setEditId(null); resetForm(); toast({ title: "Article updated" }); },
    onError: (e: any) => toast({ title: "Failed to update article", description: e.message, variant: "destructive" }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteBlogPost(id),
    onSuccess: () => { invalidate(); toast({ title: "Article deleted" }); },
    onError: (e: any) => toast({ title: "Failed to delete", description: e.message, variant: "destructive" }),
  });

  const togglePublish = useMutation({
    mutationFn: ({ id, isPublished }: { id: number; isPublished: boolean }) => updateBlogPost(id, { isPublished }),
    onSuccess: invalidate,
  });

  const resetForm = () => {
    setForm({ title: "", slug: "", excerpt: "", content: "", coverImage: "", tags: "", readTime: 5, isPublished: true });
    setEditId(null);
  };

  const startEdit = (p: BlogPost) => {
    setForm({
      title: p.title, slug: p.slug, excerpt: p.excerpt,
      content: p.content || "", coverImage: p.coverImage || "",
      tags: (p.tags || []).join(", "), readTime: p.readTime ?? 5,
      isPublished: p.isPublished ?? true,
    });
    setEditId(p.id);
    setShowForm(true);
  };

  const fields: [keyof typeof form, string][] = [
    ["title", "Title *"],
    ["slug", "URL Slug (auto-generated if empty)"],
    ["coverImage", "Cover Image URL"],
    ["tags", "Tags (comma separated)"],
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Articles ({posts.length})</h2>
        <Btn onClick={() => { resetForm(); setShowForm(v => !v); }}><Plus size={14} /> New Article</Btn>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h3 className="font-medium text-gray-900 text-sm">{editId ? "Edit Article" : "New Article"}</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {fields.map(([key, label]) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                <input type="text" value={String(form[key])}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Read Time (minutes)</label>
              <input type="number" min={1} max={60} value={form.readTime}
                onChange={e => setForm(f => ({ ...f, readTime: parseInt(e.target.value) || 5 }))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Excerpt *</label>
            <textarea rows={2} value={form.excerpt}
              onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Content (Markdown)</label>
            <textarea rows={8} value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900 resize-y font-mono" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isPublished}
              onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} />
            <span className="text-sm text-gray-700">Published (visible on site)</span>
          </label>
          <div className="flex gap-2">
            <Btn onClick={() => editId ? updateMut.mutate(editId) : createMut.mutate()}
              disabled={!form.title || !form.excerpt || createMut.isPending || updateMut.isPending}>
              {(createMut.isPending || updateMut.isPending) && <Loader2 size={13} className="animate-spin" />}
              {editId ? "Save Changes" : "Publish Article"}
            </Btn>
            <Btn variant="ghost" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</Btn>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100 bg-gray-50">
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Title</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden md:table-cell">Tags</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr><td colSpan={4} className="text-center py-12 text-gray-400 text-sm">
                <Loader2 className="animate-spin inline-block mr-2" size={14} />Loading...
              </td></tr>
            ) : (posts as BlogPost[]).map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900 truncate max-w-[180px]">{p.title}</div>
                  <div className="text-xs text-gray-400 truncate max-w-[180px]">/blog/{p.slug}</div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {(p.tags || []).slice(0, 3).map(t => <Badge key={t}>{t}</Badge>)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={p.isPublished ? "green" : "default"}>{p.isPublished ? "Published" : "Draft"}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer">
                      <Btn size="sm" variant="ghost"><ExternalLink size={13} /></Btn>
                    </a>
                    <Btn size="sm" variant="ghost" onClick={() => togglePublish.mutate({ id: p.id, isPublished: !p.isPublished })}>
                      {p.isPublished ? <EyeOff size={13} /> : <Eye size={13} />}
                    </Btn>
                    <Btn size="sm" variant="outline" onClick={() => startEdit(p)}>Edit</Btn>
                    <Btn size="sm" variant="danger" onClick={() => { if (confirm("Delete this article?")) deleteMut.mutate(p.id); }}>
                      <Trash2 size={13} />
                    </Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isLoading && posts.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No articles yet. Click "New Article" to write one.</div>
        )}
      </div>
    </div>
  );
}

// ─── Messages Tab ─────────────────────────────────────────────────────────────

function MessagesTab() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: messages = [], isLoading } = useQuery<ContactMessage[]>({ queryKey: ["/api/contact"] });
  const [selected, setSelected] = useState<number | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["/api/contact"] });

  const readMut = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: invalidate,
  });

  const deleteMut = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => { invalidate(); setSelected(null); toast({ title: "Message deleted" }); },
  });

  const msg = (messages as ContactMessage[]).find(m => m.id === selected);

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-gray-900">Contact Messages ({messages.length})</h2>
      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 space-y-2">
          {isLoading ? <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
          : (messages as ContactMessage[]).map(m => (
            <button key={m.id} onClick={() => { setSelected(m.id); if (!m.isRead) readMut.mutate(m.id); }}
              className={cn("w-full text-left p-3 rounded-xl border transition-all",
                selected === m.id ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 bg-white hover:bg-gray-50")}>
              <div className="flex items-center gap-2 mb-1">
                <span className={cn("font-medium text-sm truncate", selected === m.id ? "text-white" : "text-gray-900")}>{m.name}</span>
                {!m.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
              </div>
              <p className={cn("text-xs truncate", selected === m.id ? "text-gray-300" : "text-gray-400")}>{m.message}</p>
              <span className={cn("text-xs mt-1 block", selected === m.id ? "text-gray-400" : "text-gray-300")}>{fmtDate(m.createdAt)}</span>
            </button>
          ))}
          {!isLoading && messages.length === 0 && <div className="text-center py-8 text-gray-400 text-sm">No messages yet.</div>}
        </div>

        <div className="lg:col-span-3">
          {msg ? (
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{msg.name}</h3>
                  <p className="text-sm text-blue-600">{msg.email}</p>
                  {msg.subject && <p className="text-xs text-gray-500 mt-1">Re: {msg.subject}</p>}
                </div>
                <Btn size="sm" variant="danger" onClick={() => { if (confirm("Delete message?")) deleteMut.mutate(msg.id); }}><Trash2 size={13} /></Btn>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-100">{msg.message}</div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{fmtDate(msg.createdAt)}</span>
                <Badge variant={msg.isRead ? "green" : "blue"}>{msg.isRead ? "Read" : "Unread"}</Badge>
              </div>
              <a href={`mailto:${msg.email}?subject=Re: ${msg.subject || "Your message"}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline">
                ↗ Reply via email
              </a>
            </div>
          ) : (
            <div className="h-full min-h-[200px] flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400 text-sm">
              Select a message to read it
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Notifications Tab ────────────────────────────────────────────────────────

function NotificationsTab() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: notifs = [], isLoading } = useQuery<Notification[]>({ queryKey: ["/api/admin/notifications"] });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", type: "info" as "info" | "success" | "warning" | "error" });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["/api/admin/notifications"] });
    qc.invalidateQueries({ queryKey: ["/api/notifications"] });
  };

  const createMut = useMutation({
    mutationFn: () => createNotification(form),
    onSuccess: () => { invalidate(); setShowForm(false); setForm({ title: "", message: "", type: "info" }); toast({ title: "Notification created" }); },
    onError: (e: any) => toast({ title: "Failed to create", description: e.message, variant: "destructive" }),
  });

  const toggleMut = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const { error } = await supabase.from("notifications").update({ is_active: isActive }).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: invalidate,
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteNotification(id),
    onSuccess: () => { invalidate(); toast({ title: "Notification deleted" }); },
  });

  const typeColors: Record<string, string> = { info: "bg-blue-500", success: "bg-green-500", warning: "bg-yellow-500", error: "bg-red-500" };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Site Notifications ({notifs.length})</h2>
        <Btn onClick={() => setShowForm(v => !v)}><Plus size={14} /> New Notification</Btn>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
          <h3 className="font-medium text-gray-900 text-sm">New Banner Notification</h3>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Message *</label>
            <textarea rows={2} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900">
              {["info", "success", "warning", "error"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <Btn onClick={() => createMut.mutate()} disabled={!form.title || !form.message || createMut.isPending}>Create</Btn>
            <Btn variant="ghost" onClick={() => setShowForm(false)}>Cancel</Btn>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {isLoading ? <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
        : (notifs as Notification[]).map(n => (
          <div key={n.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-3">
            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${typeColors[n.type] || "bg-gray-400"}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-gray-900">{n.title}</span>
                <Badge variant={n.type === "success" ? "green" : n.type === "warning" ? "yellow" : n.type === "error" ? "red" : "blue"}>{n.type}</Badge>
                {!n.isActive && <Badge>Inactive</Badge>}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Btn size="sm" variant="outline" onClick={() => toggleMut.mutate({ id: n.id, isActive: !n.isActive })}>
                {n.isActive ? <EyeOff size={13} /> : <Eye size={13} />}
              </Btn>
              <Btn size="sm" variant="danger" onClick={() => { if (confirm("Delete?")) deleteMut.mutate(n.id); }}><Trash2 size={13} /></Btn>
            </div>
          </div>
        ))}
        {!isLoading && notifs.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No notifications. Create one to show a banner on the site.</div>}
      </div>
    </div>
  );
}

// ─── Analytics Tab ────────────────────────────────────────────────────────────

function AnalyticsTab() {
  const weekData = [
    { day: "Mon", visits: 12 }, { day: "Tue", visits: 19 }, { day: "Wed", visits: 8 },
    { day: "Thu", visits: 24 }, { day: "Fri", visits: 31 }, { day: "Sat", visits: 14 }, { day: "Sun", visits: 9 },
  ];
  const COLORS = ["#4f46e5", "#7c3aed", "#2563eb", "#059669", "#d97706", "#dc2626"];
  const eventTypes = [
    { name: "Page Views", value: 42 }, { name: "Project Clicks", value: 28 },
    { name: "Contact Opens", value: 18 }, { name: "Blog Reads", value: 12 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-gray-900">Analytics</h2>
      <p className="text-sm text-gray-500">Analytics data is currently shown as sample data. Integrate a real analytics provider (e.g. Plausible, PostHog) to track real visits.</p>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4 text-sm">Weekly Visits</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="visits" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4 text-sm">Event Types</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={eventTypes} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name"
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                {eventTypes.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: profile } = useQuery<ProfileSettings>({ queryKey: ["/api/profile-settings"] });

  const [form, setForm] = useState<Partial<Omit<ProfileSettings, "id">>>({});
  const [saved, setSaved] = useState(false);

  const set = (k: keyof Omit<ProfileSettings, "id">, v: any) =>
    setForm(f => ({ ...f, [k]: v }));

  const val = (k: keyof Omit<ProfileSettings, "id">) =>
    form[k] !== undefined ? form[k] : (profile?.[k] ?? "");

  const saveMut = useMutation({
    mutationFn: () => updateProfileSettings(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/profile-settings"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      toast({ title: "Profile saved" });
      setForm({});
    },
    onError: (e: any) => toast({ title: "Save failed", description: e.message, variant: "destructive" }),
  });

  const Field = ({ label, field, placeholder, type = "text" }: {
    label: string; field: keyof Omit<ProfileSettings, "id">; placeholder?: string; type?: string;
  }) => (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={val(field) as string}
        onChange={e => set(field, e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900"
      />
    </div>
  );

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Profile & Contact</h2>
        <Btn onClick={() => saveMut.mutate()} disabled={saveMut.isPending || Object.keys(form).length === 0}>
          {saved ? <><Check size={14} /> Saved</> : <><Save size={14} /> Save Changes</>}
        </Btn>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <h3 className="font-medium text-gray-900 text-sm">Identity</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Display Name" field="displayName" placeholder="Mustafa Mohamed" />
          <Field label="Role / Title" field="role" placeholder="Full-Stack Developer" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Logo Text (nav)" field="logoText" placeholder="M" />
          <Field label="Site Name (nav)" field="siteName" placeholder="mmohamed ~/." />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <h3 className="font-medium text-gray-900 text-sm">Contact Links</h3>
        <Field label="Email" field="email" placeholder="you@example.com" type="email" />
        <Field label="GitHub URL" field="githubUrl" placeholder="https://github.com/username" />
        <Field label="LinkedIn URL" field="linkedinUrl" placeholder="https://linkedin.com/in/..." />
        <Field label="WhatsApp URL" field="whatsappUrl" placeholder="https://wa.me/+1234567890" />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <h3 className="font-medium text-gray-900 text-sm">Card Quote & Status</h3>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Contact Section Quote</label>
          <textarea
            rows={2}
            value={val("contactQuote") as string}
            onChange={e => set("contactQuote", e.target.value)}
            placeholder="I build things that didn't exist before I opened my editor."
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900 resize-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Avatar URL (optional)</label>
          <input
            type="url"
            value={val("avatarUrl") as string}
            onChange={e => set("avatarUrl", e.target.value || null)}
            placeholder="https://..."
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>
        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-900">Available for new projects</p>
            <p className="text-xs text-gray-500">Controls the green dot on your contact card</p>
          </div>
          <button
            onClick={() => set("isAvailable", !(val("isAvailable") as boolean))}
            className="text-gray-700 hover:text-gray-900 transition-colors"
          >
            {val("isAvailable")
              ? <ToggleRight size={28} className="text-green-500" />
              : <ToggleLeft size={28} className="text-gray-400" />
            }
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
        <strong>Note:</strong> Run this SQL in your Supabase SQL Editor first if the profile table doesn't exist yet. See the code sent in the chat below.
      </div>
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab() {
  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-gray-900">Settings</h2>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 max-w-md">
        <h3 className="font-semibold text-blue-900 text-sm mb-2 flex items-center gap-2"><Key size={14} /> Admin Password</h3>
        <p className="text-xs text-blue-700 leading-relaxed">
          Your login is managed via <strong>Supabase Auth</strong>.<br /><br />
          To change your password: <a href="https://supabase.com/dashboard/project/fvuaiwxfdgerjbuszgpf/auth/users" target="_blank" rel="noopener noreferrer" className="underline">open Supabase Auth Users</a> → find your email → Reset password.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 max-w-md space-y-2">
        <h3 className="font-semibold text-gray-900 text-sm">Database</h3>
        <p className="text-xs text-gray-500">
          All portfolio data is stored in Supabase. Browse and edit rows directly in the Table Editor.
        </p>
        <a href="https://supabase.com/dashboard/project/fvuaiwxfdgerjbuszgpf/editor" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline">
          <ExternalLink size={13} /> Open Table Editor
        </a>
      </div>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────

function LoginPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!form.email || !form.password) return;
    setLoading(true);
    setError("");
    try {
      await adminLogin(form.email, form.password);
      qc.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({ title: "Welcome back!" });
    } catch (e: any) {
      setError(e.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Mustafa Mohamed's portfolio</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-lg p-3 text-xs text-red-700">
              <AlertCircle size={14} className="mt-0.5 flex-shrink-0" /> {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-900" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              onKeyDown={e => { if (e.key === "Enter") handleLogin(); }}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-900" />
          </div>
          <button onClick={handleLogin} disabled={!form.email || !form.password || loading}
            className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading && <Loader2 size={14} className="animate-spin" />}
            Sign In
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          <a href="/" className="hover:text-gray-600 transition-colors">← Back to portfolio</a>
        </p>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { isAuth, isLoading } = useAdminAuth();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logoutMut = useMutation({
    mutationFn: adminLogout,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({ title: "Logged out" });
    },
  });

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="animate-spin text-gray-400" size={32} />
    </div>
  );

  if (!isAuth) return <LoginPage />;

  const CONTENT: Record<Tab, React.ReactNode> = {
    overview:      <OverviewTab />,
    projects:      <ProjectsTab />,
    articles:      <ArticlesTab />,
    messages:      <MessagesTab />,
    notifications: <NotificationsTab />,
    profile:       <ProfileTab />,
    analytics:     <AnalyticsTab />,
    settings:      <SettingsTab />,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm text-gray-900 truncate">Admin Panel</div>
            <div className="text-xs text-gray-400">Mustafa Mohamed</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setTab(id as Tab); setSidebarOpen(false); }}
              className={cn("w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all",
                tab === id ? "bg-gray-900 text-white font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900")}>
              <Icon size={15} className="flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100 space-y-1">
          <a href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
            ← Portfolio
          </a>
          <button onClick={() => logoutMut.mutate()}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(v => !v)} className="lg:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100">
              <LayoutDashboard size={18} />
            </button>
            <h1 className="font-semibold text-gray-900 capitalize">{tab}</h1>
          </div>
          <button onClick={() => qc.invalidateQueries()} className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" title="Refresh all">
            <RefreshCw size={15} />
          </button>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {CONTENT[tab]}
        </main>
      </div>
    </div>
  );
}
