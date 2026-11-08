import { Skeleton } from "@radix-ui/themes";

import PaperCardSkeleton from "@/components/paper-card-skeleton";

const PLACEHOLDER_CARDS = 6;

/**
 * Shown the moment you navigate to any dashboard page, while its data loads.
 * Next.js wraps each page in a Suspense boundary with this as the fallback,
 * and swaps the real page in when it's ready. The sidebar stays put.
 *
 * Most dashboard pages are a heading over a grid of cards, so this matches
 * them. The paper page has its own, in papers/[id]/loading.tsx.
 */
export default function DashboardLoading() {
  return (
    <>
      <span
        role="status"
        className="sr-only"
      >
        Loading…
      </span>

      <section
        className="glass-panel"
        aria-busy="true"
      >
        <Skeleton
          height="36px"
          width="260px"
        />
        <Skeleton
          height="44px"
          width="100%"
          mt="6"
        />
      </section>

      <section
        className="glass-panel"
        aria-busy="true"
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: PLACEHOLDER_CARDS }, (_, index) => (
            <PaperCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </>
  );
}
