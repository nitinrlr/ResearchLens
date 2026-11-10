import { describe, expect, it } from "vitest";

import { countPdfPages, findCitationPdfUrl, isPdf } from "./paper-pdf";

describe("findCitationPdfUrl", () => {
  it("reads the tag in either attribute order and resolves relative links", () => {
    const page = "https://journal.example/article/7";

    expect(findCitationPdfUrl('<meta name="citation_pdf_url" content="/pdf/7.pdf">', page)).toBe(
      "https://journal.example/pdf/7.pdf"
    );
    expect(findCitationPdfUrl("<meta content='https://cdn.example/7.pdf' name='citation_pdf_url'>", page)).toBe(
      "https://cdn.example/7.pdf"
    );
  });

  it("returns null when the page has no tag", () => {
    expect(findCitationPdfUrl("<html><title>Paywall</title></html>", "https://a.example")).toBeNull();
  });
});

describe("PDF checks", () => {
  const pdf = Buffer.from("%PDF-1.7\n1 0 obj <</Type /Pages>> 2 0 obj <</Type /Page>> 3 0 obj <</Type/Page>>");

  it("recognises a PDF and counts pages, not the page tree", () => {
    expect(isPdf(pdf)).toBe(true);
    expect(countPdfPages(pdf)).toBe(2);
  });

  it("rejects an HTML page", () => {
    expect(isPdf(Buffer.from("<!doctype html><html>"))).toBe(false);
  });
});
