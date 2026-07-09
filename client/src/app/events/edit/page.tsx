"use client";
import { useSearchParams } from "next/navigation";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getEventById, updateEvent } from "@/lib/api/eventApi";
import { getPricingItemsByCategory } from "@/lib/api/pricingApi";

export default function EditEventPage() {
  const searchParams = useSearchParams();
  const rawId = searchParams.get("id");

  const router = useRouter();
  const params = useParams();
  const id = rawId as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [pricingItems, setPricingItems] = useState<any[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "Wedding",
    guestCount: 0,
    primaryDate: "",
    startTime: "",
    organizerName: "",
    phone: "",
    status: "Active",
    venueId: "V-001",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [data, items] = await Promise.all([
          getEventById(id),
          getPricingItemsByCategory("Event Service"),
        ]);
        setPricingItems(items || []);
        setFormData({
          eventName: data.eventName || "",
          eventType: data.eventType || "Wedding",
          guestCount: data.guestCount || 0,
          primaryDate: data.primaryDate || "",
          startTime: data.startTime || "",
          organizerName: data.organizerName || "",
          phone: data.phone || "",
          status: data.status || "Active",
          venueId: data.venueId || "V-001",
        });
        // Restore existing packages
        if (data.selectedPackages && Array.isArray(data.selectedPackages)) {
          setSelectedPackages(data.selectedPackages.map((p: any) => ({
            pricingItemId: p.pricingItemId || p.id || "",
            name: p.name || "",
            quantity: p.quantity || 1,
            price: p.price || 0,
          })));
        }
      } catch (err: any) {
        setError("Failed to load event.");
      } finally {
        setFetching(false);
      }
    }
    loadData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addPackage = (pricingItemId: string) => {
    if (!pricingItemId) return;
    const pricingItem = pricingItems.find(p => p.id === pricingItemId);
    if (!pricingItem) return;

    const existingIndex = selectedPackages.findIndex(p => p.pricingItemId === pricingItemId);
    let newPackages = [...selectedPackages];

    if (existingIndex >= 0) {
      newPackages[existingIndex].quantity += 1;
    } else {
      newPackages.push({
        pricingItemId: pricingItem.id,
        name: pricingItem.name,
        quantity: 1,
        price: pricingItem.price,
      });
    }

    setSelectedPackages(newPackages);
  };

  const updatePackageQty = (index: number, quantity: number) => {
    let newPackages = [...selectedPackages];
    if (quantity <= 0) {
      newPackages.splice(index, 1);
    } else {
      newPackages[index].quantity = quantity;
    }
    setSelectedPackages(newPackages);
  };

  const packageTotal = selectedPackages.reduce((acc, p) => acc + (p.price * p.quantity), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await updateEvent(id, {
        ...formData,
        guestCount: Number(formData.guestCount),
        selectedPackages: selectedPackages,
        packageTotal: packageTotal,
        grandTotal: packageTotal,
      });
      router.push("/events/list");
    } catch (err: any) {
      setError(err.message || "Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "EVENTS"]}>
      <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
        <AppSidebar />
        <main className="page-slide-in px-8 py-10 lg:ml-[280px]">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#735c00]">Edit Event</h1>
          </div>
          <div className="max-w-2xl rounded-2xl border border-[#d0c5af] bg-white p-8 shadow-sm">
            {error && <div className="mb-4 text-red-600">{error}</div>}
            
            {fetching ? (
              <p>Loading event details...</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Event Name</label>
                  <input required type="text" name="eventName" value={formData.eventName} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#4d4635]">Event Type</label>
                    <select name="eventType" value={formData.eventType} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3">
                      <option value="Wedding">Wedding</option>
                      <option value="Party">Party</option>
                      <option value="Corporate">Corporate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#4d4635]">Guest Count</label>
                    <input required type="number" name="guestCount" value={formData.guestCount} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#4d4635]">Date</label>
                    <input required type="date" name="primaryDate" value={formData.primaryDate} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#4d4635]">Start Time</label>
                    <input required type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#4d4635]">Organizer Name</label>
                    <input required type="text" name="organizerName" value={formData.organizerName} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#4d4635]">Phone</label>
                    <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3">
                    <option value="Active">Active</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Event Service Packages from Pricing */}
                <div className="rounded-xl border border-[#d0c5af] bg-[#fbf9f5] p-4">
                  <h3 className="mb-4 text-lg font-bold text-[#735c00]">Event Service Packages</h3>

                  <div className="mb-4 flex gap-2">
                    <select
                      id="pkg-select"
                      className="flex-1 rounded-xl border border-[#d0c5af] p-3 text-sm"
                      defaultValue=""
                    >
                      <option value="" disabled>Select a package to add...</option>
                      {pricingItems.map(item => (
                        <option key={item.id} value={item.id}>{item.name} - Rs {item.price}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const select = document.getElementById('pkg-select') as HTMLSelectElement;
                        addPackage(select.value);
                        select.value = "";
                      }}
                      className="rounded-xl bg-[#e6cf77] px-4 py-2 font-bold text-[#4c3a00]"
                    >
                      Add
                    </button>
                  </div>

                  {selectedPackages.length === 0 ? (
                    <p className="text-sm italic text-gray-500">No packages added yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedPackages.map((pkg, idx) => (
                        <div key={idx} className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm border border-[#e6dfd2]">
                          <div>
                            <p className="font-bold">{pkg.name}</p>
                            <p className="text-xs text-gray-500">Rs {pkg.price} each</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button type="button" onClick={() => updatePackageQty(idx, pkg.quantity - 1)} className="h-8 w-8 rounded-full bg-gray-100 font-bold hover:bg-gray-200">-</button>
                            <span className="w-4 text-center font-bold">{pkg.quantity}</span>
                            <button type="button" onClick={() => updatePackageQty(idx, pkg.quantity + 1)} className="h-8 w-8 rounded-full bg-gray-100 font-bold hover:bg-gray-200">+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex justify-between border-t border-[#d0c5af] pt-4 text-lg font-bold">
                    <span>Grand Total:</span>
                    <span className="text-[#735c00]">Rs {packageTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" disabled={loading} className="rounded-xl bg-[#735c00] px-8 py-3 font-bold text-white transition hover:bg-[#d4af37]">
                    {loading ? "Updating..." : "Update Event"}
                  </button>
                  <Link href="/events/list" className="rounded-xl border border-[#d0c5af] px-8 py-3 font-bold text-[#4d4635] transition hover:bg-[#f5f3ef]">
                    Cancel
                  </Link>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
