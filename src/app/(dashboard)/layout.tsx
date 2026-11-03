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
      <div className="flex min-h-screen bg-canvas text-ink">
        <Sidebar
          user={{
            name: session.user.name ?? "Account",
            email: session.user.email ?? "",
          }}
        />

        <main className="flex-1">
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
