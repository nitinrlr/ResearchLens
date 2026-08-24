import { prisma } from "@/lib/prisma";
import { SearchPaper } from "@/types/paper";

export async function importPapers(
  papers: SearchPaper[]
) {
  for (const paper of papers) {
    const dbPaper = await prisma.paper.upsert({
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

    for (const [index, author] of paper.authors.entries()) {
      const dbAuthor = await prisma.author.upsert({
        where: {
          openAlexId: author.openAlexId,
        },

        update: {},

        create: {
          openAlexId: author.openAlexId,
          name: author.name,
          institution: author.institution,
        },
      });

      await prisma.paperAuthor.upsert({
        where: {
          paperId_authorId: {
            paperId: dbPaper.id,
            authorId: dbAuthor.id,
          },
        },

        update: {},

        create: {
          paperId: dbPaper.id,
          authorId: dbAuthor.id,
          authorOrder: index + 1,
        },
      });
    }

    for (const topic of paper.topics) {
      const dbTopic = await prisma.topic.upsert({
        where: {
          name: topic.name,
        },

        update: {},

        create: {
          name: topic.name,
          description: "",
        },
      });

      await prisma.paperTopic.upsert({
        where: {
          paperId_topicId: {
            paperId: dbPaper.id,
            topicId: dbTopic.id,
          },
        },

        update: {},

        create: {
          paperId: dbPaper.id,
          topicId: dbTopic.id,
        },
      });
    }

    console.log(`Imported: ${paper.title}`);
  }

  console.log(`Imported ${papers.length} papers.`);
}