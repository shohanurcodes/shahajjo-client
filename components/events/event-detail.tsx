"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock,
  Loader2,
  MapPin,
  Pencil,
  RefreshCcw,
  Share2,
  UserRound,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import {
  eventTypeTone,
  fallbackAvatar,
  formatEventDateLong,
  initials,
  isPastEvent,
} from "@/lib/format";
import type { EventItem, EventResponse, JoinResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

export function EventDetail({ eventId }: { eventId: string }) {
  const { data: session, isPending } = useSession();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [joining, setJoining] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const signedIn = Boolean(session);

  const load = useCallback(() => {
    let active = true;
    setError(null);
    setNotFound(false);

    apiFetch<EventResponse>(`/api/events/${eventId}`, {
      auth: signedIn ? "required" : "none",
    })
      .then((data) => {
        if (active) setEvent(data.event);
      })
      .catch((err: unknown) => {
        if (!active) return;
        if (err instanceof Error && "status" in err && err.status === 404) {
          setNotFound(true);
        } else {
          setError(
            err instanceof Error ? err.message : "We could not load this event.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [eventId, signedIn]);

  // Re-run once the client session resolves so isOwner / isJoined are accurate.
  useEffect(() => load(), [load, attempt, session?.user?.id]);

  async function handleJoin() {
    if (!event) return;
    setJoining(true);
    try {
      const result = await apiFetch<JoinResponse>(`/api/events/${event.id}/join`, {
        method: "POST",
      });
      setEvent((current) =>
        current
          ? {
              ...current,
              isJoined: true,
              attendeeCount: result.attendeeCount ?? current.attendeeCount + 1,
            }
          : current,
      );
      toast.success(result.message ?? "You are on the list. See you there!");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "We could not save your spot.",
      );
    } finally {
      setJoining(false);
    }
  }

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Event link copied. Share it with a friend.");
    } catch {
      toast.error("Your browser blocked the clipboard. Copy the URL manually.");
    }
  }

  if (loading) {
    return <EventDetailSkeleton />;
  }

  if (notFound) {
    return (
      <div className="site-container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-brand-soft text-primary">
          <CalendarDays className="size-7" />
        </span>
        <h1 className="display-md mt-6">This event is no longer here.</h1>
        <p className="lede mt-3 max-w-md">
          It may have been removed by its host, or the link was mistyped. The
          event board is still full of good work.
        </p>
        <Button asChild className="mt-7">
          <Link href="/events">Browse upcoming events</Link>
        </Button>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="site-container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="display-md">We could not load this event.</h1>
        <p className="lede mt-3 max-w-md">{error}</p>
        <Button
          variant="outline"
          className="mt-7"
          onClick={() => setAttempt((value) => value + 1)}
        >
          <RefreshCcw />
          Try again
        </Button>
      </div>
    );
  }

  const past = isPastEvent(event.date);
  const isOwner = event.isOwner;
  const isJoined = event.isJoined;

  return (
    <div className="site-container pb-20 pt-8 md:pt-10">
      <Link
        href="/events"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to all events
      </Link>

      <div className="mt-5 grid gap-7 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <article className="min-w-0">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[1.75rem] border border-border/80 bg-muted">
            {imageFailed ? (
              <div className="paper-grid flex size-full items-center justify-center bg-brand-soft">
                <span className="font-heading text-3xl text-primary/70">
                  {event.eventType}
                </span>
              </div>
            ) : (
              // Hosts can paste images from any host, so a plain img is used.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.thumbnail}
                alt={`${event.title} event`}
                onError={() => setImageFailed(true)}
                className="size-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0" />

            <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center gap-2">
              <Badge
                className={cn(
                  "border-0 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] backdrop-blur",
                  eventTypeTone(event.eventType),
                )}
              >
                {event.eventType}
              </Badge>
              {past && (
                <Badge className="border-0 bg-background/90 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground backdrop-blur">
                  Completed
                </Badge>
              )}
              {isOwner && (
                <Badge className="border-0 bg-primary px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-primary-foreground">
                  You are hosting
                </Badge>
              )}
            </div>
          </div>

          <div className="mt-7">
            <p className="text-sm font-medium text-muted-foreground">
              Hosted by {event.createdByName}
            </p>
            <h1 className="display-lg mt-2">{event.title}</h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <span className="inline-flex items-center gap-2 text-foreground">
                <span className="grid size-9 place-items-center rounded-full bg-brand-soft text-primary">
                  <CalendarDays className="size-4" />
                </span>
                {formatEventDateLong(event.date)}
              </span>
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <span className="grid size-9 place-items-center rounded-full bg-muted">
                  <MapPin className="size-4 text-primary/80" />
                </span>
                {event.location}
              </span>
            </div>

            <div className="mt-8 border-t border-border/70 pt-6">
              <h2 className="font-heading text-xl font-semibold">
                About this event
              </h2>
              <p className="mt-3 whitespace-pre-line text-[0.95rem] leading-relaxed text-muted-foreground">
                {event.description}
              </p>
            </div>

            <div className="mt-8 rounded-[1.4rem] border border-border/80 bg-card p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 font-heading text-lg font-semibold">
                  <UsersRound className="size-4 text-[var(--terracotta)]" />
                  Who is coming
                </h2>
                <span className="text-xs font-semibold text-muted-foreground">
                  {event.attendeeCount}{" "}
                  {event.attendeeCount === 1 ? "neighbour" : "neighbours"}
                </span>
              </div>

              {event.attendeeCount === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  No one has joined yet. You could be the first name on the list.
                </p>
              ) : (
                <ul className="mt-4 flex flex-wrap gap-3">
                  {event.attendees.map((attendee, index) => (
                    <li
                      key={`${attendee.name}-${index}`}
                      className="flex items-center gap-2 rounded-full border border-border/70 bg-background/60 py-1.5 pl-1.5 pr-3"
                    >
                      <Avatar className="size-7">
                        <AvatarImage src={attendee.image} alt="" />
                        <AvatarFallback className="bg-brand-soft text-[0.6rem] font-semibold text-primary">
                          {initials(attendee.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">{attendee.name}</span>
                    </li>
                  ))}
                  {event.attendeeCount > event.attendees.length && (
                    <li className="flex items-center rounded-full border border-dashed border-border px-3 text-xs font-medium text-muted-foreground">
                      +{event.attendeeCount - event.attendees.length} more
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </article>

        <aside className="lg:sticky lg:top-24">
          <div className="rounded-[1.6rem] border border-border/80 bg-card p-5 shadow-[0_20px_50px_-40px_rgba(20,50,35,0.6)]">
            <div className="flex items-center gap-3">
              <div className="flex w-14 flex-col items-center rounded-xl bg-brand-soft px-2 py-2 text-primary">
                <span className="text-[0.6rem] font-bold uppercase tracking-[0.14em]">
                  {new Intl.DateTimeFormat("en-GB", { month: "short" }).format(
                    new Date(event.date),
                  )}
                </span>
                <span className="font-heading text-2xl font-semibold leading-none">
                  {new Intl.DateTimeFormat("en-GB", { day: "numeric" }).format(
                    new Date(event.date),
                  )}
                </span>
              </div>
              <div>
                <p className="font-heading text-base font-semibold">
                  {new Intl.DateTimeFormat("en-GB", {
                    weekday: "long",
                  }).format(new Date(event.date))}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  Date announced by the host
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2.5 border-t border-border/70 pt-4 text-sm">
              <p className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary/80" />
                {event.location}
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <UserRound className="size-4 shrink-0 text-primary/80" />
                Hosted by {event.createdByName}
              </p>
            </div>

            <div className="mt-5 space-y-2.5">
              {isOwner ? (
                <>
                  <Button asChild size="lg" className="w-full">
                    <Link href={`/manage-events/${event.id}/edit`}>
                      <Pencil />
                      Edit your event
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="w-full">
                    <Link href="/manage-events">Manage all my events</Link>
                  </Button>
                </>
              ) : isJoined ? (
                <>
                  <Button size="lg" className="w-full" disabled>
                    <Check />
                    You are joining this event
                  </Button>
                  <Button asChild size="lg" variant="outline" className="w-full">
                    <Link href="/joined-events">See my joined events</Link>
                  </Button>
                </>
              ) : past ? (
                <Button size="lg" className="w-full" disabled>
                  This event has already taken place
                </Button>
              ) : isPending ? (
                <Button size="lg" className="w-full" disabled>
                  <Loader2 className="animate-spin" />
                  Checking your session...
                </Button>
              ) : session ? (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => void handleJoin()}
                  disabled={joining}
                >
                  {joining ? <Loader2 className="animate-spin" /> : <UsersRound />}
                  {joining ? "Saving your spot..." : "Join this event"}
                </Button>
              ) : (
                <Button asChild size="lg" className="w-full">
                  <Link href="/login">Log in to join</Link>
                </Button>
              )}

              <Button
                size="lg"
                variant="ghost"
                className="w-full"
                onClick={() => void handleShare()}
              >
                <Share2 />
                Share this event
              </Button>
            </div>

            <p className="mt-4 text-center text-[0.68rem] leading-relaxed text-muted-foreground">
              Joining is free. All we ask is that you show up with kindness and
              tell the host if your plans change.
            </p>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-[1.4rem] border border-border/80 bg-card/60 p-4">
            <Avatar className="size-10 border border-border">
              <AvatarImage
                src={event.attendees[0]?.image || fallbackAvatar(event.createdByEmail)}
                alt=""
              />
              <AvatarFallback className="bg-brand-soft text-xs font-semibold text-primary">
                {initials(event.createdByName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {event.createdByName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {isOwner ? "This is your event" : "Event host"}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function EventDetailSkeleton() {
  return (
    <div className="site-container pb-20 pt-8 md:pt-10">
      <Skeleton className="h-4 w-36" />
      <div className="mt-5 grid gap-7 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          <Skeleton className="aspect-[16/9] w-full rounded-[1.75rem]" />
          <Skeleton className="mt-7 h-3.5 w-40" />
          <Skeleton className="mt-3 h-10 w-4/5" />
          <div className="mt-5 flex gap-5">
            <Skeleton className="h-9 w-48 rounded-full" />
            <Skeleton className="h-9 w-40 rounded-full" />
          </div>
          <div className="mt-8 space-y-3 border-t border-border/70 pt-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        <div className="rounded-[1.6rem] border border-border/80 bg-card p-5">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="mt-5 h-4 w-full" />
          <Skeleton className="mt-3 h-4 w-2/3" />
          <Skeleton className="mt-6 h-12 w-full rounded-full" />
          <Skeleton className="mt-2.5 h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
