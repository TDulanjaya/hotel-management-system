"use client";
import { useSearchParams } from "next/navigation";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getEventById, updateEvent } from "@/lib/api/eventApi";

export default function EditEventPage() {
  const searchParams = useSearchParams();
  const rawId = searchParams.get("id");

  const router = useRouter();
  const params = useParams();
  const id = rawId as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

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
    grandTotal: 0
  });

  useEffect(() => {
    async function loadEvent() {
      try {
        const data = await getEventById(id);
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
          grandTotal: data.grandTotal || 0
        });
      } catch (err: any) {
        setError("Failed to load event.");
      } finally {
        setFetching(false);
      }
    }
    loadEvent();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await updateEvent(id, {
        ...formData,
        guestCount: Number(formData.guestCount),
        grandTotal: Number(formData.grandTotal),
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
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Grand Total</label>
                  <input required type="number" name="grandTotal" value={formData.grandTotal} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
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
