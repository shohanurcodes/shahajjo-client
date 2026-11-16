import type { Metadata } from "next";
import { EventForm } from "@/components/events/event-form";

export const metadata: Metadata = {
  title: "Create event",
  description:
    "Create a new community cleanup, plantation drive, donation event or winter relief programme on Sahajjo.",
};

export default function CreateEventPage() {
  return <EventForm mode="create" />;
}
