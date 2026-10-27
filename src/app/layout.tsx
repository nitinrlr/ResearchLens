import type { Metadata } from "next";
import { Geist, Bricolage_Grotesque } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
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
      className={`${geistSans.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body>
        {/*
          Every page renders inside Radix Themes. accentColor and grayColor set
          the colors for Radix components and, through the tokens in
          globals.css, for our own Tailwind classes too.
        */}
        <Theme
          appearance="light"
          accentColor="blue"
          grayColor="slate"
        >
          {children}
        </Theme>
      </body>
    </html>
  );
}
