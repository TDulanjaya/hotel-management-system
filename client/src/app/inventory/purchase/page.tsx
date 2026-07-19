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
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    itemId: defaultItemId,
    quantity: "",
    purchasePrice: "",
    supplierName: "",
    note: "Stock purchase",
  });

  useEffect(() => {
    async function fetchItems() {
      try {
        const data = await getInventoryItems();
        setItems(data);

        if (defaultItemId) {
          const selectedItem = data.find((item: any) => item.id === defaultItemId);

          setFormData((prev) => ({
            ...prev,
            itemId: defaultItemId,
            supplierName: selectedItem?.supplierName || prev.supplierName,
            purchasePrice: selectedItem?.purchasePrice
              ? String(selectedItem.purchasePrice)
              : prev.purchasePrice,
          }));

          return;
        }

        if (data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            itemId: data[0].id,
            supplierName: data[0].supplierName || "",
            purchasePrice: data[0].purchasePrice
              ? String(data[0].purchasePrice)
              : "",
          }));
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load inventory items.");
      } finally {
        setPageLoading(false);
      }
    }

    fetchItems();
  }, [defaultItemId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "itemId") {
      const selectedItem = items.find((item) => item.id === value);

      setFormData((prev) => ({
        ...prev,
        itemId: value,
        supplierName: selectedItem?.supplierName || "",
        purchasePrice: selectedItem?.purchasePrice
          ? String(selectedItem.purchasePrice)
          : "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.itemId) {
      setError("Please select an item.");
      return;
    }

    if (Number(formData.quantity) <= 0) {
      setError("Purchase quantity must be greater than 0.");
      return;
    }

    if (Number(formData.purchasePrice) < 0) {
      setError("Purchase price cannot be negative.");
      return;
    }

    if (!formData.supplierName.trim()) {
      setError("Supplier name is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await purchaseStock({
        itemId: formData.itemId,
        quantity: Number(formData.quantity),
        purchasePrice: Number(formData.purchasePrice),
        supplierName: formData.supplierName,
        note: formData.note,
      });

      alert("Stock purchased successfully.");
      router.push("/inventory");
    } catch (err: any) {
      setError(err.message || "Failed to purchase stock.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#d4af37] border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-[#4d4635]">
            Select Item
          </label>

          <select
            name="itemId"
            value={formData.itemId}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
          >
            <option value="" disabled>
              Select an inventory item
            </option>

            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.itemName}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#4d4635]">
              Add Quantity
            </label>

            <input
              required
              min="1"
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="e.g. 10"
              className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#4d4635]">
              Purchase Price
            </label>

            <input
              required
              min="0"
              type="number"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
              placeholder="e.g. 250"
              className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
            />
          </div>
        </div>

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
            className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#4d4635]">
            Note
          </label>

          <input
            type="text"
            name="note"
            value={formData.note}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[#735c00] px-8 py-3 font-bold text-white transition hover:bg-[#d4af37] disabled:opacity-60"
          >
            {loading ? "Purchasing..." : "Complete Purchase"}
          </button>

          <Link
            href="/inventory"
            className="rounded-xl border border-[#d0c5af] px-8 py-3 font-bold text-[#4d4635] transition hover:bg-[#f5f3ef]"
          >
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
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
              Inventory Module
            </p>

            <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
              Purchase Request
            </h1>

            <p className="mt-2 text-[#4d4635]">
              Add purchased stock quantity to an existing inventory item.
            </p>
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