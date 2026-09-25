"use client";
import { useEffect, useState } from "react";
import InfiniteSpiral from "./InfiniteSpiral";
import SoftAurora from "./SoftAurora/SoftAurora";
import type { EventItem } from "@/content/types";

export function EventSpiral({ events }: { events: EventItem[] }) {
  const [motionOK, setMotionOK] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionOK(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const items = events.map((e, i) => ({
    id: e.id,
    label: e.name,
    alt: e.name,
    code: `EQ-${String(i + 1).padStart(2, "0")}`
  }));
  return (
    <section id="event-index" aria-labelledby="event-index-h" className="relative overflow-hidden px-6 py-24 md:px-16">
      {motionOK && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <SoftAurora
            speed={0.6}
            brightness={0.8}
            color1="#9fdcff"
            color2="#00a8ff"
            enableMouseInteraction={false}
          />
        </div>
      )}
      <div className="relative">
        <p className="font-display text-[11px] tracking-[0.35em] text-volt/80">EVENT INDEX</p>
        <h2 id="event-index-h" className="mt-2 font-display text-4xl font-bold md:text-6xl">All Events</h2>
        <p className="mt-3 max-w-prose text-white/70">Drag or scroll to travel the full event roster.</p>
        <div className="relative mt-10 h-[560px] overflow-hidden md:h-[640px]">
          <InfiniteSpiral
            items={items}
            animationMode="all"
            speed={0.55}
            radius={170}
            cardWidth={220}
            cardHeight={150}
            verticalSpacing={64}
            perspective={1000}
            cardRadius={4}
            centerScale={1.2}
            edgeBlur={5}
            cardsPerTurn={7}
            pauseOnHover
          />
        </div>
      </div>
    </section>
  );
}
