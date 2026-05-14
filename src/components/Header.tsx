import Link from "next/link";
import SearchBar from "./SearchBar";
import { getSearchIndex } from "@/lib/movies";

export default function Header() {
  const index = getSearchIndex();

  return (
    <header className="bg-[#121212] border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3">
        <Link
          href="/"
          className="bg-accent text-black font-bold text-xl px-2 py-1 rounded shrink-0 tracking-tight"
        >
          AIMDb
        </Link>

        {/* Menu button — IMDb's left hamburger */}
        <button
          type="button"
          className="hidden md:flex items-center gap-2 text-sm font-semibold text-fg hover:text-accent px-2"
          aria-label="Menu"
        >
          <HamburgerIcon /> Menu
        </button>

        <SearchBar index={index} />

        {/* Right-side links */}
        <nav className="flex items-center gap-x-3 text-sm">
          <Link
            href="#"
            className="hidden md:inline-flex bg-accent text-black px-1.5 py-0.5 rounded font-bold tracking-tight text-xs"
          >
            AIMDbPro
          </Link>
          <span className="hidden md:inline-block w-px h-5 bg-border" />
          <button
            type="button"
            className="hidden md:inline-flex items-center gap-1.5 text-fg hover:text-accent"
          >
            <BookmarkIcon /> Watchlist
          </button>
          <button type="button" className="text-fg hover:text-accent font-semibold">
            Sign in
          </button>
          <button type="button" className="hidden md:inline-flex items-center gap-1 text-fg hover:text-accent">
            EN <span className="text-xs">▾</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

function HamburgerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
      <rect x="3" y="5" width="18" height="2" rx="1" />
      <rect x="3" y="11" width="18" height="2" rx="1" />
      <rect x="3" y="17" width="18" height="2" rx="1" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
      <path d="M6 3a1 1 0 00-1 1v17l7-3.5L19 21V4a1 1 0 00-1-1H6z" />
    </svg>
  );
}
