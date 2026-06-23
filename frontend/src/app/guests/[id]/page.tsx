"use client";

import { useParams, useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const stayHistory = [
  {
    id: "STAY-1001",
    room: "402",
    type: "Executive Suite",
    checkIn: "Oct 21, 2024",
    checkOut: "Oct 24, 2024",
    amount: "Rs 1,638.00",
    status: "Active",
  },
  {
    id: "STAY-0988",
    room: "305",
    type: "Deluxe Room",
    checkIn: "Aug 12, 2024",
    checkOut: "Aug 15, 2024",
    amount: "Rs 920.00",
    status: "Completed",
  },
];

const guestServices = [
  {
    service: "Room Service",
    date: "Oct 23, 2024",
    amount: "Rs 32.00",
    status: "Added to Folio",
  },
  {
    service: "Restaurant Dinner",
    date: "Oct 23, 2024",
    amount: "Rs 142.00",
    status: "Added to Folio",
  },
  {
    service: "Parking",
    date: "Oct 24, 2024",
    amount: "Rs 25.00",
    status: "Paid",
  },
];

function getStatusClass(status: string) {
  if (status === "Completed" || status === "Paid") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Active" || status === "Added to Folio") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

export default function GuestDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const guestId = params?.id as string;

  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "receptionist"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Guest Management
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Guest Details
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View guest profile, stay history, service charges, and contact
                details.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/guests")}
                className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
              >
                Back to Guests
              </button>

              <button
                onClick={() => router.push(`/reservations/new`)}
                className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
              >
                New Reservation
              </button>
            </div>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard label="Guest ID" value={guestId || "N/A"} />
            <StatCard label="Current Room" value="402" />
            <StatCard label="Guest Type" value="VIP" />
            <StatCard label="Status" value="Active" />
          </section>

          <section className="mb-8 grid gap-8 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Personal Information</h2>

              <div className="mt-6 space-y-4">
                <InfoRow label="Full Name" value="Elena Rodriguez" />
                <InfoRow label="Email" value="elena@example.com" />
                <InfoRow label="Phone" value="+94 77 123 4567" />
                <InfoRow label="Nationality" value="Spain" />
                <InfoRow label="ID / Passport" value="P-88211990" />
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Current Stay</h2>

              <div className="mt-6 space-y-4">
                <InfoRow label="Room No" value="402" />
                <InfoRow label="Room Type" value="Executive Suite" />
                <InfoRow label="Check In" value="Oct 21, 2024" />
                <InfoRow label="Check Out" value="Oct 24, 2024" />
                <InfoRow label="Balance Due" value="Rs 784.00" />
              </div>

              <button
                onClick={() => router.push(`/folio/${guestId}`)}
                className="mt-6 rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
              >
                View Folio
              </button>
            </div>
          </section>

          <section className="mb-8 overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Stay History</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Previous and current room stay records.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Stay ID</th>
                    <th className="px-6 py-4">Room</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Check In</th>
                    <th className="px-6 py-4">Check Out</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {stayHistory.map((stay) => (
                    <tr key={stay.id} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{stay.id}</td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#735c00]">
                          Room {stay.room}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {stay.type}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {stay.checkIn}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {stay.checkOut}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            stay.status
                          )}`}
                        >
                          {stay.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right font-bold text-[#735c00]">
                        {stay.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Guest Service Usage</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Services used by this guest during the current stay.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {guestServices.map((service) => (
                    <tr
                      key={service.service}
                      className="transition hover:bg-[#fbf9f5]"
                    >
                      <td className="px-6 py-5 font-bold">
                        {service.service}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {service.date}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            service.status
                          )}`}
                        >
                          {service.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right font-bold text-[#735c00]">
                        {service.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
