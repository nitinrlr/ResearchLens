import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

function mapPaper(paper: any) {
  return {
    id: paper.id,
    title: paper.title,
    publishedDate: paper.publishedDate,
    readingTime: paper.readingTime,
    difficulty: paper.difficulty,
    saved: paper.savedPapers.length > 0,
    authors: paper.paperAuthors.map(
      (pa: any) => pa.author.name
    ),

    topics: paper.paperTopics.map(
      (pt: any) => pt.topic.name
    ),
  };
}

export async function getAllPapers() {
    const papers = await prisma.paper.findMany({
        orderBy: {
            publishedDate: "desc",
        },

        include: {
            savedPapers: true,

            paperAuthors: {
            include: {
                author: true,
            },
            },

            paperTopics: {
            include: {
                topic: true,
            },
            },
        },
    });

    return papers.map(mapPaper);
}

export async function getSavedPapers() {
  const session = await auth();

  if (!session?.user?.email) {
    return [];
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return [];
  }

  const papers = await prisma.paper.findMany({
    where: {
      savedPapers: {
        some: {
          userId: user.id,
        },
      },
    },

    orderBy: {
      publishedDate: "desc",
    },

    include: {
        savedPapers: true,

        paperAuthors: {
        include: {
            author: true,
        },
      },

        paperTopics: {
        include: {
            topic: true,
        },
      },
    },
  });

  return papers.map(mapPaper);
}