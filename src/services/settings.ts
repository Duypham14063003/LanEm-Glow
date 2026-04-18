import { appendSheetRow, assertRequiredHeaders, readSheetRows, readSheetRowsWithIndex, updateSheetRow } from "@/lib/sheets";
import { invalidateCache, withCache } from "@/lib/cache";
import type { AdminSettingsMutationInput, PublicSettings, RawSheetRow } from "@/types";

const SETTINGS_SHEET = "settings";
const SETTINGS_REQUIRED_HEADERS = ["key", "value"] as const;

type IndexedSettingsRow = {
  rowNumber: number;
  row: RawSheetRow;
};

type SettingsDependencies = {
  appendRow: (tabName: string, row: string[]) => Promise<void>;
  readRows: () => Promise<RawSheetRow[]>;
  readRowsWithIndex: () => Promise<IndexedSettingsRow[]>;
  updateRow: (tabName: string, rowNumber: number, row: string[]) => Promise<void>;
};

const defaultDependencies: SettingsDependencies = {
  appendRow: appendSheetRow,
  readRows: async () => {
    const rows = await readSheetRows(SETTINGS_SHEET);
    assertRequiredHeaders(rows, [...SETTINGS_REQUIRED_HEADERS]);
    return rows;
  },
  readRowsWithIndex: async () => {
    const rows = await readSheetRowsWithIndex(SETTINGS_SHEET);
    const normalized = rows.map((row) => ({
      rowNumber: row.rowNumber,
      row: row.record,
    }));
    assertRequiredHeaders(
      normalized.map((item) => item.row),
      [...SETTINGS_REQUIRED_HEADERS]
    );
    return normalized;
  },
  updateRow: updateSheetRow,
};

export class SettingsAdminError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, options?: { statusCode?: number; code?: string }) {
    super(message);
    this.name = "SettingsAdminError";
    this.statusCode = options?.statusCode ?? 400;
    this.code = options?.code ?? "ADMIN_SETTINGS_FAILED";
  }
}

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
  const rows = await defaultDependencies.readRows();
  return mapSettingsRows(rows);
}

export async function getPublicSettings(options?: {
  skipCache?: boolean;
}): Promise<PublicSettings> {
  return withCache("settings:public", loadPublicSettingsFromSheets, {
    skipCache: options?.skipCache,
  });
}

export async function getAdminSettings(
  overrides: Partial<SettingsDependencies> = {}
): Promise<PublicSettings> {
  const dependencies = {
    ...defaultDependencies,
    ...overrides,
  };

  const rows = await dependencies.readRows();
  return mapSettingsRows(rows);
}

export function normalizeAdminSettingsInput(input: unknown): Required<AdminSettingsMutationInput> {
  if (!input || typeof input !== "object") {
    throw new SettingsAdminError("Dữ liệu cài đặt không hợp lệ.", {
      statusCode: 400,
      code: "INVALID_ADMIN_SETTINGS_PAYLOAD",
    });
  }

  const payload = input as AdminSettingsMutationInput;

  return {
    brandPhone: payload.brandPhone?.trim() ?? "",
    zaloUrl: payload.zaloUrl?.trim() ?? "",
    publicAnnouncement: payload.publicAnnouncement?.trim() ?? "",
    primaryCtaLabel: payload.primaryCtaLabel?.trim() ?? "",
    secondaryCtaLabel: payload.secondaryCtaLabel?.trim() ?? "",
  };
}

export async function updateAdminSettings(
  input: unknown,
  overrides: Partial<SettingsDependencies> = {}
): Promise<PublicSettings> {
  const dependencies = {
    ...defaultDependencies,
    ...overrides,
  };

  const normalized = normalizeAdminSettingsInput(input);
  const rows = await dependencies.readRowsWithIndex();
  const byKey = new Map(rows.map((entry) => [entry.row.key.trim(), entry]));

  const nextEntries = [
    { key: "brand_phone", value: normalized.brandPhone },
    { key: "zalo_url", value: normalized.zaloUrl },
    { key: "public_announcement", value: normalized.publicAnnouncement },
    { key: "primary_cta_label", value: normalized.primaryCtaLabel },
    { key: "secondary_cta_label", value: normalized.secondaryCtaLabel },
  ] as const;

  for (const entry of nextEntries) {
    const existing = byKey.get(entry.key);

    if (existing) {
      await dependencies.updateRow(SETTINGS_SHEET, existing.rowNumber, [entry.key, entry.value]);
    } else {
      await dependencies.appendRow(SETTINGS_SHEET, [entry.key, entry.value]);
    }
  }

  invalidateCache("settings:public");

  return {
    brandPhone: normalized.brandPhone || null,
    zaloUrl: normalized.zaloUrl || null,
    publicAnnouncement: normalized.publicAnnouncement || null,
    primaryCtaLabel: normalized.primaryCtaLabel || null,
    secondaryCtaLabel: normalized.secondaryCtaLabel || null,
  };
}
