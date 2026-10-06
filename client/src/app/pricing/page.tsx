"use client";
import { useEffect, useMemo, useState, FormEvent, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getUser, AuthUser } from "@/utils/auth";
import SlidePanel from "@/components/ui/SlidePanel";
import { Tag } from "lucide-react";
import {
  getPricingItems,
  deletePricingItem as apiDeletePricingItem,
  createPricingItem,
  updatePricingItem,
  getRecipes,
} from "@/lib/api/pricingApi";

type ChargeItem = {
  id: string;
  name: string;
  category:
  | "RESTAURANT_FOOD"
  | "ROOM_SERVICE_FOOD"
  | "BEVERAGE"
  | "DESSERT"
  | "PARKING"
  | "GAME"
  | "LAUNDRY"
  | "EVENT_PACKAGE"
  | "EVENT_SERVICE"
  | "AMENITY"
  | "Menu"
  | "Bites"
  | "Drinks"
  | "Bar"
  | "Amenity"
  | "Room Service"
  | "Laundry"
  | "Event Service"
  | "Other";
  description: string;
  priceType: "fixed" | "perPerson" | "perHour" | "perDay" | "perVehicle";
  price: number;
  status: "Active" | "Inactive";
};

const categories: ChargeItem["category"][] = [
  "RESTAURANT_FOOD",
  "ROOM_SERVICE_FOOD",
  "BEVERAGE",
  "DESSERT",
  "PARKING",
  "GAME",
  "LAUNDRY",
  "EVENT_PACKAGE",
  "EVENT_SERVICE",
  "AMENITY",
  "Other",
];

const priceTypes: ChargeItem["priceType"][] = [
  "fixed",
  "perPerson",
  "perHour",
  "perDay",
  "perVehicle",
];

function getCategoryClass(category: string) {
  const cat = String(category || "").toUpperCase();
  if (cat.includes("RESTAURANT") || cat.includes("MENU")) return "bg-green-100 text-green-700";
  if (cat.includes("ROOM_SERVICE")) return "bg-emerald-100 text-emerald-700";
  if (cat.includes("BEVERAGE") || cat.includes("DRINK") || cat.includes("BAR")) return "bg-blue-100 text-blue-700";
  if (cat.includes("DESSERT") || cat.includes("BITE")) return "bg-yellow-100 text-yellow-700";
  if (cat.includes("PARKING")) return "bg-slate-100 text-slate-700";
  if (cat.includes("GAME")) return "bg-indigo-100 text-indigo-700";
  if (cat.includes("LAUNDRY")) return "bg-cyan-100 text-cyan-700";
  if (cat.includes("EVENT")) return "bg-orange-100 text-orange-700";
  if (cat.includes("AMENITY") || cat.includes("SPA")) return "bg-pink-100 text-pink-700";

  return "bg-gray-100 text-gray-700";
}

function formatPriceType(priceType: string) {
  if (priceType === "perPerson") return "Per Person";
  if (priceType === "perHour") return "Per Hour";
  if (priceType === "perDay") return "Per Day";
  if (priceType === "perVehicle") return "Per Vehicle";

  return "Fixed";
}

