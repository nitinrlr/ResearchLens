import { Heading, Text } from "@radix-ui/themes";

type EmptyStateProps = {
  title: string;
  description: string;
  /** Optional button below the text. */
  children?: React.ReactNode;
};

/** The dashed box shown when a list has nothing in it yet. */
export default function EmptyState({
  title,
  description,
  children,
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-line-strong p-12 text-center">
      <Heading
        as="h2"
        size="5"
      >
        {title}
      </Heading>

      <Text
        as="p"
        color="gray"
        mt="2"
      >
        {description}
      </Text>

      {children}
    </div>
  );
}
