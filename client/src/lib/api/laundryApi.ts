import { authenticatedFetch } from "./authApi";

export async function getLaundryOrders() {
  const res = await authenticatedFetch("/api/laundry/orders");
  if (!res.ok) throw new Error("Failed to fetch laundry orders");
  const data = await res.json();
  return data?.content !== undefined ? data.content : data;
}

export async function getLaundryOrderById(id: string) {
  const res = await authenticatedFetch(`/api/laundry/orders/${id}`);
  if (!res.ok) throw new Error("Failed to fetch laundry order");
  return res.json();
}

export async function createLaundryOrder(data: any) {
  const res = await authenticatedFetch("/api/laundry/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create laundry order");
  return res.json();
}

export async function updateLaundryOrder(id: string, data: any) {
  const res = await authenticatedFetch(`/api/laundry/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update laundry order");
  return res.json();
}

export async function deleteLaundryOrder(id: string) {
  const res = await authenticatedFetch(`/api/laundry/orders/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete laundry order");
}
