import { redirect } from "next/navigation";

export default async function ShortUrlPage({
  params,
}: {
  params: { shortCode: string };
}) {
  const { shortCode } = await params;
  redirect(`${process.env.NEXT_PUBLIC_API_URL}/${shortCode}`);
}
