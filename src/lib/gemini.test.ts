import { describe, expect, it } from "vitest";

import { parseSse } from "./gemini";

describe("parseSse", () => {
  it("returns the data of each complete event and keeps a partial one", () => {
    const buffer =
      'event: step.delta\ndata: {"delta":{"text":"Hi","type":"text"}}\n\n' +
      'event: step.delta\ndata: {"delta":{"te';

    const { events, rest } = parseSse(buffer);

    expect(events).toEqual(['{"delta":{"text":"Hi","type":"text"}}']);
    expect(rest).toBe('event: step.delta\ndata: {"delta":{"te');
  });

  it("handles Windows line endings and skips the closing [DONE]", () => {
    const { events } = parseSse('data: {"a":1}\r\n\r\nevent: done\r\ndata: [DONE]\r\n\r\n');

    expect(events).toEqual(['{"a":1}']);
  });
});
