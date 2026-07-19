import { authenticatedFetch } from "./authApi";

export async function getRecipes() {
  const res = await authenticatedFetch("/api/recipes");
  if (!res.ok) throw new Error("Failed to fetch recipes");
  const data = await res.json();
  return data?.content !== undefined ? data.content : data;
}

export async function getRecipeById(id: string) {
  const res = await authenticatedFetch(`/api/recipes/${id}`);
  if (!res.ok) throw new Error("Failed to fetch recipe");
  return res.json();
}

export async function createRecipe(data: any) {
  const res = await authenticatedFetch("/api/recipes", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create recipe");
  return res.json();
}

export async function updateRecipe(id: string, data: any) {
  const res = await authenticatedFetch(`/api/recipes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update recipe");
  return res.json();
}

export async function deleteRecipe(id: string) {
  const res = await authenticatedFetch(`/api/recipes/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete recipe");
}

// Aliases for compatibility
export const getAll = getRecipes;
export const getById = getRecipeById;
export const create = createRecipe;
export const update = updateRecipe;
export const remove = deleteRecipe;
