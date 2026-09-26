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
  const head = useRef<HTMLDivElement>(null);
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
          const t = Math.min(d / 2.5, 1);
          face.style.opacity = String(1 - t * 0.8);
          face.style.transform = `scale(${(1 + 0.07 * Math.max(0, 1 - d)).toFixed(3)})`;
          const lit = d < 0.5 ? "true" : "false";
          if (face.dataset.lit !== lit) face.dataset.lit = lit;
        });
        const a = Math.round(pos) % n;
        if (a !== last) { last = a; setActive(a); }
      };
      paint(0);
      if (head.current) {
        gsap.from(head.current, { y: 28, opacity: 0, duration: 0.9, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 75%", once: true } });
      }
      gsap.from(rg, { opacity: 0, y: 48, duration: 1.1, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 70%", once: true } });
      gsap.to(rg, { rotationY: -((n - 1) * 360) / n, ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: `+=${n * 70}%`, pin: true, anticipatePin: 1, scrub: 0.6, onUpdate: (s) => paint(s.progress * (n - 1)) } });
    });
    return () => mm.revert();
  }, [n]);

  return (
    <section ref={root} id="quest" aria-labelledby="quest-h" className="world relative">
      <div aria-hidden className="world-scaffold">
        <span className="world-axis" />
        <span className="world-rule top" />
      </div>
      <div ref={head} className="absolute inset-x-0 top-24 z-10 px-6 text-center">
        <p className="font-display text-[11px] tracking-[0.35em] text-volt/80">EVENTS</p>
        <h2 id="quest-h" className="mt-2 font-display text-3xl font-bold uppercase tracking-wide md:text-5xl">The Quest</h2>
      </div>
      <div ref={ring} className="ring absolute inset-0">
        {events.map((e, i) => (
          <div key={e.id} className="slot" style={{ "--i": i, "--n": n } as CSSProperties}>
            <EventCard event={e} index={i} total={n} onOpen={setOpen} />
          </div>
        ))}
      </div>
      <div className="caption z-20 flex flex-col items-center gap-3 px-6 pb-28 text-center motion-reduce:hidden">
        <p aria-live="polite" className="font-display text-xl text-white/90">{events[active]?.name}</p>
        <a href="#event-index" className="mt-4 border border-volt px-5 py-3 font-display text-sm">Skip</a>
      </div>
      {open && <EventDetail event={open} festival={festival} onClose={close} />}
    </section>
  );
}
