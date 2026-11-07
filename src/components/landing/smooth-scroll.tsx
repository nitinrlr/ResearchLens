"use client";

import { useEffect } from "react";
import gsap from "gsap";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/** Smooth scrolling for the landing page only. */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ anchors: true });
    const update = (time: number) => lenis.raf(time * 1000);

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return null;
}
