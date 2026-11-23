import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge, Card, Heading, Text } from "@radix-ui/themes";

import PageHeader from "@/components/page-header";
import ProgressBar from "@/components/progress-bar";
import { getGoalsOverview } from "@/services/goal.service";

export const metadata: Metadata = {
  title: "Goals",
};

export default async function GoalsPage() {
  const roles = await getGoalsOverview();
  // Roles the user follows come first.
  const sorted = [...roles].sort((a, b) => Number(b.following) - Number(a.following));

  return (
    <>
      <section className="glass-panel">
        <PageHeader
          title="Goals"
          description="Pick a role you want to grow into, then work through the papers that teach it, one concept at a time."
        />
      </section>

      <section className="glass-panel">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sorted.map((role) => (
            <Card
              key={role.id}
              asChild
              size="3"
              className="solid-glass relative flex flex-col transition-shadow duration-200 hover:shadow-lg hover:[--card-background-color:rgb(18_30_72/0.86)] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-(--focus-8)"
            >
              <article>
                <div className="flex items-start justify-between gap-3">
                  <Heading as="h2" size="5">
                    {/* Stretched over the card, so the whole card opens the tree. */}
                    <Link href={`/goals/${role.id}`} className="outline-none after:absolute after:inset-0">
                      {role.title}
                    </Link>
                  </Heading>
                  {role.following && (
                    <Badge color="green" radius="full">
                      Following
                    </Badge>
                  )}
                </div>

                <Text as="p" size="2" color="gray" mt="2">
                  {role.summary}
                </Text>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {role.branchTitles.map((title) => (
                    <Badge key={title} size="1" radius="full" color="gray">
                      {title}
                    </Badge>
                  ))}
                </div>

                <div className="mt-auto pt-5">
                  {role.following || role.done > 0 ? (
                    <ProgressBar done={role.done} total={role.total} />
                  ) : (
                    <Text size="2" className="flex items-center gap-1.5 text-accent-ink">
                      {role.total} concepts
                      <ArrowRight size={14} />
                    </Text>
                  )}
                </div>
              </article>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
