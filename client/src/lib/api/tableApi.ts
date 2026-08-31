import { authenticatedFetch } from "./authApi";

export interface RestaurantTableItem {
  id?: string;
  tableNumber: string;
  area: string;
  seats: number;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "CLEANING" | string;
  waiter?: string;
  notes?: string;
  createdAt?: number;
}

export async function getRestaurantTables(): Promise<RestaurantTableItem[]> {
  const response = await authenticatedFetch("/api/restaurant/tables");
  if (!response.ok) throw new Error("Failed to fetch tables");
  const data = await response.json();
  return Array.isArray(data) ? data : data?.content || [];
}

export async function getRestaurantTableById(id: string): Promise<RestaurantTableItem> {
  const response = await authenticatedFetch(`/api/restaurant/tables/${id}`);
  if (!response.ok) throw new Error("Failed to fetch table");
  return response.json();
}

export async function createRestaurantTable(data: Partial<RestaurantTableItem>): Promise<RestaurantTableItem> {
  const response = await authenticatedFetch("/api/restaurant/tables", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create table");
  }
  return response.json();
}

export async function updateRestaurantTable(id: string, data: Partial<RestaurantTableItem>): Promise<RestaurantTableItem> {
  const response = await authenticatedFetch(`/api/restaurant/tables/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update table");
  }
  return response.json();
}

export async function deleteRestaurantTable(id: string): Promise<void> {
  const response = await authenticatedFetch(`/api/restaurant/tables/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete table");
}
