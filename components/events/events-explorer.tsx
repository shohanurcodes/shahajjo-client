"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarX2, Loader2, RefreshCcw, Search, SlidersHorizontal } from "lucide-react";
import { EventCard } from "@/components/event-card";
import { EventGridSkeleton } from "@/components/event-card-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiFetch } from "@/lib/api";
import { EVENT_TYPES, type EventsResponse, type EventType } from "@/lib/types";
import { cn } from "@/lib/utils";

type TypeFilter = EventType | "all";

export function EventsExplorer() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [type, setType] = useState<TypeFilter>("all");
  const [events, setEvents] = useState<EventsResponse["events"]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("q", debouncedSearch);
    if (type !== "all") params.set("type", type);
    const value = params.toString();
    return value ? `?${value}` : "";
  }, [debouncedSearch, type]);

  useEffect(() => {
    let active = true;
    const firstLoad = events.length === 0;

    setError(null);
    if (firstLoad) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    apiFetch<EventsResponse>(`/api/events/upcoming${queryString}`)
      .then((data) => {
        if (active) setEvents(data.events);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "We could not load the event board right now.",
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
          setRefreshing(false);
        }
      });

    return () => {
      active = false;
    };
    // `events.length` is only read to decide skeleton vs. inline refresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString, attempt]);

  const hasFilters = debouncedSearch.length > 0 || type !== "all";

  function resetFilters() {
    setSearch("");
    setType("all");
  }

  return (
    <div className="site-container pb-20 pt-10 md:pt-14">
      <header className="max-w-3xl">
        <p className="eyebrow">Event board</p>
        <h1 className="display-lg mt-4">
          Find your next{" "}
          <span className="italic text-primary">good Saturday.</span>
        </h1>
        <p className="lede mt-4">
          Every event here was posted by a neighbour. Clean a lane, plant a
          tree, pack a food box — pick the one that fits your week and we will
          save you a spot.
        </p>
      </header>

      <div className="mt-9 rounded-[1.5rem] border border-border/80 bg-card/80 p-4 shadow-sm backdrop-blur sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, place or type..."
              aria-label="Search events"
              className="h-11 rounded-full border-border/80 bg-background/70 pl-11 pr-10"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                ×
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={type}
              onValueChange={(value) => setType(value as TypeFilter)}
            >
              <SelectTrigger
                aria-label="Filter by event type"
                className="h-11 w-full min-w-[11.5rem] rounded-full border-border/80 bg-background/70 px-4"
              >
                <SlidersHorizontal className="size-4 text-muted-foreground" />
                <SelectValue placeholder="All event types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All event types</SelectItem>
                {EVENT_TYPES.map((eventType) => (
                  <SelectItem key={eventType} value={eventType}>
                    {eventType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setType("all")}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
              type === "all"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/80 bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            All
          </button>
          {EVENT_TYPES.map((eventType) => (
            <button
              key={eventType}
              type="button"
              onClick={() => setType(eventType)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                type === eventType
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/80 bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {eventType}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {loading
            ? "Looking for events..."
            : `${events.length} ${events.length === 1 ? "event" : "events"} ${
                hasFilters ? "matching your filters" : "coming up"
              }`}
        </p>
        {refreshing && (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" />
            Updating
          </span>
        )}
        {hasFilters && !loading && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Clear filters
          </Button>
        )}
      </div>

      <div className="mt-5">
        {loading ? (
          <EventGridSkeleton count={6} />
        ) : error ? (
          <div className="surface-card flex flex-col items-center gap-4 px-6 py-16 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-brand-soft text-primary">
              <RefreshCcw className="size-5" />
            </span>
            <div>
              <h2 className="font-heading text-xl font-semibold">
                The board did not load
              </h2>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">{error}</p>
            </div>
            <Button variant="outline" onClick={() => setAttempt((value) => value + 1)}>
              <RefreshCcw />
              Try again
            </Button>
          </div>
        ) : events.length === 0 ? (
          <div className="surface-card flex flex-col items-center gap-4 px-6 py-16 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-brand-soft text-primary">
              <CalendarX2 className="size-5" />
            </span>
            <div>
              <h2 className="font-heading text-xl font-semibold">
                Nothing matches yet
              </h2>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                {hasFilters
                  ? "Try a different search or event type — or be the one who starts this kind of event."
                  : "No upcoming events have been posted yet. That is your cue to start the first one."}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {hasFilters && (
                <Button variant="outline" onClick={resetFilters}>
                  Clear filters
                </Button>
              )}
              <Button asChild>
                <a href="/create-event">Create an event</a>
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "grid gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3",
              refreshing && "opacity-60",
            )}
          >
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
