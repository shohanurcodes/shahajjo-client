"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ImageIcon,
  Lightbulb,
  Loader2,
  MapPin,
  Save,
  Sparkles,
  Type,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch, ApiError } from "@/lib/api";
import {
  eventSchema,
  toFieldErrors,
  tomorrowISO,
  validateEventDate,
} from "@/lib/validators";
import {
  EVENT_TYPES,
  type EventItem,
  type EventResponse,
  type EventType,
} from "@/lib/types";

interface EventFormProps {
  mode: "create" | "edit";
  eventId?: string;
  initial?: EventItem;
}

interface FormState {
  title: string;
  description: string;
  eventType: EventType;
  thumbnail: string;
  location: string;
  date: string;
}

function initialDate(value?: string): string {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export function EventForm({ mode, eventId, initial }: EventFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    eventType: initial?.eventType ?? "Cleanup",
    thumbnail: initial?.thumbnail ?? "",
    location: initial?.location ?? "",
    date: initialDate(initial?.date),
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setFormError(null);
  }

  function validateLocally(): boolean {
    const parsed = eventSchema.safeParse(form);
    const errors = parsed.success ? {} : toFieldErrors(parsed.error);
    const dateError = validateEventDate(form.date);
    if (dateError) errors.date = dateError;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error("Please check the highlighted fields.");
      return false;
    }

    return true;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!validateLocally()) return;

    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        eventType: form.eventType,
        thumbnail: form.thumbnail.trim(),
        location: form.location.trim(),
        date: new Date(`${form.date}T12:00:00.000Z`).toISOString(),
      };

      const result = await apiFetch<EventResponse>(
        mode === "create" ? "/api/events" : `/api/events/${eventId}`,
        { method: mode === "create" ? "POST" : "PATCH", body: payload },
      );

      toast.success(
        mode === "create"
          ? "Event published. Your neighbours can see it now."
          : "Event updated. Everyone will see the latest details.",
      );

      const targetId = result.event?.id ?? eventId;
      router.push(targetId ? `/events/${targetId}` : "/manage-events");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (Object.keys(err.fieldErrors).length > 0) {
          setFieldErrors(err.fieldErrors);
        }
        setFormError(err.message);
      } else {
        setFormError("We could not save this event. Please try again.");
      }
      toast.error("The event could not be saved.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  }

  const minDate = tomorrowISO();
  const isEdit = mode === "edit";

  return (
    <div className="site-container pb-20 pt-8 md:pt-12">
      <Link
        href={isEdit ? "/manage-events" : "/events"}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {isEdit ? "Back to manage events" : "Back to events"}
      </Link>

      <header className="mt-5 max-w-2xl">
        <p className="eyebrow">{isEdit ? "Edit event" : "Host an event"}</p>
        <h1 className="display-lg mt-4">
          {isEdit ? (
            <>
              Keep the details{" "}
              <span className="italic text-primary">up to date.</span>
            </>
          ) : (
            <>
              Start something your{" "}
              <span className="italic text-primary">street needs.</span>
            </>
          )}
        </h1>
        <p className="lede mt-4">
          {isEdit
            ? "Attendees see changes immediately. You can update the plan, move the date or swap the cover image at any time."
            : "Give your drive a clear name, a real place and a date people can plan around. You can edit everything later."}
        </p>
      </header>

      <div className="mt-9 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-[1.6rem] border border-border/80 bg-card p-5 shadow-sm sm:p-7"
        >
          {formError && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm font-medium text-destructive"
            >
              {formError}
            </div>
          )}

          <fieldset className="space-y-5" disabled={submitting}>
            <legend className="sr-only">Event details</legend>

            <div className="space-y-1.5">
              <Label htmlFor="event-title">Event title</Label>
              <Input
                id="event-title"
                value={form.title}
                onChange={(event) => update("title", event.target.value)}
                placeholder="Winter clothes collection for Mirpur families"
                maxLength={100}
                aria-invalid={Boolean(fieldErrors.title)}
                className="h-11 rounded-xl bg-background/60"
              />
              <div className="flex items-start justify-between gap-3">
                {fieldErrors.title ? (
                  <p className="text-xs font-medium text-destructive">
                    {fieldErrors.title}
                  </p>
                ) : (
                  <p className="text-[0.7rem] text-muted-foreground">
                    Keep it specific — say what is happening and who it helps.
                  </p>
                )}
                <span className="shrink-0 text-[0.7rem] text-muted-foreground">
                  {form.title.length}/100
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                placeholder="What will volunteers do? What should they bring? Who will the event help? Mention the meeting point and any timing details."
                rows={7}
                maxLength={2000}
                aria-invalid={Boolean(fieldErrors.description)}
                className="min-h-36 rounded-xl bg-background/60"
              />
              <div className="flex items-start justify-between gap-3">
                {fieldErrors.description ? (
                  <p className="text-xs font-medium text-destructive">
                    {fieldErrors.description}
                  </p>
                ) : (
                  <p className="text-[0.7rem] text-muted-foreground">
                    At least 20 characters. Practical details help people show
                    up prepared.
                  </p>
                )}
                <span className="shrink-0 text-[0.7rem] text-muted-foreground">
                  {form.description.length}/2000
                </span>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="event-type">Event type</Label>
                <Select
                  value={form.eventType}
                  onValueChange={(value) =>
                    update("eventType", value as EventType)
                  }
                  disabled={submitting}
                >
                  <SelectTrigger
                    id="event-type"
                    aria-invalid={Boolean(fieldErrors.eventType)}
                    className="h-11 w-full rounded-xl bg-background/60 px-3"
                  >
                    <Sparkles className="size-4 text-muted-foreground" />
                    <SelectValue placeholder="Choose a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((eventType) => (
                      <SelectItem key={eventType} value={eventType}>
                        {eventType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.eventType && (
                  <p className="text-xs font-medium text-destructive">
                    {fieldErrors.eventType}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="event-date">Event date</Label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="event-date"
                    type="date"
                    min={minDate}
                    value={form.date}
                    onChange={(event) => update("date", event.target.value)}
                    aria-invalid={Boolean(fieldErrors.date)}
                    className="h-11 rounded-xl bg-background/60 pl-9"
                  />
                </div>
                {fieldErrors.date ? (
                  <p className="text-xs font-medium text-destructive">
                    {fieldErrors.date}
                  </p>
                ) : (
                  <p className="text-[0.7rem] text-muted-foreground">
                    Tomorrow onwards.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="event-location">Location</Label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="event-location"
                  value={form.location}
                  onChange={(event) => update("location", event.target.value)}
                  placeholder="Mirpur 10 roundabout, near the mosque"
                  maxLength={120}
                  aria-invalid={Boolean(fieldErrors.location)}
                  className="h-11 rounded-xl bg-background/60 pl-9"
                />
              </div>
              {fieldErrors.location ? (
                <p className="text-xs font-medium text-destructive">
                  {fieldErrors.location}
                </p>
              ) : (
                <p className="text-[0.7rem] text-muted-foreground">
                  A landmark is more useful than a full street address.
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="event-thumbnail">Cover image URL</Label>
              <div className="relative">
                <ImageIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="event-thumbnail"
                  type="url"
                  value={form.thumbnail}
                  onChange={(event) => {
                    update("thumbnail", event.target.value);
                    setPreviewFailed(false);
                  }}
                  placeholder="https://images.unsplash.com/photo-..."
                  aria-invalid={Boolean(fieldErrors.thumbnail)}
                  className="h-11 rounded-xl bg-background/60 pl-9"
                />
              </div>
              {fieldErrors.thumbnail ? (
                <p className="text-xs font-medium text-destructive">
                  {fieldErrors.thumbnail}
                </p>
              ) : (
                <p className="text-[0.7rem] text-muted-foreground">
                  Paste a direct image link. Unsplash and Pexels links work
                  well.
                </p>
              )}

              {form.thumbnail && (
                <div className="mt-3 overflow-hidden rounded-xl border border-border/80 bg-muted">
                  {previewFailed ? (
                    <div className="paper-grid flex h-40 items-center justify-center bg-brand-soft text-sm font-medium text-primary/70">
                      That image could not be loaded — check the link.
                    </div>
                  ) : (
                    // Preview must accept any image host the user pastes.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.thumbnail}
                      alt="Event cover preview"
                      className="h-40 w-full object-cover"
                      onError={() => setPreviewFailed(true)}
                    />
                  )}
                </div>
              )}
            </div>
          </fieldset>

          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-end">
            <Button
              asChild
              type="button"
              variant="ghost"
              disabled={submitting}
              className="sm:mr-auto"
            >
              <Link href={isEdit ? "/manage-events" : "/events"}>Cancel</Link>
            </Button>
            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? <Loader2 className="animate-spin" /> : <Save />}
              {submitting
                ? "Saving event..."
                : isEdit
                  ? "Save changes"
                  : "Publish event"}
            </Button>
          </div>
        </form>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-[1.4rem] border border-border/80 bg-card p-5">
            <p className="flex items-center gap-2 font-heading text-base font-semibold">
              <Lightbulb className="size-4 text-[var(--terracotta)]" />
              A good event post
            </p>
            <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <Type className="mt-0.5 size-3.5 shrink-0 text-primary/70" />
                A title that says exactly what happens.
              </li>
              <li className="flex gap-2">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary/70" />
                A landmark people can actually find.
              </li>
              <li className="flex gap-2">
                <CalendarDays className="mt-0.5 size-3.5 shrink-0 text-primary/70" />
                A date far enough out for people to plan.
              </li>
              <li className="flex gap-2">
                <ImageIcon className="mt-0.5 size-3.5 shrink-0 text-primary/70" />
                A real photo from a previous drive, if you have one.
              </li>
            </ul>
          </div>

          <div className="rounded-[1.4rem] border border-[var(--terracotta)]/20 bg-[var(--terracotta)]/8 p-5">
            <p className="font-heading text-base font-semibold">
              You are the host
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Only you can edit or delete this event. Attendees can join with
              one tap, and you will see their names on the event page.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
