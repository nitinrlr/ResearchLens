import { NextResponse } from "next/server";

import { downloadPaperPdf } from "@/lib/paper-pdf";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";

export const maxDuration = 60;

/**
 * Serves a paper's PDF from our own site, so the viewer can draw publisher
 * PDFs that browsers aren't allowed to fetch directly.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getCurrentUserId())) {
    return NextResponse.json({ error: "Sign in to read papers." }, { status: 401 });
  }

  const { id } = await params;
  const paper = await prisma.paper.findUnique({ where: { id }, select: { pdfUrl: true } });
  const pdf = await downloadPaperPdf(paper?.pdfUrl ?? null);

  if (!pdf) {
    return NextResponse.json({ error: "This PDF couldn't be downloaded." }, { status: 404 });
  }

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(pdf.length),
      "Cache-Control": "private, max-age=86400",
    },
  });
}
