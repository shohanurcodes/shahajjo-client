import type { Metadata } from "next";
import { EventsExplorer } from "@/components/events/events-explorer";

export const metadata: Metadata = {
  title: "Upcoming events",
  description:
    "Browse upcoming community cleanups, plantation drives, donation events, food drives and winter relief programmes across Dhaka.",
};

export default function EventsPage() {
  return <EventsExplorer />;
}
