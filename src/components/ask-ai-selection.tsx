"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@radix-ui/themes";

import { cleanQuote } from "@/lib/chat-request";

/** Sent on window with the highlighted text; the paper chat listens for it. */
export const ASK_AI_EVENT = "researchlens:ask-ai";

/**
 * Shows a small "Ask AI" button above text highlighted inside it. Clicking it
 * hands the passage to the paper chat.
 */
export default function AskAiSelection({ children }: { children: React.ReactNode }) {
  const container = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState<{ text: string; x: number; y: number } | null>(null);

  function update() {
    const current = window.getSelection();
    const text = current?.toString().trim() ?? "";

    if (!current || !text || current.rangeCount === 0 || !container.current?.contains(current.anchorNode)) {
      setSelection(null);
      return;
    }

    const rect = current.getRangeAt(0).getBoundingClientRect();
    setSelection({ text: cleanQuote(text), x: rect.left + rect.width / 2, y: rect.top });
  }

  // The button is fixed in place, so hide it once the page moves or the
  // highlight is cleared.
  useEffect(() => {
    const hide = () => setSelection(null);
    const onSelectionChange = () => {
      if (!window.getSelection()?.toString().trim()) hide();
    };

    window.addEventListener("scroll", hide, true);
    document.addEventListener("selectionchange", onSelectionChange);

    return () => {
      window.removeEventListener("scroll", hide, true);
      document.removeEventListener("selectionchange", onSelectionChange);
    };
  }, []);

  function ask() {
    if (!selection) return;
    window.dispatchEvent(new CustomEvent(ASK_AI_EVENT, { detail: selection.text }));
    window.getSelection()?.removeAllRanges();
    setSelection(null);
  }

  return (
    <div ref={container} onMouseUp={update} onKeyUp={update}>
      {children}

      {/*
        Rendered at the top of the page: the frosted panels around the abstract
        use backdrop-filter, which would make "fixed" relative to the panel.
        The root Radix theme keeps the button styled.
      */}
      {selection &&
        createPortal(
          <Button
            size="1"
            // Keeps the highlight from being cleared before the click lands.
            onMouseDown={(event) => event.preventDefault()}
            onClick={ask}
            className="fixed z-50 -translate-x-1/2 -translate-y-full shadow-lg"
            style={{ left: selection.x, top: selection.y - 8 }}
          >
            <Sparkles size={14} />
            Ask Lens
          </Button>,
          document.querySelector(".radix-themes[data-is-root-theme='true']") ?? document.body
        )}
    </div>
  );
}
