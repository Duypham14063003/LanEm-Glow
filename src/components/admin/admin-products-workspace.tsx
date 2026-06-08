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
const stockStatuses: ProductStockStatus[] = ["in_stock", "out_of_stock"];
const CUSTOM_OPTION_VALUE = "__custom__";
const PAGE_SIZE = 12;

type ProductFormValues = {
  productId: string;
  slug: string;
  name: string;
  shortDescription: string;
  brand: string;
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
  brand: "",
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
  return status === "in_stock" ? "success" : "error";
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
    brand: product.brand,
    category: product.category,
    concerns: product.concerns.join(", "),
    price: `${product.price}`,
    compareAtPrice:
      product.compareAtPrice === null ? "" : `${product.compareAtPrice}`,
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

function toPayload(
  values: ProductFormValues,
): ProductAdminMutationInput | Record<string, unknown> {
  return {
    productId: values.productId,
    slug: values.slug,
    name: values.name,
    shortDescription: values.shortDescription,
    description: values.shortDescription,
    brand: values.brand,
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

function matchesClientQuery(
  product: ProductAdminListItem,
  query: ProductAdminQuery,
): boolean {
  if (query.name && !product.name.toLowerCase().includes(query.name.toLowerCase())) {
    return false;
  }

  if (query.brand && product.brand.toLowerCase() !== query.brand.toLowerCase()) {
    return false;
  }

  if (query.category && product.category.toLowerCase() !== query.category.toLowerCase()) {
    return false;
  }

  if (
    query.concern &&
    !product.concerns.some((concern) => concern.toLowerCase() === query.concern?.toLowerCase())
  ) {
    return false;
  }

  if (query.status && product.status !== query.status) {
    return false;
  }

  return true;
}

export function AdminProductsWorkspace({
  initialItems,
  query,
  brandOptions,
  categoryOptions,
  concernOptions,
}: {
  initialItems: ProductAdminListItem[];
  query: ProductAdminQuery;
  brandOptions: string[];
  categoryOptions: string[];
  concernOptions: string[];
}) {
  const [items, setItems] = useState(initialItems);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    initialItems[0]?.id ?? null,
  );
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [formValues, setFormValues] = useState<ProductFormValues>(emptyForm);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isCustomConcern, setIsCustomConcern] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState<ProductAdminListItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isUploadingPrimary, setIsUploadingPrimary] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const selectedProduct = useMemo(
    () => items.find((item) => item.id === selectedProductId) ?? null,
    [items, selectedProductId],
  );

  const availableBrands = useMemo(
    () =>
      Array.from(
        new Set(
          [...brandOptions, ...items.map((item) => item.brand)]
            .map((item) => item.trim())
            .filter(Boolean),
        ),
      ).sort((left, right) => left.localeCompare(right)),
    [brandOptions, items],
  );

  const availableCategories = useMemo(
    () =>
      Array.from(
        new Set(
          [...categoryOptions, ...items.map((item) => item.category)]
            .map((item) => item.trim())
            .filter(Boolean),
        ),
      ).sort((left, right) => left.localeCompare(right)),
    [categoryOptions, items],
  );

  const availableConcerns = useMemo(
    () =>
      Array.from(
        new Set(
          [...concernOptions, ...items.flatMap((item) => item.concerns)]
            .map((item) => item.trim())
            .filter(Boolean),
        ),
      ).sort((left, right) => left.localeCompare(right)),
    [concernOptions, items],
  );

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [currentPage, items]);

  useEffect(() => {
    setItems(initialItems);
    setCurrentPage(1);
  }, [initialItems]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const resetFlashMessages = () => {
    setMessage(null);
    setError(null);
    setUploadMessage(null);
    setUploadError(null);
  };

  const openCreate = () => {
    setMode("create");
    setSelectedProductId(null);
    setFormValues(emptyForm);
    setIsCustomCategory(false);
    setIsCustomConcern(false);
    setIsModalOpen(true);
    resetFlashMessages();
  };

  const openEdit = (product: ProductAdminListItem) => {
    setMode("edit");
    setSelectedProductId(product.id);
    setFormValues(toFormValues(product));
    setIsCustomCategory(!availableCategories.includes(product.category));
    setIsCustomConcern(!availableConcerns.includes(product.concerns.join(", ")));
    setIsModalOpen(true);
    resetFlashMessages();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetFlashMessages();
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
    value: ProductFormValues[K],
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
        setError(
          "error" in payload
            ? (payload.error ?? "Không thể lưu sản phẩm.")
            : "Không thể lưu sản phẩm.",
        );
        return;
      }

      const product = (payload as { product: ProductAdminListItem }).product;
      const nextItems = [
        ...items.filter(
          (item) => item.id !== selectedProductId && item.id !== product.id,
        ),
        product,
      ]
        .filter((item) => matchesClientQuery(item, query))
        .sort((left, right) => {
          if (left.displayOrder !== right.displayOrder) {
            return left.displayOrder - right.displayOrder;
          }

          return left.name.localeCompare(right.name);
        });

      setItems(nextItems);
      setSelectedProductId(product.id);
      setMessage(
        mode === "create" ? "Đã tạo sản phẩm mới." : "Đã cập nhật sản phẩm.",
      );
      setIsModalOpen(false);

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
    if (!archiveTarget) {
      return;
    }

    setIsArchiving(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/products/${encodeURIComponent(archiveTarget.id)}`,
        {
          method: "DELETE",
        },
      );

      const payload = (await response.json()) as
        | { product: ProductAdminListItem }
        | { error?: string };

      if (!response.ok) {
        setError(
          "error" in payload
            ? (payload.error ?? "Không thể ẩn sản phẩm.")
            : "Không thể ẩn sản phẩm.",
        );
        return;
      }

      const product = (payload as { product: ProductAdminListItem }).product;
      const nextItems = items
        .map((item) => (item.id === product.id ? product : item))
        .filter((item) => matchesClientQuery(item, query));

      setItems(nextItems);
      setArchiveTarget(null);
      setMessage("Đã chuyển sản phẩm sang trạng thái inactive.");

      if (selectedProductId === product.id) {
        setIsModalOpen(false);
      }
    } catch {
      setError("Không thể kết nối để cập nhật trạng thái sản phẩm.");
    } finally {
      setIsArchiving(false);
    }
  };

  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    target: "primary" | "gallery",
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
          "error" in payload
            ? (payload.error ?? "Không thể tải ảnh lên.")
            : "Không thể tải ảnh lên.",
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

  const categorySelectValue = isCustomCategory
    ? CUSTOM_OPTION_VALUE
    : availableCategories.includes(formValues.category)
      ? formValues.category
      : "";
  const concernSelectValue = isCustomConcern
    ? CUSTOM_OPTION_VALUE
    : availableConcerns.includes(formValues.concerns)
      ? formValues.concerns
      : "";

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-[var(--color-foreground-soft)]">
            {items.length} sản phẩm phù hợp
          </p>
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">
            Trang {currentPage}/{totalPages}
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          Thêm sản phẩm
        </Button>
      </div>

      {message ? (
        <p className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-success)]">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-danger)]">
          {error}
        </p>
      ) : null}

      {items.length > 0 ? (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <tr>
                  <TableHeaderCell>STT</TableHeaderCell>
                  <TableHeaderCell>Tên sản phẩm</TableHeaderCell>
                  <TableHeaderCell>Brand</TableHeaderCell>
                  <TableHeaderCell>Danh mục</TableHeaderCell>
                  <TableHeaderCell>Concern</TableHeaderCell>
                  <TableHeaderCell>Giá bán</TableHeaderCell>
                  <TableHeaderCell>Giá gốc</TableHeaderCell>
                  <TableHeaderCell>Số lượng</TableHeaderCell>
                  <TableHeaderCell>Trạng thái</TableHeaderCell>
                  <TableHeaderCell>Tồn kho</TableHeaderCell>
                  <TableHeaderCell className="text-right">Hành động</TableHeaderCell>
                </tr>
              </TableHead>
              <TableBody>
                {paginatedItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{(currentPage - 1) * PAGE_SIZE + index + 1}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-[var(--color-foreground)]">{item.name}</p>
                        <p className="text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
                          {item.id} · /products/{item.slug}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{item.brand || "-"}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="max-w-[180px]">
                      <p className="line-clamp-2 text-sm text-[var(--color-foreground-soft)]">
                        {item.concerns.join(", ")}
                      </p>
                    </TableCell>
                    <TableCell>{item.price.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>
                      {item.compareAtPrice !== null
                        ? `${item.compareAtPrice.toLocaleString("vi-VN")}đ`
                        : "-"}
                    </TableCell>
                    <TableCell>{item.quantity ?? "-"}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStockVariant(item.stockStatus)}>{item.stockStatus}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="secondary" onClick={() => openEdit(item)}>
                          Sửa
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setArchiveTarget(item)}
                          disabled={item.status === "inactive"}
                        >
                          Ẩn
                        </Button>
                      </div>
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
          description="Thử đổi bộ lọc hoặc tạo mới sản phẩm để bắt đầu quản lý catalog dễ hơn."
          actionLabel="Thêm sản phẩm"
          actionProps={{ onClick: openCreate }}
        />
      )}

      {items.length > PAGE_SIZE ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white px-4 py-3">
          <p className="text-sm text-[var(--color-foreground-soft)]">
            Hiển thị {(currentPage - 1) * PAGE_SIZE + 1}-
            {Math.min(currentPage * PAGE_SIZE, items.length)} / {items.length} sản phẩm
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage((current) => Math.max(1, current - 1))}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage((current) => Math.min(totalPages, current + 1))}
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
        </div>
      ) : null}

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/35 px-4 py-8 backdrop-blur-[2px]">
          <div className="absolute inset-0" onClick={closeModal} />
          <Card className="relative z-10 max-h-[calc(100vh-4rem)] w-full max-w-4xl overflow-y-auto p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">
                  {mode === "create" ? "Tạo sản phẩm" : "Chỉnh sửa sản phẩm"}
                </p>
                <h2 className="mt-1 text-3xl text-[var(--color-foreground)]">
                  {mode === "create"
                    ? "Sản phẩm mới"
                    : formValues.name || selectedProduct?.name || "Sản phẩm"}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                {mode === "edit" && selectedProduct ? (
                  <div className="text-right text-sm text-[var(--color-foreground-soft)]">
                    <p>Cập nhật gần nhất</p>
                    <p className="font-medium text-[var(--color-foreground)]">
                      {formatCompactDate(selectedProduct.updatedAt)}
                    </p>
                  </div>
                ) : null}
                <Button variant="secondary" size="sm" onClick={closeModal}>
                  Đóng
                </Button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
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
              <Field label="Brand">
                <div className="space-y-2">
                  <Input
                    list="modal-product-brand-options"
                    value={formValues.brand}
                    onChange={(event) => handleFieldChange("brand", event.target.value)}
                    disabled={isSaving}
                    placeholder="La Roche-Posay"
                  />
                  <datalist id="modal-product-brand-options">
                    {availableBrands.map((brand) => (
                      <option key={brand} value={brand} />
                    ))}
                  </datalist>
                </div>
              </Field>
              <Field label="Danh mục">
                <div className="space-y-2">
                  <select
                    className="h-12 w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-foreground)]"
                    value={categorySelectValue}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      if (nextValue === CUSTOM_OPTION_VALUE) {
                        setIsCustomCategory(true);
                        handleFieldChange("category", "");
                        return;
                      }
                      setIsCustomCategory(false);
                      handleFieldChange("category", nextValue);
                    }}
                    disabled={isSaving}
                  >
                    <option value="">Chọn danh mục cũ</option>
                    {availableCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                    <option value={CUSTOM_OPTION_VALUE}>+ Khác</option>
                  </select>
                  {isCustomCategory ? (
                    <Input
                      value={formValues.category}
                      onChange={(event) => handleFieldChange("category", event.target.value)}
                      disabled={isSaving}
                      placeholder="Nhập danh mục mới"
                    />
                  ) : null}
                </div>
              </Field>
              <Field label="Concern">
                <div className="space-y-2">
                  <select
                    className="h-12 w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-foreground)]"
                    value={concernSelectValue}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      if (nextValue === CUSTOM_OPTION_VALUE) {
                        setIsCustomConcern(true);
                        handleFieldChange("concerns", "");
                        return;
                      }
                      setIsCustomConcern(false);
                      handleFieldChange("concerns", nextValue);
                    }}
                    disabled={isSaving}
                  >
                    <option value="">Chọn concern cũ</option>
                    {availableConcerns.map((concern) => (
                      <option key={concern} value={concern}>
                        {concern}
                      </option>
                    ))}
                    <option value={CUSTOM_OPTION_VALUE}>+ Khác</option>
                  </select>
                  {isCustomConcern ? (
                    <Input
                      value={formValues.concerns}
                      onChange={(event) => handleFieldChange("concerns", event.target.value)}
                      disabled={isSaving}
                      placeholder="Nhập concern mới"
                    />
                  ) : null}
                </div>
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
                </select>
              </Field>
            </div>

            {uploadMessage ? (
              <p className="mt-4 text-sm text-[var(--color-success)]">{uploadMessage}</p>
            ) : null}
            {uploadError ? (
              <p className="mt-4 text-sm text-[var(--color-danger)]">{uploadError}</p>
            ) : null}
            {error ? <p className="mt-4 text-sm text-[var(--color-danger)]">{error}</p> : null}

            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                onClick={handleSave}
                loading={isSaving || isUploadingPrimary || isUploadingGallery}
              >
                {mode === "create" ? "Tạo sản phẩm" : "Lưu thay đổi"}
              </Button>
              {mode === "edit" && selectedProduct ? (
                <Button
                  variant="secondary"
                  onClick={() => setArchiveTarget(selectedProduct)}
                  disabled={
                    isSaving ||
                    isUploadingPrimary ||
                    isUploadingGallery ||
                    isArchiving ||
                    formValues.status === "inactive"
                  }
                >
                  Ẩn sản phẩm
                </Button>
              ) : null}
            </div>
          </Card>
        </div>
      ) : null}

      {archiveTarget ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/35 px-4 backdrop-blur-[2px]">
          <div className="absolute inset-0" onClick={() => setArchiveTarget(null)} />
          <Card className="relative z-10 w-full max-w-md space-y-4 p-5">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">
                Xác nhận ẩn sản phẩm
              </p>
              <h3 className="text-2xl text-[var(--color-foreground)]">{archiveTarget.name}</h3>
              <p className="text-sm text-[var(--color-foreground-soft)]">
                Sản phẩm sẽ được chuyển sang trạng thái inactive và không còn hiện trong catalog active.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => setArchiveTarget(null)} disabled={isArchiving}>
                Hủy
              </Button>
              <Button onClick={handleArchive} loading={isArchiving}>
                Xác nhận ẩn
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
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
