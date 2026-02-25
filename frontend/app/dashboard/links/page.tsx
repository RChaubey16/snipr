import type { Metadata } from "next";
import { AllLinksTable } from "@/components/dashboard/AllLinksTable";
import { Navbar } from "@/components/Navbar";
import { getMyUrls } from "@/lib/actions";

export const metadata: Metadata = {
  title: "My Links – Snipr",
  description: "Browse all your shortened links",
  robots: { index: false },
};

export default async function LinksPage() {
  const result = await getMyUrls(1);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-12 pb-24 sm:px-6 lg:px-8">
        <AllLinksTable
          initialData={result.data}
          total={result.total}
          page={result.page}
          totalPages={result.totalPages}
        />
      </main>
      <Navbar />
    </div>
  );
}
