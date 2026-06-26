"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { createRoom } from "@/lib/api/roomApi";

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
    image: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        <main className="page-slide-in px-8 py-10 lg:ml-[280px]">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#735c00]">Add New Room</h1>
          </div>
          
          <div className="max-w-2xl rounded-2xl border border-[#d0c5af] bg-white p-8 shadow-sm">
            {error && <div className="mb-4 text-red-600">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Room Number</label>
                  <input required type="text" name="roomNumber" value={formData.roomNumber} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Room Type</label>
                  <select name="roomType" value={formData.roomType} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3">
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Presidential Suite">Presidential Suite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Floor</label>
                  <input required type="text" name="floor" value={formData.floor} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Capacity (Guests)</label>
                  <input required type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Price Per Night</label>
                  <input required type="number" name="pricePerNight" value={formData.pricePerNight} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3">
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="OCCUPIED">OCCUPIED</option>
                    <option value="CLEANING">CLEANING</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4d4635]">Image URL (Optional)</label>
                <input type="text" name="image" value={formData.image} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4d4635]">Description / Note</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" disabled={loading} className="rounded-xl bg-[#735c00] px-8 py-3 font-bold text-white transition hover:bg-[#d4af37]">
                  {loading ? "Saving..." : "Save Room"}
                </button>
                <Link href="/rooms" className="rounded-xl border border-[#d0c5af] px-8 py-3 font-bold text-[#4d4635] transition hover:bg-[#f5f3ef]">
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
