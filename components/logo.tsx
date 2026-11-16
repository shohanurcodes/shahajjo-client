import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Sahajjo home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="relative grid size-10 place-items-center">
        <svg
          viewBox="0 0 40 40"
          aria-hidden="true"
          className="size-10 transition-transform duration-500 group-hover:-rotate-6"
        >
          <circle className="fill-primary" cx="20" cy="20" r="19" />
          <path
            className="fill-[var(--terracotta)]"
            d="M11.6 26.9c-.6-7.6 3.9-13.7 15-15.6.9 9.4-4.4 15.6-15 15.6Z"
          />
          <path
            d="M14 29c2-6.3 6.1-10.5 11.8-13.4"
            className="stroke-primary-foreground"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
          <circle className="fill-primary-foreground" cx="27.6" cy="12.4" r="1.2" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-[var(--terracotta)] ring-2 ring-background" />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-heading text-[1.35rem] font-semibold tracking-[-0.03em]">
            sahajjo
          </span>
          <span className="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            neighbours helping neighbours
          </span>
        </span>
      )}
    </Link>
  );
}
