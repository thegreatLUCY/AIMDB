"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { SearchEntry } from "@/lib/movies";
import { movieHref } from "@/lib/movies";

type Props = { index: SearchEntry[] };

// One hit = the matched movie + which field matched + a numeric rank (lower is better).
type Hit = {
  movie: SearchEntry;
  matchedOn: "title" | "aka" | "cast" | "director";
  matchedText: string; // what to show as the subtitle (e.g. actor name)
  rank: number;
};

const MAX_RESULTS = 8;

export default function SearchBar({ index }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0); // active dropdown index for keyboard nav
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Refs that mirror state for the event handlers, so they always read the latest
  // values even if a render is in flight between keystrokes.
  const hitsRef = useRef<Hit[]>([]);
  const activeRef = useRef(0);

  // Compute hits whenever query changes.
  const hits: Hit[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const out: Hit[] = [];

    for (const m of index) {
      const titleLower = m.title.toLowerCase();
      let bestRank = Infinity;
      let bestMatch: Hit | null = null;

      // Title is highest priority. Prefix match beats includes match.
      if (titleLower.startsWith(q)) {
        bestRank = 0;
        bestMatch = { movie: m, matchedOn: "title", matchedText: m.director, rank: 0 };
      } else if (titleLower.includes(q)) {
        bestRank = 1;
        bestMatch = { movie: m, matchedOn: "title", matchedText: m.director, rank: 1 };
      }

      // AKA matches (alternate titles)
      if (m.aka && bestRank > 2) {
        for (const aka of m.aka) {
          if (aka.toLowerCase().includes(q)) {
            bestRank = 2;
            bestMatch = { movie: m, matchedOn: "aka", matchedText: aka, rank: 2 };
            break;
          }
        }
      }

      // Cast matches
      if (bestRank > 3) {
        for (const c of m.topCast) {
          if (c.toLowerCase().includes(q)) {
            bestRank = 3;
            bestMatch = { movie: m, matchedOn: "cast", matchedText: c, rank: 3 };
            break;
          }
        }
      }

      // Director match
      if (bestRank > 4 && m.director.toLowerCase().includes(q)) {
        bestRank = 4;
        bestMatch = { movie: m, matchedOn: "director", matchedText: m.director, rank: 4 };
      }

      if (bestMatch) out.push(bestMatch);
    }

    out.sort((a, b) => a.rank - b.rank || a.movie.title.localeCompare(b.movie.title));
    return out.slice(0, MAX_RESULTS);
  }, [query, index]);

  // Reset active row when results change, and keep refs synced.
  useEffect(() => {
    setActive(0);
    activeRef.current = 0;
    hitsRef.current = hits;
  }, [hits]);

  // Keep activeRef synced when arrow keys move it.
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  function navigateToActive() {
    const list = hitsRef.current;
    if (list.length === 0) return;
    const idx = Math.min(Math.max(0, activeRef.current), list.length - 1);
    const hit = list[idx];
    if (!hit) return;
    router.push(movieHref(hit.movie));
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
  }

  // Click outside to close.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  // Arrow keys + Escape. Enter is handled by the surrounding <form>'s onSubmit
  // so the browser's native form-submit-on-Enter path catches it reliably.
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      const len = hitsRef.current.length;
      if (len > 0) setActive((a) => (a + 1) % len);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const len = hitsRef.current.length;
      if (len > 0) setActive((a) => (a - 1 + len) % len);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div ref={wrapperRef} className="relative flex-1 max-w-2xl">
      {/* Form wraps the input so pressing Enter triggers the browser's native
          submit event — most reliable cross-browser path for Enter handling. */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigateToActive();
        }}
        className="flex bg-white text-black rounded-md overflow-hidden"
      >
        <button
          type="button"
          className="px-3 text-sm border-r border-gray-300 flex items-center gap-1 hover:bg-gray-100"
        >
          All <span className="text-xs">▾</span>
        </button>
        <div className="relative flex-1 flex items-center">
          <SearchIcon className="w-4 h-4 text-gray-500 absolute left-2 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Search AIMDb"
            className="w-full pl-8 pr-3 py-1.5 text-sm focus:outline-none bg-transparent"
            aria-autocomplete="list"
            aria-expanded={open && hits.length > 0}
          />
        </div>
        {/* Hidden submit button ensures Enter submits the form even on some
            browsers/forms that need an explicit submit trigger. */}
        <button type="submit" className="sr-only" tabIndex={-1}>
          Search
        </button>
      </form>

      {/* Dropdown */}
      {open && query.trim() !== "" && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-bg-elevated border border-border rounded-md shadow-2xl overflow-hidden z-[80]">
          {hits.length === 0 ? (
            <div className="px-3 py-4 text-sm text-fg-muted">
              No matches for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <>
              <ul role="listbox">
                {hits.map((hit, i) => (
                  <li key={hit.movie.id} role="option" aria-selected={active === i}>
                    <Link
                      href={movieHref(hit.movie)}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => {
                        setOpen(false);
                        setQuery("");
                      }}
                      className={
                        "flex items-center gap-3 px-3 py-2 transition-colors " +
                        (active === i ? "bg-white/10" : "hover:bg-white/5")
                      }
                    >
                      <div className="relative w-10 h-14 shrink-0 bg-black rounded overflow-hidden border border-border">
                        <Image
                          src={hit.movie.poster}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {hit.movie.title}
                        </p>
                        <p className="text-xs text-fg-muted truncate">
                          {hit.movie.year} · {hit.movie.genres.slice(0, 2).join(", ")}
                        </p>
                        <p className="text-xs text-fg-muted truncate">
                          {subtitleFor(hit)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border bg-bg px-3 py-2 text-xs text-fg-muted flex justify-between">
                <span>Press Enter to open</span>
                <span>↑↓ navigate · Esc close</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function subtitleFor(hit: Hit): string {
  switch (hit.matchedOn) {
    case "title":
      return `Directed by ${hit.matchedText}`;
    case "aka":
      return `Also known as “${hit.matchedText}”`;
    case "cast":
      return `Starring ${hit.matchedText}`;
    case "director":
      return `Directed by ${hit.matchedText}`;
  }
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
