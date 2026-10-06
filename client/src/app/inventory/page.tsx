"use client";
import { AuthUser, getUser } from "@/utils/auth";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SlidePanel from "@/components/ui/SlidePanel";
import useSWR from "swr";
import {
  getInventoryItems,
  deleteInventoryItem as apiDeleteInventory,
  createInventoryItem,
  updateInventoryItem,
  recordPurchaseStock,
} from "@/lib/api/inventoryApi";
import { getStatusBadgeClass } from "@/lib/utils/statusStyles";
import { Package, ShoppingCart, DollarSign } from "lucide-react";

function getStockPercent(stock: number, minimum: number) {
  const percent = Math.min((stock / (minimum * 3 || 1)) * 100, 100);
  return `${percent}%`;
}

export default function InventoryPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    setUser(getUser());
  }, []);

  const { data: rawInventory, mutate, isLoading: isSwrLoading } = useSWR<any[]>("/api/inventory");
  const inventoryItems = useMemo(() => (Array.isArray(rawInventory) ? rawInventory : []), [rawInventory]);
  const [currentRole, setCurrentRole] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const categories = useMemo(() => {
    const cats = new Set(inventoryItems.map((i: any) => i.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [inventoryItems]);

  const filteredItems = useMemo(() => {
    return inventoryItems.filter((item: any) => {
      const matchesSearch =
        !searchQuery ||
        item.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplierName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "All" ||
        item.status?.toLowerCase().replace(/_/g, " ") === selectedStatus.toLowerCase().replace(/_/g, " ") ||
        item.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [inventoryItems, searchQuery, selectedCategory, selectedStatus]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Restock & Stock Purchase Panel State
  const [purchasePanelOpen, setPurchasePanelOpen] = useState(false);
  const [purchaseItem, setPurchaseItem] = useState<any>(null);
  const [purchaseSubmitting, setPurchaseSubmitting] = useState(false);
  const [purchaseError, setPurchaseError] = useState("");
  const [purchaseFormData, setPurchaseFormData] = useState({
    quantity: 10,
    unitPrice: 0,
    supplierName: "",
    supplierInvoiceNumber: "",
    paymentMethod: "BANK_TRANSFER",
    paymentStatus: "PAID",
    notes: "",
  });

  const handleOpenPurchase = (item: any) => {
    setPurchaseItem(item);
    setPurchaseError("");
    setPurchaseFormData({
      quantity: Math.max(1, (item.reorderLevel || 10) * 2 - (item.quantity || 0)),
      unitPrice: Number(item.purchasePrice || 0),
      supplierName: item.supplierName || "",
      supplierInvoiceNumber: "",
      paymentMethod: "BANK_TRANSFER",
      paymentStatus: "PAID",
      notes: "",
    });
    setPurchasePanelOpen(true);
  };

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchaseItem) return;
    setPurchaseSubmitting(true);
    setPurchaseError("");
    try {
      await recordPurchaseStock(purchaseItem.id, purchaseFormData);
      setPurchasePanelOpen(false);
      setPurchaseItem(null);
      await mutate();
    } catch (err: any) {
      setPurchaseError(err.message || "Failed to record stock purchase.");
    } finally {
      setPurchaseSubmitting(false);
    }
  };

  const defaultFormData = {
    itemName: "",
    category: "Kitchen",
    quantity: 0,
    unit: "kg",
    reorderLevel: 10,
    supplierName: "",
    purchasePrice: 0,
    status: "In Stock",
  };

  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    if (user?.role) {
      setCurrentRole(user.role);
      return;
    }

    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setCurrentRole(parsedUser.role || "");
      }
    } catch {
      setCurrentRole("");
    }
  }, [user]);

  const deleteInventoryItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inventory item?")) return;

    try {
      await apiDeleteInventory(id);
      mutate();
      alert("Inventory item deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete inventory item.");
    }
  };

  const handleOpenAdd = () => {
    setEditItem(null);
    setError("");
    setFormData(defaultFormData);
    setPanelOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditItem(item);
    setError("");
    setFormData({
      itemName: item.itemName || "",
      category: item.category || "Kitchen",
      quantity: Number(item.quantity || 0),
      unit: item.unit || "kg",
      reorderLevel: Number(item.reorderLevel || 10),
      supplierName: item.supplierName || "",
      purchasePrice: Number(item.purchasePrice || 0),
      status: item.status || "In Stock",
    });
    setPanelOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        quantity: Number(formData.quantity),
        reorderLevel: Number(formData.reorderLevel),
        purchasePrice: Number(formData.purchasePrice),
      };

      if (editItem) {
        await updateInventoryItem(editItem.id, payload);
      } else {
        await createInventoryItem(payload);
      }

      setPanelOpen(false);
      setEditItem(null);
      mutate();
    } catch (err: any) {
      setError(err.message || "Failed to save inventory item");
    } finally {
      setLoading(false);
    }
  };

  const canEdit =
    currentRole === "OWNER" ||
    currentRole === "MANAGER" ||
    currentRole === "INVENTORY";

  const canDelete = currentRole === "OWNER" || currentRole === "MANAGER";

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "INVENTORY"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Inventory Module
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Inventory Management
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Manage hotel stock, kitchen supplies, room amenities,
                housekeeping items, and purchase requests.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/inventory/purchase"
                className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
              >
                + Purchase Request
              </Link>

              <button
                onClick={handleOpenAdd}
                className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
              >
                + Add Item
              </button>
            </div>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard
              label="Total Items"
              value={inventoryItems.length.toString()}
            />
            <StatCard
              label="In Stock"
              value={inventoryItems
                .filter((i) => i.quantity > i.reorderLevel)
                .length.toString()}
            />
            <StatCard
              label="Low Stock"
              value={inventoryItems
                .filter((i) => i.quantity > 0 && i.quantity <= i.reorderLevel)
                .length.toString()}
            />
            <StatCard
              label="Critical"
              value={inventoryItems
                .filter((i) => i.quantity === 0)
                .length.toString()}
            />
          </section>

          <section className="mb-8 rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-4">
              <input
                type="text"
                placeholder="Search by name, supplier, ID..."
                value={searchQuery ?? ""}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? "All Categories" : cat}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              >
                <option value="All">All Status</option>
                <option value="IN_STOCK">In Stock</option>
                <option value="LOW_STOCK">Low Stock</option>
                <option value="OUT_OF_STOCK">Out of Stock / Critical</option>
              </select>

              {(searchQuery || selectedCategory !== "All" || selectedStatus !== "All") ? (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setSelectedStatus("All");
                  }}
                  className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00]/10"
                >
                  Clear Filters
                </button>
              ) : (
                <div className="flex items-center justify-center text-sm font-medium text-[#735c00]">
                  Showing {filteredItems.length} of {inventoryItems.length} items
                </div>
              )}
            </div>
          </section>

          <section className="w-full">
            <div className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-2 border-b border-[#d0c5af] p-6 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-bold">Inventory Stock List</h2>
                  <p className="mt-1 text-sm text-[#4d4635]">
                    Track stock quantity, reorder level, supplier, and item status.
                  </p>
                </div>
                <span className="text-sm font-bold text-[#735c00]">
                  {filteredItems.length} item{filteredItems.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-full text-left">
                  <thead>
                    <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                      <th className="px-6 py-4">Item ID</th>
                      <th className="px-6 py-4">Item</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4">Minimum</th>
                      <th className="px-6 py-4">Supplier</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#d0c5af]">
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-6 py-10 text-center text-[#4d4635]"
                        >
                          <p className="text-lg font-bold">
                            No inventory items found
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredItems.map((item: any) => (
                        <tr
                          key={item.id}
                          className="transition hover:bg-[#fbf9f5]"
                        >
                          <td className="px-6 py-5 font-bold">
                            {item.id?.substring(0, 8) || "NEW"}
                          </td>

                          <td className="px-6 py-5">
                            <p className="font-bold">{item.itemName}</p>

                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#f5f3ef]">
                              <div
                                className="h-full rounded-full bg-[#735c00]"
                                style={{
                                  width: getStockPercent(
                                    item.quantity,
                                    item.reorderLevel
                                  ),
                                }}
                              />
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#735c00]">
                              {item.category}
                            </span>
                          </td>

                          <td className="px-6 py-5 font-bold">
                            {item.quantity} {item.unit}
                          </td>

                          <td className="px-6 py-5 text-[#4d4635]">
                            {item.reorderLevel} {item.unit}
                          </td>

                          <td className="px-6 py-5 text-[#4d4635]">
                            {item.supplierName}
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusBadgeClass(
                                item.status
                              )}`}
                            >
                              {item.status}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex justify-end gap-3">
                              <button
                                type="button"
                                onClick={() => handleOpenPurchase(item)}
                                className="flex items-center gap-1 rounded-lg border border-[#735c00] px-3.5 py-1.5 text-xs font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white shadow-sm"
                              >
                                <ShoppingCart size={13} />
                                Purchase
                              </button>

                              {canEdit && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(item)}
                                  className="rounded-lg border border-[#735c00] px-4 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
                                >
                                  Edit
                                </button>
                              )}

                              {canDelete && (
                                <button
                                  onClick={() => deleteInventoryItem(item.id)}
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
            </div>
          </section>
        </main>

        <SlidePanel
          open={panelOpen}
          onClose={() => setPanelOpen(false)}
          title={editItem ? "Edit Inventory Item" : "Add Inventory Item"}
          subtitle={
            editItem
              ? `Updating stock & supplier for ${editItem.itemName}`
              : "Register a new stock item or hotel supply"
          }
          icon={<Package className="h-5 w-5 text-[#735c00]" />}
        >
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 font-bold text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                Item Name *
              </label>
              <input
                required
                type="text"
                name="itemName"
                placeholder="e.g. Basmati Rice 5kg / Earl Grey Tea"
                value={formData.itemName}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-medium focus:outline-none focus:ring-2 focus:ring-[#735c00]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-semibold focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                >
                  <option value="Kitchen">Kitchen Supplies</option>
                  <option value="Bar">Bar & Beverage</option>
                  <option value="Housekeeping">Housekeeping & Linen</option>
                  <option value="Toiletries">Guest Toiletries</option>
                  <option value="Maintenance">Maintenance & Tools</option>
                  <option value="Office">Office & Stationery</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                  Unit of Measure *
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-semibold focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                >
                  <option value="kg">kg (Kilograms)</option>
                  <option value="g">g (Grams)</option>
                  <option value="liters">Liters</option>
                  <option value="ml">ml (Milliliters)</option>
                  <option value="pcs">Pieces (pcs)</option>
                  <option value="boxes">Boxes</option>
                  <option value="bottles">Bottles</option>
                  <option value="packs">Packs</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                  Current Quantity *
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  step="any"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-bold focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                  Reorder Level (Min) *
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  name="reorderLevel"
                  value={formData.reorderLevel}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-bold focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                  Supplier Name
                </label>
                <input
                  type="text"
                  name="supplierName"
                  placeholder="e.g. Ceylon Agro Ltd"
                  value={formData.supplierName}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                  Purchase Price (Rs)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-bold focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-semibold focus:outline-none focus:ring-2 focus:ring-[#735c00]"
              >
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Critical">Critical</option>
              </select>
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
                disabled={loading}
                className="flex-1 rounded-xl bg-[#735c00] px-8 py-3.5 font-bold text-white transition hover:bg-[#d4af37] disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : editItem
                  ? "Update Item"
                  : "Add Item"}
              </button>
            </div>
          </form>
        </SlidePanel>

        {/* Restock & Stock Purchase SlidePanel */}
        <SlidePanel
          open={purchasePanelOpen}
          onClose={() => setPurchasePanelOpen(false)}
          title="Restock & Stock Purchase"
          subtitle={
            purchaseItem
              ? `Recording financial expense & stock increment for ${purchaseItem.itemName}`
              : "Record inventory stock purchase"
          }
          icon={<ShoppingCart className="h-5 w-5 text-[#735c00]" />}
        >
          {purchaseError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 font-bold text-red-700">
              {purchaseError}
            </div>
          )}

          {purchaseItem && (
            <form onSubmit={handlePurchaseSubmit} className="space-y-4">
              {/* Item Info Summary */}
              <div className="rounded-xl border border-[#d0c5af] bg-[#faf8f4] p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-[#735c00] text-base">{purchaseItem.itemName}</h3>
                  <p className="text-xs text-[#565e74]">
                    Category: {purchaseItem.category} • Current Stock: {purchaseItem.quantity} {purchaseItem.unit}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-gray-500">Reorder Level</span>
                  <p className="text-xs font-bold text-amber-800">{purchaseItem.reorderLevel} {purchaseItem.unit}</p>
                </div>
              </div>

              {/* Purchase Quantities & Cost */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                    Purchase Quantity ({purchaseItem.unit}) *
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    step="1"
                    value={purchaseFormData.quantity}
                    onChange={(e) =>
                      setPurchaseFormData((prev) => ({
                        ...prev,
                        quantity: Number(e.target.value) || 0,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                    Cost per Unit (Rs) *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={purchaseFormData.unitPrice}
                    onChange={(e) =>
                      setPurchaseFormData((prev) => ({
                        ...prev,
                        unitPrice: Number(e.target.value) || 0,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                  />
                </div>
              </div>

              {/* Total Financial Outflow Banner */}
              <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">Total Financial Expense</span>
                  <p className="text-xs text-amber-700">Will be recorded in Inventory Outflows & P&L</p>
                </div>
                <p className="text-2xl font-extrabold text-[#735c00] font-mono">
                  Rs {(purchaseFormData.quantity * purchaseFormData.unitPrice).toLocaleString()}
                </p>
              </div>

              {/* Supplier & Invoice */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                    Supplier Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ceylon Fishery Harbor"
                    value={purchaseFormData.supplierName}
                    onChange={(e) =>
                      setPurchaseFormData((prev) => ({
                        ...prev,
                        supplierName: e.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                    Supplier Invoice No
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. INV-98431"
                    value={purchaseFormData.supplierInvoiceNumber}
                    onChange={(e) =>
                      setPurchaseFormData((prev) => ({
                        ...prev,
                        supplierInvoiceNumber: e.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                  />
                </div>
              </div>

              {/* Payment Method & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                    Expense Payment Method
                  </label>
                  <select
                    value={purchaseFormData.paymentMethod}
                    onChange={(e) =>
                      setPurchaseFormData((prev) => ({
                        ...prev,
                        paymentMethod: e.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                  >
                    <option value="BANK_TRANSFER">Bank Transfer (CEFT)</option>
                    <option value="PETTY_CASH">Petty Cash</option>
                    <option value="CHEQUE">Company Cheque</option>
                    <option value="COMPANY_CARD">Company Credit Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                    Payment Status
                  </label>
                  <select
                    value={purchaseFormData.paymentStatus}
                    onChange={(e) =>
                      setPurchaseFormData((prev) => ({
                        ...prev,
                        paymentStatus: e.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                  >
                    <option value="PAID">PAID (Settled Immediately)</option>
                    <option value="CREDIT_INVOICE">CREDIT INVOICE (Pay Later)</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                  Purchase / Delivery Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes on batch, quality, expiry or delivery date..."
                  value={purchaseFormData.notes}
                  onChange={(e) =>
                    setPurchaseFormData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-[#d0c5af]">
                <button
                  type="button"
                  onClick={() => setPurchasePanelOpen(false)}
                  className="flex-1 rounded-xl border border-[#d0c5af] py-3 text-sm font-bold text-[#4d4635] hover:bg-[#ece9e2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={purchaseSubmitting}
                  className="flex-1 rounded-xl bg-[#735c00] py-3 text-sm font-bold text-white shadow-md hover:bg-[#d4af37] hover:text-[#241a00] disabled:opacity-50"
                >
                  {purchaseSubmitting ? "Recording..." : `Confirm Restock & Expense`}
                </button>
              </div>
            </form>
          )}
        </SlidePanel>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-widest text-[#4d4635]">
        {label}
      </p>

      <p className="mt-2 text-4xl font-extrabold text-[#735c00]">{value}</p>
    </div>
  );
}

function AlertCard({
  title,
  text,
  type,
}: {
  title: string;
  text: string;
  type: "critical" | "warning" | "success";
}) {
  const styles = {
    critical: "border-red-200 bg-red-50 text-red-700",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-700",
    success: "border-green-200 bg-green-50 text-green-700",
  };

  return (
    <div className={`rounded-xl border p-4 ${styles[type]}`}>
      <p className="font-bold">{title}</p>
      <p className="mt-1 text-sm">{text}</p>
    </div>
  );
}