const TOPICS = [
  "Top Rated of All Time",
  "Hidden Gems",
  "International Spotlight",
  "By Decade",
  "Festival Award Winners",
];

export default function TopicPills() {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {TOPICS.map((topic) => (
        <button
          key={topic}
          type="button"
          className="text-sm bg-bg-elevated border border-border rounded-full px-4 py-2 text-fg hover:border-accent whitespace-nowrap flex items-center gap-1"
        >
          {topic} <span className="text-fg-muted">›</span>
        </button>
      ))}
    </div>
  );
}
