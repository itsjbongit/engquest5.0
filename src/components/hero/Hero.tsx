"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { festival as f } from "@/content/festival";
import { GoToBottom } from "@/components/ui/ScrollButtons";
import Particles from "./Particles/Particles";

gsap.registerPlugin(ScrollTrigger);

const traces = ["M60 185H105L120 170H150", "M55 210H95L112 226H145", "M75 240H120L132 252"];

export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const [motionOK, setMotionOK] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionOK(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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
        .fromTo(".logo-mark", { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }, 4.2)
        .to(".vector-mark", { opacity: 0, duration: 0.8 }, 4.2)
        .fromTo($(".reveal"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.2, duration: 1 }, 4.8)
        .to({}, { duration: 1.5 });
      gsap.fromTo(el.querySelector(".scroll-hint"), { opacity: 1 }, { opacity: 0, y: -8, duration: 0.6, ease: "power1.out",
        scrollTrigger: { trigger: el, start: "top top", end: "+=45%", scrub: 0.4 } });
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={root} className="h-[300svh] motion-reduce:h-auto">
      <section aria-label="ENGQUEST 5.0" className="sticky top-0 flex h-svh flex-col items-center justify-center gap-6 px-6 text-center motion-reduce:static motion-reduce:min-h-svh"
        style={{ background: "radial-gradient(60% 45% at 50% 40%, #061827 0%, #000 70%)" }}>
        <div aria-hidden className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${motionOK ? "opacity-100" : "opacity-0"}`} style={{ zIndex: -1 }}>
          {motionOK && (
            <Particles
              particleColors={["#00a8ff", "#ffffff", "#9fdcff"]}
              particleCount={200}
              particleSpread={10}
              speed={0.1}
              particleBaseSize={100}
              moveParticlesOnHover={false}
              alphaParticles={false}
              disableRotation={false}
            />
          )}
        </div>
        <div className="relative aspect-square w-[min(80vmin,440px)] sm:w-[min(58vmin,440px)]">
          {/* Abstract build-up: draws in on scroll, then hands off to the real logo below */}
          <svg viewBox="0 0 400 400" className="vector-mark absolute inset-0 size-full motion-reduce:hidden" fill="none" aria-hidden>
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
          {/* The real mark: this is what the compass resolves into, and what shows immediately under reduced motion */}
          <Image src={f.logo} alt={`${f.name} ${f.edition} emblem`} fill sizes="440px"
            className="logo-mark object-contain opacity-0 motion-reduce:opacity-100" priority />
        </div>
        <div>
          <h1 className="sr-only">{f.name} {f.edition} · {f.school}, {f.university}</h1>
          <p className="reveal font-display text-lg">{f.year}</p>
          {f.tagline && <p className="reveal mt-2 font-display text-sm tracking-[0.3em] text-volt"><span className="block">THE QUEST BEGINS</span><span className="block mt-2">OCTOBER 1st, 2026</span></p>}
        </div>
        <div aria-hidden="true" className="scroll-hint absolute inset-x-0 bottom-8 flex flex-col items-center gap-2 motion-reduce:hidden">
          <span className="font-display text-xs tracking-[0.3em] text-white/50">SCROLL TO CONTINUE</span>
          <svg viewBox="0 0 20 12" className="size-4 motion-safe:animate-bounce" fill="none" stroke="#00a8ff" strokeWidth="1.5">
            <path d="M2 2l8 8 8-8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <GoToBottom />
      </section>
    </div>
  );
}