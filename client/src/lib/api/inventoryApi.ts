import { getToken } from "@/utils/auth";
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/inventory`;

export type InventoryPayload = {
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  supplierName: string;
  purchasePrice: number;
  status?: string;
};

function getAuthHeaders() {
  const token = getToken();

  if (!token) {
    throw new Error("You are not logged in.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    let message = "Request failed";

    try {
      const data = await response.json();
      message = data.message || data.error || message;
    } catch {
      message = await response.text();
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function getInventoryItems() {
  const response = await fetch(API_BASE_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function getInventoryItemById(id: string) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function createInventoryItem(payload: InventoryPayload) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function updateInventoryItem(id: string, payload: InventoryPayload) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function deleteInventoryItem(id: string) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function purchaseStock(payload: any) {
  const itemId = payload.itemId || payload.inventoryItemId || payload.id;

  const purchaseQuantity = Number(
    payload.quantity || payload.purchaseQuantity || payload.receivedQuantity || 0
  );

  if (!itemId) {
    throw new Error("Inventory item ID is required.");
  }

  if (purchaseQuantity <= 0) {
    throw new Error("Purchase quantity must be greater than 0.");
  }

  const existingItem = await getInventoryItemById(itemId);

  const newQuantity = Number(existingItem.quantity || 0) + purchaseQuantity;

  let newStatus = "In Stock";

  if (newQuantity === 0) {
    newStatus = "Critical";
  } else if (newQuantity <= Number(existingItem.reorderLevel || 0)) {
    newStatus = "Low Stock";
  }

  return updateInventoryItem(itemId, {
    itemName: existingItem.itemName,
    category: existingItem.category,
    quantity: newQuantity,
    unit: existingItem.unit,
    reorderLevel: Number(existingItem.reorderLevel || 0),
    supplierName: payload.supplierName || existingItem.supplierName,
    purchasePrice: Number(payload.purchasePrice || existingItem.purchasePrice || 0),
    status: newStatus,
  });
}