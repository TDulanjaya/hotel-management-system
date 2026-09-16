"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getReservationById, updateReservation } from "@/lib/api/reservationsApi";
import { getRooms } from "@/lib/api/roomApi";

export default function EditReservationPage() {
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("id") || "";
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [rooms, setRooms] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    guestName: "",
    guestId: "",
    roomNumber: "",
    checkIn: "",
    checkOut: "",
    adults: 1,
    children: 0,
    status: "CONFIRMED",
    paymentStatus: "PENDING",
    totalAmount: 0,
    notes: "",
  });

  useEffect(() => {
    async function loadData() {
      if (!reservationId) {
        setError("Reservation ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const [reservation, roomData] = await Promise.all([
          getReservationById(reservationId),
          getRooms({ size: 100 }).catch(() => []),
        ]);

        const list = Array.isArray(roomData) ? roomData : roomData?.content || [];
        setRooms(list);

        setFormData({
          guestName: reservation.guestName || "",
          guestId: reservation.guestId || "",
          roomNumber: reservation.roomNumber || "",
          checkIn: reservation.checkIn || "",
          checkOut: reservation.checkOut || "",
          adults: Number(reservation.adults || 1),
          children: Number(reservation.children || 0),
          status: reservation.status || "CONFIRMED",
          paymentStatus: reservation.paymentStatus || "PENDING",
          totalAmount: Number(reservation.totalAmount || 0),
          notes: reservation.notes || "",
        });
      } catch (err: any) {
        setError(err.message || "Failed to load reservation data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [reservationId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "adults" || name === "children" || name === "totalAmount" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservationId) return;

    setSaving(true);
    setError("");

    try {
      await updateReservation(reservationId, formData);
      alert("Reservation updated successfully.");
      router.push("/reservations");
    } catch (err: any) {
      setError(err.message || "Failed to update reservation");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "RECEPTIONIST"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Reservation Management
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Edit Reservation
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Update guest booking details, room allocation, dates, payment
                status, and special requests.
              </p>
            </div>

            <Link
              href="/reservations"
              className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
            >
              Back to Reservations
            </Link>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex h-64 items-center justify-center text-lg font-bold text-[#735c00]">
              Loading reservation details...
            </div>
          ) : (
            <>
              <section className="mb-8 grid gap-6 md:grid-cols-4">
                <StatCard label="Reservation ID" value={reservationId || "N/A"} />
                <StatCard label="Current Status" value={formData.status} />
                <StatCard label="Room" value={formData.roomNumber || "N/A"} />
                <StatCard label="Total" value={`Rs ${Number(formData.totalAmount || 0).toLocaleString()}`} />
              </section>

              <form onSubmit={handleSubmit} className="grid gap-8 xl:grid-cols-[1fr_1fr]">
                <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-bold">Guest & Stay Details</h2>

                  <div className="mt-6 space-y-5">
                    <div>
                      <label className="text-sm font-bold text-[#4d4635]">Guest Name</label>
                      <input
                        required
                        type="text"
                        name="guestName"
                        value={formData.guestName}
                        onChange={handleChange}
                        className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-bold text-[#4d4635]">Check-in Date</label>
                        <input
                          required
                          type="date"
                          name="checkIn"
                          value={formData.checkIn}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-bold text-[#4d4635]">Check-out Date</label>
                        <input
                          required
                          type="date"
                          name="checkOut"
                          value={formData.checkOut}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-[#4d4635]">Room Number</label>
                      <select
                        required
                        name="roomNumber"
                        value={formData.roomNumber}
                        onChange={handleChange}
                        className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                      >
                        <option value="">-- Select Room --</option>
                        {rooms.map((room) => (
                          <option key={room.id || room.roomNumber} value={room.roomNumber}>
                            Room {room.roomNumber} ({room.type || "Room"}) [{room.status || "AVAILABLE"}]
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-bold text-[#4d4635]">Adults</label>
                        <input
                          type="number"
                          min={1}
                          name="adults"
                          value={formData.adults}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-bold text-[#4d4635]">Children</label>
                        <input
                          type="number"
                          min={0}
                          name="children"
                          value={formData.children}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-bold text-[#4d4635]">Status</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="CHECKED_IN">CHECKED_IN</option>
                          <option value="CANCELLED">CANCELLED</option>
                          <option value="CHECKED_OUT">CHECKED_OUT</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-bold text-[#4d4635]">Payment Status</label>
                        <select
                          name="paymentStatus"
                          value={formData.paymentStatus}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PAID">PAID</option>
                          <option value="PARTIAL">PARTIAL</option>
                          <option value="REFUNDED">REFUNDED</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-[#4d4635]">Total Amount (Rs)</label>
                      <input
                        type="number"
                        min={0}
                        name="totalAmount"
                        value={formData.totalAmount}
                        onChange={handleChange}
                        className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30 font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Special Notes</h2>

                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={10}
                      placeholder="Special guest requests, notes, or preferences..."
                      className="mt-6 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                    />
                  </div>

                  <div className="mt-6 flex flex-wrap gap-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00] disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>

                    <Link
                      href="/reservations"
                      className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </form>
            </>
          )}
        </main>
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

      <p className="mt-2 text-2xl font-extrabold text-[#735c00]">{value}</p>
    </div>
  );
}
