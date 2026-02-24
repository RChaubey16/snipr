import type { Metadata } from "next";
import { QuickShorten } from "@/components/dashboard/QuickShorten";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentLinksTable } from "@/components/dashboard/RecentLinksTable";
import { Navbar } from "@/components/Navbar";
import { getMyUrls } from "@/lib/actions";

export const metadata: Metadata = {
  title: "Dashboard – Snipr",
  description: "Manage your shortened links",
};

export default async function DashboardPage() {
  const links = await getMyUrls();
  
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-12 pb-24 sm:px-6 lg:px-8">
        <QuickShorten />
        <StatsCards />
        <RecentLinksTable links={links} />
      </main>
      <Navbar />
    </div>
  );
}
