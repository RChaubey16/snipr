"use client";

import Link from "next/link";

import { Check, CircleArrowRight, Copy, ExternalLink } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createSniprUrl } from "@/lib/actions";

import { AnimateIcon } from "../animate-ui/icons/icon";
import { ScissorsLineDashed } from "../animate-ui/icons/scissors-line-dashed";

export function QuickShorten() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await createSniprUrl(longUrl);

      if (!res.success) {
        const errMsg = Array.isArray(res.error)
          ? res.error.join(", ")
          : (res.error ?? "Something went wrong");
        setError(errMsg);
        setIsLoading(false);
        return;
      }

      setShortUrl(`${process.env.NEXT_PUBLIC_API_URL}/${res.data.shortUrl}`);
      setLongUrl("");
    } catch {
      setError("Server connection failed");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setShortUrl("");
    setError("");
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Quick Snipe</h2>
        <p className="text-muted-foreground text-sm">
          Paste a long URL and get a short link instantly.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex gap-3">
        <Input
          type="url"
          placeholder="https://your-really-long-url.com/with/many/segments..."
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          className="h-12 flex-1 text-base"
          required
        />
        <Button
          type="submit"
          className="h-12 cursor-pointer px-6"
          disabled={isLoading}
        >
          {isLoading ? (
            <AnimateIcon animateOnView loop>
              <ScissorsLineDashed />
            </AnimateIcon>
          ) : (
            "Snipe"
          )}
          <AnimateIcon animateOnView loop loopDelay={3000}>
            <ScissorsLineDashed />
          </AnimateIcon>
        </Button>
      </form>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <AnimatePresence>
        {shortUrl && (
          <motion.div
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.25 }}
          >
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="flex items-center justify-between gap-4 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-muted-foreground text-xs">
                    Your short link
                  </p>
                  <p className="text-primary truncate font-mono text-lg font-semibold">
                    {shortUrl}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <Check className="mr-1 h-4 w-4" />
                    ) : (
                      <Copy className="mr-1 h-4 w-4" />
                    )}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    asChild
                  >
                    <Link href={shortUrl} target="_blank">
                      <ExternalLink className="mr-1 h-4 w-4" />
                      Open
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer"
                    onClick={reset}
                  >
                    New
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
