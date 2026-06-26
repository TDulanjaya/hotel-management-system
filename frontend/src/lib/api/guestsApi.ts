import { authenticatedFetch } from "./authApi";

export async function getGuests() {
  const response = await authenticatedFetch("/api/guests");
  if (!response.ok) throw new Error("Failed to fetch guests");
  return response.json();
}

export async function getGuestById(id: string) {
  const response = await authenticatedFetch(`/api/guests/${id}`);
  if (!response.ok) throw new Error("Failed to fetch guest");
  return response.json();
}

export async function createGuest(data: any) {
  const response = await authenticatedFetch("/api/guests", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create guest");
  return response.json();
}

export async function updateGuest(id: string, data: any) {
  const response = await authenticatedFetch(`/api/guests/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update guest");
  return response.json();
}

export async function deleteGuest(id: string) {
  const response = await authenticatedFetch(`/api/guests/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete guest");
}
