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
  const [open, setOpen] = useState<EventItem | null>(null);
  const [dragging, setDragging] = useState(false);
  const close = useCallback(() => setOpen(null), []);
  const n = events.length;
  // Scroll progress (0..n-1) + manual drag offset (face units). Rendered as rotationY.
  const scrollPos = useRef(0);
  const dragPos = useRef(0);
  const suppressClick = useRef(false);
  // Exposed for Prev/Next buttons (set inside the GSAP context).
  const stepRef = useRef<(dir: 1 | -1) => void>(() => {});

  const handleOpen = useCallback((e: EventItem) => {
    if (suppressClick.current) return;
    setOpen(e);
  }, []);

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
      // Re-assert the exact JS-computed offset (CSS already holds the
      // pre-hydration default so first paint is cylindrical, not flat).
      gsap.set(rg, { z: -r });
      const setRot = gsap.quickSetter(rg, "rotationY", "deg");
      const paint = (pos: number) => {
        faces.forEach((face, i) => {
          let d = Math.abs(i - pos) % n;
          d = Math.min(d, n - d);
          const t = Math.min(d / 2.5, 1);
          face.style.opacity = String(1 - t * 0.8);
          face.style.transform = `scale(${(1 + 0.07 * Math.max(0, 1 - d)).toFixed(3)})`;
          const lit = d < 0.5 ? "true" : "false";
          if (face.dataset.lit !== lit) face.dataset.lit = lit;
        });
      };
      const render = () => {
        const total = scrollPos.current + dragPos.current;
        setRot((-total * 360) / n);
        paint(total);
      };
      render();
      if (head.current) {
        gsap.from(head.current, { y: 28, opacity: 0, duration: 0.9, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 75%", once: true } });
      }
      gsap.from(rg, { opacity: 0, duration: 1.1, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 70%", once: true } });
      // Scroll stays the primary driver (pinned + scrubbed). Drag adds an offset on top.
      ScrollTrigger.create({
        trigger: el, start: "top top", end: `+=${n * 70}%`,
        pin: true, anticipatePin: 1, scrub: 0.6,
        onUpdate: (s) => { scrollPos.current = s.progress * (n - 1); render(); },
      });

      const pxPerFace = Math.max(140, w * 0.9);
      const snap = () => {
        const total = scrollPos.current + dragPos.current;
        const target = Math.round(total);
        gsap.to(dragPos, {
          current: target - scrollPos.current,
          duration: 0.45, ease: "power3.out", overwrite: true, onUpdate: render,
        });
      };
      const step = (dir: 1 | -1) => {
        // Next (dir=1) advances one face; Prev goes back. Clamp total so the
        // ring can't be spun into empty space beyond the first/last face.
        const total = scrollPos.current + dragPos.current;
        const target = Math.min(n - 1, Math.max(0, Math.round(total) + dir));
        gsap.to(dragPos, {
          current: target - scrollPos.current,
          duration: 0.6, ease: "power3.out", overwrite: true, onUpdate: render,
        });
      };
      stepRef.current = step;

      // Pointer drag on the pinned section: horizontal moves the ring,
      // vertical still scrolls the page (touch-action: pan-y set in JSX).
      let activeId: number | null = null;
      let lastX = 0;
      let movedPx = 0;
      const onDown = (ev: PointerEvent) => {
        if (activeId !== null) return;
        // Let the Prev/Next/Skip controls behave as plain clicks.
        if ((ev.target as HTMLElement).closest(".caption button, .caption a")) return;
        activeId = ev.pointerId;
        lastX = ev.clientX;
        movedPx = 0;
        gsap.killTweensOf(dragPos);
      };
      const onMove = (ev: PointerEvent) => {
        if (ev.pointerId !== activeId) return;
        const dx = ev.clientX - lastX;
        lastX = ev.clientX;
        movedPx += Math.abs(dx);
        if (movedPx > 6) {
          suppressClick.current = true;
          setDragging(true);
        }
        // Drag left -> next face, drag right -> previous face.
        dragPos.current -= dx / pxPerFace;
        // Clamp so you can't drag past the ends.
        dragPos.current = Math.min(n - 1 - scrollPos.current, Math.max(-scrollPos.current, dragPos.current));
        render();
      };
      const onUp = (ev: PointerEvent) => {
        if (ev.pointerId !== activeId) return;
        activeId = null;
        setDragging(false);
        if (movedPx > 6) {
          snap();
          window.setTimeout(() => { suppressClick.current = false; }, 120);
        }
      };
      el.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
      const onKey = (ev: KeyboardEvent) => {
        if (ev.key === "ArrowRight") step(1);
        if (ev.key === "ArrowLeft") step(-1);
      };
      el.addEventListener("keydown", onKey);
      return () => {
        el.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        el.removeEventListener("keydown", onKey);
      };
    });
    return () => mm.revert();
  }, [n]);

  return (
    <section ref={root} id="quest" aria-labelledby="quest-h" className="world relative" tabIndex={0}
      aria-label="The Quest event ring. Scroll to spin, or drag left and right, or use arrow keys.">
      <div aria-hidden className="world-scaffold">
        <span className="world-axis" />
        <span className="world-rule top" />
      </div>
      <div ref={head} className="absolute inset-x-0 top-24 z-10 px-6 text-center pointer-events-none">
        <p className="font-display text-[11px] tracking-[0.35em] text-volt/80">EVENTS</p>
        <h2 id="quest-h" className="mt-2 font-display text-3xl font-bold uppercase tracking-wide md:text-5xl">The Quest</h2>
        <p className="mt-2 font-display text-[11px] tracking-[0.25em] text-white/50 motion-reduce:hidden">SCROLL OR DRAG ⟷</p>
      </div>
      <div ref={ring} className={`ring absolute inset-0 ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{ touchAction: "pan-y" }}>
        {events.map((e, i) => (
          <div key={e.id} className="slot" style={{ "--i": i, "--n": n } as CSSProperties}>
            <EventCard event={e} index={i} total={n} onOpen={handleOpen} />
          </div>
        ))}
      </div>
      <div className="caption z-20 flex flex-col items-center gap-3 px-6 text-center motion-reduce:hidden">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => stepRef.current(-1)} aria-label="Previous event"
            className="border border-volt/60 px-4 py-3 font-display text-sm hover:bg-volt hover:text-black">←</button>
          <a href="#event-index" className="border border-volt px-5 py-3 font-display text-sm">Skip</a>
          <button type="button" onClick={() => stepRef.current(1)} aria-label="Next event"
            className="border border-volt/60 px-4 py-3 font-display text-sm hover:bg-volt hover:text-black">→</button>
        </div>
      </div>
      {open && <EventDetail event={open} festival={festival} onClose={close} />}
    </section>
  );
}
