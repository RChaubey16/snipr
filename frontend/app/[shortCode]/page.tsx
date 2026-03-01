import { redirect, notFound } from "next/navigation";

export default async function ShortUrlPage({
  params,
}: {
  params: { shortCode: string };
}) {
  const { shortCode } = await params;

  // basic validation
  if (shortCode.length !== 6) {
    notFound();
  }

  // check if shortcode exists
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/url/${shortCode}`,
    { cache: "no-store" }
  );

  // API says it doesn't exist
  if (!res.ok) {
    notFound();
  }

  const data = await res.json();

  // safety check
  if (!data?.originalUrl) {
    notFound();
  }

  // redirect to actual URL
  redirect(`${process.env.NEXT_PUBLIC_API_URL}/${shortCode}`);
}
