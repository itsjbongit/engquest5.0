"use client";
import { useMemo, useState } from "react";
import { schedule } from "@/content/schedule";

const VENUES = ["JC Bose", "Janki Ammal", "Ramanujan", "Committee Room"] as const;

const VENUE_DOT: Record<string, string> = {
  "JC Bose": "bg-sky-400",
  "Janki Ammal": "bg-violet-400",
  Ramanujan: "bg-amber-400",
  "Committee Room": "bg-emerald-400",
  "All venues": "bg-volt",
};

type Slot = { start: string; end?: string; items: typeof schedule };

function groupBySlot(items: typeof schedule): Slot[] {
  const slots: Slot[] = [];
  for (const item of items) {
    const key = `${item.startTime}–${item.endTime ?? ""}`;
    const last = slots[slots.length - 1];
    if (last && `${last.start}–${last.end ?? ""}` === key) {
      last.items.push(item);
    } else {
      slots.push({ start: item.startTime, end: item.endTime, items: [item] });
    }
  }
  return slots;
}

export function ScheduleSection() {
  const [venue, setVenue] = useState<string>("All");
  const slots = useMemo(() => groupBySlot(schedule), []);
  const visible = useMemo(() => {
    if (venue === "All") return slots;
    return slots
      .map((s) => ({
        ...s,
        items: s.items.filter((i) => i.venue === venue || i.venue === "All venues"),
      }))
      .filter((s) => s.items.length > 0);
  }, [slots, venue]);

  return (
    <section id="schedule" aria-labelledby="schedule-h" className="relative overflow-hidden px-6 py-24 md:px-16">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgb(0_168_255/.10),transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(rgb(0 168 255 / .05) 1px,transparent 1px),linear-gradient(90deg,rgb(0 168 255 / .05) 1px,transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "linear-gradient(black,transparent 85%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <p className="text-center font-display text-[11px] tracking-[0.35em] text-volt/80">SCHEDULE</p>
        <h2 id="schedule-h" className="mt-2 text-center font-display text-3xl font-bold uppercase tracking-wide md:text-5xl">
          Run of Show
        </h2>
        <p className="mt-3 text-center font-display text-[11px] tracking-[0.25em] text-white/50">
          1 OCT 2026 · ELC, JNU · FOUR STAGES
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Filter schedule by venue">
          {["All", ...VENUES].map((v) => {
            const active = venue === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => setVenue(v)}
                aria-pressed={active}
                className={`flex items-center gap-2 border px-4 py-2 font-display text-xs tracking-[0.15em] uppercase transition-colors ${
                  active ? "border-volt bg-volt text-black" : "border-volt/40 text-white/80 hover:border-volt hover:text-white"
                }`}
              >
                {v !== "All" && <span aria-hidden className={`size-2 rounded-full ${VENUE_DOT[v] ?? "bg-white/60"}`} />}
                {v === "All" ? "All venues" : v}
              </button>
            );
          })}
        </div>

        <ol className="mt-10">
          {visible.map((slot) => {
            const banner = slot.items.length === 1 && slot.items[0].venue === "All venues";
            return (
              <li key={`${slot.start}-${slot.end}`} className="relative grid gap-3 pb-8 pl-8 last:pb-0 sm:grid-cols-[132px_1fr] sm:gap-6 sm:pl-0">
                <span aria-hidden className="absolute bottom-0 left-[7px] top-2 w-px bg-volt/25 sm:hidden" />
                <span aria-hidden className="absolute left-0 top-1.5 size-[15px] rounded-full border border-volt/60 bg-black sm:hidden">
                  <span className="absolute inset-[3px] rounded-full bg-volt/70" />
                </span>
                <div className="sm:border-r sm:border-volt/25 sm:pr-6 sm:text-right">
                  <p className="font-display text-sm font-bold tracking-wider text-white">{slot.start}</p>
                  {slot.end && <p className="mt-0.5 font-display text-xs tracking-wider text-volt/80">– {slot.end}</p>}
                </div>
                <div>
                  {banner ? (
                    <p className="border border-volt/40 bg-volt/10 px-5 py-4 text-center font-display text-sm font-bold uppercase tracking-[0.25em] text-volt">
                      {slot.items[0].title}
                    </p>
                  ) : (
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {slot.items.map((item) => (
                        <li
                          key={item.id}
                          className="group relative border border-white/10 bg-black/50 p-4 backdrop-blur-sm transition-colors hover:border-volt/60"
                        >
                          <span aria-hidden className="pointer-events-none absolute left-1.5 top-1.5 h-2.5 w-2.5 border-l border-t border-volt/50" />
                          <span aria-hidden className="pointer-events-none absolute right-1.5 top-1.5 h-2.5 w-2.5 border-r border-t border-volt/50" />
                          <p className="font-display text-base font-bold leading-snug">{item.title}</p>
                          <p className="mt-2 flex items-center gap-2 text-xs tracking-wider text-white/60">
                            <span aria-hidden className={`size-2 rounded-full ${VENUE_DOT[item.venue ?? ""] ?? "bg-white/40"}`} />
                            <span className="font-display uppercase">{item.venue}</span>
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/assets/schedule/schedule.pdf"
            target="_blank"
            rel="noreferrer"
            className="bg-volt px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-black transition-transform hover:scale-[1.03]"
          >
            Official schedule (PDF)
          </a>
          <a
            href="#quest"
            className="border border-volt/60 px-6 py-3 font-display text-sm uppercase tracking-[0.2em] hover:bg-volt hover:text-black"
          >
            Explore events
          </a>
        </div>
      </div>
    </section>
  );
}
