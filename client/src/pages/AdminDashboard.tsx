import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  LayoutDashboard, FolderOpen, Star, MessageSquare, Award, Bell, BarChart2,
  Download, Settings, LogOut, Plus, Trash2, CheckCircle, Eye, EyeOff,
  RefreshCw, Key, Check, AlertCircle, Loader2,
} from "lucide-react";
import type { Project, Review, ContactMessage, Certificate, Notification } from "@shared/schema";

// ─── Helpers ────────────────────────────────────────────────────────────────

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

// ─── Auth Check ──────────────────────────────────────────────────────────────

function useAdminAuth() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });
  return { isAuth: !error && !!data, isLoading };
}

// ─── Tabs definition ─────────────────────────────────────────────────────────

const TABS = [
  { id: "overview",      label: "Overview",      icon: LayoutDashboard },
  { id: "projects",      label: "Projects",      icon: FolderOpen },
  { id: "reviews",       label: "Reviews",       icon: Star },
  { id: "messages",      label: "Messages",      icon: MessageSquare },
  { id: "certificates",  label: "Certs",         icon: Award },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "analytics",     label: "Analytics",     icon: BarChart2 },
  { id: "export",        label: "Export",        icon: Download },
  { id: "settings",      label: "Settings",      icon: Settings },
] as const;

type Tab = typeof TABS[number]["id"];

// ─── Overview Tab ────────────────────────────────────────────────────────────

