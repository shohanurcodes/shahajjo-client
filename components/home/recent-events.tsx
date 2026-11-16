"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarX2, RefreshCcw } from "lucide-react";
import { EventCard } from "@/components/event-card";
import { EventGridSkeleton } from "@/components/event-card-skeleton";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import type { EventsResponse } from "@/lib/types";

export function RecentEvents() {
  const [events, setEvents] = useState<EventsResponse["events"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const load = useCallback(() => {
    let active = true;
    setLoading(true);
    setError(null);

    apiFetch<EventsResponse>("/api/events/upcoming?limit=6")
      .then((data) => {
        if (active) setEvents(data.events);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "We could not load upcoming events right now.",
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

  return (
    <section className="section-pad bg-card/35">
      <div className="site-container">
        <SectionHeading
          eyebrow="On the calendar"
          title={
            <>
              Six good reasons to{" "}
              <span className="italic text-primary">leave the house.</span>
            </>
          }
          description="The soonest events created by neighbours, sorted by date. Every one of them is open to you."
          action={{ href: "/events", label: "View all events" }}
        />

        {loading ? (
          <EventGridSkeleton count={6} />
        ) : error ? (
          <div className="surface-card flex flex-col items-center gap-4 px-6 py-14 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-brand-soft text-primary">
              <RefreshCcw className="size-5" />
            </span>
            <div>
              <h3 className="font-heading text-xl font-semibold">
                The calendar is taking a breather
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            </div>
            <Button onClick={() => setAttempt((value) => value + 1)} variant="outline">
              <RefreshCcw />
              Try again
            </Button>
          </div>
        ) : events.length === 0 ? (
          <div className="surface-card flex flex-col items-center gap-4 px-6 py-14 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-brand-soft text-primary">
              <CalendarX2 className="size-5" />
            </span>
            <div>
              <h3 className="font-heading text-xl font-semibold">
                The calendar is wide open
              </h3>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Nobody has posted an upcoming event yet. That is a pretty good
                invitation to start the first one.
              </p>
            </div>
            <Button asChild>
              <a href="/create-event">Create the first event</a>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
