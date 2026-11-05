import { describe, expect, it } from "vitest";

import { getPageItems, pageHref, parsePage } from "@/lib/pagination";

describe("parsePage", () => {
  it("reads a normal page number", () => {
    expect(parsePage("3")).toBe(3);
  });

  it.each([undefined, "", "abc", "0", "-2", "2.5"])(
    "falls back to page 1 for %j",
    (value) => {
      expect(parsePage(value)).toBe(1);
    }
  );
});

describe("pageHref", () => {
  it("leaves the page param off page 1", () => {
    expect(pageHref("/explore", 1)).toBe("/explore");
  });

  it("adds the page param after page 1", () => {
    expect(pageHref("/explore", 4)).toBe("/explore?page=4");
  });

  it("keeps the search query and adds the hash", () => {
    expect(pageHref("/explore", 2, { q: "graph neural" }, "results")).toBe(
      "/explore?q=graph+neural&page=2#results"
    );
  });
});

describe("getPageItems", () => {
  it("lists every page when there are 7 or fewer", () => {
    expect(getPageItems(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("shows the first five pages near the start", () => {
    expect(getPageItems(2, 17)).toEqual([1, 2, 3, 4, 5, "gap", 17]);
  });

  it("shows the current page and its neighbors in the middle", () => {
    expect(getPageItems(9, 17)).toEqual([1, "gap", 8, 9, 10, "gap", 17]);
  });

  it("shows the last five pages near the end", () => {
    expect(getPageItems(16, 17)).toEqual([1, "gap", 13, 14, 15, 16, 17]);
  });

  it("stays the same width while clicking through", () => {
    const widths = Array.from(
      { length: 17 },
      (_, index) => getPageItems(index + 1, 17).length
    );

    expect(new Set(widths)).toEqual(new Set([7]));
  });
});
