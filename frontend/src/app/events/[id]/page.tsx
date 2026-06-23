"use client";

import { useParams, useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/AppSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const eventCharges = [
  {
    item: "Venue Rental",
    amount: "$4,500.00",
  },
  {
    item: "Food & Beverage",
    amount: "$5,200.00",
  },
  {
    item: "Decoration Package",
    amount: "$1,400.00",
  },
  {
    item: "Service Charge",
    amount: "$1,300.00",
  },
];

const guestRows = [
  {
    name: "Mr. Nathan Carter",
    type: "VIP Guest",
    meal: "Vegetarian",
    status: "Confirmed",
  },
  {
    name: "Ms. Amanda Lewis",
    type: "Guest",
    meal: "Regular",
    status: "Confirmed",
  },
  {
    name: "Mr. Daniel Brown",
    type: "Guest",
    meal: "Regular",
    status: "Pending",
  },
];

function getStatusClass(status: string) {
  if (status === "Confirmed") {
    return "bg-green-100 text-green-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

export default function EventDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "events"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Event Management
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Event Details
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View event booking details, venue, client, payments, guests, and
                event charges.
              </p>
            </div>

            <button
              onClick={() => router.push("/events")}
              className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
            >
              Back to Events
            </button>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard label="Event ID" value={eventId || "N/A"} />
            <StatCard label="Venue" value="Grand Ballroom" />
            <StatCard label="Guests" value="240" />
            <StatCard label="Status" value="Confirmed" />
          </section>

          <section className="mb-8 grid gap-8 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Event Information</h2>

              <div className="mt-6 space-y-4">
                <InfoRow label="Event Name" value="Corporate Gala - TechVibe" />
                <InfoRow label="Client" value="TechVibe Pvt Ltd" />
                <InfoRow label="Event Type" value="Corporate Dinner" />
                <InfoRow label="Event Date" value="Oct 24, 2024" />
                <InfoRow label="Time" value="06:00 PM - 11:00 PM" />
                <InfoRow label="Coordinator" value="Events Team" />
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Payment Summary</h2>

              <div className="mt-6 space-y-4">
                {eventCharges.map((charge) => (
                  <InfoRow
                    key={charge.item}
                    label={charge.item}
                    value={charge.amount}
                  />
                ))}
              </div>

              <div className="mt-6 rounded-xl bg-[#735c00] p-5 text-white">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold">Total Event Income</p>
                  <p className="text-2xl font-extrabold">$12,400.00</p>
                </div>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Guest List Preview</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Main guest confirmation and meal preference details.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Guest Name</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Meal</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {guestRows.map((guest) => (
                    <tr key={guest.name} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{guest.name}</td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {guest.type}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {guest.meal}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            guest.status
                          )}`}
                        >
                          {guest.status}
                        </span>
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