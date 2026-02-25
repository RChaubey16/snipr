"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  MoreHorizontal,
  Pencil,
  Trash2,
  BarChart3,
  QrCode,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { deleteUrl } from "@/lib/actions";
import { type SniprLink } from "@/lib/mock-data";

const statusVariant: Record<
  SniprLink["status"],
  "default" | "secondary" | "destructive"
> = {
  active: "default",
  expired: "secondary",
  disabled: "destructive",
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          className="cursor-pointer"
          onClick={copy}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copied!" : "Copy link"}</TooltipContent>
    </Tooltip>
  );
}

function ActionsMenu({ id }: { id: string }) {
  const handleDelete = async () => {
    const result = await deleteUrl(id);
    if (!result.success) {
      console.error("Failed to delete URL");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-xs" className="cursor-pointer">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* <DropdownMenuItem className="cursor-pointer">
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <BarChart3 className="mr-2 h-4 w-4" />
          Analytics
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <QrCode className="mr-2 h-4 w-4" />
          QR Code
        </DropdownMenuItem> */}
        <DropdownMenuItem
          className="cursor-pointer text-destructive"
          onClick={handleDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function RecentLinksTable({ links }: { links: SniprLink[] }) {
  const totalLinks = links.length;

  if (totalLinks === 0) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Recent Links</h2>
        <div className="rounded-lg border p-8 text-center text-muted-foreground">
          No links created yet.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Recent Links</h2>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Short URL</TableHead>
              <TableHead className="hidden sm:table-cell">
                Original URL
              </TableHead>
              <TableHead className="text-right">Clicks</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link) => (
              <TableRow key={link.id}>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-sm">{link.shortUrl}</span>
                    <CopyButton text={`${link.shortUrl}`} />
                  </div>
                </TableCell>
                <TableCell className="hidden max-w-[200px] truncate text-muted-foreground sm:table-cell">
                  {link.originalUrl}
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {link.clicks.toLocaleString()}
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {new Date(link.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[link.status]}>
                    {link.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ActionsMenu id={link.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
