import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import StarRating from "@/components/StarRating";
import type { Review } from "@shared/schema";
import { Send } from "lucide-react";

function renderStars(n: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} style={{ color: i < n ? "#f59e0b" : "#d1d5db", fontSize: "15px" }}>★</span>
  ));
}

function timeSince(d: string | Date | null | undefined) {
  if (!d) return "Recently";
  const diff = Math.ceil(Math.abs(Date.now() - new Date(d).getTime()) / 86400000);
  if (diff < 2) return "1 day ago";
  if (diff < 7) return `${diff} days ago`;
  if (diff < 30) return `${Math.ceil(diff / 7)} weeks ago`;
  return `${Math.ceil(diff / 30)} months ago`;
}

function initials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

const avatarBgs = ["#4f46e5", "#0891b2", "#16a34a", "#d97706", "#db2777", "#7c3aed"];

export default function ReviewsSection() {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [key, setKey] = useState(0);

  const { data: reviews = [], isLoading } = useQuery<Review[]>({ queryKey: ["/api/reviews"] });

  const mutation = useMutation({
    mutationFn: (data: { name: string; email: string; rating: number; comment: string }) =>
      apiRequest("POST", "/api/reviews", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({ title: "Review submitted!", description: "It'll appear after approval. Thank you!" });
      setRating(0);
      setKey(k => k + 1);
    },
    onError: () => toast({ title: "Error", description: "Please try again.", variant: "destructive" }),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!rating) { toast({ title: "Rating required", description: "Please select a star rating.", variant: "destructive" }); return; }
    const fd = new FormData(e.currentTarget);
    mutation.mutate({ name: fd.get("name") as string, email: fd.get("email") as string, rating, comment: fd.get("comment") as string });
  };

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";
  const sat = reviews.length ? Math.round(reviews.filter(r => r.rating >= 4).length / reviews.length * 100) : 0;

  return (
    <section id="reviews" className="section-padding">
      <div className="container-max">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <span className="section-eyebrow">Testimonials</span>
          <h2 className="section-title">Client Reviews</h2>
          <p className="section-subtitle">What clients say after working together — unfiltered and honest.</p>
        </div>

        {/* Stats bar */}
        {reviews.length > 0 && (
          <div className="flex items-center gap-6 mb-10 flex-wrap">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">{avg}</span>
              <div className="flex">{renderStars(Math.round(Number(avg)))}</div>
            </div>
            <div className="w-px h-10 bg-border hidden sm:block" />
            <div>
              <span className="text-2xl font-bold text-foreground">{sat}%</span>
              <span className="text-sm text-muted-foreground ml-2">satisfaction rate</span>
            </div>
            <div className="w-px h-10 bg-border hidden sm:block" />
            <div>
              <span className="text-2xl font-bold text-foreground">{reviews.length}</span>
              <span className="text-sm text-muted-foreground ml-2">total reviews</span>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Reviews list */}
          <div className="lg:col-span-2 space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-28 rounded-xl bg-secondary animate-pulse" />)
            ) : reviews.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground text-sm border border-border rounded-2xl">
                No reviews yet — be the first!
              </div>
            ) : (
              reviews.map((r, i) => (
                <div key={r.id} className="card-hover p-5" data-testid={`card-review-${r.id}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: avatarBgs[i % avatarBgs.length] }}>
                      {initials(r.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-semibold text-sm text-foreground">{r.name}</span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{timeSince(r.createdAt)}</span>
                      </div>
                      <div className="flex mb-2">{renderStars(r.rating)}</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">"{r.comment}"</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Submit form */}
          <div className="lg:col-span-1">
            <div className="card-base p-6 sticky top-24">
              <h3 className="font-semibold text-sm text-foreground mb-5">Leave a review</h3>
              <form key={key} onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Name *</label>
                  <input name="name" required placeholder="Your name"
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                    data-testid="input-review-name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email *</label>
                  <input name="email" type="email" required placeholder="your@email.com"
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                    data-testid="input-review-email" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2">Rating *</label>
                  <StarRating rating={rating} onRatingChange={setRating} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Review *</label>
                  <textarea name="comment" rows={4} required placeholder="Share your experience..."
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all resize-none"
                    data-testid="textarea-review-comment" />
                </div>
                <button type="submit" disabled={mutation.isPending} className="btn-accent w-full justify-center" data-testid="button-submit-review">
                  {mutation.isPending
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Send className="w-4 h-4" />}
                  {mutation.isPending ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
