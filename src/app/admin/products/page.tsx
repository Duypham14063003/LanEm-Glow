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
    status: getFirst(params.status),
  });
  const items = await listAdminProducts(query);

  return (
    <div>
      <AdminTopbar
        title="Sản phẩm"
        description="Quản lý catalog ngay trong admin, vẫn dùng Google Sheets làm nguồn dữ liệu chính cho storefront."
      />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <form className="grid gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white/80 p-4 shadow-[var(--shadow-card)] md:grid-cols-[2fr_1fr_auto]">
          <Input name="q" defaultValue={query.q ?? ""} placeholder="Tìm theo mã, slug, tên hoặc danh mục" />
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

        <AdminProductsWorkspace initialItems={items} query={query} />
      </div>
    </div>
  );
}
