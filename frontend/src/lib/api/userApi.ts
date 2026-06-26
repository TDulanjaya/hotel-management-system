import { authenticatedFetch } from "./authApi";

export async function getUsers() {
  const res = await authenticatedFetch("/api/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function getUserById(id: string) {
  const res = await authenticatedFetch(`/api/users/${id}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export async function createUser(data: any) {
  const res = await authenticatedFetch("/api/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
}

export async function updateUser(id: string, data: any) {
  const res = await authenticatedFetch(`/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}

export async function deactivateUser(id: string) {
  const res = await authenticatedFetch(`/api/users/${id}/deactivate`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Failed to deactivate user");
}

export async function deleteUser(id: string) {
  const res = await authenticatedFetch(`/api/users/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to delete user: ${errorText || res.statusText}`);
  }
}
