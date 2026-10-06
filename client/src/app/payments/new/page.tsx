"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { createPayment } from "@/lib/api/paymentsApi";
import { getAll as getFolios } from "@/lib/api/folioApi";
import { getToken } from "@/utils/auth";

export default function NewPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [billOptions, setBillOptions] = useState<any[]>([]);
  const [selectedBill, setSelectedBill] = useState<any>(null);

  const [formData, setFormData] = useState({
    guestName: "",
    roomNumber: "",
    referenceType: "FOLIO",
    referenceId: "",
    amount: 0,
    method: "CASH",
    transactionReference: "",
    status: "PAID",
    notes: "",
  });

  useEffect(() => {
    async function loadBills() {
      try {
        const token = getToken();
        const headers = { Authorization: `Bearer ${token}` };
        const [folios, events, direct] = await Promise.all([
          getFolios(),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/event-bills`, { headers }).then((r) => r.json()),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/direct-bills`, { headers }).then((r) => r.json()),
        ]);
        setBillOptions([
          ...(Array.isArray(folios) ? folios : []).map((bill: any) => ({ ...bill, referenceType: "FOLIO" })),
          ...(Array.isArray(events) ? events : []).map((bill: any) => ({ ...bill, referenceType: "EVENT_BILL" })),
          ...(Array.isArray(direct) ? direct : []).map((bill: any) => ({ ...bill, referenceType: "DIRECT_BILL" })),
        ]);
      } catch {
        setError("Unable to load open bills.");
      }
    }
    loadBills();
  }, []);

  useEffect(() => {
    const referenceType = searchParams.get("referenceType");
    const referenceId = searchParams.get("referenceId");
    if (referenceType || referenceId) {
      setFormData((prev) => ({
        ...prev,
        referenceType: referenceType || prev.referenceType,
        referenceId: referenceId || prev.referenceId,
      }));
    }
  }, [searchParams]);

  const handleSelectBill = (billId: string) => {
    const bill = billOptions.find((entry) => entry.id === billId);
    if (bill) {
      setSelectedBill(bill);
      setFormData((prev) => ({
        ...prev,
        referenceType: bill.referenceType,
        referenceId: bill.id,
        guestName: bill.guestName || bill.eventName || "",
        roomNumber: bill.roomNumber || "",
        amount: Number(bill.balanceAmount ?? bill.totalAmount ?? 0),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.referenceId || formData.amount <= 0) {
      setError("Select an open bill and enter a payment amount greater than 0.");
      return;
    }
    if (formData.amount > Number(selectedBill?.balanceAmount ?? formData.amount)) {
      setError("Payment cannot exceed the outstanding bill balance.");
      return;
    }
    if (formData.method !== "CASH" && !formData.transactionReference.trim()) {
      setError("Transaction reference is required for non-cash payments.");
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
                    Open bill
                  </label>
                  <select
                    value={formData.referenceId}
                    onChange={(e) => handleSelectBill(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  >
                    <option value="">-- Select a bill --</option>
                    {billOptions.filter((bill) => Number(bill.balanceAmount ?? 0) > 0).map((bill: any) => (
                      <option key={`${bill.referenceType}-${bill.id}`} value={bill.id}>
                        {bill.referenceType.replace("_", " ")} - {bill.guestName || bill.eventName || "Direct customer"} (Due: Rs {bill.balanceAmount || 0})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Transaction reference
                  </label>
                  <input
                    type="text"
                    value={formData.transactionReference}
                    onChange={(e) => setFormData({ ...formData, transactionReference: e.target.value })}
                    placeholder="Terminal, bank, or QR reference"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Reference ID *
                  </label>
                  <p className="mt-2 rounded-xl bg-[#f5f3ef] px-4 py-3 text-sm text-[#4d4635]">
                    {formData.referenceId || "Select an open bill above"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Guest / Payer Name
                  </label>
                  <p className="mt-2 rounded-xl bg-[#f5f3ef] px-4 py-3 text-sm text-[#4d4635]">{formData.guestName || "Derived from bill"}</p>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Room Number
                  </label>
                  <p className="mt-2 rounded-xl bg-[#f5f3ef] px-4 py-3 text-sm text-[#4d4635]">{formData.roomNumber || "Not applicable"}</p>
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
                    <option value="FOLIO">Folio Settlement</option>
                    <option value="EVENT_BILL">Event master bill</option>
                    <option value="DIRECT_BILL">Direct bill</option>
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
                    <option value="CASH">Cash</option>
                    <option value="CARD_TERMINAL">Card terminal</option>
                    <option value="BANK_TRANSFER">Bank transfer</option>
                    <option value="CEFT">CEFT</option>
                    <option value="LANKAQR">LankaQR</option>
                    <option value="ONLINE_PAYMENT">Online payment</option>
                    <option value="VOUCHER">Voucher</option>
                    <option value="COMPLIMENTARY">Complimentary</option>
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
                    readOnly={Boolean(selectedBill)}
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
