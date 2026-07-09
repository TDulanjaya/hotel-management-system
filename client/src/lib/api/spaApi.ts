import { authenticatedFetch } from "./authApi";

export async function getSpaBookings() {
  const res = await authenticatedFetch("/api/spa/bookings");
  if (!res.ok) throw new Error("Failed to fetch spa bookings");
  const data = await res.json();
  return data?.content !== undefined ? data.content : data;
}

export async function getSpaBookingById(id: string) {
  const res = await authenticatedFetch(`/api/spa/bookings/${id}`);
  if (!res.ok) throw new Error("Failed to fetch spa booking");
  return res.json();
}

export async function createSpaBooking(data: any) {
  const res = await authenticatedFetch("/api/spa/bookings", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create spa booking");
  return res.json();
}

export async function updateSpaBooking(id: string, data: any) {
  const res = await authenticatedFetch(`/api/spa/bookings/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update spa booking");
  return res.json();
}

export async function deleteSpaBooking(id: string) {
  const res = await authenticatedFetch(`/api/spa/bookings/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete spa booking");
}
