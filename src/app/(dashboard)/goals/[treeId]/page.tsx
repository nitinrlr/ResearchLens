import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Heading, Text } from "@radix-ui/themes";

import FollowTreeButton from "@/components/follow-tree-button";
import SkillTreeView from "@/components/skill-tree-view";
import { getSkillTree } from "@/lib/skill-trees";
import { getGoalTree } from "@/services/goal.service";

type Props = {
  params: Promise<{ treeId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tree = getSkillTree((await params).treeId);
  return { title: tree?.title ?? "Goal not found" };
}

export default async function GoalTreePage({ params }: Props) {
  const tree = getSkillTree((await params).treeId);

  if (!tree) {
    notFound();
  }

  const view = await getGoalTree(tree);

  return (
    <>
      <section className="glass-panel">
        <Link href="/goals" className="inline-flex items-center gap-1.5 text-sm text-mist transition hover:text-white">
          <ArrowLeft size={14} />
          All roles
        </Link>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <Heading as="h1" size="8">
              {tree.title}
            </Heading>
            <Text as="p" color="gray" mt="2">
              {tree.summary}
            </Text>
          </div>
          <FollowTreeButton treeId={tree.id} following={view.following} />
        </div>
      </section>

      <SkillTreeView title={tree.title} view={view} />
    </>
  );
}
