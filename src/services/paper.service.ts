import { prisma } from "@/lib/prisma";

export async function getAllPapers() {
    return prisma.paper.findMany({
        orderBy: {
            publishedDate: "desc",
        },
    });
}