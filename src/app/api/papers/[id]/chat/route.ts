import { NextResponse } from "next/server";

import { buildSystemInstruction, buildUserText, parseChatRequest } from "@/lib/chat-request";
import { ModelsBusyError, streamChat } from "@/lib/gemini";
import type { InputPart } from "@/lib/gemini";
import { fetchPaperPdf } from "@/lib/paper-pdf";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import {
  DAILY_MESSAGE_LIMIT,
  getSavedAnswer,
  refundChatMessage,
  saveAnswer,
  spendChatMessage,
} from "@/services/chat.service";

// Downloading a paper and waiting on a busy model can take a while.
export const maxDuration = 120;

type StreamLine =
  | { type: "start"; source: "pdf" | "abstract"; paperUnavailable: boolean }
  | { type: "text"; text: string }
  | { type: "done"; interactionId: string | null }
  | { type: "error"; message: string };

/** One JSON object per line, so the browser can show the answer as it arrives. */
function lineStream(produce: (send: (line: StreamLine) => void) => Promise<void>) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      await produce((line) => controller.enqueue(encoder.encode(`${JSON.stringify(line)}\n`)));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
  });
}

/**
 * One turn of the paper chat. The full paper is sent once per conversation;
 * later turns point to the earlier one, and highlighted passages use only the
 * abstract, which keeps the free tier's token limits in reach.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Sign in to use the chat." }, { status: 401 });
  }

  const chat = parseChatRequest(await request.json().catch(() => null));

  if (!chat) {
    return NextResponse.json({ error: "That message couldn't be sent." }, { status: 400 });
  }

  const { id } = await params;
  const paper = await prisma.paper.findUnique({
    where: { id },
    select: {
      title: true,
      abstract: true,
      pdfUrl: true,
      paperAuthors: { orderBy: { authorOrder: "asc" }, take: 20, select: { author: { select: { name: true } } } },
    },
  });

  if (!paper) {
    return NextResponse.json({ error: "Paper not found." }, { status: 404 });
  }

  const isNewStarter = chat.starter !== null && chat.previousId === null;

  if (isNewStarter) {
    const saved = await getSavedAnswer(id, chat.starter!);

    if (saved) {
      return lineStream(async (send) => {
        send({ type: "start", source: saved.source === "pdf" ? "pdf" : "abstract", paperUnavailable: false });
        send({ type: "text", text: saved.answer });
        send({ type: "done", interactionId: null });
      });
    }
  }

  if (!(await spendChatMessage(userId))) {
    return NextResponse.json(
      { error: `You've reached today's limit of ${DAILY_MESSAGE_LIMIT} messages. It resets tomorrow.` },
      { status: 429 }
    );
  }

  // A highlighted passage is answered from the abstract; anything else gets
  // the full paper, once, unless it already failed to download.
  const tryPaper = !chat.quote && !chat.paperAttached && !chat.paperUnavailable;
  const pdf = tryPaper ? await fetchPaperPdf(paper.pdfUrl) : null;
  const hasFullPaper = chat.paperAttached || pdf !== null;

  const parts: InputPart[] = [];
  if (pdf) parts.push({ type: "document", data: pdf.toString("base64"), mime_type: "application/pdf" });
  parts.push({ type: "text", text: buildUserText(chat) });

  const system = buildSystemInstruction({
    title: paper.title,
    abstract: paper.abstract,
    authors: paper.paperAuthors.map((link) => link.author.name),
    hasFullPaper,
  });

  return lineStream(async (send) => {
    const source = hasFullPaper ? "pdf" : "abstract";
    send({ type: "start", source, paperUnavailable: tryPaper && pdf === null });

    let answer = "";

    try {
      for await (const event of streamChat({ system, parts, previousId: chat.previousId })) {
        if (event.type === "text") {
          answer += event.text;
          send(event);
        } else {
          if (isNewStarter && answer) await saveAnswer(id, chat.starter!, answer, source);
          send(event);
        }
      }
    } catch (error) {
      console.error("Paper chat failed:", error);
      if (!answer) await refundChatMessage(userId);
      send({
        type: "error",
        message:
          error instanceof ModelsBusyError
            ? "The AI is busy right now. Please try again in a minute."
            : "Something went wrong with the AI. Please try again.",
      });
    }
  });
}
