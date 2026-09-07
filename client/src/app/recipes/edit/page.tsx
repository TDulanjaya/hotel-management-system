"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getRecipeById, updateRecipe } from "@/lib/api/recipeApi";
import {
  ChefHat,
  ArrowLeft,
  Clock,
  Utensils,
  Save,
  Sparkles,
  Flame,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

function EditRecipeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "Main",
    prepTime: 0,
    servings: 1,
    ingredients: "",
    instructions: "",
    notes: "",
  });

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("No recipe ID specified in the URL.");
      return;
    }

    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getRecipeById(id);
        if (data) {
          setFormData({
            name: data.name || "",
            category: data.category || "Main",
            prepTime: data.prepTime !== undefined ? data.prepTime : 0,
            servings: data.servings !== undefined ? data.servings : 1,
            ingredients: data.ingredients || "",
            instructions: data.instructions || "",
            notes: data.notes || "",
          });
        }
      } catch (err: any) {
        setError(err.message || "Failed to load recipe details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!formData.name.trim()) {
      setError("Recipe name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess(false);
      await updateRecipe(id, {
        ...formData,
        prepTime: Number(formData.prepTime) || 0,
        servings: Number(formData.servings) || 1,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/recipes");
      }, 800);
    } catch (err: any) {
      setError(err.message || "Failed to update recipe.");
    } finally {
      setSaving(false);
    }
  };

  const ingredientCount = (formData.ingredients || "")
    .split("\n")
    .filter((l) => l.trim().length > 0).length;

  return (
    <main className="w-full px-4 py-6 pt-16 sm:px-6 sm:py-8 lg:px-8 lg:pt-8 lg:ml-[280px]">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#735c00]">
            <ChefHat className="h-4 w-4" />
            <span>Kitchen Management</span>
          </div>

          <h1 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1b1c1a]">
            Edit Recipe
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-[#5c5443] max-w-xl">
            Update recipe instructions, ingredient ratios, prep times, and notes.
          </p>
        </div>

        <Link
          href="/recipes"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d0c5af] bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-[#5c5443] shadow-sm transition hover:bg-[#f5f3ef] hover:text-[#1b1c1a] active:scale-[0.98]"
        >
          <ArrowLeft size={16} />
          <span>Back to Recipes</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#735c00] border-t-transparent"></div>
          <p className="text-sm font-semibold text-[#735c00]">Loading recipe details...</p>
        </div>
      ) : !id || (error && !formData.name) ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700 shadow-sm">
          <AlertCircle className="mx-auto h-8 w-8 mb-2 text-red-500" />
          <p className="font-bold text-base sm:text-lg">Unable to load recipe</p>
          <p className="mt-1 text-xs sm:text-sm">{error || "Please select a valid recipe from the list."}</p>
          <Link
            href="/recipes"
            className="mt-4 inline-block rounded-xl bg-[#735c00] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#8f7300]"
          >
            Go to Recipes
          </Link>
        </div>
      ) : (
        <>
          {/* Quick Stats Grid */}
          <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-3.5 sm:p-5 shadow-sm">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#7f7663]">
                Category
              </span>
              <p className="mt-1 text-base sm:text-lg font-extrabold text-[#735c00] truncate">
                {formData.category || "Main"}
              </p>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-3.5 sm:p-5 shadow-sm">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#7f7663]">
                Prep Time
              </span>
              <p className="mt-1 text-base sm:text-lg font-extrabold text-[#1b1c1a]">
                {formData.prepTime || 0} mins
              </p>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-3.5 sm:p-5 shadow-sm">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#7f7663]">
                Servings
              </span>
              <p className="mt-1 text-base sm:text-lg font-extrabold text-[#1b1c1a]">
                {formData.servings || 1} portions
              </p>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-3.5 sm:p-5 shadow-sm">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#7f7663]">
                Ingredients
              </span>
              <p className="mt-1 text-base sm:text-lg font-extrabold text-[#735c00]">
                {ingredientCount} items
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm font-bold text-red-700 shadow-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs sm:text-sm font-bold text-emerald-800 shadow-sm">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>Recipe updated successfully! Redirecting...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recipe Details Card */}
              <div className="rounded-2xl border border-[#d0c5af] bg-white p-4 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2 border-b border-[#f0eae0] pb-3 mb-4 sm:mb-5">
                  <div className="rounded-lg bg-[#735c00]/10 p-2 text-[#735c00]">
                    <ChefHat className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-[#1b1c1a]">
                      Recipe Details
                    </h2>
                    <p className="text-xs text-[#7f7663]">Edit name, category and metrics</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-[#4d4635] mb-1.5">
                      Recipe Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 text-base text-[#1b1c1a] outline-none focus:ring-2 focus:ring-[#735c00]/30 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-[#4d4635] mb-1.5">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 text-base text-[#1b1c1a] outline-none focus:ring-2 focus:ring-[#735c00]/30 transition"
                    >
                      <option value="Main">Main Course</option>
                      <option value="Starter">Starter / Appetizer</option>
                      <option value="Dessert">Dessert</option>
                      <option value="Beverage">Beverage</option>
                      <option value="Breakfast">Breakfast</option>
                      <option value="Event Menu">Event Menu</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-[#4d4635] mb-1.5 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-[#735c00]" />
                        <span>Prep Time (min)</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.prepTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            prepTime: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 text-base text-[#1b1c1a] outline-none focus:ring-2 focus:ring-[#735c00]/30 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-[#4d4635] mb-1.5 flex items-center gap-1">
                        <Utensils className="h-3.5 w-3.5 text-[#735c00]" />
                        <span>Servings</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.servings}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            servings: parseInt(e.target.value) || 1,
                          })
                        }
                        className="w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 text-base text-[#1b1c1a] outline-none focus:ring-2 focus:ring-[#735c00]/30 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-[#4d4635] mb-1.5 flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                      <span>Chef Notes & Allergens (Optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-3 text-base text-[#1b1c1a] outline-none focus:ring-2 focus:ring-[#735c00]/30 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Ingredients List */}
              <div className="rounded-2xl border border-[#d0c5af] bg-white p-4 sm:p-6 shadow-sm flex flex-col">
                <div className="flex items-center justify-between border-b border-[#f0eae0] pb-3 mb-4 sm:mb-5">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-[#735c00]/10 p-2 text-[#735c00]">
                      <Utensils className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-[#1b1c1a]">
                        Ingredients List *
                      </h2>
                      <p className="text-xs text-[#7f7663]">One ingredient per line</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <textarea
                    required
                    rows={11}
                    value={formData.ingredients}
                    onChange={(e) =>
                      setFormData({ ...formData, ingredients: e.target.value })
                    }
                    className="flex-1 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-3 text-base font-mono text-[#1b1c1a] outline-none focus:ring-2 focus:ring-[#735c00]/30 transition min-h-[220px]"
                  />
                  <p className="mt-2 text-[11px] text-[#7f7663]">
                    Specify ingredient quantity and unit per line for easy kitchen scaling.
                  </p>
                </div>
              </div>
            </div>

            {/* Preparation Steps */}
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 border-b border-[#f0eae0] pb-3 mb-4 sm:mb-5">
                <div className="rounded-lg bg-[#735c00]/10 p-2 text-[#735c00]">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#1b1c1a]">
                    Preparation Method *
                  </h2>
                  <p className="text-xs text-[#7f7663]">Step-by-step instructions for cooks</p>
                </div>
              </div>

              <textarea
                required
                rows={6}
                value={formData.instructions}
                onChange={(e) =>
                  setFormData({ ...formData, instructions: e.target.value })
                }
                className="w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-3 text-base text-[#1b1c1a] outline-none focus:ring-2 focus:ring-[#735c00]/30 transition"
              />

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-[#f0eae0] flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#735c00] px-8 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-[#8f7300] active:scale-[0.98] disabled:opacity-50 text-center"
                >
                  <Save size={18} />
                  <span>{saving ? "Updating Recipe..." : "Save Changes"}</span>
                </button>

                <Link
                  href="/recipes"
                  className="rounded-xl border border-[#d0c5af] bg-white px-8 py-3.5 text-base font-bold text-[#5c5443] shadow-sm transition hover:bg-[#f5f3ef] text-center"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </>
      )}
    </main>
  );
}

export default function EditRecipePage() {
  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "COOK"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />
        <Suspense
          fallback={
            <main className="w-full px-4 py-6 pt-16 sm:px-6 sm:py-8 lg:px-8 lg:pt-8 lg:ml-[280px]">
              <div className="flex h-64 items-center justify-center text-sm font-semibold text-[#735c00]">
                Loading...
              </div>
            </main>
          }
        >
          <EditRecipeContent />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}
