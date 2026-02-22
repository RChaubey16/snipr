import UrlInputForm from "@/components/form/UrlInputForm";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <UrlInputForm />
      <Navbar />
    </div>
  );
}
