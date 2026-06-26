"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { createInventoryItem } from "@/lib/api/inventoryApi";

export default function NewInventoryItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    itemName: "",
    category: "Kitchen",
    quantity: 0,
    unit: "pcs",
    reorderLevel: 10,
    supplierName: "",
    purchasePrice: 0,
    status: "In Stock"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createInventoryItem({
        ...formData,
        quantity: Number(formData.quantity),
        reorderLevel: Number(formData.reorderLevel),
        purchasePrice: Number(formData.purchasePrice),
      });
      router.push("/inventory");
    } catch (err: any) {
      setError(err.message || "Failed to add inventory item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "INVENTORY"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />
        <main className="page-slide-in px-8 py-10 lg:ml-[280px]">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#735c00]">Add New Item</h1>
          </div>
          
          <div className="max-w-2xl rounded-2xl border border-[#d0c5af] bg-white p-8 shadow-sm">
            {error && <div className="mb-4 text-red-600">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#4d4635]">Item Name</label>
                <input required type="text" name="itemName" value={formData.itemName} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3">
                    <option value="Kitchen">Kitchen</option>
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Amenities">Amenities</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Unit Type</label>
                  <input required type="text" name="unit" placeholder="e.g. pcs, kg, liters" value={formData.unit} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Initial Quantity</label>
                  <input required type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Reorder Level</label>
                  <input required type="number" name="reorderLevel" value={formData.reorderLevel} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Purchase Price (Initial)</label>
                  <input required type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Supplier Name</label>
                  <input required type="text" name="supplierName" value={formData.supplierName} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4d4635]">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3">
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" disabled={loading} className="rounded-xl bg-[#735c00] px-8 py-3 font-bold text-white transition hover:bg-[#d4af37]">
                  {loading ? "Saving..." : "Save Item"}
                </button>
                <Link href="/inventory" className="rounded-xl border border-[#d0c5af] px-8 py-3 font-bold text-[#4d4635] transition hover:bg-[#f5f3ef]">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}