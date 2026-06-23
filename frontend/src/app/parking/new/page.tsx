"use client";

import { useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/AppSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function NewParkingBookingPage() {
  const router = useRouter();

  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "parking"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Parking Management
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                New Parking Booking
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Add a new vehicle parking booking with guest, slot, service,
                and payment details.
              </p>
            </div>

            <button
              onClick={() => router.push("/parking")}
              className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
            >
              Back to Parking
            </button>
          </div>

          <section className="grid gap-8 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Vehicle Details</h2>

              <div className="mt-6 space-y-5">
                <InputField label="Vehicle Number" placeholder="Example: CAB-4521" />

                <InputField label="Vehicle Model" placeholder="Example: Honda Fit GP1" />

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Vehicle Type
                  </label>

                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Car</option>
                    <option>Van</option>
                    <option>SUV</option>
                    <option>Motorbike</option>
                    <option>Bus</option>
                  </select>
                </div>

                <InputField label="Driver Name" placeholder="Enter driver name" />

                <InputField label="Contact Number" placeholder="+94 77 123 4567" />
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Parking Details</h2>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Parking Zone
                  </label>

                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Zone A</option>
                    <option>Zone B</option>
                    <option>Zone C</option>
                    <option>VIP Parking</option>
                    <option>Event Parking</option>
                  </select>
                </div>

                <InputField label="Slot Number" placeholder="Example: A-12" />

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Service Type
                  </label>

                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Parking Only</option>
                    <option>Parking + Wash</option>
                    <option>Valet Service</option>
                    <option>Event Parking</option>
                  </select>
                </div>

                <InputField label="Check In Time" type="time" placeholder="" />

                <InputField label="Expected Check Out Time" type="time" placeholder="" />
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm xl:col-span-2">
              <h2 className="text-2xl font-bold">Guest & Payment</h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <InputField label="Guest Name" placeholder="Enter guest name" />

                <InputField label="Room Number" placeholder="Optional: Room 402" />

                <InputField label="Amount" placeholder="Example: $25.00" />

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Payment Status
                  </label>

                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Pending</option>
                    <option>Paid</option>
                    <option>Added to Folio</option>
                  </select>
                </div>
              </div>

              <textarea
                placeholder="Add parking notes..."
                rows={5}
                className="mt-6 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              />

              <div className="mt-6 flex flex-wrap gap-4">
                <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                  Save Parking Booking
                </button>

                <button
                  onClick={() => router.push("/parking")}
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

function InputField({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-[#4d4635]">{label}</label>

      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
      />
    </div>
  );
}