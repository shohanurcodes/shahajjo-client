import { Skeleton } from "@/components/ui/skeleton";

export function PageHeaderSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div className="site-container pb-20 pt-10 md:pt-14">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-4 h-10 w-full max-w-xl" />
      <Skeleton className="mt-4 h-4 w-full max-w-2xl" />
      <Skeleton className="mt-2 h-4 w-2/3 max-w-xl" />

      <div className="mt-9 grid gap-3 sm:grid-cols-3">
        {Array.from({ length: cards }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export function FormPageSkeleton() {
  return (
    <div className="site-container pb-20 pt-10 md:pt-14">
      <Skeleton className="h-4 w-36" />
      <Skeleton className="mt-6 h-3 w-24" />
      <Skeleton className="mt-4 h-10 w-3/4 max-w-xl" />
      <Skeleton className="mt-4 h-4 w-full max-w-xl" />

      <div className="mt-9 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5 rounded-[1.6rem] border border-border/80 bg-card p-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton
                className={index === 1 ? "h-32 w-full rounded-xl" : "h-11 w-full rounded-xl"}
              />
            </div>
          ))}
          <Skeleton className="ml-auto h-12 w-40 rounded-full" />
        </div>
        <Skeleton className="h-64 w-full rounded-[1.4rem]" />
      </div>
    </div>
  );
}
