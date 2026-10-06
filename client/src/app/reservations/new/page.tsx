"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { createReservation } from "@/lib/api/reservationsApi";
import { getRooms } from "@/lib/api/roomApi";
import { getGuests } from "@/lib/api/guestsApi";

export default function NewReservationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rooms, setRooms] = useState<any[]>([]);
  const [guests, setGuests] = useState<any[]>([]);

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
    notes: "",
  });

  useEffect(() => {
    async function loadRooms() {
      try {
        const [roomData, guestData] = await Promise.all([
          getRooms({ size: 100 }),
          getGuests({ size: 100 }),
        ]);
        const list = Array.isArray(roomData) ? roomData : roomData?.content || [];
        const guestList = Array.isArray(guestData) ? guestData : guestData?.content || [];
        setRooms(list);
        setGuests(guestList);
      } catch (err) {
        console.error("Failed to load rooms", err);
      }
    }
    loadRooms();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "adults" || name === "children" ? Number(value) : value,
    }));
  };

  const selectedRoom = rooms.find((r) => r.roomNumber === formData.roomNumber);
  const selectedGuest = guests.find((guest) => guest.id === formData.guestId);
  const baseRate = selectedRoom?.price || 450;

  // Calculate nights
  let nights = 1;
  if (formData.checkIn && formData.checkOut) {
    const d1 = new Date(formData.checkIn);
    const d2 = new Date(formData.checkOut);
    const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    nights = diff > 0 ? diff : 1;
  }

  const roomSubtotal = baseRate * nights;
  const taxAndService = Math.round(roomSubtotal * 0.10);
  const estimatedTotal = roomSubtotal + taxAndService;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roomNumber) {
      setError("Please select a room.");
      return;
    }
    if (!formData.guestId || !selectedGuest) {
      setError("Please select an existing guest. Add the guest first if they are not registered.");
      return;
    }
    if (!formData.checkIn || !formData.checkOut) {
      setError("Please select check-in and check-out dates.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createReservation({
        guestName: selectedGuest.name,
        guestId: formData.guestId,
        roomNumber: formData.roomNumber,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        adults: formData.adults,
        children: formData.children,
        status: formData.status,
        paymentStatus: formData.paymentStatus,
        totalAmount: estimatedTotal,
        notes: formData.notes,
      });
      router.push("/reservations");
    } catch (err: any) {
      setError(err.message || "Failed to save reservation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "RECEPTIONIST"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
              Front Office Module
            </p>

            <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
              New Reservation
            </h1>

            <p className="mt-2 text-[#4d4635]">
              Create a new guest room reservation with stay dates, guest
              details, room selection, and billing setup.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
            <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Reservation Details</h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Registered Guest
                  </label>
                  <select
                    required
                    name="guestId"
                    value={formData.guestId}
                    onChange={(event) => {
                      const guest = guests.find((item) => item.id === event.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        guestId: event.target.value,
                        guestName: guest?.name || "",
                      }));
                    }}
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  >
                    <option value="">-- Select guest --</option>
                    {guests.map((guest) => (
                      <option key={guest.id} value={guest.id}>
                        {guest.name} ({guest.phone || guest.email})
                      </option>
                    ))}
                  </select>
                  <Link href="/guests/new" className="mt-2 inline-block text-xs font-bold text-[#735c00] hover:underline">
                    + Add new guest
                  </Link>
                  {selectedGuest && (
                    <p className="mt-2 text-xs text-[#6d6251]">
                      {selectedGuest.email} · {selectedGuest.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Check-in Date
                  </label>
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
                  <label className="text-sm font-bold text-[#4d4635]">
                    Check-out Date
                  </label>
                  <input
                    required
                    type="date"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Room Number
                  </label>
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
                        Room {room.roomNumber} ({room.type || "Room"}) — Rs {Number(room.price || 450).toLocaleString()}/night [{room.status || "AVAILABLE"}]
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Adults
                  </label>
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
                  <label className="text-sm font-bold text-[#4d4635]">
                    Children
                  </label>
                  <input
                    type="number"
                    min={0}
                    name="children"
                    value={formData.children}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Reservation Status
                  </label>
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
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Payment Status
                  </label>
                  <select
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="PARTIAL">PARTIAL</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-[#4d4635]">
                    Special Requests / Notes
                  </label>
                  <textarea
                    rows={4}
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Airport pickup, extra bed, late check-in, meal preference..."
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>
              </div>
            </section>

            <aside className="space-y-8">
              <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">Billing Summary</h2>

                <div className="mt-6 space-y-4">
                  <SummaryRow label="Room Rate" value={`Rs ${baseRate.toLocaleString()} / night`} />
                  <SummaryRow label="Nights" value={String(nights)} />
                  <SummaryRow label="Tax & Service (10%)" value={`Rs ${taxAndService.toLocaleString()}`} />
                  <SummaryRow label="Estimated Total" value={`Rs ${estimatedTotal.toLocaleString()}`} highlight />
                </div>
              </section>

              <div className="flex gap-4">
                <Link
                  href="/reservations"
                  className="flex-1 rounded-xl border border-[#735c00] px-6 py-4 text-center font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-[#735c00] px-6 py-4 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00] disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Save Reservation"}
                </button>
              </div>
            </aside>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function SummaryRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl p-4 ${
        highlight
          ? "bg-[#735c00] text-white"
          : "bg-[#f5f3ef] text-[#1b1c1a]"
      }`}
    >
      <span className="font-bold">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
