import { fullOpenAlexId, shortOpenAlexId } from "@/lib/openalex";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import { SKILL_TREES } from "@/lib/skill-trees";
import type { SkillTree } from "@/lib/skill-trees";
import { treePaperIds, treeProgress } from "@/lib/skill-trees/progress";

/** OpenAlex ids ("W123") of the papers this user has marked finished, out of `paperIds`. */
async function finishedOpenAlexIds(userId: string | null, paperIds: string[]) {
  if (!userId) return new Set<string>();

  const rows = await prisma.readingHistory.findMany({
    where: {
      userId,
      readingStatus: "COMPLETED",
      paper: { externalId: { in: paperIds.map(fullOpenAlexId) } },
    },
    select: { paper: { select: { externalId: true } } },
  });

  return new Set(rows.map((row) => shortOpenAlexId(row.paper.externalId!)));
}

/** Every role, with the signed-in user's progress on the ones they follow. */
export async function getGoalsOverview() {
  const userId = await getCurrentUserId();
  const followed = userId
    ? await prisma.goal.findMany({ where: { userId }, select: { treeId: true } })
    : [];
  const followedIds = new Set(followed.map((goal) => goal.treeId));
  const finished = await finishedOpenAlexIds(userId, SKILL_TREES.flatMap(treePaperIds));

  return SKILL_TREES.map((tree) => {
    const progress = treeProgress(tree, finished);

    return {
      id: tree.id,
      title: tree.title,
      summary: tree.summary,
      following: followedIds.has(tree.id),
      done: progress.done,
      total: progress.total,
      branchTitles: tree.branches.map((branch) => branch.title),
    };
  });
}

/** One role's tree: each concept's state and the papers that teach it. */
export async function getGoalTree(tree: SkillTree) {
  const userId = await getCurrentUserId();
  const ids = treePaperIds(tree);

  const [papers, finished, goal] = await Promise.all([
    prisma.paper.findMany({
      where: { externalId: { in: ids.map(fullOpenAlexId) } },
      select: {
        id: true,
        externalId: true,
        title: true,
        publishedDate: true,
        difficulty: true,
        readingTime: true,
        paperAuthors: { orderBy: { authorOrder: "asc" }, take: 1, select: { author: { select: { name: true } } } },
      },
    }),
    finishedOpenAlexIds(userId, ids),
    userId ? prisma.goal.findUnique({ where: { userId_treeId: { userId, treeId: tree.id } }, select: { id: true } }) : null,
  ]);

  const byOpenAlexId = new Map(
    papers.map((paper) => [
      shortOpenAlexId(paper.externalId!),
      {
        id: paper.id,
        title: paper.title,
        year: paper.publishedDate.getFullYear(),
        author: paper.paperAuthors[0]?.author.name ?? null,
        difficulty: paper.difficulty,
        readingTime: paper.readingTime,
        finished: finished.has(shortOpenAlexId(paper.externalId!)),
      },
    ])
  );

  const progress = treeProgress(tree, finished);

  return {
    following: goal !== null,
    done: progress.done,
    total: progress.total,
    branches: progress.branches.map((branch) => ({
      title: branch.title,
      concepts: branch.concepts.map(({ concept, state, finished, after }) => ({
        id: concept.id,
        title: concept.title,
        why: concept.why,
        state,
        finished,
        after: after?.title ?? null,
        // A paper missing from the library is left out rather than breaking the tree.
        papers: concept.papers.flatMap((id) => byOpenAlexId.get(id) ?? []),
        paperCount: concept.papers.length,
      })),
    })),
  };
}

export type GoalTreeView = Awaited<ReturnType<typeof getGoalTree>>;
