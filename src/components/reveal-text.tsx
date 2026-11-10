"use client";

import { useEffect, useState } from "react";

const TICK_MS = 35;

// Words shown per tick grow with the backlog, so a long answer that arrives
// all at once still finishes in a couple of seconds.
const WORDS_PER_BACKLOG = 150;

const WORD = /\S+\s*/y;

/** Where the text would end after showing `count` more words from `from`. */
function advance(text: string, from: number, count: number) {
  let end = from;

  for (let i = 0; i < count; i++) {
    WORD.lastIndex = end;
    const match = WORD.exec(text);
    if (!match) break;
    end = WORD.lastIndex;
  }

  // Leading whitespace (such as a blank line) comes along with the next word.
  return end === from ? text.length : end;
}

/**
 * Shows streamed text a few words at a time, each fading in, instead of in the
 * large chunks the model sends.
 */
export default function RevealText({ text, onGrow }: { text: string; onGrow?: () => void }) {
  const [reducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [shown, setShown] = useState(0);
  const visible = reducedMotion ? text.length : Math.min(shown, text.length);

  useEffect(() => {
    if (reducedMotion || shown >= text.length) return;

    const timer = setTimeout(() => {
      const backlog = text.slice(shown).split(/\s+/).length;
      setShown(advance(text, shown, Math.max(1, Math.ceil(backlog / WORDS_PER_BACKLOG) * 2)));
    }, TICK_MS);

    return () => clearTimeout(timer);
  }, [text, shown, reducedMotion]);

  useEffect(() => {
    onGrow?.();
  }, [visible, onGrow]);

  if (reducedMotion) {
    return <>{text}</>;
  }

  // Keyed by position, so words already on screen stay mounted and only the
  // new ones play the fade-in.
  const words = [...text.slice(0, visible).matchAll(/\s*\S+\s*/g)];

  return (
    <>
      {words.map((word) => (
        <span key={word.index} className="fade-in-word">
          {word[0]}
        </span>
      ))}
    </>
  );
}
