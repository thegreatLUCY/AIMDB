import type { Review } from "@/types/movie";
import RatingBadge from "./RatingBadge";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="bg-bg-elevated border border-border rounded-lg p-4">
      <div className="flex items-center gap-3 mb-2">
        <RatingBadge rating={review.rating} size="sm" />
        <h4 className="font-semibold">{review.title}</h4>
      </div>
      <p className="text-sm text-fg-muted mb-2">by {review.author}</p>
      <p className="text-sm leading-relaxed">{review.body}</p>
    </article>
  );
}
