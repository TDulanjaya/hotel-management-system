"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { createRecipe } from "@/lib/api/recipeApi";
import { ChefHat, ArrowLeft, Clock, Utensils, Save, Sparkles, Flame } from "lucide-react";

export default function NewRecipePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "Main",
    prepTime: 30,
    servings: 4,
    ingredients: "",
    instructions: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Please enter a recipe name.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      await createRecipe({
        ...formData,
        prepTime: Number(formData.prepTime) || 0,
        servings: Number(formData.servings) || 1,
      });
      router.push("/recipes");
    } catch (err: any) {
      setError(err.message || "Failed to create recipe. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "COOK"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="w-full px-4 py-6 pt-16 sm:px-6 sm:py-8 lg:px-8 lg:pt-8 lg:ml-[280px]">
          {/* Header */}
          <div className="mb-6 sm:mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#735c00]">
                <ChefHat className="h-4 w-4" />
                <span>Kitchen Management</span>
              </div>

              <h1 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1b1c1a]">
                Add New Recipe
              </h1>

              <p className="mt-1 text-xs sm:text-sm text-[#5c5443] max-w-xl">
                Create a new recipe with ingredient lists, preparation steps, prep times,
                and serving portions.
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

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm font-bold text-red-700 shadow-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recipe Basic Details */}
              <div className="rounded-2xl border border-[#d0c5af] bg-white p-4 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2 border-b border-[#f0eae0] pb-3 mb-4 sm:mb-5">
                  <div className="rounded-lg bg-[#735c00]/10 p-2 text-[#735c00]">
                    <ChefHat className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-[#1b1c1a]">
                      Recipe Details
                    </h2>
                    <p className="text-xs text-[#7f7663]">Basic information and metrics</p>
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
                      placeholder="e.g. Creamy Tuscan Garlic Chicken"
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
                        placeholder="e.g. 30"
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
                        placeholder="e.g. 4"
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
                      placeholder="e.g. Allergen info (Nuts, Gluten, Dairy), storage instructions, or plating suggestions..."
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
                    placeholder={`Chicken Breast - 500g
Olive Oil - 2 tbsp
Heavy Cream - 250ml
Sun-Dried Tomatoes - 1/2 cup
Spinach - 2 cups
Garlic - 4 cloves minced
Parmesan Cheese - 1/2 cup grated
Salt & Black Pepper - to taste`}
                    value={formData.ingredients}
                    onChange={(e) =>
                      setFormData({ ...formData, ingredients: e.target.value })
                    }
                    className="flex-1 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-3 text-base font-mono text-[#1b1c1a] outline-none focus:ring-2 focus:ring-[#735c00]/30 transition min-h-[220px]"
                  />
                  <p className="mt-2 text-[11px] text-[#7f7663]">
                    Tip: Specify exact quantities (e.g. 500g, 2 tbsp) for accurate kitchen prep.
                  </p>
                </div>
              </div>
            </div>

            {/* Preparation Steps Full Width */}
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 border-b border-[#f0eae0] pb-3 mb-4 sm:mb-5">
                <div className="rounded-lg bg-[#735c00]/10 p-2 text-[#735c00]">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#1b1c1a]">
                    Preparation Method *
                  </h2>
                  <p className="text-xs text-[#7f7663]">Numbered step-by-step cooking steps</p>
                </div>
              </div>

              <textarea
                required
                rows={6}
                placeholder={`1. Season chicken breasts with salt, pepper, and Italian herbs.
2. Heat olive oil in a skillet over medium-high heat and sear chicken until cooked through (6-8 mins per side). Remove and set aside.
3. In the same skillet, sauté minced garlic and sun-dried tomatoes for 1 minute.
4. Pour in heavy cream and chicken broth; bring to a gentle simmer.
5. Add fresh spinach and grated parmesan, stirring until spinach wilts and sauce thickens.
6. Return chicken to skillet, spoon sauce over top, and garnish with fresh herbs.`}
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
                  <span>{saving ? "Creating Recipe..." : "Save Recipe"}</span>
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
        </main>
      </div>
    </ProtectedRoute>
  );
}
