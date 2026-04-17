import test from "node:test";
import assert from "node:assert/strict";

import { validateQuickOrderForm } from "@/hooks/use-quick-order";
import type { QuickOrderFormValues, SelectedProduct } from "@/types";

const validValues: QuickOrderFormValues = {
  phone: "0912345678",
  name: "Lan",
  note: "Da nhay cam",
};

const selectedProducts: SelectedProduct[] = [
  {
    id: "P-1",
    slug: "serum-a",
    name: "Serum A",
    price: 100000,
    imageUrl: "https://example.com/p1.jpg",
    stockStatus: "in_stock",
  },
];

test("validateQuickOrderForm accepts a valid storefront quick order payload", () => {
  const result = validateQuickOrderForm(validValues, selectedProducts);

  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
});

test("validateQuickOrderForm rejects missing phone and missing selected products", () => {
  const result = validateQuickOrderForm(
    {
      phone: "",
      name: "",
      note: "",
    },
    []
  );

  assert.equal(result.isValid, false);
  assert.match(result.errors.phone ?? "", /bắt buộc/);
  assert.match(result.errors.selectedProducts ?? "", /ít nhất 1 sản phẩm/);
});

test("validateQuickOrderForm rejects invalid Vietnam mobile phone format", () => {
  const result = validateQuickOrderForm(
    {
      phone: "0123",
      name: "",
      note: "",
    },
    selectedProducts
  );

  assert.equal(result.isValid, false);
  assert.match(result.errors.phone ?? "", /định dạng/);
});
