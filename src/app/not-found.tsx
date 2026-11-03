import type { Metadata } from "next";
import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@radix-ui/themes";

import PageMessage from "@/components/page-message";

export const metadata: Metadata = {
  title: "Page not found",
};

/** Shown for any URL the app doesn't have, such as /explroe. */
export default function NotFound() {
  return (
    <main className="bg-canvas">
      <PageMessage
        icon={<Compass size={22} />}
        title="Page not found"
        actions={
          <Button
            asChild
            size="3"
          >
            <Link href="/">Go home</Link>
          </Button>
        }
      >
        <p>
          There&apos;s nothing at this address. Check the link for typos, or
          head back to the start.
        </p>
      </PageMessage>
    </main>
  );
}
