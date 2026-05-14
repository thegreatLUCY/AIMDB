// The shape of one movie. Mirrors the JSON schema used by the LLM prompt.

export type CastMember = {
  name: string;
  role: string;
  photo?: string; // e.g. "/posters/tt0000001-cast-1.jpg"
};

export type Review = {
  author: string;
  rating: number; // 1-10
  title: string;
  body: string;
};

export type BoxOffice = {
  grossUSCanada?: number;
  openingWeekend?: number;
  grossWorldwide?: number;
};

export type Movie = {
  id: string;
  title: string;
  year: number;
  runtime: number;
  rating: number;
  voteCount: number;
  genres: string[];
  director: string;
  writers: string[];
  cast: CastMember[];
  synopsis: string;
  tagline: string;
  poster: string;
  stills: string[];
  reviews: Review[];

  // ---- Extended IMDb-style details (optional so old entries still type-check) ----
  releaseDate?: string;             // "October 21, 2022 (South Korea)"
  country?: string[];               // ["South Korea", "United States"]
  language?: string[];              // ["Korean", "English"]
  aka?: string[];                   // alternate titles
  filmingLocations?: string[];      // ["Seoul, South Korea", ...]
  productionCompanies?: string[];   // ["Lumen Pictures", ...]
  budget?: number;                  // USD
  boxOffice?: BoxOffice;

  // Popularity (IMDb shows rank + weekly trend arrow)
  popularity?: number;              // lower = more popular (1 = #1)
  popularityChange?: number;        // positive = moved up, negative = down

  // MPAA / certification badge in meta row
  certification?: string;           // "G", "PG", "PG-13", "R", "NC-17", "NR", "TV-MA"
  // Metascore (0-100, critic aggregate)
  metascore?: number;
  // Number of professional critic reviews
  criticReviewCount?: number;
  // Number of users who've added the movie to a watchlist
  watchlistCount?: number;

  // Optional — present in raw generated data, stripped before shipping.
  posterPrompt?: string;
  stillPrompt?: string;
};
