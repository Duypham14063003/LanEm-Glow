import { PageSection } from "@/components/site/page-section";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <PageSection>
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <Skeleton className="aspect-square w-full rounded-[var(--radius-sheet)]" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-14 w-4/5 rounded-full" />
          <Skeleton className="h-6 w-2/3 rounded-full" />
          <Skeleton className="h-10 w-40 rounded-full" />
        </div>
      </div>
    </PageSection>
  );
}
