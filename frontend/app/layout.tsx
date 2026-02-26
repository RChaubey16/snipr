import {
  Source_Code_Pro,
  Source_Serif_4,
  Space_Grotesk,
} from "next/font/google";

import type { Metadata } from "next";

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css";

const fontSans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontMono = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
  ),
  title: {
    default: "Snipr – Shorten, Share, Track",
    template: "%s | Snipr",
  },
  description:
    "Snipr is a fast, minimal URL shortener. Shorten links, share them anywhere, and track clicks in real time.",
  openGraph: {
    title: "Snipr – Shorten, Share, Track",
    description:
      "Snipr is a fast, minimal URL shortener. Shorten links, share them anywhere, and track clicks in real time.",
    siteName: "Snipr",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}
      >
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
