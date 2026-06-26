"use client";
import { useSearchParams } from "next/navigation";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getPricingItemById, updatePricingItem } from "@/lib/api/pricingApi";

export default function EditPricingPage() {
  const searchParams = useSearchParams();
  const rawId = searchParams.get("id");

  const router = useRouter();
  const params = useParams();
  const id = rawId as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Menu");
  const [description, setDescription] = useState("");
  const [priceType, setPriceType] = useState("fixed");
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    async function loadItem() {
      try {
        const data = await getPricingItemById(id);
        setName(data.name || "");
        setCategory(data.category || "Menu");
        setDescription(data.description || "");
        setPriceType(data.priceType || "fixed");
        setPrice(data.price || 0);
        setStatus(data.status || "Active");
      } catch (err: any) {
        setError("Failed to load pricing item.");
      } finally {
        setFetching(false);
      }
    }
    loadItem();
  }, [id]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await updatePricingItem(id, {
        name,
        category,
        description,
        priceType,
        price,
        status,
      });
      router.push("/pricing");
    } catch (err: any) {
      setError(err.message || "Failed to update pricing item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER"]}>
      <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#806300]">Master Price Control</p>
              <h1 className="mt-3 text-5xl font-extrabold tracking-tight">Edit Price Item</h1>
            </div>
            <Link href="/pricing" className="rounded-xl border border-[#806300] bg-white px-7 py-4 text-lg font-bold text-[#806300] transition hover:bg-[#faf8f3]">
              Back to Pricing
            </Link>
          </div>

          {fetching ? (
            <p>Loading details...</p>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-8 xl:grid-cols-[1fr_0.6fr]">
              <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                {error && <div className="mb-4 text-red-600">{error}</div>}
                <h2 className="text-2xl font-bold">Price Item Details</h2>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="text-sm font-bold text-[#4d4635]">Item Name</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30" />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[#4d4635]">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                      {["Menu", "Bites", "Drinks", "Bar", "PARKING", "Amenity", "Room Service", "Laundry", "Spa", "Event Service", "Other"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[#4d4635]">Price Type</label>
                    <select value={priceType} onChange={(e) => setPriceType(e.target.value)} className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                      {["fixed", "perPerson", "perHour", "perDay", "perVehicle"].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[#4d4635]">Price</label>
                    <input type="number" required min={0} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30" />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[#4d4635]">Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-bold text-[#4d4635]">Description</label>
                    <textarea required rows={5} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30" />
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <Link href="/pricing" className="flex-1 rounded-xl border border-[#806300] bg-white px-7 py-4 text-center font-bold text-[#806300] transition hover:bg-[#faf8f3]">
                    Cancel
                  </Link>
                  <button type="submit" disabled={loading} className="flex-1 rounded-xl bg-[#d8b328] px-7 py-4 font-bold text-[#4c3a00] transition hover:bg-[#f2c426]">
                    {loading ? "Updating..." : "Update Price Item"}
                  </button>
                </div>
              </section>

              <aside className="h-fit rounded-2xl bg-[#344056] p-6 text-white shadow-xl xl:sticky xl:top-8">
                <p className="text-sm font-bold uppercase tracking-widest text-slate-300">Preview</p>
                <h2 className="mt-3 text-3xl font-bold text-[#d8b328]">{name || "Item Name"}</h2>
                <p className="mt-3 text-slate-300">{description || "Item description will appear here."}</p>
                <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-300">Category</p>
                  <p className="mt-1 text-lg font-bold">{category}</p>
                </div>
                <div className="mt-6">
                  <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Price</p>
                  <p className="mt-2 text-5xl font-extrabold text-[#d8b328]">Rs {price.toLocaleString()}</p>
                </div>
              </aside>
            </form>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
