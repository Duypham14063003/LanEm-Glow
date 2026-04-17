import { withCache } from "@/lib/cache";
import { assertRequiredHeaders, readSheetRows } from "@/lib/sheets";
import type { PublicSettings, RawSheetRow } from "@/types";

const SETTINGS_SHEET = "settings";
const SETTINGS_REQUIRED_HEADERS = ["key", "value"] as const;

function mapSettingsRows(rows: RawSheetRow[]): PublicSettings {
  const values = new Map(rows.map((row) => [row.key.trim(), row.value.trim()]));

  return {
    brandPhone: values.get("brand_phone") ?? null,
    zaloUrl: values.get("zalo_url") ?? null,
    publicAnnouncement: values.get("public_announcement") ?? null,
    primaryCtaLabel: values.get("primary_cta_label") ?? null,
    secondaryCtaLabel: values.get("secondary_cta_label") ?? null,
  };
}

async function loadPublicSettingsFromSheets(): Promise<PublicSettings> {
  const rows = await readSheetRows(SETTINGS_SHEET);
  assertRequiredHeaders(rows, [...SETTINGS_REQUIRED_HEADERS]);
  return mapSettingsRows(rows);
}

export async function getPublicSettings(options?: {
  skipCache?: boolean;
}): Promise<PublicSettings> {
  return withCache("settings:public", loadPublicSettingsFromSheets, {
    skipCache: options?.skipCache,
  });
}
