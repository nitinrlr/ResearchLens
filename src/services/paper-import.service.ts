import { prisma } from "@/lib/prisma";
import { SearchPaper } from "@/types/paper";

export async function importPapers(
  papers: SearchPaper[]
) {
  for (const paper of papers) {
    await prisma.paper.upsert({
      where: {
        externalId: paper.externalId,
      },

      update: {},

      create: {
        title: paper.title,
        abstract: paper.abstract ?? "",

        publishedDate: paper.publishedDate,

        difficulty: 1,

        readingTime: 30,

        paperUrl: paper.paperUrl,

        pdfUrl: paper.pdfUrl,

        thumbnailUrl: null,

        externalId: paper.externalId,
      },
    });

    console.log(`Imported: ${paper.title}`);
  }

  console.log(`Imported ${papers.length} papers.`);
}