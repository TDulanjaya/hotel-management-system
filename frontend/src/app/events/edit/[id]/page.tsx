"use client";

import { useParams, useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function EditEventPage() {
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
                Edit Event
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Update event details, venue, client information, guest count,
                and payment status.
              </p>
            </div>

            <button
              onClick={() => router.push(`/events/${eventId}`)}
              className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
            >
              Back to Event
            </button>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard label="Event ID" value={eventId || "N/A"} />
            <StatCard label="Current Status" value="Confirmed" />
            <StatCard label="Venue" value="Grand Ballroom" />
            <StatCard label="Guests" value="240" />
          </section>

          <section className="grid gap-8 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Event Details</h2>

              <div className="mt-6 space-y-5">
                <InputField
                  label="Event Name"
                  defaultValue="Corporate Gala - TechVibe"
                />

                <InputField label="Client Name" defaultValue="TechVibe Pvt Ltd" />

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Event Type
                  </label>

                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Corporate Dinner</option>
                    <option>Wedding</option>
                    <option>Conference</option>
                    <option>Birthday Party</option>
                    <option>Product Launch</option>
                  </select>
                </div>

                <InputField label="Event Date" type="date" defaultValue="2024-10-24" />

                <div className="grid gap-4 md:grid-cols-2">
                  <InputField label="Start Time" type="time" defaultValue="18:00" />
                  <InputField label="End Time" type="time" defaultValue="23:00" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Venue & Payment</h2>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Venue
                  </label>

                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Grand Ballroom</option>
                    <option>Terrace Gardens</option>
                    <option>Conference Hall A</option>
                    <option>Rooftop Lounge</option>
                  </select>
                </div>

                <InputField label="Guest Count" type="number" defaultValue="240" />

                <InputField label="Venue Rental" defaultValue="Rs 4,500.00" />

                <InputField label="Food & Beverage" defaultValue="Rs 5,200.00" />

                <InputField label="Decoration Package" defaultValue="Rs 1,400.00" />

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Payment Status
                  </label>

                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Paid</option>
                    <option>Pending</option>
                    <option>Advance Paid</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm xl:col-span-2">
              <h2 className="text-2xl font-bold">Special Notes</h2>

              <textarea
                defaultValue="VIP seating required. Vegetarian meal option should be available for 30 guests."
                rows={5}
                className="mt-6 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              />

              <div className="mt-6 flex flex-wrap gap-4">
                <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                  Save Changes
                </button>

                <button
                  onClick={() => router.push("/events")}
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
