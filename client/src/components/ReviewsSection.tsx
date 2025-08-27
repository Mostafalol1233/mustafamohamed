import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import StarRating from "@/components/StarRating";

// Import customer images
import sarahImage from "@/assets/customer-sarah.png";
import emilyImage from "@/assets/customer-emily.png";

export default function ReviewsSection() {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);

  // 4 selected reviews with mixed Arabic and English
  const staticReviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@techco.com",
      rating: 5,
      comment: "مصطفى مطور محترف وموهوب جداً. أنجز لنا موقع ويب متكامل للشركة في وقت قياسي وبجودة عالية. التصميم رائع والبرمجة احترافية.",
      isApproved: true,
      createdAt: "2024-08-15T10:30:00Z",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "m.chen@business.net",
      rating: 5,
      comment: "أسلوب عمل محترف ونتائج مميزة. طور لنا نظام إدارة مخصص حسّن من كفاءة العمل بشكل كبير. سرعة في التنفيذ وجودة عالية.",
      isApproved: true,
      createdAt: "2024-07-28T16:45:00Z",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@agency.ae",
      rating: 5,
      comment: "مصطفى خبير في استراتيجية المحتوى والتسويق الرقمي. ساعدنا في تطوير خطة محتوى متكاملة ونفذها بإبداع. النتائج فاقت توقعاتنا.",
      isApproved: true,
      createdAt: "2024-08-05T09:15:00Z",
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david.wilson@media.co",
      rating: 5,
      comment: "خبرة مصطفى في السوقين العربي والإنجليزي كانت لا تقدر بثمن. استراتيجية المحتوى ثنائية اللغة وتطوير الويب RTL تم تنفيذهما بشكل مثالي.",
      isApproved: true,
      createdAt: "2024-07-12T08:20:00Z",
    }
  ];

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

    // Show success message (no actual database save)
    toast({
      title: "Thank you!",
      description: "Your review has been submitted successfully! It will be visible after approval.",
    });
    
    // Reset form
    e.currentTarget.reset();
    setRating(0);
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
          {staticReviews.map((review) => (
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
          ))}
        </div>

        {/* Reviews Summary */}
        <div className="mt-16 text-center">
          <div className="bg-card rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-primary mb-4">Customer Satisfaction</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-yellow-500 mb-2">5.0</div>
                <div className="text-lg flex justify-center mb-1">
                  {renderStars(5)}
                </div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{staticReviews.length}+</div>
                <div className="text-sm text-muted-foreground">Happy Clients</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}