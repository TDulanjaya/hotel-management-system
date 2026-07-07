import { authenticatedFetch } from "./authApi";

export async function getInventoryItems() {
  const res = await authenticatedFetch("/api/inventory");
  if (!res.ok) throw new Error("Failed to fetch inventory items");
  const data = await res.json();
  return data?.content !== undefined ? data.content : data;
}

export async function getInventoryItemById(id: string) {
  const res = await authenticatedFetch(`/api/inventory/${id}`);
  if (!res.ok) throw new Error("Failed to fetch inventory item");
  return res.json();
}

export async function createInventoryItem(data: any) {
  const res = await authenticatedFetch("/api/inventory", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create inventory item");
  return res.json();
}

export async function updateInventoryItem(id: string, data: any) {
  const res = await authenticatedFetch(`/api/inventory/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update inventory item");
  return res.json();
}

export async function deleteInventoryItem(id: string) {
  const res = await authenticatedFetch(`/api/inventory/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete inventory item");
}

export async function purchaseStock(id: string, data: any) {
  const res = await authenticatedFetch(`/api/inventory/${id}/purchase`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to purchase stock");
  return res.json();
}
