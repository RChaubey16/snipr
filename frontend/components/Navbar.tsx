"use client";

import Link from "next/link";
import { House, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Separator } from "@/components/ui/separator";

export function Navbar() {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-full border bg-background/80 px-3 py-2 shadow-sm backdrop-blur-sm">
        <Button variant="ghost" size="icon" className="rounded-full" asChild>
          <Link href="/">
            <House className="h-5 w-5" />
            <span className="sr-only">Home</span>
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button variant="ghost" size="icon" className="rounded-full" asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="h-5 w-5" />
            <span className="sr-only">Dashboard</span>
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <DarkModeToggle />
      </div>
    </nav>
  );
}
