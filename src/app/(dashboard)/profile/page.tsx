import type { Metadata } from "next";
import { Card, DataList } from "@radix-ui/themes";

import { auth } from "@/auth";
import LightTheme from "@/components/light-theme";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const session = await auth();

  return (
    <>
      <section className="glass-panel">
        <PageHeader
          title="Profile"
          description="Your account details."
        />
      </section>

      <section className="glass-panel">
        <LightTheme>
          <Card
            size="3"
            className="max-w-md"
          >
            {/* DataList is a <dl> underneath, built for label and value pairs. */}
            <DataList.Root size="2">
              <DataList.Item>
                <DataList.Label minWidth="88px">Name</DataList.Label>
                <DataList.Value>{session?.user?.name}</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label minWidth="88px">Email</DataList.Label>
                <DataList.Value>{session?.user?.email}</DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </Card>
        </LightTheme>
      </section>
    </>
  );
}
