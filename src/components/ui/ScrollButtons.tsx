"use client";

import { useEffect, useState } from "react";

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 size-12 rounded-full bg-ink border border-volt/50 flex items-center justify-center hover:bg-deep hover:border-volt transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-volt"
      aria-label="Go to top"
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
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToBottom}
      className="fixed bottom-6 right-6 z-50 size-12 rounded-full bg-ink border border-volt/50 flex items-center justify-center hover:bg-deep hover:border-volt transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-volt"
      aria-label="Go to bottom"
    >
      <svg viewBox="0 0 24 24" className="size-6 text-volt" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
  );
}