import type { Metadata } from "next";
import UrlInputForm from "@/components/form/UrlInputForm";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: { absolute: "Snipr – Shorten, Share, Track" },
  description:
    "Shorten any URL in seconds. Snipr gives you clean, trackable short links with real-time click analytics.",
  openGraph: {
    title: "Snipr – Shorten, Share, Track",
    description:
      "Shorten any URL in seconds. Snipr gives you clean, trackable short links with real-time click analytics.",
  },
};

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <UrlInputForm />
      <Navbar />
    </div>
  );
}
