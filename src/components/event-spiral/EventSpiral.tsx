import DomeGallery from "./DomeGallery/DomeGallery";
import type { EventItem } from "@/content/types";

export function EventSpiral({ events }: { events: EventItem[] }) {
  const items = events.map((e, i) => ({
    id: e.id,
    src: "",
    alt: e.name,
    code: `EQ-${String(i + 1).padStart(2, "0")}`
  }));
  return (
    <section id="event-index" aria-labelledby="event-index-h" className="relative overflow-hidden px-6 py-24 md:px-16">
      <div className="relative">
        <p className="font-display text-[11px] tracking-[0.35em] text-volt/80">EVENT INDEX</p>
        <h2 id="event-index-h" className="mt-2 font-display text-4xl font-bold md:text-6xl">All Events</h2>
        <p className="mt-3 max-w-prose text-white/70">Drag to explore the full event roster on the dome.</p>
        <div className="relative mt-10 h-[560px] overflow-hidden md:h-[640px]">
          <DomeGallery
            images={items}
            fit={0.5}
            minRadius={600}
            overlayBlurColor="#000000"
            segments={21}
            imageBorderRadius="6px"
            grayscale={false}
          />
        </div>
        <div className="mt-8 flex justify-center md:hidden">
          <a href="#contact" className="border border-volt px-5 py-3 font-display text-sm">Next section</a>
        </div>
      </div>
    </section>
  );
}
