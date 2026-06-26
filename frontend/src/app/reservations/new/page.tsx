import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function NewReservationPage() {
  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "RECEPTIONIST"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
              Front Office Module
            </p>

            <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
              New Reservation
            </h1>

            <p className="mt-2 text-[#4d4635]">
              Create a new guest room reservation with stay dates, guest
              details, room selection, and billing setup.
            </p>
          </div>

          <form className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
            <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Reservation Details</h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Guest Name
                  </label>
                  <input
                    type="text"
                    placeholder="Mr. Alexander Thorne"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="guest@email.com"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+94 77 123 4567"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

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
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Room Type
                  </label>
                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Presidential Suite</option>
                    <option>Executive Suite</option>
                    <option>Junior Suite</option>
                    <option>Deluxe Room</option>
                    <option>Standard Room</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Room Number
                  </label>
                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Room 402</option>
                    <option>Room 403</option>
                    <option>Room 308</option>
                    <option>Room 215</option>
                    <option>Room 501</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Adults
                  </label>
                  <input
                    type="number"
                    defaultValue={2}
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Children
                  </label>
                  <input
                    type="number"
                    defaultValue={0}
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Reservation Status
                  </label>
                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Checked In</option>
                    <option>Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Payment Method
                  </label>
                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Cash</option>
                    <option>Card</option>
                    <option>Bank Transfer</option>
                    <option>Pay at Check-in</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-[#4d4635]">
                    Special Requests
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Airport pickup, extra bed, late check-in, meal preference..."
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>
              </div>
            </section>

            <aside className="space-y-8">
              <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">Billing Summary</h2>

                <div className="mt-6 space-y-4">
                  <SummaryRow label="Room Rate" value="Rs 450 / night" />
                  <SummaryRow label="Nights" value="2" />
                  <SummaryRow label="Tax & Service" value="Rs 90" />
                  <SummaryRow label="Estimated Total" value="Rs 990" highlight />
                </div>
              </section>

              <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">Reservation Options</h2>

                <div className="mt-6 space-y-4">
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
                    <input type="checkbox" className="mt-1 h-5 w-5" />
                    <div>
                      <p className="font-bold">Create guest profile</p>
                      <p className="text-sm text-[#4d4635]">
                        Save this guest into guest records.
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
                    <input type="checkbox" className="mt-1 h-5 w-5" />
                    <div>
                      <p className="font-bold">Create folio automatically</p>
                      <p className="text-sm text-[#4d4635]">
                        Create billing folio for this reservation.
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
                    <input type="checkbox" className="mt-1 h-5 w-5" />
                    <div>
                      <p className="font-bold">Send confirmation email</p>
                      <p className="text-sm text-[#4d4635]">
                        Send booking confirmation to guest email.
                      </p>
                    </div>
                  </label>
                </div>
              </section>

              <div className="flex gap-4">
                <a
                  href="/reservations"
                  className="flex-1 rounded-xl border border-[#735c00] px-6 py-4 text-center font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
                >
                  Cancel
                </a>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#735c00] px-6 py-4 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
                >
                  Save Reservation
                </button>
              </div>
            </aside>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function SummaryRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl p-4 ${
        highlight
          ? "bg-[#735c00] text-white"
          : "bg-[#f5f3ef] text-[#1b1c1a]"
      }`}
    >
      <span className="font-bold">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}