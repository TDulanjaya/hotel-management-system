import { authenticatedFetch } from "./authApi";

export async function getRooms() {
  const res = await authenticatedFetch("/api/rooms");
  if (!res.ok) throw new Error("Failed to fetch rooms");
  return res.json();
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
