import { authenticatedFetch } from "./authApi";

export async function getReservations(params?: { page?: number, size?: number, search?: string }) {
  let url = "/api/reservations";
  if (params) {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.append("page", params.page.toString());
    if (params.size !== undefined) query.append("size", params.size.toString());
    if (params.search) query.append("search", params.search);
    const qStr = query.toString();
    if (qStr) url += `?${qStr}`;
  }
  const res = await authenticatedFetch(url);
  if (!res.ok) throw new Error("Failed to fetch reservations");
  const data = await res.json();
  return data?.content !== undefined ? data.content : data;
}

export async function getReservationById(id: string) {
  const res = await authenticatedFetch(`/api/reservations/${id}`);
  if (!res.ok) throw new Error("Failed to fetch reservation");
  return res.json();
}

export async function createReservation(data: any) {
  const res = await authenticatedFetch("/api/reservations", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create reservation");
  return res.json();
}

export async function updateReservation(id: string, data: any) {
  const res = await authenticatedFetch(`/api/reservations/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update reservation");
  return res.json();
}

export async function deleteReservation(id: string) {
  const res = await authenticatedFetch(`/api/reservations/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete reservation");
}
