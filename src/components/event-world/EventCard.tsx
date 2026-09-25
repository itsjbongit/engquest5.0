"use client";
import Image from "next/image";
import { useState } from "react";
import type { EventItem } from "@/content/types";

interface Props { event: EventItem; index: number; total: number; onOpen: (e: EventItem) => void }

export function EventCard({ event, index, total, onOpen }: Props) {
  const [failed, setFailed] = useState(false);
  const showPoster = event.poster && !failed;
  return (
    <button type="button" data-face onClick={() => onOpen(event)} aria-label={`View event: ${event.name}`}
      className="relative block size-full overflow-hidden bg-deep text-left will-change-transform">
      {showPoster ? (
        <Image src={event.poster!} alt={`${event.name} poster`} fill sizes="260px" className="object-cover" onError={() => setFailed(true)} />
      ) : (
        <span className="flex size-full flex-col justify-between p-4"
          style={{ backgroundImage: "linear-gradient(#00a8ff14 1px,transparent 1px),linear-gradient(90deg,#00a8ff14 1px,transparent 1px)", backgroundSize: "24px 24px" }}>
          <span className="text-xs text-volt">{String(index + 1).padStart(2, "0")} / {total}</span>
        </span>
      )}
    </button>
  );
}
