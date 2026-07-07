"use client";

import { useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function NewGuestPage() {
  const router = useRouter();

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "RECEPTIONIST"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Guest Management
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Add New Guest
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Register a new hotel guest with contact details, ID details,
                preferences, and notes.
              </p>
            </div>

            <button
              onClick={() => router.push("/guests")}
              className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
            >
              Back to Guests
            </button>
          </div>

          <section className="grid gap-8 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Personal Details</h2>

              <div className="mt-6 space-y-5">
                <InputField label="Full Name" placeholder="Enter guest name" />

                <InputField
                  label="Email"
                  type="email"
                  placeholder="guest@example.com"
                />

                <InputField
                  label="Phone Number"
                  placeholder="+94 77 123 4567"
                />

                <InputField label="Nationality" placeholder="Enter nationality" />

                <InputField
                  label="Passport / ID No"
                  placeholder="Enter passport or ID number"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Guest Preferences</h2>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Guest Type
                  </label>

                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Regular</option>
                    <option>VIP</option>
                    <option>Corporate</option>
                    <option>Walk-in</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Preferred Room Type
                  </label>

                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Standard Room</option>
                    <option>Deluxe Room</option>
                    <option>Executive Suite</option>
                    <option>Presidential Suite</option>
                  </select>
                </div>

                <InputField
                  label="Meal Preference"
                  placeholder="Regular / Vegetarian / Vegan"
                />

                <InputField
                  label="Emergency Contact"
                  placeholder="+94 71 222 3333"
                />

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Guest Status
                  </label>

                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm xl:col-span-2">
              <h2 className="text-2xl font-bold">Guest Notes</h2>

              <textarea
                placeholder="Add guest notes, special requests, or preferences..."
                rows={5}
                className="mt-6 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              />

              <div className="mt-6 flex flex-wrap gap-4">
                <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                  Save Guest
                </button>

                <button
                  onClick={() => router.push("/guests")}
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
