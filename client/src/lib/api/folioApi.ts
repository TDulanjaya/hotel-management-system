import { authenticatedFetch } from "./authApi";

export async function getAll() {
  const response = await authenticatedFetch("/api/folios");
  if (!response.ok) throw new Error("Failed to fetch folios");
  return response.json();
}

export async function getById(id: string) {
  const response = await authenticatedFetch(`/api/folios/${id}`);
  if (!response.ok) throw new Error("Failed to fetch folio");
  return response.json();
}

export async function create(data: any) {
  const response = await authenticatedFetch("/api/folios", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create folio");
  return response.json();
}

export async function update(id: string, data: any) {
  const response = await authenticatedFetch(`/api/folios/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update folio");
  return response.json();
}

export async function remove(id: string) {
  const response = await authenticatedFetch(`/api/folios/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete folio");
}
