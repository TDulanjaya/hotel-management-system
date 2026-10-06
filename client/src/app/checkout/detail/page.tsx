"use client";
import { useSearchParams } from "next/navigation";


import { useParams, useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useState, useEffect } from "react";
import { getReservationById } from "@/lib/api/reservationsApi";
import { processCheckout } from "@/lib/api/checkoutApi";
import { getByReservationId } from "@/lib/api/folioApi";

export default function CheckoutDetailsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") as string;
  const router = useRouter();

  const [reservation, setReservation] = useState<any>(null);
  const [folio, setFolio] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      getReservationById(id).then(setReservation).catch(console.error);
      getByReservationId(id).then(setFolio).catch(() => setFolio(null));
    }
  }, [id]);

  const handleCheckout = async () => {
    if (!id || !confirm("Complete checkout for this guest?")) return;
    setLoading(true);
    try {
      await processCheckout(id);
      alert("Checkout processed successfully!");
      router.push("/checkout");
    } catch (err) {
      console.error(err);
      alert("Failed to process checkout");
    } finally {
      setLoading(false);
    }
  };

  if (!reservation) {
    return (
      <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "RECEPTIONIST"]}>
        <div className="min-h-screen bg-[#fbf9f5] p-10">Loading...</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "RECEPTIONIST"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Guest Checkout
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Checkout Details
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Review guest stay details, room charges, service charges, and
                final checkout payment.
              </p>
            </div>

            <button
              onClick={() => router.push("/folio")}
              className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
            >
              Back to Folio
            </button>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard label="Checkout ID" value={id.substring(0,8)} />
            <StatCard label="Room No" value={reservation.roomNumber} />
            <StatCard label="Guest" value={reservation.guestName} />
            <StatCard label="Status" value={reservation.status === "CHECKED_OUT" ? "Completed" : "Ready"} />
          </section>

          <section className="grid gap-8 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Guest Stay Details</h2>

              <div className="mt-6 space-y-4">
                <InfoRow label="Guest Name" value={reservation.guestName} />
                <InfoRow label="Room Type" value="-" />
                <InfoRow label="Check In" value={reservation.checkIn} />
                <InfoRow label="Check Out" value={reservation.checkOut} />
                <InfoRow label="Adults / Children" value={`${reservation.adults} / ${reservation.children}`} />
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Payment Summary</h2>

              <div className="mt-6 space-y-4">
                <InfoRow label="Total Charges" value={`Rs ${Number(folio?.totalAmount ?? reservation.totalAmount ?? 0).toFixed(2)}`} />
                <InfoRow label="Paid Amount" value={`Rs ${Number(folio?.paidAmount ?? 0).toFixed(2)}`} />
                <InfoRow label="Outstanding Balance" value={`Rs ${Number(folio?.balanceAmount ?? reservation.totalAmount ?? 0).toFixed(2)}`} />
                <InfoRow label="Payment Status" value={folio?.balanceAmount <= 0.01 ? "PAID" : reservation.paymentStatus || "OUTSTANDING"} />
              </div>

              <div className="mt-6 rounded-xl bg-[#735c00] p-5 text-white">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold">Final Total</p>
                  <p className="text-2xl font-extrabold">Rs {Number(folio?.balanceAmount ?? reservation.totalAmount ?? 0).toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm xl:col-span-2">
              <h2 className="text-2xl font-bold">Folio Charges</h2>
              <div className="mt-4 space-y-2">
                {(folio?.lines || []).filter((line: any) => line.status !== "VOID").map((line: any, index: number) => (
                  <InfoRow key={`${line.sourceId || "line"}-${index}`} label={line.description || line.category || "Charge"} value={`Rs ${Number(line.amount || 0).toFixed(2)}`} />
                ))}
                {!folio?.lines?.length && <p className="text-sm text-[#4d4635]">No folio service lines recorded.</p>}
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm xl:col-span-2">
              <h2 className="text-2xl font-bold">Checkout Actions</h2>

              <div className="mt-6 flex flex-wrap gap-4">
                <button 
                  onClick={handleCheckout} 
                  disabled={loading || reservation.status === "CHECKED_OUT"}
                  className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] disabled:opacity-50"
                >
                  {loading ? "Processing..." : (reservation.status === "CHECKED_OUT" ? "Already Checked Out" : "Complete Checkout")}
                </button>

                <button className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white">
                  Print Invoice
                </button>

                <button className="rounded-xl border border-[#d0c5af] px-6 py-3 font-bold text-[#4d4635] transition hover:bg-[#f5f3ef]">
                  Send Email
                </button>
              </div>
            </div>
          </section>
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#f5f3ef] p-4">
      <p className="font-bold text-[#4d4635]">{label}</p>
      <p className="font-bold text-[#735c00]">{value}</p>
    </div>
  );
}
