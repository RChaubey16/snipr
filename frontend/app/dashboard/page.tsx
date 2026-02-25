import type { Metadata } from "next";

import { Navbar } from "@/components/Navbar";
import { QuickShorten } from "@/components/dashboard/QuickShorten";
import { RecentLinksTable } from "@/components/dashboard/RecentLinksTable";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { getMyUrls } from "@/lib/actions";

export const metadata: Metadata = {
  title: "Dashboard – Snipr",
  description: "Manage your shortened links",
  openGraph: {
    title: "Dashboard – Snipr",
    description: "Manage your shortened links",
  },
  robots: { index: false },
};

export default async function DashboardPage() {
  const links = await getMyUrls();

  return (
    <div className="bg-background min-h-screen">
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-12 pb-24 sm:px-6 lg:px-8">
        <QuickShorten />
        <StatsCards />
        <RecentLinksTable links={links.data} />
      </main>
      <Navbar />
    </div>
  );
}
