"use client"; // Error boundaries must be Client Components

import Link from "next/link";
import { useEffect } from "react";
import { CloudOff } from "lucide-react";
import { Button, Code, Text } from "@radix-ui/themes";

import PageMessage from "@/components/page-message";

type ErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

/**
 * Shown when a dashboard page throws while loading, most often because the
 * database didn't answer in time (Neon pauses an idle database and takes a
 * moment to wake). It replaces only the page: the sidebar stays usable.
 */
export default function DashboardError({ error, retry }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageMessage
      icon={<CloudOff size={22} />}
      title="This page didn't load"
      actions={
        <>
          {/* retry() fetches the page's data again, unlike reset(), which only re-renders. */}
          <Button
            size="3"
            onClick={() => retry()}
          >
            Try again
          </Button>
          <Button
            asChild
            size="3"
            variant="soft"
            color="gray"
          >
            <Link href="/explore">Go to Explore</Link>
          </Button>
        </>
      }
    >
      <p>
        Something went wrong while loading your data. It&apos;s usually
        temporary, so trying again often works.
      </p>

      {/*
        In production, Next.js hides server error messages from the browser and
        sends this digest instead. It matches the error in the server logs.
      */}
      {error.digest && (
        <Text
          as="p"
          size="1"
          mt="3"
        >
          Error code: <Code variant="ghost">{error.digest}</Code>
        </Text>
      )}
    </PageMessage>
  );
}
