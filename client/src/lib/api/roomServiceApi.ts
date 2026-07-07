import { authenticatedFetch } from "./authApi";
export async function getRoomServiceOrders() {
  const res = await authenticatedFetch("/api/room-service");
  if (!res.ok) throw new Error("Failed to fetch room service orders");
  const data = await res.json();
  return data?.content !== undefined ? data.content : data;
}
export async function createRoomServiceOrder(data: any) {
  const res = await authenticatedFetch("/api/room-service", { method: "POST", body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed to create room service order");
  return res.json();
}
export async function updateRoomServiceOrder(id: string, data: any) {
  const res = await authenticatedFetch(`/api/room-service/${id}`, { method: "PUT", body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed to update room service order");
  return res.json();
}
export async function deleteRoomServiceOrder(id: string) {
  const res = await authenticatedFetch(`/api/room-service/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete room service order");
}
