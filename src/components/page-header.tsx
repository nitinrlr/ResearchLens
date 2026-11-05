import { Flex, Heading, Text } from "@radix-ui/themes";

type PageHeaderProps = {
  title: string;
  description?: string;
  /** Shown on the right, such as the New Collection button. */
  children?: React.ReactNode;
};

/** The title and one-line description at the top of every dashboard page. */
export default function PageHeader({
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <Flex
      justify="between"
      align="start"
      gap="4"
      wrap="wrap"
    >
      <div>
        <Heading
          as="h1"
          size="8"
        >
          {title}
        </Heading>

        {description && (
          <Text
            as="p"
            color="gray"
            mt="2"
          >
            {description}
          </Text>
        )}
      </div>

      {children}
    </Flex>
  );
}
