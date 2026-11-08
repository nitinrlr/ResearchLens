import type { Metadata } from "next";
import { Button } from "@radix-ui/themes";

import EmptyState from "@/components/empty-state";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "Goals",
};

export default function GoalsPage() {
  return (
    <>
      <section className="glass-panel">
        <PageHeader
          title="Learning Goals"
          description="Track your research progress."
        />
      </section>

      <section className="glass-panel">
        <EmptyState
          title="No goals yet"
          description="Set your first learning goal."
        >
          <Button
            size="3"
            mt="6"
          >
            Create Goal
          </Button>
        </EmptyState>
      </section>
    </>
  );
}