function PricingPageContent() {
  const { data: rawItems, mutate, isLoading: isSwrLoading } = useSWR<ChargeItem[]>("/api/pricing");
  const items = useMemo(() => (Array.isArray(rawItems) ? rawItems : []), [rawItems]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [user, setUser] = useState<AuthUser | null>(null);

  const searchParams = useSearchParams();
  const [panelOpen, setPanelOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  // Form states
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ChargeItem["category"]>("Menu");
  const [description, setDescription] = useState("");
  const [priceType, setPriceType] = useState<ChargeItem["priceType"]>("fixed");
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState<ChargeItem["status"]>("Active");
  const [recipeId, setRecipeId] = useState("");
  const [recipes, setRecipes] = useState<any[]>([]);

  useEffect(() => {
    async function loadRecipesList() {
      try {
        const data = await getRecipes();
        setRecipes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load recipes:", err);
      }
    }
    loadRecipesList();
  }, []);

  useEffect(() => {
    setUser(getUser());
    if (searchParams.get("openPanel") === "true") {
      handleOpenAdd();
    }
  }, [searchParams]);

  const uniqueCategories = useMemo(() => {
    const uc = Array.from(new Set(items.map((item) => item.category)));
    return ["All", ...uc];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;

      const matchesSearch =
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase()) ||
        item.category.toLowerCase().includes(searchText.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [items, categoryFilter, searchText]);

  const deleteItem = async (id: string) => {
    const confirmed = confirm("Delete this price item?");
    if (!confirmed) return;

    try {
      await apiDeletePricingItem(id);
      mutate();
    } catch (error) {
      console.error("Failed to delete pricing item", error);
      alert("Unable to delete pricing item.");
    }
  };

  const resetDefaultItems = () => {
    mutate();
  };

  const handleOpenAdd = () => {
    setEditItem(null);
    setFormError("");
    setName("");
    setCategory("Menu");
    setRecipeId("");
    setDescription("");
    setPriceType("fixed");
    setPrice(0);
    setStatus("Active");
    setPanelOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditItem(item);
    setFormError("");
    setName(item.name || "");
    setCategory(item.category || "Menu");
    setRecipeId(item.recipeId || "");
    setDescription(item.description || "");
    setPriceType(item.priceType || "fixed");
    setPrice(item.price || 0);
    setStatus(item.status || "Active");
    setPanelOpen(true);
  };

  const handleSavePricingItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      const payload = {
        name,
        category,
        recipeId:
          ["Menu", "Bites", "Room Service", "RESTAURANT_FOOD", "ROOM_SERVICE_FOOD", "DESSERT"].includes(category) &&
          recipeId
            ? recipeId
            : null,
        description,
        priceType,
        price: Number(price),
        status,
      };

      if (editItem) {
        await updatePricingItem(editItem.id, payload);
      } else {
        await createPricingItem(payload);
      }

      setPanelOpen(false);
      setEditItem(null);
      mutate();
      
      // reset form
      setName("");
      setCategory("Menu");
      setRecipeId("");
      setDescription("");
      setPriceType("fixed");
      setPrice(0);
      setStatus("Active");
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || "Failed to save pricing item");
    } finally {
      setFormLoading(false);
    }
  };

  const activeCount = useMemo(() => items.filter((item) => item.status === "Active").length, [items]);
  const inactiveCount = useMemo(() => items.filter((item) => item.status === "Inactive").length, [items]);
  const totalValue = useMemo(() => items.reduce((total, item) => total + item.price, 0), [items]);

  return (
    <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
      <AppSidebar />

      <main className="px-4 py-6 pt-16 sm:px-8 sm:py-10 lg:pt-10 lg:ml-[280px]">
        <div className="mb-6 sm:mb-8 flex flex-col justify-between gap-4 sm:gap-5 xl:flex-row xl:items-end">
          <div>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-[#806300]">
              Master Price Control
            </p>

            <h1 className="mt-1 sm:mt-3 text-2xl sm:text-5xl font-extrabold tracking-tight">
              Service Pricing
            </h1>

            <p className="mt-1 sm:mt-3 max-w-3xl text-xs sm:text-lg text-[#4d4635]">
              Control menu prices, bites, drinks, bar packages, parking,
              amenities, and hotel service charges from one place.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 w-full xl:w-auto">
            <button
              onClick={resetDefaultItems}
              className="w-full sm:w-auto rounded-xl border border-[#806300] bg-white px-5 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-bold text-[#806300] transition hover:bg-[#faf8f3]"
            >
              Reset Defaults
            </button>

            <button
              onClick={handleOpenAdd}
              className="w-full sm:w-auto rounded-xl bg-[#d8b328] px-5 sm:px-7 py-3 sm:py-4 text-sm sm:text-lg font-bold text-[#4c3a00] transition hover:-translate-y-1 hover:bg-[#f2c426] hover:shadow-xl text-center"
            >
              + Add Price Item
            </button>
          </div>
        </div>

        <section className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
          <div className="rounded-2xl border border-[#d0c5af] bg-white p-4 sm:p-6 shadow-sm">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#806300]">
              Active Items
            </p>
            <h2 className="mt-1 sm:mt-3 text-2xl sm:text-4xl font-extrabold">{activeCount}</h2>
          </div>

          <div className="rounded-2xl border border-[#d0c5af] bg-white p-4 sm:p-6 shadow-sm">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#806300]">
              Inactive Items
            </p>
            <h2 className="mt-1 sm:mt-3 text-2xl sm:text-4xl font-extrabold">{inactiveCount}</h2>
          </div>

          <div className="rounded-2xl border border-[#d0c5af] bg-white p-4 sm:p-6 shadow-sm">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#806300]">
              Total Base Price Value
            </p>
            <h2 className="mt-1 sm:mt-3 text-2xl sm:text-4xl font-extrabold">
              Rs{totalValue.toLocaleString()}
            </h2>
          </div>
        </section>

        <section className="mb-6 grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-[1fr_240px]">
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search menu, parking, bar, amenity..."
            className="rounded-xl border border-[#d0c5af] bg-white px-4 sm:px-5 py-3 sm:py-4 text-base outline-none focus:ring-2 focus:ring-[#806300]/30"
          />

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="rounded-xl border border-[#d0c5af] bg-white px-4 sm:px-5 py-3 sm:py-4 text-base outline-none focus:ring-2 focus:ring-[#806300]/30"
          >
            {uniqueCategories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead>
                <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price Type</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#d0c5af]">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center">
                      <p className="text-lg font-bold text-[#735c00]">
                        No price items found.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="transition hover:bg-[#fbf9f5]"
                    >
                      <td className="px-6 py-5">
                        <p className="font-bold">{item.name}</p>
                        <p className="mt-1 text-sm text-[#4d4635]">
                          {item.description}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getCategoryClass(
                            item.category
                          )}`}
                        >
                          {item.category}
                        </span>
                      </td>

                      <td className="px-6 py-5 font-semibold">
                        {formatPriceType(item.priceType)}
                      </td>

                      <td className="px-6 py-5 text-xl font-bold text-[#735c00]">
                        Rs{item.price.toLocaleString()}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            item.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-3">
                          {(user?.role === "OWNER" || user?.role === "MANAGER") && (
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="rounded-lg border border-[#735c00] px-4 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
                            >
                              Edit
                            </button>
                          )}

                          {(user?.role === "OWNER" || user?.role === "MANAGER") && (
                            <button
                              onClick={() => deleteItem(item.id)}
                              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <SlidePanel 
        open={panelOpen} 
        onClose={() => setPanelOpen(false)} 
        title={editItem ? "Edit Price Item" : "Add Price Item"} 
        subtitle={
          editItem
            ? `Updating price and configuration for ${editItem.name}`
            : "Add prices for menus, parking, amenities, room service, bar packages, and event services."
        }
        icon={<Tag className="h-5 w-5 text-[#735c00]" />}
      >
        {formError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {formError}
          </div>
        )}

        <form onSubmit={handleSavePricingItem} className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-[#4d4635]">
                Item Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Gold Buffet Menu / Car Parking / Pool Access"
                className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-[#4d4635]">
                Category *
              </label>
              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as ChargeItem["category"])
                }
                className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            {/* Relational Recipe selector for food items */}
            {(category === "Menu" || category === "Bites" || category === "Room Service" || category === "RESTAURANT_FOOD" || category === "ROOM_SERVICE_FOOD" || category === "DESSERT") && (
              <div className="md:col-span-2 rounded-xl border border-[#e2dacf] bg-[#faf8f4] p-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[#735c00]">
                  Connected Kitchen Recipe (Optional)
                </label>
                <select
                  value={recipeId}
                  onChange={(e) => setRecipeId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#735c00]/30"
                >
                  <option value="">-- No Recipe Linked --</option>
                  {recipes.map((r: any) => (
                    <option key={r.id} value={r.id}>
                      {r.recipeName || r.name} ({r.category || "Kitchen"} - Serves {r.servingPortions || r.servings || 1})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-[#735c00]">
                  Links directly to Recipe catalog. Ordering this dish deducts inventory ingredients automatically.
                </p>
              </div>
            )}

            <div>
              <label className="text-sm font-bold text-[#4d4635]">
                Price Type
              </label>
              <select
                value={priceType}
                onChange={(event) =>
                  setPriceType(event.target.value as ChargeItem["priceType"])
                }
                className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              >
                {priceTypes.map((item) => (
                  <option key={item} value={item}>
                    {formatPriceType(item)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-[#4d4635]">
                Price (Rs) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={price}
                onChange={(event) => setPrice(Number(event.target.value))}
                className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30 font-bold"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-[#4d4635]">
                Status
              </label>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as ChargeItem["status"])
                }
                className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-bold text-[#4d4635]">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe what this charge includes..."
                className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-[#d0c5af]">
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              className="flex-1 rounded-xl border border-[#d0c5af] px-8 py-3.5 font-bold text-[#4d4635] transition hover:bg-[#ece9e2]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="flex-1 rounded-xl bg-[#d8b328] px-8 py-3.5 font-bold text-[#4c3a00] transition hover:bg-[#f2c426] disabled:opacity-50"
            >
              {formLoading ? "Saving..." : editItem ? "Update Item" : "Save Price Item"}
            </button>
          </div>
        </form>
      </SlidePanel>
    </div>
  );
}

export default function PricingPage() {
  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "EVENTS"]}>
      <Suspense fallback={<div className="p-8">Loading pricing...</div>}>
        <PricingPageContent />
      </Suspense>
    </ProtectedRoute>
  );
}
