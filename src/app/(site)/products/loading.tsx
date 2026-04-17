import { PageSection } from "@/components/site/page-section";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <PageSection>
      <div className="space-y-6">
        <Skeleton className="h-12 w-72 rounded-full" />
        <Skeleton className="h-36 w-full rounded-[var(--radius-sheet)]" />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-72 w-full rounded-[var(--radius-card)]" />
              <Skeleton className="h-5 w-2/3 rounded-full" />
              <Skeleton className="h-4 w-1/2 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </PageSection>
  );
}
