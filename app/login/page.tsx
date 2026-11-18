import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { auth } from "@/lib/auth";
import { getSocialProviderAvailability } from "@/lib/social-providers";

export const metadata: Metadata = {
  title: "Log in",
  description:
    "Log in to Sahajjo to join community events, create your own drives and manage your neighbourhood work.",
};

export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect("/events");
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title={
        <>
          Good to see you{" "}
          <span className="italic text-primary">again.</span>
        </>
      }
      subtitle="Log in to pick up where you left off — your joined events, your drives, and the neighbours waiting on your next one."
      image="/gallery/volunteers.jpg"
      imageAlt="Volunteers smiling together after a community event"
      quote="The best thing about this city is how quickly it shows up when someone needs a hand."
      quoteBy="Sahajjo volunteer, Mirpur"
      footer="New to the neighbourhood?"
    >
      <LoginForm providers={getSocialProviderAvailability()} />
    </AuthShell>
  );
}
