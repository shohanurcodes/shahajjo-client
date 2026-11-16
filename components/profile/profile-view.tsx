"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  CalendarPlus,
  LayoutGrid,
  Loader2,
  Mail,
  Save,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api";
import { authClient, useSession } from "@/lib/auth-client";
import { fallbackAvatar, formatJoinedOn, initials } from "@/lib/format";
import { profileSchema, toFieldErrors } from "@/lib/validators";
import type { ProfileStats, StatsResponse } from "@/lib/types";

const quickLinks = [
  {
    href: "/create-event",
    label: "Create an event",
    description: "Start a new drive in your neighbourhood.",
    icon: CalendarPlus,
  },
  {
    href: "/manage-events",
    label: "Manage my events",
    description: "Edit or close the events you host.",
    icon: LayoutGrid,
  },
  {
    href: "/joined-events",
    label: "Joined events",
    description: "See the days you have already committed to.",
    icon: CalendarDays,
  },
];

export function ProfileView() {
  const { data: session, isPending, refetch } = useSession();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  const user = session?.user;

  useEffect(() => {
    if (!user) return;
    setName(user.name ?? "");
    setImage(user.image ?? "");
  }, [user]);

  useEffect(() => {
    if (!user) return;
    let active = true;

    setStatsError(null);
    apiFetch<StatsResponse>("/api/me/stats")
      .then((data) => {
        if (active) setStats(data.stats);
      })
      .catch((err: unknown) => {
        if (active) {
          setStatsError(
            err instanceof Error ? err.message : "Stats are unavailable right now.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, [user]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});

    const parsed = profileSchema.safeParse({ name, image });
    if (!parsed.success) {
      setFieldErrors(toFieldErrors(parsed.error));
      toast.error("Please check your profile details.");
      return;
    }

    setSaving(true);
    try {
      const nextImage = parsed.data.image.trim() || fallbackAvatar(parsed.data.name);
      const { error } = await authClient.updateUser({
        name: parsed.data.name.trim(),
        image: nextImage,
      });

      if (error) {
        toast.error(error.message ?? "We could not update your profile.");
        return;
      }

      setImage(nextImage);
      await refetch();
      toast.success("Profile updated. Looking good.");
    } catch {
      toast.error("We could not update your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (isPending) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return (
      <div className="site-container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="display-md">Please log in to view your profile.</h1>
        <Button asChild className="mt-7">
          <Link href="/login">Log in</Link>
        </Button>
      </div>
    );
  }

  const displayName = name || user.name || user.email;
  const avatarSrc = image || fallbackAvatar(user.email);

  return (
    <div className="site-container pb-20 pt-10 md:pt-14">
      <header className="max-w-2xl">
        <p className="eyebrow">Your profile</p>
        <h1 className="display-lg mt-4">
          The neighbour behind{" "}
          <span className="italic text-primary">the good work.</span>
        </h1>
        <p className="lede mt-4">
          Update how you appear to other hosts and volunteers. Your email stays
          private and is only used to coordinate events.
        </p>
      </header>

      <div className="mt-9 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="space-y-6">
          <section className="rounded-[1.6rem] border border-border/80 bg-card p-5 shadow-sm sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Avatar className="size-20 border-2 border-background shadow-md">
                <AvatarImage src={imageFailed ? fallbackAvatar(user.email) : avatarSrc} alt="" />
                <AvatarFallback className="bg-brand-soft font-heading text-xl font-semibold text-primary">
                  {initials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h2 className="font-heading text-2xl font-semibold">
                  {displayName}
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail className="size-3.5" />
                  {user.email}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="size-3.5 text-primary" />
                  Signed in with {user.email.includes("@") ? "email" : "an account"}
                  {user.createdAt
                    ? ` · Member since ${formatJoinedOn(String(user.createdAt))}`
                    : ""}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="profile-name">Display name</Label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="profile-name"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      setFieldErrors((current) => {
                        if (!current.name) return current;
                        const next = { ...current };
                        delete next.name;
                        return next;
                      });
                    }}
                    placeholder="Your name"
                    maxLength={60}
                    aria-invalid={Boolean(fieldErrors.name)}
                    className="h-11 rounded-xl bg-background/60 pl-9"
                  />
                </div>
                {fieldErrors.name && (
                  <p className="text-xs font-medium text-destructive">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="profile-image">
                  Photo URL{" "}
                  <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="profile-image"
                  type="url"
                  value={image}
                  onChange={(event) => {
                    setImage(event.target.value);
                    setImageFailed(false);
                    setFieldErrors((current) => {
                      if (!current.image) return current;
                      const next = { ...current };
                      delete next.image;
                      return next;
                    });
                  }}
                  placeholder="https://example.com/your-photo.jpg"
                  aria-invalid={Boolean(fieldErrors.image)}
                  className="h-11 rounded-xl bg-background/60"
                />
                {fieldErrors.image ? (
                  <p className="text-xs font-medium text-destructive">
                    {fieldErrors.image}
                  </p>
                ) : (
                  <p className="text-[0.7rem] text-muted-foreground">
                    Leave it blank to keep a friendly generated avatar.
                  </p>
                )}
                {image && imageFailed && (
                  <p className="text-xs text-[var(--terracotta)]">
                    That preview failed to load. The link may not be a direct
                    image.
                  </p>
                )}
                {image && (
                  <div className="mt-2 flex items-center gap-3 rounded-xl border border-border/70 bg-background/50 p-3">
                    {/* Preview must accept any image host the user pastes. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt="Profile preview"
                      className="size-12 rounded-full object-cover"
                      onError={() => setImageFailed(true)}
                    />
                    <p className="text-xs text-muted-foreground">
                      This is how you will appear on events you host or join.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end border-t border-border/70 pt-5">
                <Button type="submit" size="lg" disabled={saving}>
                  {saving ? <Loader2 className="animate-spin" /> : <Save />}
                  {saving ? "Saving..." : "Save profile"}
                </Button>
              </div>
            </form>
          </section>

          <section className="grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "Events created",
                value: stats?.eventsCreated,
                icon: LayoutGrid,
              },
              {
                label: "Events joined",
                value: stats?.eventsJoined,
                icon: UsersRound,
              },
              {
                label: "Upcoming joined",
                value: stats?.upcomingJoined,
                icon: CalendarDays,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.4rem] border border-border/80 bg-card p-5"
              >
                <span className="grid size-9 place-items-center rounded-full bg-brand-soft text-primary">
                  <stat.icon className="size-4" />
                </span>
                <p className="mt-3 font-heading text-2xl font-semibold leading-none">
                  {statsError ? "—" : (stat.value ?? "…")}
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </section>
          {statsError && (
            <p className="text-xs text-muted-foreground">{statsError}</p>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-[1.4rem] border border-border/80 bg-card p-5">
            <p className="flex items-center gap-2 font-heading text-base font-semibold">
              <Sparkles className="size-4 text-[var(--terracotta)]" />
              Where to next
            </p>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted"
                  >
                    <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft text-primary">
                      <link.icon className="size-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold group-hover:text-primary">
                        {link.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {link.description}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.4rem] border border-[var(--terracotta)]/20 bg-[var(--terracotta)]/8 p-5">
            <p className="font-heading text-base font-semibold">
              A small note on privacy
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Your email is never shown on the public event board. Hosts see the
              names of people who join, so they know who to expect.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="site-container pb-20 pt-10 md:pt-14">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-4 h-10 w-2/3 max-w-xl" />
      <Skeleton className="mt-4 h-4 w-full max-w-lg" />
      <div className="mt-9 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="rounded-[1.6rem] border border-border/80 bg-card p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="size-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="h-4 w-52" />
            </div>
          </div>
          <div className="mt-7 space-y-5">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
            ))}
            <Skeleton className="ml-auto h-12 w-36 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-64 w-full rounded-[1.4rem]" />
      </div>
    </div>
  );
}
