import { NextResponse } from "next/server";
import { getAllPapers } from "@/services/paper.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";

  const papers = await getAllPapers(query);

  return NextResponse.json(papers);
}
