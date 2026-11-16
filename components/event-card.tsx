"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, CalendarDays, MapPin, UsersRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { dayLabel, eventTypeTone, initials, isPastEvent, monthLabel } from "@/lib/format";
import type { EventItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function EventCard({
  event,
  className,
}: {
  event: EventItem;
  className?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const past = isPastEvent(event.date);

  return (
    <article
      className={cn(
        "card-lift group flex h-full flex-col overflow-hidden rounded-[1.65rem] border border-border/80 bg-card",
        className,
      )}
    >
      <Link href={`/events/${event.id}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {imageFailed ? (
            <div className="paper-grid flex size-full items-center justify-center bg-brand-soft">
              <span className="font-heading text-2xl text-primary/70">{event.eventType}</span>
            </div>
          ) : (
            // User-provided URLs can come from any host, so a plain img keeps it flexible.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.thumbnail}
              alt={`${event.title} event`}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />

          <Badge
            className={cn(
              "absolute left-3 top-3 border-0 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] backdrop-blur",
              eventTypeTone(event.eventType),
            )}
          >
            {event.eventType}
          </Badge>

          <div className="absolute right-3 top-3 flex w-12 flex-col items-center rounded-xl bg-background/95 px-2 py-1.5 shadow-sm backdrop-blur">
            <span className="font-heading text-lg font-semibold leading-none text-foreground">
              {dayLabel(event.date)}
            </span>
            <span className="mt-1 text-[0.58rem] font-bold tracking-[0.12em] text-[var(--terracotta)]">
              {monthLabel(event.date)}
            </span>
          </div>

          {past && (
            <span className="absolute bottom-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground backdrop-blur">
              Completed
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <CalendarDays className="size-3.5 text-[var(--terracotta)]" />
          {new Intl.DateTimeFormat("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          }).format(new Date(event.date))}
        </div>

        <Link href={`/events/${event.id}`} className="mt-2 block">
          <h3 className="line-clamp-2 min-h-[3.1rem] font-heading text-[1.25rem] font-semibold leading-snug transition-colors group-hover:text-primary">
            {event.title}
          </h3>
        </Link>

        <p className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 size-4 shrink-0 text-primary/70" />
          <span className="line-clamp-1">{event.location}</span>
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-4">
          <div className="flex items-center gap-2">
            {event.attendeeCount > 0 ? (
              <>
                <div className="flex -space-x-2">
                  {event.attendees.slice(0, 3).map((attendee, index) => (
                    <Avatar
                      key={`${attendee.name}-${index}`}
                      className="size-6 border-2 border-card"
                    >
                      <AvatarImage
                        src={attendee.image}
                        alt=""
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-brand-soft text-[0.55rem] font-semibold text-primary">
                        {initials(attendee.name)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <UsersRound className="size-3.5" />
                  {event.attendeeCount}
                </span>
              </>
            ) : (
              <span className="text-xs text-muted-foreground">Be the first to join</span>
            )}
          </div>

          <Link
            href={`/events/${event.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-[var(--terracotta)]"
          >
            View event
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
