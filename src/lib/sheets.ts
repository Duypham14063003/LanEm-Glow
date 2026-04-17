import { google } from "googleapis";

import { assertRequiredEnv } from "@/lib/validation";
import type { RawSheetRow } from "@/types";

const GOOGLE_SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

function getSheetsConfig() {
  return {
    clientEmail: assertRequiredEnv(
      "GOOGLE_SERVICE_ACCOUNT_EMAIL",
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    ),
    privateKey: assertRequiredEnv("GOOGLE_PRIVATE_KEY", process.env.GOOGLE_PRIVATE_KEY).replace(
      /\\n/g,
      "\n"
    ),
    sheetId: assertRequiredEnv("GOOGLE_SHEET_ID", process.env.GOOGLE_SHEET_ID),
  };
}

async function getSheetsClient() {
  const config = getSheetsConfig();

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: config.clientEmail,
      private_key: config.privateKey,
    },
    scopes: GOOGLE_SCOPES,
  });

  return {
    client: google.sheets({
      version: "v4",
      auth,
    }),
    sheetId: config.sheetId,
  };
}

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase();
}

function rowToRecord(headers: string[], row: string[]): RawSheetRow {
  return headers.reduce<RawSheetRow>((record, header, index) => {
    record[header] = row[index]?.trim() ?? "";
    return record;
  }, {});
}

export async function readSheetRows(tabName: string): Promise<RawSheetRow[]> {
  const { client, sheetId } = await getSheetsClient();
  const response = await client.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: tabName,
  });

  const values = response.data.values ?? [];
  if (values.length === 0) {
    return [];
  }

  const [headerRow, ...dataRows] = values;
  const headers = headerRow.map(normalizeHeader);

  return dataRows
    .filter((row) => row.some((cell) => `${cell}`.trim().length > 0))
    .map((row) => rowToRecord(headers, row.map((cell) => `${cell}`)));
}

export function assertRequiredHeaders(rows: RawSheetRow[], requiredHeaders: string[]) {
  if (rows.length === 0) {
    return;
  }

  const headers = new Set(Object.keys(rows[0]));
  const missing = requiredHeaders.filter((header) => !headers.has(header));

  if (missing.length > 0) {
    throw new Error(`Missing required sheet columns: ${missing.join(", ")}`);
  }
}
