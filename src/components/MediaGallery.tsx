"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

type Media = { src: string; alt: string };

type Props = {
  poster: Media;
  stills: Media[];
  videoCount?: number;
  photoCount?: number;
};

export default function MediaGallery({
  poster,
  stills,
  videoCount = 0,
  photoCount,
}: Props) {
  // The lightbox cycles through [poster, ...stills].
  const images: Media[] = [poster, ...stills];
  const totalPhotos = photoCount ?? images.length;
  const featured = stills[0] ?? poster; // big center "trailer" image

  const [index, setIndex] = useState<number | null>(null);
  const isOpen = index !== null;

  const close = useCallback(() => setIndex(null), []);
  const next = useCallback(
    () => setIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );
  const prev = useCallback(
    () =>
      setIndex((i) =>
        i === null ? null : (i - 1 + images.length) % images.length
      ),
    [images.length]
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, next, prev]);

  return (
    <>
      {/* 3-panel layout: poster | featured (trailer) | photos/videos stack */}
      <section className="grid grid-cols-[140px_1fr_140px] md:grid-cols-[200px_1fr_180px] gap-2">
        {/* Poster (with watchlist + ribbon top-left) */}
        <button
          type="button"
          onClick={() => setIndex(0)}
          className="relative aspect-[2/3] bg-black rounded-md overflow-hidden border border-border hover:border-accent transition-colors group"
          aria-label="Open poster"
        >
          <Image
            src={poster.src}
            alt={poster.alt}
            fill
            sizes="200px"
            className="object-cover group-hover:opacity-90"
          />
          {/* Watchlist ribbon corner */}
          <span className="absolute top-0 left-0 w-9 h-12 flex items-start justify-center pt-1 bg-black/70 text-white text-lg font-bold rounded-br-md">
            +
          </span>
        </button>

        {/* Featured / trailer panel */}
        <button
          type="button"
          onClick={() => setIndex(stills.length > 0 ? 1 : 0)}
          className="relative aspect-video bg-black rounded-md overflow-hidden border border-border hover:border-accent transition-colors group"
          aria-label="Play trailer"
        >
          <Image
            src={featured.src}
            alt={featured.alt}
            fill
            sizes="(max-width: 768px) 60vw, 800px"
            className="object-cover group-hover:opacity-95"
          />
          {/* Dark overlay with play CTA */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white text-sm">
            <span className="w-9 h-9 rounded-full bg-white/90 text-black flex items-center justify-center text-base">
              ▶
            </span>
            <span className="font-semibold">Play trailer</span>
            <span className="opacity-70">1:00</span>
          </div>
        </button>

        {/* Right column: stacked video/photo cards */}
        <div className="grid grid-rows-2 gap-2">
          <button
            type="button"
            onClick={() => setIndex(1)}
            className="bg-bg-elevated border border-border rounded-md flex flex-col items-center justify-center text-center hover:border-accent transition-colors text-fg-muted hover:text-fg p-2"
          >
            <VideoIcon className="w-7 h-7 mb-1" />
            <span className="text-xs font-semibold">{videoCount} VIDEOS</span>
          </button>
          <button
            type="button"
            onClick={() => setIndex(0)}
            className="bg-bg-elevated border border-border rounded-md flex flex-col items-center justify-center text-center hover:border-accent transition-colors text-fg-muted hover:text-fg p-2"
          >
            <PhotoIcon className="w-7 h-7 mb-1" />
            <span className="text-xs font-semibold">{totalPhotos} PHOTOS</span>
          </button>
        </div>
      </section>

      {/* Lightbox overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="absolute top-4 right-4 text-white text-3xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
            aria-label="Close"
          >
            ×
          </button>

          <div className="absolute top-4 left-4 text-white/70 text-sm">
            {(index ?? 0) + 1} / {images.length}
          </div>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-2 md:left-6 text-white text-4xl w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10"
              aria-label="Previous"
            >
              ‹
            </button>
          )}

          <div
            className="relative w-[90vw] h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[index!].src}
              alt={images[index!].alt}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </div>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-2 md:right-6 text-white text-4xl w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10"
              aria-label="Next"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}

function VideoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1zm6 4v8l6-4-6-4z" />
    </svg>
  );
}

function PhotoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M21 3H3a1 1 0 00-1 1v16a1 1 0 001 1h18a1 1 0 001-1V4a1 1 0 00-1-1zM5 19l4-6 3 4 3-2 4 4H5z" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  );
}
