import { authenticatedFetch } from "./authApi";

export async function getParkingBookings() {
  const res = await authenticatedFetch("/api/parking");
  if (!res.ok) throw new Error("Failed to fetch parking bookings");
  return res.json();
}

export async function getParkingBookingById(id: string) {
  const res = await authenticatedFetch(`/api/parking/${id}`);
  if (!res.ok) throw new Error("Failed to fetch parking booking");
  return res.json();
}

export async function createParkingBooking(data: any) {
  const res = await authenticatedFetch("/api/parking", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create parking booking");
  return res.json();
}

export async function updateParkingBooking(id: string, data: any) {
  const res = await authenticatedFetch(`/api/parking/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update parking booking");
  return res.json();
}

export async function deleteParkingBooking(id: string) {
  const res = await authenticatedFetch(`/api/parking/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete parking booking");
}
