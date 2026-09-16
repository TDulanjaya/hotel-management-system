"use client";

import { AuthUser, getUser } from "@/utils/auth";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SlidePanel from "@/components/ui/SlidePanel";
import useSWR from "swr";
import {
  getRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "@/lib/api/recipeApi";
import {
  ChefHat,
  Clock,
  Utensils,
  Plus,
  Search,
  X,
  Pencil,
  Trash2,
  BookOpen,
  CheckSquare,
  Square,
  Sparkles,
  Info,
  Filter,
  Flame,
} from "lucide-react";

const CATEGORIES = [
  "All",
  "Starter",
  "Main",
  "Dessert",
  "Beverage",
  "Breakfast",
  "Event Menu",
];

function getCategoryBadgeClass(category: string) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("starter") || cat.includes("appetizer")) {
    return "bg-amber-100 text-amber-800 border-amber-300";
  }
  if (cat.includes("main")) {
    return "bg-[#806300]/15 text-[#735c00] border-[#806300]/30";
  }
  if (cat.includes("dessert") || cat.includes("sweet")) {
    return "bg-rose-100 text-rose-800 border-rose-300";
  }
  if (cat.includes("beverage") || cat.includes("drink")) {
    return "bg-sky-100 text-sky-800 border-sky-300";
  }
  if (cat.includes("breakfast")) {
    return "bg-emerald-100 text-emerald-800 border-emerald-300";
  }
  return "bg-purple-100 text-purple-800 border-purple-300";
}

function parseIngredientsToLines(ingredients: any, ingredientsNote?: string): string[] {
  const lines: string[] = [];
  if (Array.isArray(ingredients)) {
    ingredients.forEach((ing: any) => {
      if (typeof ing === "string" && ing.trim()) {
        lines.push(ing.trim());
      } else if (ing && typeof ing === "object") {
        const name = ing.itemName || "Item";
        const qty = ing.quantityPerServing !== undefined && ing.quantityPerServing !== null ? `${ing.quantityPerServing}` : "";
        const unit = ing.unit || "";
        lines.push(`${name} - ${qty} ${unit}`.trim());
      }
    });
  } else if (typeof ingredients === "string" && ingredients.trim()) {
    lines.push(...ingredients.split("\n").map((l: string) => l.trim()).filter((l: string) => l.length > 0));
  }
  if (ingredientsNote && ingredientsNote.trim()) {
    lines.push(`Note: ${ingredientsNote.trim()}`);
  }
  return lines;
}

