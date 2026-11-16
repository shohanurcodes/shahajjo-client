import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="site-container flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <div className="grid size-20 place-items-center rounded-full bg-brand-soft text-primary">
        <SearchX className="size-9" />
      </div>
      <p className="eyebrow mt-8">404 — page not found</p>
      <h1 className="display-lg mt-4 max-w-2xl">
        This path hasn&apos;t been planted yet.
      </h1>
      <p className="lede mt-4 max-w-lg">
        The page you were looking for may have moved, or the link was mistyped.
        Head back to the events board — there is plenty of good work waiting.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/events">Browse upcoming events</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">
            <ArrowLeft />
            Back home
          </Link>
        </Button>
      </div>
    </div>
  );
}
