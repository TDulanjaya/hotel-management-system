import { authenticatedFetch } from "./authApi";

export async function getGameSessions() {
  const res = await authenticatedFetch("/api/games");
  if (!res.ok) throw new Error("Failed to fetch game sessions");
  return res.json();
}

export async function createGameSession(data: any) {
  const res = await authenticatedFetch("/api/games", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create game session");
  return res.json();
}

export async function updateGameSession(id: string, data: any) {
  const res = await authenticatedFetch(`/api/games/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update game session");
  return res.json();
}

export async function deleteGameSession(id: string) {
  const res = await authenticatedFetch(`/api/games/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete game session");
}
