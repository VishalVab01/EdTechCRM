const API_BASE = `${import.meta.env.VITE_API_BASE_URL || ""}/api/applications`;

async function request(path = "", options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      "x-demo-user": "demo-admin",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Application API request failed");
  }

  return data;
}

export function getApplications(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  const query = params.toString();
  return request(query ? `?${query}` : "");
}

export function getApplicationById(id) {
  return request(`/${id}`);
}

export function createApplication(payload) {
  return request("", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateApplication(id, payload) {
  return request(`/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteApplication(id) {
  return request(`/${id}`, {
    method: "DELETE",
  });
}

export function updateApplicationStatus(id, status, remarks = "") {
  return request(`/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, remarks }),
  });
}

export function bulkUpdateApplicationStatus(applicationIds, status, remarks = "") {
  return request("/bulk/status", {
    method: "PATCH",
    body: JSON.stringify({ applicationIds, status, remarks }),
  });
}

export const APPLICATION_STATUSES = ["Pending", "Under Review", "Approved", "Rejected", "On Hold"];
export const APPLICATION_SOURCES = ["Website", "Counselor", "Referral", "Walk-in", "Campaign", "Other"];
