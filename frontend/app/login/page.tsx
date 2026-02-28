import type { Metadata } from "next";

import { LoginCard } from "@/components/LoginCard";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Login – Snipr",
  description: "Sign in to Snipr to manage and shorten your links.",
  openGraph: {
    title: "Login – Snipr",
    description: "Sign in to Snipr to manage and shorten your links.",
    images: ["/home-page.png"],
  },
};

export default function LoginPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <LoginCard />
      <Navbar />
    </div>
  );
}
