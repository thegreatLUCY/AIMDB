import Image from "next/image";
import Link from "next/link";
import type { CuratedList } from "@/lib/movies";
import { movieHref } from "@/lib/movies";

type Props = { list: CuratedList };

// Wide horizontal card with a multi-poster collage on the left and a label below.
// Matches IMDb's "What We're Watching This Week" tile.
export default function FeaturedTodayCard({ list }: Props) {
  const posters = list.movies.slice(0, 5);

  return (
    <article className="bg-bg-elevated border border-border rounded-lg overflow-hidden hover:border-accent transition-colors">
      {/* Multi-poster collage */}
      <div className="relative h-[180px] flex">
        {posters.map((m, i) => (
          <Link
            key={m.id}
            href={movieHref(m)}
            className="relative flex-1 min-w-0 border-r border-black/40 last:border-r-0"
            style={{ marginLeft: i === 0 ? 0 : -8, zIndex: posters.length - i }}
          >
            <div className="relative h-full w-full">
              <Image
                src={m.poster}
                alt={m.title}
                fill
                sizes="(max-width: 1024px) 20vw, 110px"
                className="object-cover"
              />
            </div>
          </Link>
        ))}
        {/* List icon overlay */}
        <span className="absolute left-3 bottom-3 bg-black/80 text-white text-xs font-semibold flex items-center gap-1 px-2 py-1 rounded">
          <ListIcon /> List
        </span>
      </div>

      {/* Card label */}
      <div className="p-3">
        <h3 className="font-bold text-base">{list.title}</h3>
        <p className="text-xs text-fg-muted mt-0.5">{list.blurb}</p>
        <button
          type="button"
          className="text-link hover:text-link-hover hover:underline text-sm mt-2"
        >
          {list.cta}
        </button>
      </div>
    </article>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor" aria-hidden>
      <rect x="3" y="5" width="4" height="2" />
      <rect x="9" y="5" width="12" height="2" />
      <rect x="3" y="11" width="4" height="2" />
      <rect x="9" y="11" width="12" height="2" />
      <rect x="3" y="17" width="4" height="2" />
      <rect x="9" y="17" width="12" height="2" />
    </svg>
  );
}
