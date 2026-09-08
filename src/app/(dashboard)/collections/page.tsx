export default function CollectionsPage() {
  return (
    <main className="p-10 text-white">
      <h1 className="text-4xl font-bold">
        Collections
      </h1>
      <p className="mt-2 text-zinc-400">
        Organize papers into custom collections.
      </p>
      <div className="mt-12 rounded-xl border border-dashed border-zinc-700 p-12 text-center">
        <h2 className="text-xl font-semibold">
          No collections yet
        </h2>
        <p className="mt-2 text-zinc-500">
          Create your first collection to organize your research.
        </p>
        <button
          className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-500"
        >
          Create Collection
        </button>
      </div>
    </main>
  );
}