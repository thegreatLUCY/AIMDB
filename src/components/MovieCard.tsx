import Link from "next/link";
import Image from "next/image";
import type { Movie } from "@/types/movie";
import { movieHref } from "@/lib/movies";
import RatingBadge from "./RatingBadge";

type Props = { movie: Movie };

export default function MovieCard({ movie }: Props) {
  return (
    <Link
      href={movieHref(movie)}
      className="group block bg-bg-elevated rounded-lg overflow-hidden border border-border hover:border-accent transition-colors"
    >
      <div className="relative aspect-[2/3] bg-black">
        {/* next/image needs width+height OR fill. We use fill inside an aspect-ratio container. */}
        <Image
          src={movie.poster}
          alt={`${movie.title} poster`}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 200px"
          className="object-cover group-hover:opacity-90"
        />
      </div>
      <div className="p-2">
        <RatingBadge rating={movie.rating} size="sm" />
        <h3 className="mt-1 text-sm font-medium leading-tight line-clamp-2">
          {movie.title}
        </h3>
        <p className="text-xs text-fg-muted">{movie.year}</p>
      </div>
    </Link>
  );
}
