import Link from "next/link";
import { ArrowRight, CalendarDays, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const strip = [
  "Neighbourhood cleanups",
  "Monsoon plantation",
  "Winter clothes drives",
  "Friday food packs",
  "Awareness workshops",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="site-container grid items-center gap-14 pb-16 pt-12 lg:grid-cols-[1.03fr_0.97fr] lg:gap-10 lg:pb-24 lg:pt-16">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--terracotta)] opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-[var(--terracotta)]" />
            </span>
            Community-led · Dhaka, Bangladesh
          </div>

          <h1 className="display-xl mt-6">
            Show up for your{" "}
            <span className="relative inline-block italic text-primary">
              neighbourhood
              <svg
                viewBox="0 0 260 14"
                aria-hidden="true"
                className="absolute -bottom-2 left-0 w-full text-[var(--terracotta)]"
                preserveAspectRatio="none"
              >
                <path
                  d="M3 10C60 4 150 3 257 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            .
          </h1>

          <p className="lede mt-6 max-w-xl">
            Sahajjo brings neighbours together around the work that matters —
            a cleaner lane, a greener corner, a warmer winter for someone down
            the road. Find a drive, bring a friend, or start one of your own.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/events">
                Explore upcoming events
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-card/70">
              <Link href="/create-event">
                <Plus />
                Start an event
              </Link>
            </Button>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <CalendarDays className="size-4 text-primary" />
              Every week, across the city
            </span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span className="flex items-center gap-2">
              <Sparkles className="size-4 text-[var(--terracotta)]" />
              Free to join, open to everyone
            </span>
          </div>
        </div>

        <div className="relative mx-auto mb-10 w-full max-w-[34rem] lg:mb-0 lg:ml-auto">
          <div
            aria-hidden="true"
            className="absolute -right-10 top-8 size-56 rounded-full bg-brand-soft blur-2xl"
          />
          <div
            aria-hidden="true"
            className="absolute -left-6 bottom-14 hidden size-28 rounded-full border-[14px] border-[var(--terracotta)]/15 sm:block"
          />

          <div className="relative rotate-[-2deg] rounded-[2rem] border border-border/80 bg-card p-2 shadow-[0_30px_70px_-40px_rgba(20,45,32,0.55)]">
            {/* Local, curated imagery keeps the banner visually consistent. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gallery/hero-planting.jpg"
              alt="A volunteer planting a sapling during a community plantation drive"
              className="aspect-[4/4.6] w-full rounded-[1.55rem] object-cover"
            />
            <div className="pointer-events-none absolute inset-2 rounded-[1.55rem] bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-7 -left-3 w-44 rotate-[3deg] overflow-hidden rounded-[1.4rem] border-4 border-background shadow-xl sm:-left-8 sm:w-56">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gallery/hero-community.jpg"
              alt="Volunteers gathered together after a community event"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>

          <div className="animate-float-soft absolute -right-2 top-7 w-40 rounded-2xl border border-border/80 bg-card/95 px-4 py-3 shadow-xl backdrop-blur sm:-right-7">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[var(--terracotta)]">
              This weekend
            </p>
            <p className="mt-1 font-heading text-sm font-semibold leading-tight">
              Mirpur clean-up
            </p>
            <p className="mt-0.5 text-[0.68rem] text-muted-foreground">
              Sat · 9:00 AM
            </p>
          </div>

          <div className="absolute -right-1 bottom-20 hidden rotate-[4deg] rounded-full bg-primary px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-primary-foreground shadow-lg sm:block">
            Together is better
          </div>
        </div>
      </div>

      <div className="border-y border-border/70 bg-card/55 backdrop-blur">
        <div className="site-container flex flex-wrap items-center justify-center gap-x-7 gap-y-2 py-4 text-[0.62rem] font-semibold uppercase tracking-[0.19em] text-muted-foreground sm:justify-between">
          {strip.map((item) => (
            <span key={item} className="flex items-center gap-2.5">
              <span className="size-1 rounded-full bg-[var(--terracotta)]" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
