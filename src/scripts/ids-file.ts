import { readFileSync } from "node:fs";

/**
 * OpenAlex ids from a file, one per line, like "W2963403868  Attention Is All You Need".
 * Anything after the id, blank lines and # comments are ignored.
 */
export function readIdsFile(file: string) {
  return readFileSync(file, "utf8")
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*(W\d+)/)?.[1])
    .filter((id): id is string => Boolean(id));
}
