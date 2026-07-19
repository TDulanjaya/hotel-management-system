import { authenticatedFetch } from "./authApi";

export async function getRooms(params?: {
  page?: number;
  size?: number;
  search?: string;
}) {
  const query = new URLSearchParams();

  if (params?.page !== undefined) query.append("page", String(params.page));
  if (params?.size !== undefined) query.append("size", String(params.size));
  if (params?.search) query.append("search", params.search);

  const endpoint = query.toString()
    ? `/api/rooms?${query.toString()}`
    : "/api/rooms";

  const response = await authenticatedFetch(endpoint);
  if (!response.ok) throw new Error("Failed to fetch rooms");
  const data = await response.json();
  return data?.content !== undefined ? data.content : data;
}

export async function getRoomById(id: string) {
  const response = await authenticatedFetch(`/api/rooms/${id}`);
  if (!response.ok) throw new Error("Failed to fetch room");
  return response.json();
}

export async function createRoom(data: any) {
  const response = await authenticatedFetch("/api/rooms", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create room");
  }
  return response.json();
}

export async function updateRoom(id: string, data: any) {
  const response = await authenticatedFetch(`/api/rooms/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update room");
  }
  return response.json();
}

export async function deleteRoom(id: string) {
  const response = await authenticatedFetch(`/api/rooms/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete room");
}