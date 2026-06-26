"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { purchaseStock, getInventoryItems } from "@/lib/api/inventoryApi";

function PurchaseForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultItemId = searchParams?.get("itemId") || "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    itemId: defaultItemId,
    quantity: 0,
    purchasePrice: 0,
    supplierName: "",
    note: "Stock purchase"
  });

  useEffect(() => {
    async function fetchItems() {
      try {
        const data = await getInventoryItems();
        setItems(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchItems();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemId) {
      setError("Please select an item");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await purchaseStock(formData.itemId, {
        quantity: Number(formData.quantity),
        purchasePrice: Number(formData.purchasePrice),
        supplierName: formData.supplierName,
        note: formData.note
      });
      router.push("/inventory");
    } catch (err: any) {
      setError(err.message || "Failed to purchase stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-[#4d4635]">Select Item</label>
          <select name="itemId" value={formData.itemId} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3">
            <option value="" disabled>Select an inventory item</option>
            {items.map(item => (
              <option key={item.id} value={item.id}>{item.itemName}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#4d4635]">Add Quantity</label>
            <input required type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#4d4635]">Purchase Price</label>
            <input required type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#4d4635]">Supplier Name</label>
          <input required type="text" name="supplierName" value={formData.supplierName} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#4d4635]">Note</label>
          <input required type="text" name="note" value={formData.note} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading} className="rounded-xl bg-[#735c00] px-8 py-3 font-bold text-white transition hover:bg-[#d4af37]">
            {loading ? "Purchasing..." : "Complete Purchase"}
          </button>
          <Link href="/inventory" className="rounded-xl border border-[#d0c5af] px-8 py-3 font-bold text-[#4d4635] transition hover:bg-[#f5f3ef]">
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}

export default function PurchaseStockPage() {
  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "INVENTORY"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />
        <main className="page-slide-in px-8 py-10 lg:ml-[280px]">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#735c00]">Purchase Request</h1>
          </div>
          
          <div className="max-w-2xl rounded-2xl border border-[#d0c5af] bg-white p-8 shadow-sm">
            <Suspense fallback={<div>Loading form...</div>}>
              <PurchaseForm />
            </Suspense>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
