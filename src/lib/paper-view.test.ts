import { describe, expect, it } from "vitest";

import { parsePaperView } from "./paper-view";

describe("parsePaperView", () => {
  it("keeps the saved list layout", () => {
    expect(parsePaperView("list")).toBe("list");
  });

  it("falls back to boxes for a missing or unknown value", () => {
    expect(parsePaperView("grid")).toBe("grid");
    expect(parsePaperView(undefined)).toBe("grid");
    expect(parsePaperView("nonsense")).toBe("grid");
  });
});
