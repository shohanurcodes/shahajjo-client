import type { Metadata } from "next";
import { ManageEvents } from "@/components/events/manage-events";

export const metadata: Metadata = {
  title: "Manage events",
  description:
    "Edit or delete the Sahajjo community events you are hosting, and see how many neighbours have joined.",
};

export default function ManageEventsPage() {
  return <ManageEvents />;
}
