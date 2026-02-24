"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { createSniprUrl } from "@/lib/actions";
import {
  CircleArrowRight,
  Copy,
  Check,
  ExternalLink,
  Scissors,
  AlertCircle,
} from "lucide-react";

const UrlInputForm = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

      setShortUrl(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${res.data.shortUrl}`);
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
    <motion.div
      initial={{ filter: "blur(10px)", scale: 0.98, opacity: 0 }}
      animate={{ filter: "blur(0px)", scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex w-full max-w-xl flex-col items-center gap-8 px-4"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">
          <Scissors className="h-6 w-6 text-primary" />
        </div>
        <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground">
          Snip your links
        </h1>
        <p className="text-muted-foreground">
          Paste a long URL and get a clean, short link in seconds.
        </p>
      </div>

      <form onSubmit={onFormSubmit} className="flex w-full gap-3">
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
          {isLoading ? "Snipping..." : "Snipe"}
          <CircleArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </form>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.2 }}
            className="flex w-full items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {shortUrl && (
          <motion.div
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="space-y-3 py-4">
                <p className="text-xs text-muted-foreground">
                  Your short link
                </p>
                <p className="break-all font-mono text-lg font-semibold text-primary">
                  {shortUrl}
                </p>
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
    </motion.div>
  );
};

export default UrlInputForm;
