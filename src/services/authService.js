import { apiRequest, clearAuth, getStoredUser, storeAuth } from "./apiClient.js";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || ""}/api/auth`;

export async function login(email, password) {
  const data = await apiRequest(API_BASE, "/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }, "Login failed");
  storeAuth(data.token, data.user);
  return data;
}

export function logout() {
  clearAuth();
}

export function currentUser() {
  return getStoredUser();
}

export function getMe() {
  return apiRequest(API_BASE, "/me", {}, "Session check failed");
}

export function getUsers() {
  return apiRequest(API_BASE, "/users", {}, "User API request failed");
}

export function createUser(payload) {
  return apiRequest(API_BASE, "/users", { method: "POST", body: JSON.stringify(payload) }, "User API request failed");
}

export function updateUser(id, payload) {
  return apiRequest(API_BASE, `/users/${id}`, { method: "PUT", body: JSON.stringify(payload) }, "User API request failed");
}
