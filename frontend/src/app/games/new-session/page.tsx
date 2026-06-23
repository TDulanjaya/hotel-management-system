import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function NewGameSessionPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "game_staff"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
              Games Module
            </p>

            <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
              New Game Session
            </h1>

            <p className="mt-2 text-[#4d4635]">
              Start a new amenity rental or game session here.
            </p>
          </div>

          <form className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
            <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Session Details</h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Guest Name
                  </label>
                  <input
                    type="text"
                    placeholder="Alexander Van Der Bilt"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Room Number
                  </label>
                  <input
                    type="text"
                    placeholder="Suite 402"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Game / Amenity
                  </label>
                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Grand Billiards I</option>
                    <option>VIP Gaming Suite</option>
                    <option>Skyline Cinema</option>
                    <option>Table Tennis Center</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Session Type
                  </label>
                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Hourly Rental</option>
                    <option>Package Session</option>
                    <option>Complimentary</option>
                    <option>Event Booking</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Start Time
                  </label>
                  <input
                    type="time"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Duration
                  </label>
                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>30 Minutes</option>
                    <option>1 Hour</option>
                    <option>2 Hours</option>
                    <option>3 Hours</option>
                    <option>Full Day</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Hourly Rate
                  </label>
                  <input
                    type="number"
                    placeholder="25"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Payment Method
                  </label>
                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Charge to Room</option>
                    <option>Cash</option>
                    <option>Card</option>
                    <option>Complimentary</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-[#4d4635]">
                    Notes
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Special request, equipment condition, guest instruction..."
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>
              </div>
            </section>

            <aside className="space-y-8">
              <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">Equipment Checklist</h2>

                <div className="mt-6 space-y-4">
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
                    <input type="checkbox" className="mt-1 h-5 w-5" />
                    <div>
                      <p className="font-bold">Main equipment checked</p>
                      <p className="text-sm text-[#4d4635]">
                        Console, table, cinema, or game station is ready.
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
                    <input type="checkbox" className="mt-1 h-5 w-5" />
                    <div>
                      <p className="font-bold">Accessories issued</p>
                      <p className="text-sm text-[#4d4635]">
                        Controllers, cues, rackets, remote, or headset issued.
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
                    <input type="checkbox" className="mt-1 h-5 w-5" />
                    <div>
                      <p className="font-bold">Guest responsibility confirmed</p>
                      <p className="text-sm text-[#4d4635]">
                        Guest accepts damage or missing item charges.
                      </p>
                    </div>
                  </label>
                </div>
              </section>

              <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">Session Summary</h2>

                <div className="mt-6 space-y-4">
                  <SummaryRow label="Status" value="Ready to Start" />
                  <SummaryRow label="Billing" value="Charge to Room" />
                  <SummaryRow label="Audit" value="Required on End" />
                </div>
              </section>

              <div className="flex gap-4">
                <a
                  href="/games"
                  className="flex-1 rounded-xl border border-[#735c00] px-6 py-4 text-center font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
                >
                  Cancel
                </a>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#735c00] px-6 py-4 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
                >
                  Start Session
                </button>
              </div>
            </aside>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#f5f3ef] p-4">
      <span className="font-bold text-[#4d4635]">{label}</span>
      <span className="font-bold text-[#735c00]">{value}</span>
    </div>
  );
}