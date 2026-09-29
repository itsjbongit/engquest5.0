"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Guards the re-enable step so rapid successive jumps can't re-enable the
// ring mid-jump.
let jumpSeq = 0;

/**
 * Jump directly to an element id without playing the Quest ring's card
 * animation. An instant jump (not smooth scroll) passes the pinned ring
 * section as a single section instead of scrubbing through every card, and
 * the ring's ScrollTrigger is parked during the jump so its scrub smoothing
 * doesn't replay the spin either.
 */
export function jumpToId(id: string) {
  const my = ++jumpSeq;
  // The pinned scrub trigger specifically (the head/ring entrance fades also
  // use #quest as their trigger, so match the one that owns the pin).
  const trigger = ScrollTrigger.getAll().find((s) => {
    const t = s.trigger as HTMLElement | null;
    return !!t && t.id === "quest" && !!s.pin;
  });
  // Absolute pixel target, clamped to the scrollable range. Computed with
  // window.scrollTo (not scrollIntoView) so the ring's pin-spacer recalc in
  // refresh() below can't redirect the landing.
  const targetTop = () => {
    const el = document.getElementById(id);
    if (!el) return null;
    // "instant", not "auto": "auto" defers to the CSS scroll-behavior (smooth
    // on this site) and would tour through the ring cards again.
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return Math.max(0, Math.min(el.getBoundingClientRect().top + window.scrollY, max));
  };
  if (trigger) trigger.disable(false);
  const first = targetTop();
  if (first === null) {
    if (trigger) trigger.enable();
    return;
  }
  window.scrollTo({ top: first, behavior: "instant" as ScrollBehavior });
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      if (my !== jumpSeq) return;
      if (trigger) {
        trigger.enable();
        ScrollTrigger.refresh();
      }
      // Re-assert the landing: if re-enabling/refreshing the pin pulled the
      // page back (e.g. into the ring section), jump to the target again.
      const want = targetTop();
      if (want !== null && Math.abs(window.scrollY - want) > 4) {
        window.scrollTo({ top: want, behavior: "instant" as ScrollBehavior });
      }
    }),
  );
}

export function GoToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    jumpToId("intro");
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 size-12 rounded-full bg-ink border border-volt/50 flex items-center justify-center hover:bg-deep hover:border-volt transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-volt"
      aria-label="Go to info section"
    >
      <svg viewBox="0 0 24 24" className="size-6 text-volt" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
}

export function GoToBottom() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      setVisible(scrollTop + clientHeight < scrollHeight - 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    jumpToId("footer");
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToBottom}
      className="fixed bottom-6 right-6 z-50 size-12 rounded-full bg-ink border border-volt/50 flex items-center justify-center hover:bg-deep hover:border-volt transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-volt"
      aria-label="Go to footer"
    >
      <svg viewBox="0 0 24 24" className="size-6 text-volt" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
  );
}