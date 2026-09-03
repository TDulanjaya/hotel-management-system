"use client";
import { AuthUser, getUser } from "@/utils/auth";

import { useEffect, useMemo, useState } from "react";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SlidePanel from "@/components/ui/SlidePanel";
import useSWR from "swr";
import { getRecipes, createRecipe, updateRecipe, deleteRecipe } from "@/lib/api/recipeApi";

export default function PageComponent() {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    setUser(getUser());
  }, []);

  const { data: rawItems, mutate, isLoading: isSwrLoading, error: swrError } = useSWR<any[]>("/api/recipes");
  const items = useMemo(() => (Array.isArray(rawItems) ? rawItems : []), [rawItems]);
  const loading = !rawItems && isSwrLoading;
  const error = swrError?.message || "";
  const [panelOpen, setPanelOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  
  const [formData, setFormData] = useState({ name: "", category: "Main", ingredients: "", instructions: "", prepTime: 0, servings: 1, notes: "" });

  const handleOpenNew = () => {
    setEditItem(null);
    setFormData({ name: "", category: "Main", ingredients: "", instructions: "", prepTime: 0, servings: 1, notes: "" });
    setPanelOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditItem(item);
    const mapped: any = {};
    const defaultState: any = { name: "", category: "Main", ingredients: "", instructions: "", prepTime: 0, servings: 1, notes: "" };
    const keys = Object.keys(defaultState);
    keys.forEach(k => {
      mapped[k] = item[k] !== undefined && item[k] !== null ? item[k] : defaultState[k];
    });
    setFormData(mapped);
    setPanelOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      try {
        await deleteRecipe(id);
        mutate();
      } catch (err: any) {
        alert("Failed to delete");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editItem) {
        await updateRecipe(editItem.id, formData);
      } else {
        await createRecipe(formData);
      }
      setPanelOpen(false);
      mutate();
    } catch (err: any) {
      alert("Failed to save");
    }
  };

  const canEdit = user?.role === "OWNER" || user?.role === "MANAGER" || user?.role === "COOK";
  const canDelete = user?.role === "OWNER" || user?.role === "MANAGER";

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "COOK"]}>
      <div className="flex min-h-screen bg-[#f8f5ef]">
        <AppSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-16 sm:pt-20 lg:pt-8 lg:ml-[280px]">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#181818]">Recipes</h1>
            <button onClick={handleOpenNew} className="w-full sm:w-auto rounded-xl bg-[#806300] px-6 py-2.5 text-white font-bold hover:bg-[#6b5400] text-center">+ Add Recipe</button>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center text-lg text-[#806300]">Loading...</div>
          ) : error ? (
            <div className="text-red-600 font-bold">{error}</div>
          ) : items.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl bg-white shadow-sm border border-[#d9cfbd] p-6 text-center">
              <p className="mb-4 text-lg sm:text-xl font-semibold text-gray-500">No records found</p>
              <button onClick={handleOpenNew} className="rounded-xl bg-[#806300] px-6 py-2.5 text-white font-bold hover:bg-[#6b5400]">+ Add Recipe</button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl bg-white shadow-sm border border-[#d9cfbd]">
              <table className="w-full min-w-[550px] text-left text-sm">
                <thead className="bg-[#f5eed9] text-[#4c4032]">
                  <tr>
                    <th className="p-3 sm:p-4 font-bold">Name</th><th className="p-3 sm:p-4 font-bold">Category</th><th className="p-3 sm:p-4 font-bold">Prep Time (min)</th><th className="p-3 sm:p-4 font-bold">Servings</th><th className="p-3 sm:p-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d9cfbd]">
                  {items.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      
                      <td className="p-3 sm:p-4 font-semibold">{item.name}</td>
                      <td className="p-3 sm:p-4">{item.category}</td>
                      <td className="p-3 sm:p-4">{item.prepTime}</td>
                      <td className="p-3 sm:p-4">{item.servings}</td>

                      <td className="p-3 sm:p-4 flex gap-2">
                        {canEdit && (
                          <button onClick={() => handleOpenEdit(item)} className="text-blue-600 font-semibold hover:underline">Edit</button>
                        )}
                        {canDelete && (
                          <button onClick={() => handleDelete(item.id)} className="text-red-600 font-semibold hover:underline">Delete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <SlidePanel open={panelOpen} onClose={() => setPanelOpen(false)} title={editItem ? "Edit Recipe" : "Add Recipe"}>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div><label className="block text-sm font-bold">Name *</label><input required className="w-full rounded-xl border border-[#d0c5af] p-3 text-base" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
              <div><label className="block text-sm font-bold">Category</label><select className="w-full rounded-xl border border-[#d0c5af] p-3 text-base" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}><option>Starter</option><option>Main</option><option>Dessert</option><option>Beverage</option></select></div>
              <div><label className="block text-sm font-bold">Ingredients *</label><textarea required rows={4} className="w-full rounded-xl border border-[#d0c5af] p-3 text-base" value={formData.ingredients} onChange={e => setFormData({...formData, ingredients: e.target.value})} /></div>
              <div><label className="block text-sm font-bold">Instructions *</label><textarea required rows={4} className="w-full rounded-xl border border-[#d0c5af] p-3 text-base" value={formData.instructions} onChange={e => setFormData({...formData, instructions: e.target.value})} /></div>
              <div><label className="block text-sm font-bold">Prep Time (min)</label><input type="number" className="w-full rounded-xl border border-[#d0c5af] p-3 text-base" value={formData.prepTime} onChange={e => setFormData({...formData, prepTime: parseInt(e.target.value) || 0})} /></div>
              <div><label className="block text-sm font-bold">Servings</label><input type="number" className="w-full rounded-xl border border-[#d0c5af] p-3 text-base" value={formData.servings} onChange={e => setFormData({...formData, servings: parseInt(e.target.value) || 1})} /></div>
              <div><label className="block text-sm font-bold">Notes</label><textarea rows={3} className="w-full rounded-xl border border-[#d0c5af] p-3 text-base" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} /></div>

              <button type="submit" className="w-full rounded-xl bg-[#806300] py-3.5 text-white font-bold hover:bg-[#6b5400] text-center">Save Recipe</button>
            </form>
          </SlidePanel>
        </main>
      </div>
    </ProtectedRoute>
  );
}
