"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { House, LayoutDashboard, Link2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

type User = {
  avatar?: string | null;
  name?: string | null;
};

export function Navbar() {
  const { user: authUser, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const user = authUser as unknown as User;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

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
        <Button variant="ghost" size="icon" className="rounded-full" asChild>
          <Link href="/dashboard/links">
            <Link2 className="h-5 w-5" />
            <span className="sr-only">Links</span>
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <DarkModeToggle />
        {isAuthenticated && user && (
          <>
            <Separator orientation="vertical" className="h-6" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-8 w-8 cursor-pointer overflow-hidden rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name ?? "User avatar"}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                      width={32}
                      height={32}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-medium">
                      {user.name?.charAt(0)?.toUpperCase() ?? "U"}
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="end" className="mb-2">
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </nav>
  );
}
