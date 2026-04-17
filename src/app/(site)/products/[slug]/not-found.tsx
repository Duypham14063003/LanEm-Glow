import { PageSection } from "@/components/site/page-section";
import { StorefrontEmptyState } from "@/components/site/storefront-empty-state";

export default function ProductNotFound() {
  return (
    <PageSection>
      <StorefrontEmptyState
        title="Không tìm thấy sản phẩm này"
        description="Slug có thể không còn hợp lệ hoặc sản phẩm đã được ẩn khỏi catalog công khai."
      />
    </PageSection>
  );
}
