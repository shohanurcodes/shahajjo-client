import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Join Sahajjo",
  description:
    "Create a Sahajjo account to join community cleanups, plantation drives, donation events and winter relief programmes in Dhaka.",
};

export default async function RegisterPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect("/events");
  }

  return (
    <AuthShell
      eyebrow="Join the community"
      title={
        <>
          Start with one{" "}
          <span className="italic text-primary">good Saturday.</span>
        </>
      }
      subtitle="Create an account to join a drive, bring a friend, or start something of your own. It takes less than a minute."
      image="/gallery/plantation.jpg"
      imageAlt="A volunteer planting a sapling during a community plantation drive"
      quote="We planted forty-two trees in one morning. Nobody thought it was a big deal — that is exactly what made it one."
      quoteBy="Sahajjo volunteer, Dhanmondi"
      footer="Already part of the community?"
    >
      <RegisterForm />
    </AuthShell>
  );
}
