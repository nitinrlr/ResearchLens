import { describe, expect, it } from "vitest";

import { filterParams, marqueeRows, topicPillParams } from "./explore-filters";

describe("filterParams", () => {
  it("leaves out empty filters", () => {
    expect(filterParams({ query: "", topic: "" })).toEqual({});
    expect(filterParams({ query: "gan", topic: "Topic Modeling" })).toEqual({ q: "gan", topic: "Topic Modeling" });
  });
});

describe("topicPillParams", () => {
  it("picks a topic and keeps the search", () => {
    expect(topicPillParams("gan", "", "Topic Modeling")).toEqual({ q: "gan", topic: "Topic Modeling" });
  });

  it("clears the topic when its pill is clicked again", () => {
    expect(topicPillParams("gan", "Topic Modeling", "Topic Modeling")).toEqual({ q: "gan" });
  });
});

describe("marqueeRows", () => {
  it("splits topics into two rows", () => {
    expect(marqueeRows(["a", "b", "c", "d", "e"], "")).toEqual([["a", "b", "c"], ["d", "e"]]);
  });

  it("adds a picked topic that isn't popular to the front", () => {
    expect(marqueeRows(["a", "b"], "z")).toEqual([["z", "a"], ["b"]]);
    expect(marqueeRows(["a", "b"], "b")).toEqual([["a"], ["b"]]);
  });
});
