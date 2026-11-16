import type { Metadata } from "next";
import { ProfileView } from "@/components/profile/profile-view";

export const metadata: Metadata = {
  title: "My profile",
  description:
    "Update your Sahajjo display name and photo, and see how many events you have created and joined.",
};

export default function ProfilePage() {
  return <ProfileView />;
}
