import Image from "next/image";
import type { Person } from "@/lib/movies-server";

type Props = { person: Person };

function formatChange(n: number): string {
  return n.toLocaleString();
}

export default function PersonCard({ person }: Props) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-[110px] h-[110px] rounded-full overflow-hidden border border-border bg-gradient-to-br from-[#3a3a3a] to-[#1a1a1a]">
        <Image
          src={person.photo}
          alt={person.name}
          fill
          sizes="110px"
          className="object-cover"
        />
        {/* Add to watchlist overlay button */}
        <button
          type="button"
          className="absolute bottom-1 left-1 w-7 h-7 rounded-full bg-accent text-black font-bold text-base flex items-center justify-center shadow z-10"
          aria-label="Add to watchlist"
        >
          +
        </button>
      </div>
      <div className="flex items-center gap-1 mt-2 text-sm">
        <span className="font-bold">{person.rank}</span>
        {person.rankChange > 0 ? (
          <span className="text-green-500 text-xs flex items-center gap-0.5 font-semibold">
            ▲ {formatChange(person.rankChange)}
          </span>
        ) : person.rankChange < 0 ? (
          <span className="text-red-500 text-xs flex items-center gap-0.5 font-semibold">
            ▼ {formatChange(Math.abs(person.rankChange))}
          </span>
        ) : (
          <span className="text-fg-muted text-xs">(—)</span>
        )}
      </div>
      <p className="text-link hover:text-link-hover hover:underline cursor-pointer text-sm font-medium mt-0.5 leading-tight">
        {person.name}
      </p>
    </div>
  );
}
