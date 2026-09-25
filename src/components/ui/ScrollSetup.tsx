"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollSetup() {
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    if (document.fonts) {
      document.fonts.ready.then(refresh).catch(() => {});
    }
    return () => window.removeEventListener("load", refresh);
  }, []);
  return null;
}
