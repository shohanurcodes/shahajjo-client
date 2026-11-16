import { EventGridSkeleton } from "@/components/event-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventsLoading() {
  return (
    <div className="site-container pb-20 pt-10 md:pt-14">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-4 h-11 w-full max-w-2xl" />
      <Skeleton className="mt-4 h-4 w-full max-w-xl" />
      <Skeleton className="mt-2 h-4 w-2/3 max-w-lg" />

      <Skeleton className="mt-9 h-32 w-full rounded-[1.5rem]" />

      <div className="mt-10">
        <EventGridSkeleton count={6} />
      </div>
    </div>
  );
}