function OverviewTab() {
  const { data: projects = [] } = useQuery<Project[]>({ queryKey: ["/api/projects/all"] });
  const { data: reviews = [] } = useQuery<Review[]>({ queryKey: ["/api/reviews/all"] });
  const { data: messages = [] } = useQuery<ContactMessage[]>({ queryKey: ["/api/contact"] });
  const { data: summary } = useQuery<any>({ queryKey: ["/api/admin/analytics/summary"] });

  const unread  = (messages as ContactMessage[]).filter(m => !m.isRead).length;
  const pending = (reviews as Review[]).filter(r => !r.isApproved).length;

  const weekData = [
    { day: "Mon", visits: 12 }, { day: "Tue", visits: 19 }, { day: "Wed", visits: 8 },
    { day: "Thu", visits: 24 }, { day: "Fri", visits: 31 }, { day: "Sat", visits: 14 }, { day: "Sun", visits: 9 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Projects" value={projects.length} icon={FolderOpen} color="bg-blue-500" />
        <StatCard label="Pending Reviews" value={pending} icon={Star} color="bg-yellow-500" />
        <StatCard label="Unread Messages" value={unread} icon={MessageSquare} color="bg-green-500" />
        <StatCard label="Total Events" value={summary?.totalEvents ?? "—"} icon={BarChart2} color="bg-purple-500" />
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
  const { data: projects = [], isLoading } = useQuery<Project[]>({ queryKey: ["/api/projects/all"] });
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", description: "", technologies: "", liveUrl: "", githubUrl: "", imageUrl: "", isVisible: true });
  const [showForm, setShowForm] = useState(false);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["/api/projects/all"] });
    qc.invalidateQueries({ queryKey: ["/api/projects"] });
  };

  const createMut = useMutation({
    mutationFn: async () => {
      const body = new FormData();
      body.append("title", form.title);
      body.append("description", form.description);
      body.append("technologies", JSON.stringify(form.technologies.split(",").map(t => t.trim()).filter(Boolean)));
      body.append("liveUrl", form.liveUrl);
      body.append("githubUrl", form.githubUrl);
      body.append("imageUrl", form.imageUrl);
      body.append("isVisible", String(form.isVisible));
      const res = await fetch("/api/projects", { method: "POST", body, credentials: "include" });
      if (!res.ok) throw new Error(await res.text());
    },
    onSuccess: () => { invalidate(); setShowForm(false); toast({ title: "Project created" }); },
    onError: () => toast({ title: "Failed to create project", variant: "destructive" }),
  });

  const updateMut = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PATCH", `/api/projects/${id}`, {
        ...form,
        technologies: form.technologies.split(",").map(t => t.trim()).filter(Boolean),
      });
    },
    onSuccess: () => { invalidate(); setEditId(null); setShowForm(false); toast({ title: "Project updated" }); },
    onError: () => toast({ title: "Failed to update", variant: "destructive" }),
  });

  const toggleMut = useMutation({
    mutationFn: ({ id, isVisible }: { id: number; isVisible: boolean }) =>
      apiRequest("PATCH", `/api/projects/${id}`, { isVisible }),
    onSuccess: invalidate,
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/projects/${id}`),
    onSuccess: () => { invalidate(); toast({ title: "Project deleted" }); },
    onError: () => toast({ title: "Failed to delete", variant: "destructive" }),
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

// ─── Reviews Tab ─────────────────────────────────────────────────────────────

function ReviewsTab() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: reviews = [], isLoading } = useQuery<Review[]>({ queryKey: ["/api/reviews/all"] });
  const [selected, setSelected] = useState<number[]>([]);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["/api/reviews/all"] });

  const approveMut  = useMutation({ mutationFn: (id: number) => apiRequest("PATCH", `/api/reviews/${id}/approve`), onSuccess: invalidate });
  const deleteMut   = useMutation({ mutationFn: (id: number) => apiRequest("DELETE", `/api/reviews/${id}`), onSuccess: () => { invalidate(); toast({ title: "Review deleted" }); } });
  const bulkApprMut = useMutation({
    mutationFn: () => apiRequest("POST", "/api/reviews/bulk-approve", { ids: selected }),
    onSuccess: () => { invalidate(); setSelected([]); toast({ title: `${selected.length} reviews approved` }); },
  });
  const bulkDelMut  = useMutation({
    mutationFn: () => apiRequest("POST", "/api/reviews/bulk-delete", { ids: selected }),
    onSuccess: () => { invalidate(); setSelected([]); toast({ title: `${selected.length} reviews deleted` }); },
  });

  const toggleSel = (id: number) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(s => s.length === (reviews as Review[]).length ? [] : (reviews as Review[]).map(r => r.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-semibold text-gray-900">Reviews ({reviews.length})</h2>
        {selected.length > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
            <span className="text-xs text-blue-700 font-medium">{selected.length} selected</span>
            <Btn size="sm" variant="outline" onClick={() => bulkApprMut.mutate()}><CheckCircle size={12} /> Approve All</Btn>
            <Btn size="sm" variant="danger" onClick={() => { if (confirm(`Delete ${selected.length} reviews?`)) bulkDelMut.mutate(); }}><Trash2 size={12} /> Delete All</Btn>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100 bg-gray-50">
            <th className="px-4 py-3"><input type="checkbox" checked={selected.length === (reviews as Review[]).length && reviews.length > 0} onChange={toggleAll} /></th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Reviewer</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Rating</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden md:table-cell">Comment</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400 text-sm">Loading...</td></tr>
            ) : (reviews as Review[]).map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggleSel(r.id)} /></td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{r.name}</div>
                  <div className="text-xs text-gray-400">{r.email}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i} style={{ color: i < r.rating ? "#f59e0b" : "#d1d5db", fontSize: 13 }}>★</span>)}
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell"><p className="text-gray-600 text-xs max-w-[260px] truncate">{r.comment}</p></td>
                <td className="px-4 py-3"><Badge variant={r.isApproved ? "green" : "yellow"}>{r.isApproved ? "Approved" : "Pending"}</Badge></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    {!r.isApproved && <Btn size="sm" variant="outline" onClick={() => approveMut.mutate(r.id)}><Check size={12} /> Approve</Btn>}
                    <Btn size="sm" variant="danger" onClick={() => { if (confirm("Delete review?")) deleteMut.mutate(r.id); }}><Trash2 size={13} /></Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isLoading && reviews.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No reviews yet.</div>}
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
  const readMut   = useMutation({ mutationFn: (id: number) => apiRequest("PATCH", `/api/contact/${id}/read`), onSuccess: invalidate });
  const deleteMut = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/contact/${id}`),
    onSuccess: () => { invalidate(); setSelected(null); toast({ title: "Message deleted" }); },
  });

  const msg = (messages as ContactMessage[]).find(m => m.id === selected);

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-gray-900">Contact Messages ({messages.length})</h2>
      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 space-y-2">
          {isLoading ? <div className="text-center py-8 text-gray-400 text-sm">Loading...</div> : (messages as ContactMessage[]).map(m => (
            <button key={m.id} onClick={() => { setSelected(m.id); if (!m.isRead) readMut.mutate(m.id); }}
              className={cn("w-full text-left p-3 rounded-xl border transition-all", selected === m.id ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 bg-white hover:bg-gray-50")}>
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

// ─── Certificates Tab ────────────────────────────────────────────────────────

function CertificatesTab() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: certs = [], isLoading } = useQuery<Certificate[]>({ queryKey: ["/api/certificates/all"] });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", issueDate: "", imageUrl: "" });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["/api/certificates/all"] });

  const createMut = useMutation({
    mutationFn: () => apiRequest("POST", "/api/certificates", form),
    onSuccess: () => { invalidate(); setShowForm(false); setForm({ title: "", description: "", issueDate: "", imageUrl: "" }); toast({ title: "Certificate added" }); },
    onError: () => toast({ title: "Failed to create", variant: "destructive" }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/certificates/${id}`),
    onSuccess: () => { invalidate(); toast({ title: "Certificate deleted" }); },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Certificates ({certs.length})</h2>
        <Btn onClick={() => setShowForm(v => !v)}><Plus size={14} /> Add Certificate</Btn>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
          <h3 className="font-medium text-gray-900 text-sm">New Certificate</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {([["title", "Title *"], ["issueDate", "Issue Date"], ["imageUrl", "Image URL"], ["description", "Description"]] as [string, string][]).map(([k, label]) => (
              <div key={k}>
                <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                <input type="text" value={(form as any)[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900" />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Btn onClick={() => createMut.mutate()} disabled={!form.title || createMut.isPending}>Add Certificate</Btn>
            <Btn variant="ghost" onClick={() => setShowForm(false)}>Cancel</Btn>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100 bg-gray-50">
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Title</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden md:table-cell">Date</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? <tr><td colSpan={3} className="text-center py-8 text-gray-400 text-sm">Loading...</td></tr>
            : (certs as Certificate[]).map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{c.title}</div>
                  {c.description && <div className="text-xs text-gray-400 truncate max-w-[240px]">{c.description}</div>}
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-gray-500">{c.issueDate || "—"}</td>
                <td className="px-4 py-3 text-right">
                  <Btn size="sm" variant="danger" onClick={() => { if (confirm("Delete?")) deleteMut.mutate(c.id); }}><Trash2 size={13} /></Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isLoading && certs.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No custom certificates. Static ones are shown on the site.</div>}
      </div>
    </div>
  );
}

// ─── Notifications Tab ───────────────────────────────────────────────────────

function NotificationsTab() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: notifs = [], isLoading } = useQuery<Notification[]>({ queryKey: ["/api/notifications/all"] });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", type: "info" as "info" | "success" | "warning" | "error" });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["/api/notifications/all"] });
    qc.invalidateQueries({ queryKey: ["/api/notifications"] });
  };

  const createMut = useMutation({
    mutationFn: () => apiRequest("POST", "/api/notifications", { ...form, isActive: true }),
    onSuccess: () => { invalidate(); setShowForm(false); setForm({ title: "", message: "", type: "info" }); toast({ title: "Notification created" }); },
    onError: () => toast({ title: "Failed to create", variant: "destructive" }),
  });

  const toggleMut = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => apiRequest("PATCH", `/api/notifications/${id}`, { isActive }),
    onSuccess: invalidate,
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/notifications/${id}`),
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
        {isLoading ? <div className="text-center py-8 text-gray-400 text-sm">Loading...</div> : (notifs as Notification[]).map(n => (
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

// ─── Analytics Tab ───────────────────────────────────────────────────────────

function AnalyticsTab() {
  const { data: analytics } = useQuery<any[]>({ queryKey: ["/api/admin/analytics"] });
  const { data: summary } = useQuery<any>({ queryKey: ["/api/admin/analytics/summary"] });

  const eventTypes = analytics ? Object.entries(
    (analytics as any[]).reduce((acc: any, e: any) => { acc[e.eventType] = (acc[e.eventType] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name, value })) : [];

  const timeData = analytics ? (() => {
    const grouped: Record<string, number> = {};
    (analytics as any[]).forEach((e: any) => {
      const d = new Date(e.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
      grouped[d] = (grouped[d] || 0) + 1;
    });
    return Object.entries(grouped).slice(-14).map(([date, count]) => ({ date, count }));
  })() : [];

  const COLORS = ["#4f46e5", "#7c3aed", "#2563eb", "#059669", "#d97706", "#dc2626"];

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-gray-900">Analytics</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Events"  value={summary?.totalEvents ?? 0} icon={BarChart2} color="bg-indigo-500" />
        <StatCard label="Page Views"    value={summary?.pageViews ?? 0}   icon={Eye}       color="bg-blue-500" />
        <StatCard label="Last 7 days"   value={summary?.lastWeek ?? 0}    icon={RefreshCw} color="bg-green-500" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4 text-sm">Events Over Time</h3>
          {timeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">No analytics data yet</div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4 text-sm">Event Types</h3>
          {eventTypes.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={eventTypes} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name"
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                  {eventTypes.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">No event data yet</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Export Tab ───────────────────────────────────────────────────────────────

function ExportTab() {
  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-gray-900">Export Data</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { title: "Contact Messages",  desc: "Download all contact form submissions as CSV", url: "/api/admin/export/contacts", filename: "contacts.csv" },
          { title: "Reviews & Ratings", desc: "Download all submitted reviews as CSV",        url: "/api/admin/export/reviews",  filename: "reviews.csv" },
        ].map(({ title, desc, url, filename }) => (
          <div key={title} className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
            </div>
            <a href={url} download={filename}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors">
              <Download size={14} /> Download CSV
            </a>
          </div>
        ))}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900">Resume PDF</h3>
            <p className="text-sm text-gray-500 mt-0.5">Open the resume page and use Ctrl+P to save as PDF</p>
          </div>
          <a href="/api/resume" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
            <Eye size={14} /> View Resume
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");

  const pwMut = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/change-password", { currentPassword: pwForm.current, newPassword: pwForm.next }),
    onSuccess: () => { setPwForm({ current: "", next: "", confirm: "" }); toast({ title: "Password changed successfully" }); },
    onError: (e: any) => { setPwError(e?.message || "Failed to change password"); },
  });

  const seedMut = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/seed"),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/projects/all"] }); toast({ title: "Default data seeded" }); },
    onError: () => toast({ title: "Seeding failed", variant: "destructive" }),
  });

  const submitPw = () => {
    setPwError("");
    if (pwForm.next !== pwForm.confirm) { setPwError("Passwords do not match"); return; }
    if (pwForm.next.length < 6) { setPwError("Password must be at least 6 characters"); return; }
    pwMut.mutate();
  };

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-gray-900">Settings</h2>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 max-w-md">
        <div className="flex items-center gap-2">
          <Key size={16} className="text-gray-500" />
          <h3 className="font-semibold text-gray-900">Change Admin Password</h3>
        </div>
        <div className="space-y-3">
          {([["current", "Current Password"], ["next", "New Password"], ["confirm", "Confirm New Password"]] as [string, string][]).map(([key, label]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
              <input type="password" value={(pwForm as any)[key]} onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900" />
            </div>
          ))}
          {pwError && <div className="flex items-center gap-1.5 text-xs text-red-600"><AlertCircle size={12} />{pwError}</div>}
          <Btn onClick={submitPw} disabled={!pwForm.current || !pwForm.next || !pwForm.confirm || pwMut.isPending}>
            {pwMut.isPending && <Loader2 size={13} className="animate-spin" />} Change Password
          </Btn>
          <p className="text-xs text-gray-400">For a permanent change, set ADMIN_PASSWORD environment variable.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 max-w-md">
        <h3 className="font-semibold text-gray-900">Seed Default Projects</h3>
        <p className="text-sm text-gray-500">Populate the database with sample portfolio projects if it's empty.</p>
        <Btn variant="outline" onClick={() => { if (confirm("Add default projects to the database?")) seedMut.mutate(); }} disabled={seedMut.isPending}>
          {seedMut.isPending ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} Seed Projects
        </Btn>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 max-w-md">
        <h3 className="font-semibold text-blue-900 text-sm mb-2">Default Admin Credentials</h3>
        <p className="text-xs text-blue-700 leading-relaxed">
          Email: <code className="bg-blue-100 px-1 rounded">admin@portfolio.com</code><br />
          Password: <code className="bg-blue-100 px-1 rounded">admin123</code><br /><br />
          Set <code className="bg-blue-100 px-1 rounded">ADMIN_EMAIL</code> and <code className="bg-blue-100 px-1 rounded">ADMIN_PASSWORD</code> in environment variables to change permanently.
        </p>
      </div>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────

function LoginPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ email: "admin@portfolio.com", password: "" });
  const [error, setError] = useState("");

  const loginMut = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/login", form),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/auth/user"] }),
    onError: () => setError("Invalid credentials. Try admin@portfolio.com / admin123"),
  });

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
              onKeyDown={e => { if (e.key === "Enter") loginMut.mutate(); }}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-900" />
          </div>
          <button onClick={() => loginMut.mutate()} disabled={!form.email || !form.password || loginMut.isPending}
            className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loginMut.isPending && <Loader2 size={14} className="animate-spin" />}
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
    mutationFn: () => apiRequest("POST", "/api/admin/logout"),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/auth/user"] }); toast({ title: "Logged out" }); },
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
    reviews:       <ReviewsTab />,
    messages:      <MessagesTab />,
    certificates:  <CertificatesTab />,
    notifications: <NotificationsTab />,
    analytics:     <AnalyticsTab />,
    export:        <ExportTab />,
    settings:      <SettingsTab />,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
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
