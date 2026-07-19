"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ArrowLeft, PackageCheck, Save } from "lucide-react";
import {
  getInventoryItemById,
  updateInventoryItem,
} from "@/lib/api/inventoryApi";

export default function EditInventoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = searchParams.get("id");

  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    itemName: "",
    category: "Kitchen",
    quantity: 0,
    unit: "pcs",
    reorderLevel: 10,
    supplierName: "",
    purchasePrice: 0,
    status: "In Stock",
  });

  useEffect(() => {
    async function loadItem() {
      if (!itemId) {
        setError("Inventory item ID is missing.");
        setPageLoading(false);
        return;
      }

      try {
        const item = await getInventoryItemById(itemId);

        setFormData({
          itemName: item.itemName || "",
          category: item.category || "Kitchen",
          quantity: Number(item.quantity || 0),
          unit: item.unit || "pcs",
          reorderLevel: Number(item.reorderLevel || 10),
          supplierName: item.supplierName || "",
          purchasePrice: Number(item.purchasePrice || 0),
          status: item.status || "In Stock",
        });
      } catch (err: any) {
        setError(err.message || "Failed to load inventory item.");
      } finally {
        setPageLoading(false);
      }
    }

    loadItem();
  }, [itemId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (["quantity", "reorderLevel", "purchasePrice"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!itemId) {
      setError("Inventory item ID is missing.");
      return;
    }

    if (!formData.itemName || !formData.supplierName || !formData.unit) {
      setError("Item name, unit and supplier name are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateInventoryItem(itemId, {
        itemName: formData.itemName,
        category: formData.category,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        reorderLevel: Number(formData.reorderLevel),
        supplierName: formData.supplierName,
        purchasePrice: Number(formData.purchasePrice),
        status: formData.status,
      });

      alert("Inventory item updated successfully.");
      router.push("/inventory");
    } catch (err: any) {
      setError(err.message || "Failed to update inventory item.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "INVENTORY"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="min-h-screen px-8 py-10 lg:ml-[280px]">
          <section className="mx-auto max-w-4xl">
            <Link
              href="/inventory"
              className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#735c00] hover:underline"
            >
              <ArrowLeft size={18} />
              Back to Inventory
            </Link>

            <div className="rounded-3xl border border-[#d0c5af] bg-white p-8 shadow-sm">
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#735c00]/10 text-[#735c00]">
                  <PackageCheck size={28} />
                </div>

                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#735c00]">
                    Inventory Module
                  </p>
                  <h1 className="mt-2 text-3xl font-bold">Edit Inventory Item</h1>
                  <p className="mt-1 text-sm text-[#4d4635]">
                    Update stock details, reorder level, supplier and status.
                  </p>
                </div>
              </div>

              {pageLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#d4af37] border-t-transparent" />
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-[#4d4635]">
                        Item Name
                      </label>
                      <input
                        required
                        type="text"
                        name="itemName"
                        value={formData.itemName}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-bold text-[#4d4635]">
                          Category
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                        >
                          <option value="Kitchen">Kitchen</option>
                          <option value="Housekeeping">Housekeeping</option>
                          <option value="Restaurant">Restaurant</option>
                          <option value="Amenities">Amenities</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-[#4d4635]">
                          Unit Type
                        </label>
                        <input
                          required
                          type="text"
                          name="unit"
                          value={formData.unit}
                          onChange={handleChange}
                          className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <label className="block text-sm font-bold text-[#4d4635]">
                          Quantity
                        </label>
                        <input
                          required
                          type="number"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-[#4d4635]">
                          Reorder Level
                        </label>
                        <input
                          required
                          type="number"
                          name="reorderLevel"
                          value={formData.reorderLevel}
                          onChange={handleChange}
                          className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-[#4d4635]">
                          Purchase Price
                        </label>
                        <input
                          required
                          type="number"
                          name="purchasePrice"
                          value={formData.purchasePrice}
                          onChange={handleChange}
                          className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-bold text-[#4d4635]">
                          Supplier Name
                        </label>
                        <input
                          required
                          type="text"
                          name="supplierName"
                          value={formData.supplierName}
                          onChange={handleChange}
                          className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-[#4d4635]">
                          Status
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                        >
                          <option value="In Stock">In Stock</option>
                          <option value="Low Stock">Low Stock</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Link
                        href="/inventory"
                        className="flex-1 rounded-xl border border-[#d0c5af] px-8 py-4 text-center font-bold text-[#4d4635] transition hover:bg-[#ece9e2]"
                      >
                        Cancel
                      </Link>

                      <button
                        type="submit"
                        disabled={saving}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#735c00] px-8 py-4 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00] disabled:opacity-60"
                      >
                        <Save size={18} />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}