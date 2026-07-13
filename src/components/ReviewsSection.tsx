import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

type Review = {
  id: string;
  author_name: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string | null;
};

export function ReviewsSection({ productId }: { productId: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("reviews")
      .select("id, author_name, rating, comment, created_at, user_id")
      .eq("product_id", productId)
      .eq("approved", true)
      .order("created_at", { ascending: false });
    setReviews((data ?? []) as Review[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [productId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!comment.trim()) return toast.error("Please write a short review");
    setSubmitting(true);
    const authorName =
      (user.user_metadata as { full_name?: string } | null)?.full_name ??
      user.email?.split("@")[0] ??
      "Anonymous";
    const { error } = await supabase.from("reviews").insert({
      product_id: productId,
      user_id: user.id,
      author_name: authorName,
      rating,
      comment: comment.trim(),
      approved: true,
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Thank you for your review 🌸");
    setComment("");
    setRating(5);
    load();
  };

  const alreadyReviewed = user && reviews.some((r) => r.user_id === user.id);

  return (
    <section className="mt-24 border-t border-border pt-12">
      <h2 className="font-serif text-3xl">Reviews</h2>

      <div className="mt-8 rounded-2xl border border-border bg-cream p-6">
        {!user ? (
          <p className="text-sm text-muted-foreground">
            <Link to="/auth" className="text-primary underline">
              Sign in
            </Link>{" "}
            to leave a review.
          </p>
        ) : alreadyReviewed ? (
          <p className="text-sm text-muted-foreground">
            You've already reviewed this piece. Thank you 🙏
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <p className="eyebrow mb-2">Your rating</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    aria-label={`${n} stars`}
                    className="p-1"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        n <= rating ? "fill-gold text-gold" : "text-border"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <label className="block">
              <span className="eyebrow">Your review</span>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 800))}
                required
                rows={4}
                className="input mt-2 w-full"
                placeholder="Share how this piece feels, fits, or arrived…"
              />
              <span className="mt-1 block text-right text-[10px] text-muted-foreground">
                {comment.length}/800
              </span>
            </label>
            <button disabled={submitting} className="btn-primary">
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Post review"
              )}
            </button>
          </form>
        )}
      </div>

      <div className="mt-10 space-y-6">
        {loading ? (
          <p className="text-muted-foreground">Loading reviews…</p>
        ) : reviews.length === 0 ? (
          <p className="text-muted-foreground">
            No reviews yet — be the first to share your story.
          </p>
        ) : (
          reviews.map((r) => (
            <article
              key={r.id}
              className="rounded-xl border border-border bg-background p-5"
            >
              <div className="flex items-center justify-between">
                <p className="font-serif text-lg">{r.author_name}</p>
                <div className="flex text-gold">
                  {"★".repeat(r.rating)}
                  <span className="text-border">{"★".repeat(5 - r.rating)}</span>
                </div>
              </div>
              <p className="mt-3 leading-relaxed text-foreground/80">
                {r.comment}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                {new Date(r.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
