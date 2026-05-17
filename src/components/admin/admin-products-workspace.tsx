"use client";

import { useEffect, useMemo, useState } from "react";

import { trackEvent } from "@/lib/analytics";
import { formatCompactDate } from "@/lib/utils";
import type {
  ProductAdminListItem,
  ProductAdminMutationInput,
  ProductAdminQuery,
  ProductStockStatus,
  ProductStatus,
} from "@/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const productStatuses: ProductStatus[] = ["active", "inactive"];
const stockStatuses: ProductStockStatus[] = ["in_stock", "out_of_stock", "preorder"];

type ProductFormValues = {
  productId: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: string;
  concerns: string;
  price: string;
  compareAtPrice: string;
  imageUrl: string;
  galleryUrls: string;
  tiktokUrl: string;
  status: ProductStatus;
  stockStatus: ProductStockStatus;
  isFeatured: boolean;
  displayOrder: string;
  searchKeywords: string;
  quantity: string;
};

const emptyForm: ProductFormValues = {
  productId: "",
  slug: "",
  name: "",
  shortDescription: "",
  description: "",
  category: "",
  concerns: "",
  price: "",
  compareAtPrice: "",
  imageUrl: "",
  galleryUrls: "",
  tiktokUrl: "",
  status: "active",
  stockStatus: "in_stock",
  isFeatured: false,
  displayOrder: "0",
  searchKeywords: "",
  quantity: "",
};

function getStatusVariant(status: ProductStatus) {
  return status === "active" ? "success" : "neutral";
}

function getStockVariant(status: ProductStockStatus) {
  switch (status) {
    case "in_stock":
      return "success";
    case "preorder":
      return "warning";
    case "out_of_stock":
      return "error";
    default:
      return "neutral";
  }
}

function toFormValues(product: ProductAdminListItem | null): ProductFormValues {
  if (!product) {
    return emptyForm;
  }

  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription,
    description: product.description,
    category: product.category,
    concerns: product.concerns.join(", "),
    price: `${product.price}`,
    compareAtPrice: product.compareAtPrice === null ? "" : `${product.compareAtPrice}`,
    imageUrl: product.imageUrl,
    galleryUrls: product.galleryUrls.join(", "),
    tiktokUrl: product.tiktokUrl ?? "",
    status: product.status,
    stockStatus: product.stockStatus,
    isFeatured: product.isFeatured,
    displayOrder: `${product.displayOrder}`,
    searchKeywords: product.searchKeywords.join(", "),
    quantity: product.quantity === null ? "" : `${product.quantity}`,
  };
}

function toPayload(values: ProductFormValues): ProductAdminMutationInput | Record<string, unknown> {
  return {
    productId: values.productId,
    slug: values.slug,
    name: values.name,
    shortDescription: values.shortDescription,
    description: values.description,
    category: values.category,
    concerns: values.concerns,
    price: values.price,
    compareAtPrice: values.compareAtPrice,
    imageUrl: values.imageUrl,
    galleryUrls: values.galleryUrls,
    tiktokUrl: values.tiktokUrl,
    status: values.status,
    stockStatus: values.stockStatus,
    isFeatured: values.isFeatured,
    displayOrder: values.displayOrder,
    searchKeywords: values.searchKeywords,
    quantity: values.quantity,
  };
}

