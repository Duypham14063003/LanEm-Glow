import assert from "node:assert/strict";
import test from "node:test";

import {
  getAdminSettings,
  normalizeAdminSettingsInput,
  SettingsAdminError,
  updateAdminSettings,
} from "@/services/settings";

test("normalizeAdminSettingsInput rejects invalid payloads", () => {
  assert.throws(() => normalizeAdminSettingsInput(null), SettingsAdminError);
});

test("getAdminSettings maps known settings keys from rows", async () => {
  const settings = await getAdminSettings({
    readRows: async () => [
      { key: "brand_phone", value: "0901234567" },
      { key: "primary_cta_label", value: "Xem sản phẩm" },
    ],
  });

  assert.equal(settings.brandPhone, "0901234567");
  assert.equal(settings.primaryCtaLabel, "Xem sản phẩm");
});

test("updateAdminSettings updates known rows and appends missing keys", async () => {
  const updates: Array<{ rowNumber: number; row: string[] }> = [];
  const appends: string[][] = [];

  const settings = await updateAdminSettings(
    {
      brandPhone: "0901234567",
      zaloUrl: "https://zalo.me/0901234567",
      publicAnnouncement: "Thong bao",
      primaryCtaLabel: "Mua ngay",
      secondaryCtaLabel: "Nhan tu van",
    },
    {
      appendRow: async (_tabName, row) => {
        appends.push(row);
      },
      readRowsWithIndex: async () => [
        { rowNumber: 2, row: { key: "brand_phone", value: "old" } },
        { rowNumber: 3, row: { key: "primary_cta_label", value: "old" } },
      ],
      readRows: async () => [],
      updateRow: async (_tabName, rowNumber, row) => {
        updates.push({ rowNumber, row });
      },
    }
  );

  assert.equal(settings.brandPhone, "0901234567");
  assert.equal(updates.length, 2);
  assert.equal(appends.length, 3);
});
