type Props = {
  rating: number;
  voteCount?: number;
  size?: "sm" | "md" | "lg";
};

// Star icon as inline SVG so we don't add an icon library.
function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18.2 22 12 18.3 5.8 22l1.7-7.2L2 10l7.1-1.1L12 2z" />
    </svg>
  );
}

export default function RatingBadge({ rating, voteCount, size = "md" }: Props) {
  const dim = {
    sm: { star: "w-3 h-3", num: "text-xs", votes: "text-[10px]" },
    md: { star: "w-4 h-4", num: "text-sm", votes: "text-xs" },
    lg: { star: "w-6 h-6", num: "text-2xl", votes: "text-sm" },
  }[size];

  return (
    <div className="flex items-center gap-1">
      <Star className={`${dim.star} text-accent`} />
      <span className={`${dim.num} font-semibold`}>{rating.toFixed(1)}</span>
      {voteCount !== undefined && (
        <span className={`${dim.votes} text-fg-muted ml-1`}>
          ({formatVotes(voteCount)})
        </span>
      )}
    </div>
  );
}

function formatVotes(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
