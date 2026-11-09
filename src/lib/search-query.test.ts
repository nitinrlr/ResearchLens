import { describe, expect, it } from "vitest";

import { toSearchQuery } from "./search-query";

describe("toSearchQuery", () => {
  it("requires every word and allows partial words", () => {
    expect(toSearchQuery("Deep Learn")).toBe("deep:* & learn:*");
  });

  it("removes characters that have a special meaning in a search query", () => {
    expect(toSearchQuery("self-supervised & (vision)!")).toBe(
      "self:* & supervised:* & vision:*"
    );
  });

  it("keeps numbers and non-English letters", () => {
    expect(toSearchQuery("Résumé 16x16")).toBe("résumé:* & 16x16:*");
  });

  it("returns null when there is nothing to search for", () => {
    expect(toSearchQuery("  !!! ")).toBeNull();
  });
});
