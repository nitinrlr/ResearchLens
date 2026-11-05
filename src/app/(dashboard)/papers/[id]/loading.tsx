import { Card, Flex, Skeleton } from "@radix-ui/themes";

/**
 * Loading placeholder for a single paper, shaped like the real page: title,
 * authors, topics, abstract, then the three detail boxes.
 */
export default function PaperLoading() {
  return (
    <main
      className="p-10"
      aria-busy="true"
    >
      <span
        role="status"
        className="sr-only"
      >
        Loading paper…
      </span>

      <div className="mx-auto max-w-4xl">
        <Skeleton
          height="14px"
          width="96px"
        />
        <Skeleton
          height="40px"
          width="85%"
          mt="3"
        />
        <Skeleton
          height="40px"
          width="55%"
          mt="2"
        />
        <Skeleton
          height="18px"
          width="45%"
          mt="4"
        />

        <div className="mt-8 flex gap-2">
          <Skeleton
            height="28px"
            width="120px"
            className="rounded-full"
          />
          <Skeleton
            height="28px"
            width="96px"
            className="rounded-full"
          />
        </div>

        <Card
          size="3"
          mt="6"
        >
          <Flex
            direction="column"
            gap="3"
          >
            <Skeleton
              height="24px"
              width="120px"
            />
            <Skeleton
              height="16px"
              width="100%"
              mt="2"
            />
            <Skeleton
              height="16px"
              width="100%"
            />
            <Skeleton
              height="16px"
              width="92%"
            />
            <Skeleton
              height="16px"
              width="70%"
            />
          </Flex>
        </Card>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {["Published", "Difficulty", "Reading time"].map((label) => (
            <Card
              key={label}
              size="3"
            >
              <Skeleton
                height="14px"
                width="72px"
              />
              <Skeleton
                height="20px"
                width="48px"
                mt="2"
              />
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
