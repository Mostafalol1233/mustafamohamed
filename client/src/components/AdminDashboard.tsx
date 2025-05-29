import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { Review, ContactMessage } from "@shared/schema";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: allReviews = [] } = useQuery({
    queryKey: ["/api/reviews/all"],
    enabled: isAuthenticated,
  });

  const { data: contactMessages = [] } = useQuery({
    queryKey: ["/api/contact/messages"],
    enabled: isAuthenticated,
  });

  const approveReviewMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PATCH", `/api/reviews/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews/all"] });
      toast({
        title: "Success",
        description: "Review approved successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve review",
        variant: "destructive",
      });
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews/all"] });
      toast({
        title: "Success",
        description: "Review deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
    },
  });

  const markMessageAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PUT", `/api/contact/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact/messages"] });
      toast({
        title: "Success",
        description: "Message marked as read!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark message as read",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.clear();
      setLocation("/");
      toast({
        title: "Success",
        description: "Logged out successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to logout",
        variant: "destructive",
      });
    },
  });

  const formatDate = (dateString: string) => {
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
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isAuthenticated) {
    return null;
  }

  const pendingReviews = allReviews.filter((review: Review) => !review.isApproved);
  const approvedReviews = allReviews.filter((review: Review) => review.isApproved);
  const unreadMessages = contactMessages.filter((msg: ContactMessage) => !msg.isRead);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">Admin Dashboard</h2>
          <div className="flex items-center space-x-4">
            <a 
              href="/api/logout"
              className="text-sm text-red-600 hover:text-red-800"
            >
              <i className="fas fa-sign-out-alt mr-1"></i>Logout
            </a>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <i className="fas fa-comments text-2xl text-blue-500 mr-3"></i>
                  <div>
                    <h3 className="text-2xl font-bold">{allReviews.length}</h3>
                    <p className="text-sm text-muted-foreground">Total Reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <i className="fas fa-clock text-2xl text-yellow-500 mr-3"></i>
                  <div>
                    <h3 className="text-2xl font-bold">{pendingReviews.length}</h3>
                    <p className="text-sm text-muted-foreground">Pending Reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <i className="fas fa-envelope text-2xl text-green-500 mr-3"></i>
                  <div>
                    <h3 className="text-2xl font-bold">{contactMessages.length}</h3>
                    <p className="text-sm text-muted-foreground">Messages</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <i className="fas fa-star text-2xl text-yellow-400 mr-3"></i>
                  <div>
                    <h3 className="text-2xl font-bold">
                      {approvedReviews.length > 0 
                        ? (approvedReviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / approvedReviews.length).toFixed(1)
                        : "0.0"
                      }
                    </h3>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reviews">
                Reviews Management
                {pendingReviews.length > 0 && (
                  <Badge variant="destructive" className="ml-2">{pendingReviews.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="messages">
                Contact Messages
                {unreadMessages.length > 0 && (
                  <Badge variant="destructive" className="ml-2">{unreadMessages.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Pending Reviews</h3>
                {pendingReviews.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <i className="fas fa-check-circle text-4xl text-green-500 mb-4"></i>
                      <p className="text-muted-foreground">No pending reviews</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {pendingReviews.map((review: Review) => (
                      <Card key={review.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                                {getInitials(review.name)}
                              </div>
                              <div>
                                <h4 className="font-semibold">{review.name}</h4>
                                <div className="flex items-center space-x-2">
                                  <div className="flex text-yellow-400 text-sm">
                                    {renderStars(review.rating)}
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(review.createdAt?.toString() || "")}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => approveReviewMutation.mutate(review.id)}
                                disabled={approveReviewMutation.isPending}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                <i className="fas fa-check mr-1"></i>Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteReviewMutation.mutate(review.id)}
                                disabled={deleteReviewMutation.isPending}
                              >
                                <i className="fas fa-trash mr-1"></i>Delete
                              </Button>
                            </div>
                          </div>
                          <p className="text-foreground text-sm">{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Approved Reviews</h3>
                {approvedReviews.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <i className="fas fa-star text-4xl text-yellow-400 mb-4"></i>
                      <p className="text-muted-foreground">No approved reviews yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {approvedReviews.map((review: Review) => (
                      <Card key={review.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                                {getInitials(review.name)}
                              </div>
                              <div>
                                <h4 className="font-semibold">{review.name}</h4>
                                <div className="flex items-center space-x-2">
                                  <div className="flex text-yellow-400 text-sm">
                                    {renderStars(review.rating)}
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(review.createdAt?.toString() || "")}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteReviewMutation.mutate(review.id)}
                              disabled={deleteReviewMutation.isPending}
                            >
                              <i className="fas fa-trash mr-1"></i>Delete
                            </Button>
                          </div>
                          <p className="text-foreground text-sm">{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="messages" className="space-y-4">
              {contactMessages.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <i className="fas fa-inbox text-4xl text-muted-foreground mb-4"></i>
                    <p className="text-muted-foreground">No contact messages</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {contactMessages.map((message: ContactMessage) => (
                    <Card key={message.id} className={!message.isRead ? "border-accent" : ""}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{message.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{message.email}</p>
                            {message.subject && (
                              <p className="text-sm font-medium text-primary">{message.subject}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {!message.isRead && (
                              <Badge variant="destructive">New</Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatDate(message.createdAt?.toString() || "")}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-foreground mb-3">{message.message}</p>
                        {!message.isRead && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markMessageAsReadMutation.mutate(message.id)}
                            disabled={markMessageAsReadMutation.isPending}
                          >
                            <i className="fas fa-check mr-2"></i>
                            Mark as Read
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
