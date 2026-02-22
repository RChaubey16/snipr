import { InputField } from "@/components/input/InputField";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col gap-4">
        <div className="flex items-end gap-2">
          <InputField
            label="Long URL"
            id="long-url"
            type="text"
            placeholder="Your long URL"
            showDescription={false}
          />
          <Button variant="outline" size="default" className="cursor-pointer">
            Snipe
          </Button>
        </div>

        <div className="px-4 py-2 rounded-md bg-black/10">
          Your snipr link: <Link href="#" className="underline">https://snipr.com/123</Link>
        </div>
      </div>
    </div>
  );
}
