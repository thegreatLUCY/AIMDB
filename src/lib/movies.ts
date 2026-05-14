import moviesData from "../../data/movies.json";
import type { Movie } from "@/types/movie";

// Cast the imported JSON to our Movie[] type once, here.
// Everywhere else in the app just calls these helpers.
const movies = moviesData as Movie[];

// Converts a movie title into a URL-safe slug.
// "The Glass Harbor"     -> "the-glass-harbor"
// "Aprilsmörker"         -> "aprilsmorker"   (accents stripped)
// "İstanbul, 1922"       -> "istanbul-1922"
// "Sergeant Major's Daughter" -> "sergeant-majors-daughter"
export function slugify(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Stable URL path for a movie (used everywhere instead of /title/{id}).
// Accepts any object with a `title` field — works for both Movie and SearchEntry.
export function movieHref(movie: { title: string }): string {
  return `/title/${slugify(movie.title)}`;
}

export function getAllMovies(): Movie[] {
  return movies;
}

export function getMovieById(id: string): Movie | undefined {
  return movies.find((m) => m.id === id);
}

export function getMovieBySlug(slug: string): Movie | undefined {
  return movies.find((m) => slugify(m.title) === slug);
}

export function getTopRatedMovies(limit = 20): Movie[] {
  return [...movies]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

// Minimal record for the client-side search index. We strip out reviews/synopsis/etc.
// to keep the bundle small.
export type SearchEntry = {
  id: string;
  title: string;
  year: number;
  poster: string;
  genres: string[];
  topCast: string[];   // first 3 cast names
  director: string;
  aka?: string[];
};

export function getSearchIndex(): SearchEntry[] {
  return movies.map((m) => ({
    id: m.id,
    title: m.title,
    year: m.year,
    poster: m.poster,
    genres: m.genres,
    topCast: m.cast.slice(0, 3).map((c) => c.name),
    director: m.director,
    aka: m.aka,
  }));
}

// Fisher–Yates shuffle, returns a new array.
export function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Pick a random featured movie from the top-popular pool — keeps the "featured"
// slot semantically about popular films but rotates between page loads.
export function getRandomFeatured(): Movie {
  const popularPool = [...movies]
    .sort((a, b) => (a.popularity ?? 99999) - (b.popularity ?? 99999))
    .slice(0, 10);
  return shuffle(popularPool)[0];
}

// Pick N random "Up Next" entries from the next popular tier (excluding featured).
export function getRandomUpNext(featured: Movie, limit = 3): Movie[] {
  const pool = [...movies]
    .filter((m) => m.id !== featured.id)
    .sort((a, b) => (a.popularity ?? 99999) - (b.popularity ?? 99999))
    .slice(0, 12); // next 12 by popularity
  return shuffle(pool).slice(0, limit);
}

// N random Top Picks from the entire catalog.
export function getRandomTopPicks(limit = 8): Movie[] {
  return shuffle(movies).slice(0, limit);
}

// Old non-random helpers, kept for any caller that wants stable ordering.
export function getFeaturedMovie(): Movie {
  return [...movies].sort((a, b) => (a.popularity ?? 99999) - (b.popularity ?? 99999))[0];
}

export function getUpNext(featured: Movie, limit = 3): Movie[] {
  return [...movies]
    .filter((m) => m.id !== featured.id)
    .sort((a, b) => (a.popularity ?? 99999) - (b.popularity ?? 99999))
    .slice(0, limit);
}

// Aggregates all cast + directors across all movies to build a "celebrities" view.
export type Person = {
  name: string;
  appearanceCount: number;
  totalVotes: number;
  recentScore: number;
  rank: number;
  rankChange: number;
};

export function getPopularPeople(): { rising: Person[]; byRanking: Person[] } {
  const map = new Map<string, { count: number; votes: number; recent: number }>();

  function bump(name: string, votes: number, recentWeight: number) {
    const cur = map.get(name) ?? { count: 0, votes: 0, recent: 0 };
    cur.count += 1;
    cur.votes += votes;
    cur.recent += votes * recentWeight;
    map.set(name, cur);
  }

  for (const m of movies) {
    const recentWeight = m.year >= 2015 ? 3 : m.year >= 2000 ? 1.5 : 1;
    for (const c of m.cast) bump(c.name, m.voteCount, recentWeight);
    bump(m.director, m.voteCount, recentWeight);
  }

  const all = Array.from(map.entries()).map(([name, p]) => ({
    name,
    appearanceCount: p.count,
    totalVotes: p.votes,
    recentScore: p.recent,
  }));

  // By ranking: most total votes across all films (the "established stars")
  const byRanking = [...all]
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .slice(0, 4)
    .map((p, i) => ({
      ...p,
      rank: i + 1,
      rankChange: 0, // top of the list holds steady (matches IMDb "(—)")
    }));

  // Top rising: best recent-weighted score, excluding the top-ranked four
  const inByRanking = new Set(byRanking.map((p) => p.name));
  const rising = [...all]
    .filter((p) => !inByRanking.has(p.name))
    .sort((a, b) => b.recentScore - a.recentScore)
    .slice(0, 4)
    .map((p, i) => ({
      ...p,
      rank: 30 + i + 1, // simulate plausible chart positions
      rankChange: Math.floor(p.recentScore / 4000) + 100 * (4 - i), // big up-movement
    }));

  return { rising, byRanking };
}

// Curated "lists" used in the Featured today section. Each list = 5 movies.
export type CuratedList = {
  id: string;
  title: string;
  blurb: string;
  cta: string;
  movies: Movie[];
};

export function getCuratedLists(): CuratedList[] {
  // List 1: what we're watching this week — random sample from the popular pool
  const popularPool = [...movies]
    .sort((a, b) => (a.popularity ?? 99999) - (b.popularity ?? 99999))
    .slice(0, 12);
  const watching = shuffle(popularPool).slice(0, 5);

  // List 2: international — random sample from non-English-primary, non-US films
  const internationalPool = movies.filter(
    (m) =>
      m.language &&
      !m.language.includes("English") &&
      m.country &&
      !m.country.includes("United States")
  );
  const international = shuffle(internationalPool).slice(0, 5);

  // List 3: hidden gems — high rated but lower popularity, randomized
  const hiddenPool = movies.filter((m) => m.rating >= 7.5 && (m.popularity ?? 0) > 3000);
  const hidden = shuffle(hiddenPool).slice(0, 5);

  return [
    {
      id: "watching",
      title: "What We're Watching This Week",
      blurb: "Trending across AIMDb right now",
      cta: "See the list",
      movies: watching,
    },
    {
      id: "international",
      title: "Staff Picks: International Highlights",
      blurb: "Stories from around the world",
      cta: "See our picks",
      movies: international,
    },
    {
      id: "hidden",
      title: "Hidden Gems",
      blurb: "Underseen films worth your night",
      cta: "Explore the list",
      movies: hidden,
    },
  ];
}

// Movies sharing at least one genre, excluding the source movie. Ranked by overlap count then rating.
export function getSimilarMovies(movie: Movie, limit = 6): Movie[] {
  const genreSet = new Set(movie.genres);
  return movies
    .filter((m) => m.id !== movie.id && m.genres.some((g) => genreSet.has(g)))
    .map((m) => ({
      m,
      overlap: m.genres.filter((g) => genreSet.has(g)).length,
    }))
    .sort((a, b) => b.overlap - a.overlap || b.m.rating - a.m.rating)
    .slice(0, limit)
    .map((x) => x.m);
}
