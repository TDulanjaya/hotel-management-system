import { authenticatedFetch } from "./authApi";
export async function getRecipes() {
  const res = await authenticatedFetch("/api/recipes");
  if (!res.ok) throw new Error("Failed to fetch recipes");
  return res.json();
}
export async function createRecipe(data: any) {
  const res = await authenticatedFetch("/api/recipes", { method: "POST", body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed to create recipe");
  return res.json();
}
export async function updateRecipe(id: string, data: any) {
  const res = await authenticatedFetch(`/api/recipes/${id}`, { method: "PUT", body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed to update recipe");
  return res.json();
}
export async function deleteRecipe(id: string) {
  const res = await authenticatedFetch(`/api/recipes/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete recipe");
}
