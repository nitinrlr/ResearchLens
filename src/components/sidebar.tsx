import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-56 border-r border-zinc-800 bg-zinc-950 p-6">
      <h1 className="mb-10 text-2xl font-bold">
        ResearchLens
      </h1>

      <nav className="space-y-2">

        <Link
          href="/explore"
          className="block rounded-lg bg-zinc-800 px-4 py-3"
        >
          🔍 Discover
        </Link>

        <Link
          href="/saved"
          className="block rounded-lg px-4 py-3 hover:bg-zinc-900"
        >
          🔖 Saved
        </Link>

        <Link
          href="/collections"
          className="block rounded-lg px-4 py-3 hover:bg-zinc-900"
        >
          📁 Collections
        </Link>

        <Link
          href="/goals"
          className="block rounded-lg px-4 py-3 hover:bg-zinc-900"
        >
          🎯 Goals
        </Link>

      </nav>
    </aside>
  );
}