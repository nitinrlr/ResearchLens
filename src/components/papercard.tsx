import Link from "next/link";
import { Calendar, Clock3, Star } from "lucide-react";
import { Badge, Card, Flex, Heading, Text } from "@radix-ui/themes";

import CollectionPicker from "@/components/collection-picker";
import LightTheme from "@/components/light-theme";

type PaperCardProps = {
  paper: {
    id: string;
    title: string;
    publishedDate: Date | string;
    readingTime: number;
    difficulty: number;
    saved: boolean;
    authors: string[];
    topics: string[];
  };
};

export default function PaperCard({ paper }: PaperCardProps) {
  return (
    // Radix draws the card's border with a shadow rather than a CSS border,
    // so the hover and keyboard-focus styles use shadow and outline too.
    <LightTheme asChild>
      <Card
        asChild
        size="3"
        className="flex flex-col transition-shadow duration-200 hover:shadow-lg has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-(--focus-8)"
      >
        <article>
          <Flex
            justify="between"
            align="start"
            gap="3"
          >
            <Heading
              as="h2"
              size="4"
              weight="medium"
            >
              {/*
                The ::after overlay stretches this link across the whole card, so
                the card stays clickable without the picker's checkboxes having to
                live inside an <a> (invalid HTML, and their clicks would navigate).
              */}
              <Link
                href={`/papers/${paper.id}`}
                className="outline-none after:absolute after:inset-0"
              >
                {paper.title}
              </Link>
            </Heading>

            {/*
              `relative` puts the bookmark above the link overlay: positioned
              elements paint in page order, and this comes after the link. The
              picker's panel renders outside the card, so it can't be covered.
            */}
            <div className="relative shrink-0">
              <CollectionPicker
                paperId={paper.id}
                initialSaved={paper.saved}
              />
            </div>
          </Flex>

          <Text
            as="p"
            size="2"
            color="gray"
            mt="2"
          >
            {paper.authors.length > 0
              ? `${paper.authors[0]} et al.`
              : "Unknown Author"}
          </Text>

          <Flex
            wrap="wrap"
            gap="2"
            mt="3"
          >
            {paper.topics.slice(0, 3).map((topic) => (
              <Badge
                key={topic}
                size="1"
                radius="full"
                color="gray"
                className="max-w-full whitespace-normal"
              >
                {topic}
              </Badge>
            ))}
          </Flex>

          <Text
            as="p"
            size="2"
            color="gray"
            mt="3"
            className="flex items-center gap-2"
          >
            <Calendar size={16} />
            {new Date(paper.publishedDate).getFullYear()}
          </Text>

          <Flex
            justify="end"
            gap="4"
            pt="3"
            className="mt-auto"
          >
            <Flex gap="1">
              <Star size={16} />
              <div>
                <Text
                  as="p"
                  size="1"
                  color="gray"
                >
                  Difficulty
                </Text>
                <Text
                  as="p"
                  size="2"
                >
                  {paper.difficulty}/5
                </Text>
              </div>
            </Flex>

            <Flex gap="1">
              <Clock3 size={16} />
              <div>
                <Text
                  as="p"
                  size="1"
                  color="gray"
                >
                  Reading Time
                </Text>
                <Text
                  as="p"
                  size="2"
                >
                  {paper.readingTime} min
                </Text>
              </div>
            </Flex>
          </Flex>
        </article>
      </Card>
    </LightTheme>
  );
}
