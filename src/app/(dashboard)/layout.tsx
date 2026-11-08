import { Theme } from "@radix-ui/themes";

import FlutedBackground from "@/components/fluted-background";
import OverlayScrollbar from "@/components/overlay-scrollbar";
import Sidebar from "@/components/sidebar";
import { ToastProvider } from "@/components/toast";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <ToastProvider>
      {/* Dark Radix tokens recolor the app; isolate keeps the background visible. */}
      <Theme
        asChild
        appearance="dark"
        hasBackground={false}
      >
        <div className="overlay-scroll isolate flex min-h-screen text-ink">
          <FlutedBackground />
          <OverlayScrollbar />

          <Sidebar
            user={{
              name: session.user.name ?? "Account",
              email: session.user.email ?? "",
            }}
          />

          <main className="flex min-w-0 flex-1 flex-col gap-3 p-3">
            {children}
          </main>
        </div>
      </Theme>
    </ToastProvider>
  );
}
