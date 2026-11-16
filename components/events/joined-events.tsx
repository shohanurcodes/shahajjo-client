"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarCheck2, Compass, RefreshCcw } from "lucide-react";
import { EventCard } from "@/components/event-card";
import { EventGridSkeleton } from "@/components/event-card-skeleton";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { isPastEvent } from "@/lib/format";
import type { EventsResponse } from "@/lib/types";

export function JoinedEvents() {
  const [events, setEvents] = useState<EventsResponse["events"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const load = useCallback(() => {
    let active = true;
    setLoading(true);
    setError(null);

    apiFetch<EventsResponse>("/api/joined-events")
      .then((data) => {
        if (active) setEvents(data.events);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "We could not load the events you joined.",
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

  const { upcoming, past } = useMemo(() => {
    return {
      upcoming: events.filter((event) => !isPastEvent(event.date)),
      past: events.filter((event) => isPastEvent(event.date)).reverse(),
    };
  }, [events]);

  return (
    <div className="site-container pb-20 pt-10 md:pt-14">
      <header className="max-w-2xl">
        <p className="eyebrow">Your calendar</p>
        <h1 className="display-lg mt-4">
          The days you said{" "}
          <span className="italic text-primary">yes to.</span>
        </h1>
        <p className="lede mt-4">
          Everything you have joined, sorted by event date. Upcoming plans first
          — because those still need your hands.
        </p>
      </header>

      <div className="mt-7">
        {loading ? (
          <EventGridSkeleton count={3} />
        ) : error ? (
          <div className="surface-card flex flex-col items-center gap-4 px-6 py-16 text-center">
            <div>
              <h2 className="font-heading text-xl font-semibold">
                Your calendar did not load
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
              <CalendarCheck2 className="size-6" />
            </span>
            <div>
              <h2 className="font-heading text-xl font-semibold">
                No events on your calendar yet
              </h2>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Find a cleanup, a plantation drive or a food pack morning that
                fits your week. One tap and you are in.
              </p>
            </div>
            <Button asChild>
              <Link href="/events">
                <Compass />
                Browse upcoming events
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-12">
            <section>
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="font-heading text-xl font-semibold">
                  Upcoming
                  <span className="ml-2 rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {upcoming.length}
                  </span>
                </h2>
                <Link
                  href="/events"
                  className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Find more events
                </Link>
              </div>

              {upcoming.length === 0 ? (
                <div className="rounded-[1.4rem] border border-dashed border-border bg-card/50 px-5 py-10 text-center">
                  <p className="text-sm text-muted-foreground">
                    Nothing upcoming right now.{" "}
                    <Link
                      href="/events"
                      className="font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      The board has open spots.
                    </Link>
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {upcoming.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </section>

            {past.length > 0 && (
              <section>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h2 className="font-heading text-xl font-semibold">
                    Already happened
                    <span className="ml-2 rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                      {past.length}
                    </span>
                  </h2>
                </div>
                <div className="grid gap-6 opacity-80 sm:grid-cols-2 lg:grid-cols-3">
                  {past.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
