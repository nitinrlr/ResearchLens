import { describe, expect, it } from "vitest";

import { isLikelyBot, readContactForm } from "./contact-form";

function form(fields: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) formData.set(key, value);
  return formData;
}

describe("readContactForm", () => {
  it("trims the fields and lowercases the email", () => {
    expect(readContactForm(form({ name: " Ada ", email: " Ada@Example.com ", message: " Hi " }))).toEqual({
      name: "Ada",
      email: "ada@example.com",
      message: "Hi",
    });
  });

  it("treats an empty message as none", () => {
    expect(readContactForm(form({ name: "Ada", email: "ada@example.com" }))).toMatchObject({ message: null });
  });

  it("rejects a missing name, a bad email or a very long message", () => {
    expect(readContactForm(form({ name: "", email: "ada@example.com" }))).toHaveProperty("error");
    expect(readContactForm(form({ name: "Ada", email: "not-an-email" }))).toHaveProperty("error");
    expect(readContactForm(form({ name: "Ada", email: "ada@example.com", message: "x".repeat(2001) }))).toHaveProperty(
      "error"
    );
  });
});

describe("isLikelyBot", () => {
  it("flags a filled-in hidden field", () => {
    expect(isLikelyBot(form({ website: "http://spam.example" }))).toBe(true);
    expect(isLikelyBot(form({ website: "" }))).toBe(false);
  });
});
