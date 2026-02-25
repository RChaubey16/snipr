import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { LoginCard } from "@/components/LoginCard";

export const metadata: Metadata = {
  title: "Login – Snipr",
  description: "Sign in to Snipr to manage and shorten your links.",
  openGraph: {
    title: "Login – Snipr",
    description: "Sign in to Snipr to manage and shorten your links.",
  },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <LoginCard />
      <Navbar />
    </div>
  );
}
