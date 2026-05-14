// Server-only helpers — anything that needs Node APIs (fs, path) lives here.
// Client components must NOT import from this file.
import "server-only";

import fs from "node:fs";
import path from "node:path";
import { shuffle, getAllMovies } from "./movies";

const POSTERS_DIR = path.join(process.cwd(), "public", "posters");

// No caching — we want every request to reflect the current state of the
// posters folder. Reading 100 filenames is cheap.
function listAvailablePhotos(): Set<string> {
  try {
    return new Set(fs.readdirSync(POSTERS_DIR));
  } catch {
    return new Set();
  }
}

function photoExists(set: Set<string>, photoPath?: string): boolean {
  if (!photoPath) return false;
  const filename = photoPath.split("/").pop()!;
  return set.has(filename);
}

export type Person = {
  name: string;
  photo: string;
  appearanceCount: number;
  totalVotes: number;
  rank: number;
  rankChange: number;
};

// Builds the "Most popular celebrities" view. Only includes cast members
// whose headshot file actually exists on disk. Randomized per page load.
export function getPopularPeople(): { rising: Person[]; byRanking: Person[] } {
  const photoSet = listAvailablePhotos();

  const map = new Map<
    string,
    { count: number; votes: number; photo: string }
  >();

  for (const m of getAllMovies()) {
    for (const c of m.cast) {
      if (!photoExists(photoSet, c.photo)) continue;
      const cur = map.get(c.name) ?? { count: 0, votes: 0, photo: c.photo! };
      cur.count += 1;
      cur.votes += m.voteCount;
      map.set(c.name, cur);
    }
  }

  const all = Array.from(map.entries()).map(([name, p]) => ({
    name,
    photo: p.photo,
    appearanceCount: p.count,
    totalVotes: p.votes,
  }));

  // Randomize per request (homepage is force-dynamic). Pick 4 for each side.
  const shuffled = shuffle(all);

  const rising = shuffled.slice(0, 4).map((p, i) => ({
    ...p,
    // Plausible "rising chart" positions in the 30-40 range with big +movement,
    // matching IMDb's "31 ▲ 913" presentation.
    rank: 30 + i + 1,
    rankChange: Math.floor(p.totalVotes / 4000) + 100 * (4 - i),
  }));

  const byRanking = shuffled.slice(4, 8).map((p, i) => ({
    ...p,
    rank: i + 1,
    rankChange: 0,
  }));

  return { rising, byRanking };
}
