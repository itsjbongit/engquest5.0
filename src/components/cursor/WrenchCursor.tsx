"use client";
import { useEffect, useRef, useState } from "react";

const INTERACTIVE = "a, button, [role='button'], [role='link'], summary, label, select, [data-cursor='hover']";
const TEXT_ENTRY = "input:not([type='checkbox']):not([type='radio']):not([type='range']), textarea, [contenteditable='true']";

/**
 * WrenchCursor — PC-only custom cursor matching the ENGQUEST theme
 * (volt #00a8ff on deep #061827 / black, Chakra Petch engineering vibe).
 * A volt wrench slanted with its head at the 10 o'clock position.
 * Renders nothing on touch devices; native cursor stays untouched there.
 */
export function WrenchCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [typing, setTyping] = useState(false);
  const [pressed, setPressed] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const wrenchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    const wrench = wrenchRef.current;
    if (!root || !wrench) return;

    document.documentElement.classList.add("custom-cursor");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const pos = { x: -100, y: -100, tilt: 0 };
    const target = { x: -100, y: -100 };
    let raf = 0;
    let shown = false;

    const loop = () => {
      // Wrench stays snappy on the pointer; only a slight ease + lean for feel.
      // No lag under reduced motion.
      const ease = reduceMotion ? 1 : 0.6;
      const vx = target.x - pos.x;
      pos.x += vx * ease;
      pos.y += (target.y - pos.y) * ease;
      pos.tilt += ((Math.max(-10, Math.min(10, vx * 0.4))) - pos.tilt) * (reduceMotion ? 1 : 0.25);

      root.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      // Offset keeps the jaw tip (head, 10 o'clock) right on the pointer.
      wrench.style.transform = `translate(-14%, -30%) rotate(${pos.tilt}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!shown) {
        shown = true;
        pos.x = e.clientX;
        pos.y = e.clientY;
        setVisible(true);
      }
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t || !(t instanceof Element)) return;
      setTyping(!!t.closest(TEXT_ENTRY));
      setHovering(!!t.closest(INTERACTIVE));
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => {
      if (shown) setVisible(true);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  const hideWrench = !visible || typing;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="wrench-cursor"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {/* volt wrench, slanted with its head at 10 o'clock */}
      <div
        ref={wrenchRef}
        className="wrench-cursor__wrench"
        style={{
          opacity: hideWrench ? 0 : 1,
          scale: `${pressed ? 0.85 : hovering ? 1.2 : 1}`,
        }}
      >
        <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
          <g transform="rotate(-90 16 16)">
            <path
              d="M20.6 7.3a1 1 0 0 0 0 1.5l1.7 1.7a1 1 0 0 0 1.5 0l3.9-3.9a6.4 6.4 0 0 1-8.3 8.3l-7.2 7.2a2.2 2.2 0 0 1-3.1-3.1l7.2-7.2a6.4 6.4 0 0 1 8.3-8.3l-4 3.8Z"
              fill="#00a8ff"
              stroke="#061827"
              strokeWidth="2.6"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M20.6 7.3a1 1 0 0 0 0 1.5l1.7 1.7a1 1 0 0 0 1.5 0l3.9-3.9a6.4 6.4 0 0 1-8.3 8.3l-7.2 7.2a2.2 2.2 0 0 1-3.1-3.1l7.2-7.2a6.4 6.4 0 0 1 8.3-8.3l-4 3.8Z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.7"
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity="0.85"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