export default function RecipesPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    setUser(getUser());
  }, []);

  const {
    data: rawItems,
    mutate,
    isLoading: isSwrLoading,
    error: swrError,
  } = useSWR<any[]>("/api/recipes", getRecipes);

  const items = useMemo(
    () => (Array.isArray(rawItems) ? rawItems : []),
    [rawItems]
  );
  const loading = !rawItems && isSwrLoading;
  const error = swrError?.message || "";

  // UI state
  const [panelOpen, setPanelOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [viewRecipe, setViewRecipe] = useState<any>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [formData, setFormData] = useState({
    name: "",
    category: "Main",
    ingredients: "",
    instructions: "",
    prepTime: 0,
    servings: 1,
    notes: "",
  });

  // Filtered recipes
  const filteredItems = useMemo(() => {
    return items.filter((item: any) => {
      const q = searchQuery.toLowerCase().trim();
      const ingredientText = parseIngredientsToLines(item.ingredients, item.ingredientsNote).join(" ").toLowerCase();
      const matchesSearch =
        !q ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        ingredientText.includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === "All" ||
        (item.category &&
          item.category.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  // Quick stats
  const stats = useMemo(() => {
    const total = items.length;
    const mains = items.filter((i: any) => (i.category || "").toLowerCase() === "main").length;
    const starters = items.filter((i: any) => (i.category || "").toLowerCase() === "starter").length;
    const dessertsAndDrinks = items.filter((i: any) => {
      const cat = (i.category || "").toLowerCase();
      return cat === "dessert" || cat === "beverage";
    }).length;
    const avgPrep =
      total > 0
        ? Math.round(
            items.reduce((acc: number, curr: any) => acc + (Number(curr.prepTime) || 0), 0) / total
          )
        : 0;

    return { total, mains, starters, dessertsAndDrinks, avgPrep };
  }, [items]);

  const handleOpenNew = () => {
    setEditItem(null);
    setFormError("");
    setFormData({
      name: "",
      category: "Main",
      ingredients: "",
      instructions: "",
      prepTime: 15,
      servings: 2,
      notes: "",
    });
    setPanelOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditItem(item);
    setFormError("");
    const formattedIngredients = Array.isArray(item.ingredients)
      ? item.ingredients
          .map((ing: any) =>
            typeof ing === "string"
              ? ing
              : `${ing.itemName || ""} - ${ing.quantityPerServing ?? 1} ${ing.unit || ""}`.trim()
          )
          .join("\n")
      : item.ingredients || "";

    setFormData({
      name: item.name || "",
      category: item.category || "Main",
      ingredients: formattedIngredients,
      instructions: item.instructions || "",
      prepTime: item.prepTime !== undefined ? item.prepTime : 0,
      servings: item.servings !== undefined ? item.servings : 1,
      notes: item.notes || item.ingredientsNote || "",
    });
    setPanelOpen(true);
  };

  const handleOpenView = (item: any) => {
    setViewRecipe(item);
    setCheckedIngredients({});
  };

  const toggleIngredientCheck = (index: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name || "this recipe"}"?`)) {
      try {
        await deleteRecipe(id);
        mutate();
        if (viewRecipe?.id === id) {
          setViewRecipe(null);
        }
      } catch (err: any) {
        alert("Failed to delete recipe: " + (err.message || "Unknown error"));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Recipe name is required.");
      setSaving(false);
      return;
    }

    try {
      const parsedIngredients = (formData.ingredients || "")
        .split("\n")
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0)
        .map((line: string) => {
          const dashIdx = line.indexOf("-");
          if (dashIdx > 0) {
            const itemName = line.slice(0, dashIdx).trim();
            const rest = line.slice(dashIdx + 1).trim();
            const numMatch = rest.match(/^([0-9.]+)\s*(.*)$/);
            return {
              itemName,
              quantityPerServing: numMatch ? parseFloat(numMatch[1]) || 1 : 1,
              unit: numMatch && numMatch[2] ? numMatch[2].trim() : rest || "units",
            };
          }
          return {
            itemName: line,
            quantityPerServing: 1,
            unit: "portion",
          };
        });

      const payload = {
        name: formData.name,
        category: formData.category,
        instructions: formData.instructions,
        notes: formData.notes,
        ingredientsNote: formData.notes,
        ingredients: parsedIngredients,
        prepTime: Number(formData.prepTime) || 0,
        servings: Number(formData.servings) || 1,
      };

      if (editItem) {
        await updateRecipe(editItem.id, payload);
      } else {
        await createRecipe(payload);
      }

      setPanelOpen(false);
      mutate();
    } catch (err: any) {
      setFormError(err.message || "Failed to save recipe");
    } finally {
      setSaving(false);
    }
  };

  const canEdit =
    user?.role === "OWNER" || user?.role === "MANAGER" || user?.role === "COOK";
  const canDelete = user?.role === "OWNER" || user?.role === "MANAGER";

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "COOK"]}>
      <div className="flex min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 pt-16 sm:pt-20 lg:pt-8 lg:ml-[280px]">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#735c00]">
                <ChefHat className="h-4 w-4" />
                <span>Kitchen Management</span>
              </div>

              <h1 className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1b1c1a]">
                Recipes & Menus
              </h1>

              <p className="mt-1 text-xs sm:text-sm text-[#5c5443] max-w-2xl">
                Manage kitchen recipes, ingredient proportions, preparation steps,
                prep times, and serving sizes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              {canEdit && (
                <button
                  onClick={handleOpenNew}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#735c00] px-5 py-3 text-sm sm:text-base font-bold text-white shadow-sm transition hover:bg-[#8f7300] active:scale-[0.98] text-center"
                >
                  <Plus size={18} />
                  <span>Add Recipe</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-3.5 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7f7663]">
                  Total Recipes
                </span>
                <BookOpen className="h-4 w-4 text-[#735c00]" />
              </div>
              <p className="mt-1.5 text-xl sm:text-2xl font-extrabold text-[#735c00]">
                {stats.total}
              </p>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-3.5 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7f7663]">
                  Main Courses
                </span>
                <Utensils className="h-4 w-4 text-[#735c00]" />
              </div>
              <p className="mt-1.5 text-xl sm:text-2xl font-extrabold text-[#1b1c1a]">
                {stats.mains}
              </p>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-3.5 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7f7663]">
                  Starters / Drinks
                </span>
                <Flame className="h-4 w-4 text-amber-600" />
              </div>
              <p className="mt-1.5 text-xl sm:text-2xl font-extrabold text-[#1b1c1a]">
                {stats.starters + stats.dessertsAndDrinks}
              </p>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-3.5 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7f7663]">
                  Avg Prep Time
                </span>
                <Clock className="h-4 w-4 text-[#735c00]" />
              </div>
              <p className="mt-1.5 text-xl sm:text-2xl font-extrabold text-[#735c00]">
                {stats.avgPrep} <span className="text-xs sm:text-sm font-normal text-[#5c5443]">min</span>
              </p>
            </div>
          </div>

          {/* Search & Category Filter Section */}
          <div className="mb-6 rounded-2xl border border-[#d0c5af] bg-white p-3.5 sm:p-5 shadow-sm">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7f7663]" />
                <input
                  type="text"
                  placeholder="Search recipes, ingredients, notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] pl-10 pr-10 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#735c00]/30 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#7f7663] hover:text-[#1b1c1a]"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Mobile Category Dropdown / Desktop Pill selector */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#7f7663] uppercase tracking-wider shrink-0 mr-1">
                  <Filter className="h-3.5 w-3.5" /> Category:
                </span>
                <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`rounded-xl px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                          isSelected
                            ? "bg-[#735c00] text-white shadow-sm"
                            : "bg-[#f5f3ef] text-[#5c5443] hover:bg-[#e9e6df] hover:text-[#1b1c1a]"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Filter result info */}
            {(searchQuery || selectedCategory !== "All") && (
              <div className="mt-3 pt-3 border-t border-[#f0eae0] flex items-center justify-between text-xs text-[#5c5443]">
                <span>
                  Showing <strong>{filteredItems.length}</strong> of <strong>{items.length}</strong> recipes
                </span>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="font-bold text-[#735c00] hover:underline"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#735c00] border-t-transparent"></div>
              <p className="text-sm font-semibold text-[#735c00]">Loading recipes...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700 shadow-sm">
              <p className="font-bold">Failed to load recipes</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-[#d0c5af] bg-white p-6 text-center shadow-sm">
              <div className="rounded-2xl bg-[#735c00]/10 p-4 text-[#735c00]">
                <ChefHat className="h-8 w-8" />
              </div>
              <p className="mt-3 text-lg font-bold text-[#1b1c1a]">No recipes created yet</p>
              <p className="mt-1 text-sm text-[#7f7663] max-w-sm">
                Get started by creating your first kitchen recipe with ingredients and preparation steps.
              </p>
              {canEdit && (
                <button
                  onClick={handleOpenNew}
                  className="mt-4 rounded-xl bg-[#735c00] px-6 py-2.5 font-bold text-white transition hover:bg-[#8f7300]"
                >
                  + Add First Recipe
                </button>
              )}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-[#d0c5af] bg-white p-6 text-center shadow-sm">
              <p className="text-base font-bold text-[#1b1c1a]">No matching recipes found</p>
              <p className="mt-1 text-xs sm:text-sm text-[#7f7663]">
                Try adjusting your search query or category filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-3 rounded-xl border border-[#735c00] px-4 py-1.5 text-xs font-bold text-[#735c00] hover:bg-[#735c00] hover:text-white transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* MOBILE CARDS VIEW (< md screens) */}
              <div className="grid grid-cols-1 gap-3.5 md:hidden">
                {filteredItems.map((item: any) => {
                  const ingredientLines = parseIngredientsToLines(item.ingredients, item.ingredientsNote);

                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-[#d0c5af] bg-white p-4 shadow-sm transition hover:border-[#735c00]/50"
                    >
                      {/* Top row: Name & Category */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h2 className="text-base font-extrabold text-[#1b1c1a] leading-snug">
                            {item.name}
                          </h2>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-bold ${getCategoryBadgeClass(
                                item.category
                              )}`}
                            >
                              {item.category || "Uncategorized"}
                            </span>
                            {item.notes && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-[#7f7663] bg-[#f5f3ef] px-2 py-0.5 rounded-md">
                                <Info className="h-3 w-3 text-[#735c00]" /> Notes
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Key stats row */}
                      <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-[#fbf9f5] border border-[#f0eae0] p-2.5 text-center">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#7f7663]">
                            Prep Time
                          </p>
                          <p className="mt-0.5 text-xs font-extrabold text-[#1b1c1a] flex items-center justify-center gap-1">
                            <Clock className="h-3 w-3 text-[#735c00]" />
                            {item.prepTime || 0}m
                          </p>
                        </div>
                        <div className="border-x border-[#d0c5af]/50">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#7f7663]">
                            Servings
                          </p>
                          <p className="mt-0.5 text-xs font-extrabold text-[#1b1c1a] flex items-center justify-center gap-1">
                            <Utensils className="h-3 w-3 text-[#735c00]" />
                            {item.servings || 1}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#7f7663]">
                            Ingredients
                          </p>
                          <p className="mt-0.5 text-xs font-extrabold text-[#1b1c1a]">
                            {ingredientLines.length} item{ingredientLines.length === 1 ? "" : "s"}
                          </p>
                        </div>
                      </div>

                      {/* Ingredients Preview Snippet */}
                      {ingredientLines.length > 0 && (
                        <p className="mt-2.5 text-xs text-[#5c5443] line-clamp-2 bg-[#f5f3ef]/60 rounded-lg p-2 font-mono">
                          {ingredientLines.slice(0, 2).join(" • ")}
                          {ingredientLines.length > 2 ? ` • +${ingredientLines.length - 2} more...` : ""}
                        </p>
                      )}

                      {/* Action buttons (Touch-friendly 44px height) */}
                      <div className="mt-3.5 pt-3 border-t border-[#f0eae0] flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleOpenView(item)}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#735c00]/10 px-3 py-2.5 text-xs font-bold text-[#735c00] hover:bg-[#735c00] hover:text-white transition active:scale-[0.98]"
                        >
                          <BookOpen className="h-4 w-4" />
                          <span>View Steps</span>
                        </button>

                        {canEdit && (
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="flex items-center justify-center gap-1 rounded-xl border border-[#d0c5af] px-3.5 py-2.5 text-xs font-bold text-[#5c5443] hover:bg-[#f5f3ef] hover:text-[#1b1c1a] transition active:scale-[0.98]"
                            aria-label="Edit recipe"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span>Edit</span>
                          </button>
                        )}

                        {canDelete && (
                          <button
                            onClick={() => handleDelete(item.id, item.name)}
                            className="flex items-center justify-center rounded-xl border border-red-200 px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition active:scale-[0.98]"
                            aria-label="Delete recipe"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DESKTOP TABLE VIEW (>= md screens) */}
              <div className="hidden md:block overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-[#d0c5af] bg-[#f5eed9] text-[#4c4032] text-xs font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-4">Recipe Name</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Prep Time</th>
                        <th className="p-4">Servings</th>
                        <th className="p-4">Ingredients Preview</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#d9cfbd]">
                      {filteredItems.map((item: any) => {
                        const ingredientLines = parseIngredientsToLines(item.ingredients, item.ingredientsNote);

                        return (
                          <tr
                            key={item.id}
                            className="transition hover:bg-[#fcfaf7]"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-2.5">
                                <div className="rounded-lg bg-[#735c00]/10 p-2 text-[#735c00]">
                                  <Utensils className="h-4 w-4" />
                                </div>
                                <div>
                                  <button
                                    onClick={() => handleOpenView(item)}
                                    className="font-bold text-[#1b1c1a] hover:text-[#735c00] hover:underline text-left block"
                                  >
                                    {item.name}
                                  </button>
                                  {item.notes && (
                                    <span className="text-xs text-[#7f7663] line-clamp-1">
                                      {item.notes}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="p-4">
                              <span
                                className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-bold ${getCategoryBadgeClass(
                                  item.category
                                )}`}
                              >
                                {item.category || "Main"}
                              </span>
                            </td>

                            <td className="p-4 text-[#5c5443]">
                              <div className="flex items-center gap-1.5 font-medium">
                                <Clock className="h-4 w-4 text-[#735c00]" />
                                <span>{item.prepTime || 0} mins</span>
                              </div>
                            </td>

                            <td className="p-4 text-[#5c5443]">
                              <div className="flex items-center gap-1.5 font-medium">
                                <span>{item.servings || 1} {item.servings === 1 ? "serving" : "servings"}</span>
                              </div>
                            </td>

                            <td className="p-4 text-xs text-[#5c5443] max-w-xs truncate font-mono">
                              {ingredientLines.slice(0, 3).join(", ") || "—"}
                            </td>

                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenView(item)}
                                  className="rounded-lg border border-[#d0c5af] bg-white px-2.5 py-1.5 text-xs font-bold text-[#735c00] hover:bg-[#735c00] hover:text-white transition"
                                  title="View recipe details"
                                >
                                  View
                                </button>

                                {canEdit && (
                                  <button
                                    onClick={() => handleOpenEdit(item)}
                                    className="rounded-lg p-1.5 text-[#5c5443] hover:bg-[#f5f3ef] hover:text-[#1b1c1a] transition"
                                    title="Edit recipe"
                                  >
                                    <Pencil size={16} />
                                  </button>
                                )}

                                {canDelete && (
                                  <button
                                    onClick={() => handleDelete(item.id, item.name)}
                                    className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 transition"
                                    title="Delete recipe"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* VIEW RECIPE / CHEF COOKING MODE SLIDEPANEL */}
          <SlidePanel
            open={!!viewRecipe}
            onClose={() => setViewRecipe(null)}
            title={viewRecipe?.name || "Recipe Details"}
            subtitle="Chef Cooking Mode & Step-by-Step Instructions"
            icon={<ChefHat className="h-5 w-5" />}
          >
            {viewRecipe && (
              <div className="space-y-6 pb-6">
                {/* Meta Summary Cards */}
                <div className="grid grid-cols-3 gap-2.5 rounded-2xl bg-[#f5f3ef] border border-[#d0c5af] p-3.5 text-center">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7f7663]">
                      Category
                    </span>
                    <p className="mt-0.5 text-xs sm:text-sm font-extrabold text-[#735c00] truncate">
                      {viewRecipe.category || "Main"}
                    </p>
                  </div>
                  <div className="border-x border-[#d0c5af]/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7f7663]">
                      Prep Time
                    </span>
                    <p className="mt-0.5 text-xs sm:text-sm font-extrabold text-[#1b1c1a] flex items-center justify-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-[#735c00]" />
                      {viewRecipe.prepTime || 0} mins
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7f7663]">
                      Servings
                    </span>
                    <p className="mt-0.5 text-xs sm:text-sm font-extrabold text-[#1b1c1a] flex items-center justify-center gap-1">
                      <Utensils className="h-3.5 w-3.5 text-[#735c00]" />
                      {viewRecipe.servings || 1}
                    </p>
                  </div>
                </div>

                {/* Chef Notes / Allergens Callout if any */}
                {viewRecipe.notes && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-amber-900">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="h-4 w-4 text-amber-600" />
                      <span>Chef Notes & Tips</span>
                    </div>
                    <p className="mt-1.5 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                      {viewRecipe.notes}
                    </p>
                  </div>
                )}

                {/* Ingredients Checklist */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h3 className="text-sm sm:text-base font-bold text-[#1b1c1a] flex items-center gap-2">
                      <Utensils className="h-4 w-4 text-[#735c00]" />
                      <span>Ingredients Checklist</span>
                    </h3>
                    <span className="text-xs text-[#7f7663]">
                      Tap items to cross off
                    </span>
                  </div>

                  <div className="space-y-1.5 rounded-xl border border-[#d0c5af] bg-white p-3">
                    {parseIngredientsToLines(viewRecipe.ingredients, viewRecipe.ingredientsNote)
                      .map((ingredient: string, idx: number) => {
                        const isChecked = checkedIngredients[idx];
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleIngredientCheck(idx)}
                            className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition select-none ${
                              isChecked
                                ? "bg-emerald-50 text-emerald-800 line-through opacity-70"
                                : "hover:bg-[#f5f3ef] text-[#1b1c1a]"
                            }`}
                          >
                            <button
                              type="button"
                              className="mt-0.5 text-[#735c00] shrink-0"
                            >
                              {isChecked ? (
                                <CheckSquare className="h-4 w-4 text-emerald-600" />
                              ) : (
                                <Square className="h-4 w-4 text-[#7f7663]" />
                              )}
                            </button>
                            <span className="text-xs sm:text-sm font-medium leading-relaxed font-mono">
                              {ingredient}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Preparation Method / Instructions */}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#1b1c1a] mb-2.5 flex items-center gap-2">
                    <Flame className="h-4 w-4 text-[#735c00]" />
                    <span>Preparation Method</span>
                  </h3>

                  <div className="space-y-2.5">
                    {(viewRecipe.instructions || "")
                      .split("\n")
                      .filter((step: string) => step.trim().length > 0)
                      .map((step: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 rounded-xl border border-[#d0c5af] bg-white p-3 sm:p-4 shadow-sm"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#735c00] text-xs font-extrabold text-white">
                            {idx + 1}
                          </span>
                          <p className="text-xs sm:text-sm text-[#1b1c1a] leading-relaxed pt-0.5 whitespace-pre-wrap">
                            {step}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Modal Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2.5 pt-4 border-t border-[#d0c5af]">
                  {canEdit && (
                    <button
                      onClick={() => {
                        const itemToEdit = viewRecipe;
                        setViewRecipe(null);
                        handleOpenEdit(itemToEdit);
                      }}
                      className="w-full sm:w-1/2 rounded-xl bg-[#735c00] py-3 text-sm font-bold text-white transition hover:bg-[#8f7300] text-center"
                    >
                      Edit Recipe
                    </button>
                  )}
                  <button
                    onClick={() => setViewRecipe(null)}
                    className="w-full sm:flex-1 rounded-xl border border-[#d0c5af] py-3 text-sm font-bold text-[#5c5443] transition hover:bg-[#f5f3ef] text-center"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </SlidePanel>

          {/* ADD / EDIT SLIDEPANEL */}
          <SlidePanel
            open={panelOpen}
            onClose={() => setPanelOpen(false)}
            title={editItem ? "Edit Recipe" : "Add New Recipe"}
            subtitle="Recipe details, ingredients, prep time & serving portions"
            icon={<ChefHat className="h-5 w-5" />}
          >
            <form onSubmit={handleSubmit} className="space-y-4 pb-6">
              {formError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs sm:text-sm font-bold text-red-700">
                  {formError}
                </div>
              )}

              {/* Recipe Name */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#4d4635] mb-1">
                  Recipe Name *
                </label>
                <input
                  required
                  placeholder="e.g. Creamy Chicken Alfredo"
                  className="w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 text-base text-[#1b1c1a] outline-none focus:ring-2 focus:ring-[#735c00]/30 transition"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#4d4635] mb-1">
                  Category
                </label>
                <select
                  className="w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 text-base text-[#1b1c1a] outline-none focus:ring-2 focus:ring-[#735c00]/30 transition"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="Main">Main Course</option>
                  <option value="Starter">Starter / Appetizer</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Beverage">Beverage</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Event Menu">Event Menu</option>
                </select>
              </div>

              {/* Prep Time & Servings Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#4d4635] mb-1">
                    Prep Time (mins)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 25"
                    className="w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 text-base text-[#1b1c1a] outline-none focus:ring-2 focus:ring-[#735c00]/30 transition"
                    value={formData.prepTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        prepTime: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#4d4635] mb-1">
                    Servings
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 4"
                    className="w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 text-base text-[#1b1c1a] outline-none focus:ring-2 focus:ring-[#735c00]/30 transition"
                    value={formData.servings}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        servings: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
              </div>

              {/* Ingredients List */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs sm:text-sm font-bold text-[#4d4635]">
                    Ingredients *
                  </label>
                  <span className="text-[11px] text-[#7f7663]">
                    1 item per line
                  </span>
                </div>
                <textarea
                  required
                  rows={5}
                  placeholder={`Chicken Breast - 500g\nFettuccine Pasta - 400g\nHeavy Cream - 250ml\nParmesan Cheese - 100g\nGarlic - 4 cloves`}
                  className="w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-3 text-base font-mono text-[#1b1c1a] outline-none focus:ring-2 focus:ring-[#735c00]/30 transition"
                  value={formData.ingredients}
                  onChange={(e) =>
                    setFormData({ ...formData, ingredients: e.target.value })
                  }
                />
              </div>

              {/* Instructions */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs sm:text-sm font-bold text-[#4d4635]">
                    Instructions *
                  </label>
                  <span className="text-[11px] text-[#7f7663]">
                    Step-by-step
                  </span>
                </div>
                <textarea
                  required
                  rows={5}
                  placeholder={`1. Boil salted water and cook pasta al dente.\n2. Sauté minced garlic in butter until fragrant.\n3. Add sliced chicken and cook until golden brown.\n4. Pour in cream and simmer until thickened.\n5. Fold in pasta and fresh parmesan cheese.`}
                  className="w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-3 text-base text-[#1b1c1a] outline-none focus:ring-2 focus:ring-[#735c00]/30 transition"
                  value={formData.instructions}
                  onChange={(e) =>
                    setFormData({ ...formData, instructions: e.target.value })
                  }
                />
              </div>

              {/* Chef Notes / Allergens */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#4d4635] mb-1">
                  Chef Notes & Allergens (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Contains Dairy, Gluten. Can be made gluten-free with corn pasta."
                  className="w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-3 text-base text-[#1b1c1a] outline-none focus:ring-2 focus:ring-[#735c00]/30 transition"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>

              {/* Form Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:flex-1 rounded-xl bg-[#735c00] py-3.5 text-base font-bold text-white transition hover:bg-[#8f7300] active:scale-[0.98] disabled:opacity-50 text-center"
                >
                  {saving
                    ? "Saving..."
                    : editItem
                    ? "Update Recipe"
                    : "Save Recipe"}
                </button>
                <button
                  type="button"
                  onClick={() => setPanelOpen(false)}
                  className="w-full sm:w-auto rounded-xl border border-[#d0c5af] px-6 py-3.5 text-base font-bold text-[#5c5443] transition hover:bg-[#f5f3ef] text-center"
                >
                  Cancel
                </button>
              </div>
            </form>
          </SlidePanel>
        </main>
      </div>
    </ProtectedRoute>
  );
}
