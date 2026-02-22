"use client";

import { motion } from "motion/react";
import { Scissors } from "lucide-react";

/** Inline SVG for the official Google "G" logo mark */
function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function LoginCard() {
  const handleGoogleSignIn = () => {
    // TODO: wire up your actual Google OAuth / NextAuth handler here
    console.log("Sign in with Google");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-sm"
    >
      {/* Card */}
      <div className="overflow-hidden rounded-[calc(var(--radius)*2.5)] border border-border bg-card text-card-foreground shadow-xl">

        {/* Top accent strip */}
        <div className="h-[3px] bg-gradient-to-r from-primary to-primary/40" />

        <div className="flex flex-col items-center gap-6 px-8 pb-8 pt-10">

          {/* Logo + wordmark */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[calc(var(--radius)*2)] bg-primary text-primary-foreground ring-8 ring-primary/15">
              <Scissors size={26} strokeWidth={2.2} />
            </div>

            <div className="text-center">
              <h1 className="font-sans text-[1.6rem] font-bold leading-[1.15] tracking-tight text-foreground">
                snipr
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Snip links. Share faster.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-border" />

          {/* Heading */}
          <div className="text-center">
            <p className="font-sans text-[1.05rem] font-semibold text-foreground">
              Welcome back
            </p>
            <p className="mt-1 text-[0.825rem] text-muted-foreground">
              Sign in to manage your shortened links
            </p>
          </div>

          {/* Google button */}
          <motion.button
            onClick={handleGoogleSignIn}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.975 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[var(--radius)] border border-border bg-background px-5 py-3 font-sans text-[0.9rem] font-medium text-foreground shadow-sm transition-[box-shadow,background] duration-200 hover:bg-secondary hover:shadow-md"
          >
            <GoogleIcon />
            Continue with Google
          </motion.button>

          {/* Footer note */}
          <p className="text-center text-[0.73rem] leading-relaxed text-muted-foreground">
            By signing in, you agree to our{" "}
            <a href="/terms" className="text-primary underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-primary underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </motion.div>
  );
}
