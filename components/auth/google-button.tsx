"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.86c2.26-2.09 3.56-5.17 3.56-8.87Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.55.37-2.28V6.63H1.29A12 12 0 0 0 0 12c0 1.94.47 3.77 1.29 5.37l3.98-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.76c1.76 0 3.34.61 4.59 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.63l3.98 3.09C6.22 6.87 8.87 4.76 12 4.76Z"
      />
    </svg>
  );
}

export function GoogleButton({ label }: { label: string }) {
  const enabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";

  async function handleClick() {
    if (!enabled) {
      toast.info("Google sign-in is not configured yet. Use email and password for now.");
      return;
    }

    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/events",
    });

    if (error) {
      toast.error(error.message ?? "Google sign-in could not be started.");
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="w-full bg-background/60"
        onClick={() => void handleClick()}
      >
        <GoogleMark />
        {label}
      </Button>
      {!enabled && (
        <p className="px-1 text-center text-[0.68rem] leading-relaxed text-muted-foreground">
          Google sign-in is not configured in this environment yet. Use email and
          password below.
        </p>
      )}
    </div>
  );
}

export function AuthDivider() {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-border" />
      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        or
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
