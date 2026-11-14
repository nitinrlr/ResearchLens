const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions?alt=sse";
const API_REVISION = "2026-05-20";

// Tried in order. The free models are often overloaded ("high demand"), and
// can accept a request and then go silent, so each one gets a time limit.
const MODELS = ["gemini-3.8-flash", "gemini-3.6-flash", "gemini-3.5-flash-lite"];
const FIRST_TEXT_TIMEOUT_MS = 20_000;
const IDLE_TIMEOUT_MS = 30_000;

// A model that just failed is skipped for a while, so only the first reader
// during an outage waits for it to time out.
const BUSY_COOLDOWN_MS = 5 * 60_000;
const busyUntil = new Map<string, number>();

function markBusy(model: string) {
  busyUntil.set(model, Date.now() + BUSY_COOLDOWN_MS);
}

/** Models not cooling down, or all of them if every one is. */
function modelsToTry() {
  const ready = MODELS.filter((model) => (busyUntil.get(model) ?? 0) <= Date.now());
  return ready.length > 0 ? ready : MODELS;
}

export type InputPart =
  | { type: "text"; text: string }
  | { type: "document"; data: string; mime_type: "application/pdf" };

export type ChatEvent =
  | { type: "text"; text: string }
  | { type: "done"; interactionId: string | null };

/** Every model was busy or timed out before answering. */
export class ModelsBusyError extends Error {}

/** A request problem another model wouldn't fix, such as a bad key. */
class RequestError extends Error {}

/** Splits server-sent events into complete events, returning any partial remainder. */
export function parseSse(buffer: string) {
  const blocks = buffer.replaceAll("\r\n", "\n").split("\n\n");
  const rest = blocks.pop() ?? "";

  const events = blocks
    .map((block) => block.split("\n").filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trim()).join("\n"))
    .filter((data) => data && data !== "[DONE]");

  return { events, rest };
}

async function* readEvents(body: ReadableStream<Uint8Array>) {
  const decoder = new TextDecoder();
  let buffer = "";

  const reader = body.getReader();

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const { events, rest } = parseSse(buffer);
    buffer = rest;

    for (const data of events) {
      yield JSON.parse(data);
    }
  }
}

function isRetryable(status: number) {
  return status === 429 || status >= 500;
}

/**
 * Streams one chat turn from Gemini, moving to the next model when one is
 * busy or silent. Once any text has been sent, a failure is final, so a reader
 * never sees half an answer from one model followed by another.
 */
export async function* streamChat(request: {
  system: string;
  parts: InputPart[];
  previousId: string | null;
}): AsyncGenerator<ChatEvent> {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  for (const model of modelsToTry()) {
    const controller = new AbortController();
    let timer = setTimeout(() => controller.abort(), FIRST_TEXT_TIMEOUT_MS);
    let sentText = false;
    let interactionId: string | null = null;

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "x-goog-api-key": key,
          "Content-Type": "application/json",
          "Api-Revision": API_REVISION,
        },
        body: JSON.stringify({
          model,
          stream: true,
          system_instruction: request.system,
          generation_config: { thinking_level: "low", max_output_tokens: 4096 },
          input: [{ type: "user_input", content: request.parts }],
          ...(request.previousId ? { previous_interaction_id: request.previousId } : {}),
        }),
      });

      if (!response.ok || !response.body) {
        if (isRetryable(response.status)) {
          markBusy(model);
          continue;
        }
        throw new RequestError(`Gemini returned ${response.status}: ${(await response.text()).slice(0, 300)}`);
      }

      for await (const event of readEvents(response.body)) {
        if (event.error) {
          throw new Error(event.error.message ?? "Gemini stream error");
        }

        interactionId = event.interaction?.id ?? interactionId;

        if (event.event_type === "step.delta" && event.delta?.type === "text" && event.delta.text) {
          sentText = true;
          clearTimeout(timer);
          timer = setTimeout(() => controller.abort(), IDLE_TIMEOUT_MS);
          yield { type: "text", text: event.delta.text };
        }
      }
    } catch (error) {
      // Before any text: a timeout, dropped connection or overload, so try the next model.
      if (sentText || error instanceof RequestError) throw error;
      markBusy(model);
      continue;
    } finally {
      clearTimeout(timer);
    }

    if (!sentText) {
      markBusy(model);
      continue;
    }

    yield { type: "done", interactionId };
    return;
  }

  throw new ModelsBusyError("Every model was busy");
}

/** The daily free-tier quota for this model is used up. */
export class DailyQuotaError extends Error {}

/** Too many requests this minute; waiting a little fixes it. */
export class RateLimitError extends Error {}

const GENERATE_TIMEOUT_MS = 90_000;

/**
 * One prompt to one model, returning the whole reply. For scripts: no model
 * fallback, and quota errors are thrown as their own types so a long job can
 * pause or stop instead of failing.
 */
export async function generateText(request: { model: string; system: string; text: string }) {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    signal: AbortSignal.timeout(GENERATE_TIMEOUT_MS),
    headers: {
      "x-goog-api-key": key,
      "Content-Type": "application/json",
      "Api-Revision": API_REVISION,
    },
    body: JSON.stringify({
      model: request.model,
      stream: true,
      system_instruction: request.system,
      generation_config: { thinking_level: "low", max_output_tokens: 8192 },
      input: [{ type: "user_input", content: [{ type: "text", text: request.text }] }],
    }),
  });

  if (response.status === 429) {
    const body = await response.text();
    throw /per\s*day|daily/i.test(body)
      ? new DailyQuotaError(body.slice(0, 300))
      : new RateLimitError(body.slice(0, 300));
  }

  if (!response.ok || !response.body) {
    const body = (await response.text()).slice(0, 300);
    throw response.status >= 500 ? new ModelsBusyError(body) : new RequestError(`Gemini returned ${response.status}: ${body}`);
  }

  let text = "";

  for await (const event of readEvents(response.body)) {
    if (event.error) {
      throw new Error(event.error.message ?? "Gemini stream error");
    }

    if (event.event_type === "step.delta" && event.delta?.type === "text" && event.delta.text) {
      text += event.delta.text;
    }
  }

  return text;
}
