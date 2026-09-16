"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { createPayment } from "@/lib/api/paymentsApi";

export default function NewPaymentPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { data: reservationsData } = useSWR<any>("/api/reservations");
  const reservations = Array.isArray(reservationsData?.content)
    ? reservationsData.content
    : Array.isArray(reservationsData)
    ? reservationsData
    : [];

  const [formData, setFormData] = useState({
    guestName: "",
    roomNumber: "",
    referenceType: "RESERVATION",
    referenceId: "",
    amount: 0,
    method: "Cash",
    status: "PAID",
    notes: "",
  });

  const handleSelectReservation = (reservationId: string) => {
    const res = reservations.find((r: any) => r.id === reservationId);
    if (res) {
      setFormData((prev) => ({
        ...prev,
        referenceId: res.id,
        guestName: res.guestName || "",
        roomNumber: res.roomNumber || "",
        amount: res.totalAmount || prev.amount,
      }));
    } else {
      setFormData((prev) => ({ ...prev, referenceId: reservationId }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount <= 0) {
      setError("Payment amount must be greater than 0.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      await createPayment({
        ...formData,
        amount: Number(formData.amount),
      });
      router.push("/payments");
    } catch (err: any) {
      setError(err.message || "Failed to record payment.");
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
                Finance Operations
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Add New Payment
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Record a guest payment and automatically settle or reconcile reservation balances.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/payments")}
              className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
            >
              Back to Payments
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
            <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Payment Details</h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Link to Active Reservation
                  </label>
                  <select
                    value={formData.referenceType === "RESERVATION" ? formData.referenceId : ""}
                    onChange={(e) => handleSelectReservation(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  >
                    <option value="">-- Manual / Custom Reference --</option>
                    {reservations.map((r: any) => (
                      <option key={r.id} value={r.id}>
                        Room {r.roomNumber || "?"} - {r.guestName} (Due: Rs {r.totalAmount || 0})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Reference ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.referenceId}
                    onChange={(e) => setFormData({ ...formData, referenceId: e.target.value })}
                    placeholder="Reservation ID, Folio ID, Event ID"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Guest / Payer Name
                  </label>
                  <input
                    type="text"
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    placeholder="Enter guest or event name"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Room Number
                  </label>
                  <input
                    type="text"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    placeholder="e.g. 402"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Payment Type / Module
                  </label>
                  <select
                    value={formData.referenceType}
                    onChange={(e) => setFormData({ ...formData, referenceType: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  >
                    <option value="RESERVATION">Reservation</option>
                    <option value="FOLIO">Folio Settlement</option>
                    <option value="EVENT">Event</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Payment Method
                  </label>
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Online">Online Payment</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Amount (Rs) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={formData.amount || ""}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Payment Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  >
                    <option value="PAID">PAID (Settles Balance)</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="text-sm font-bold text-[#4d4635]">Notes / Remarks</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Optional transaction remarks..."
                  className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00] disabled:opacity-50"
                >
                  {saving ? "Saving Payment..." : "Record Payment"}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/payments")}
                  className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </section>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}
