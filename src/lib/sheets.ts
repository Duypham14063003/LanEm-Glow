import { google } from "googleapis";

import { assertRequiredEnv } from "@/lib/validation";
import type { RawSheetRow } from "@/types";

const GOOGLE_SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

function stripQuotes(value: string): string {
  return value.replace(/^["']|["']$/g, "").trim();
}

function getSheetsConfig() {
  const rawEmail = assertRequiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL", process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
  const rawKey = assertRequiredEnv("GOOGLE_PRIVATE_KEY", process.env.GOOGLE_PRIVATE_KEY);
  const rawSheetId = assertRequiredEnv("GOOGLE_SHEET_ID", process.env.GOOGLE_SHEET_ID);

  return {
    clientEmail: stripQuotes(rawEmail),
    // Strip surrounding quotes first, then convert literal \n to real newlines
    privateKey: stripQuotes(rawKey).replace(/\\n/g, "\n"),
    sheetId: stripQuotes(rawSheetId),
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

export interface IndexedSheetRow {
  rowNumber: number;
  record: RawSheetRow;
}

export async function readSheetRows(tabName: string): Promise<RawSheetRow[]> {
  const indexedRows = await readSheetRowsWithIndex(tabName);
  return indexedRows.map((row) => row.record);
}

export async function readSheetHeaders(tabName: string): Promise<string[]> {
  const { client, sheetId } = await getSheetsClient();
  const response = await client.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tabName}!1:1`,
  });

  const headerRow = response.data.values?.[0] ?? [];
  return headerRow.map((cell) => normalizeHeader(`${cell}`));
}

export async function readSheetRowsWithIndex(tabName: string): Promise<IndexedSheetRow[]> {
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
    .map((row, index) => ({
      rowNumber: index + 2,
      cells: row.map((cell) => `${cell}`),
    }))
    .filter((row) => row.cells.some((cell) => cell.trim().length > 0))
    .map((row) => ({
      rowNumber: row.rowNumber,
      record: rowToRecord(headers, row.cells),
    }));
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

export async function appendSheetRow(tabName: string, row: string[]) {
  const { client, sheetId } = await getSheetsClient();

  await client.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: tabName,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [row],
    },
  });
}

export function buildSheetRow(headers: string[], record: RawSheetRow): string[] {
  return headers.map((header) => record[header] ?? "");
}

export async function appendSheetRecord(tabName: string, record: RawSheetRow) {
  const headers = await readSheetHeaders(tabName);
  await appendSheetRow(tabName, buildSheetRow(headers, record));
}

export async function updateSheetRow(tabName: string, rowNumber: number, row: string[]) {
  const { client, sheetId } = await getSheetsClient();

  await client.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `${tabName}!A${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [row],
    },
  });
}

export async function updateSheetRecord(tabName: string, rowNumber: number, record: RawSheetRow) {
  const headers = await readSheetHeaders(tabName);
  await updateSheetRow(tabName, rowNumber, buildSheetRow(headers, record));
}
