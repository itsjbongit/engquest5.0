"use client";
import Image from "next/image";
import { useState } from "react";
import type { EventItem } from "@/content/types";

interface Props { event: EventItem; index: number; total: number; onOpen: (e: EventItem) => void }

const num = (i: number) => String(i + 1).padStart(2, "0");
const code = (i: number) => `EQ-${num(i)}`;

function Corners() {
  const base = "pointer-events-none absolute h-3.5 w-3.5 border-volt/50";
  return (
    <span aria-hidden className="contents">
      <span className={`${base} left-1.5 top-1.5 border-l border-t`} />
      <span className={`${base} right-1.5 top-1.5 border-r border-t`} />
      <span className={`${base} bottom-1.5 left-1.5 border-b border-l`} />
      <span className={`${base} bottom-1.5 right-1.5 border-b border-r`} />
    </span>
  );
}

export function EventCard({ event, index, total, onOpen }: Props) {
  const [failed, setFailed] = useState(false);
  const showPoster = event.poster && !failed;
  return (
    <button type="button" data-face data-lit="false" onClick={() => onOpen(event)} aria-label={`View event: ${event.name}`}
      className="relative block size-full overflow-hidden bg-deep text-left will-change-transform">
      <span className="absolute inset-0 flex flex-col p-3">
        <span className="flex items-baseline justify-between font-display text-[10px] tracking-[0.2em] text-volt/90">
          <span>{num(index)} / {total}</span>
          <span>{code(index)}</span>
        </span>
        <span className="relative mt-2 min-h-0 flex-1 overflow-hidden"
          style={{ backgroundImage: "linear-gradient(#00a8ff14 1px,transparent 1px),linear-gradient(90deg,#00a8ff14 1px,transparent 1px)", backgroundSize: "24px 24px" }}>
          {showPoster ? (
            <Image src={event.poster!} alt={`${event.name} poster`} fill sizes="260px" className="object-cover" onError={() => setFailed(true)} />
          ) : (
            <span aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 -translate-y-1/2 bg-volt/40" />
              <span className="absolute left-1/2 top-1/2 h-5 w-px -translate-x-1/2 -translate-y-1/2 bg-volt/40" />
            </span>
          )}
        </span>
        <span aria-hidden className="mt-2 h-px w-full bg-volt/25" />
        <span className="mt-2 flex min-h-[3.25rem] items-end font-display text-base font-bold leading-snug text-white md:text-lg">
          {event.name}
        </span>
      </span>
      <Corners />
      <span aria-hidden className="face-glow pointer-events-none absolute inset-0" />
    </button>
  );
}
