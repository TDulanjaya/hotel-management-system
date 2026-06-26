"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getUser, AuthUser } from "@/utils/auth";

type ChargeItem = {
  id: string;
  name: string;
  category:
  | "Menu"
  | "Bites"
  | "Drinks"
  | "Bar"
  | "PARKING"
  | "Amenity"
  | "Room Service"
  | "Laundry"
  | "Spa"
  | "Event Service"
  | "Other";
  description: string;
  priceType: "fixed" | "perPerson" | "perHour" | "perDay" | "perVehicle";
  price: number;
  status: "Active" | "Inactive";
};

import { getPricingItems, deletePricingItem as apiDeletePricingItem } from "@/lib/api/pricingApi";

function getCategoryClass(category: string) {
  if (category === "Menu") return "bg-green-100 text-green-700";
  if (category === "Bites") return "bg-yellow-100 text-yellow-700";
  if (category === "Drinks") return "bg-blue-100 text-blue-700";
  if (category === "Bar") return "bg-purple-100 text-purple-700";
  if (category === "PARKING") return "bg-slate-100 text-slate-700";
  if (category === "Amenity") return "bg-pink-100 text-pink-700";
  if (category === "Event Service") return "bg-orange-100 text-orange-700";

  return "bg-gray-100 text-gray-700";
}

function formatPriceType(priceType: string) {
  if (priceType === "perPerson") return "Per Person";
  if (priceType === "perHour") return "Per Hour";
  if (priceType === "perDay") return "Per Day";
  if (priceType === "perVehicle") return "Per Vehicle";

  return "Fixed";
}

export default function PricingPage() {
  const [items, setItems] = useState<ChargeItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [user, setUser] = useState<AuthUser | null>(null);

  const fetchItems = async () => {
    try {
      const data = await getPricingItems();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch pricing items", error);
    }
  };

  useEffect(() => {
    setUser(getUser());
    fetchItems();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(items.map((item) => item.category))
    );

    return ["All", ...uniqueCategories];
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

    if (!confirmed) {
      return;
    }

    try {
      await apiDeletePricingItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete pricing item", error);
      alert("Unable to delete pricing item.");
    }
  };

  const resetDefaultItems = () => {
    fetchItems();
  };

  const activeCount = items.filter((item) => item.status === "Active").length;
  const inactiveCount = items.filter((item) => item.status === "Inactive").length;
  const totalValue = items.reduce((total, item) => total + item.price, 0);

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "EVENTS"]}>
      <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#806300]">
                Master Price Control
              </p>

              <h1 className="mt-3 text-5xl font-extrabold tracking-tight">
                Service Pricing
              </h1>

              <p className="mt-3 max-w-3xl text-lg text-[#4d4635]">
                Control menu prices, bites, drinks, bar packages, parking,
                amenities, and hotel service charges from one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={resetDefaultItems}
                className="rounded-xl border border-[#806300] bg-white px-6 py-4 font-bold text-[#806300] transition hover:bg-[#faf8f3]"
              >
                Reset Defaults
              </button>

              <Link
                href="/pricing/new"
                className="rounded-xl bg-[#d8b328] px-7 py-4 text-lg font-bold text-[#4c3a00] transition hover:-translate-y-1 hover:bg-[#f2c426] hover:shadow-xl"
              >
                + Add Price Item
              </Link>
            </div>
          </div>

          <section className="mb-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-wider text-[#806300]">
                Active Items
              </p>
              <h2 className="mt-3 text-4xl font-extrabold">{activeCount}</h2>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-wider text-[#806300]">
                Inactive Items
              </p>
              <h2 className="mt-3 text-4xl font-extrabold">{inactiveCount}</h2>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-wider text-[#806300]">
                Total Base Price Value
              </p>
              <h2 className="mt-3 text-4xl font-extrabold">
                Rs{totalValue.toLocaleString()}
              </h2>
            </div>
          </section>

          <section className="mb-6 grid gap-4 md:grid-cols-[1fr_240px]">
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search menu, parking, bar, amenity..."
              className="rounded-xl border border-[#d0c5af] bg-white px-5 py-4 outline-none focus:ring-2 focus:ring-[#806300]/30"
            />

            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="rounded-xl border border-[#d0c5af] bg-white px-5 py-4 outline-none focus:ring-2 focus:ring-[#806300]/30"
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
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
                            className={`rounded-full px-3 py-1 text-xs font-bold Rs{getCategoryClass(
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
                            className={`rounded-full px-3 py-1 text-xs font-bold Rs{
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
                              <Link
                                href={`/pricing/${item.id}/edit`}
                                className="rounded-lg border border-[#735c00] px-4 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
                              >
                                Edit
                              </Link>
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
      </div>
    </ProtectedRoute>
  );
}