// 3-cell rating widget: AIMDb Rating | Your Rating | Popularity.
// Matches IMDb's title-page widget structure: each cell has an uppercase header
// and a content block below.

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18.2 22 12 18.3 5.8 22l1.7-7.2L2 10l7.1-1.1L12 2z" />
    </svg>
  );
}

function StarOutline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18.2 22 12 18.3 5.8 22l1.7-7.2L2 10l7.1-1.1L12 2z" />
    </svg>
  );
}

function formatVotes(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

type Props = {
  rating: number;
  voteCount: number;
  popularity?: number;
  popularityChange?: number;
};

export default function RatingWidget({
  rating,
  voteCount,
  popularity,
  popularityChange,
}: Props) {
  return (
    <div className="flex items-stretch text-left">
      {/* Cell 1: AIMDb Rating */}
      <Cell label="AIMDb Rating">
        <div className="flex items-center gap-1">
          <Star className="w-5 h-5 text-accent" />
          <span className="text-xl font-bold leading-none">
            {rating.toFixed(1)}
          </span>
          <span className="text-xs text-fg-muted leading-none">/10</span>
        </div>
        <p className="text-xs text-fg-muted mt-1">{formatVotes(voteCount)}</p>
      </Cell>

      {/* Cell 2: Your Rating (interactive stub) */}
      <Cell label="Your Rating" divided>
        <button
          type="button"
          className="flex items-center gap-1 group cursor-pointer"
          aria-label="Rate this movie"
        >
          <StarOutline className="w-5 h-5 text-link group-hover:text-link-hover" />
          <span className="text-link text-base font-semibold group-hover:text-link-hover">
            Rate
          </span>
        </button>
        <p className="text-xs text-fg-muted mt-1">&nbsp;</p>
      </Cell>

      {/* Cell 3: Popularity */}
      {popularity !== undefined && (
        <Cell label="Popularity" divided>
          <div className="flex items-center gap-1.5">
            <PopularityIcon change={popularityChange} />
            <span className="text-xl font-bold leading-none">
              {popularity.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-fg-muted mt-1">
            {popularityChange === undefined
              ? " "
              : popularityChange > 0
              ? `${popularityChange}`
              : popularityChange < 0
              ? `${Math.abs(popularityChange)}`
              : "no change"}
          </p>
        </Cell>
      )}
    </div>
  );
}

function Cell({
  label,
  divided,
  children,
}: {
  label: string;
  divided?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        "px-4 py-2 min-w-[110px] " +
        (divided ? "border-l border-border" : "")
      }
    >
      <p className="text-[10px] uppercase tracking-wider text-fg-muted font-semibold mb-1">
        {label}
      </p>
      {children}
    </div>
  );
}

// Directional arrow like IMDb's: → followed by trend size for popularity.
function PopularityIcon({ change }: { change?: number }) {
  if (change === undefined || change === 0) {
    return <span className="text-fg-muted text-xl leading-none">→</span>;
  }
  if (change > 0) {
    // Moved up = green up-right arrow
    return (
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5 text-green-500"
        fill="currentColor"
        aria-hidden
      >
        <path d="M7 17L17 7M17 7H9M17 7v8" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // Moved down = red down-right arrow
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-red-500" fill="none" aria-hidden>
      <path d="M7 7L17 17M17 17H9M17 17V9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
