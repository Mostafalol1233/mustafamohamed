import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { supabase } from "@/lib/supabase";
import type { DbProject, DbReview, DbMessage, DbCertificate, DbNotification } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import {
  Star, Mail, FolderGit2, Award, Bell, LayoutDashboard,
  LogOut, Check, Trash2, Eye, EyeOff, TrendingUp, MessageSquare,
  Plus, Edit, ExternalLink,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ── Form schemas ─────────────────────────────────────────────────────────────

const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  technologiesInput: z.string().optional(),
  liveUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  isVisible: z.boolean().default(true),
});

const certificateFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  issueDate: z.string().optional(),
  imageUrl: z.string().optional(),
  isVisible: z.boolean().default(true),
});

const notificationFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  type: z.enum(["info", "warning", "success", "error"]),
  isActive: z.boolean().default(true),
});

// ── Query keys ────────────────────────────────────────────────────────────────

const QK = {
  projects: ["sb", "projects"],
  reviews: ["sb", "reviews"],
  messages: ["sb", "messages"],
  certificates: ["sb", "certificates"],
  notifications: ["sb", "notifications"],
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<DbProject | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);

  // ── Auth check (Express session stays) ───────────────────────────────────
  const { data: authData, isLoading: authLoading } = useQuery<{ isAuthenticated: boolean; isAdmin: boolean }>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  useEffect(() => {
    if (!authLoading && (!authData?.isAuthenticated || !authData?.isAdmin)) {
      setLocation("/admin/login");
    }
  }, [authData, authLoading, setLocation]);

  // ── Supabase queries ──────────────────────────────────────────────────────
  const { data: projects = [], refetch: refetchProjects } = useQuery<DbProject[]>({
    queryKey: QK.projects,
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!authData?.isAuthenticated,
  });

  const { data: allReviews = [], refetch: refetchReviews } = useQuery<DbReview[]>({
    queryKey: QK.reviews,
    queryFn: async () => {
      const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!authData?.isAuthenticated,
  });

  const { data: contactMessages = [], refetch: refetchMessages } = useQuery<DbMessage[]>({
    queryKey: QK.messages,
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!authData?.isAuthenticated,
  });

  const { data: certificates = [], refetch: refetchCertificates } = useQuery<DbCertificate[]>({
    queryKey: QK.certificates,
    queryFn: async () => {
      const { data, error } = await supabase.from("certificates").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!authData?.isAuthenticated,
  });

  const { data: notifications = [], refetch: refetchNotifications } = useQuery<DbNotification[]>({
    queryKey: QK.notifications,
    queryFn: async () => {
      const { data, error } = await supabase.from("notifications").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!authData?.isAuthenticated,
  });

  // ── Forms ─────────────────────────────────────────────────────────────────
  const projectForm = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: { title: "", description: "", technologiesInput: "", liveUrl: "", githubUrl: "", imageUrl: "", isVisible: true },
  });

  const certificateForm = useForm<z.infer<typeof certificateFormSchema>>({
    resolver: zodResolver(certificateFormSchema),
    defaultValues: { title: "", description: "", issueDate: "", imageUrl: "", isVisible: true },
  });

  const notificationForm = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: { title: "", message: "", type: "info", isActive: true },
  });

  // ── Logout ────────────────────────────────────────────────────────────────
  const logoutMutation = useMutation({
    mutationFn: async () => { await apiRequest("POST", "/api/admin/logout"); },
    onSuccess: () => { toast({ title: "Logged out" }); setLocation("/admin/login"); },
  });

  // ── Project mutations ─────────────────────────────────────────────────────
  const createProjectMutation = useMutation({
    mutationFn: async (d: z.infer<typeof projectFormSchema>) => {
      const { error } = await supabase.from("projects").insert({
        title: d.title,
        description: d.description,
        technologies: d.technologiesInput ? d.technologiesInput.split(",").map(t => t.trim()).filter(Boolean) : [],
        live_url: d.liveUrl || null,
        github_url: d.githubUrl || null,
        image_url: d.imageUrl || null,
        is_visible: d.isVisible,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      refetchProjects();
      queryClient.invalidateQueries({ queryKey: ["sb", "projects", "visible"] });
      toast({ title: "Project created!" });
      setProjectDialogOpen(false);
      setImagePreview("");
      projectForm.reset();
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, d }: { id: number; d: z.infer<typeof projectFormSchema> }) => {
      const { error } = await supabase.from("projects").update({
        title: d.title,
        description: d.description,
        technologies: d.technologiesInput ? d.technologiesInput.split(",").map(t => t.trim()).filter(Boolean) : [],
        live_url: d.liveUrl || null,
        github_url: d.githubUrl || null,
        image_url: d.imageUrl || null,
        is_visible: d.isVisible,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      refetchProjects();
      queryClient.invalidateQueries({ queryKey: ["sb", "projects", "visible"] });
      toast({ title: "Project updated!" });
      setProjectDialogOpen(false);
      setEditingProject(null);
      setImagePreview("");
      projectForm.reset();
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      refetchProjects();
      queryClient.invalidateQueries({ queryKey: ["sb", "projects", "visible"] });
      toast({ title: "Project deleted!" });
    },
  });

  const toggleProjectVisibilityMutation = useMutation({
    mutationFn: async ({ id, is_visible }: { id: number; is_visible: boolean }) => {
      const { error } = await supabase.from("projects").update({ is_visible }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      refetchProjects();
      queryClient.invalidateQueries({ queryKey: ["sb", "projects", "visible"] });
      toast({ title: "Visibility updated!" });
    },
  });

  // ── Review mutations ──────────────────────────────────────────────────────
  const approveReviewMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("reviews").update({ is_approved: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { refetchReviews(); toast({ title: "Review approved!" }); },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { refetchReviews(); toast({ title: "Review deleted!" }); },
  });

  // ── Message mutations ─────────────────────────────────────────────────────
  const markMessageReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { refetchMessages(); toast({ title: "Marked as read!" }); },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { refetchMessages(); toast({ title: "Message deleted!" }); },
  });

  // ── Certificate mutations ─────────────────────────────────────────────────
  const createCertificateMutation = useMutation({
    mutationFn: async (d: z.infer<typeof certificateFormSchema>) => {
      const { error } = await supabase.from("certificates").insert({
        title: d.title,
        description: d.description || null,
        issue_date: d.issueDate || null,
        image_url: d.imageUrl || null,
        is_visible: d.isVisible,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      refetchCertificates();
      queryClient.invalidateQueries({ queryKey: ["sb", "certificates"] });
      toast({ title: "Certificate created!" });
      setCertificateDialogOpen(false);
      certificateForm.reset();
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteCertificateMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("certificates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      refetchCertificates();
      queryClient.invalidateQueries({ queryKey: ["sb", "certificates"] });
      toast({ title: "Certificate deleted!" });
    },
  });

  const toggleCertificateVisibilityMutation = useMutation({
    mutationFn: async ({ id, is_visible }: { id: number; is_visible: boolean }) => {
      const { error } = await supabase.from("certificates").update({ is_visible }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { refetchCertificates(); toast({ title: "Visibility updated!" }); },
  });

  // ── Notification mutations ────────────────────────────────────────────────
  const createNotificationMutation = useMutation({
    mutationFn: async (d: z.infer<typeof notificationFormSchema>) => {
      const { error } = await supabase.from("notifications").insert({
        title: d.title,
        message: d.message,
        type: d.type,
        is_active: d.isActive,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      refetchNotifications();
      queryClient.invalidateQueries({ queryKey: ["sb", "notifications", "active"] });
      toast({ title: "Notification created!" });
      setNotificationDialogOpen(false);
      notificationForm.reset();
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const toggleNotificationMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: number; is_active: boolean }) => {
      const { error } = await supabase.from("notifications").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      refetchNotifications();
      queryClient.invalidateQueries({ queryKey: ["sb", "notifications", "active"] });
      toast({ title: "Notification updated!" });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("notifications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      refetchNotifications();
      queryClient.invalidateQueries({ queryKey: ["sb", "notifications", "active"] });
      toast({ title: "Notification deleted!" });
    },
  });

  // ── Helpers ───────────────────────────────────────────────────────────────
  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ));

  const handleEditProject = (p: DbProject) => {
    setEditingProject(p);
    setImagePreview(p.image_url || "");
    projectForm.reset({
      title: p.title,
      description: p.description,
      technologiesInput: p.technologies?.join(", ") || "",
      liveUrl: p.live_url || "",
      githubUrl: p.github_url || "",
      imageUrl: p.image_url || "",
      isVisible: p.is_visible,
    });
    setProjectDialogOpen(true);
  };

  const handleProjectSubmit = (values: z.infer<typeof projectFormSchema>) => {
    if (editingProject) {
      updateProjectMutation.mutate({ id: editingProject.id, d: values });
    } else {
      createProjectMutation.mutate(values);
    }
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = {
    pendingReviews: allReviews.filter(r => !r.is_approved).length,
    approvedReviews: allReviews.filter(r => r.is_approved).length,
    unreadMessages: contactMessages.filter(m => !m.is_read).length,
    visibleProjects: projects.filter(p => p.is_visible).length,
    activeNotifications: notifications.filter(n => n.is_active).length,
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!authData?.isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" data-testid="text-dashboard-title">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">Supabase · Manage your portfolio content</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setLocation("/")} className="text-xs">
              ← Back to site
            </Button>
            <Button onClick={() => logoutMutation.mutate()} variant="outline" disabled={logoutMutation.isPending} data-testid="button-logout">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 lg:w-auto" data-testid="tabs-navigation">
            <TabsTrigger value="overview"><LayoutDashboard className="w-4 h-4 mr-2" />Overview</TabsTrigger>
            <TabsTrigger value="projects">
              <FolderGit2 className="w-4 h-4 mr-2" />Projects
              <Badge variant="secondary" className="ml-1">{projects.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <Star className="w-4 h-4 mr-2" />Reviews
              {stats.pendingReviews > 0 && <Badge variant="destructive" className="ml-1">{stats.pendingReviews}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="messages">
              <Mail className="w-4 h-4 mr-2" />Messages
              {stats.unreadMessages > 0 && <Badge variant="destructive" className="ml-1">{stats.unreadMessages}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="certificates"><Award className="w-4 h-4 mr-2" />Certificates</TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />Notifications
              {stats.activeNotifications > 0 && <Badge variant="secondary" className="ml-1">{stats.activeNotifications}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="analytics"><TrendingUp className="w-4 h-4 mr-2" />Analytics</TabsTrigger>
          </TabsList>

          {/* ── OVERVIEW ── */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: "Projects", value: projects.length, sub: `${stats.visibleProjects} visible`, color: "text-blue-600", Icon: FolderGit2 },
                { label: "Reviews", value: allReviews.length, sub: `${stats.pendingReviews} pending`, color: "text-green-600", Icon: Star },
                { label: "Messages", value: contactMessages.length, sub: `${stats.unreadMessages} unread`, color: "text-purple-600", Icon: MessageSquare },
                { label: "Certificates", value: certificates.length, sub: "total", color: "text-orange-600", Icon: Award },
                { label: "Notifications", value: notifications.length, sub: `${stats.activeNotifications} active`, color: "text-red-600", Icon: Bell },
                { label: "Approved", value: stats.approvedReviews, sub: "reviews live", color: "text-teal-600", Icon: Check },
              ].map(({ label, value, sub, color, Icon }) => (
                <Card key={label}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${color}`} />{label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${color}`}>{value}</div>
                    <p className="text-xs text-muted-foreground mt-1">{sub}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" onClick={() => { setEditingProject(null); projectForm.reset(); setProjectDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" />Add New Project
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => { certificateForm.reset(); setCertificateDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" />Add Certificate
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => { notificationForm.reset(); setNotificationDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" />Create Notification
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Latest Review</span>
                    <span className="text-muted-foreground">{allReviews[0] ? formatDate(allReviews[0].created_at) : "None"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Latest Message</span>
                    <span className="text-muted-foreground">{contactMessages[0] ? formatDate(contactMessages[0].created_at) : "None"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Latest Project</span>
                    <span className="text-muted-foreground">{projects[0] ? formatDate(projects[0].created_at) : "None"}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── PROJECTS ── */}
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center"><FolderGit2 className="w-5 h-5 mr-2 text-blue-500" />Projects</CardTitle>
                    <CardDescription>{projects.length} total · {stats.visibleProjects} visible on site</CardDescription>
                  </div>
                  <Button onClick={() => { setEditingProject(null); projectForm.reset(); setImagePreview(""); setProjectDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" />Add Project
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projects.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No projects yet. Add one!</p>
                  ) : projects.map((p) => (
                    <div key={p.id} className="border rounded-lg p-4 flex gap-4 items-start" data-testid={`card-project-${p.id}`}>
                      {p.image_url && (
                        <img src={p.image_url} alt={p.title} className="w-16 h-12 object-cover rounded flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold">{p.title}</h4>
                          <Badge variant={p.is_visible ? "default" : "secondary"}>
                            {p.is_visible ? "Visible" : "Hidden"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {p.technologies?.map(t => (
                            <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                          ))}
                        </div>
                        <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                          {p.live_url && <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary"><ExternalLink className="w-3 h-3" />Live</a>}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        <Button size="sm" variant="outline" onClick={() => handleEditProject(p)} data-testid={`button-edit-project-${p.id}`}>
                          <Edit className="w-3 h-3 mr-1" />Edit
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => toggleProjectVisibilityMutation.mutate({ id: p.id, is_visible: !p.is_visible })} data-testid={`button-toggle-project-${p.id}`}>
                          {p.is_visible ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                          {p.is_visible ? "Hide" : "Show"}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteProjectMutation.mutate(p.id)} data-testid={`button-delete-project-${p.id}`}>
                          <Trash2 className="w-3 h-3 mr-1" />Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── REVIEWS ── */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Star className="w-5 h-5 mr-2 text-yellow-500" />Reviews</CardTitle>
                <CardDescription>{allReviews.length} total · {stats.pendingReviews} pending · {stats.approvedReviews} approved</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allReviews.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No reviews yet.</p>
                  ) : allReviews.map((r) => (
                    <div key={r.id} className="border rounded-lg p-4 space-y-2" data-testid={`card-review-${r.id}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold">{r.name}</span>
                            {r.email && <span className="text-xs text-muted-foreground">{r.email}</span>}
                            <Badge variant={r.is_approved ? "default" : "secondary"}>
                              {r.is_approved ? "Approved" : "Pending"}
                            </Badge>
                          </div>
                          <div className="flex mt-1">{renderStars(r.rating)}</div>
                          <p className="text-sm mt-1">{r.comment}</p>
                          <p className="text-xs text-muted-foreground mt-1">{formatDate(r.created_at)}</p>
                        </div>
                        <div className="flex flex-col gap-1 ml-3">
                          {!r.is_approved && (
                            <Button size="sm" onClick={() => approveReviewMutation.mutate(r.id)} disabled={approveReviewMutation.isPending} data-testid={`button-approve-review-${r.id}`}>
                              <Check className="w-3 h-3 mr-1" />Approve
                            </Button>
                          )}
                          <Button size="sm" variant="destructive" onClick={() => deleteReviewMutation.mutate(r.id)} disabled={deleteReviewMutation.isPending} data-testid={`button-delete-review-${r.id}`}>
                            <Trash2 className="w-3 h-3 mr-1" />Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── MESSAGES ── */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Mail className="w-5 h-5 mr-2 text-green-500" />Contact Messages</CardTitle>
                <CardDescription>{contactMessages.length} total · {stats.unreadMessages} unread</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contactMessages.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No messages yet.</p>
                  ) : contactMessages.map((m) => (
                    <div key={m.id} className={`border rounded-lg p-4 space-y-1 ${!m.is_read ? "border-blue-200 bg-blue-50/40" : ""}`} data-testid={`card-message-${m.id}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold">{m.name}</span>
                            <span className="text-xs text-muted-foreground">{m.email}</span>
                            {!m.is_read && <Badge variant="secondary" className="text-xs">Unread</Badge>}
                          </div>
                          {m.subject && <p className="text-sm font-medium mt-0.5">{m.subject}</p>}
                          <p className="text-sm text-muted-foreground mt-1">{m.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{formatDate(m.created_at)}</p>
                        </div>
                        <div className="flex flex-col gap-1 ml-3">
                          {!m.is_read && (
                            <Button size="sm" variant="outline" onClick={() => markMessageReadMutation.mutate(m.id)} data-testid={`button-read-message-${m.id}`}>
                              <Check className="w-3 h-3 mr-1" />Mark Read
                            </Button>
                          )}
                          <Button size="sm" variant="destructive" onClick={() => deleteMessageMutation.mutate(m.id)} data-testid={`button-delete-message-${m.id}`}>
                            <Trash2 className="w-3 h-3 mr-1" />Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── CERTIFICATES ── */}
          <TabsContent value="certificates">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center"><Award className="w-5 h-5 mr-2 text-orange-500" />Certificates</CardTitle>
                    <CardDescription>{certificates.length} total</CardDescription>
                  </div>
                  <Button onClick={() => { certificateForm.reset(); setCertificateDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" />Add Certificate
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {certificates.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No certificates yet.</p>
                  ) : certificates.map((c) => (
                    <div key={c.id} className="border rounded-lg p-4 flex gap-4 items-start" data-testid={`card-certificate-${c.id}`}>
                      {c.image_url && <img src={c.image_url} alt={c.title} className="w-16 h-12 object-cover rounded flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{c.title}</h4>
                          <Badge variant={c.is_visible ? "default" : "secondary"}>{c.is_visible ? "Visible" : "Hidden"}</Badge>
                        </div>
                        {c.description && <p className="text-sm text-muted-foreground mt-1">{c.description}</p>}
                        {c.issue_date && <p className="text-xs text-muted-foreground mt-1">Issued: {c.issue_date}</p>}
                      </div>
                      <div className="flex flex-col gap-1">
                        <Button size="sm" variant="outline" onClick={() => toggleCertificateVisibilityMutation.mutate({ id: c.id, is_visible: !c.is_visible })} data-testid={`button-toggle-cert-${c.id}`}>
                          {c.is_visible ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                          {c.is_visible ? "Hide" : "Show"}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteCertificateMutation.mutate(c.id)} data-testid={`button-delete-certificate-${c.id}`}>
                          <Trash2 className="w-3 h-3 mr-1" />Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── NOTIFICATIONS ── */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center"><Bell className="w-5 h-5 mr-2 text-red-500" />Notifications</CardTitle>
                    <CardDescription>{notifications.length} total · {stats.activeNotifications} active</CardDescription>
                  </div>
                  <Button onClick={() => { notificationForm.reset(); setNotificationDialogOpen(true); }} data-testid="button-create-notification">
                    <Plus className="w-4 h-4 mr-2" />Create New
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No notifications yet.</p>
                  ) : notifications.map((n) => (
                    <div key={n.id} className="border rounded-lg p-4" data-testid={`card-notification-${n.id}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold">{n.title}</h4>
                            <Badge variant={n.type === "error" ? "destructive" : n.type === "warning" ? "secondary" : "outline"}>{n.type}</Badge>
                            <Badge variant={n.is_active ? "default" : "secondary"}>{n.is_active ? "Active" : "Inactive"}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{formatDate(n.created_at)}</p>
                        </div>
                        <div className="flex gap-1 ml-3">
                          <Button size="sm" variant="outline" onClick={() => toggleNotificationMutation.mutate({ id: n.id, is_active: !n.is_active })} data-testid={`button-toggle-notification-${n.id}`}>
                            {n.is_active ? "Deactivate" : "Activate"}
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteNotificationMutation.mutate(n.id)} data-testid={`button-delete-notification-${n.id}`}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── ANALYTICS ── */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-teal-500" />Site Statistics</CardTitle>
                  <CardDescription>Live data from Supabase</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Total Projects", value: projects.length, bg: "bg-blue-50", color: "text-blue-700" },
                      { label: "Live Projects", value: stats.visibleProjects, bg: "bg-green-50", color: "text-green-700" },
                      { label: "Total Reviews", value: allReviews.length, bg: "bg-purple-50", color: "text-purple-700" },
                      { label: "Approved Reviews", value: stats.approvedReviews, bg: "bg-yellow-50", color: "text-yellow-700" },
                      { label: "Contact Messages", value: contactMessages.length, bg: "bg-orange-50", color: "text-orange-700" },
                      { label: "Unread Messages", value: stats.unreadMessages, bg: "bg-red-50", color: "text-red-700" },
                      { label: "Certificates", value: certificates.length, bg: "bg-teal-50", color: "text-teal-700" },
                      { label: "Active Banners", value: stats.activeNotifications, bg: "bg-pink-50", color: "text-pink-700" },
                    ].map(({ label, value, bg, color }) => (
                      <div key={label} className={`${bg} rounded-lg p-4`}>
                        <div className="text-xs text-muted-foreground mb-1">{label}</div>
                        <div className={`text-2xl font-bold ${color}`}>{value}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Recent Reviews</CardTitle></CardHeader>
                <CardContent>
                  {allReviews.slice(0, 5).map((r) => (
                    <div key={r.id} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <span className="font-medium text-sm">{r.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">{r.comment.slice(0, 60)}...</span>
                      </div>
                      <Badge variant={r.is_approved ? "default" : "secondary"} className="text-xs">{r.is_approved ? "Approved" : "Pending"}</Badge>
                    </div>
                  ))}
                  {allReviews.length === 0 && <p className="text-muted-foreground text-sm py-4 text-center">No reviews yet.</p>}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ── PROJECT DIALOG ── */}
      <Dialog open={projectDialogOpen} onOpenChange={(open) => {
        setProjectDialogOpen(open);
        if (!open) { setEditingProject(null); setImagePreview(""); projectForm.reset(); }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-project">
          <DialogHeader>
            <DialogTitle data-testid="text-project-dialog-title">{editingProject ? "Edit Project" : "Create New Project"}</DialogTitle>
            <DialogDescription>{editingProject ? "Update project details." : "Fill in the project details."}</DialogDescription>
          </DialogHeader>
          <Form {...projectForm}>
            <form onSubmit={projectForm.handleSubmit(handleProjectSubmit)} className="space-y-4">
              <FormField control={projectForm.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title *</FormLabel><FormControl><Input placeholder="Project Title" {...field} data-testid="input-project-title" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={projectForm.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description *</FormLabel><FormControl><Textarea placeholder="Project description" {...field} rows={3} data-testid="input-project-description" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={projectForm.control} name="technologiesInput" render={({ field }) => (
                <FormItem><FormLabel>Technologies</FormLabel><FormControl><Input placeholder="React, TypeScript, Node.js" {...field} data-testid="input-project-technologies" /></FormControl><FormDescription>Comma-separated</FormDescription><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={projectForm.control} name="liveUrl" render={({ field }) => (
                  <FormItem><FormLabel>Live URL</FormLabel><FormControl><Input placeholder="https://example.com" {...field} data-testid="input-project-liveurl" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={projectForm.control} name="githubUrl" render={({ field }) => (
                  <FormItem><FormLabel>GitHub URL</FormLabel><FormControl><Input placeholder="https://github.com/..." {...field} data-testid="input-project-githuburl" /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={projectForm.control} name="imageUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field}
                      onChange={(e) => { field.onChange(e); setImagePreview(e.target.value); }}
                      data-testid="input-project-imageurl" />
                  </FormControl>
                  {imagePreview && <img src={imagePreview} alt="preview" className="w-full h-32 object-cover rounded-md mt-2" onError={() => setImagePreview("")} />}
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={projectForm.control} name="isVisible" render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} data-testid="checkbox-project-visible" /></FormControl>
                  <FormLabel className="cursor-pointer">Visible on portfolio</FormLabel>
                </FormItem>
              )} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setProjectDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createProjectMutation.isPending || updateProjectMutation.isPending} data-testid="button-submit-project">
                  {createProjectMutation.isPending || updateProjectMutation.isPending ? "Saving..." : editingProject ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* ── CERTIFICATE DIALOG ── */}
      <Dialog open={certificateDialogOpen} onOpenChange={(open) => { setCertificateDialogOpen(open); if (!open) certificateForm.reset(); }}>
        <DialogContent className="max-w-lg" data-testid="dialog-certificate">
          <DialogHeader>
            <DialogTitle>Add Certificate</DialogTitle>
            <DialogDescription>Fill in the certificate details.</DialogDescription>
          </DialogHeader>
          <Form {...certificateForm}>
            <form onSubmit={certificateForm.handleSubmit((v) => createCertificateMutation.mutate(v))} className="space-y-4">
              <FormField control={certificateForm.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title *</FormLabel><FormControl><Input placeholder="Certificate Title" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={certificateForm.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Description" {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={certificateForm.control} name="issueDate" render={({ field }) => (
                  <FormItem><FormLabel>Issue Date</FormLabel><FormControl><Input placeholder="January 2024" {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={certificateForm.control} name="imageUrl" render={({ field }) => (
                  <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://..." {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={certificateForm.control} name="isVisible" render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <FormLabel className="cursor-pointer">Visible on portfolio</FormLabel>
                </FormItem>
              )} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCertificateDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createCertificateMutation.isPending}>
                  {createCertificateMutation.isPending ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* ── NOTIFICATION DIALOG ── */}
      <Dialog open={notificationDialogOpen} onOpenChange={(open) => { setNotificationDialogOpen(open); if (!open) notificationForm.reset(); }}>
        <DialogContent className="max-w-lg" data-testid="dialog-notification">
          <DialogHeader>
            <DialogTitle>Create Notification</DialogTitle>
            <DialogDescription>Banner shown to all site visitors.</DialogDescription>
          </DialogHeader>
          <Form {...notificationForm}>
            <form onSubmit={notificationForm.handleSubmit((v) => createNotificationMutation.mutate(v))} className="space-y-4">
              <FormField control={notificationForm.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title *</FormLabel><FormControl><Input placeholder="Notification Title" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={notificationForm.control} name="message" render={({ field }) => (
                <FormItem><FormLabel>Message *</FormLabel><FormControl><Textarea placeholder="Notification message" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={notificationForm.control} name="type" render={({ field }) => (
                <FormItem><FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={notificationForm.control} name="isActive" render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <FormLabel className="cursor-pointer">Active (show to visitors)</FormLabel>
                </FormItem>
              )} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setNotificationDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createNotificationMutation.isPending}>
                  {createNotificationMutation.isPending ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
