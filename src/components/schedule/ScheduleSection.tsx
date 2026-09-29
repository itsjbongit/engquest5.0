"use client";
import { useMemo, useState } from "react";
import { schedule } from "@/content/schedule";

const VENUES = ["JC Bose", "Janki Ammal", "Ramanujan", "Committee Room"] as const;
type Venue = (typeof VENUES)[number];

const VENUE_DOT: Record<string, string> = {
  "JC Bose": "bg-sky-400",
  "Janki Ammal": "bg-violet-400",
  Ramanujan: "bg-amber-400",
  "Committee Room": "bg-emerald-400",
  "All venues": "bg-volt",
};

function toMinutes(t: string): number {
  const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return 0;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const mer = m[3].toUpperCase();
  if (h === 12) h = 0;
  if (mer === "PM") h += 12;
  return h * 60 + min;
}

function fmt(mins: number): { label: string; mer: string } {
  let h = Math.floor(mins / 60);
  const m = mins % 60;
  const mer = h >= 12 ? "PM" : "AM";
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return { label: `${h12}:${String(m).padStart(2, "0")}`, mer };
}

function formatRange(start: number, end: number): string {
  const s = fmt(start);
  const e = fmt(end);
  if (s.mer === e.mer) return `${s.label} – ${e.label} ${e.mer}`;
  return `${s.label} ${s.mer} – ${e.label} ${e.mer}`;
}

type Row = {
  start: number;
  end: number;
  banner?: string;
  cells: Record<Venue, { id: string; title: string }[]>;
};

function buildRows(): Row[] {
  const bounds = new Set<number>();
  for (const item of schedule) {
    bounds.add(toMinutes(item.startTime));
    if (item.endTime) bounds.add(toMinutes(item.endTime));
  }
  const b = [...bounds].sort((x, y) => x - y);
  const rows: Row[] = [];
  for (let i = 0; i < b.length - 1; i++) {
    const s = b[i];
    const e = b[i + 1];
    if (e <= s) continue;
    const active = schedule.filter((item) => {
      const st = toMinutes(item.startTime);
      const en = item.endTime ? toMinutes(item.endTime) : st;
      // Point event (no end): belongs to the interval that starts at its time.
      if (!item.endTime) return st === s;
      return st < e && en > s;
    });
    if (active.length === 0) continue;
    const banner = active.find((a) => a.venue === "All venues");
    if (banner && active.length === 1) {
      rows.push({
        start: s,
        end: e,
        banner: banner.title,
        cells: { "JC Bose": [], "Janki Ammal": [], Ramanujan: [], "Committee Room": [] },
      });
      continue;
    }
    const cells = {
      "JC Bose": [] as Row["cells"][Venue],
      "Janki Ammal": [] as Row["cells"][Venue],
      Ramanujan: [] as Row["cells"][Venue],
      "Committee Room": [] as Row["cells"][Venue],
    };
    for (const a of active) {
      if (a.venue === "All venues") continue;
      const v = a.venue as Venue;
      if (v in cells) cells[v].push({ id: a.id, title: a.title });
    }
    rows.push({ start: s, end: e, cells });
  }
  return rows;
}

export function ScheduleSection() {
  const [venue, setVenue] = useState<string>("All");
  const rows = useMemo(() => buildRows(), []);
  const columns: Venue[] = useMemo(
    () => (venue === "All" ? [...VENUES] : [venue as Venue]),
    [venue],
  );

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

      <div className="relative mx-auto max-w-6xl">
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

        <div className="mt-10 overflow-x-auto border border-white/10 bg-black/50 backdrop-blur-sm">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <caption className="sr-only">
              EngQuest run of show on 1 October 2026 by time and venue
            </caption>
            <thead>
              <tr className="border-b border-volt/30 bg-white/[0.04]">
                <th scope="col" className="w-44 px-5 py-4 font-display text-xs font-bold uppercase tracking-[0.2em] text-volt">
                  Time
                </th>
                {columns.map((v) => (
                  <th key={v} scope="col" className="border-l border-white/15 px-5 py-4 font-display text-xs font-bold uppercase tracking-[0.2em]">
                    <span className="inline-flex items-center gap-2">
                      <span aria-hidden className={`size-2 rounded-full ${VENUE_DOT[v] ?? "bg-white/40"}`} />
                      {v}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const label = formatRange(row.start, row.end);
                if (row.banner) {
                  return (
                    <tr key={`${row.start}-${row.end}`} className="border-b border-white/10">
                      <th scope="row" className="whitespace-nowrap px-5 py-4 font-display text-sm font-bold tracking-wider text-white">
                        {label}
                      </th>
                      <td colSpan={columns.length} className="border-l border-white/15 px-5 py-3">
                        <p className="border border-volt/40 bg-volt/10 px-4 py-2 text-center font-display text-xs font-bold uppercase tracking-[0.25em] text-volt">
                          {row.banner}
                        </p>
                      </td>
                    </tr>
                  );
                }
                return (
                  <tr key={`${row.start}-${row.end}`} className="border-b border-white/10 last:border-0 odd:bg-white/[0.015] hover:bg-white/[0.03]">
                    <th scope="row" className="whitespace-nowrap px-5 py-4 align-top font-display text-sm font-bold tracking-wider text-white">
                      {label}
                    </th>
                    {columns.map((v) => (
                      <td key={v} className="border-l border-white/15 px-5 py-4 align-top">
                        {row.cells[v].length === 0 ? (
                          <span aria-hidden className="text-white/20">—</span>
                        ) : (
                          <ul className="grid gap-2">
                            {row.cells[v].map((cell) => (
                              <li key={cell.id} className="font-display text-sm font-bold leading-snug">
                                {cell.title}
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-center text-xs tracking-wider text-white/40 md:hidden">
          Scroll sideways to see all four stages →
        </p>

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
