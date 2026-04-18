import { getAdminSettings, updateAdminSettings } from "@/services/settings";

export let getAdminSettingsHandler = getAdminSettings;
export let updateAdminSettingsHandler = updateAdminSettings;

export function setGetAdminSettingsHandlerForTesting(handler: typeof getAdminSettings) {
  getAdminSettingsHandler = handler;
}

export function resetGetAdminSettingsHandlerForTesting() {
  getAdminSettingsHandler = getAdminSettings;
}

export function setUpdateAdminSettingsHandlerForTesting(handler: typeof updateAdminSettings) {
  updateAdminSettingsHandler = handler;
}

export function resetUpdateAdminSettingsHandlerForTesting() {
  updateAdminSettingsHandler = updateAdminSettings;
}
