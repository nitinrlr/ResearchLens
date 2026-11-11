"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Text } from "@radix-ui/themes";

import AskAiSelection from "@/components/ask-ai-selection";
import { pdfViewerSource } from "@/lib/pdf-viewer";

// PDF.js only runs in the browser, and is large, so it loads on this page only.
const PdfViewer = dynamic(() => import("@/components/pdf-viewer"), {
  ssr: false,
  loading: () => (
    <Text as="p" size="2" color="gray" className="h-[75vh] border-t border-line bg-black/25 p-6 text-center">
      Loading PDF…
    </Text>
  ),
});

/**
 * The paper's PDF with selectable text for Ask Lens. If our viewer can't load
 * it, the publisher's own viewer is embedded instead.
 */
export default function PaperReader({ paperId, pdfUrl, title }: { paperId: string; pdfUrl: string; title: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <iframe src={pdfUrl} title={`PDF for ${title}`} className="block h-[75vh] w-full border-t border-line bg-canvas" />;
  }

  return (
    <AskAiSelection>
      <PdfViewer file={pdfViewerSource(paperId, pdfUrl)} onError={() => setFailed(true)} />
    </AskAiSelection>
  );
}
