import { Card, Flex, Skeleton } from "@radix-ui/themes";

/**
 * Loading placeholder for a single paper, shaped like the real page: title,
 * authors and topics, then the abstract, the stats strip and the reader, with
 * the chat panel beside them on wide screens.
 */
export default function PaperLoading() {
  return (
    <>
      <span
        role="status"
        className="sr-only"
      >
        Loading paper…
      </span>

      <div
        className="grid items-start gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]"
        aria-busy="true"
      >
        <div className="flex min-w-0 flex-col gap-3">
          <section className="glass-panel">
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
                height="22px"
                width="120px"
                className="rounded-full"
              />
              <Skeleton
                height="22px"
                width="96px"
                className="rounded-full"
              />
            </div>
          </section>

          <section className="glass-panel">
            <Card
              size="3"
              className="solid-glass"
              mb="6"
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

            <div className="mb-6 grid grid-cols-3 divide-x divide-white/25">
              {["Published", "Difficulty", "Reading Time"].map((label) => (
                <Flex
                  key={label}
                  direction="column"
                  align="center"
                  gap="2"
                  className="px-2 py-1"
                >
                  <Skeleton
                    height="14px"
                    width="72px"
                  />
                  <Skeleton
                    height="36px"
                    width="80px"
                  />
                </Flex>
              ))}
            </div>

            <Card
              size="3"
              className="solid-glass"
            >
              <Skeleton
                height="24px"
                width="120px"
              />
              <Skeleton
                height="480px"
                width="100%"
                mt="4"
              />
            </Card>
          </section>
        </div>

        <section className="glass-panel max-lg:hidden lg:h-[calc(100svh-1.5rem)]">
          <Skeleton
            height="24px"
            width="160px"
          />
        </section>
      </div>
    </>
  );
}
