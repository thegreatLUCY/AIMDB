import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getAllMovies,
  getMovieBySlug,
  getSimilarMovies,
  slugify,
} from "@/lib/movies";
import ReviewCard from "@/components/ReviewCard";
import MovieCard from "@/components/MovieCard";
import MediaGallery from "@/components/MediaGallery";
import TitleHero from "@/components/TitleHero";
import ActionSidebar from "@/components/ActionSidebar";
import CastAvatar from "@/components/CastAvatar";

export function generateStaticParams() {
  return getAllMovies().map((m) => ({ slug: slugify(m.title) }));
}

type PageProps = { params: Promise<{ slug: string }> };

export default async function MoviePage({ params }: PageProps) {
  const { slug } = await params;
  const movie = getMovieBySlug(slug);
  if (!movie) notFound();

  const similar = getSimilarMovies(movie);
  const photoCount = 1 + movie.stills.length; // poster + stills

  return (
    <article className="space-y-10">
      {/* ============ TITLE HERO (backdrop + title + 3-cell rating) ============ */}
      <TitleHero movie={movie} />

      {/* ============ MAIN GRID: media+crew (left) | action sidebar (right) ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6 min-w-0">
          {/* 3-panel media row */}
          <MediaGallery
            poster={{ src: movie.poster, alt: `${movie.title} poster` }}
            stills={movie.stills.map((src, i) => ({
              src,
              alt: `${movie.title} still ${i + 1}`,
            }))}
            videoCount={1}
            photoCount={photoCount}
          />

          {/* Genre pills with overflow arrow */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {movie.genres.map((g) => (
              <button
                key={g}
                type="button"
                className="text-xs border border-border bg-bg-elevated rounded-full px-3 py-1.5 text-fg hover:border-accent whitespace-nowrap"
              >
                {g}
              </button>
            ))}
            <button
              type="button"
              className="text-fg-muted hover:text-fg w-7 h-7 rounded-full flex items-center justify-center"
              aria-label="More genres"
            >
              ›
            </button>
          </div>

          {/* Tagline + synopsis */}
          {movie.tagline && (
            <p className="italic text-fg-muted text-lg">
              &ldquo;{movie.tagline}&rdquo;
            </p>
          )}
          <p className="leading-relaxed text-base">{movie.synopsis}</p>

          {/* Director / Writer / Stars as bordered table */}
          <dl className="border-t border-border">
            <CrewRow label="Director" names={[movie.director]} />
            <CrewRow label="Writers" names={movie.writers} />
            <CrewRow
              label="Stars"
              names={movie.cast.slice(0, 3).map((c) => c.name)}
              expandable
            />
            <div className="border-b border-border" />
          </dl>

          {/* AIMDbPro promo strip */}
          <button
            type="button"
            className="w-full text-left bg-bg-elevated border border-border rounded-md px-4 py-3 flex items-center gap-3 hover:border-accent"
          >
            <span className="bg-link text-white text-[10px] font-bold rounded px-1.5 py-0.5">
              AIMDbPro
            </span>
            <span className="text-link hover:text-link-hover text-sm">
              See production info at AIMDbPro
            </span>
            <span className="ml-auto text-fg-muted">↗</span>
          </button>
        </div>

        {/* RIGHT COLUMN: action sidebar */}
        <ActionSidebar movie={movie} />
      </div>

      {/* ============ TOP CAST ============ */}
      <section>
        <h2 className="text-xl font-bold border-l-4 border-accent pl-3 mb-4">
          Top Cast{" "}
          <span className="text-fg-muted font-normal text-sm">
            ({movie.cast.length})
          </span>
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {movie.cast.map((c) => (
            <li
              key={c.name}
              className="bg-bg-elevated border border-border rounded-lg overflow-hidden"
            >
              <CastAvatar name={c.name} photo={c.photo} />
              <div className="p-2">
                <p className="text-link hover:text-link-hover hover:underline text-sm leading-tight cursor-pointer font-medium">
                  {c.name}
                </p>
                <p className="text-xs text-fg-muted mt-0.5">{c.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ============ USER REVIEWS ============ */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold border-l-4 border-accent pl-3">
            User Reviews
          </h2>
          <span className="text-sm text-fg-muted">
            {movie.reviews.length} reviews
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {movie.reviews.map((r, i) => (
            <ReviewCard key={i} review={r} />
          ))}
        </div>
      </section>

      {/* ============ DETAILS ============ */}
      <section>
        <h2 className="text-xl font-bold border-l-4 border-accent pl-3 mb-4">
          Details
        </h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          {movie.releaseDate && (
            <DLRow label="Release date" value={movie.releaseDate} />
          )}
          {movie.country?.length && (
            <DLRow label="Country of origin" value={movie.country.join(", ")} link />
          )}
          {movie.language?.length && (
            <DLRow label="Language" value={movie.language.join(", ")} link />
          )}
          {movie.aka?.length && (
            <DLRow label="Also known as" value={movie.aka.join(" · ")} />
          )}
          {movie.filmingLocations?.length && (
            <DLRow
              label="Filming locations"
              value={movie.filmingLocations.join(" · ")}
              link
            />
          )}
          {movie.productionCompanies?.length && (
            <DLRow
              label="Production companies"
              value={movie.productionCompanies.join(" · ")}
              link
            />
          )}
        </dl>
      </section>

      {/* ============ BOX OFFICE ============ */}
      {(movie.budget !== undefined || movie.boxOffice) && (
        <section>
          <h2 className="text-xl font-bold border-l-4 border-accent pl-3 mb-4">
            Box office
          </h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            {movie.budget !== undefined && (
              <DLRow
                label="Budget"
                value={`${formatUSD(movie.budget)} (estimated)`}
              />
            )}
            {movie.boxOffice?.openingWeekend !== undefined && (
              <DLRow
                label="Opening weekend US & Canada"
                value={formatUSD(movie.boxOffice.openingWeekend)}
              />
            )}
            {movie.boxOffice?.grossUSCanada !== undefined && (
              <DLRow
                label="Gross US & Canada"
                value={formatUSD(movie.boxOffice.grossUSCanada)}
              />
            )}
            {movie.boxOffice?.grossWorldwide !== undefined && (
              <DLRow
                label="Gross worldwide"
                value={formatUSD(movie.boxOffice.grossWorldwide)}
              />
            )}
          </dl>
        </section>
      )}

      {/* ============ TECH SPECS ============ */}
      <section>
        <h2 className="text-xl font-bold border-l-4 border-accent pl-3 mb-4">
          Technical specs
        </h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <DLRow label="Runtime" value={formatRuntime(movie.runtime)} />
          <DLRow label="Color" value="Color" />
          <DLRow label="Sound mix" value="Dolby Digital" />
          <DLRow
            label="Aspect ratio"
            value={movie.year < 1980 ? "1.85 : 1" : "2.39 : 1"}
          />
        </dl>
      </section>

      {/* ============ MORE LIKE THIS ============ */}
      {similar.length > 0 && (
        <section>
          <h2 className="text-xl font-bold border-l-4 border-accent pl-3 mb-4">
            More like this
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {similar.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        </section>
      )}

      <div>
        <Link href="/" className="text-sm text-fg-muted hover:text-accent">
          ← Back to home
        </Link>
      </div>
    </article>
  );
}

// IMDb-style row: label on left, names as colored links on the right, bottom border.
function CrewRow({
  label,
  names,
  expandable,
}: {
  label: string;
  names: string[];
  expandable?: boolean;
}) {
  return (
    <div className="grid grid-cols-[140px_1fr_auto] items-center gap-4 py-3 border-b border-border">
      <dt className="font-semibold text-sm">{label}</dt>
      <dd className="text-sm">
        {names.map((n, i) => (
          <span key={n}>
            <span className="text-link hover:text-link-hover hover:underline cursor-pointer">
              {n}
            </span>
            {i < names.length - 1 && <span className="text-fg-muted"> · </span>}
          </span>
        ))}
      </dd>
      {expandable && <span className="text-fg-muted">›</span>}
    </div>
  );
}

function DLRow({
  label,
  value,
  link,
}: {
  label: string;
  value: string;
  link?: boolean;
}) {
  return (
    <div className="border-b border-border pb-2 last:border-0">
      <dt className="text-fg-muted text-xs uppercase tracking-wide">{label}</dt>
      <dd
        className={
          "mt-0.5 " +
          (link
            ? "text-link hover:text-link-hover hover:underline cursor-pointer"
            : "")
        }
      >
        {value}
      </dd>
    </div>
  );
}

function formatRuntime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function formatUSD(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
