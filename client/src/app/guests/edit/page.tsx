"use client";
import { useSearchParams } from "next/navigation";


import { useParams, useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function EditGuestPage() {
  const searchParams = useSearchParams();
  const rawId = searchParams.get("id");
  const id = rawId as string;

  const router = useRouter();
  const params = useParams();
  const guestId = id as string;

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
                Edit Guest
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Update guest personal details, contact details, ID information,
                and guest preferences.
              </p>
            </div>

            <button
              onClick={() => router.push(`/guests/detail?id=${guestId}`)}
              className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
            >
              Back to Guest
            </button>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard label="Guest ID" value={guestId || "N/A"} />
            <StatCard label="Guest Type" value="VIP" />
            <StatCard label="Current Room" value="402" />
            <StatCard label="Status" value="Active" />
          </section>

          <section className="grid gap-8 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Personal Details</h2>

              <div className="mt-6 space-y-5">
                <InputField label="Full Name" defaultValue="Elena Rodriguez" />

                <InputField
                  label="Email"
                  type="email"
                  defaultValue="elena@example.com"
                />

                <InputField
                  label="Phone Number"
                  defaultValue="+94 77 123 4567"
                />

                <InputField label="Nationality" defaultValue="Spain" />

                <InputField label="Passport / ID No" defaultValue="P-88211990" />
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
                    <option>VIP</option>
                    <option>Regular</option>
                    <option>Corporate</option>
                    <option>Walk-in</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Preferred Room Type
                  </label>

                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Executive Suite</option>
                    <option>Deluxe Room</option>
                    <option>Standard Room</option>
                    <option>Presidential Suite</option>
                  </select>
                </div>

                <InputField label="Meal Preference" defaultValue="Vegetarian" />

                <InputField label="Emergency Contact" defaultValue="+94 71 222 3333" />

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Guest Status
                  </label>

                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Active</option>
                    <option>Checked Out</option>
                    <option>Blacklisted</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm xl:col-span-2">
              <h2 className="text-2xl font-bold">Guest Notes</h2>

              <textarea
                defaultValue="VIP guest. Prefers quiet rooms and late checkout. Vegetarian meal option requested."
                rows={5}
                className="mt-6 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              />

              <div className="mt-6 flex flex-wrap gap-4">
                <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                  Save Changes
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
