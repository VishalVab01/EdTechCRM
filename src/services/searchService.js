import { apiRequest } from "./apiClient.js";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || ""}/api/search`;

export function globalSearch(search) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  const query = params.toString();
  return apiRequest(API_BASE, query ? `?${query}` : "", {}, "Search API request failed");
}
