"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollSetup() {
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });
    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    // `load` may have fired before hydration (fast/cached loads), in which
    // case the listener below never runs and pinned sections keep stale
    // measurements — exactly the first-load overlap. Cover both cases.
    if (document.readyState === "complete") {
      refresh();
      timer = setTimeout(refresh, 500);
    } else {
      window.addEventListener("load", refresh);
      timer = setTimeout(refresh, 1500);
    }
    if (document.fonts) {
      document.fonts.ready.then(refresh).catch(() => {});
    }
    return () => {
      window.removeEventListener("load", refresh);
      cancelAnimationFrame(raf);
      if (timer) clearTimeout(timer);
    };
  }, []);
  return null;
}
