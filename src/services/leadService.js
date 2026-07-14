import { apiRequest } from "./apiClient.js";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || ""}/api/leads`;

async function request(path = "", options = {}) {
  return apiRequest(API_BASE, path, options, "Lead API request failed");
}

export function getLeads(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  const query = params.toString();
  return request(query ? `?${query}` : "");
}

export function createLead(payload) {
  return request("", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateLead(id, payload) {
  return request(`/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteLead(id) {
  return request(`/${id}`, {
    method: "DELETE",
  });
}

export function updateLeadStatus(id, status) {
  return request(`/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function updateLeadNotes(id, notes) {
  return request(`/${id}/notes`, {
    method: "PATCH",
    body: JSON.stringify({ notes }),
  });
}

export const LEAD_STATUSES = ["New", "Contacted", "Demo Scheduled", "Converted", "Lost"];
export const LEAD_SOURCES = ["Website", "Referral", "Instagram", "Facebook", "Google Ads", "Walk-in", "Other"];
