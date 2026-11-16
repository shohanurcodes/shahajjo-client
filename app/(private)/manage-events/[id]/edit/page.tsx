import type { Metadata } from "next";
import { EditEventLoader } from "@/components/events/edit-event-loader";

export const metadata: Metadata = {
  title: "Edit event",
  description: "Update the date, place or details of an event you are hosting.",
};

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditEventLoader eventId={id} />;
}
