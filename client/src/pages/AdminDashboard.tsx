import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: allReviews = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/reviews"],
  });

  const { data: contactMessages = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/contact"],
  });

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
      <i
        key={i}
        className={`fas fa-star ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage reviews and contact messages</p>
          </div>
          <Button
            onClick={() => logoutMutation.mutate()}
            variant="outline"
            disabled={logoutMutation.isPending}
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Logout
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Reviews Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-star mr-2 text-yellow-500"></i>
                Reviews Management
              </CardTitle>
              <CardDescription>
                Manage and moderate user reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {allReviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No reviews found</p>
                ) : (
                  allReviews.map((review: any) => (
                    <div key={review.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{review.name}</h4>
                          <div className="flex items-center space-x-2">
                            <div className="flex">{renderStars(review.rating)}</div>
                            <Badge variant={review.approved ? "default" : "secondary"}>
                              {review.approved ? "Approved" : "Pending"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {!review.approved && (
                            <Button
                              size="sm"
                              onClick={() => approveReviewMutation.mutate(review.id)}
                              disabled={approveReviewMutation.isPending}
                            >
                              <i className="fas fa-check mr-1"></i>
                              Approve
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteReviewMutation.mutate(review.id)}
                            disabled={deleteReviewMutation.isPending}
                          >
                            <i className="fas fa-trash mr-1"></i>
                            Delete
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                      <p className="text-xs text-gray-400">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-envelope mr-2 text-blue-500"></i>
                Contact Messages
              </CardTitle>
              <CardDescription>
                View and manage contact form submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {contactMessages.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No messages found</p>
                ) : (
                  contactMessages.map((message: any) => (
                    <div key={message.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{message.name}</h4>
                          <p className="text-sm text-gray-600">{message.email}</p>
                          {message.subject && (
                            <p className="text-sm font-medium text-gray-800">
                              {message.subject}
                            </p>
                          )}
                        </div>
                        <Badge variant={message.read ? "default" : "destructive"}>
                          {message.read ? "Read" : "Unread"}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm">{message.message}</p>
                      <p className="text-xs text-gray-400">
                        {formatDate(message.createdAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}