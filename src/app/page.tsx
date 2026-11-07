import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import LandingPage from "@/components/landing/landing-page";

// absolute skips the "| ResearchLens" title template.
export const metadata: Metadata = {
  title: {
    absolute: "ResearchLens: Find the papers worth reading",
  },
};

export default async function HomePage() {
  // Someone already signed in has no use for the pitch.
  const session = await auth();

  if (session?.user) {
    redirect("/explore");
  }

  return <LandingPage />;
}
