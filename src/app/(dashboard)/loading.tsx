import { Skeleton } from "@radix-ui/themes";

const PLACEHOLDER_CARDS = 6;

/** Gray placeholder shaped like a PaperCard. */
function PaperCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line bg-canvas p-5">
      <Skeleton
        height="20px"
        width="90%"
      />
      <Skeleton
        height="20px"
        width="60%"
      />
      <Skeleton
        height="14px"
        width="40%"
        mt="1"
      />
      <div className="flex gap-2">
        <Skeleton
          height="22px"
          width="80px"
          className="rounded-full"
        />
        <Skeleton
          height="22px"
          width="64px"
          className="rounded-full"
        />
      </div>
      <Skeleton
        height="14px"
        width="48px"
      />
    </div>
  );
}

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
    <main
      className="p-10"
      aria-busy="true"
    >
      <span
        role="status"
        className="sr-only"
      >
        Loading…
      </span>

      <Skeleton
        height="36px"
        width="260px"
      />
      <Skeleton
        height="44px"
        width="100%"
        mt="6"
      />

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: PLACEHOLDER_CARDS }, (_, index) => (
          <PaperCardSkeleton key={index} />
        ))}
      </div>
    </main>
  );
}
