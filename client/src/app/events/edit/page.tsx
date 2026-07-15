"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getEventById, updateEvent } from "@/lib/api/eventApi";
import { getPricingItemsByCategory } from "@/lib/api/pricingApi";
import { CalendarDays, PackagePlus } from "lucide-react";

function EditEventPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const router = useRouter();

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
      if (!id) {
        setError("Event ID is missing.");
        setFetching(false);
        return;
      }

      try {
        setFetching(true);
        setError("");

        const [data, items] = await Promise.all([
          getEventById(id),
          getPricingItemsByCategory("Event Service"),
        ]);

        setPricingItems(Array.isArray(items) ? items : []);

        setFormData({
          eventName: data.eventName || "",
          eventType: data.eventType || "Wedding",
          guestCount: Number(data.guestCount || 0),
          primaryDate: data.primaryDate || "",
          startTime: data.startTime || "",
          organizerName: data.organizerName || "",
          phone: data.phone || "",
          status: data.status || "Active",
          venueId: data.venueId || "V-001",
        });

        if (data.selectedPackages && Array.isArray(data.selectedPackages)) {
          setSelectedPackages(
            data.selectedPackages.map((p: any) => ({
              pricingItemId: p.pricingItemId || p.id || "",
              name: p.name || "",
              quantity: Number(p.quantity || 1),
              price: Number(p.price || 0),
            }))
          );
        }
      } catch (err: any) {
        setError(err.message || "Failed to load event.");
      } finally {
        setFetching(false);
      }
    }

    loadData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "guestCount" ? Number(value) : value,
    });
  };

  const addPackage = (pricingItemId: string) => {
    if (!pricingItemId) return;

    const pricingItem = pricingItems.find((p) => p.id === pricingItemId);
    if (!pricingItem) return;

    const existingIndex = selectedPackages.findIndex(
      (p) => p.pricingItemId === pricingItemId
    );

    const newPackages = [...selectedPackages];

    if (existingIndex >= 0) {
      newPackages[existingIndex].quantity += 1;
    } else {
      newPackages.push({
        pricingItemId: pricingItem.id,
        name: pricingItem.name,
        quantity: 1,
        price: Number(pricingItem.price || 0),
      });
    }

    setSelectedPackages(newPackages);
  };

  const updatePackageQty = (index: number, quantity: number) => {
    const newPackages = [...selectedPackages];

    if (quantity <= 0) {
      newPackages.splice(index, 1);
    } else {
      newPackages[index].quantity = quantity;
    }

    setSelectedPackages(newPackages);
  };

  const packageTotal = selectedPackages.reduce(
    (acc, p) => acc + Number(p.price || 0) * Number(p.quantity || 0),
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      setError("Event ID is missing.");
      return;
    }

    if (!formData.eventName || !formData.primaryDate || !formData.startTime) {
      setError("Event name, date and start time are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await updateEvent(id, {
        ...formData,
        guestCount: Number(formData.guestCount),
        selectedPackages,
        packageTotal,
        grandTotal: packageTotal,
      });

      alert("Event updated successfully.");
      router.push("/events/list");
    } catch (err: any) {
      setError(err.message || "Failed to update event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "EVENTS"]}>
      <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
        <AppSidebar />

        <main className="page-slide-in px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#806300]">
                Events Module
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Edit Event
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Update event details, status and service packages.
              </p>
            </div>

            <Link
              href="/events/list"
              className="rounded-xl border border-[#806300] bg-white px-6 py-3 text-center font-bold text-[#806300] transition hover:bg-[#faf8f3]"
            >
              Back to Event List
            </Link>
          </div>

          <section className="max-w-4xl rounded-2xl border border-[#d0c5af] bg-white p-8 shadow-sm">
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 font-bold text-red-700">
                {error}
              </div>
            )}

            {fetching ? (
              <div className="flex h-48 items-center justify-center text-lg font-bold text-[#806300]">
                Loading event details...
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[#d0c5af] pb-5">
                  <CalendarDays className="text-[#735c00]" />
                  <h2 className="text-2xl font-bold">Event Information</h2>
                </div>

                <InputField
                  label="Event Name *"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  required
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-bold text-[#4d4635]">
                      Event Type
                    </label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                    >
                      <option value="Wedding">Wedding</option>
                      <option value="Party">Party</option>
                      <option value="Corporate">Corporate</option>
                    </select>
                  </div>

                  <InputField
                    label="Guest Count *"
                    name="guestCount"
                    type="number"
                    value={String(formData.guestCount)}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <InputField
                    label="Date *"
                    name="primaryDate"
                    type="date"
                    value={formData.primaryDate}
                    onChange={handleChange}
                    required
                  />

                  <InputField
                    label="Start Time *"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <InputField
                    label="Organizer Name *"
                    name="organizerName"
                    value={formData.organizerName}
                    onChange={handleChange}
                    required
                  />

                  <InputField
                    label="Phone *"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
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
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                  >
                    <option value="Active">Active</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="rounded-2xl border border-[#d0c5af] bg-[#fbf9f5] p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <PackagePlus className="text-[#735c00]" />
                    <h3 className="text-xl font-bold text-[#735c00]">
                      Event Service Packages
                    </h3>
                  </div>

                  <div className="mb-4 flex gap-2">
                    <select
                      id="pkg-select"
                      className="flex-1 rounded-xl border border-[#d0c5af] p-3 text-sm"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select a package to add...
                      </option>

                      {pricingItems.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} - Rs {Number(item.price || 0)}
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
                      className="rounded-xl bg-[#e6cf77] px-5 py-3 font-bold text-[#4c3a00] hover:bg-[#d4af37]"
                    >
                      Add
                    </button>
                  </div>

                  {selectedPackages.length === 0 ? (
                    <p className="text-sm italic text-gray-500">
                      No packages added yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {selectedPackages.map((pkg, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-xl border border-[#e6dfd2] bg-white p-4 shadow-sm"
                        >
                          <div>
                            <p className="font-bold">{pkg.name}</p>
                            <p className="text-xs text-gray-500">
                              Rs {Number(pkg.price || 0)} each
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                updatePackageQty(idx, pkg.quantity - 1)
                              }
                              className="h-8 w-8 rounded-full bg-gray-100 font-bold hover:bg-gray-200"
                            >
                              -
                            </button>

                            <span className="w-5 text-center font-bold">
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

                  <div className="mt-5 flex justify-between border-t border-[#d0c5af] pt-4 text-lg font-bold">
                    <span>Grand Total:</span>
                    <span className="text-[#735c00]">
                      Rs {packageTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-[#735c00] px-8 py-3 font-bold text-white transition hover:bg-[#d4af37] disabled:opacity-60"
                  >
                    {loading ? "Updating..." : "Update Event"}
                  </button>

                  <Link
                    href="/events/list"
                    className="rounded-xl border border-[#d0c5af] px-8 py-3 font-bold text-[#4d4635] transition hover:bg-[#f5f3ef]"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            )}
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-[#4d4635]">{label}</label>

      <input
        required={required}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
      />
    </div>
  );
}

export default function EditEventPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading edit event...</div>}>
      <EditEventPageContent />
    </Suspense>
  );
}