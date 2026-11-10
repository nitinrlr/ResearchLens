import { describe, expect, it } from "vitest";

import { buildSystemInstruction, buildUserText, parseChatRequest } from "./chat-request";

describe("parseChatRequest", () => {
  it("accepts a typed question", () => {
    expect(parseChatRequest({ message: " What dataset? " })).toMatchObject({
      message: "What dataset?",
      quote: null,
      starter: null,
      previousId: null,
      paperAttached: false,
    });
  });

  it("accepts a starter or a quote with no typed text", () => {
    expect(parseChatRequest({ starter: "simple" })?.starter).toBe("simple");
    expect(parseChatRequest({ quote: "residual learning" })?.quote).toBe("residual learning");
  });

  it.each([
    ["nothing to send", { message: "  " }],
    ["an unknown starter", { starter: "hack" }],
    ["a message that's too long", { message: "x".repeat(2001) }],
    ["a non-string message", { message: 42 }],
    ["no body", null],
  ])("rejects %s", (_label, body) => {
    expect(parseChatRequest(body)).toBeNull();
  });
});

describe("buildUserText", () => {
  const base = { message: "", quote: null, starter: null, previousId: null, paperAttached: false, paperUnavailable: false };

  it("puts a highlighted passage in front of the question", () => {
    const text = buildUserText({ ...base, quote: "We reformulate the layers", message: "Why?" });

    expect(text).toContain('"""\nWe reformulate the layers\n"""');
    expect(text.endsWith("Why?")).toBe(true);
  });

  it("asks for an explanation when a passage comes with no question", () => {
    expect(buildUserText({ ...base, quote: "A passage" })).toContain("Explain this passage simply.");
  });

  it("uses the starter's full prompt", () => {
    expect(buildUserText({ ...base, starter: "mainIdea" })).toContain("main idea");
  });
});

describe("buildSystemInstruction", () => {
  const paper = { title: "ResNet", authors: ["Kaiming He"], abstract: "Deeper networks." };

  it("tells the model when it only has the abstract", () => {
    expect(buildSystemInstruction({ ...paper, hasFullPaper: false })).toContain("Only the title and abstract");
    expect(buildSystemInstruction({ ...paper, hasFullPaper: true })).toContain("full paper has been provided");
  });

  it("keeps claims about the paper to the paper, but allows explaining general concepts", () => {
    const system = buildSystemInstruction({ ...paper, hasFullPaper: true });

    expect(system).toContain("use only the paper");
    expect(system).toContain("general computer science knowledge");
  });
});
