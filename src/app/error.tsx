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
 * The catch-all for errors outside the dashboard: the landing page and the
 * sign-in pages. Dashboard pages have their own, in (dashboard)/error.tsx.
 */
export default function RootError({ error, retry }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="bg-canvas">
      <PageMessage
        icon={<CloudOff size={22} />}
        title="Something went wrong"
        actions={
          <>
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
              <Link href="/">Go home</Link>
            </Button>
          </>
        }
      >
        <p>
          This page hit an unexpected problem. It&apos;s usually temporary, so
          trying again often works.
        </p>

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
    </main>
  );
}
