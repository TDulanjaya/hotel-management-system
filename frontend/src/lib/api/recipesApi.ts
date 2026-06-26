import { authenticatedFetch } from "./authApi";

export async function getAll() {
  const response = await authenticatedFetch("/api/recipes");
  if (!response.ok) throw new Error("Failed to fetch recipes");
  return response.json();
}

export async function getById(id: string) {
  const response = await authenticatedFetch(`/api/recipes/${id}`);
  if (!response.ok) throw new Error("Failed to fetch recipe");
  return response.json();
}

export async function create(data: any) {
  const response = await authenticatedFetch("/api/recipes", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create recipe");
  return response.json();
}

export async function update(id: string, data: any) {
  const response = await authenticatedFetch(`/api/recipes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update recipe");
  return response.json();
}

export async function remove(id: string) {
  const response = await authenticatedFetch(`/api/recipes/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete recipe");
}
