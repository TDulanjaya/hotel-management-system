import { authenticatedFetch } from "./authApi";

export async function getKitchenOrders() {
  const response = await authenticatedFetch("/api/kitchen/orders");
  if (!response.ok) throw new Error("Failed to fetch kitchen orders");
  const data = await response.json();
  return data?.content !== undefined ? data.content : data;
}

export async function getKitchenOrderById(id: string) {
  const response = await authenticatedFetch(`/api/kitchen/orders/${id}`);
  if (!response.ok) throw new Error("Failed to fetch kitchen order");
  return response.json();
}

export async function createKitchenOrder(data: any) {
  const response = await authenticatedFetch("/api/kitchen/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create kitchen order");
  return response.json();
}

export async function updateKitchenOrder(id: string, data: any) {
  const response = await authenticatedFetch(`/api/kitchen/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update kitchen order");
  return response.json();
}

export async function deleteKitchenOrder(id: string) {
  const response = await authenticatedFetch(`/api/kitchen/orders/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete kitchen order");
}