"use client";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { contacts } from "@/content/contacts";
import { festival as f } from "@/content/festival";

gsap.registerPlugin(ScrollTrigger);

export function ContactSection() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current!;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(el.querySelector(".contact-heading"), { y: 32, opacity: 0, duration: 0.9, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 78%", once: true } });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="contact" aria-labelledby="contact-h" className="flex flex-col justify-center px-6 py-24 md:px-16 sm:min-h-svh">
      <h2 id="contact-h" className="contact-heading font-display text-4xl font-bold md:text-7xl">{f.copy.contactHeading}</h2>
      <p className="mt-3 text-lg text-volt">{f.copy.contactLine}</p>
      <ul className="mt-12 grid gap-6 sm:grid-cols-2">
        {contacts.map((c) => (
          <li key={c.name} className="border-l-2 border-volt pl-4">
            <p className="font-display text-xl">{c.name}</p>
            {c.role && <p className="text-white/70">{c.role}</p>}
            {c.email && <a className="block underline" href={`mailto:${c.email}`}>{c.email}</a>}
            {c.phone && <a className="block underline" href={`tel:${c.phone}`}>{c.phone}</a>}
            {c.url && <a className="block underline" href={c.url}>{c.url}</a>}
          </li>
        ))}
      </ul>
    </section>
  );
}