export function AdminProductsWorkspace({
  initialItems,
  query,
}: {
  initialItems: ProductAdminListItem[];
  query: ProductAdminQuery;
}) {
  const [items, setItems] = useState(initialItems);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    initialItems[0]?.id ?? null
  );
  const [mode, setMode] = useState<"create" | "edit">(initialItems.length > 0 ? "edit" : "create");
  const [formValues, setFormValues] = useState<ProductFormValues>(
    initialItems[0] ? toFormValues(initialItems[0]) : emptyForm
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isUploadingPrimary, setIsUploadingPrimary] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    setItems(initialItems);

    if (mode === "create") {
      return;
    }

    const fallback = initialItems[0]?.id ?? null;
    const nextSelectedId = initialItems.some((item) => item.id === selectedProductId)
      ? selectedProductId
      : fallback;

    setSelectedProductId(nextSelectedId);

    const nextSelectedProduct =
      initialItems.find((item) => item.id === nextSelectedId) ?? null;
    setFormValues(toFormValues(nextSelectedProduct));
  }, [initialItems, mode, selectedProductId]);

  const selectedProduct = useMemo(
    () => items.find((item) => item.id === selectedProductId) ?? null,
    [items, selectedProductId]
  );

  const openCreate = () => {
    setMode("create");
    setSelectedProductId(null);
    setFormValues(emptyForm);
    setMessage(null);
    setError(null);
    setUploadMessage(null);
    setUploadError(null);
  };

  const openEdit = (product: ProductAdminListItem) => {
    setMode("edit");
    setSelectedProductId(product.id);
    setFormValues(toFormValues(product));
    setMessage(null);
    setError(null);
    setUploadMessage(null);
    setUploadError(null);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  const handleFieldChange = <K extends keyof ProductFormValues>(
    field: K,
    value: ProductFormValues[K]
  ) => {
    setFormValues((current) => {
      const next = { ...current, [field]: value };
      
      if (mode === "create" && field === "name" && typeof value === "string") {
        const slug = generateSlug(value);
        if (slug) {
          next.slug = slug;
          next.productId = slug.toUpperCase().replace(/-/g, "_");
        } else {
          next.slug = "";
          next.productId = "";
        }
      }
      
      return next;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const endpoint =
        mode === "create"
          ? "/api/admin/products"
          : `/api/admin/products/${encodeURIComponent(selectedProductId ?? "")}`;
      const response = await fetch(endpoint, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(toPayload(formValues)),
      });

      const payload = (await response.json()) as
        | { product: ProductAdminListItem }
        | { error?: string };

      if (!response.ok) {
        setError("error" in payload ? payload.error ?? "Không thể lưu sản phẩm." : "Không thể lưu sản phẩm.");
        return;
      }

      const product = (payload as { product: ProductAdminListItem }).product;
      const nextItems = [...items.filter((item) => item.id !== selectedProductId && item.id !== product.id), product].sort(
        (left, right) => {
          if (left.displayOrder !== right.displayOrder) {
            return left.displayOrder - right.displayOrder;
          }

          return left.name.localeCompare(right.name);
        }
      );

      setItems(nextItems);
      setMode("edit");
      setSelectedProductId(product.id);
      setFormValues(toFormValues(product));
      setMessage(mode === "create" ? "Đã tạo sản phẩm mới." : "Đã cập nhật sản phẩm.");

      trackEvent("admin_order_updated", {
        entity: "product",
        action: mode,
        productId: product.id,
      });
    } catch {
      setError("Không thể kết nối để lưu sản phẩm. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!selectedProductId) {
      return;
    }

    setIsArchiving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/admin/products/${encodeURIComponent(selectedProductId)}`, {
        method: "DELETE",
      });

      const payload = (await response.json()) as
        | { product: ProductAdminListItem }
        | { error?: string };

      if (!response.ok) {
        setError(
          "error" in payload ? payload.error ?? "Không thể ẩn sản phẩm." : "Không thể ẩn sản phẩm."
        );
        return;
      }

      const product = (payload as { product: ProductAdminListItem }).product;
      const nextItems = items.map((item) => (item.id === product.id ? product : item));
      setItems(nextItems);
      setFormValues(toFormValues(product));
      setMessage("Đã chuyển sản phẩm sang trạng thái inactive.");
    } catch {
      setError("Không thể kết nối để cập nhật trạng thái sản phẩm.");
    } finally {
      setIsArchiving(false);
    }
  };

  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    target: "primary" | "gallery"
  ) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";

    if (!file) {
      return;
    }

    if (target === "primary") {
      setIsUploadingPrimary(true);
    } else {
      setIsUploadingGallery(true);
    }

    setUploadMessage(null);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.set("file", file);

      const response = await fetch("/api/admin/uploads/product-image", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as
        | { url: string; fileName: string }
        | { error?: string };

      if (!response.ok) {
        setUploadError(
          "error" in payload ? payload.error ?? "Không thể tải ảnh lên." : "Không thể tải ảnh lên."
        );
        return;
      }

      const { url } = payload as { url: string; fileName: string };

      if (target === "primary") {
        handleFieldChange("imageUrl", url);
        setUploadMessage("Đã tải ảnh đại diện lên và điền URL tự động.");
      } else {
        const existing = formValues.galleryUrls
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
        const nextValues = Array.from(new Set([...existing, url]));
        handleFieldChange("galleryUrls", nextValues.join(", "));
        setUploadMessage("Đã thêm ảnh mới vào gallery URLs.");
      }
    } catch {
      setUploadError("Không thể kết nối để tải ảnh lên. Vui lòng thử lại.");
    } finally {
      if (target === "primary") {
        setIsUploadingPrimary(false);
      } else {
        setIsUploadingGallery(false);
      }
    }
  };

  return (
    <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.9fr)] xl:gap-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-[var(--color-foreground-soft)]">
            {items.length} sản phẩm phù hợp
          </p>
          <Button size="sm" onClick={openCreate}>
            Thêm sản phẩm
          </Button>
        </div>

        {items.length > 0 ? (
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <tr>
                    <TableHeaderCell>Sản phẩm</TableHeaderCell>
                    <TableHeaderCell>Danh mục</TableHeaderCell>
                    <TableHeaderCell>Giá</TableHeaderCell>
                    <TableHeaderCell>Số lượng</TableHeaderCell>
                    <TableHeaderCell>Trạng thái</TableHeaderCell>
                    <TableHeaderCell>Tồn kho</TableHeaderCell>
                    <TableHeaderCell className="text-right">Hành động</TableHeaderCell>
                  </tr>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow
                      key={item.id}
                      className={item.id === selectedProductId ? "bg-[var(--color-surface-muted)]" : undefined}
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <button
                            type="button"
                            className="text-left font-medium text-[var(--color-foreground)]"
                            onClick={() => openEdit(item)}
                          >
                            {item.name}
                          </button>
                          <p className="text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
                            {item.id} · /products/{item.slug}
                          </p>
                          <p className="text-sm text-[var(--color-foreground-soft)]">
                            {item.shortDescription}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.price.toLocaleString("vi-VN")}đ</TableCell>
                      <TableCell>{item.quantity !== null ? item.quantity : "-"}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStockVariant(item.stockStatus)}>{item.stockStatus}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="secondary" onClick={() => openEdit(item)}>
                          Sửa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        ) : (
          <EmptyState
            title="Chưa có sản phẩm nào khớp bộ lọc"
            description={
              query.q || query.status
                ? "Bạn có thể đổi từ khóa hoặc trạng thái lọc, hoặc tạo mới một sản phẩm ngay từ admin."
                : "Catalog hiện chưa có sản phẩm nào. Bạn có thể bắt đầu bằng cách tạo sản phẩm đầu tiên."
            }
            actionLabel="Thêm sản phẩm"
            actionProps={{ onClick: openCreate }}
          />
        )}
      </div>

      <div className="xl:sticky xl:top-24 xl:self-start">
        <Card className="space-y-5 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">
                {mode === "create" ? "Tạo sản phẩm" : "Chỉnh sửa sản phẩm"}
              </p>
              <h2 className="mt-1 text-3xl text-[var(--color-foreground)]">
                {mode === "create" ? "Sản phẩm mới" : formValues.name || selectedProduct?.name || "Sản phẩm"}
              </h2>
            </div>
            {mode === "edit" && selectedProduct ? (
              <div className="text-right text-sm text-[var(--color-foreground-soft)]">
                <p>Cập nhật gần nhất</p>
                <p className="font-medium text-[var(--color-foreground)]">
                  {formatCompactDate(selectedProduct.updatedAt)}
                </p>
              </div>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Mã sản phẩm">
              <Input
                value={formValues.productId}
                onChange={(event) => handleFieldChange("productId", event.target.value)}
                disabled={isSaving || mode === "edit"}
                placeholder="SERUM-01"
              />
            </Field>
            <Field label="Slug">
              <Input
                value={formValues.slug}
                onChange={(event) => handleFieldChange("slug", event.target.value)}
                disabled={isSaving}
                placeholder="serum-phuc-hoi"
              />
            </Field>
            <Field className="sm:col-span-2" label="Tên sản phẩm">
              <Input
                value={formValues.name}
                onChange={(event) => handleFieldChange("name", event.target.value)}
                disabled={isSaving}
                placeholder="Serum phuc hoi da nhay cam"
              />
            </Field>
            <Field className="sm:col-span-2" label="Mô tả ngắn">
              <Textarea
                value={formValues.shortDescription}
                onChange={(event) => handleFieldChange("shortDescription", event.target.value)}
                disabled={isSaving}
                className="min-h-24"
              />
            </Field>
            <Field className="sm:col-span-2" label="Mô tả chi tiết">
              <Textarea
                value={formValues.description}
                onChange={(event) => handleFieldChange("description", event.target.value)}
                disabled={isSaving}
              />
            </Field>
            <Field label="Danh mục">
              <Input
                value={formValues.category}
                onChange={(event) => handleFieldChange("category", event.target.value)}
                disabled={isSaving}
                placeholder="Serum"
              />
            </Field>
            <Field label="Concern">
              <Input
                value={formValues.concerns}
                onChange={(event) => handleFieldChange("concerns", event.target.value)}
                disabled={isSaving}
                placeholder="phuc hoi, da nhay cam"
              />
            </Field>
            <Field label="Giá bán">
              <Input
                type="number"
                min="0"
                value={formValues.price}
                onChange={(event) => handleFieldChange("price", event.target.value)}
                disabled={isSaving}
              />
            </Field>
            <Field label="Giá compare">
              <Input
                type="number"
                min="0"
                value={formValues.compareAtPrice}
                onChange={(event) => handleFieldChange("compareAtPrice", event.target.value)}
                disabled={isSaving}
                placeholder="Tùy chọn"
              />
            </Field>
            <Field className="sm:col-span-2" label="Ảnh đại diện">
              <div className="space-y-3">
                <Input
                  value={formValues.imageUrl}
                  onChange={(event) => handleFieldChange("imageUrl", event.target.value)}
                  disabled={isSaving || isUploadingPrimary}
                  placeholder="https://..."
                />
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      className="sr-only"
                      onChange={(event) => void handleUpload(event, "primary")}
                      disabled={isSaving || isUploadingPrimary}
                    />
                    <span className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-[var(--color-surface-muted)]">
                      {isUploadingPrimary ? "Đang tải ảnh..." : "Upload ảnh đại diện"}
                    </span>
                  </label>
                  <span className="text-xs text-[var(--color-muted)]">
                    PNG, JPG, WEBP, GIF. Tối đa 5MB.
                  </span>
                </div>
              </div>
            </Field>
            <Field className="sm:col-span-2" label="Gallery URLs">
              <div className="space-y-3">
                <Textarea
                  value={formValues.galleryUrls}
                  onChange={(event) => handleFieldChange("galleryUrls", event.target.value)}
                  disabled={isSaving || isUploadingGallery}
                  className="min-h-24"
                  placeholder="https://... , https://..."
                />
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      className="sr-only"
                      onChange={(event) => void handleUpload(event, "gallery")}
                      disabled={isSaving || isUploadingGallery}
                    />
                    <span className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-[var(--color-surface-muted)]">
                      {isUploadingGallery ? "Đang tải ảnh..." : "Thêm ảnh vào gallery"}
                    </span>
                  </label>
                  <span className="text-xs text-[var(--color-muted)]">
                    Ảnh upload mới sẽ được append vào danh sách URL hiện tại.
                  </span>
                </div>
              </div>
            </Field>
            <Field className="sm:col-span-2" label="TikTok URL">
              <Input
                value={formValues.tiktokUrl}
                onChange={(event) => handleFieldChange("tiktokUrl", event.target.value)}
                disabled={isSaving}
                placeholder="https://www.tiktok.com/@youraccount/video/..."
              />
            </Field>
            <Field label="Trạng thái">
              <select
                className="h-12 w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-foreground)]"
                value={formValues.status}
                onChange={(event) => handleFieldChange("status", event.target.value as ProductStatus)}
                disabled={isSaving}
              >
                {productStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Tồn kho">
              <select
                className="h-12 w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-foreground)]"
                value={formValues.stockStatus}
                onChange={(event) =>
                  handleFieldChange("stockStatus", event.target.value as ProductStockStatus)
                }
                disabled={isSaving}
              >
                {stockStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Thứ tự hiển thị">
              <Input
                type="number"
                min="0"
                value={formValues.displayOrder}
                onChange={(event) => handleFieldChange("displayOrder", event.target.value)}
                disabled={isSaving}
              />
            </Field>
            <Field label="Số lượng">
              <Input
                type="number"
                min="0"
                value={formValues.quantity}
                onChange={(event) => handleFieldChange("quantity", event.target.value)}
                disabled={isSaving}
              />
            </Field>
            <Field label="Tình trạng SP">
              <select
                className="h-12 w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-foreground)]"
                value={formValues.searchKeywords}
                onChange={(event) => handleFieldChange("searchKeywords", event.target.value)}
                disabled={isSaving}
              >
                <option value="">-- Chọn tình trạng --</option>
                <option value="nguyên seal">Nguyên seal</option>
                <option value="test 1 lần">Test 1 lần</option>
                <option value="used">Used</option>
              </select>
            </Field>
          </div>

          {message ? <p className="text-sm text-[var(--color-success)]">{message}</p> : null}
          {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}
          {uploadMessage ? <p className="text-sm text-[var(--color-success)]">{uploadMessage}</p> : null}
          {uploadError ? <p className="text-sm text-[var(--color-danger)]">{uploadError}</p> : null}

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSave} loading={isSaving || isUploadingPrimary || isUploadingGallery}>
              {mode === "create" ? "Tạo sản phẩm" : "Lưu thay đổi"}
            </Button>
            {mode === "edit" ? (
              <Button
                variant="secondary"
                onClick={handleArchive}
                disabled={
                  isSaving ||
                  isUploadingPrimary ||
                  isUploadingGallery ||
                  isArchiving ||
                  formValues.status === "inactive"
                }
              >
                {isArchiving ? "Đang xử lý..." : "Ẩn sản phẩm"}
              </Button>
            ) : null}
            <Button
              variant="secondary"
              onClick={openCreate}
              disabled={isSaving || isUploadingPrimary || isUploadingGallery || isArchiving}
            >
              Form mới
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Field({
  children,
  className,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
        {label}
      </span>
      {children}
    </label>
  );
}
