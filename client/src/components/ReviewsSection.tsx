import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import StarRating from "@/components/StarRating";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Review } from "@shared/schema";

// Import customer images
import sarahImage from "@/assets/customer-sarah.png";
import emilyImage from "@/assets/customer-emily.png";

export default function ReviewsSection() {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; rating: number; comment: string }) => {
      await apiRequest("POST", "/api/reviews", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({
        title: "Thank you!",
        description: "Your review has been submitted successfully! It will be visible after approval.",
      });
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
    
    // Reset form
    e.currentTarget.reset();
    setRating(0);
  };

  const formatDate = (dateInput: string | Date | null | undefined) => {
    if (!dateInput) return "Recently";
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
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

  const getCustomerImage = (name: string) => {
    if (name === "Sarah Johnson") return sarahImage;
    if (name === "Emily Rodriguez") return emilyImage;
    return null; // Return null for male customers to use initials
  };

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
                className="btn-primary"
              >
                Submit Review
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Reviews Display */}
        <div className="grid lg:grid-cols-2 gap-8">
          {isLoading ? (
            <div className="col-span-2 text-center py-8">
              <p className="text-muted-foreground">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="col-span-2 text-center py-8">
              <p className="text-muted-foreground">No reviews yet. Be the first to leave a review!</p>
            </div>
          ) : (
            reviews.map((review) => (
            <Card key={review.id} className="bg-card shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  {getCustomerImage(review.name) ? (
                    <img 
                      src={getCustomerImage(review.name)!} 
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                      {getInitials(review.name)}
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-primary">{review.name}</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex text-lg">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-muted-foreground text-sm">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
              </CardContent>
            </Card>
            ))
          )}
        </div>

        {/* Reviews Summary */}
        {reviews.length > 0 && (
          <div className="mt-16 text-center">
            <div className="bg-card rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-primary mb-4">Customer Satisfaction</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-yellow-500 mb-2">
                    {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                  </div>
                  <div className="text-lg flex justify-center mb-1">
                    {renderStars(Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length))}
                  </div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{reviews.length}+</div>
                  <div className="text-sm text-muted-foreground">Happy Clients</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}