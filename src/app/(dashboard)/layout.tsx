import Sidebar from "@/components/sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}