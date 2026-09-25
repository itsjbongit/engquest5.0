"use client";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { festival as f } from "@/content/festival";

gsap.registerPlugin(ScrollTrigger);

const traces = ["M60 185H105L120 170H150", "M55 210H95L112 226H145", "M75 240H120L132 252"];

export function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current!;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const $ = (s: string) => el.querySelectorAll(s);
      gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.8 } })
        .fromTo($(".ring-draw"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: 0.15, duration: 2, ease: "power2.out" }, 0)
        .fromTo($(".ticks"), { opacity: 0 }, { opacity: 1, duration: 1 }, 1)
        .fromTo($(".trace"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: 0.2, duration: 1.4, ease: "none" }, 2)
        .fromTo(".needle", { rotation: -80, svgOrigin: "200 200" }, { rotation: 0, svgOrigin: "200 200", duration: 1.6, ease: "power3.inOut" }, 3)
        .fromTo($(".reveal"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.2, duration: 1 }, 4.5)
        .to({}, { duration: 1.5 });
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={root} className="h-[300svh] motion-reduce:h-auto">
      <section aria-label="ENGQUEST 5.0" className="sticky top-0 flex h-svh flex-col items-center justify-center gap-6 px-6 text-center motion-reduce:static motion-reduce:min-h-svh"
        style={{ background: "radial-gradient(60% 45% at 50% 40%, #061827 0%, #000 70%)" }}>
        <svg viewBox="0 0 400 400" className="w-[min(58vmin,440px)]" fill="none" aria-hidden>
          <circle className="ring-draw draw" pathLength={1} cx="200" cy="200" r="188" stroke="#00a8ff" strokeWidth="3" />
          <circle className="ring-draw draw" pathLength={1} cx="200" cy="200" r="174" stroke="#fff" strokeWidth="5" strokeDasharray="0.09 0.02" />
          <circle className="ticks" cx="200" cy="200" r="152" stroke="#00a8ff" strokeWidth="12" strokeDasharray="1.5 8" opacity=".8" />
          {traces.map((d) => (
            <g key={d}>
              <path className="trace draw" pathLength={1} d={d} stroke="#00a8ff" strokeWidth="2" />
              <path className="trace draw" pathLength={1} d={d} transform="translate(400 0) scale(-1 1)" stroke="#fff" strokeWidth="1.5" />
            </g>
          ))}
          <g className="needle">
            <path d="M200 26L209 200H191Z" fill="#fff" /><path d="M200 374L209 200H191Z" fill="#00a8ff" />
          </g>
          <circle cx="200" cy="200" r="7" fill="#000" stroke="#fff" strokeWidth="2" />
        </svg>
        <div>
          <h1 className="font-display text-5xl font-bold tracking-tight md:text-7xl">
            <span className="reveal inline-block">{f.name}</span>{" "}
            <span className="reveal inline-block text-volt">{f.edition}</span>
          </h1>
          <p className="reveal mt-3 text-base text-white/80 md:text-lg">{f.school} · {f.university}</p>
          <p className="reveal mt-1 font-display text-lg">{f.year}</p>
          {f.tagline && <p className="reveal mt-4 font-display text-sm tracking-[0.3em] text-volt">{f.tagline}</p>}
        </div>
      </section>
    </div>
  );
}
