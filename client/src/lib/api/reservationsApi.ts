import { authenticatedFetch } from "./authApi";

export async function getReservations() {
  const response = await authenticatedFetch("/api/reservations");
  if (!response.ok) throw new Error("Failed to fetch reservations");
  return response.json();
}

export async function getReservationById(id: string) {
  const response = await authenticatedFetch(`/api/reservations/${id}`);
  if (!response.ok) throw new Error("Failed to fetch reservation");
  return response.json();
}

export async function createReservation(data: any) {
  const response = await authenticatedFetch("/api/reservations", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create reservation");
  return response.json();
}

export async function updateReservation(id: string, data: any) {
  const response = await authenticatedFetch(`/api/reservations/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update reservation");
  return response.json();
}

export async function deleteReservation(id: string) {
  const response = await authenticatedFetch(`/api/reservations/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete reservation");
}
