import { describe, expect, it } from "vitest";

import { choosePdfUrl, pageCountFromBiblio, worksFilter } from "./openalex";

describe("pageCountFromBiblio", () => {
  it("counts the pages in a range", () => {
    expect(pageCountFromBiblio({ first_page: "1", last_page: "12" })).toBe(12);
  });

  it("distrusts 1-2 page ranges, which are usually an article number", () => {
    expect(pageCountFromBiblio({ first_page: "1", last_page: "1" })).toBeNull();
    expect(pageCountFromBiblio({ first_page: "100", last_page: "101" })).toBeNull();
  });

  it("ignores missing, non-numeric or huge ranges", () => {
    expect(pageCountFromBiblio(null)).toBeNull();
    expect(pageCountFromBiblio({ first_page: "e1003", last_page: "e1010" })).toBeNull();
    expect(pageCountFromBiblio({ first_page: "1", last_page: "900" })).toBeNull();
  });
});

describe("worksFilter", () => {
  it("defaults to open-access English Computer Science papers", () => {
    expect(worksFilter()).toBe(
      "primary_topic.field.id:17,has_abstract:true,is_oa:true,is_retracted:false,language:en"
    );
  });

  it("narrows to subfields and a work type", () => {
    expect(worksFilter({ subfields: [1703, 1709], type: "review" })).toBe(
      "primary_topic.subfield.id:1703|1709,has_abstract:true,is_oa:true,is_retracted:false,language:en,type:review"
    );
  });

  it("asks for exact works by id, ignoring the other filters", () => {
    expect(worksFilter({ ids: ["https://openalex.org/W1", "W2"], type: "review" })).toBe("openalex:W1|W2");
  });
});

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
