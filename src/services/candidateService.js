import { apiRequest } from "./apiClient.js";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || ""}/api/candidates`;

async function request(path = "", options = {}) {
  return apiRequest(API_BASE, path, options, "Candidate API request failed");
}

export function getCandidates(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return request(query ? `?${query}` : "");
}

export function getCandidateById(id) {
  return request(`/${id}`);
}

export function createCandidate(payload) {
  return request("", { method: "POST", body: JSON.stringify(payload) });
}

export function updateCandidate(id, payload) {
  return request(`/${id}`, { method: "PUT", body: JSON.stringify(payload) });
}

export function deleteCandidate(id) {
  return request(`/${id}`, { method: "DELETE" });
}

export function updateCandidateStatus(id, status, remarks = "") {
  return request(`/${id}/status`, { method: "PATCH", body: JSON.stringify({ status, remarks }) });
}

export function updateCandidateInterview(id, payload) {
  return request(`/${id}/interview`, { method: "PATCH", body: JSON.stringify(payload) });
}

export function bulkUpdateCandidateStatus(candidateIds, status, remarks = "") {
  return request("/bulk/status", { method: "PATCH", body: JSON.stringify({ candidateIds, status, remarks }) });
}

export const CANDIDATE_STATUSES = ["Applied", "Shortlisted", "Interview Scheduled", "Selected", "Rejected", "On Hold"];
export const CANDIDATE_SOURCES = ["Website", "LinkedIn", "Referral", "Job Portal", "Walk-in", "Other"];
export const INTERVIEW_MODES = ["Online", "Offline", "Phone Call"];
