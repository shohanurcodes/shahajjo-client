import { format } from "date-fns";

export function formatEventDate(iso: string): string {
  return format(new Date(iso), "EEE, d MMM yyyy");
}

export function formatEventDateLong(iso: string): string {
  return format(new Date(iso), "EEEE, d MMMM yyyy");
}

export function formatJoinedOn(iso: string): string {
  return format(new Date(iso), "d MMM yyyy");
}

export function isPastEvent(iso: string): boolean {
  const event = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return event.getTime() < today.getTime();
}

export function dayLabel(iso: string): string {
  return format(new Date(iso), "dd");
}

export function monthLabel(iso: string): string {
  return format(new Date(iso), "MMM").toUpperCase();
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function fallbackAvatar(seed: string): string {
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}`;
}

export function eventTypeTone(type: string): string {
  switch (type) {
    case "Cleanup":
      return "bg-sky-500/15 text-sky-800 dark:text-sky-200";
    case "Plantation":
      return "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200";
    case "Donation":
      return "bg-amber-500/15 text-amber-800 dark:text-amber-200";
    case "Winter Relief":
      return "bg-indigo-500/15 text-indigo-800 dark:text-indigo-200";
    case "Food Drive":
      return "bg-rose-500/15 text-rose-800 dark:text-rose-200";
    default:
      return "bg-orange-500/15 text-orange-800 dark:text-orange-200";
  }
}
