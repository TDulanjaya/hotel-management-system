import { authenticatedFetch } from "./authApi";

export type UserPayload = {
  name: string;
  email: string;
  password?: string;
  role: string;
  active?: boolean;
};

export async function getUsers() {
  const response = await authenticatedFetch("/api/users");
  if (!response.ok) throw new Error("Failed to fetch users");
  const data = await response.json();
  return data?.content !== undefined ? data.content : data;
}

export async function getUserById(id: string) {
  const response = await authenticatedFetch(`/api/users/${id}`);
  if (!response.ok) throw new Error("Failed to fetch user");
  return response.json();
}

export async function createUser(payload: UserPayload) {
  const response = await authenticatedFetch("/api/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create user");
  }
  return response.json();
}

export async function updateUser(id: string, payload: UserPayload) {
  const response = await authenticatedFetch(`/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update user");
  }
  return response.json();
}

export async function deactivateUser(id: string) {
  const response = await authenticatedFetch(`/api/users/${id}/deactivate`, {
    method: "PUT",
  });
  if (!response.ok) throw new Error("Failed to deactivate user");
  return response.json();
}

export async function deleteUser(id: string) {
  const response = await authenticatedFetch(`/api/users/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete user");
}