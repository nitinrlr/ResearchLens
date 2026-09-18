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
      ? "bg-zinc-800"
      : "hover:bg-zinc-900"
  }`;

  return (
    <aside className="flex w-60 flex-col border-r border-zinc-800 bg-zinc-950 p-6">
      <h1 className="mb-10 text-2xl font-bold">
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
