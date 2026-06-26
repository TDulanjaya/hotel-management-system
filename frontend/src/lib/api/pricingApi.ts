import { authenticatedFetch } from "./authApi";

export async function getPricingItems() {
  const response = await authenticatedFetch("/api/pricing");
  if (!response.ok) {
    throw new Error("Failed to fetch pricing items");
  }
  return response.json();
}

export async function getPricingItemById(id: string) {
  const response = await authenticatedFetch(`/api/pricing/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch pricing item");
  }
  return response.json();
}

export async function createPricingItem(pricingData: any) {
  const response = await authenticatedFetch("/api/pricing", {
    method: "POST",
    body: JSON.stringify(pricingData),
  });
  if (!response.ok) {
    throw new Error("Failed to create pricing item");
  }
  return response.json();
}

export async function updatePricingItem(id: string, pricingData: any) {
  const response = await authenticatedFetch(`/api/pricing/${id}`, {
    method: "PUT",
    body: JSON.stringify(pricingData),
  });
  if (!response.ok) {
    throw new Error("Failed to update pricing item");
  }
  return response.json();
}

export async function deletePricingItem(id: string) {
  const response = await authenticatedFetch(`/api/pricing/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete pricing item");
  }
}
