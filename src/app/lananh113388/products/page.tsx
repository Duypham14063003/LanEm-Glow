export const dynamic = 'force-dynamic';

import { AdminProductsWorkspace } from "@/components/admin/admin-products-workspace";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listAdminProducts, parseProductAdminQuery } from "@/services/admin-products";

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getFirst(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const query = parseProductAdminQuery({
    q: getFirst(params.q),
    name: getFirst(params.name),
    category: getFirst(params.category),
    concern: getFirst(params.concern),
    status: getFirst(params.status),
    brand: getFirst(params.brand),
  });
  const items = await listAdminProducts(query);
  const allItems = await listAdminProducts({});
  const brandOptions = Array.from(
    new Set(allItems.map((item) => item.brand.trim()).filter(Boolean))
  ).sort((left, right) => left.localeCompare(right));
  const categoryOptions = Array.from(
    new Set(allItems.map((item) => item.category.trim()).filter(Boolean))
  ).sort((left, right) => left.localeCompare(right));
  const concernOptions = Array.from(
    new Set(allItems.flatMap((item) => item.concerns).map((item) => item.trim()).filter(Boolean))
  ).sort((left, right) => left.localeCompare(right));

  return (
    <div>
      <AdminTopbar
        title="Sản phẩm"
        description="Quản lý catalog ngay trong admin, vẫn dùng Google Sheets làm nguồn dữ liệu chính cho storefront."
      />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <form className="grid gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white/80 p-4 shadow-[var(--shadow-card)] md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]">
          <Input name="name" defaultValue={query.name ?? ""} placeholder="Lọc theo tên sản phẩm" />
          <div>
            <Input
              name="brand"
              list="admin-product-brand-options"
              defaultValue={query.brand ?? ""}
              placeholder="Lọc theo brand"
            />
            <datalist id="admin-product-brand-options">
              {brandOptions.map((brand) => (
                <option key={brand} value={brand} />
              ))}
            </datalist>
          </div>
          <div>
            <Input
              name="category"
              list="admin-product-category-options"
              defaultValue={query.category ?? ""}
              placeholder="Lọc theo danh mục"
            />
            <datalist id="admin-product-category-options">
              {categoryOptions.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </div>
          <div>
            <Input
              name="concern"
              list="admin-product-concern-options"
              defaultValue={query.concern ?? ""}
              placeholder="Lọc theo concern"
            />
            <datalist id="admin-product-concern-options">
              {concernOptions.map((concern) => (
                <option key={concern} value={concern} />
              ))}
            </datalist>
          </div>
          <select
            name="status"
            defaultValue={query.status ?? ""}
            className="h-12 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-foreground)]"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
          <Button type="submit">Lọc</Button>
        </form>

        <AdminProductsWorkspace
          initialItems={items}
          query={query}
          brandOptions={brandOptions}
          categoryOptions={categoryOptions}
          concernOptions={concernOptions}
        />
      </div>
    </div>
  );
}
