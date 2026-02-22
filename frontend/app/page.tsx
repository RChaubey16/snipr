import UrlInputForm from "@/components/form/UrlInputForm";
import { DarkModeToggle } from "@/components/DarkModeToggle";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <UrlInputForm />
      <DarkModeToggle />
    </div>
  );
}
