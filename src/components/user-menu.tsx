"use client";

import Link from "next/link";
import { useTransition } from "react";
import { ChevronsUpDown, LogOut, Settings, User } from "lucide-react";
import { Avatar, Box, DropdownMenu, Text } from "@radix-ui/themes";

import { signOutAction } from "@/actions/auth";

type UserMenuProps = {
  user: {
    name: string;
    email: string;
  };
};

/*
  Radix's DropdownMenu handles opening, closing on an outside click or Escape,
  arrow-key navigation between items, and returning focus to the trigger.
*/
export default function UserMenu({ user }: UserMenuProps) {
  const [signingOut, startSignOut] = useTransition();

  const initial = user.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-subtle data-[state=open]:bg-subtle"
        >
          <Avatar
            fallback={initial}
            size="2"
            radius="full"
            variant="solid"
          />

          <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
            {user.name}
          </span>

          <ChevronsUpDown
            size={16}
            className="shrink-0 text-ink-faint"
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        side="top"
        align="start"
        className="min-w-56"
      >
        <Box
          px="2"
          py="1"
        >
          <Text
            as="p"
            size="2"
            weight="medium"
            truncate
          >
            {user.name}
          </Text>
          <Text
            as="p"
            size="1"
            color="gray"
            truncate
          >
            {user.email}
          </Text>
        </Box>

        <DropdownMenu.Separator />

        <DropdownMenu.Item asChild>
          <Link
            href="/profile"
            className="gap-2"
          >
            <User size={16} />
            Profile
          </Link>
        </DropdownMenu.Item>

        <DropdownMenu.Item asChild>
          <Link
            href="/settings"
            className="gap-2"
          >
            <Settings size={16} />
            Settings
          </Link>
        </DropdownMenu.Item>

        <DropdownMenu.Separator />

        <DropdownMenu.Item
          color="red"
          disabled={signingOut}
          className="gap-2"
          onSelect={(event) => {
            // Keep the menu open showing "Logging out…" until the redirect.
            event.preventDefault();
            startSignOut(() => signOutAction());
          }}
        >
          <LogOut size={16} />
          {signingOut ? "Logging out…" : "Log out"}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
