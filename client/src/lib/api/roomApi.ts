import { authenticatedFetch } from "./authApi";

export async function getRooms(params?: { page?: number, size?: number, search?: string }) {
  let url = "/api/rooms";
  if (params) {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.append("page", params.page.toString());
    if (params.size !== undefined) query.append("size", params.size.toString());
    if (params.search) query.append("search", params.search);
    const qStr = query.toString();
    if (qStr) url += `?${qStr}`;
  }
  const res = await authenticatedFetch(url);
  if (!res.ok) throw new Error("Failed to fetch rooms");
  const data = await res.json();
  return data?.content !== undefined ? data.content : data;
}

export async function getRoomById(id: string) {
  const res = await authenticatedFetch(`/api/rooms/${id}`);
  if (!res.ok) throw new Error("Failed to fetch room");
  return res.json();
}

export async function createRoom(data: any) {
  const res = await authenticatedFetch("/api/rooms", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create room");
  return res.json();
}

export async function updateRoom(id: string, data: any) {
  const res = await authenticatedFetch(`/api/rooms/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update room");
  return res.json();
}

export async function deleteRoom(id: string) {
  const res = await authenticatedFetch(`/api/rooms/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete room");
}
