"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronsUpDown, LogOut, Settings, User } from "lucide-react";
import { signOutAction } from "@/actions/auth";

type UserMenuProps = {
  user: {
    name: string;
    email: string;
  };
};

export default function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close the menu when the user clicks anywhere outside it or presses Escape.
  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const initial = user.name.trim().charAt(0).toUpperCase() || "?";

  const itemClass =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white";

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      {open && (
        <div
          role="menu"
          className="absolute bottom-full left-0 z-50 mb-2 w-60 rounded-xl border border-zinc-800 bg-zinc-900 p-1.5 shadow-xl shadow-black/50"
        >
          <div className="border-b border-zinc-800 px-3 py-2.5">
            <p className="truncate text-sm font-medium text-white">
              {user.name}
            </p>
            <p className="truncate text-xs text-zinc-500">
              {user.email}
            </p>
          </div>

          <div className="mt-1.5 space-y-0.5">
            <Link
              href="/profile"
              role="menuitem"
              onClick={() => setOpen(false)}
              className={itemClass}
            >
              <User size={16} />
              Profile
            </Link>

            <Link
              href="/settings"
              role="menuitem"
              onClick={() => setOpen(false)}
              className={itemClass}
            >
              <Settings size={16} />
              Settings
            </Link>
          </div>

          <div className="my-1.5 border-t border-zinc-800" />

          <form action={signOutAction}>
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-red-950/50 hover:text-red-400"
            >
              <LogOut size={16} />
              Log out
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-zinc-900 ${
          open ? "bg-zinc-900" : ""
        }`}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
          {initial}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-white">
            {user.name}
          </span>
        </span>

        <ChevronsUpDown
          size={16}
          className="shrink-0 text-zinc-500"
        />
      </button>
    </div>
  );
}
