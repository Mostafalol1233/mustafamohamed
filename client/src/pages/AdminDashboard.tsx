import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { 
  Star, 
  Mail, 
  FolderGit2, 
  Award, 
  Bell, 
  LayoutDashboard,
  LogOut,
  Check,
  Trash2,
  Eye,
  EyeOff,
  TrendingUp,
  MessageSquare,
  Users,
  Plus,
  Edit
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Review, ContactMessage, Project, Certificate, Notification } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertProjectSchema, insertCertificateSchema, insertNotificationSchema } from "@shared/schema";

// Extended schemas with URL validation
const projectFormSchema = insertProjectSchema.extend({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  liveUrl: z.union([z.string().url("Must be a valid URL").optional(), z.literal("")]).transform(val => val === "" ? undefined : val),
  githubUrl: z.union([z.string().url("Must be a valid URL").optional(), z.literal("")]).transform(val => val === "" ? undefined : val),
  imageUrl: z.union([z.string().url("Must be a valid URL").optional(), z.literal("")]).transform(val => val === "" ? undefined : val),
  technologiesInput: z.string().optional(),
}).transform((data) => ({
  ...data,
  technologies: data.technologiesInput ? data.technologiesInput.split(',').map(t => t.trim()).filter(Boolean) : [],
}));

const certificateFormSchema = insertCertificateSchema.extend({
  title: z.string().min(1, "Title is required"),
  imageUrl: z.union([z.string().url("Must be a valid URL").optional(), z.literal("")]).transform(val => val === "" ? undefined : val),
});

const notificationFormSchema = insertNotificationSchema.extend({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  type: z.enum(["info", "warning", "success", "error"]),
});

