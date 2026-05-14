# AIMDb — The AI Movie Database

A fully-functional movie database with **26 movies, ~150 cast members, hundreds of reviews — none of which exist.** Every title, character, poster, review, and headshot is AI-generated. AIMDb is an experiment in what happens when you reimagine IMDb but everything inside it is fabricated.

**🌐 Live: [aimdbb.netlify.app](https://aimdbb.netlify.app/)**

---

## What's in it

- **26 fictional movies** spanning 1944 to 2024 — film noir, sci-fi, western, horror, anime, Bollywood musical, French New Wave, biblical epic, Egyptian post-revolution thriller, and more
- **Six continents of cinema** represented — US, France, Italy, Japan, India, Hong Kong, Brazil, Mexico, Sweden, Poland, Iran, Turkey, South Africa, Egypt
- **Live homepage** that reshuffles featured movies, "Up next," top picks, and curated lists on every visit
- **Most Popular Celebrities** strip that randomly rotates real cast headshots
- **Movie detail pages** with backdrops, 3-cell rating widget, lightbox media gallery, cast cards, user reviews, details panel, box office, and "More like this"
- **IMDb-style search** with live dropdown — matches on title, alternate-language titles, cast names, and directors
- **Slug-based URLs** like `/title/the-glass-harbor` instead of opaque IDs

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router + Turbopack)
- React 19
- TypeScript
- Tailwind CSS v4
- Deployed on [Netlify](https://www.netlify.com/)

## Running locally

```bash
git clone https://github.com/thegreatLUCY/AIMDB.git
cd AIMDB
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project layout

```
data/
  movies.json              # all 26 movie records + cast + reviews + metadata
public/
  posters/                 # generated images: posters, stills, cast headshots
src/
  app/
    page.tsx               # randomized homepage
    title/[slug]/page.tsx  # movie detail page
    layout.tsx
  components/              # Header, FeaturedHero, MediaGallery, etc.
  lib/
    movies.ts              # shared data helpers (client-safe)
    movies-server.ts       # server-only helpers (uses fs)
  types/movie.ts           # the Movie type definition
```

## Adding a new movie

1. Append a new entry to `data/movies.json` following the existing schema
2. Generate poster + stills + cast photos using ChatGPT image gen
3. Save them into `public/posters/` as `ttXXXXXXX.jpg`, `ttXXXXXXX-still1.jpg`, `ttXXXXXXX-cast-N.jpg`
4. The new movie appears automatically — no code changes needed

Cast photos use a graceful fallback: when the file doesn't exist yet, the card shows initials. Drop the file in, refresh, and the headshot appears.

## Notes

- All movies, people, posters, and reviews are fictional. Any resemblance to real titles, films, actors, or events is unintended.
- Built with Claude Code.
