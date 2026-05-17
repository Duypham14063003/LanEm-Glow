import { AdminOrderCreatePanel } from "@/components/admin/admin-order-create-panel";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { OrderDetailPanel } from "@/components/admin/order-detail-panel";
import { OrdersTable } from "@/components/admin/orders-table";
import { AdminOrderStats } from "@/components/admin/admin-order-stats";
import { Input } from "@/components/ui/input";
import { getCatalogProducts } from "@/services/products";
import { listAdminOrders, parseOrderAdminQuery } from "@/services/orders";

type OrdersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getFirst(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;
  const query = parseOrderAdminQuery({
    q: getFirst(params.q),
    status: getFirst(params.status),
    duplicate: getFirst(params.duplicate),
    dateFrom: getFirst(params.dateFrom),
    dateTo: getFirst(params.dateTo),
  });
  const [items, products, allOrders] = await Promise.all([
    listAdminOrders(query),
    getCatalogProducts({ skipCache: true }),
    listAdminOrders({}),
  ]);
  const selectedOrderId = getFirst(params.selectedOrderId);
  const selectedOrder =
    items.find((item) => item.orderId === selectedOrderId) ?? items[0] ?? null;
  const duplicateQuery = new URLSearchParams();

  if (query.q) {
    duplicateQuery.set("q", query.q);
  }
  if (query.status) {
    duplicateQuery.set("status", query.status);
  }
  if (query.dateFrom) {
    duplicateQuery.set("dateFrom", query.dateFrom);
  }
  if (query.dateTo) {
    duplicateQuery.set("dateTo", query.dateTo);
  }
  duplicateQuery.set("duplicate", "true");

  return (
    <div>
      <AdminTopbar
        title="Đơn hàng"
        description="Theo dõi lead mới, mở chi tiết và cập nhật trạng thái follow-up ngay trong admin."
      />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <AdminOrderStats allOrders={allOrders} products={products} />
        
        <form className="grid gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white/80 p-4 shadow-[var(--shadow-card)] xl:grid-cols-[2fr_1fr_1fr_1fr_auto]">
          <Input name="dateFrom" type="date" defaultValue={query.dateFrom ?? ""} />
          <Input name="dateTo" type="date" defaultValue={query.dateTo ?? ""} />
          <select
            name="status"
            defaultValue={query.status ?? ""}
            className="h-12 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-foreground)]"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="new">new</option>
            <option value="contacted">contacted</option>
            <option value="confirmed">confirmed</option>
            <option value="closed">closed</option>
            <option value="cancelled">cancelled</option>
            <option value="duplicate">duplicate</option>
            <option value="invalid">invalid</option>
          </select>
          <div className="flex flex-wrap gap-2">
            <a
              href={`/admin/orders?${duplicateQuery.toString()}`}
              className={`inline-flex min-h-10 items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition duration-[var(--motion-fast)] ease-[var(--ease-standard)] ${query.duplicate === true
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                  : "border-[var(--color-border)] bg-white text-[var(--color-foreground)] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-muted)]"
                }`}
            >
              Chỉ đơn trùng
            </a>
            <button
              type="submit"
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white"
            >
              Lọc
            </button>
          </div>
        </form>

        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.85fr)] xl:gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[var(--color-foreground-soft)]">
                {items.length} đơn phù hợp
              </p>
            </div>
            <OrdersTable items={items} selectedOrderId={selectedOrder?.orderId} />
          </div>

          <div className="space-y-5 xl:sticky xl:top-24 xl:self-start">
            <AdminOrderCreatePanel products={products} />
            <OrderDetailPanel initialOrder={selectedOrder} />
          </div>
        </div>
      </div>
    </div>
  );
}
