"use client";

import { useEffect, useRef } from "react";

// Pixels per second.
const SPEED = 40;

/**
 * A row of cards that drifts left after the page scrolls down and right after
 * it scrolls up, always at the same speed. The cards are drawn twice side by
 * side, so the row loops without a jump.
 */
export default function PaperMarquee({ children }: { children: React.ReactNode }) {
  const row = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rowElement = row.current!;
    const trackElement = track.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = 0;
    let direction = -1;
    let lastScroll = window.scrollY;
    let lastTime = 0;
    let frame = 0;

    function step(time: number) {
      const seconds = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0;
      lastTime = time;

      const scrolled = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      if (scrolled !== 0) direction = scrolled > 0 ? -1 : 1;

      const half = trackElement.scrollWidth / 2;
      x += direction * SPEED * seconds;
      // Keep x between -half and 0, where both copies line up.
      x = ((x % half) - half) % half;
      trackElement.style.transform = `translate3d(${x}px, 0, 0)`;

      frame = requestAnimationFrame(step);
    }

    // Only animate while the row is on screen.
    const visibility = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry.isIntersecting) {
        lastTime = 0;
        lastScroll = window.scrollY;
        frame = requestAnimationFrame(step);
      }
    });
    visibility.observe(rowElement);

    return () => {
      cancelAnimationFrame(frame);
      visibility.disconnect();
    };
  }, []);

  return (
    <div ref={row} className="paper-marquee">
      <div ref={track} className="flex w-max will-change-transform">
        <div className="flex">{children}</div>
        <div className="flex" aria-hidden="true" inert>
          {children}
        </div>
      </div>
    </div>
  );
}
