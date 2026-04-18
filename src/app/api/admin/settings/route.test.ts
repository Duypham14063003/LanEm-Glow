import assert from "node:assert/strict";
import test from "node:test";

import { GET, PATCH } from "@/app/api/admin/settings/route";
import {
  resetGetAdminSettingsHandlerForTesting,
  resetUpdateAdminSettingsHandlerForTesting,
  setGetAdminSettingsHandlerForTesting,
  setUpdateAdminSettingsHandlerForTesting,
} from "@/app/api/admin/settings/handlers";
import { SettingsAdminError } from "@/services/settings";
import type { PublicSettings } from "@/types";

const settings: PublicSettings = {
  brandPhone: "0901234567",
  zaloUrl: "https://zalo.me/0901234567",
  publicAnnouncement: "Thong bao",
  primaryCtaLabel: "Xem sản phẩm",
  secondaryCtaLabel: "Nhan tu van",
};

test("GET /api/admin/settings returns admin settings payload", async () => {
  setGetAdminSettingsHandlerForTesting(async () => settings);

  const response = await GET();
  const payload = (await response.json()) as { settings: PublicSettings };

  assert.equal(response.status, 200);
  assert.equal(payload.settings.brandPhone, settings.brandPhone);

  resetGetAdminSettingsHandlerForTesting();
});

test("PATCH /api/admin/settings returns 400 for invalid JSON", async () => {
  const response = await PATCH(
    new Request("http://localhost:3000/api/admin/settings", {
      method: "PATCH",
      body: "{bad",
      headers: { "content-type": "application/json" },
    })
  );
  const payload = (await response.json()) as { code: string };

  assert.equal(response.status, 400);
  assert.equal(payload.code, "INVALID_JSON");
});

test("PATCH /api/admin/settings returns updated settings payload", async () => {
  setUpdateAdminSettingsHandlerForTesting(async () => settings);

  const response = await PATCH(
    new Request("http://localhost:3000/api/admin/settings", {
      method: "PATCH",
      body: JSON.stringify(settings),
      headers: { "content-type": "application/json" },
    })
  );
  const payload = (await response.json()) as { settings: PublicSettings };

  assert.equal(response.status, 200);
  assert.equal(payload.settings.primaryCtaLabel, settings.primaryCtaLabel);

  resetUpdateAdminSettingsHandlerForTesting();
});

test("PATCH /api/admin/settings maps settings validation errors", async () => {
  setUpdateAdminSettingsHandlerForTesting(async () => {
    throw new SettingsAdminError("Du lieu khong hop le.", {
      statusCode: 400,
      code: "INVALID_ADMIN_SETTINGS_PAYLOAD",
    });
  });

  const response = await PATCH(
    new Request("http://localhost:3000/api/admin/settings", {
      method: "PATCH",
      body: JSON.stringify(settings),
      headers: { "content-type": "application/json" },
    })
  );
  const payload = (await response.json()) as { code: string };

  assert.equal(response.status, 400);
  assert.equal(payload.code, "INVALID_ADMIN_SETTINGS_PAYLOAD");

  resetUpdateAdminSettingsHandlerForTesting();
});
