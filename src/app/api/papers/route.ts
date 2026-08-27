import { NextResponse } from "next/server";
import { getAllPapers } from "@/services/paper.service";

export async function GET() {
  const papers = await getAllPapers();

  return NextResponse.json(papers);
}