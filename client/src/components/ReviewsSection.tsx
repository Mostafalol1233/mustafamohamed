import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import StarRating from "@/components/StarRating";
import type { Review } from "@shared/schema";
import { Star, Quote, Send, Users, TrendingUp, ThumbsUp } from "lucide-react";

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-4 h-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
    />
  ));
}

function formatDate(dateInput: string | Date | null | undefined) {
  if (!dateInput) return "Recently";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const diffDays = Math.ceil(Math.abs(Date.now() - date.getTime()) / 86400000);
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return `${Math.ceil(diffDays / 30)} months ago`;
}

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

const avatarColors = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-indigo-600",
  "from-green-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-pink-500 to-rose-600",
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ReviewsSection() {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [formKey, setFormKey] = useState(0);

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const mutation = useMutation({
    mutationFn: (data: { name: string; email: string; rating: number; comment: string }) =>
      apiRequest("POST", "/api/reviews", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({ title: "Review submitted!", description: "It'll appear after approval. Thank you!" });
      setRating(0);
      setFormKey((k) => k + 1);
    },
    onError: () => {
      toast({ title: "Submission failed", description: "Please try again.", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!rating) {
      toast({ title: "Rating required", description: "Please select a star rating.", variant: "destructive" });
      return;
    }
    const fd = new FormData(e.currentTarget);
    mutation.mutate({
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      rating,
      comment: fd.get("comment") as string,
    });
  };

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;
  const satisfaction = reviews.length
    ? Math.round((reviews.filter((r) => r.rating >= 4).length / reviews.length) * 100)
    : 0;

  return (
    <section id="reviews" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/[0.03] to-transparent pointer-events-none" />

      <div className="container-max relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Social proof</p>
          <h2 className="section-title gradient-text">Client Reviews</h2>
          <p className="section-subtitle mt-4">
            Honest words from people I've had the pleasure of working with.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="gradient-border p-7 sticky top-24">
              <h3 className="text-xl font-bold text-foreground mb-6">Leave a Review</h3>
              <form key={formKey} onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">Name *</label>
                    <input
                      name="name"
                      required
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                      data-testid="input-review-name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">Email *</label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                      data-testid="input-review-email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-3">Rating *</label>
                  <StarRating rating={rating} onRatingChange={setRating} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Your Review *</label>
                  <textarea
                    name="comment"
                    rows={4}
                    required
                    placeholder="Share your experience..."
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all text-sm resize-none"
                    data-testid="textarea-review-comment"
                  />
                </div>

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="btn-primary w-full justify-center"
                  data-testid="button-submit-review"
                >
                  {mutation.isPending ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {mutation.isPending ? "Submitting..." : "Submit Review"}
                </button>
              </form>

              {/* Mini stats */}
              {reviews.length > 0 && (
                <div className="mt-7 pt-6 border-t border-border grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-2xl font-bold text-amber-400">{avgRating.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Avg Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">{satisfaction}%</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Satisfied</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{reviews.length}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Reviews</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Reviews */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="glass-card h-32 animate-pulse" />
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground text-center">
                <Quote className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-lg font-medium">No reviews yet</p>
                <p className="text-sm mt-1">Be the first to share your experience!</p>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-4"
              >
                {reviews.map((review, idx) => (
                  <motion.div
                    key={review.id}
                    variants={itemVariants}
                    className="gradient-border p-6 hover:glow-primary transition-all duration-500 group"
                    data-testid={`card-review-${review.id}`}
                  >
                    {/* Quote icon */}
                    <Quote className="w-8 h-8 text-primary/20 mb-3" />

                    <p className="text-muted-foreground leading-relaxed text-sm mb-5 italic">
                      "{review.comment}"
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                          {getInitials(review.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground">{review.name}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
