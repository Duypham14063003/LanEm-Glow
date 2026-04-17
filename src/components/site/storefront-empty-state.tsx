import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";

interface StorefrontEmptyStateProps {
  title: string;
  description: string;
}

export function StorefrontEmptyState({
  title,
  description,
}: StorefrontEmptyStateProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      actionLabel="Xem lại toàn bộ sản phẩm"
      actionProps={{ asChild: true, children: <Link href="/products">Xem lại toàn bộ sản phẩm</Link> }}
    />
  );
}
