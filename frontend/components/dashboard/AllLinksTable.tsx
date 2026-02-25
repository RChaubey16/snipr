"use client";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { deleteUrl, getMyUrls } from "@/lib/actions";
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
            <Copy className="text-muted-foreground h-3.5 w-3.5" />
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
        <DropdownMenuItem
          className="text-destructive cursor-pointer"
          onClick={handleDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type AllLinksTableProps = {
  initialData: SniprLink[];
  total: number;
  page: number;
  totalPages: number;
};

export function AllLinksTable({
  initialData,
  total,
  page: initialPage,
  totalPages: initialTotalPages,
}: AllLinksTableProps) {
  const [links, setLinks] = useState(initialData);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isPending, startTransition] = useTransition();

  const goToPage = (newPage: number) => {
    startTransition(async () => {
      const result = await getMyUrls(newPage);
      setLinks(result.data);
      setPage(result.page);
      setTotalPages(result.totalPages);
    });
  };

  if (links.length === 0 && page === 1) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">My Links</h2>
        <div className="text-muted-foreground rounded-lg border p-8 text-center">
          No links created yet.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">My Links</h2>
      <div
        className={`rounded-lg border ${isPending ? "opacity-60" : ""} transition-opacity`}
      >
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
                <TableCell className="text-muted-foreground hidden max-w-[200px] truncate sm:table-cell">
                  {link.originalUrl}
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {link.clicks.toLocaleString()}
                </TableCell>
                <TableCell className="text-muted-foreground hidden md:table-cell">
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
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1 || isPending}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages || isPending}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
