import { authenticatedFetch } from "../api";

export async function getEvents() {
  const res = await authenticatedFetch("/api/events");
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export async function getEventById(id: string) {
  const res = await authenticatedFetch(`/api/events/${id}`);
  if (!res.ok) throw new Error("Failed to fetch event");
  return res.json();
}

export async function createEvent(data: any) {
  const res = await authenticatedFetch("/api/events", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create event");
  return res.json();
}

export async function updateEvent(id: string, data: any) {
  const res = await authenticatedFetch(`/api/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update event");
  return res.json();
}

export async function deleteEvent(id: string) {
  const res = await authenticatedFetch(`/api/events/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete event");
}
