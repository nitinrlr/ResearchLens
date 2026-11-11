import { describe, expect, it } from "vitest";

import { pageAt, pdfViewerSource } from "./pdf-viewer";

describe("pdfViewerSource", () => {
  it("loads arXiv PDFs directly", () => {
    expect(pdfViewerSource("p1", "https://arxiv.org/pdf/1706.03762")).toBe("https://arxiv.org/pdf/1706.03762");
  });

  it("sends other publishers, plain http and broken links through our server", () => {
    for (const url of ["https://dl.acm.org/doi/pdf/10.1145/1", "http://arxiv.org/pdf/1", "not a url", "https://arxiv.org.evil.example/x.pdf"]) {
      expect(pdfViewerSource("p1", url)).toBe("/api/papers/p1/pdf");
    }
  });
});

describe("pageAt", () => {
  const tops = [12, 1012, 2012];

  it("picks the last page that starts above the reading line", () => {
    expect(pageAt(tops, 0)).toBe(1);
    expect(pageAt(tops, 1011)).toBe(1);
    expect(pageAt(tops, 1012)).toBe(2);
    expect(pageAt(tops, 9999)).toBe(3);
  });
});
