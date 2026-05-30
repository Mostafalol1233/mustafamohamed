import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Review, ContactMessage, Project, Certificate, Notification, Client, SiteSetting } from "@shared/schema";
import { useState } from "react";
import { Star, X, Eye, EyeOff, Plus, Edit, Trash2, Upload, Image, Settings2 } from "lucide-react";

export default function EnhancedAdminDashboard() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // State for forms
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    technologies: "",
    liveUrl: "",
    githubUrl: "",
    imageFile: null as File | null,
    isVisible: true,
  });

  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
    type: "info" as "info" | "warning" | "success" | "error",
    isActive: true,
  });

  const [certificateForm, setCertificateForm] = useState({
    title: "",
    description: "",
    issueDate: "",
    imageFile: null as File | null,
    isVisible: true,
  });

  const [clientForm, setClientForm] = useState({
    name: "",
    initials: "",
    color: "#4f9eff",
    imageFile: null as File | null,
    sortOrder: 0,
    isVisible: true,
  });
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [logoImageFile, setLogoImageFile] = useState<File | null>(null);

  // Queries
  const { data: allReviews = [] } = useQuery<Review[]>({
    queryKey: ["/api/reviews/all"],
    enabled: isAuthenticated,
  });

  const { data: contactMessages = [] } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact"],
    enabled: isAuthenticated,
  });

  const { data: allProjects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects/all"],
    enabled: isAuthenticated,
  });

  const { data: allNotifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications/all"],
    enabled: isAuthenticated,
  });

  const { data: allCertificates = [] } = useQuery<Certificate[]>({
    queryKey: ["/api/certificates"],
    enabled: isAuthenticated,
  });

  const { data: allClients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients/all"],
    enabled: isAuthenticated,
  });

  const { data: siteSettings = [] } = useQuery<SiteSetting[]>({
    queryKey: ["/api/site-settings"],
    enabled: isAuthenticated,
  });

  const currentProfileImageUrl = siteSettings.find(s => s.key === "profile_image_url")?.value;

  // Mutations for Reviews
  const approveReviewMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PATCH", `/api/reviews/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews/all"] });
      toast({ title: "Success", description: "Review approved!" });
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews/all"] });
      toast({ title: "Success", description: "Review deleted!" });
    },
  });

  const markMessageAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PATCH", `/api/contact/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
      toast({ title: "Success", description: "Message marked as read!" });
    },
  });

  // Mutations for Projects
  const createProjectMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to create project");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects/all"] });
      toast({ title: "Success", description: "Project created!" });
      resetProjectForm();
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to update project");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects/all"] });
      toast({ title: "Success", description: "Project updated!" });
      setEditingProject(null);
      resetProjectForm();
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects/all"] });
      toast({ title: "Success", description: "Project deleted!" });
    },
  });

  // Mutations for Notifications
  const createNotificationMutation = useMutation({
    mutationFn: async (data: typeof notificationForm) => {
      await apiRequest("POST", "/api/notifications", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/all"] });
      toast({ title: "Success", description: "Notification created!" });
      setNotificationForm({ title: "", message: "", type: "info", isActive: true });
    },
  });

  const toggleNotificationMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      await apiRequest("PATCH", `/api/notifications/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/all"] });
      toast({ title: "Success", description: "Notification updated!" });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/all"] });
      toast({ title: "Success", description: "Notification deleted!" });
    },
  });

  // Mutations for Certificates
  const createCertificateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/certificates", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to create certificate");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/certificates"] });
      toast({ title: "Success", description: "Certificate created!" });
      resetCertificateForm();
    },
  });

  const deleteCertificateMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/certificates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/certificates"] });
      toast({ title: "Success", description: "Certificate deleted!" });
    },
  });

  // Mutations for Clients
  const createClientMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/clients", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Failed to create client");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/clients/all"] });
      toast({ title: "Success", description: "Client added!" });
      resetClientForm();
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
      const response = await fetch(`/api/clients/${id}`, { method: "PATCH", body: formData });
      if (!response.ok) throw new Error("Failed to update client");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/clients/all"] });
      toast({ title: "Success", description: "Client updated!" });
      setEditingClient(null);
      resetClientForm();
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/clients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/clients/all"] });
      toast({ title: "Success", description: "Client deleted!" });
    },
  });

  const uploadProfileImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch("/api/admin/profile-image", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Failed to upload profile image");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
      toast({ title: "Success", description: "Profile image updated!" });
      setProfileImageFile(null);
    },
  });

  const uploadLogoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch("/api/admin/site-image/logo_image_url", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Failed to upload logo");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
      toast({ title: "Success", description: "Logo updated! Visible in nav bar." });
      setLogoImageFile(null);
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const response = await fetch(`/api/site-settings/${key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      if (!response.ok) throw new Error("Failed to update setting");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
      toast({ title: "Saved", description: "Setting updated successfully." });
    },
  });

  // Helper functions
  const resetProjectForm = () => {
    setProjectForm({
      title: "",
      description: "",
      technologies: "",
      liveUrl: "",
      githubUrl: "",
      imageFile: null,
      isVisible: true,
    });
  };

  const resetCertificateForm = () => {
    setCertificateForm({
      title: "",
      description: "",
      issueDate: "",
      imageFile: null,
      isVisible: true,
    });
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    
    if (editingProject) {
      formData.append("title", projectForm.title || editingProject.title);
      formData.append("description", projectForm.description || editingProject.description);
      formData.append("technologies", JSON.stringify(
        projectForm.technologies ? projectForm.technologies.split(",").map(t => t.trim()) : editingProject.technologies
      ));
      formData.append("liveUrl", projectForm.liveUrl || editingProject.liveUrl || "");
      formData.append("githubUrl", projectForm.githubUrl || editingProject.githubUrl || "");
      formData.append("isVisible", String(projectForm.isVisible));
      if (projectForm.imageFile) {
        formData.append("image", projectForm.imageFile);
      }
      updateProjectMutation.mutate({ id: editingProject.id, formData });
    } else {
      formData.append("title", projectForm.title);
      formData.append("description", projectForm.description);
      formData.append("technologies", JSON.stringify(projectForm.technologies.split(",").map(t => t.trim())));
      formData.append("liveUrl", projectForm.liveUrl);
      formData.append("githubUrl", projectForm.githubUrl);
      formData.append("isVisible", String(projectForm.isVisible));
      if (projectForm.imageFile) {
        formData.append("image", projectForm.imageFile);
      }
      createProjectMutation.mutate(formData);
    }
  };

  const handleCertificateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", certificateForm.title);
    formData.append("description", certificateForm.description);
    formData.append("issueDate", certificateForm.issueDate);
    formData.append("isVisible", String(certificateForm.isVisible));
    if (certificateForm.imageFile) {
      formData.append("image", certificateForm.imageFile);
    }
    createCertificateMutation.mutate(formData);
  };

  const resetClientForm = () => {
    setClientForm({ name: "", initials: "", color: "#4f9eff", imageFile: null, sortOrder: 0, isVisible: true });
  };

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (editingClient) {
      formData.append("name", clientForm.name || editingClient.name);
      formData.append("initials", clientForm.initials || editingClient.initials);
      formData.append("color", clientForm.color || editingClient.color);
      formData.append("sortOrder", String(clientForm.sortOrder));
      formData.append("isVisible", String(clientForm.isVisible));
      if (clientForm.imageFile) formData.append("image", clientForm.imageFile);
      updateClientMutation.mutate({ id: editingClient.id, formData });
    } else {
      formData.append("name", clientForm.name);
      formData.append("initials", clientForm.initials);
      formData.append("color", clientForm.color);
      formData.append("sortOrder", String(clientForm.sortOrder));
      formData.append("isVisible", String(clientForm.isVisible));
      if (clientForm.imageFile) formData.append("image", clientForm.imageFile);
      createClientMutation.mutate(formData);
    }
  };

  const startEditingClient = (client: Client) => {
    setEditingClient(client);
    setClientForm({ name: client.name, initials: client.initials, color: client.color, imageFile: null, sortOrder: client.sortOrder, isVisible: client.isVisible ?? true });
    setActiveTab("clients");
  };

  const startEditingProject = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      technologies: project.technologies?.join(", ") || "",
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      imageFile: null,
      isVisible: project.isVisible ?? true,
    });
    setActiveTab("projects");
  };

  const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return "N/A";
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
        size={16}
        className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  if (!isAuthenticated) {
    return null;
  }

  const pendingReviews = allReviews.filter((review) => !review.isApproved);
  const approvedReviews = allReviews.filter((review) => review.isApproved);
  const unreadMessages = contactMessages.filter((msg) => !msg.isRead);
  const activeNotifications = allNotifications.filter((n) => n.isActive);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h2 className="text-2xl font-bold text-primary">Admin Dashboard</h2>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => window.location.href = "/"}
          >
            <X size={18} className="mr-1" />
            Close
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-7 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">
                Projects
                <Badge variant="secondary" className="ml-2">{allProjects.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="clients">
                Clients
                <Badge variant="secondary" className="ml-2">{allClients.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews
                {pendingReviews.length > 0 && (
                  <Badge variant="destructive" className="ml-2">{pendingReviews.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="messages">
                Messages
                {unreadMessages.length > 0 && (
                  <Badge variant="destructive" className="ml-2">{unreadMessages.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="notifications">
                Notifications
                <Badge variant="secondary" className="ml-2">{activeNotifications.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings2 size={14} className="mr-1" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid md:grid-cols-4 gap-6 mb-6">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("projects")}>
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-blue-600">{allProjects.length}</div>
                    <div className="text-sm text-muted-foreground">Total Projects</div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("reviews")}>
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-green-600">{allReviews.length}</div>
                    <div className="text-sm text-muted-foreground">Total Reviews</div>
                    {pendingReviews.length > 0 && (
                      <Badge variant="destructive" className="mt-2">{pendingReviews.length} pending</Badge>
                    )}
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("messages")}>
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-purple-600">{contactMessages.length}</div>
                    <div className="text-sm text-muted-foreground">Messages</div>
                    {unreadMessages.length > 0 && (
                      <Badge variant="destructive" className="mt-2">{unreadMessages.length} unread</Badge>
                    )}
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("notifications")}>
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-orange-600">{allNotifications.length}</div>
                    <div className="text-sm text-muted-foreground">Notifications</div>
                    <Badge variant="secondary" className="mt-2">{activeNotifications.length} active</Badge>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full" onClick={() => setActiveTab("projects")}>
                      <Plus size={18} className="mr-2" />
                      Add New Project
                    </Button>
                    <Button className="w-full" variant="outline" onClick={() => setActiveTab("clients")}>
                      <Plus size={18} className="mr-2" />
                      Add Client Logo
                    </Button>
                    <Button className="w-full" variant="outline" onClick={() => setActiveTab("notifications")}>
                      <Plus size={18} className="mr-2" />
                      Create Notification
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Image size={18} />
                      Profile Photo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {currentProfileImageUrl && (
                      <div className="flex justify-center">
                        <img src={currentProfileImageUrl} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-border" />
                      </div>
                    )}
                    <div>
                      <Label htmlFor="profile-image">Upload New Photo</Label>
                      <Input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProfileImageFile(e.target.files?.[0] || null)}
                      />
                    </div>
                    <Button
                      className="w-full"
                      disabled={!profileImageFile || uploadProfileImageMutation.isPending}
                      onClick={() => profileImageFile && uploadProfileImageMutation.mutate(profileImageFile)}
                    >
                      <Upload size={16} className="mr-2" />
                      {uploadProfileImageMutation.isPending ? "Uploading…" : "Upload Photo"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span>Latest Review</span>
                        <span className="text-muted-foreground">
                          {allReviews[0] ? formatDate(allReviews[0].createdAt) : "None"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Latest Message</span>
                        <span className="text-muted-foreground">
                          {contactMessages[0] ? formatDate(contactMessages[0].createdAt) : "None"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Latest Project</span>
                        <span className="text-muted-foreground">
                          {allProjects[0] ? formatDate(allProjects[0].createdAt) : "None"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{editingProject ? "Edit Project" : "Create New Project"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProjectSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={projectForm.title}
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          required={!editingProject}
                          placeholder="Project title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                        <Input
                          id="technologies"
                          value={projectForm.technologies}
                          onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                          placeholder="React, Node.js, MongoDB"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        required={!editingProject}
                        placeholder="Project description"
                        rows={3}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="liveUrl">Live URL</Label>
                        <Input
                          id="liveUrl"
                          type="url"
                          value={projectForm.liveUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                          placeholder="https://example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="githubUrl">GitHub URL</Label>
                        <Input
                          id="githubUrl"
                          type="url"
                          value={projectForm.githubUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                          placeholder="https://github.com/username/repo"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="image">Project Image</Label>
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setProjectForm({ ...projectForm, imageFile: e.target.files?.[0] || null })}
                        />
                        {editingProject?.imageUrl && !projectForm.imageFile && (
                          <p className="text-sm text-muted-foreground mt-1">Current image will be kept</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 pt-7">
                        <input
                          type="checkbox"
                          id="isVisible"
                          checked={projectForm.isVisible}
                          onChange={(e) => setProjectForm({ ...projectForm, isVisible: e.target.checked })}
                          className="rounded"
                        />
                        <Label htmlFor="isVisible" className="cursor-pointer">Visible on website</Label>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" disabled={createProjectMutation.isPending || updateProjectMutation.isPending}>
                        {editingProject ? (
                          <>
                            <Edit size={18} className="mr-2" />
                            Update Project
                          </>
                        ) : (
                          <>
                            <Plus size={18} className="mr-2" />
                            Create Project
                          </>
                        )}
                      </Button>
                      {editingProject && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingProject(null);
                            resetProjectForm();
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>All Projects ({allProjects.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {allProjects.map((project) => (
                      <div key={project.id} className="border rounded-lg p-4 flex gap-4">
                        {project.imageUrl && (
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-24 h-24 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-lg">{project.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                              {project.technologies && project.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {project.technologies.map((tech, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">{tech}</Badge>
                                  ))}
                                </div>
                              )}
                              <div className="flex gap-4 mt-2 text-sm">
                                {project.liveUrl && (
                                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    Live Demo
                                  </a>
                                )}
                                {project.githubUrl && (
                                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    GitHub
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant={project.isVisible ? "default" : "secondary"}>
                                {project.isVisible ? <Eye size={14} className="mr-1" /> : <EyeOff size={14} className="mr-1" />}
                                {project.isVisible ? "Visible" : "Hidden"}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEditingProject(project)}
                              >
                                <Edit size={14} className="mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteProjectMutation.mutate(project.id)}
                                disabled={deleteProjectMutation.isPending}
                              >
                                <Trash2 size={14} className="mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {allProjects.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No projects yet. Create your first project above!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Clients Tab */}
            <TabsContent value="clients" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{editingClient ? "Edit Client" : "Add New Client"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleClientSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="client-name">Client Name *</Label>
                        <Input
                          id="client-name"
                          value={clientForm.name}
                          onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                          required={!editingClient}
                          placeholder="BRAVEZM Gaming"
                        />
                      </div>
                      <div>
                        <Label htmlFor="client-initials">Initials (fallback) *</Label>
                        <Input
                          id="client-initials"
                          value={clientForm.initials}
                          onChange={(e) => setClientForm({ ...clientForm, initials: e.target.value })}
                          required={!editingClient}
                          placeholder="BZ"
                          maxLength={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="client-color">Fallback Color</Label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            id="client-color"
                            value={clientForm.color}
                            onChange={(e) => setClientForm({ ...clientForm, color: e.target.value })}
                            className="h-10 w-16 rounded border cursor-pointer"
                          />
                          <Input
                            value={clientForm.color}
                            onChange={(e) => setClientForm({ ...clientForm, color: e.target.value })}
                            placeholder="#4f9eff"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="client-logo">Logo Image (replaces initials)</Label>
                        <Input
                          id="client-logo"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setClientForm({ ...clientForm, imageFile: e.target.files?.[0] || null })}
                        />
                        {editingClient?.imageUrl && !clientForm.imageFile && (
                          <div className="flex items-center gap-2 mt-2">
                            <img src={editingClient.imageUrl} alt={editingClient.name} className="w-8 h-8 object-contain rounded border" />
                            <p className="text-sm text-muted-foreground">Current logo kept</p>
                          </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="client-order">Sort Order</Label>
                        <Input
                          id="client-order"
                          type="number"
                          value={clientForm.sortOrder}
                          onChange={(e) => setClientForm({ ...clientForm, sortOrder: parseInt(e.target.value) || 0 })}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="client-visible"
                        checked={clientForm.isVisible}
                        onChange={(e) => setClientForm({ ...clientForm, isVisible: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="client-visible" className="cursor-pointer">Visible on website</Label>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" disabled={createClientMutation.isPending || updateClientMutation.isPending}>
                        {editingClient ? (
                          <><Edit size={16} className="mr-2" />Update Client</>
                        ) : (
                          <><Plus size={16} className="mr-2" />Add Client</>
                        )}
                      </Button>
                      {editingClient && (
                        <Button type="button" variant="outline" onClick={() => { setEditingClient(null); resetClientForm(); }}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>All Clients ({allClients.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {allClients.map((client) => (
                      <div key={client.id} className="border rounded-lg p-4 flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                          style={{ background: client.imageUrl ? "transparent" : client.color, border: "1px solid #e5e7eb" }}
                        >
                          {client.imageUrl ? (
                            <img src={client.imageUrl} alt={client.name} className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-sm font-bold text-white">{client.initials}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{client.name}</h4>
                            <Badge variant={client.isVisible ? "default" : "secondary"}>
                              {client.isVisible ? <Eye size={12} className="mr-1" /> : <EyeOff size={12} className="mr-1" />}
                              {client.isVisible ? "Visible" : "Hidden"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Initials: {client.initials} · Order: {client.sortOrder}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => startEditingClient(client)}>
                            <Edit size={14} className="mr-1" />Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteClientMutation.mutate(client.id)}
                            disabled={deleteClientMutation.isPending}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {allClients.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No clients yet. Add your first client above. Until then, the default list will show.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Reviews ({pendingReviews.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingReviews.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No pending reviews</div>
                  ) : (
                    <div className="space-y-4">
                      {pendingReviews.map((review) => (
                        <div key={review.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{review.name}</h4>
                              <div className="flex items-center gap-2 my-2">
                                <div className="flex">{renderStars(review.rating)}</div>
                                <span className="text-sm text-muted-foreground">
                                  {formatDate(review.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm">{review.comment}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => approveReviewMutation.mutate(review.id)}
                                disabled={approveReviewMutation.isPending}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteReviewMutation.mutate(review.id)}
                                disabled={deleteReviewMutation.isPending}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Approved Reviews ({approvedReviews.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {approvedReviews.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No approved reviews</div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {approvedReviews.map((review) => (
                        <div key={review.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{review.name}</h4>
                              <div className="flex items-center gap-2 my-2">
                                <div className="flex">{renderStars(review.rating)}</div>
                                <span className="text-sm text-muted-foreground">
                                  {formatDate(review.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm">{review.comment}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteReviewMutation.mutate(review.id)}
                              disabled={deleteReviewMutation.isPending}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Messages ({contactMessages.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {contactMessages.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No messages</div>
                  ) : (
                    <div className="space-y-4">
                      {contactMessages.map((message) => (
                        <div key={message.id} className={`border rounded-lg p-4 ${!message.isRead ? "border-blue-300 bg-blue-50" : ""}`}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{message.name}</h4>
                                {!message.isRead && <Badge variant="destructive">New</Badge>}
                              </div>
                              <p className="text-sm text-muted-foreground">{message.email}</p>
                              {message.subject && (
                                <p className="text-sm font-medium mt-1">{message.subject}</p>
                              )}
                              <p className="text-sm mt-2">{message.message}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {formatDate(message.createdAt)}
                              </p>
                            </div>
                            {!message.isRead && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markMessageAsReadMutation.mutate(message.id)}
                                disabled={markMessageAsReadMutation.isPending}
                              >
                                Mark as Read
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create Site Notification</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      createNotificationMutation.mutate(notificationForm);
                    }}
                    className="space-y-4"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="notif-title">Title *</Label>
                        <Input
                          id="notif-title"
                          value={notificationForm.title}
                          onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
                          required
                          placeholder="Notification title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="notif-type">Type</Label>
                        <Select
                          value={notificationForm.type}
                          onValueChange={(value: any) => setNotificationForm({ ...notificationForm, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="info">Info</SelectItem>
                            <SelectItem value="success">Success</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="error">Error</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notif-message">Message *</Label>
                      <Textarea
                        id="notif-message"
                        value={notificationForm.message}
                        onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
                        required
                        placeholder="Notification message"
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="notif-active"
                        checked={notificationForm.isActive}
                        onChange={(e) => setNotificationForm({ ...notificationForm, isActive: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="notif-active" className="cursor-pointer">Active (visible to users)</Label>
                    </div>

                    <Button type="submit" disabled={createNotificationMutation.isPending}>
                      <Plus size={18} className="mr-2" />
                      Create Notification
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>All Notifications ({allNotifications.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {allNotifications.map((notification) => (
                      <div key={notification.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{notification.title}</h4>
                              <Badge variant={notification.type === "error" ? "destructive" : "secondary"}>
                                {notification.type}
                              </Badge>
                              <Badge variant={notification.isActive ? "default" : "secondary"}>
                                {notification.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <p className="text-sm">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Created: {formatDate(notification.createdAt)}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                toggleNotificationMutation.mutate({
                                  id: notification.id,
                                  isActive: !notification.isActive,
                                })
                              }
                            >
                              {notification.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteNotificationMutation.mutate(notification.id)}
                              disabled={deleteNotificationMutation.isPending}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {allNotifications.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No notifications yet. Create your first notification above!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              {/* Available for new projects */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                    Available for New Projects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Controls the green "Available for new projects" badge on the hero section.
                  </p>
                  {(() => {
                    const current = siteSettings.find(s => s.key === "available_for_projects")?.value;
                    const isAvailable = current !== "false";
                    return (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${isAvailable ? "bg-green-500" : "bg-gray-400"}`} />
                          <span className="text-sm font-medium">{isAvailable ? "Currently Available" : "Currently Unavailable"}</span>
                        </div>
                        <Button
                          size="sm"
                          variant={isAvailable ? "destructive" : "default"}
                          onClick={() => updateSettingMutation.mutate({ key: "available_for_projects", value: isAvailable ? "false" : "true" })}
                          disabled={updateSettingMutation.isPending}
                        >
                          {isAvailable ? "Mark as Unavailable" : "Mark as Available"}
                        </Button>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Logo Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image size={18} />
                    Navigation Logo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Upload a real logo image to replace the "M" text in the navigation bar.
                  </p>
                  {(() => {
                    const logoUrl = siteSettings.find(s => s.key === "logo_image_url")?.value;
                    return logoUrl ? (
                      <div className="flex items-center gap-3 p-3 border rounded-lg w-fit">
                        <img src={logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded" />
                        <span className="text-sm text-muted-foreground">Current logo</span>
                        <Button size="sm" variant="ghost" onClick={() => updateSettingMutation.mutate({ key: "logo_image_url", value: "" })}>
                          <X size={14} />
                        </Button>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No logo uploaded — showing "M" text</p>
                    );
                  })()}
                  <div className="space-y-2">
                    <Label htmlFor="logo-upload">Upload Logo Image</Label>
                    <Input id="logo-upload" type="file" accept="image/*" onChange={(e) => setLogoImageFile(e.target.files?.[0] || null)} />
                  </div>
                  <Button
                    disabled={!logoImageFile || uploadLogoMutation.isPending}
                    onClick={() => logoImageFile && uploadLogoMutation.mutate(logoImageFile)}
                  >
                    <Upload size={15} className="mr-2" />
                    {uploadLogoMutation.isPending ? "Uploading…" : "Upload Logo"}
                  </Button>
                </CardContent>
              </Card>

              {/* Profile Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image size={18} />
                    Contact Section Profile Photo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    This photo appears on the contact section of your portfolio.
                  </p>
                  {(() => {
                    const profileUrl = siteSettings.find(s => s.key === "profile_image_url")?.value;
                    return profileUrl ? (
                      <div className="flex items-center gap-3">
                        <img src={profileUrl} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-border" />
                        <div>
                          <p className="text-sm font-medium">Current photo</p>
                          <Button size="sm" variant="ghost" className="text-red-500 px-0 h-auto" onClick={() => updateSettingMutation.mutate({ key: "profile_image_url", value: "" })}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No photo uploaded — using default placeholder</p>
                    );
                  })()}
                  <div className="space-y-2">
                    <Label htmlFor="profile-upload-settings">Upload Profile Photo</Label>
                    <Input id="profile-upload-settings" type="file" accept="image/*" onChange={(e) => setProfileImageFile(e.target.files?.[0] || null)} />
                  </div>
                  <Button
                    disabled={!profileImageFile || uploadProfileImageMutation.isPending}
                    onClick={() => profileImageFile && uploadProfileImageMutation.mutate(profileImageFile)}
                  >
                    <Upload size={15} className="mr-2" />
                    {uploadProfileImageMutation.isPending ? "Uploading…" : "Upload Photo"}
                  </Button>
                </CardContent>
              </Card>

              {/* All current settings */}
              <Card>
                <CardHeader>
                  <CardTitle>All Site Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {siteSettings.filter(s => !["logo_image_url", "profile_image_url"].includes(s.key)).map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="text-sm font-mono font-medium">{setting.key}</p>
                          <p className="text-xs text-muted-foreground">{setting.value || "(empty)"}</p>
                        </div>
                        {setting.key === "available_for_projects" && (
                          <Badge variant={setting.value === "true" ? "default" : "secondary"}>
                            {setting.value === "true" ? "Available" : "Unavailable"}
                          </Badge>
                        )}
                      </div>
                    ))}
                    {siteSettings.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No settings yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
