import { Card, Flex, Skeleton } from "@radix-ui/themes";

import LightTheme from "@/components/light-theme";

/** Gray placeholder shaped like a PaperCard. */
export default function PaperCardSkeleton() {
  return (
    <LightTheme asChild>
      <Card size="3">
        <Flex
          direction="column"
          gap="3"
        >
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
        </Flex>
      </Card>
    </LightTheme>
  );
}
