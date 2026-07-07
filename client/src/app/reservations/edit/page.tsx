"use client";
import { useSearchParams } from "next/navigation";


import { useParams, useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function EditReservationPage() {
  const searchParams = useSearchParams();
  const rawId = searchParams.get("id");
  const id = rawId as string;

  const router = useRouter();
  const params = useParams();
  const reservationId = id as string;

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

            <button
              onClick={() => router.push("/reservations")}
              className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
            >
              Back to Reservations
            </button>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard label="Reservation ID" value={reservationId || "N/A"} />
            <StatCard label="Current Status" value="Confirmed" />
            <StatCard label="Room" value="402" />
            <StatCard label="Total" value="Rs 860.00" />
          </section>

          <section className="grid gap-8 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Guest Details</h2>

              <div className="mt-6 space-y-5">
                <InputField label="Guest Name" defaultValue="Daniel Smith" />

                <InputField
                  label="Email"
                  type="email"
                  defaultValue="daniel.smith@example.com"
                />

                <InputField label="Phone" defaultValue="+94 77 123 4567" />

                <InputField label="Nationality" defaultValue="United Kingdom" />

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Guest Type
                  </label>

                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>VIP</option>
                    <option>Regular</option>
                    <option>Corporate</option>
                    <option>Walk-in</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Booking Details</h2>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Room Type
                  </label>

                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Deluxe Room</option>
                    <option>Standard Room</option>
                    <option>Executive Suite</option>
                    <option>Presidential Suite</option>
                  </select>
                </div>

                <InputField label="Room Number" defaultValue="402" />

                <InputField
                  label="Check In Date"
                  type="date"
                  defaultValue="2026-06-18"
                />

                <InputField
                  label="Check Out Date"
                  type="date"
                  defaultValue="2026-06-21"
                />

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Reservation Status
                  </label>

                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Confirmed</option>
                    <option>Pending</option>
                    <option>Checked In</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Payment Details</h2>

              <div className="mt-6 space-y-5">
                <InputField label="Room Charge" defaultValue="Rs 750.00" />
                <InputField label="Service Charge" defaultValue="Rs 75.00" />
                <InputField label="Tax" defaultValue="Rs 35.00" />
                <InputField label="Total Amount" defaultValue="Rs 860.00" />

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Payment Status
                  </label>

                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Paid</option>
                    <option>Pending</option>
                    <option>Partial</option>
                    <option>Refunded</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Special Notes</h2>

              <textarea
                defaultValue="Guest requested early check-in, airport pickup, and a quiet room on a higher floor."
                rows={10}
                className="mt-6 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              />

              <div className="mt-6 flex flex-wrap gap-4">
                <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                  Save Changes
                </button>

                <button
                  onClick={() => router.push("/reservations")}
                  className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
                >
                  Cancel
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

function InputField({
  label,
  defaultValue,
  type = "text",
}: {
  label: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-[#4d4635]">{label}</label>

      <input
        type={type}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
      />
    </div>
  );
}
