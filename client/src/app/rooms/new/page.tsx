"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { createRoom } from "@/lib/api/roomApi";
import { Bed, ArrowLeft, Save, DoorOpen } from "lucide-react";

export default function NewRoomPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "Standard",
    floor: "Floor 1",
    capacity: 2,
    pricePerNight: 0,
    status: "AVAILABLE",
    description: "",
    image: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.roomNumber || !formData.roomType || !formData.floor) {
      setError("Room number, room type and floor are required.");
      return;
    }

    if (Number(formData.capacity) <= 0) {
      setError("Capacity must be greater than 0.");
      return;
    }

    if (Number(formData.pricePerNight) < 0) {
      setError("Price cannot be negative.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await createRoom({
        ...formData,
        capacity: Number(formData.capacity),
        pricePerNight: Number(formData.pricePerNight),
      });
      router.push("/rooms");
    } catch (err: any) {
      setError(err.message || "Failed to add room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "RECEPTIONIST"]}>
      <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
        <AppSidebar />

        <main className="page-slide-in px-4 py-6 pt-16 sm:px-6 sm:py-8 lg:px-8 lg:pt-8 lg:ml-[280px]">
          <div className="mb-6 sm:mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#735c00]">
                <DoorOpen className="h-4 w-4" />
                <span>Rooms Module</span>
              </div>

              <h1 className="mt-1 sm:mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#735c00]">
                Add New Room
              </h1>

              <p className="mt-1 text-xs sm:text-sm text-[#4d4635]">
                Configure a new room to add to the hotel inventory.
              </p>
            </div>

            <Link
              href="/rooms"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#806300] bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-[#806300] shadow-sm transition hover:bg-[#faf8f3]"
            >
              <ArrowLeft size={16} />
              <span>Back to Rooms</span>
            </Link>
          </div>

          <div className="max-w-3xl rounded-2xl border border-[#d0c5af] bg-white p-4 sm:p-8 shadow-sm">
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 font-bold text-red-700 text-xs sm:text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 border-b border-[#d0c5af] pb-4 sm:pb-5">
                <div className="rounded-lg bg-[#735c00]/10 p-2 text-[#735c00]">
                  <Bed className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#181818]">Room Information</h2>
                  <p className="text-xs text-[#7f7663]">Room properties and pricing</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#4d4635] mb-1">
                    Room Number *
                  </label>
                  <input
                    required
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    placeholder="e.g. 101"
                    className="w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-3.5 py-2.5 sm:py-3 text-base outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#4d4635] mb-1">
                    Room Type
                  </label>
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-3.5 py-2.5 sm:py-3 text-base outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Presidential Suite">Presidential Suite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#4d4635] mb-1">
                    Floor *
                  </label>
                  <input
                    required
                    type="text"
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    placeholder="e.g. Floor 1"
                    className="w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-3.5 py-2.5 sm:py-3 text-base outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#4d4635] mb-1">
                    Capacity (Guests) *
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-3.5 py-2.5 sm:py-3 text-base outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#4d4635] mb-1">
                    Price Per Night *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    name="pricePerNight"
                    value={formData.pricePerNight}
                    onChange={handleChange}
                    placeholder="e.g. 15000"
                    className="w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-3.5 py-2.5 sm:py-3 text-base outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#4d4635] mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-3.5 py-2.5 sm:py-3 text-base outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="OCCUPIED">OCCUPIED</option>
                    <option value="CLEANING">CLEANING</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#4d4635] mb-1">
                  Image URL (Optional)
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-3.5 py-2.5 sm:py-3 text-base outline-none focus:ring-2 focus:ring-[#735c00]/30"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#4d4635] mb-1">
                  Description / Note
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g. Sea view, balcony, king bed..."
                  className="w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-3 text-base outline-none focus:ring-2 focus:ring-[#735c00]/30"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#735c00] px-8 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-[#8f7300] active:scale-[0.98] disabled:opacity-60 text-center"
                >
                  <Save size={18} />
                  <span>{loading ? "Saving..." : "Save Room"}</span>
                </button>

                <Link
                  href="/rooms"
                  className="rounded-xl border border-[#d0c5af] px-8 py-3.5 text-base font-bold text-[#4d4635] transition hover:bg-[#f5f3ef] text-center"
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
