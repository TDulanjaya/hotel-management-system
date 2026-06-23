"use client";

import { useParams, useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function CheckoutDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const checkoutId = params?.id as string;

  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "receptionist"]}>
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
            <StatCard label="Checkout ID" value={checkoutId || "N/A"} />
            <StatCard label="Room No" value="402" />
            <StatCard label="Guest" value="Elena Rodriguez" />
            <StatCard label="Status" value="Ready" />
          </section>

          <section className="grid gap-8 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Guest Stay Details</h2>

              <div className="mt-6 space-y-4">
                <InfoRow label="Guest Name" value="Elena Rodriguez" />
                <InfoRow label="Room Type" value="Executive Suite" />
                <InfoRow label="Check In" value="Oct 21, 2024 - 02:00 PM" />
                <InfoRow label="Check Out" value="Oct 24, 2024 - 11:00 AM" />
                <InfoRow label="Nights" value="3 Nights" />
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Payment Summary</h2>

              <div className="mt-6 space-y-4">
                <InfoRow label="Room Charges" value="Rs 1,200.00" />
                <InfoRow label="Room Service" value="Rs 86.00" />
                <InfoRow label="Restaurant" value="Rs 142.00" />
                <InfoRow label="Parking" value="Rs 25.00" />
                <InfoRow label="Tax & Service" value="Rs 185.00" />
              </div>

              <div className="mt-6 rounded-xl bg-[#735c00] p-5 text-white">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold">Final Total</p>
                  <p className="text-2xl font-extrabold">Rs 1,638.00</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm xl:col-span-2">
              <h2 className="text-2xl font-bold">Checkout Actions</h2>

              <div className="mt-6 flex flex-wrap gap-4">
                <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                  Complete Checkout
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
