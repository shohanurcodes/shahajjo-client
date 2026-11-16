import type { Metadata } from "next";
import { JoinedEvents } from "@/components/events/joined-events";

export const metadata: Metadata = {
  title: "Joined events",
  description:
    "See all the Sahajjo community events you have joined, sorted by event date.",
};

export default function JoinedEventsPage() {
  return <JoinedEvents />;
}
