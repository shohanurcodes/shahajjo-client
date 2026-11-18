"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Check, Eye, EyeOff, Loader2, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { AuthDivider, GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clearTokenCache } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { fallbackAvatar } from "@/lib/format";
import { registerSchema, toFieldErrors } from "@/lib/validators";
import { cn } from "@/lib/utils";

const passwordRules = [
  { key: "length", label: "At least 6 characters", test: (value: string) => value.length >= 6 },
  { key: "upper", label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { key: "lower", label: "One lowercase letter", test: (value: string) => /[a-z]/.test(value) },
];

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const checks = useMemo(
    () => passwordRules.map((rule) => ({ ...rule, passed: rule.test(form.password) })),
    [form.password],
  );

  function update(field: keyof typeof form, value: string) {
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

    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      const fieldIssues = toFieldErrors(parsed.error);
      setFieldErrors(fieldIssues);
      const firstErrorMessage =
        fieldIssues.password ||
        fieldIssues.name ||
        fieldIssues.email ||
        fieldIssues.photoURL ||
        "Please fix the highlighted fields before continuing.";
      toast.error(firstErrorMessage);
      return;
    }

    setSubmitting(true);
    try {
      const email = parsed.data.email.trim().toLowerCase();
      const image = parsed.data.photoURL.trim() || fallbackAvatar(email);

      const { error } = await authClient.signUp.email({
        name: parsed.data.name.trim(),
        email,
        password: parsed.data.password,
        image,
      });

      if (error) {
        const message =
          error.message ?? "We could not create your account. Please try again.";
        setFormError(message);
        toast.error(message);
        return;
      }

      clearTokenCache();
      toast.success(`Welcome to Sahajjo, ${parsed.data.name.split(" ")[0]}!`);
      router.push("/events");
      router.refresh();
    } catch {
      setFormError("We could not create your account right now. Please try again.");
      toast.error("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <GoogleButton label="Sign up with Google" />
        <AuthDivider />
      </div>

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
          <Label htmlFor="register-name">Full name</Label>
          <Input
            id="register-name"
            autoComplete="name"
            placeholder="Ayesha Rahman"
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(fieldErrors.name)}
            className="h-11 rounded-xl bg-background/60"
          />
          {fieldErrors.name && (
            <p className="text-xs font-medium text-destructive">{fieldErrors.name}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="register-email">Email address</Label>
          <Input
            id="register-email"
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
          <Label htmlFor="register-photo">
            Photo URL <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <div className="flex items-center gap-2">
            <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-muted">
              {form.photoURL ? (
                // The preview must accept any image host the user pastes.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.photoURL}
                  alt="Profile preview"
                  className="size-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span className="text-[0.6rem] font-semibold uppercase tracking-wide text-muted-foreground">
                  You
                </span>
              )}
            </span>
            <Input
              id="register-photo"
              type="url"
              autoComplete="photo"
              placeholder="https://example.com/your-photo.jpg"
              value={form.photoURL}
              onChange={(event) => update("photoURL", event.target.value)}
              aria-invalid={Boolean(fieldErrors.photoURL)}
              className="h-11 rounded-xl bg-background/60"
            />
          </div>
          {fieldErrors.photoURL ? (
            <p className="text-xs font-medium text-destructive">{fieldErrors.photoURL}</p>
          ) : (
            <p className="text-[0.7rem] text-muted-foreground">
              Leave it blank and we&apos;ll generate a friendly avatar for you.
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="register-password">Password</Label>
          <div className="relative">
            <Input
              id="register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
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

          <ul className="mt-2 grid gap-1.5 sm:grid-cols-3">
            {checks.map((rule) => (
              <li
                key={rule.key}
                className={cn(
                  "flex items-center gap-1.5 text-[0.68rem] font-medium transition-colors",
                  rule.passed ? "text-primary" : "text-muted-foreground",
                )}
              >
                {rule.passed ? (
                  <Check className="size-3.5 shrink-0" />
                ) : (
                  <X className="size-3.5 shrink-0 opacity-50" />
                )}
                {rule.label}
              </li>
            ))}
          </ul>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? <Loader2 className="animate-spin" /> : <UserPlus />}
          {submitting ? "Creating your account..." : "Create my account"}
        </Button>

        <p className="text-center text-[0.68rem] leading-relaxed text-muted-foreground">
          By joining you agree to show up with kindness. We keep your details
          private and only use them to organise events.
        </p>
      </form>

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        Already part of the community?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Log in instead
        </Link>
      </p>
    </div>
  );
}
