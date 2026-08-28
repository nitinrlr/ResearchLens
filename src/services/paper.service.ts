import { prisma } from "@/lib/prisma";

export async function getAllPapers() {
    const papers = await prisma.paper.findMany({
        orderBy: {
            publishedDate: "desc",
        },

        include: {
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

    return papers.map((paper) => ({
        id: paper.id,

        title: paper.title,

        publishedDate: paper.publishedDate,

        readingTime: paper.readingTime,

        difficulty: paper.difficulty,

        authors: paper.paperAuthors.map(
            (pa) => pa.author.name
        ),

        topics: paper.paperTopics.map(
            (pt) => pt.topic.name
        ),
    }));
}