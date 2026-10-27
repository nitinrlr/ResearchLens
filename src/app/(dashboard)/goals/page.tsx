import { Button } from "@radix-ui/themes";

export default function GoalsPage() {
  return (
    <main className="p-10 text-ink">
      <h1 className="text-4xl font-bold">
        Learning Goals
      </h1>
      <p className="mt-2 text-ink-muted">
        Track your research progress.
      </p>
      <div className="mt-12 rounded-xl border border-dashed border-line-strong p-12 text-center">
        <h2 className="text-xl font-semibold">
          No goals yet
        </h2>
        <p className="mt-2 text-ink-faint">
          Set your first learning goal.
        </p>
        <Button
          size="3"
          mt="6"
        >
          Create Goal
        </Button>
      </div>
    </main>
  );
}