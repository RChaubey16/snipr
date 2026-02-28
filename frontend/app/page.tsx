import type { Metadata } from "next";

import { Navbar } from "@/components/Navbar";
import UrlInputForm from "@/components/form/UrlInputForm";

export const metadata: Metadata = {
  title: { absolute: "Snipr – Shorten, Share, Track" },
  description:
    "Shorten any URL in seconds. Snipr gives you clean, trackable short links with real-time click analytics.",
  openGraph: {
    title: "Snipr – Shorten, Share, Track",
    description:
      "Shorten any URL in seconds. Snipr gives you clean, trackable short links with real-time click analytics.",
    images: ["/home-page.png"],
  },
};

export default function Home() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <UrlInputForm />
      <Navbar />
    </div>
  );
}
