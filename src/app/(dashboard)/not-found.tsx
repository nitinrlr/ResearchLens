import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@radix-ui/themes";

import PageMessage from "@/components/page-message";

/**
 * Shown inside the dashboard, sidebar included, when a page calls notFound():
 * a paper id that doesn't exist, or a collection that was deleted or belongs
 * to someone else.
 */
export default function DashboardNotFound() {
  return (
    <section className="glass-panel">
      <PageMessage
        icon={<FileQuestion size={22} />}
        title="We couldn't find that"
        actions={
          <>
            <Button
              asChild
              size="3"
            >
              <Link href="/explore">Explore papers</Link>
            </Button>
            <Button
              asChild
              size="3"
              variant="soft"
              color="gray"
            >
              <Link href="/collections">Your collections</Link>
            </Button>
          </>
        }
      >
        <p>
          The paper or collection you&apos;re looking for doesn&apos;t exist. It
          may have been deleted, or the link may be wrong.
        </p>
      </PageMessage>
    </section>
  );
}
