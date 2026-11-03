import type { ReactNode } from "react";
import { Flex, Heading, Text } from "@radix-ui/themes";

type PageMessageProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  /** Buttons that get the person moving again. */
  actions: ReactNode;
};

/**
 * A centered "something's not right" screen: an icon, a short explanation,
 * and buttons to recover. Shared by the error and not-found pages.
 */
export default function PageMessage({
  icon,
  title,
  children,
  actions,
}: PageMessageProps) {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      gap="3"
      className="min-h-[60vh] px-6 py-16 text-center"
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-accent-soft text-accent-ink">
        {icon}
      </div>

      <Heading
        as="h1"
        size="6"
        mt="2"
      >
        {title}
      </Heading>

      <Text
        as="div"
        color="gray"
        className="max-w-md"
      >
        {children}
      </Text>

      <Flex
        gap="3"
        mt="4"
        wrap="wrap"
        justify="center"
      >
        {actions}
      </Flex>
    </Flex>
  );
}
