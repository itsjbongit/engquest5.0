"use client";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { festival as f } from "@/content/festival";

gsap.registerPlugin(ScrollTrigger);

export function Intro() {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(root.current!.querySelectorAll("li"), { opacity: 0.12 }, { opacity: 1, stagger: 0.4, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom 45%", scrub: true } });
    });
    return () => mm.revert();
  }, []);
  return (
    <section ref={root} id="intro" aria-labelledby="intro-h" className="flex min-h-svh items-center px-6 md:px-16">
      <div>
        <h2 id="intro-h" className="sr-only">About {f.name} {f.edition}</h2>
        <ul className="font-display text-5xl font-bold leading-[1.05] md:text-8xl">
          {f.copy.introWords.map((w) => <li key={w}>{w}</li>)}
        </ul>
        <p className="mt-8 max-w-prose text-lg text-white/75">{f.subtitle} at the {f.school}, {f.university}.</p>
      </div>
    </section>
  );
}
