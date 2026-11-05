import type { Metadata } from "next";

import EmptyState from "@/components/empty-state";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <main className="p-10 text-ink">
      <PageHeader
        title="Settings"
        description="Manage your account preferences."
      />

      <div className="mt-12">
        <EmptyState
          title="Nothing to configure yet"
          description="Reading preferences are coming soon."
        />
      </div>
    </main>
  );
}
