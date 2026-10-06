"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { createEvent } from "@/lib/api/eventApi";
import { getPricingItemsByCategory } from "@/lib/api/pricingApi";
import { getVenues } from "@/lib/api/venueApi";

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [venues, setVenues] = useState<any[]>([]);
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
    venueId: "",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [venueList, items] = await Promise.all([
          getVenues().catch(() => []),
          getPricingItemsByCategory("Event Service").catch(() => []),
        ]);
        setVenues(venueList || []);
        if (venueList && venueList.length > 0) {
          setFormData((prev) => ({ ...prev, venueId: venueList[0].id }));
        }
        setPricingItems(items || []);
      } catch (err) {
        console.error("Failed to load event data", err);
      }
    }
    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addPackage = (pricingItemId: string) => {
    if (!pricingItemId) return;
    const pricingItem = pricingItems.find((p) => p.id === pricingItemId);
    if (!pricingItem) return;

    const existingIndex = selectedPackages.findIndex(
      (p) => p.pricingItemId === pricingItemId
    );
    let newPackages = [...selectedPackages];

    if (existingIndex >= 0) {
      newPackages[existingIndex].quantity += 1;
    } else {
      newPackages.push({
        id: pricingItem.id,
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

  const selectedVenue = venues.find((v) => v.id === formData.venueId);
  const venueTotal = selectedVenue?.price || 0;
  const packageTotal = selectedPackages.reduce(
    (acc, p) => acc + (p.price * p.quantity),
    0
  );
  const estimatedServiceCharge = Math.round((venueTotal + packageTotal) * 0.10);
  const estimatedGrandTotal = venueTotal + packageTotal + estimatedServiceCharge;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createEvent({
        ...formData,
        guestCount: Number(formData.guestCount),
        selectedVenue: formData.venueId ? { id: formData.venueId } : null,
        selectedPackages: selectedPackages.map((p) => ({
          id: p.id || p.pricingItemId,
          name: p.name,
          quantity: p.quantity,
          price: p.price,
        })),
      });
      router.push("/events");
    } catch (err: any) {
      setError(err.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "EVENTS"]}>
      <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
        <AppSidebar />
        <main className="page-slide-in px-4 py-6 pt-16 sm:px-8 sm:py-10 lg:pt-10 lg:ml-[280px]">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-[#735c00]">
              Create New Event
            </h1>
          </div>
          <div className="max-w-2xl rounded-2xl border border-[#d0c5af] bg-white p-4 sm:p-8 shadow-sm">
            {error && (
              <div className="mb-4 text-sm font-bold text-red-600">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#4d4635]">
                  Event Name
                </label>
                <input
                  required
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">
                    Event Type
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 text-base"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Party">Party</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">
                    Guest Count
                  </label>
                  <input
                    required
                    type="number"
                    min={1}
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 text-base"
                  />
                </div>
              </div>

              {/* Venue Selection */}
              <div>
                <label className="block text-sm font-bold text-[#4d4635]">
                  Venue
                </label>
                <select
                  name="venueId"
                  value={formData.venueId}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 text-base bg-[#fbf9f5]"
                >
                  <option value="">-- Select a venue --</option>
                  {venues.map((venue) => (
                    <option key={venue.id} value={venue.id}>
                      {venue.name} ({venue.type || "Venue"}) — Rs{" "}
                      {Number(venue.price || 0).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">
                    Date
                  </label>
                  <input
                    required
                    type="date"
                    name="primaryDate"
                    value={formData.primaryDate}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">
                    Start Time
                  </label>
                  <input
                    required
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">
                    Organizer Name
                  </label>
                  <input
                    required
                    type="text"
                    name="organizerName"
                    value={formData.organizerName}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">
                    Phone
                  </label>
                  <input
                    required
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 text-base"
                  />
                </div>
              </div>

              {/* Event Service Packages from Pricing */}
              <div className="rounded-xl border border-[#d0c5af] bg-[#fbf9f5] p-3.5 sm:p-4">
                <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-bold text-[#735c00]">
                  Event Service Packages
                </h3>

                <div className="mb-4 flex flex-col sm:flex-row gap-2">
                  <select
                    id="pkg-select"
                    className="w-full flex-1 rounded-xl border border-[#d0c5af] p-3 text-sm sm:text-sm bg-white"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a package to add...
                    </option>
                    {pricingItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} - Rs {item.price}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const select = document.getElementById(
                        "pkg-select"
                      ) as HTMLSelectElement;
                      addPackage(select.value);
                      select.value = "";
                    }}
                    className="w-full sm:w-auto rounded-xl bg-[#e6cf77] px-6 py-2.5 font-bold text-[#4c3a00]"
                  >
                    Add
                  </button>
                </div>

                {selectedPackages.length === 0 ? (
                  <p className="text-xs sm:text-sm italic text-gray-500">
                    No packages added yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedPackages.map((pkg, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm border border-[#e6dfd2]"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-sm truncate">
                            {pkg.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Rs {pkg.price} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              updatePackageQty(idx, pkg.quantity - 1)
                            }
                            className="h-8 w-8 rounded-full bg-gray-100 font-bold hover:bg-gray-200"
                          >
                            -
                          </button>
                          <span className="w-4 text-center font-bold text-sm">
                            {pkg.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updatePackageQty(idx, pkg.quantity + 1)
                            }
                            className="h-8 w-8 rounded-full bg-gray-100 font-bold hover:bg-gray-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 space-y-1.5 border-t border-[#d0c5af] pt-4 text-sm text-[#4d4635]">
                  <div className="flex justify-between">
                    <span>Venue Total:</span>
                    <span>Rs {venueTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Packages Total:</span>
                    <span>Rs {packageTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Charge (10%):</span>
                    <span>Rs {estimatedServiceCharge.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#d0c5af]/50 pt-2 text-base font-bold text-[#181818]">
                    <span>Estimated Grand Total:</span>
                    <span className="text-[#735c00]">
                      Rs {estimatedGrandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto rounded-xl bg-[#735c00] px-8 py-3.5 font-bold text-white transition hover:bg-[#d4af37] text-center"
                >
                  {loading ? "Saving..." : "Save Event"}
                </button>
                <Link
                  href="/events"
                  className="w-full sm:w-auto rounded-xl border border-[#d0c5af] px-8 py-3.5 font-bold text-[#4d4635] transition hover:bg-[#f5f3ef] text-center"
                >
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
