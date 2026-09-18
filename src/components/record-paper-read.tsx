"use client";

import { useEffect } from "react";

/**
 * Fires once when the paper detail page mounts so the paper shows up under
 * Continue Reading.
 *
 * Renders nothing. This runs on the client on purpose — doing the write during
 * the server render would also fire on Next.js link prefetches, marking papers
 * as read that the user only hovered over.
 */
export default function RecordPaperRead({ paperId }: { paperId: string }) {
  useEffect(() => {
    // Ignore failures: reading history is a convenience, not something worth
    // interrupting the page for.
    fetch(`/api/papers/${paperId}/read`, {
      method: "POST",
    }).catch(() => {});
  }, [paperId]);

  return null;
}
