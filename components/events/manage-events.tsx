"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CalendarPlus,
  ExternalLink,
  LayoutGrid,
  Loader2,
  MapPin,
  Pencil,
  RefreshCcw,
  Trash2,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api";
import { eventTypeTone, formatEventDate, isPastEvent } from "@/lib/format";
import type { EventItem, EventsResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ManageEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [pendingDelete, setPendingDelete] = useState<EventItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    let active = true;
    setLoading(true);
    setError(null);

    apiFetch<EventsResponse>("/api/events/mine")
      .then((data) => {
        if (active) setEvents(data.events);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "We could not load the events you host.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => load(), [load, attempt]);

  const summary = useMemo(() => {
    const upcoming = events.filter((event) => !isPastEvent(event.date)).length;
    const attendees = events.reduce(
      (total, event) => total + event.attendeeCount,
      0,
    );
    return { total: events.length, upcoming, attendees };
  }, [events]);

  async function handleDelete() {
    if (!pendingDelete) return;
    setDeleting(true);

    try {
      await apiFetch<{ message: string }>(`/api/events/${pendingDelete.id}`, {
        method: "DELETE",
      });
      setEvents((current) =>
        current.filter((event) => event.id !== pendingDelete.id),
      );
      toast.success("Event deleted. Attendees have been removed from the list.");
      setPendingDelete(null);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "We could not delete this event.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="site-container pb-20 pt-10 md:pt-14">
      <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">Host dashboard</p>
          <h1 className="display-lg mt-4">
            Your events,{" "}
            <span className="italic text-primary">in one place.</span>
          </h1>
          <p className="lede mt-4">
            Update the details, check who is coming, or close an event that is
            no longer going ahead. Only you can change what is here.
          </p>
        </div>
        <Button asChild size="lg" className="shrink-0">
          <Link href="/create-event">
            <CalendarPlus />
            Create event
          </Link>
        </Button>
      </header>

      {!loading && !error && events.length > 0 && (
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Events you host", value: summary.total, icon: LayoutGrid },
            {
              label: "Still upcoming",
              value: summary.upcoming,
              icon: CalendarDays,
            },
            {
              label: "Total attendees",
              value: summary.attendees,
              icon: UsersRound,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card px-4 py-3.5"
            >
              <span className="grid size-10 place-items-center rounded-full bg-brand-soft text-primary">
                <stat.icon className="size-4" />
              </span>
              <div>
                <p className="font-heading text-xl font-semibold leading-none">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-7">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-[1.4rem] border border-border/80 bg-card p-4"
              >
                <Skeleton className="size-20 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-3.5 w-1/2" />
                  <Skeleton className="h-3.5 w-1/3" />
                </div>
                <Skeleton className="hidden h-9 w-24 rounded-full sm:block" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="surface-card flex flex-col items-center gap-4 px-6 py-16 text-center">
            <div>
              <h2 className="font-heading text-xl font-semibold">
                Your events did not load
              </h2>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                {error}
              </p>
            </div>
            <Button variant="outline" onClick={() => setAttempt((value) => value + 1)}>
              <RefreshCcw />
              Try again
            </Button>
          </div>
        ) : events.length === 0 ? (
          <div className="surface-card flex flex-col items-center gap-4 px-6 py-16 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-brand-soft text-primary">
              <CalendarPlus className="size-6" />
            </span>
            <div>
              <h2 className="font-heading text-xl font-semibold">
                You have not hosted an event yet
              </h2>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Pick a lane that needs cleaning, a corner that needs trees, or a
                family that needs warm clothes. Post it and see who shows up.
              </p>
            </div>
            <Button asChild>
              <Link href="/create-event">Create your first event</Link>
            </Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {events.map((event) => {
              const past = isPastEvent(event.date);
              return (
                <li
                  key={event.id}
                  className="flex flex-col gap-4 rounded-[1.4rem] border border-border/80 bg-card p-4 sm:flex-row sm:items-center"
                >
                  <Link
                    href={`/events/${event.id}`}
                    className="relative block h-40 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:size-24"
                  >
                    {/* Hosts can paste any image URL, so a plain img is used. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={event.thumbnail}
                      alt=""
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        className={cn(
                          "border-0 px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em]",
                          eventTypeTone(event.eventType),
                        )}
                      >
                        {event.eventType}
                      </Badge>
                      {past ? (
                        <Badge
                          variant="outline"
                          className="border-border text-[0.62rem] uppercase tracking-[0.1em] text-muted-foreground"
                        >
                          Completed
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-primary/30 text-[0.62rem] uppercase tracking-[0.1em] text-primary"
                        >
                          Upcoming
                        </Badge>
                      )}
                    </div>

                    <Link href={`/events/${event.id}`} className="mt-1.5 block">
                      <h2 className="line-clamp-1 font-heading text-lg font-semibold hover:text-primary">
                        {event.title}
                      </h2>
                    </Link>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="size-3.5 text-[var(--terracotta)]" />
                        {formatEventDate(event.date)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-primary/70" />
                        <span className="line-clamp-1">{event.location}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <UsersRound className="size-3.5" />
                        {event.attendeeCount}{" "}
                        {event.attendeeCount === 1 ? "attendee" : "attendees"}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/events/${event.id}`}>
                        <ExternalLink />
                        View
                      </Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href={`/manage-events/${event.id}/edit`}>
                        <Pencil />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setPendingDelete(event)}
                    >
                      <Trash2 />
                      Delete
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open && !deleting) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this event?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{pendingDelete?.title}&rdquo; will be removed from the
              event board, and everyone who joined will lose their spot. This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Keep event</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
              disabled={deleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Trash2 />
              )}
              {deleting ? "Deleting..." : "Delete event"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