export default function AdminDashboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Dialog state
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Check authentication
  const { data: authData, isLoading: authLoading } = useQuery<{ isAuthenticated: boolean; isAdmin: boolean }>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && (!authData?.isAuthenticated || !authData?.isAdmin)) {
      setLocation("/admin/login");
    }
  }, [authData, authLoading, setLocation]);

  // Fetch all data
  const { data: allReviews = [] } = useQuery<Review[]>({
    queryKey: ["/api/admin/reviews"],
    enabled: authData?.isAuthenticated,
  });

  const { data: contactMessages = [] } = useQuery<ContactMessage[]>({
    queryKey: ["/api/admin/contact"],
    enabled: authData?.isAuthenticated,
  });

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects/all"],
    enabled: authData?.isAuthenticated,
  });

  const { data: certificates = [] } = useQuery<Certificate[]>({
    queryKey: ["/api/certificates"],
    enabled: authData?.isAuthenticated,
  });

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications/all"],
    enabled: authData?.isAuthenticated,
  });

  const { data: analyticsSummary } = useQuery<{
    totalViews: number;
    totalProjects: number;
    totalReviews: number;
    totalContacts: number;
    recentActivity: any[];
  }>({
    queryKey: ["/api/admin/analytics/summary"],
    enabled: authData?.isAuthenticated,
  });

  // Forms
  const projectForm = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      technologiesInput: "",
      liveUrl: "",
      githubUrl: "",
      imageUrl: "",
      isVisible: true,
    },
  });

  const certificateForm = useForm<z.infer<typeof certificateFormSchema>>({
    resolver: zodResolver(certificateFormSchema),
    defaultValues: {
      title: "",
      description: "",
      issueDate: "",
      imageUrl: "",
      isVisible: true,
    },
  });

  const notificationForm = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      title: "",
      message: "",
      type: "info",
      isActive: true,
    },
  });

  // Mutations
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/logout");
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Logged out successfully!",
      });
      setLocation("/admin/login");
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch("/api/projects", { method: "POST", body: data, credentials: "include" });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message || "Failed"); }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects/all"] });
      toast({ title: "Success", description: "Project created successfully!" });
      setProjectDialogOpen(false);
      setImageFile(null);
      setImagePreview("");
      projectForm.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create project", variant: "destructive" });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const res = await fetch(`/api/projects/${id}`, { method: "PATCH", body: data, credentials: "include" });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message || "Failed"); }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects/all"] });
      toast({ title: "Success", description: "Project updated successfully!" });
      setProjectDialogOpen(false);
      setEditingProject(null);
      setImageFile(null);
      setImagePreview("");
      projectForm.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update project", variant: "destructive" });
    },
  });

  const createCertificateMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/certificates", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/certificates"] });
      toast({
        title: "Success",
        description: "Certificate created successfully!",
      });
      setCertificateDialogOpen(false);
      certificateForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create certificate",
        variant: "destructive",
      });
    },
  });

  const createNotificationMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/notifications", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/all"] });
      toast({
        title: "Success",
        description: "Notification created successfully!",
      });
      setNotificationDialogOpen(false);
      notificationForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create notification",
        variant: "destructive",
      });
    },
  });

  const approveReviewMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PATCH", `/api/admin/reviews/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
      toast({
        title: "Success",
        description: "Review approved successfully!",
      });
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
      toast({
        title: "Success",
        description: "Review deleted successfully!",
      });
    },
  });

  const markMessageReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PATCH", `/api/contact/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact"] });
      toast({
        title: "Success",
        description: "Message marked as read!",
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects/all"] });
      toast({ title: "Success", description: "Project deleted successfully!" });
    },
  });

  const toggleProjectVisibilityMutation = useMutation({
    mutationFn: async ({ id, isVisible }: { id: number; isVisible: boolean }) => {
      await apiRequest("PATCH", `/api/projects/${id}`, { isVisible });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects/all"] });
      toast({ title: "Success", description: "Project visibility updated!" });
    },
  });

  const deleteCertificateMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/certificates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/certificates"] });
      toast({
        title: "Success",
        description: "Certificate deleted successfully!",
      });
    },
  });

  const toggleNotificationMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      await apiRequest("PATCH", `/api/notifications/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/all"] });
      toast({
        title: "Success",
        description: "Notification updated!",
      });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/all"] });
      toast({
        title: "Success",
        description: "Notification deleted successfully!",
      });
    },
  });

  // Helper functions
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setImageFile(null);
    setImagePreview(project.imageUrl || "");
    projectForm.reset({
      title: project.title,
      description: project.description,
      technologiesInput: project.technologies?.join(", ") || "",
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      imageUrl: project.imageUrl || "",
      isVisible: project.isVisible ?? true,
    });
    setProjectDialogOpen(true);
  };

  const handleProjectSubmit = (values: z.infer<typeof projectFormSchema>) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("technologies", JSON.stringify(values.technologies || []));
    formData.append("liveUrl", values.liveUrl || "");
    formData.append("githubUrl", values.githubUrl || "");
    formData.append("isVisible", String(values.isVisible ?? true));
    if (imageFile) {
      formData.append("image", imageFile);
    } else if (values.imageUrl) {
      formData.append("imageUrl", values.imageUrl);
    }

    if (editingProject) {
      updateProjectMutation.mutate({ id: editingProject.id, data: formData });
    } else {
      createProjectMutation.mutate(formData);
    }
  };

  const handleCertificateSubmit = (values: z.infer<typeof certificateFormSchema>) => {
    const data = {
      title: values.title,
      description: values.description || undefined,
      issueDate: values.issueDate || undefined,
      imageUrl: values.imageUrl || undefined,
      isVisible: values.isVisible,
    };
    createCertificateMutation.mutate(data);
  };

  const handleNotificationSubmit = (values: z.infer<typeof notificationFormSchema>) => {
    createNotificationMutation.mutate(values);
  };

  // Calculate statistics
  const stats = {
    totalReviews: allReviews.length,
    pendingReviews: allReviews.filter(r => !r.isApproved).length,
    unreadMessages: contactMessages.filter(m => !m.isRead).length,
    totalProjects: projects.length,
    visibleProjects: projects.filter(p => p.isVisible).length,
    activeNotifications: notifications.filter(n => n.isActive).length,
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authData?.isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900" data-testid="text-dashboard-title">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your portfolio content</p>
            </div>
            <Button
              onClick={() => logoutMutation.mutate()}
              variant="outline"
              disabled={logoutMutation.isPending}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 lg:w-auto" data-testid="tabs-navigation">
            <TabsTrigger value="overview" data-testid="tab-overview">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="reviews" data-testid="tab-reviews">
              <Star className="w-4 h-4 mr-2" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="messages" data-testid="tab-messages">
              <Mail className="w-4 h-4 mr-2" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="projects" data-testid="tab-projects">
              <FolderGit2 className="w-4 h-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="certificates" data-testid="tab-certificates">
              <Award className="w-4 h-4 mr-2" />
              Certificates
            </TabsTrigger>
            <TabsTrigger value="notifications" data-testid="tab-notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-analytics">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card data-testid="card-stat-reviews">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                    Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-total-reviews">{stats.totalReviews}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.pendingReviews} pending approval
                  </p>
                </CardContent>
              </Card>

              <Card data-testid="card-stat-messages">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-green-600" />
                    Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-total-messages">{contactMessages.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.unreadMessages} unread
                  </p>
                </CardContent>
              </Card>

              <Card data-testid="card-stat-projects">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <FolderGit2 className="w-4 h-4 mr-2 text-purple-600" />
                    Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-total-projects">{stats.totalProjects}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.visibleProjects} visible
                  </p>
                </CardContent>
              </Card>

              <Card data-testid="card-stat-certificates">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Award className="w-4 h-4 mr-2 text-orange-600" />
                    Certificates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-total-certificates">{certificates.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total certificates
                  </p>
                </CardContent>
              </Card>

              <Card data-testid="card-stat-notifications">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Bell className="w-4 h-4 mr-2 text-red-600" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-total-notifications">{notifications.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.activeNotifications} active
                  </p>
                </CardContent>
              </Card>

              <Card data-testid="card-stat-engagement">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-teal-600" />
                    Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-engagement-rate">
                    {allReviews.length > 0 
                      ? Math.round((allReviews.filter(r => r.isApproved).length / allReviews.length) * 100) 
                      : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Review approval rate
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {stats.pendingReviews > 0 && (
                  <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-600 mr-3" />
                      <span className="text-sm font-medium">{stats.pendingReviews} reviews pending approval</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => {
                      const tabsElement = document.querySelector('[data-testid="tab-reviews"]') as HTMLButtonElement;
                      tabsElement?.click();
                    }} data-testid="button-quick-action-reviews">
                      Review Now
                    </Button>
                  </div>
                )}
                {stats.unreadMessages > 0 && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="text-sm font-medium">{stats.unreadMessages} unread messages</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => {
                      const tabsElement = document.querySelector('[data-testid="tab-messages"]') as HTMLButtonElement;
                      tabsElement?.click();
                    }} data-testid="button-quick-action-messages">
                      View Messages
                    </Button>
                  </div>
                )}
                {stats.pendingReviews === 0 && stats.unreadMessages === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Check className="w-12 h-12 mx-auto mb-2 text-green-500" />
                    <p>All caught up! No pending actions.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Reviews Management
                </CardTitle>
                <CardDescription>
                  Manage and moderate user reviews ({allReviews.length} total, {stats.pendingReviews} pending)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allReviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-8" data-testid="text-no-reviews">No reviews found</p>
                  ) : (
                    allReviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4 space-y-2" data-testid={`card-review-${review.id}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold" data-testid={`text-review-name-${review.id}`}>{review.name}</h4>
                            {review.email && <p className="text-sm text-gray-600">{review.email}</p>}
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex">{renderStars(review.rating)}</div>
                              <Badge variant={review.isApproved ? "default" : "secondary"} data-testid={`badge-review-status-${review.id}`}>
                                {review.isApproved ? "Approved" : "Pending"}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {!review.isApproved && (
                              <Button
                                size="sm"
                                onClick={() => approveReviewMutation.mutate(review.id)}
                                disabled={approveReviewMutation.isPending}
                                data-testid={`button-approve-review-${review.id}`}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteReviewMutation.mutate(review.id)}
                              disabled={deleteReviewMutation.isPending}
                              data-testid={`button-delete-review-${review.id}`}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm" data-testid={`text-review-comment-${review.id}`}>{review.comment}</p>
                        <p className="text-xs text-gray-400">
                          {formatDate(review.createdAt!)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-blue-500" />
                  Contact Messages
                </CardTitle>
                <CardDescription>
                  View and manage contact form submissions ({contactMessages.length} total, {stats.unreadMessages} unread)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contactMessages.length === 0 ? (
                    <p className="text-gray-500 text-center py-8" data-testid="text-no-messages">No messages found</p>
                  ) : (
                    contactMessages.map((message) => (
                      <div key={message.id} className="border rounded-lg p-4 space-y-2" data-testid={`card-message-${message.id}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold" data-testid={`text-message-name-${message.id}`}>{message.name}</h4>
                            <p className="text-sm text-gray-600">{message.email}</p>
                            {message.subject && (
                              <p className="text-sm font-medium text-gray-800 mt-1">
                                Subject: {message.subject}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={message.isRead ? "default" : "destructive"} data-testid={`badge-message-status-${message.id}`}>
                              {message.isRead ? "Read" : "Unread"}
                            </Badge>
                            {!message.isRead && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markMessageReadMutation.mutate(message.id)}
                                disabled={markMessageReadMutation.isPending}
                                data-testid={`button-mark-read-${message.id}`}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Mark Read
                              </Button>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm" data-testid={`text-message-content-${message.id}`}>{message.message}</p>
                        <p className="text-xs text-gray-400">
                          {formatDate(message.createdAt!)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <FolderGit2 className="w-5 h-5 mr-2 text-purple-500" />
                      Projects Management
                    </CardTitle>
                    <CardDescription>
                      Manage portfolio projects ({projects.length} total, {stats.visibleProjects} visible)
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      setEditingProject(null);
                      setImageFile(null);
                      setImagePreview("");
                      projectForm.reset({
                        title: "",
                        description: "",
                        technologiesInput: "",
                        liveUrl: "",
                        githubUrl: "",
                        imageUrl: "",
                        isVisible: true,
                      });
                      setProjectDialogOpen(true);
                    }}
                    data-testid="button-create-project"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.length === 0 ? (
                    <p className="text-gray-500 text-center py-8" data-testid="text-no-projects">No projects found</p>
                  ) : (
                    projects.map((project) => (
                      <div key={project.id} className="border rounded-lg p-4 space-y-3" data-testid={`card-project-${project.id}`}>
                        <div className="flex gap-4 items-start">
                          {/* Thumbnail */}
                          {project.imageUrl && (
                            <img src={project.imageUrl} alt={project.title}
                              className="w-20 h-14 object-cover rounded-md flex-shrink-0 border" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h4 className="font-semibold truncate" data-testid={`text-project-title-${project.id}`}>{project.title}</h4>
                                <p className="text-sm text-gray-500 mt-0.5 line-clamp-2" data-testid={`text-project-description-${project.id}`}>{project.description}</p>
                              </div>
                              {/* Actions */}
                              <div className="flex gap-1.5 flex-shrink-0">
                                <Button size="sm" variant="outline" onClick={() => handleEditProject(project)}
                                  data-testid={`button-edit-project-${project.id}`}>
                                  <Edit className="w-3.5 h-3.5 mr-1" />Edit
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => deleteProjectMutation.mutate(project.id)}
                                  disabled={deleteProjectMutation.isPending}
                                  data-testid={`button-delete-project-${project.id}`}>
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>

                            {/* Tech tags */}
                            {project.technologies && project.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {project.technologies.map((tech, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs" data-testid={`badge-project-tech-${project.id}-${idx}`}>
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {/* Status row */}
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              {/* Visibility toggle */}
                              <button
                                onClick={() => toggleProjectVisibilityMutation.mutate({ id: project.id, isVisible: !project.isVisible })}
                                disabled={toggleProjectVisibilityMutation.isPending}
                                data-testid={`button-toggle-visibility-${project.id}`}
                                className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium transition-colors ${
                                  project.isVisible
                                    ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                    : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                                }`}
                              >
                                {project.isVisible ? <><Eye className="w-3 h-3" />Visible</> : <><EyeOff className="w-3 h-3" />Hidden</>}
                              </button>

                              {/* Live URL badge */}
                              {project.liveUrl && (
                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 font-medium"
                                  data-testid={`link-project-live-${project.id}`}>
                                  🌐 Live Demo
                                </a>
                              )}

                              {/* GitHub badge — only shown if githubUrl exists */}
                              {project.githubUrl ? (
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-900 text-white hover:bg-gray-700 font-medium"
                                  data-testid={`link-project-github-${project.id}`}>
                                  ⌥ GitHub
                                </a>
                              ) : project.liveUrl ? (
                                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-medium"
                                  data-testid={`badge-project-published-${project.id}`}>
                                  ✦ Published (no GitHub)
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">{formatDate(project.createdAt!)}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <Award className="w-5 h-5 mr-2 text-orange-500" />
                      Certificates Management
                    </CardTitle>
                    <CardDescription>
                      Manage certifications and achievements ({certificates.length} total)
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      certificateForm.reset({
                        title: "",
                        description: "",
                        issueDate: "",
                        imageUrl: "",
                        isVisible: true,
                      });
                      setCertificateDialogOpen(true);
                    }}
                    data-testid="button-create-certificate"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {certificates.length === 0 ? (
                    <p className="text-gray-500 text-center py-8" data-testid="text-no-certificates">No certificates found</p>
                  ) : (
                    certificates.map((cert) => (
                      <div key={cert.id} className="border rounded-lg p-4 space-y-2" data-testid={`card-certificate-${cert.id}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold" data-testid={`text-certificate-title-${cert.id}`}>{cert.title}</h4>
                            {cert.description && (
                              <p className="text-sm text-gray-600 mt-1" data-testid={`text-certificate-description-${cert.id}`}>
                                {cert.description}
                              </p>
                            )}
                            <div className="flex items-center space-x-2 mt-2">
                              {cert.issueDate && (
                                <p className="text-xs text-gray-500" data-testid={`text-certificate-date-${cert.id}`}>
                                  Issued: {cert.issueDate}
                                </p>
                              )}
                              <Badge variant={cert.isVisible ? "default" : "secondary"} data-testid={`badge-certificate-visibility-${cert.id}`}>
                                {cert.isVisible ? <><Eye className="w-3 h-3 mr-1" />Visible</> : <><EyeOff className="w-3 h-3 mr-1" />Hidden</>}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteCertificateMutation.mutate(cert.id)}
                            disabled={deleteCertificateMutation.isPending}
                            data-testid={`button-delete-certificate-${cert.id}`}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <Bell className="w-5 h-5 mr-2 text-red-500" />
                      Notifications Management
                    </CardTitle>
                    <CardDescription>
                      Manage site-wide notifications ({notifications.length} total, {stats.activeNotifications} active)
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      notificationForm.reset({
                        title: "",
                        message: "",
                        type: "info",
                        isActive: true,
                      });
                      setNotificationDialogOpen(true);
                    }}
                    data-testid="button-create-notification"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.length === 0 ? (
                    <p className="text-gray-500 text-center py-8" data-testid="text-no-notifications">No notifications found</p>
                  ) : (
                    notifications.map((notification) => (
                      <div key={notification.id} className="border rounded-lg p-4 space-y-2" data-testid={`card-notification-${notification.id}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold" data-testid={`text-notification-title-${notification.id}`}>{notification.title}</h4>
                              <Badge variant={
                                notification.type === "error" ? "destructive" :
                                notification.type === "warning" ? "secondary" :
                                notification.type === "success" ? "default" :
                                "outline"
                              } data-testid={`badge-notification-type-${notification.id}`}>
                                {notification.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1" data-testid={`text-notification-message-${notification.id}`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant={notification.isActive ? "default" : "secondary"} data-testid={`badge-notification-status-${notification.id}`}>
                                {notification.isActive ? "Active" : "Inactive"}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleNotificationMutation.mutate({
                                  id: notification.id,
                                  isActive: !notification.isActive
                                })}
                                disabled={toggleNotificationMutation.isPending}
                                data-testid={`button-toggle-notification-${notification.id}`}
                              >
                                {notification.isActive ? "Deactivate" : "Activate"}
                              </Button>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteNotificationMutation.mutate(notification.id)}
                            disabled={deleteNotificationMutation.isPending}
                            data-testid={`button-delete-notification-${notification.id}`}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                        <p className="text-xs text-gray-400">
                          {formatDate(notification.createdAt!)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-teal-500" />
                    Analytics Overview
                  </CardTitle>
                  <CardDescription>
                    Visitor engagement and site statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Total Page Views</div>
                      <div className="text-2xl font-bold" data-testid="text-analytics-views">
                        {analyticsSummary?.totalViews || 0}
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Active Projects</div>
                      <div className="text-2xl font-bold" data-testid="text-analytics-projects">
                        {analyticsSummary?.totalProjects || 0}
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Approved Reviews</div>
                      <div className="text-2xl font-bold" data-testid="text-analytics-reviews">
                        {analyticsSummary?.totalReviews || 0}
                      </div>
                    </div>
                    <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Contact Submissions</div>
                      <div className="text-2xl font-bold" data-testid="text-analytics-contacts">
                        {analyticsSummary?.totalContacts || 0}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest visitor interactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!analyticsSummary?.recentActivity || analyticsSummary.recentActivity.length === 0 ? (
                    <p className="text-gray-500 text-center py-8" data-testid="text-no-activity">
                      No activity recorded yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {analyticsSummary.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg" data-testid={`activity-${index}`}>
                          <div className="flex-1">
                            <div className="font-medium">{activity.eventType}</div>
                            {activity.eventData && (
                              <div className="text-sm text-muted-foreground">
                                {JSON.stringify(activity.eventData)}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(activity.createdAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Project Dialog */}
      <Dialog open={projectDialogOpen} onOpenChange={(open) => {
        setProjectDialogOpen(open);
        if (!open) {
          setEditingProject(null);
          setImageFile(null);
          setImagePreview("");
          projectForm.reset();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-project">
          <DialogHeader>
            <DialogTitle data-testid="text-project-dialog-title">
              {editingProject ? "Edit Project" : "Create New Project"}
            </DialogTitle>
            <DialogDescription>
              {editingProject ? "Update the project details below." : "Fill in the project details below."}
            </DialogDescription>
          </DialogHeader>
          <Form {...projectForm}>
            <form onSubmit={projectForm.handleSubmit(handleProjectSubmit)} className="space-y-4">
              <FormField
                control={projectForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Project Title" {...field} data-testid="input-project-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={projectForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Project Description" {...field} data-testid="input-project-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={projectForm.control}
                name="technologiesInput"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technologies</FormLabel>
                    <FormControl>
                      <Input placeholder="React, TypeScript, Node.js (comma-separated)" {...field} data-testid="input-project-technologies" />
                    </FormControl>
                    <FormDescription>
                      Enter technologies separated by commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={projectForm.control}
                name="liveUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Live URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} data-testid="input-project-liveurl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={projectForm.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/user/repo" {...field} data-testid="input-project-githuburl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Image upload — file picker OR URL fallback */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Image</label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 space-y-3">
                  {imagePreview && (
                    <div className="relative w-full h-36 rounded-lg overflow-hidden bg-gray-100">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => { setImageFile(null); setImagePreview(""); projectForm.setValue("imageUrl", ""); }}
                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/80"
                        data-testid="button-clear-image"
                      >✕</button>
                    </div>
                  )}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-primary font-medium hover:underline" data-testid="label-upload-image">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        className="hidden"
                        data-testid="input-project-imagefile"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setImageFile(file);
                            setImagePreview(URL.createObjectURL(file));
                            projectForm.setValue("imageUrl", "");
                          }
                        }}
                      />
                      📁 Upload image from device
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP up to 5 MB</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-muted-foreground">or paste URL</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  <FormField
                    control={projectForm.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/image.jpg"
                            {...field}
                            disabled={!!imageFile}
                            data-testid="input-project-imageurl"
                            onChange={(e) => {
                              field.onChange(e);
                              if (e.target.value) setImagePreview(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={projectForm.control}
                name="isVisible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-project-visible"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Visible on Portfolio</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setProjectDialogOpen(false)}
                  data-testid="button-cancel-project"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createProjectMutation.isPending || updateProjectMutation.isPending}
                  data-testid="button-submit-project"
                >
                  {createProjectMutation.isPending || updateProjectMutation.isPending ? "Saving..." : editingProject ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Certificate Dialog */}
      <Dialog open={certificateDialogOpen} onOpenChange={(open) => {
        setCertificateDialogOpen(open);
        if (!open) certificateForm.reset();
      }}>
        <DialogContent className="max-w-2xl" data-testid="dialog-certificate">
          <DialogHeader>
            <DialogTitle data-testid="text-certificate-dialog-title">Create New Certificate</DialogTitle>
            <DialogDescription>
              Fill in the certificate details below.
            </DialogDescription>
          </DialogHeader>
          <Form {...certificateForm}>
            <form onSubmit={certificateForm.handleSubmit(handleCertificateSubmit)} className="space-y-4">
              <FormField
                control={certificateForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Certificate Title" {...field} data-testid="input-certificate-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={certificateForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Certificate Description" {...field} value={field.value || ""} data-testid="input-certificate-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={certificateForm.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Date</FormLabel>
                    <FormControl>
                      <Input placeholder="January 2024" {...field} value={field.value || ""} data-testid="input-certificate-issuedate" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={certificateForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/certificate.jpg" {...field} value={field.value || ""} data-testid="input-certificate-imageurl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={certificateForm.control}
                name="isVisible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-certificate-visible"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Visible on Portfolio</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCertificateDialogOpen(false)}
                  data-testid="button-cancel-certificate"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createCertificateMutation.isPending}
                  data-testid="button-submit-certificate"
                >
                  {createCertificateMutation.isPending ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Notification Dialog */}
      <Dialog open={notificationDialogOpen} onOpenChange={(open) => {
        setNotificationDialogOpen(open);
        if (!open) notificationForm.reset();
      }}>
        <DialogContent className="max-w-2xl" data-testid="dialog-notification">
          <DialogHeader>
            <DialogTitle data-testid="text-notification-dialog-title">Create New Notification</DialogTitle>
            <DialogDescription>
              Fill in the notification details below.
            </DialogDescription>
          </DialogHeader>
          <Form {...notificationForm}>
            <form onSubmit={notificationForm.handleSubmit(handleNotificationSubmit)} className="space-y-4">
              <FormField
                control={notificationForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Notification Title" {...field} data-testid="input-notification-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={notificationForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Notification Message" {...field} data-testid="input-notification-message" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={notificationForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-notification-type">
                          <SelectValue placeholder="Select notification type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="info" data-testid="option-notification-type-info">Info</SelectItem>
                        <SelectItem value="warning" data-testid="option-notification-type-warning">Warning</SelectItem>
                        <SelectItem value="success" data-testid="option-notification-type-success">Success</SelectItem>
                        <SelectItem value="error" data-testid="option-notification-type-error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={notificationForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-notification-active"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Active notifications will be displayed on the site
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setNotificationDialogOpen(false)}
                  data-testid="button-cancel-notification"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createNotificationMutation.isPending}
                  data-testid="button-submit-notification"
                >
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
