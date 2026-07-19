import { authenticatedFetch } from "./authApi";

export async function getReservations(params?: {
  page?: number;
  size?: number;
  search?: string;
}) {
  const query = new URLSearchParams();

  if (params?.page !== undefined) query.append("page", String(params.page));
  if (params?.size !== undefined) query.append("size", String(params.size));
  if (params?.search) query.append("search", params.search);

  const endpoint = query.toString()
    ? `/api/reservations?${query.toString()}`
    : "/api/reservations";

  const response = await authenticatedFetch(endpoint);
  if (!response.ok) throw new Error("Failed to fetch reservations");
  const data = await response.json();
  return data?.content !== undefined ? data.content : data;
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
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create reservation");
  }
  return response.json();
}

export async function updateReservation(id: string, data: any) {
  const response = await authenticatedFetch(`/api/reservations/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update reservation");
  }
  return response.json();
}

export async function deleteReservation(id: string) {
  const response = await authenticatedFetch(`/api/reservations/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete reservation");
}