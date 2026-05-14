"use client";

import Image from "next/image";
import { useState } from "react";

type Props = { name: string; photo?: string };

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Renders a cast member's headshot if the photo file exists, otherwise
// falls back to initials. Critical for the "placeholders until images are
// generated" workflow.
export default function CastAvatar({ name, photo }: Props) {
  const [errored, setErrored] = useState(false);
  const showImage = photo && !errored;

  return (
    <div className="relative aspect-square bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center text-2xl text-fg-muted font-semibold overflow-hidden">
      {showImage ? (
        <Image
          src={photo}
          alt={name}
          fill
          sizes="(max-width: 768px) 33vw, 180px"
          className="object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        initials(name)
      )}
    </div>
  );
}
