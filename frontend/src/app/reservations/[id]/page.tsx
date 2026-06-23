"use client";

import { useParams, useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/AppSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ReservationDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const reservationId = params?.id as string;

  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "receptionist"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Reservation Management
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Reservation Details
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View booking details, guest information, room allocation,
                payment status, and check-in notes.
              </p>
            </div>

            <button
              onClick={() => router.push("/reservations")}
              className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
            >
              Back to Reservations
            </button>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard label="Reservation ID" value={reservationId || "N/A"} />
            <StatCard label="Status" value="Confirmed" />
            <StatCard label="Room" value="Deluxe 402" />
            <StatCard label="Total" value="$860.00" />
          </section>

          <section className="grid gap-8 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Guest Details</h2>

              <div className="mt-6 space-y-4">
                <DetailRow label="Guest Name" value="Daniel Smith" />
                <DetailRow label="Email" value="daniel.smith@example.com" />
                <DetailRow label="Phone" value="+94 77 123 4567" />
                <DetailRow label="Nationality" value="United Kingdom" />
                <DetailRow label="Guest Type" value="VIP" />
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Booking Details</h2>

              <div className="mt-6 space-y-4">
                <DetailRow label="Room Type" value="Deluxe Room" />
                <DetailRow label="Room Number" value="402" />
                <DetailRow label="Check In" value="2026-06-18" />
                <DetailRow label="Check Out" value="2026-06-21" />
                <DetailRow label="Nights" value="3 Nights" />
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Payment Details</h2>

              <div className="mt-6 space-y-4">
                <DetailRow label="Room Charge" value="$750.00" />
                <DetailRow label="Service Charge" value="$75.00" />
                <DetailRow label="Tax" value="$35.00" />
                <DetailRow label="Total Amount" value="$860.00" />
                <DetailRow label="Payment Status" value="Paid" />
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Reservation Notes</h2>

              <div className="mt-6 rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-5 text-[#4d4635]">
                Guest requested early check-in, airport pickup, and a quiet room
                on a higher floor.
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                  Check In
                </button>

                <button className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white">
                  Edit Booking
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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3">
      <p className="text-sm font-bold text-[#4d4635]">{label}</p>
      <p className="text-right font-semibold text-[#1b1c1a]">{value}</p>
    </div>
  );
}