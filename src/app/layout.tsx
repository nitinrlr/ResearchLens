import type { Metadata } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display face for the landing page headline and section titles.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ResearchLens",
    template: "%s | ResearchLens",
  },
  description:
    "Search millions of open-access CS papers, keep track of what you've started, and organize what matters — in one place.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
    >
      {/*
        No background here on purpose: the landing page is light while the
        dashboard and auth screens are dark, so each one paints its own ground.
      */}
      <body>
        {children}
      </body>
    </html>
  );
}
