import { authenticatedFetch } from "./authApi";
export async function getKitchenOrders() {
  const res = await authenticatedFetch("/api/kitchen/orders");
  if (!res.ok) throw new Error("Failed to fetch kitchen orders");
  const data = await res.json();
  return data?.content !== undefined ? data.content : data;
}
export async function createKitchenOrder(data: any) {
  const res = await authenticatedFetch("/api/kitchen/orders", { method: "POST", body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed to create kitchen order");
  return res.json();
}
export async function updateKitchenOrder(id: string, data: any) {
  const res = await authenticatedFetch(`/api/kitchen/orders/${id}`, { method: "PUT", body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed to update kitchen order");
  return res.json();
}
export async function deleteKitchenOrder(id: string) {
  const res = await authenticatedFetch(`/api/kitchen/orders/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete kitchen order");
}
