import type { Metadata } from "next";
import { EventDetail } from "@/components/events/event-detail";

export const metadata: Metadata = {
  title: "Event details",
  description:
    "See who is coming, where to meet and how to join this Sahajjo community event.",
};

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EventDetail eventId={id} />;
}
