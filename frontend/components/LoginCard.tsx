"use client";

import { useRouter } from "next/navigation";

import { Scissors } from "lucide-react";
import { motion } from "motion/react";

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
  const router = useRouter();
  const handleGoogleSignIn = () => {
    router.push(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`);
  };

  return (
    <motion.div
      initial={{ filter: "blur(10px)", scale: 0.98, opacity: 0 }}
      animate={{ filter: "blur(0px)", scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full max-w-sm"
    >
      {/* Card */}
      <div className="border-border bg-card text-card-foreground overflow-hidden rounded-[calc(var(--radius)*2.5)] border shadow-xl">
        {/* Top accent strip */}
        <div className="from-primary to-primary/40 h-[3px] bg-gradient-to-r" />

        <div className="flex flex-col items-center gap-6 px-8 pt-10 pb-8">
          {/* Logo + wordmark */}
          <div className="flex flex-col items-center gap-3">
            <div className="bg-primary text-primary-foreground ring-primary/15 flex h-[52px] w-[52px] items-center justify-center rounded-[calc(var(--radius)*2)] ring-8">
              <Scissors size={26} strokeWidth={2.2} />
            </div>

            <div className="text-center">
              <h1 className="text-foreground font-sans text-[1.6rem] leading-[1.15] font-bold tracking-tight">
                snipr
              </h1>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Snip links. Share faster.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="bg-border h-px w-full" />

          {/* Heading */}
          <div className="text-center">
            <p className="text-foreground font-sans text-[1.05rem] font-semibold">
              Welcome back
            </p>
            <p className="text-muted-foreground mt-1 text-[0.825rem]">
              Sign in to manage your shortened links
            </p>
          </div>

          {/* Google button */}
          <motion.button
            onClick={handleGoogleSignIn}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.975 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="border-border bg-background text-foreground hover:bg-secondary flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[var(--radius)] border px-5 py-3 font-sans text-[0.9rem] font-medium shadow-sm transition-[box-shadow,background] duration-200 hover:shadow-md"
          >
            <GoogleIcon />
            Continue with Google
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
