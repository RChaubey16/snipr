"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { House, LayoutDashboard, Link2, LogIn, LogOut } from "lucide-react";

import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";

type User = {
  avatar?: string | null;
  name?: string | null;
};

export function Navbar() {
  const { user: authUser, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  const user = authUser as unknown as User;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading) return null;

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2">
      <TooltipProvider>
        <div className="bg-background/80 flex items-center gap-2 rounded-full border px-3 py-2 shadow-sm backdrop-blur-sm">
          {isAuthenticated && user ? (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    asChild
                  >
                    <Link href="/dashboard">
                      <LayoutDashboard className="h-5 w-5" />
                      <span className="sr-only">Dashboard</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Dashboard</TooltipContent>
              </Tooltip>
              <Separator orientation="vertical" className="h-6" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    asChild
                  >
                    <Link href="/dashboard/links">
                      <Link2 className="h-5 w-5" />
                      <span className="sr-only">Links</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Links</TooltipContent>
              </Tooltip>
              <Separator orientation="vertical" className="h-6" />
              <DarkModeToggle />
              <Separator orientation="vertical" className="h-6" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:ring-ring h-8 w-8 cursor-pointer overflow-hidden rounded-full focus:ring-2 focus:ring-offset-2 focus:outline-none">
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
                      <div className="bg-muted flex h-full w-full items-center justify-center text-xs font-medium">
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
          ) : (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    asChild
                  >
                    <Link href="/">
                      <House className="h-5 w-5" />
                      <span className="sr-only">Home</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Home</TooltipContent>
              </Tooltip>
              <Separator orientation="vertical" className="h-6" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    asChild
                  >
                    <Link href="/login">
                      <LogIn className="h-5 w-5" />
                      <span className="sr-only">Login</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Login</TooltipContent>
              </Tooltip>
              <Separator orientation="vertical" className="h-6" />
              <DarkModeToggle />
            </>
          )}
        </div>
      </TooltipProvider>
    </nav>
  );
}
