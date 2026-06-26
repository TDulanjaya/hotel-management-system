import { authenticatedFetch } from "./authApi";

export async function getOrders() {
  const response = await authenticatedFetch("/api/orders");
  if (!response.ok) throw new Error("Failed to fetch orders");
  return response.json();
}

export async function getOrderById(id: string) {
  const response = await authenticatedFetch(`/api/orders/${id}`);
  if (!response.ok) throw new Error("Failed to fetch order");
  return response.json();
}

export async function createOrder(data: any) {
  const response = await authenticatedFetch("/api/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create order");
  return response.json();
}

export async function updateOrder(id: string, data: any) {
  const response = await authenticatedFetch(`/api/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update order");
  return response.json();
}

export async function deleteOrder(id: string) {
  const response = await authenticatedFetch(`/api/orders/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete order");
}
