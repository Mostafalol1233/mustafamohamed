import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { supabase } from "@/lib/supabase";
import type { DbProject, DbReview, DbMessage, DbCertificate, DbNotification, DbTestimonial, DbSkill, DbSiteSetting } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import {
  Star, Mail, FolderGit2, Award, Bell, LayoutDashboard,
  LogOut, Check, Trash2, Eye, EyeOff, TrendingUp, MessageSquare,
  Plus, Edit, ExternalLink, Users, Wrench, Settings, Save,
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

const testimonialFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company is required"),
  quote: z.string().min(1, "Quote is required"),
  stars: z.coerce.number().min(1).max(5).default(5),
  icon: z.string().optional(),
  visible: z.boolean().default(true),
});

// ── Query keys ────────────────────────────────────────────────────────────────

const QK = {
  projects: ["sb", "projects"],
  reviews: ["sb", "reviews"],
  messages: ["sb", "messages"],
  certificates: ["sb", "certificates"],
  notifications: ["sb", "notifications"],
  testimonials: ["sb", "testimonials"],
  skills: ["sb", "skills"],
  siteSettings: ["sb", "site_settings"],
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
  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<DbTestimonial | null>(null);
  const [editingSkillId, setEditingSkillId] = useState<number | null>(null);
  const [editingSkillPercent, setEditingSkillPercent] = useState<number>(0);
  const [editingSettingKey, setEditingSettingKey] = useState<string | null>(null);
  const [editingSettingValue, setEditingSettingValue] = useState<string>("");

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

  const { data: testimonials = [], refetch: refetchTestimonials } = useQuery<DbTestimonial[]>({
    queryKey: QK.testimonials,
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!authData?.isAuthenticated,
  });

  const { data: skills = [], refetch: refetchSkills } = useQuery<DbSkill[]>({
    queryKey: QK.skills,
    queryFn: async () => {
      const { data, error } = await supabase.from("skills").select("*").order("sort_order");
      if (error) throw error;
      return data || [];
    },
    enabled: !!authData?.isAuthenticated,
  });

  const { data: siteSettings = [], refetch: refetchSettings } = useQuery<DbSiteSetting[]>({
    queryKey: QK.siteSettings,
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").order("key");
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

  const testimonialForm = useForm<z.infer<typeof testimonialFormSchema>>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: { name: "", role: "", company: "", quote: "", stars: 5, icon: "", visible: true },
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

  // ── Testimonial mutations ─────────────────────────────────────────────────
  const createTestimonialMutation = useMutation({
    mutationFn: async (d: z.infer<typeof testimonialFormSchema>) => {
      const { error } = await supabase.from("testimonials").insert({
        name: d.name, role: d.role, company: d.company, quote: d.quote,
        stars: d.stars, icon: d.icon || null, visible: d.visible,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      refetchTestimonials();
      toast({ title: "Testimonial added!" });
      setTestimonialDialogOpen(false);
      testimonialForm.reset();
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateTestimonialMutation = useMutation({
    mutationFn: async ({ id, d }: { id: number; d: z.infer<typeof testimonialFormSchema> }) => {
      const { error } = await supabase.from("testimonials").update({
        name: d.name, role: d.role, company: d.company, quote: d.quote,
        stars: d.stars, icon: d.icon || null, visible: d.visible,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      refetchTestimonials();
      toast({ title: "Testimonial updated!" });
      setTestimonialDialogOpen(false);
      setEditingTestimonial(null);
      testimonialForm.reset();
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { refetchTestimonials(); toast({ title: "Testimonial deleted!" }); },
  });

  const toggleTestimonialVisibilityMutation = useMutation({
    mutationFn: async ({ id, visible }: { id: number; visible: boolean }) => {
      const { error } = await supabase.from("testimonials").update({ visible }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { refetchTestimonials(); toast({ title: "Visibility updated!" }); },
  });

  // ── Skill mutation ────────────────────────────────────────────────────────
  const updateSkillPercentMutation = useMutation({
    mutationFn: async ({ id, percent }: { id: number; percent: number }) => {
      const { error } = await supabase.from("skills").update({ percent }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      refetchSkills();
      setEditingSkillId(null);
      toast({ title: "Skill updated!" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  // ── Site settings mutation ────────────────────────────────────────────────
  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { error } = await supabase.from("site_settings").update({ value, updated_at: new Date().toISOString() }).eq("key", key);
      if (error) throw error;
    },
    onSuccess: () => {
      refetchSettings();
      setEditingSettingKey(null);
      toast({ title: "Setting saved!" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  // ── Helpers ───────────────────────────────────────────────────────────────
  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ));

  const handleEditTestimonial = (t: DbTestimonial) => {
    setEditingTestimonial(t);
    testimonialForm.reset({
      name: t.name, role: t.role, company: t.company, quote: t.quote,
      stars: t.stars, icon: t.icon || "", visible: t.visible,
    });
    setTestimonialDialogOpen(true);
  };

  const handleTestimonialSubmit = (values: z.infer<typeof testimonialFormSchema>) => {
    if (editingTestimonial) {
      updateTestimonialMutation.mutate({ id: editingTestimonial.id, d: values });
    } else {
      createTestimonialMutation.mutate(values);
    }
  };

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
    visibleTestimonials: testimonials.filter(t => t.visible).length,
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
          <TabsList className="flex flex-wrap gap-1 h-auto w-full justify-start" data-testid="tabs-navigation">
            <TabsTrigger value="overview"><LayoutDashboard className="w-4 h-4 mr-1.5" />Overview</TabsTrigger>
            <TabsTrigger value="projects">
              <FolderGit2 className="w-4 h-4 mr-1.5" />Projects
              <Badge variant="secondary" className="ml-1">{projects.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="testimonials">
              <Users className="w-4 h-4 mr-1.5" />Testimonials
              <Badge variant="secondary" className="ml-1">{testimonials.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <Star className="w-4 h-4 mr-1.5" />Reviews
              {stats.pendingReviews > 0 && <Badge variant="destructive" className="ml-1">{stats.pendingReviews}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="messages">
              <Mail className="w-4 h-4 mr-1.5" />Messages
              {stats.unreadMessages > 0 && <Badge variant="destructive" className="ml-1">{stats.unreadMessages}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="certificates"><Award className="w-4 h-4 mr-1.5" />Certificates</TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-1.5" />Notifications
              {stats.activeNotifications > 0 && <Badge variant="secondary" className="ml-1">{stats.activeNotifications}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="skills"><Wrench className="w-4 h-4 mr-1.5" />Skills</TabsTrigger>
            <TabsTrigger value="settings"><Settings className="w-4 h-4 mr-1.5" />Settings</TabsTrigger>
            <TabsTrigger value="analytics"><TrendingUp className="w-4 h-4 mr-1.5" />Analytics</TabsTrigger>
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

          {/* ── TESTIMONIALS ── */}
          <TabsContent value="testimonials">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center"><Users className="w-5 h-5 mr-2 text-indigo-500" />Testimonials</CardTitle>
                    <CardDescription>{testimonials.length} total · {stats.visibleTestimonials} visible</CardDescription>
                  </div>
                  <Button onClick={() => { setEditingTestimonial(null); testimonialForm.reset({ name: "", role: "", company: "", quote: "", stars: 5, icon: "", visible: true }); setTestimonialDialogOpen(true); }} data-testid="button-add-testimonial">
                    <Plus className="w-4 h-4 mr-2" />Add Testimonial
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {testimonials.length === 0 ? (
                    <div className="text-center py-8 space-y-2">
                      <p className="text-muted-foreground">No testimonials yet.</p>
                      <p className="text-xs text-muted-foreground">Run <code className="bg-gray-100 px-1 rounded">supabase/seed_testimonials.sql</code> in Supabase SQL Editor to populate with existing data.</p>
                    </div>
                  ) : testimonials.map((t) => (
                    <div key={t.id} className="border rounded-lg p-4 flex gap-4 items-start" data-testid={`card-testimonial-${t.id}`}>
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold flex-shrink-0 text-sm">
                        {t.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{t.name}</span>
                          <span className="text-xs text-muted-foreground">{t.role} · {t.company}</span>
                          <Badge variant={t.visible ? "default" : "secondary"}>{t.visible ? "Visible" : "Hidden"}</Badge>
                          <span className="flex gap-0.5">
                            {Array.from({ length: t.stars }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">"{t.quote}"</p>
                      </div>
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        <Button size="sm" variant="outline" onClick={() => handleEditTestimonial(t)} data-testid={`button-edit-testimonial-${t.id}`}>
                          <Edit className="w-3 h-3 mr-1" />Edit
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => toggleTestimonialVisibilityMutation.mutate({ id: t.id, visible: !t.visible })} data-testid={`button-toggle-testimonial-${t.id}`}>
                          {t.visible ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                          {t.visible ? "Hide" : "Show"}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteTestimonialMutation.mutate(t.id)} data-testid={`button-delete-testimonial-${t.id}`}>
                          <Trash2 className="w-3 h-3 mr-1" />Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── SKILLS ── */}
          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Wrench className="w-5 h-5 mr-2 text-amber-500" />Skills Manager</CardTitle>
                <CardDescription>Edit proficiency percentages for each skill. Run <code className="bg-gray-100 px-1 rounded text-xs">supabase/skills_and_settings.sql</code> in Supabase SQL Editor to populate.</CardDescription>
              </CardHeader>
              <CardContent>
                {skills.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No skills found. Run supabase/skills_and_settings.sql in Supabase SQL Editor first.</p>
                ) : (
                  <div className="space-y-8">
                    {["frontend", "backend", "design", "tools", "ai"].map((cat) => {
                      const catSkills = skills.filter(s => s.category === cat);
                      if (!catSkills.length) return null;
                      return (
                        <div key={cat}>
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 capitalize">{cat}</h3>
                          <div className="space-y-2">
                            {catSkills.map((s) => (
                              <div key={s.id} className="flex items-center gap-3 p-3 border rounded-lg" data-testid={`skill-row-admin-${s.id}`}>
                                <span className="w-36 text-sm font-medium truncate flex-shrink-0">{s.name}</span>
                                <div className="flex-1 bg-gray-100 rounded-full h-2 min-w-0">
                                  <div
                                    className="h-2 rounded-full transition-all"
                                    style={{
                                      width: `${s.percent}%`,
                                      background: s.percent >= 80 ? "#3fb950" : s.percent >= 60 ? "#58a6ff" : "#f0c040",
                                    }}
                                  />
                                </div>
                                {editingSkillId === s.id ? (
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <Input
                                      type="number" min={0} max={100}
                                      value={editingSkillPercent}
                                      onChange={(e) => setEditingSkillPercent(Number(e.target.value))}
                                      className="w-20 h-8 text-sm"
                                      data-testid={`input-skill-percent-${s.id}`}
                                    />
                                    <Button size="sm" onClick={() => updateSkillPercentMutation.mutate({ id: s.id, percent: editingSkillPercent })} disabled={updateSkillPercentMutation.isPending} data-testid={`button-save-skill-${s.id}`}>
                                      <Save className="w-3 h-3" />
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setEditingSkillId(null)}>✕</Button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className="w-10 text-sm text-right text-muted-foreground">{s.percent}%</span>
                                    <Button size="sm" variant="outline" onClick={() => { setEditingSkillId(s.id); setEditingSkillPercent(s.percent); }} data-testid={`button-edit-skill-${s.id}`}>
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── SETTINGS ── */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><Settings className="w-5 h-5 mr-2 text-slate-500" />Site Settings</CardTitle>
                  <CardDescription>Manage hero text, social links, and section visibility. Run <code className="bg-gray-100 px-1 rounded text-xs">supabase/skills_and_settings.sql</code> in Supabase SQL Editor to populate.</CardDescription>
                </CardHeader>
                {siteSettings.length === 0 ? (
                  <CardContent><p className="text-center text-muted-foreground py-4">No settings found. Run supabase/skills_and_settings.sql in Supabase SQL Editor first.</p></CardContent>
                ) : (
                  <CardContent className="space-y-8">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Hero Section</h3>
                      <div className="space-y-3">
                        {[
                          { key: "hero_name", label: "Name" },
                          { key: "hero_title", label: "Title" },
                          { key: "hero_tagline", label: "Tagline" },
                          { key: "hero_available", label: "Available badge" },
                        ].map(({ key, label }) => {
                          const s = siteSettings.find(x => x.key === key);
                          if (!s) return null;
                          return (
                            <div key={key} className="flex items-start gap-3">
                              <label className="w-32 text-sm font-medium pt-2 shrink-0">{label}</label>
                              {editingSettingKey === key ? (
                                <div className="flex-1 flex items-center gap-2">
                                  <Input value={editingSettingValue} onChange={(e) => setEditingSettingValue(e.target.value)} className="flex-1" data-testid={`input-setting-${key}`} />
                                  <Button size="sm" onClick={() => updateSettingMutation.mutate({ key, value: editingSettingValue })} disabled={updateSettingMutation.isPending}><Save className="w-3 h-3" /></Button>
                                  <Button size="sm" variant="outline" onClick={() => setEditingSettingKey(null)}>✕</Button>
                                </div>
                              ) : (
                                <div className="flex-1 flex items-center gap-2">
                                  <span className="flex-1 text-sm text-muted-foreground truncate">{s.value}</span>
                                  <Button size="sm" variant="outline" onClick={() => { setEditingSettingKey(key); setEditingSettingValue(s.value); }} data-testid={`button-edit-setting-${key}`}><Edit className="w-3 h-3" /></Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Social Links</h3>
                      <div className="space-y-3">
                        {[
                          { key: "social_twitter", label: "X (Twitter)" },
                          { key: "social_youtube", label: "YouTube" },
                          { key: "social_email", label: "Email" },
                        ].map(({ key, label }) => {
                          const s = siteSettings.find(x => x.key === key);
                          if (!s) return null;
                          return (
                            <div key={key} className="flex items-center gap-3">
                              <label className="w-32 text-sm font-medium shrink-0">{label}</label>
                              {editingSettingKey === key ? (
                                <div className="flex-1 flex items-center gap-2">
                                  <Input value={editingSettingValue} onChange={(e) => setEditingSettingValue(e.target.value)} className="flex-1" data-testid={`input-setting-${key}`} />
                                  <Button size="sm" onClick={() => updateSettingMutation.mutate({ key, value: editingSettingValue })} disabled={updateSettingMutation.isPending}><Save className="w-3 h-3" /></Button>
                                  <Button size="sm" variant="outline" onClick={() => setEditingSettingKey(null)}>✕</Button>
                                </div>
                              ) : (
                                <div className="flex-1 flex items-center gap-2">
                                  <span className="flex-1 text-sm text-muted-foreground truncate">{s.value}</span>
                                  <Button size="sm" variant="outline" onClick={() => { setEditingSettingKey(key); setEditingSettingValue(s.value); }} data-testid={`button-edit-setting-${key}`}><Edit className="w-3 h-3" /></Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Section Visibility</h3>
                      <div className="space-y-2">
                        {[
                          { key: "section_reviews", label: "Reviews" },
                          { key: "section_portfolio", label: "Portfolio" },
                          { key: "section_skills", label: "Skills" },
                          { key: "section_contact", label: "Contact" },
                        ].map(({ key, label }) => {
                          const s = siteSettings.find(x => x.key === key);
                          if (!s) return null;
                          const isVisible = s.value === "true";
                          return (
                            <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                              <span className="text-sm font-medium">{label}</span>
                              <div className="flex items-center gap-2">
                                <Badge variant={isVisible ? "default" : "secondary"}>{isVisible ? "Visible" : "Hidden"}</Badge>
                                <Button size="sm" variant="outline" onClick={() => updateSettingMutation.mutate({ key, value: isVisible ? "false" : "true" })} disabled={updateSettingMutation.isPending} data-testid={`button-toggle-section-${key}`}>
                                  {isVisible ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                                  {isVisible ? "Hide" : "Show"}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Footer</h3>
                      {(() => {
                        const s = siteSettings.find(x => x.key === "footer_copyright");
                        if (!s) return null;
                        const key = "footer_copyright";
                        return (
                          <div className="flex items-center gap-3">
                            <label className="w-32 text-sm font-medium shrink-0">Copyright</label>
                            {editingSettingKey === key ? (
                              <div className="flex-1 flex items-center gap-2">
                                <Input value={editingSettingValue} onChange={(e) => setEditingSettingValue(e.target.value)} className="flex-1" data-testid={`input-setting-${key}`} />
                                <Button size="sm" onClick={() => updateSettingMutation.mutate({ key, value: editingSettingValue })} disabled={updateSettingMutation.isPending}><Save className="w-3 h-3" /></Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingSettingKey(null)}>✕</Button>
                              </div>
                            ) : (
                              <div className="flex-1 flex items-center gap-2">
                                <span className="flex-1 text-sm text-muted-foreground truncate">{s.value}</span>
                                <Button size="sm" variant="outline" onClick={() => { setEditingSettingKey(key); setEditingSettingValue(s.value); }} data-testid={`button-edit-setting-${key}`}><Edit className="w-3 h-3" /></Button>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </CardContent>
                )}
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

      {/* ── TESTIMONIAL DIALOG ── */}
      <Dialog open={testimonialDialogOpen} onOpenChange={(open) => {
        setTestimonialDialogOpen(open);
        if (!open) { setEditingTestimonial(null); testimonialForm.reset(); }
      }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" data-testid="dialog-testimonial">
          <DialogHeader>
            <DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
            <DialogDescription>{editingTestimonial ? "Update testimonial details." : "Add a new testimonial to your portfolio."}</DialogDescription>
          </DialogHeader>
          <Form {...testimonialForm}>
            <form onSubmit={testimonialForm.handleSubmit(handleTestimonialSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={testimonialForm.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Name *</FormLabel><FormControl><Input placeholder="Ahmed Hassan" {...field} data-testid="input-testimonial-name" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={testimonialForm.control} name="stars" render={({ field }) => (
                  <FormItem><FormLabel>Stars (1–5)</FormLabel><FormControl>
                    <Input type="number" min={1} max={5} {...field} onChange={e => field.onChange(Number(e.target.value))} data-testid="input-testimonial-stars" />
                  </FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={testimonialForm.control} name="role" render={({ field }) => (
                  <FormItem><FormLabel>Role *</FormLabel><FormControl><Input placeholder="CEO" {...field} data-testid="input-testimonial-role" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={testimonialForm.control} name="company" render={({ field }) => (
                  <FormItem><FormLabel>Company *</FormLabel><FormControl><Input placeholder="Tech Corp" {...field} data-testid="input-testimonial-company" /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={testimonialForm.control} name="quote" render={({ field }) => (
                <FormItem><FormLabel>Quote *</FormLabel><FormControl><Textarea placeholder="Write the testimonial text here..." {...field} rows={3} data-testid="input-testimonial-quote" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={testimonialForm.control} name="icon" render={({ field }) => (
                <FormItem><FormLabel>Icon / Avatar URL</FormLabel><FormControl><Input placeholder="https://..." {...field} data-testid="input-testimonial-icon" /></FormControl><FormDescription>Optional image URL for avatar</FormDescription><FormMessage /></FormItem>
              )} />
              <FormField control={testimonialForm.control} name="visible" render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} data-testid="checkbox-testimonial-visible" /></FormControl>
                  <FormLabel className="cursor-pointer">Visible on portfolio</FormLabel>
                </FormItem>
              )} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setTestimonialDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createTestimonialMutation.isPending || updateTestimonialMutation.isPending} data-testid="button-submit-testimonial">
                  {(createTestimonialMutation.isPending || updateTestimonialMutation.isPending) ? "Saving..." : editingTestimonial ? "Update" : "Add"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
