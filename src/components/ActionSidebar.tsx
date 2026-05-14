import type { Movie } from "@/types/movie";

type Props = { movie: Movie };

function formatLargeCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

export default function ActionSidebar({ movie }: Props) {
  return (
    <aside className="space-y-3">
      {/* Streaming/theater placeholder */}
      <div className="bg-bg-elevated border border-border rounded-lg p-3">
        <p className="text-[10px] uppercase tracking-wider text-accent font-semibold mb-2">
          Streaming
        </p>
        <button
          type="button"
          className="w-full bg-bg border border-border rounded px-3 py-2 text-sm text-fg hover:border-accent flex items-center justify-between"
        >
          <span>See where to watch</span>
          <span>›</span>
        </button>
        <button
          type="button"
          className="w-full mt-2 text-link hover:text-link-hover text-sm flex items-center gap-1"
        >
          <GearIcon /> Set your preferred services
        </button>
      </div>

      {/* Add to Watchlist — yellow CTA */}
      <button
        type="button"
        className="w-full bg-accent hover:brightness-110 text-black font-bold rounded-full py-3 px-5 flex items-center justify-between transition-all"
      >
        <span className="flex items-center gap-2">
          <span className="text-xl leading-none">+</span>
          <span className="text-left leading-tight">
            <span className="block">Add to Watchlist</span>
            {movie.watchlistCount !== undefined && (
              <span className="block text-[11px] font-medium opacity-80">
                Added by {formatLargeCount(movie.watchlistCount)} users
              </span>
            )}
          </span>
        </span>
        <span>▾</span>
      </button>

      {/* Mark as watched */}
      <button
        type="button"
        className="w-full bg-bg-elevated border border-border rounded-full py-2 px-4 text-sm text-fg-muted hover:text-fg hover:border-accent flex items-center justify-center gap-2"
      >
        <EyeIcon /> Mark as watched
      </button>

      {/* Stats strip: user reviews · critic reviews · metascore */}
      <div className="flex items-center gap-x-4 flex-wrap text-sm pt-2">
        <button
          type="button"
          className="text-link hover:text-link-hover hover:underline"
        >
          <span className="font-bold">{movie.reviews.length}</span> User reviews
        </button>
        {movie.criticReviewCount !== undefined && (
          <button
            type="button"
            className="text-link hover:text-link-hover hover:underline"
          >
            <span className="font-bold">{movie.criticReviewCount}</span> Critic
            reviews
          </button>
        )}
        {movie.metascore !== undefined && (
          <div className="flex items-center gap-1.5">
            <MetascoreBadge score={movie.metascore} />
            <span className="text-link hover:text-link-hover hover:underline cursor-pointer">
              Metascore
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}

// Metascore badge with traffic-light coloring (green/yellow/red), like IMDb.
function MetascoreBadge({ score }: { score: number }) {
  const color =
    score >= 61
      ? "bg-green-600"
      : score >= 40
      ? "bg-yellow-500 text-black"
      : "bg-red-600";
  return (
    <span
      className={`${color} text-white text-xs font-bold w-7 h-6 flex items-center justify-center rounded-sm`}
    >
      {score}
    </span>
  );
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
      <path d="M12 8a4 4 0 100 8 4 4 0 000-8zm9 5h-2.07a7 7 0 01-1.07 2.58l1.46 1.46-2.83 2.83-1.46-1.46A7 7 0 0113 20.93V23h-2v-2.07a7 7 0 01-2.58-1.07L6.96 21.32 4.13 18.49l1.46-1.46A7 7 0 014.07 13H2v-2h2.07c.13-.93.49-1.79 1-2.56L3.61 6.98 6.44 4.15l1.46 1.46A7 7 0 0111 4.07V2h2v2.07c.93.13 1.79.49 2.56 1l1.46-1.46 2.83 2.83-1.46 1.46c.51.77.87 1.63 1 2.56H23v2h-2z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
