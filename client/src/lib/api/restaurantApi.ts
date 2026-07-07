import { authenticatedFetch } from "./authApi";
export async function getRestaurantOrders() {
  const res = await authenticatedFetch("/api/restaurant/orders");
  if (!res.ok) throw new Error("Failed to fetch restaurant orders");
  const data = await res.json();
  return data?.content !== undefined ? data.content : data;
}
export async function createRestaurantOrder(data: any) {
  const res = await authenticatedFetch("/api/restaurant/orders", { method: "POST", body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}
export async function updateRestaurantOrder(id: string, data: any) {
  const res = await authenticatedFetch(`/api/restaurant/orders/${id}`, { method: "PUT", body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed to update order");
  return res.json();
}
export async function deleteRestaurantOrder(id: string) {
  const res = await authenticatedFetch(`/api/restaurant/orders/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete order");
}
