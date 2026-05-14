import Link from "next/link";
import Image from "next/image";
import type { Movie } from "@/types/movie";
import { movieHref } from "@/lib/movies";

type Props = { movie: Movie };

// Tall poster card matching IMDb's "Top picks" tiles: poster on top, rating row,
// title, Watchlist button, Trailer link, three-dot menu.
export default function TopPickCard({ movie }: Props) {
  return (
    <div className="bg-bg-elevated border border-border rounded-lg overflow-hidden flex flex-col w-[180px] shrink-0 hover:border-accent transition-colors">
      <div className="relative">
        <Link href={movieHref(movie)} className="block">
          <div className="relative aspect-[2/3] bg-black">
            <Image
              src={movie.poster}
              alt={`${movie.title} poster`}
              fill
              sizes="180px"
              className="object-cover"
            />
          </div>
        </Link>
        {/* Watchlist + ribbon overlay top-left */}
        <button
          type="button"
          className="absolute top-0 left-0 w-9 h-12 bg-black/70 hover:bg-black/90 text-white text-lg font-bold flex items-start justify-center pt-1 rounded-br-md"
          aria-label="Add to watchlist"
        >
          +
        </button>
      </div>

      <div className="p-2 flex flex-col gap-1.5 flex-1">
        {/* Rating row */}
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-accent" />
            <span className="font-semibold">{movie.rating.toFixed(1)}</span>
          </span>
          <button
            type="button"
            className="text-link hover:text-link-hover"
            aria-label="Rate this"
          >
            <StarOutline className="w-4 h-4" />
          </button>
        </div>

        {/* Title */}
        <Link
          href={movieHref(movie)}
          className="text-sm leading-tight line-clamp-2 hover:text-accent"
        >
          {movie.title}
        </Link>

        {/* Watchlist CTA */}
        <button
          type="button"
          className="mt-1 bg-link/20 hover:bg-link/30 text-link rounded-full py-1 px-3 text-xs font-semibold flex items-center justify-center gap-1.5"
        >
          <span className="text-base leading-none">+</span> Watchlist
        </button>

        {/* Trailer + menu row */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="text-link hover:text-link-hover text-xs flex items-center gap-1"
          >
            <span className="text-sm">▶</span> Trailer
          </button>
          <button
            type="button"
            className="text-fg-muted hover:text-fg text-base leading-none px-1"
            aria-label="More options"
          >
            ⋯
          </button>
        </div>
      </div>
    </div>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18.2 22 12 18.3 5.8 22l1.7-7.2L2 10l7.1-1.1L12 2z" />
    </svg>
  );
}

function StarOutline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden
    >
      <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18.2 22 12 18.3 5.8 22l1.7-7.2L2 10l7.1-1.1L12 2z" />
    </svg>
  );
}
