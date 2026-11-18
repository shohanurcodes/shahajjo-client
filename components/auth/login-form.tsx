"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { AuthDivider, GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clearTokenCache } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { SocialProviderAvailability } from "@/lib/social-providers";
import { loginSchema, toFieldErrors } from "@/lib/validators";

export function LoginForm({
  providers,
}: {
  providers: SocialProviderAvailability;
}) {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function update(field: "email" | "password", value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setFormError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = loginSchema.safeParse(form);
    if (!parsed.success) {
      const fieldIssues = toFieldErrors(parsed.error);
      setFieldErrors(fieldIssues);
      const firstErrorMessage =
        fieldIssues.email ||
        fieldIssues.password ||
        "Please check your email and password.";
      toast.error(firstErrorMessage);
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await authClient.signIn.email({
        email: parsed.data.email.trim(),
        password: parsed.data.password,
        rememberMe: true,
      });

      if (error) {
        const message =
          error.message ?? "Those details did not match an account. Please try again.";
        setFormError(message);
        toast.error(message);
        return;
      }

      clearTokenCache();
      toast.success("Welcome back. Your next event is waiting.");
      router.push("/events");
      router.refresh();
    } catch {
      setFormError("We could not sign you in right now. Please try again.");
      toast.error("Sign-in failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {(providers.github || providers.google) && (
        <div className="space-y-3">
          <GoogleButton label="Continue with Google" providers={providers} />
          <AuthDivider />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {formError && (
          <div
            role="alert"
            className="rounded-xl border border-destructive/25 bg-destructive/8 px-3.5 py-2.5 text-xs font-medium text-destructive"
          >
            {formError}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="login-email">Email address</Label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            className="h-11 rounded-xl bg-background/60"
          />
          {fieldErrors.email && (
            <p className="text-xs font-medium text-destructive">{fieldErrors.email}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="login-password">Password</Label>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Your password"
              value={form.password}
              onChange={(event) => update("password", event.target.value)}
              aria-invalid={Boolean(fieldErrors.password)}
              className="h-11 rounded-xl bg-background/60 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="text-xs font-medium text-destructive">{fieldErrors.password}</p>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? <Loader2 className="animate-spin" /> : <LogIn />}
          {submitting ? "Signing you in..." : "Log in to Sahajjo"}
        </Button>
      </form>

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        New to the neighbourhood?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
