import { describe, expect, it } from "vitest";

import { readingTimeFor } from "./reading-time";

describe("readingTimeFor", () => {
  it("uses the minutes per page for the paper's difficulty", () => {
    expect(readingTimeFor(10, 1)).toBe(15);
    expect(readingTimeFor(10, 3)).toBe(33);
    expect(readingTimeFor(12, 5)).toBe(61);
  });

  it("rounds to whole minutes, never below one", () => {
    expect(readingTimeFor(7, 4)).toBe(29); // 28.7
    expect(readingTimeFor(1, 1)).toBe(2); // 1.5
  });

  it("is unknown until both numbers are known", () => {
    expect(readingTimeFor(null, 3)).toBeNull();
    expect(readingTimeFor(10, null)).toBeNull();
    expect(readingTimeFor(0, 3)).toBeNull();
    expect(readingTimeFor(10, 6)).toBeNull();
  });
});
