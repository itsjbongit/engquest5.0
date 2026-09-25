"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TARGET_DATE = new Date("2026-10-01T10:00:00+05:30");

function pad(num: number) {
  return String(num).padStart(2, "0");
}

function getTimeRemaining() {
  const now = new Date();
  const diff = TARGET_DATE.getTime() - now.getTime();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, completed: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, completed: false };
}

const units = [
  { key: "days", label: "DAYS" },
  { key: "hours", label: "HOURS" },
  { key: "minutes", label: "MINUTES" },
  { key: "seconds", label: "SECONDS" },
] as const;

export function Countdown() {
  const [time, setTime] = useState(getTimeRemaining());
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useRef(false);
  const gearRef = useRef<SVGSVGElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: reduce)", () => {});
    return () => mm.revert();
  }, []);

  useEffect(() => {
    setMounted(true);
    const initial = getTimeRemaining();
    setTime(initial);
    if (initial.completed) return;

    const interval = setInterval(() => {
      setTime(getTimeRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const gear = gearRef.current;
    if (!gear) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const rotation = gsap.to(gear, { rotation: 360, duration: 20, ease: "none", repeat: -1 });
    return () => { rotation.kill(); };
  }, [mounted]);

  const prevTimeRef = useRef<typeof time>({ days: 0, hours: 0, minutes: 0, seconds: 0, completed: false });

  useEffect(() => {
    if (!mounted) return;
    units.forEach((u, i) => {
      const card = cardRefs.current[i];
      if (!card) return;
      const prev = prevTimeRef.current[u.key];
      const curr = time[u.key];
      if (prev !== curr && prev !== undefined) {
        gsap.fromTo(card, { rotateX: -90, opacity: 0 }, { rotateX: 0, opacity: 1, duration: 0.5, ease: "power2.out" });
      }
    });
    prevTimeRef.current = time;
  }, [time, mounted]);

  if (!mounted) {
    return (
      <section id="countdown" aria-labelledby="countdown-h" className="relative flex min-h-[60vh] items-center justify-center px-6 py-16 md:px-16 overflow-hidden">
        <div className="w-full max-w-5xl" aria-hidden="true">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            <div className="size-32 md:size-40 shrink-0" aria-hidden="true">
              <svg ref={gearRef} viewBox="0 0 200 200" className="w-full h-full text-volt/30" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="100" cy="100" r="80" strokeDasharray="20 20" />
                <circle cx="100" cy="100" r="50" />
                <circle cx="100" cy="100" r="12" fill="currentColor" />
                {Array.from({ length: 12 }).map((_, i) => (
                  <line key={i} x1="100" y1="20" x2="100" y2="40" transform={`rotate(${i * 30} 100 100)`} strokeWidth="3" />
                ))}
              </svg>
            </div>
            <div className="flex flex-wrap items-start justify-center gap-4 md:gap-6" role="timer" aria-label="Countdown to ENGQUEST 5.0">
              {units.map((u) => (
                <div key={u.key} className="flex flex-col items-center gap-3">
                  <div className="relative w-24 md:w-28 h-28 md:h-32 rounded-xl bg-black/50 border border-white/10 backdrop-blur-sm flex items-center justify-center">
                    <span className="font-display text-3xl md:text-4xl font-bold text-white">00</span>
                  </div>
                  <span className="font-display text-xs tracking-widest text-volt/70 text-center w-24 md:w-28">{u.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (time.completed) {
    return (
      <section id="countdown" aria-labelledby="countdown-h" className="relative flex min-h-[60vh] items-center justify-center px-6 py-16 md:px-16 overflow-hidden">
        <div className="w-full max-w-5xl text-center">
          <div className="size-32 md:size-40 mx-auto mb-8" aria-hidden="true">
            <svg viewBox="0 0 200 200" className="w-full h-full text-volt/30" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="100" cy="100" r="80" strokeDasharray="20 20" />
              <circle cx="100" cy="100" r="50" />
              <circle cx="100" cy="100" r="12" fill="currentColor" />
              {Array.from({ length: 12 }).map((_, i) => (
                <line key={i} x1="100" y1="20" x2="100" y2="40" transform={`rotate(${i * 30} 100 100)`} strokeWidth="3" />
              ))}
            </svg>
          </div>
          <h2 id="countdown-h" className="font-display text-4xl md:text-6xl font-bold tracking-tight text-volt">
            THE QUEST BEGINS
          </h2>
        </div>
      </section>
    );
  }

  return (
    <section id="countdown" aria-labelledby="countdown-h" className="relative flex min-h-[60vh] items-center justify-center px-6 py-16 md:px-16 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-volt)_0%,_transparent_70%)] opacity-10" aria-hidden="true" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Cpath d=\'M0 0h100v100H0z\' fill=\'none\'/%3E%3Cpath d=\'M0 0L100 100M100 0L0 100\' stroke=\'%2300a8ff\' stroke-width=\'0.3\' stroke-opacity=\'0.1\'/%3E%3C/svg%3E')] opacity-20" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-5xl">
        <h2 id="countdown-h" className="sr-only">Countdown to ENGQUEST 5.0</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          <div className="size-32 md:size-40 shrink-0 relative" aria-hidden="true">
            <svg ref={gearRef} viewBox="0 0 200 200" className="w-full h-full text-volt/40" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="100" cy="100" r="80" strokeDasharray="20 20" />
              <circle cx="100" cy="100" r="50" />
              <circle cx="100" cy="100" r="12" fill="currentColor" />
              {Array.from({ length: 12 }).map((_, i) => (
                <line key={i} x1="100" y1="20" x2="100" y2="40" transform={`rotate(${i * 30} 100 100)`} strokeWidth="3" />
              ))}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg viewBox="0 0 200 200" className="w-full h-full text-volt/20" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="100" cy="100" r="90" strokeDasharray="5 15" />
              </svg>
            </div>
          </div>
          <div className="flex flex-wrap items-start justify-center gap-4 md:gap-6" role="timer" aria-label="Countdown to ENGQUEST 5.0, October 1st 2026">
            {units.map((u, i) => (
              <div key={u.key} className="flex flex-col items-center gap-3">
                <div
                  ref={(el) => { cardRefs.current[i] = el; }}
                  className="relative w-24 md:w-28 h-28 md:h-32 rounded-xl bg-black/40 border border-white/10 backdrop-blur-sm flex items-center justify-center group"
                  style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                >
                  <div className="relative z-10" style={{ transformStyle: "preserve-3d" }}>
                    <span className="font-display text-3xl md:text-4xl font-bold text-white">{pad(time[u.key])}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-volt/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                </div>
                <span className="font-display text-xs tracking-widest text-volt/70 text-center w-24 md:w-28">{u.label}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-10 text-center text-sm text-white/50 font-display tracking-wider">
          ENGQUEST 5.0 · SoE TechFest · JNU
        </p>
      </div>
    </section>
  );
}