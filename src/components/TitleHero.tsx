import type { Movie } from "@/types/movie";
import RatingWidget from "./RatingWidget";
import Backdrop from "./Backdrop";

type Props = { movie: Movie };

function formatRuntime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function TitleHero({ movie }: Props) {
  return (
    <Backdrop src={movie.stills[0] ?? movie.poster} alt={movie.title}>
      {/* Top utility nav — IMDb's "Cast & crew · User reviews · Trivia · FAQ · All topics" strip */}
      <nav className="hidden md:flex items-center justify-end gap-x-4 text-sm text-fg-muted pt-2 pb-4 border-b border-border/50">
        <UtilLink>Cast &amp; crew</UtilLink>
        <Dot />
        <UtilLink>User reviews</UtilLink>
        <Dot />
        <UtilLink>Trivia</UtilLink>
        <Dot />
        <UtilLink>FAQ</UtilLink>
        <Dot />
        <UtilLink>AIMDbPro</UtilLink>
        <span className="opacity-30">|</span>
        <button type="button" className="hover:text-fg" aria-label="All topics">
          <GridIcon />
        </button>
        <button type="button" className="hover:text-fg" aria-label="Share">
          <ShareIcon />
        </button>
      </nav>

      {/* Hero header row: title + meta on the left, 3-cell rating on the right. */}
      <div className="flex items-start justify-between gap-6 flex-wrap pt-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            {movie.title}
          </h1>
          <div className="text-fg-muted text-sm mt-2 flex flex-wrap items-center gap-x-2.5">
            <span className="text-fg-muted">{movie.year}</span>
            {movie.certification && (
              <>
                <Dot />
                <span className="border border-fg-muted/60 rounded-sm px-1.5 py-0.5 text-[11px] font-semibold text-fg-muted">
                  {movie.certification}
                </span>
              </>
            )}
            <Dot />
            <span>{formatRuntime(movie.runtime)}</span>
          </div>
        </div>

        <RatingWidget
          rating={movie.rating}
          voteCount={movie.voteCount}
          popularity={movie.popularity}
          popularityChange={movie.popularityChange}
        />
      </div>
    </Backdrop>
  );
}

function UtilLink({ children }: { children: React.ReactNode }) {
  return (
    <button type="button" className="hover:text-fg whitespace-nowrap">
      {children}
    </button>
  );
}

function Dot() {
  return <span className="text-fg-muted/50">·</span>;
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}
