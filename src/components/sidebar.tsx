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

const NAV = [
  { href: "/explore", icon: "🔍", label: "Discover" },
  { href: "/reading", icon: "📖", label: "Continue Reading" },
  { href: "/collections", icon: "📁", label: "Collections" },
  { href: "/goals", icon: "🎯", label: "Goals" },
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const navClass = (href: string) =>
    `flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-3 text-white transition max-md:justify-center max-md:px-0 ${
      pathname === href ? "bg-white/20 font-medium" : "hover:bg-white/10"
    }`;

  return (
    <aside className="sticky top-0 flex h-svh w-60 shrink-0 flex-col self-start p-6 text-white max-md:w-16 max-md:px-2 max-md:py-4">
      <h1 className="mb-10 flex items-center gap-2.5 font-display text-xl font-bold tracking-tight max-md:justify-center">
        <span className="block size-5 shrink-0 rounded-md bg-accent" />
        <span className="max-md:sr-only">ResearchLens</span>
      </h1>

      <nav className="space-y-2">
        {NAV.map(({ href, icon, label }) => (
          <Link
            key={href}
            href={href}
            className={navClass(href)}
          >
            <span aria-hidden="true">{icon}</span>
            <span className="max-md:sr-only">{label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6">
        <UserMenu user={user} />
      </div>
    </aside>
  );
}
