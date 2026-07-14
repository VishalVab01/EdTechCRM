import { apiRequest } from "./apiClient.js";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || ""}/api/invoices`;

async function request(path = "", options = {}) {
  return apiRequest(API_BASE, path, options, "Invoice API request failed");
}

export function getInvoices(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return request(query ? `?${query}` : "");
}

export function getInvoiceById(id) {
  return request(`/${id}`);
}

export function createInvoice(payload) {
  return request("", { method: "POST", body: JSON.stringify(payload) });
}

export function updateInvoice(id, payload) {
  return request(`/${id}`, { method: "PUT", body: JSON.stringify(payload) });
}

export function deleteInvoice(id) {
  return request(`/${id}`, { method: "DELETE" });
}

export function updateInvoicePayment(id, payload) {
  return request(`/${id}/payment`, { method: "PATCH", body: JSON.stringify(payload) });
}

export function getInvoiceSummary() {
  return request("/stats/summary");
}

export const PAYMENT_STATUSES = ["Pending", "Partially Paid", "Paid", "Overdue", "Cancelled"];
export const PAYMENT_METHODS = ["Cash", "UPI", "Bank Transfer", "Card", "Cheque", "Other"];
