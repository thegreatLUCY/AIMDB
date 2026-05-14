"use client";

import Image from "next/image";
import Link from "next/link";
import type { Movie } from "@/types/movie";
import { movieHref } from "@/lib/movies";

type Props = {
  featured: Movie;
  upNext: Movie[];
};

export default function FeaturedHero({ featured, upNext }: Props) {
  const hero = featured.stills[0] ?? featured.poster;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
      {/* MAIN FEATURED PANEL */}
      <Link
        href={movieHref(featured)}
        className="relative aspect-video rounded-lg overflow-hidden bg-black border border-border group block"
      >
        <Image
          src={hero}
          alt={featured.title}
          fill
          sizes="(max-width: 1024px) 100vw, 70vw"
          priority
          className="object-cover group-hover:scale-[1.02] transition-transform"
        />
        {/* Dark gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Left "AIMDb SPOTLIGHT" ribbon — IMDb has "FAN QUESTIONS" here */}
        <div className="absolute left-0 top-0 bottom-0 w-[90px] bg-bg-elevated/70 backdrop-blur-sm flex flex-col items-center justify-between py-4 border-r border-border">
          <div className="bg-accent text-black font-bold text-sm px-1.5 py-0.5 rounded">
            AIMDb
          </div>
          <div className="text-fg [writing-mode:vertical-rl] [transform:rotate(180deg)] font-bold text-2xl tracking-wide">
            SPOTLIGHT
          </div>
          <span className="text-fg-muted text-xs">▼</span>
        </div>

        {/* Prev / Next arrows */}
        <button
          type="button"
          className="absolute left-[100px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center text-2xl"
          aria-label="Previous"
          onClick={(e) => e.preventDefault()}
        >
          ‹
        </button>
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center text-2xl"
          aria-label="Next"
          onClick={(e) => e.preventDefault()}
        >
          ›
        </button>

        {/* Center play button */}
        <div className="absolute left-[140px] top-1/2 -translate-y-1/2">
          <span className="w-14 h-14 rounded-full bg-black/60 border-2 border-white/80 text-white flex items-center justify-center text-xl">
            ▶
          </span>
        </div>

        {/* Bottom title block */}
        <div className="absolute left-[120px] right-12 bottom-4 text-white">
          <p className="font-semibold text-lg leading-tight line-clamp-2">
            {featured.tagline ? (
              <>&ldquo;{featured.tagline}&rdquo; — {featured.title}</>
            ) : (
              featured.title
            )}
          </p>
          <p className="text-sm text-white/80">Watch the trailer</p>
        </div>

        {/* Duration top-right */}
        <span className="absolute right-3 top-3 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
          1:30
        </span>

        {/* Reactions bottom-right */}
        <div className="absolute right-4 bottom-4 flex items-center gap-3 text-white text-xs">
          <span className="flex items-center gap-1">👍 {formatCount(featured.voteCount, 0.002)}</span>
          <span className="flex items-center gap-1">❤️ {formatCount(featured.voteCount, 0.0009)}</span>
        </div>
      </Link>

      {/* UP NEXT SIDEBAR */}
      <aside>
        <h2 className="text-accent font-bold text-base mb-2">Up next</h2>
        <ul className="space-y-2">
          {upNext.map((m) => (
            <li key={m.id}>
              <Link
                href={movieHref(m)}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-bg-elevated transition-colors group"
              >
                <div className="relative w-[88px] h-[60px] shrink-0 bg-black rounded overflow-hidden border border-border">
                  <Image
                    src={m.stills[0] ?? m.poster}
                    alt={m.title}
                    fill
                    sizes="88px"
                    className="object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-white/95 text-lg">
                    ▶
                  </span>
                  <span className="absolute right-1 bottom-1 bg-black/70 text-white text-[10px] px-1 rounded">
                    {randomDuration(m.id)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium line-clamp-2 leading-tight group-hover:text-accent">
                    {m.title}
                  </p>
                  <p className="text-xs text-fg-muted">Watch the trailer</p>
                  <p className="text-xs text-fg-muted mt-0.5">
                    👍 {formatCount(m.voteCount, 0.0015)} &nbsp; ❤️ {formatCount(m.voteCount, 0.0008)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="text-link hover:text-link-hover hover:underline text-sm font-semibold mt-2"
        >
          Browse trailers ›
        </button>
      </aside>
    </section>
  );
}

function formatCount(votes: number, factor: number): string {
  const n = Math.max(8, Math.round(votes * factor));
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

// Deterministic 'duration' per movie id so it doesn't flicker on rerender.
function randomDuration(id: string): string {
  const seed = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const total = 45 + (seed % 145); // 45–190 seconds
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
