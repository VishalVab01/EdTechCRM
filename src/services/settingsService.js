import { apiRequest } from "./apiClient.js";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || ""}/api/settings`;

export function getWorkspaceSettings() {
  return apiRequest(API_BASE, "", {}, "Settings API request failed");
}

export function updateWorkspaceSettings(payload) {
  return apiRequest(API_BASE, "", { method: "PUT", body: JSON.stringify(payload) }, "Settings API request failed");
}
