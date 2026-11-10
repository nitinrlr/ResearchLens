import { describe, expect, it } from "vitest";

import { choosePdfUrl } from "./openalex";

const publisher = {
  best_oa_location: { landing_page_url: null, pdf_url: "https://dl.acm.org/doi/pdf/10.1145/1" },
  primary_location: null,
  open_access: null,
};

describe("choosePdfUrl", () => {
  it("prefers an arXiv copy over the publisher's", () => {
    const work = {
      ...publisher,
      locations: [{ pdf_url: "https://dl.acm.org/doi/pdf/10.1145/1" }, { pdf_url: "http://arxiv.org/pdf/1706.03762" }],
    };

    expect(choosePdfUrl(work)).toBe("https://arxiv.org/pdf/1706.03762");
  });

  it("keeps a reliable publisher's final version over an arXiv preprint", () => {
    const work = {
      best_oa_location: { landing_page_url: null, pdf_url: "https://aclanthology.org/D15-1044.pdf" },
      primary_location: null,
      open_access: null,
      locations: [{ pdf_url: "https://arxiv.org/pdf/1509.00685" }],
    };

    expect(choosePdfUrl(work)).toBe("https://aclanthology.org/D15-1044.pdf");
  });

  it("keeps the best open-access copy when there's no arXiv one", () => {
    expect(choosePdfUrl({ ...publisher, locations: [{ pdf_url: null }] })).toBe(
      "https://dl.acm.org/doi/pdf/10.1145/1"
    );
  });

  it("ignores an arXiv abstract page, which isn't a PDF", () => {
    const work = { ...publisher, locations: [{ pdf_url: "https://arxiv.org/abs/1706.03762" }] };

    expect(choosePdfUrl(work)).toBe("https://dl.acm.org/doi/pdf/10.1145/1");
  });

  it("returns null when no copy has a PDF", () => {
    expect(choosePdfUrl({ best_oa_location: null, primary_location: null, open_access: null })).toBeNull();
  });
});
