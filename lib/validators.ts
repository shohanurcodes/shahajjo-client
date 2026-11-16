import { z } from "zod";
import { EVENT_TYPES } from "@/lib/types";

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters.")
  .max(128, "Password cannot be longer than 128 characters.")
  .regex(/[A-Z]/, "Password needs at least one uppercase letter.")
  .regex(/[a-z]/, "Password needs at least one lowercase letter.");

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(60, "Name cannot be longer than 60 characters."),
  email: z.email("Enter a valid email address."),
  photoURL: z
    .string()
    .trim()
    .url("Photo URL must be a valid image link.")
    .max(2000, "That photo URL is too long.")
    .or(z.literal("")),
  password: passwordSchema,
});

export const eventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters.")
    .max(100, "Title cannot be longer than 100 characters."),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters.")
    .max(2000, "Description cannot be longer than 2000 characters."),
  eventType: z.enum(EVENT_TYPES),
  thumbnail: z
    .string()
    .trim()
    .url("Thumbnail must be a valid image URL.")
    .max(2000, "That thumbnail URL is too long."),
  location: z
    .string()
    .trim()
    .min(5, "Location must be at least 5 characters.")
    .max(120, "Location cannot be longer than 120 characters."),
  date: z.string().min(1, "Choose an event date."),
});

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(60, "Name cannot be longer than 60 characters."),
  image: z
    .string()
    .trim()
    .url("Photo URL must be a valid image link.")
    .max(2000, "That photo URL is too long.")
    .or(z.literal("")),
});

export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join(".") : "form";
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }

  return fieldErrors;
}

/** Local calendar date as YYYY-MM-DD (not UTC, so "tomorrow" matches the picker). */
export function localISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function tomorrowISO(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return localISODate(tomorrow);
}

export function validateEventDate(value: string): string | null {
  if (!value) return "Choose an event date.";
  if (value < tomorrowISO()) return "Choose a date from tomorrow onwards.";
  return null;
}
