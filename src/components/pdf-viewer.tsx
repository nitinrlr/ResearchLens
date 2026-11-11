"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, ZoomIn, ZoomOut } from "lucide-react";
import { IconButton, Text } from "@radix-ui/themes";
import { Document, Page, pdfjs } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import { ZOOM_LEVELS, pageAt } from "@/lib/pdf-viewer";

// React-PDF needs this set in the same file that renders <Document>.
pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

const MAX_PAGE_WIDTH = 1000;
const PADDING = 12;

/**
 * Draws a PDF page by page, with selectable text. Only pages near the visible
 * area are drawn; the rest are blank boxes of the right size.
 */
export default function PdfViewer({ file, onError }: { file: string; onError: () => void }) {
  const scroller = useRef<HTMLDivElement>(null);
  const slots = useRef<(HTMLDivElement | null)[]>([]);
  // How far down the paper the reader is, kept when the zoom or width changes.
  const position = useRef(0);

  // Each page's height divided by its width.
  const [shapes, setShapes] = useState<number[] | null>(null);
  const [fitWidth, setFitWidth] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [nearby, setNearby] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");

  const pageWidth = Math.floor(fitWidth * zoom);

  useEffect(() => {
    const element = scroller.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      setFitWidth(Math.min(element.clientWidth - PADDING * 2, MAX_PAGE_WIDTH));
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Draw pages within a viewer and a half of the visible area.
  useEffect(() => {
    const root = scroller.current;
    if (!root || !shapes) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setNearby((current) => {
          const next = new Set(current);
          for (const entry of entries) {
            const number = Number((entry.target as HTMLElement).dataset.page);
            if (entry.isIntersecting) next.add(number);
            else next.delete(number);
          }
          return next;
        });
      },
      { root, rootMargin: "150% 0px" }
    );

    slots.current.forEach((slot) => slot && observer.observe(slot));
    return () => observer.disconnect();
  }, [shapes]);

  useLayoutEffect(() => {
    const element = scroller.current;
    if (element) element.scrollTop = position.current * element.scrollHeight;
  }, [pageWidth]);

  async function onLoad(pdf: PDFDocumentProxy) {
    const pages = await Promise.all(
      Array.from({ length: pdf.numPages }, (_, i) => pdf.getPage(i + 1))
    );

    setShapes(
      pages.map((current) => {
        const { width, height } = current.getViewport({ scale: 1 });
        return height / width;
      })
    );
  }

  function onScroll() {
    const element = scroller.current!;
    position.current = element.scrollTop / element.scrollHeight;

    const current = pageAt(
      slots.current.map((slot) => slot?.offsetTop ?? Infinity),
      element.scrollTop + element.clientHeight / 3
    );

    if (current !== page) {
      setPage(current);
      setPageInput(String(current));
    }
  }

  function goToPage(number: number) {
    const slot = slots.current[number - 1];
    if (slot) scroller.current?.scrollTo({ top: slot.offsetTop - PADDING });
  }

  function submitPage(event: React.FormEvent) {
    event.preventDefault();
    const number = Number(pageInput);

    if (shapes && Number.isInteger(number) && number >= 1 && number <= shapes.length) {
      goToPage(number);
    } else {
      setPageInput(String(page));
    }
  }

  const zoomIndex = ZOOM_LEVELS.indexOf(zoom);

  return (
    <div className="flex h-[75vh] flex-col border-t border-line bg-black/25">
      <div className="flex items-center justify-between gap-3 border-b border-line px-3 py-2">
        <form onSubmit={submitPage} className="flex items-center gap-1.5">
          <IconButton type="button" size="1" variant="ghost" color="gray" aria-label="Previous page" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
            <ChevronUp size={16} />
          </IconButton>
          <IconButton type="button" size="1" variant="ghost" color="gray" aria-label="Next page" disabled={!shapes || page >= shapes.length} onClick={() => goToPage(page + 1)}>
            <ChevronDown size={16} />
          </IconButton>
          <input
            value={pageInput}
            onChange={(event) => setPageInput(event.target.value)}
            onBlur={() => setPageInput(String(page))}
            inputMode="numeric"
            aria-label="Page number"
            className="ml-1 w-10 rounded border border-line bg-transparent px-1 py-0.5 text-center text-sm text-ink"
          />
          <Text size="2" color="gray">
            of {shapes?.length ?? "…"}
          </Text>
        </form>

        <div className="flex items-center gap-1.5">
          <IconButton size="1" variant="ghost" color="gray" aria-label="Zoom out" disabled={zoomIndex <= 0} onClick={() => setZoom(ZOOM_LEVELS[zoomIndex - 1])}>
            <ZoomOut size={16} />
          </IconButton>
          <Text size="2" color="gray" className="w-11 text-center tabular-nums">
            {Math.round(zoom * 100)}%
          </Text>
          <IconButton size="1" variant="ghost" color="gray" aria-label="Zoom in" disabled={zoomIndex >= ZOOM_LEVELS.length - 1} onClick={() => setZoom(ZOOM_LEVELS[zoomIndex + 1])}>
            <ZoomIn size={16} />
          </IconButton>
        </div>
      </div>

      <div ref={scroller} onScroll={onScroll} tabIndex={0} aria-label="Paper" className="min-h-0 flex-1 overflow-auto">
        <Document
          file={file}
          suspense={false}
          onLoadSuccess={onLoad}
          onLoadError={onError}
          onSourceError={onError}
          onItemClick={({ pageNumber }) => goToPage(pageNumber)}
          externalLinkTarget="_blank"
          loading={<Text as="p" size="2" color="gray" className="p-6 text-center">Loading PDF…</Text>}
          error={null}
          // Grows past the viewer when zoomed in, so wide pages scroll sideways.
          className="relative flex w-max min-w-full flex-col gap-3 p-3"
        >
          {shapes &&
            pageWidth > 0 &&
            shapes.map((shape, index) => (
              <div
                key={index}
                ref={(slot) => {
                  slots.current[index] = slot;
                }}
                data-page={index + 1}
                className="mx-auto bg-white shadow-md"
                style={{ width: pageWidth, height: Math.round(pageWidth * shape) }}
              >
                {nearby.has(index + 1) && <Page pageNumber={index + 1} width={pageWidth} loading={null} error={null} />}
              </div>
            ))}
        </Document>
      </div>
    </div>
  );
}
