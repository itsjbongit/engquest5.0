"use client";
import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { EventItem } from "@/content/types";
import { festival } from "@/content/festival";
import { EventCard } from "./EventCard";
import { EventDetail } from "./EventDetail";

gsap.registerPlugin(ScrollTrigger);

export function EventWorld({ events }: { events: EventItem[] }) {
  const root = useRef<HTMLElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<EventItem | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const n = events.length;

  useLayoutEffect(() => {
    const el = root.current!;
    const rg = ring.current!;
    const w = Math.min(260, window.innerWidth * 0.6);
    const r = (w / 2 / Math.tan(Math.PI / n)) * 1.12;
    el.style.setProperty("--w", `${w}px`);
    el.style.setProperty("--r", `${r}px`);
    const faces = Array.from(rg.querySelectorAll<HTMLElement>("[data-face]"));
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(rg, { z: -r });
      let last = -1;
      const paint = (pos: number) => {
        faces.forEach((face, i) => {
          const d = Math.min(Math.abs(i - pos), n - Math.abs(i - pos));
          face.style.opacity = String(Math.max(0.15, 1 - d * 0.28));
          face.style.transform = d < 0.5 ? "scale(1.08)" : "none";
        });
        const a = Math.round(pos) % n;
        if (a !== last) { last = a; setActive(a); }
      };
      paint(0);
      gsap.to(rg, { rotationY: -((n - 1) * 360) / n, ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: `+=${n * 70}%`, pin: true, scrub: 0.6, onUpdate: (s) => paint(s.progress * (n - 1)) } });
    });
    return () => mm.revert();
  }, [n]);

  return (
    <section ref={root} id="quest" aria-labelledby="quest-h" className="world relative">
      <h2 id="quest-h" className="absolute inset-x-0 top-16 z-10 text-center font-display text-3xl font-bold md:text-5xl">The Quest</h2>
      <div ref={ring} className="ring absolute inset-0">
        {events.map((e, i) => (
          <div key={e.id} className="slot" style={{ "--i": i, "--n": n } as CSSProperties}>
            <EventCard event={e} index={i} total={n} onOpen={setOpen} />
          </div>
        ))}
      </div>
      <div className="relative z-20 flex flex-col items-center gap-3 px-6 pb-28 text-center motion-reduce:hidden">
        <p aria-live="polite" className="font-display text-xl text-white/90">{events[active]?.name}</p>
        <button type="button" onClick={() => setOpen(events[active])} className="border border-volt px-5 py-3 font-display text-sm">View event</button>
      </div>
      {open && <EventDetail event={open} festival={festival} onClose={close} />}
    </section>
  );
}
