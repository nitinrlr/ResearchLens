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
        <button
          className="mt-6 rounded-lg bg-accent text-white px-6 py-3 font-medium transition hover:bg-accent-strong"
        >
          Create Goal
        </button>
      </div>
    </main>
  );
}