import type { Metadata } from "next";

import EmptyState from "@/components/empty-state";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <>
      <section className="glass-panel">
        <PageHeader
          title="Settings"
          description="Manage your account preferences."
        />
      </section>

      <section className="glass-panel">
        <EmptyState
          title="Nothing to configure yet"
          description="Reading preferences are coming soon."
        />
      </section>
    </>
  );
}
