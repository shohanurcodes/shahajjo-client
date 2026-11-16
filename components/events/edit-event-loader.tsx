"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShieldAlert, RefreshCcw } from "lucide-react";
import { EventForm } from "@/components/events/event-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api";
import type { EventItem, EventResponse } from "@/lib/types";

export function EditEventLoader({ eventId }: { eventId: string }) {
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    apiFetch<EventResponse>(`/api/events/${eventId}`)
      .then((data) => {
        if (active) setEvent(data.event);
      })
      .catch((err: unknown) => {
        if (active) {
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
  }, [eventId, attempt]);

  if (loading) {
    return (
      <div className="site-container pb-20 pt-8 md:pt-12">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-6 h-3 w-24" />
        <Skeleton className="mt-4 h-10 w-2/3" />
        <Skeleton className="mt-4 h-4 w-full max-w-xl" />
        <div className="mt-9 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-5 rounded-[1.6rem] border border-border/80 bg-card p-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
            ))}
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
          <Skeleton className="h-56 w-full rounded-[1.4rem]" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="site-container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="display-md">We could not open this event.</h1>
        <p className="lede mt-3 max-w-md">{error}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button variant="outline" onClick={() => setAttempt((value) => value + 1)}>
            <RefreshCcw />
            Try again
          </Button>
          <Button asChild>
            <Link href="/manage-events">Back to my events</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!event.isOwner) {
    return (
      <div className="site-container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-brand-soft text-primary">
          <ShieldAlert className="size-7" />
        </span>
        <h1 className="display-md mt-6">This event is not yours to edit.</h1>
        <p className="lede mt-3 max-w-md">
          Only the neighbour who created an event can change its details. You
          can still view it and join like everyone else.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href={`/events/${event.id}`}>View the event</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/manage-events">Back to my events</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <EventForm mode="edit" eventId={event.id} initial={event} />;
}
