import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Server-side guard for every signed-in route. Checking the session here means
 * a reload never flashes the page before the client session resolves.
 */
export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  return <>{children}</>;
}
