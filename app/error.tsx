"use client";

import { useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="site-container flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="display-lg mt-4 max-w-2xl">
        We hit a bump on the way to the event.
      </h1>
      <p className="lede mt-4 max-w-lg">
        The page could not load right now. Try again — your session and data are
        safe.
      </p>
      <Button onClick={reset} size="lg" className="mt-8">
        <RefreshCcw />
        Try again
      </Button>
    </div>
  );
}
