import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import StarRating from "@/components/StarRating";
import type { Review } from "@shared/schema";

export default function ReviewsSection() {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["/api/reviews"],
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data: { name: string; email?: string; rating: number; comment: string }) => {
      await apiRequest("POST", "/api/reviews", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({
        title: "Thank you!",
        description: "Your review has been submitted and is pending approval.",
      });
      setRating(0);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      rating,
      comment: formData.get("comment") as string,
    };

    createReviewMutation.mutate(data);
    
    if (createReviewMutation.isSuccess) {
      e.currentTarget.reset();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
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

  if (isLoading) {
    return (
      <section id="reviews" className="section-padding gradient-bg">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Client Reviews</h2>
          </div>
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-muted rounded-full"></div>
                    <div>
                      <div className="h-4 w-32 bg-muted rounded mb-2"></div>
                      <div className="h-3 w-24 bg-muted rounded"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="reviews" className="section-padding gradient-bg">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Client Reviews</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            What people say about working with me
          </p>
        </div>

        {/* Add Review Form */}
        <Card className="shadow-lg mb-12">
          <CardContent className="p-8">
            <h3 className="text-2xl font-semibold text-primary mb-6">Leave a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="reviewer-name">Your Name *</Label>
                  <Input 
                    id="reviewer-name"
                    name="name" 
                    placeholder="Enter your name" 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="reviewer-email">Email *</Label>
                  <Input 
                    id="reviewer-email"
                    name="email" 
                    type="email"
                    placeholder="Enter your email" 
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label className="block mb-3">Rating *</Label>
                <StarRating rating={rating} onRatingChange={setRating} />
              </div>

              <div>
                <Label htmlFor="review-comment">Your Review *</Label>
                <Textarea 
                  id="review-comment"
                  name="comment" 
                  rows={4}
                  placeholder="Share your experience working with me..." 
                  required 
                />
              </div>

              <Button 
                type="submit" 
                className="btn-accent"
                disabled={createReviewMutation.isPending}
              >
                {createReviewMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>Submitting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>Submit Review
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Reviews Display */}
        <div className="space-y-8">
          {reviews.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <i className="fas fa-star text-4xl text-muted-foreground mb-4"></i>
                <h3 className="text-xl font-semibold text-primary mb-2">Reviews are being reviewed</h3>
                <p className="text-muted-foreground">Reviews are pending admin approval and will appear soon!</p>
              </CardContent>
            </Card>
          ) : (
            (reviews as Review[]).map((review: Review) => (
              <Card key={review.id} className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-semibold">
                        {getInitials(review.name)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary">{review.name}</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex text-yellow-400">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(review.createdAt?.toString() || "")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-foreground leading-relaxed">{review.comment}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
