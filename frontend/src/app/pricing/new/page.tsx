"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

type ChargeItem = {
  id: string;
  name: string;
  category:
  | "Menu"
  | "Bites"
  | "Drinks"
  | "Bar"
  | "Parking"
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

const categories: ChargeItem["category"][] = [
  "Menu",
  "Bites",
  "Drinks",
  "Bar",
  "Parking",
  "Amenity",
  "Room Service",
  "Laundry",
  "Spa",
  "Event Service",
  "Other",
];

const priceTypes: ChargeItem["priceType"][] = [
  "fixed",
  "perPerson",
  "perHour",
  "perDay",
  "perVehicle",
];

function formatPriceType(priceType: string) {
  if (priceType === "perPerson") return "Per Person";
  if (priceType === "perHour") return "Per Hour";
  if (priceType === "perDay") return "Per Day";
  if (priceType === "perVehicle") return "Per Vehicle";

  return "Fixed";
}

export default function NewPricingItemPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const editId = searchParams.get("id");
  const isEditMode = Boolean(editId);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<ChargeItem["category"]>("Menu");
  const [description, setDescription] = useState("");
  const [priceType, setPriceType] = useState<ChargeItem["priceType"]>("fixed");
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState<ChargeItem["status"]>("Active");

  useEffect(() => {
    if (!editId) {
      return;
    }

    const savedItems: ChargeItem[] = JSON.parse(
      localStorage.getItem("hotel_charge_items") || "[]"
    );

    const selectedItem = savedItems.find((item) => item.id === editId);

    if (!selectedItem) {
      alert("Price item not found.");
      router.push("/pricing");
      return;
    }

    setName(selectedItem.name);
    setCategory(selectedItem.category);
    setDescription(selectedItem.description);
    setPriceType(selectedItem.priceType);
    setPrice(selectedItem.price);
    setStatus(selectedItem.status);
  }, [editId, router]);

  const itemId = useMemo(() => {
    return (
      editId ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-Rs)/g, "") + `-${Date.now()}`
    );
  }, [editId, name]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const savedItems: ChargeItem[] = JSON.parse(
      localStorage.getItem("hotel_charge_items") || "[]"
    );

    const itemData: ChargeItem = {
      id: itemId,
      name,
      category,
      description,
      priceType,
      price,
      status,
    };

    let updatedItems: ChargeItem[];

    if (isEditMode) {
      updatedItems = savedItems.map((item) =>
        item.id === editId ? itemData : item
      );
    } else {
      updatedItems = [itemData, ...savedItems];
    }

    localStorage.setItem("hotel_charge_items", JSON.stringify(updatedItems));
    router.push("/pricing");
  };

  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "events"]}>
      <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#806300]">
                Master Price Control
              </p>

              <h1 className="mt-3 text-5xl font-extrabold tracking-tight">
                {isEditMode ? "Edit Price Item" : "Add Price Item"}
              </h1>

              <p className="mt-3 max-w-3xl text-lg text-[#4d4635]">
                Add or update prices for menus, parking, amenities, room
                service, bar packages, and event services.
              </p>
            </div>

            <Link
              href="/pricing"
              className="rounded-xl border border-[#806300] bg-white px-7 py-4 text-lg font-bold text-[#806300] transition hover:bg-[#faf8f3]"
            >
              Back to Pricing
            </Link>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-8 xl:grid-cols-[1fr_0.6fr]"
          >
            <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Price Item Details</h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-[#4d4635]">
                    Item Name
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
                    Category
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

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Price Type
                  </label>

                  <select
                    value={priceType}
                    onChange={(event) =>
                      setPriceType(
                        event.target.value as ChargeItem["priceType"]
                      )
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
                    Price
                  </label>

                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(event) => setPrice(Number(event.target.value))}
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
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
                    required
                    rows={5}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Describe what this charge includes..."
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Link
                  href="/pricing"
                  className="flex-1 rounded-xl border border-[#806300] bg-white px-7 py-4 text-center font-bold text-[#806300] transition hover:bg-[#faf8f3]"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#d8b328] px-7 py-4 font-bold text-[#4c3a00] transition hover:bg-[#f2c426]"
                >
                  {isEditMode ? "Update Price Item" : "Save Price Item"}
                </button>
              </div>
            </section>

            <aside className="h-fit rounded-2xl bg-[#344056] p-6 text-white shadow-xl xl:sticky xl:top-8">
              <p className="text-sm font-bold uppercase tracking-widest text-slate-300">
                Preview
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#d8b328]">
                {name || "Item Name"}
              </h2>

              <p className="mt-3 text-slate-300">
                {description || "Item description will appear here."}
              </p>

              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">Category</p>
                <p className="mt-1 text-lg font-bold">{category}</p>
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">Price Type</p>
                <p className="mt-1 text-lg font-bold">
                  {formatPriceType(priceType)}
                </p>
              </div>

              <div className="mt-6">
                <p className="text-sm font-bold uppercase tracking-widest text-slate-400">
                  Price
                </p>

                <p className="mt-2 text-5xl font-extrabold text-[#d8b328]">
                  Rs{price.toLocaleString()}
                </p>
              </div>
            </aside>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}