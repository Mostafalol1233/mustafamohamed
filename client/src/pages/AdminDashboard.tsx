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
  Users
} from "lucide-react";
import { useEffect } from "react";
import type { Review, ContactMessage, Project, Certificate, Notification } from "@shared/schema";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

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
      toast({
        title: "Success",
        description: "Project deleted successfully!",
      });
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
          <TabsList className="grid w-full grid-cols-6 lg:w-auto" data-testid="tabs-navigation">
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
                <CardTitle className="flex items-center">
                  <FolderGit2 className="w-5 h-5 mr-2 text-purple-500" />
                  Projects Management
                </CardTitle>
                <CardDescription>
                  Manage portfolio projects ({projects.length} total, {stats.visibleProjects} visible)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.length === 0 ? (
                    <p className="text-gray-500 text-center py-8" data-testid="text-no-projects">No projects found</p>
                  ) : (
                    projects.map((project) => (
                      <div key={project.id} className="border rounded-lg p-4 space-y-2" data-testid={`card-project-${project.id}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold" data-testid={`text-project-title-${project.id}`}>{project.title}</h4>
                              <Badge variant={project.isVisible ? "default" : "secondary"} data-testid={`badge-project-status-${project.id}`}>
                                {project.isVisible ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                                {project.isVisible ? "Visible" : "Hidden"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                            {project.technologies && project.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {project.technologies.map((tech, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <div className="flex gap-2 mt-2 text-xs text-gray-500">
                              {project.liveUrl && (
                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:underline" data-testid={`link-project-live-${project.id}`}>
                                  🔗 Live Demo
                                </a>
                              )}
                              {project.githubUrl && (
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline" data-testid={`link-project-github-${project.id}`}>
                                  📂 GitHub
                                </a>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteProjectMutation.mutate(project.id)}
                            disabled={deleteProjectMutation.isPending}
                            data-testid={`button-delete-project-${project.id}`}
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

          {/* Certificates Tab */}
          <TabsContent value="certificates">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-orange-500" />
                  Certificates Management
                </CardTitle>
                <CardDescription>
                  Manage professional certificates ({certificates.length} total)
                </CardDescription>
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
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold" data-testid={`text-certificate-title-${cert.id}`}>{cert.title}</h4>
                              <Badge variant={cert.isVisible ? "default" : "secondary"} data-testid={`badge-certificate-status-${cert.id}`}>
                                {cert.isVisible ? "Visible" : "Hidden"}
                              </Badge>
                            </div>
                            {cert.description && <p className="text-sm text-gray-600 mt-1">{cert.description}</p>}
                            {cert.issueDate && (
                              <p className="text-xs text-gray-500 mt-1">Issued: {cert.issueDate}</p>
                            )}
                            {cert.imageUrl && (
                              <img src={cert.imageUrl} alt={cert.title} className="mt-2 max-w-xs rounded border" />
                            )}
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
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-red-500" />
                  Notifications Management
                </CardTitle>
                <CardDescription>
                  Manage site-wide notifications ({notifications.length} total, {stats.activeNotifications} active)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.length === 0 ? (
                    <p className="text-gray-500 text-center py-8" data-testid="text-no-notifications">No notifications found</p>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif.id} className="border rounded-lg p-4 space-y-2" data-testid={`card-notification-${notif.id}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold" data-testid={`text-notification-title-${notif.id}`}>{notif.title}</h4>
                              <Badge variant={notif.isActive ? "default" : "secondary"} data-testid={`badge-notification-status-${notif.id}`}>
                                {notif.isActive ? "Active" : "Inactive"}
                              </Badge>
                              <Badge variant="outline">{notif.type}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              Created: {formatDate(notif.createdAt!)}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleNotificationMutation.mutate({ 
                                id: notif.id, 
                                isActive: !notif.isActive 
                              })}
                              disabled={toggleNotificationMutation.isPending}
                              data-testid={`button-toggle-notification-${notif.id}`}
                            >
                              {notif.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteNotificationMutation.mutate(notif.id)}
                              disabled={deleteNotificationMutation.isPending}
                              data-testid={`button-delete-notification-${notif.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
