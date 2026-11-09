"use client";

import { useState } from "react";
import { DashboardIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { SegmentedControl } from "@radix-ui/themes";

import { PAPER_VIEW_COOKIE, parsePaperView } from "@/lib/paper-view";
import type { PaperView } from "@/lib/paper-view";

type PaperListProps = {
  initialView: PaperView;
  /** Shown on the left of the layout switch. */
  summary: React.ReactNode;
  children: React.ReactNode;
};

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Paper cards with a switch between boxes and full-width rows. */
export default function PaperList({
  initialView,
  summary,
  children,
}: PaperListProps) {
  const [view, setView] = useState(initialView);

  function changeView(value: string) {
    setView(parsePaperView(value));
    document.cookie = `${PAPER_VIEW_COOKIE}=${value}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
  }

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-4">
        {summary}

        {/* Boxes are already one per row on a phone, so there's nothing to switch. */}
        <div className="hidden md:block">
          <SegmentedControl.Root
            size="1"
            value={view}
            onValueChange={changeView}
            aria-label="Paper layout"
          >
            <SegmentedControl.Item
              value="grid"
              aria-label="Show papers as boxes"
            >
              <DashboardIcon />
            </SegmentedControl.Item>
            <SegmentedControl.Item
              value="list"
              aria-label="Show papers as rows"
            >
              <HamburgerMenuIcon />
            </SegmentedControl.Item>
          </SegmentedControl.Root>
        </div>
      </div>

      <div
        data-view={view}
        className={
          view === "list"
            ? "flex flex-col gap-3"
            : "grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        }
      >
        {children}
      </div>
    </>
  );
}
