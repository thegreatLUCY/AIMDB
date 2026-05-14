import {
  getCuratedLists,
  getPopularPeople,
  getRandomFeatured,
  getRandomTopPicks,
  getRandomUpNext,
} from "@/lib/movies";
import FeaturedHero from "@/components/FeaturedHero";
import TopicPills from "@/components/TopicPills";
import FeaturedTodayCard from "@/components/FeaturedTodayCard";
import PersonCard from "@/components/PersonCard";
import TopPickCard from "@/components/TopPickCard";

// Skip static caching so Math.random() reruns per request and every visit
// shuffles the homepage selections.
export const dynamic = "force-dynamic";

export default function HomePage() {
  const featured = getRandomFeatured();
  const upNext = getRandomUpNext(featured);
  const lists = getCuratedLists();
  const { rising, byRanking } = getPopularPeople();
  const topPicks = getRandomTopPicks(8);

  return (
    <div className="space-y-8">
      {/* ===== 1. FEATURED HERO + UP NEXT ===== */}
      <FeaturedHero featured={featured} upNext={upNext} />

      {/* ===== 2. TOPIC PILLS ===== */}
      <TopicPills />

      {/* ===== 3. FEATURED TODAY ===== */}
      <section>
        <SectionHeader title="Featured today" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {lists.map((list) => (
            <FeaturedTodayCard key={list.id} list={list} />
          ))}
        </div>
      </section>

      {/* ===== 4. MOST POPULAR PEOPLE ===== */}
      <section>
        <SectionHeader title="Most popular celebrities" arrow />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* Top Rising */}
          <div>
            <h3 className="text-fg-muted text-xs uppercase tracking-widest font-semibold mb-3">
              Top Rising
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {rising.map((p) => (
                <PersonCard key={p.name} person={p} />
              ))}
            </div>
          </div>
          {/* By Ranking */}
          <div>
            <h3 className="text-fg-muted text-xs uppercase tracking-widest font-semibold mb-3">
              By Ranking
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {byRanking.map((p) => (
                <PersonCard key={p.name} person={p} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 5. WHAT TO WATCH / TOP PICKS ===== */}
      <section>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-2xl font-bold border-l-4 border-accent pl-3">
            What to watch
          </h2>
          <button
            type="button"
            className="text-link hover:text-link-hover hover:underline text-sm"
          >
            Get more recommendations
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-1">
            Top picks <span className="text-fg-muted">›</span>
          </h3>
          <p className="text-sm text-fg-muted">Movies just for you</p>
          <button className="text-link hover:text-link-hover hover:underline text-sm mt-1 mb-3">
            Sign in
          </button>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {topPicks.map((m) => (
              <TopPickCard key={m.id} movie={m} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== 6. FROM YOUR WATCHLIST (stub) ===== */}
      <section>
        <SectionHeader title="From your Watchlist" arrow />
        <div className="bg-bg-elevated border border-border rounded-lg p-8 text-center">
          <p className="text-fg-muted text-sm">
            Sign in to see movies and shows on your Watchlist.
          </p>
          <button
            type="button"
            className="mt-3 bg-accent hover:brightness-110 text-black font-bold rounded-full px-5 py-2 text-sm transition-all"
          >
            Sign in to AIMDb
          </button>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title, arrow }: { title: string; arrow?: boolean }) {
  return (
    <h2 className="text-2xl font-bold border-l-4 border-accent pl-3 flex items-center gap-2 mb-4">
      {title}
      {arrow && <span className="text-fg-muted">›</span>}
    </h2>
  );
}
