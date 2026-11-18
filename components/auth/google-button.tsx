"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import type {
  SocialProvider,
  SocialProviderAvailability,
} from "@/lib/social-providers";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 shrink-0">
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

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="size-4 shrink-0">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

interface SocialAuthProps {
  label?: string;
  defaultProvider?: SocialProvider;
  providers: SocialProviderAvailability;
}

export function GoogleButton({
  label = "Continue with Google",
  providers,
}: Pick<SocialAuthProps, "label" | "providers">) {
  return (
    <SocialAuthButtons
      defaultProvider="google"
      label={label}
      providers={providers}
    />
  );
}

export function GitHubButton({
  label = "Continue with GitHub",
  providers,
}: Pick<SocialAuthProps, "label" | "providers">) {
  return (
    <SocialAuthButtons
      defaultProvider="github"
      label={label}
      providers={providers}
    />
  );
}

export function SocialAuthButtons({
  label,
  defaultProvider = "github",
  providers,
}: SocialAuthProps) {
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(
    null,
  );

  async function handleSocial(provider: SocialProvider) {
    if (!providers[provider]) {
      const providerLabel = provider === "github" ? "GitHub" : "Google";
      toast.info(
        `${providerLabel} sign-in is not configured yet. Use email and password for now.`,
      );
      return;
    }

    setLoadingProvider(provider);
    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/events",
      });

      if (error) {
        toast.error(error.message ?? `${provider} sign-in could not be started.`);
      }
    } catch {
      toast.error(`Unable to connect with ${provider}. Please use email and password.`);
    } finally {
      setLoadingProvider(null);
    }
  }

  if (!providers.github && !providers.google) {
    return null;
  }

  return (
    <div className="grid gap-2">
      {providers.github && (
        <Button
          type="button"
          variant="outline"
          className="w-full bg-background/60 transition-colors hover:bg-muted"
          onClick={() => void handleSocial("github")}
          disabled={loadingProvider !== null}
        >
          {loadingProvider === "github" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <GitHubMark />
          )}
          {label && defaultProvider === "github" ? label : "Continue with GitHub"}
        </Button>
      )}

      {providers.google && (
        <Button
          type="button"
          variant="outline"
          className="w-full bg-background/60 transition-colors hover:bg-muted"
          onClick={() => void handleSocial("google")}
          disabled={loadingProvider !== null}
        >
          {loadingProvider === "google" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <GoogleMark />
          )}
          {label && defaultProvider === "google" ? label : "Continue with Google"}
        </Button>
      )}
    </div>
  );
}

export function AuthDivider() {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-border" />
      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        or continue with email
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
