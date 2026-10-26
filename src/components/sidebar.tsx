"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import UserMenu from "@/components/user-menu";

type SidebarProps = {
  user: {
    name: string;
    email: string;
  };
};

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const navClass = (href: string) =>
  `block rounded-lg px-4 py-3 transition ${
    pathname === href
      ? "bg-accent-soft font-medium text-accent-strong"
      : "text-ink-muted hover:bg-subtle hover:text-ink"
  }`;

  return (
    <aside className="flex w-60 flex-col border-r border-line bg-surface p-6">
      <h1 className="mb-10 flex items-center gap-2.5 font-display text-xl font-bold tracking-tight">
        <span className="block size-5 shrink-0 rounded-md bg-accent" />
        ResearchLens
      </h1>
      <nav className="space-y-2">
        <Link
          href="/explore"
          className={navClass("/explore")}
        >
          🔍 Discover
        </Link>

        <Link
          href="/reading"
          className={navClass("/reading")}
        >
          📖 Continue Reading
        </Link>

        <Link
          href="/collections"
          className={navClass("/collections")}
        >
          📁 Collections
        </Link>

        <Link
          href="/goals"
          className={navClass("/goals")}
        >
          🎯 Goals
        </Link>
      </nav>

      <div className="mt-auto pt-6">
        <UserMenu user={user} />
      </div>
    </aside>
  );
}
