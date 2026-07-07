"use client";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SlidePanel from "@/components/ui/SlidePanel";
import { Package } from "lucide-react";

import { getInventoryItems, deleteInventoryItem as apiDeleteInventory, createInventoryItem } from "@/lib/api/inventoryApi";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import { getStatusBadgeClass } from "@/lib/utils/statusStyles";

const purchaseRequests = [
  {
    id: "PR-001",
    item: "Basmati Rice",
    requestedBy: "COOK",
    quantity: "100 kg",
    status: "Pending Approval",
  },
];

function getStockPercent(stock: number, minimum: number) {
  const percent = Math.min((stock / (minimum * 3)) * 100, 100);
  return `${percent}%`;
}

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const { user } = useAuthContext();
  const [panelOpen, setPanelOpen] = useState(false);

  // Form states
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

  const loadInventory = async () => {
    try {
      const data = await getInventoryItems();
      setInventoryItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const deleteInventoryItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inventory item?")) return;
    try {
      await apiDeleteInventory(id);
      setInventoryItems(prev => prev.filter(item => item.id !== id));
      alert("Inventory item deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete inventory item.");
    }
  };

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
      setPanelOpen(false);
      loadInventory();
      // Reset form
      setFormData({
        itemName: "", category: "Kitchen", quantity: 0, unit: "pcs", reorderLevel: 10,
        supplierName: "", purchasePrice: 0, status: "In Stock"
      });
    } catch (err: any) {
      setError(err.message || "Failed to add inventory item");
    } finally {
      setLoading(false);
    }
  };

  const canEdit = user?.role === "OWNER" || user?.role === "MANAGER" || user?.role === "INVENTORY";
  const canDelete = user?.role === "OWNER" || user?.role === "MANAGER";

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
              <Link href="/inventory/purchase" className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white">
                + Purchase Request
              </Link>

              <button 
                onClick={() => setPanelOpen(true)}
                className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
              >
                + Add Item
              </button>
            </div>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard label="Total Items" value="5" />
            <StatCard label="In Stock" value="3" />
            <StatCard label="Low Stock" value="1" />
            <StatCard label="Critical" value="1" />
          </section>

          <section className="mb-8 rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-4">
              <input
                type="text"
                placeholder="Search item..."
                className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              />

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>All Categories</option>
                <option>Kitchen</option>
                <option>Housekeeping</option>
                <option>Restaurant</option>
                <option>Amenities</option>
              </select>

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>All Status</option>
                <option>In Stock</option>
                <option>Low Stock</option>
                <option>Critical</option>
              </select>

              <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                Filter
              </button>
            </div>
          </section>

          <section className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
              <div className="border-b border-[#d0c5af] p-6">
                <h2 className="text-2xl font-bold">Inventory Stock List</h2>

                <p className="mt-1 text-sm text-[#4d4635]">
                  Track stock quantity, reorder level, supplier, and item
                  status.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-left">
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
                    {inventoryItems.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-10 text-center text-[#4d4635]">
                          <p className="text-lg font-bold">No inventory items found</p>
                        </td>
                      </tr>
                    ) : (
                      inventoryItems.map((item) => (
                        <tr key={item.id} className="transition hover:bg-[#fbf9f5]">
                          <td className="px-6 py-5 font-bold">{item.id?.substring(0,8) || "NEW"}</td>
  
                          <td className="px-6 py-5">
                            <p className="font-bold">{item.itemName}</p>
  
                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#f5f3ef]">
                              <div
                                className="h-full rounded-full bg-[#735c00]"
                                style={{
                                  width: getStockPercent(item.quantity, item.reorderLevel),
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
                              <Link href={`/inventory/purchase?itemId=${item.id}`} className="rounded-lg border border-[#735c00] px-4 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white">
                                Purchase
                              </Link>

                              {canEdit && (
                                <Link
                                  href={`/inventory/edit?id=${item.id}`}
                                  className="rounded-lg border border-[#735c00] px-4 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
                                >
                                  Edit
                                </Link>
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

            <aside className="space-y-8">
              <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">Purchase Requests</h2>

                <div className="mt-6 space-y-4">
                  {purchaseRequests.map((request) => (
                    <div
                      key={request.id}
                      className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-[#735c00]">
                            {request.item}
                          </p>

                          <p className="mt-1 text-sm text-[#4d4635]">
                            {request.id} • {request.requestedBy}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusBadgeClass(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </div>

                      <p className="mt-3 text-sm font-bold">
                        Quantity: {request.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">Inventory Alerts</h2>

                <div className="mt-6 space-y-4">
                  <AlertCard
                    title="Critical Stock"
                    text="Room Shampoo Set is below minimum stock level."
                    type="critical"
                  />

                  <AlertCard
                    title="Low Stock"
                    text="Basmati Rice needs reorder approval."
                    type="warning"
                  />

                  <AlertCard
                    title="Good Stock"
                    text="Towels, water bottles, and cleaning items are stable."
                    type="success"
                  />
                </div>
              </section>
            </aside>
          </section>
        </main>

        <SlidePanel 
          open={panelOpen} 
          onClose={() => setPanelOpen(false)} 
          title="Add New Inventory Item" 
          subtitle="Add stock, supplies, or amenities to your inventory."
          icon={<Package className="h-5 w-5" />}
        >
          {error && <div className="mb-4 text-red-600 font-bold">{error}</div>}
          
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
              <button type="button" onClick={() => setPanelOpen(false)} className="flex-1 rounded-xl border border-[#d0c5af] px-8 py-4 font-bold text-[#4d4635] transition hover:bg-[#ece9e2]">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="flex-1 rounded-xl bg-[#735c00] px-8 py-4 font-bold text-white transition hover:bg-[#d4af37]">
                {loading ? "Saving..." : "Save Item"}
              </button>
            </div>
          </form>
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
