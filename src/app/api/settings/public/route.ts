import { NextResponse } from "next/server";

import { getPublicSettings } from "@/services/settings";
import type { PublicSettingsResponse } from "@/types";

export async function GET() {
  try {
    const settings = await getPublicSettings();
    const response: PublicSettingsResponse = { settings };

    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load public settings.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
