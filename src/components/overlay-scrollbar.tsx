"use client";

import { useEffect, useRef } from "react";

/** A draggable scrollbar that floats over the page, so it never takes up width. */
export default function OverlayScrollbar() {
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const thumb = thumbRef.current!;
    const page = document.documentElement;
    let scrollPerPixel = 1;

    function update() {
      const view = page.clientHeight;
      const full = page.scrollHeight;

      thumb.style.display = full > view ? "" : "none";

      const height = Math.max((view * view) / full, 40);
      scrollPerPixel = (full - view) / (view - height);

      thumb.style.height = `${height}px`;
      thumb.style.transform = `translateY(${window.scrollY / scrollPerPixel}px)`;
    }

    let startY = 0;
    let startScroll = 0;

    function drag(event: PointerEvent) {
      window.scrollTo(0, startScroll + (event.clientY - startY) * scrollPerPixel);
    }

    function stopDrag() {
      thumb.removeEventListener("pointermove", drag);
    }

    function startDrag(event: PointerEvent) {
      event.preventDefault();
      startY = event.clientY;
      startScroll = window.scrollY;
      thumb.setPointerCapture(event.pointerId);
      thumb.addEventListener("pointermove", drag);
    }

    update();
    thumb.addEventListener("pointerdown", startDrag);
    thumb.addEventListener("pointerup", stopDrag);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    // Catches the page changing length when moving between tabs.
    const observer = new ResizeObserver(update);
    observer.observe(document.body);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      ref={thumbRef}
      aria-hidden="true"
      className="fixed right-0.5 top-0 z-50 w-2 touch-none rounded-full bg-white/35 transition-colors hover:bg-white/60"
    />
  );
}
