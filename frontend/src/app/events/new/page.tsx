import AppSidebar from "@/components/layout/AppSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function NewEventPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "events"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
              Events Module
            </p>

            <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
              Create New Event
            </h1>

            <p className="mt-2 text-[#4d4635]">
              Add a new wedding, conference, meeting, or hotel event booking.
            </p>
          </div>

          <form className="grid gap-8 xl:grid-cols-[1.4fr_0.8fr]">
            <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Event Details</h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-[#4d4635]">
                    Event Name
                  </label>
                  <input
                    type="text"
                    placeholder="Annual Global Tech Summit 2024"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Event Type
                  </label>
                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Conference</option>
                    <option>Wedding</option>
                    <option>Corporate Meeting</option>
                    <option>Birthday Party</option>
                    <option>Exhibition</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Venue
                  </label>
                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Grand Ballroom</option>
                    <option>Terrace Gardens</option>
                    <option>Conference Hall A</option>
                    <option>Rooftop Lounge</option>
                    <option>Banquet Hall</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
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
                    End Date
                  </label>
                  <input
                    type="date"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    End Time
                  </label>
                  <input
                    type="time"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Expected Guests
                  </label>
                  <input
                    type="number"
                    placeholder="450"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Event Status
                  </label>
                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Active</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-[#4d4635]">
                    Notes
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Special decoration, catering, audio/video, room blocks..."
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>
              </div>
            </section>

            <aside className="space-y-8">
              <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">Organizer Details</h2>

                <div className="mt-6 space-y-5">
                  <div>
                    <label className="text-sm font-bold text-[#4d4635]">
                      Organizer Name
                    </label>
                    <input
                      type="text"
                      placeholder="Ms. Helena Thorne"
                      className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[#4d4635]">
                      Company / Family
                    </label>
                    <input
                      type="text"
                      placeholder="Nova Dynamics Corp"
                      className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[#4d4635]">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="example@email.com"
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
                </div>
              </section>

              <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">Billing Setup</h2>

                <div className="mt-6 space-y-5">
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
                    <input type="checkbox" className="mt-1 h-5 w-5" />
                    <div>
                      <p className="font-bold">Create Master Ledger</p>
                      <p className="text-sm text-[#4d4635]">
                        Create master bill for event charges.
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
                    <input type="checkbox" className="mt-1 h-5 w-5" />
                    <div>
                      <p className="font-bold">Enable Split Billing</p>
                      <p className="text-sm text-[#4d4635]">
                        Separate room charges and individual guest charges.
                      </p>
                    </div>
                  </label>

                  <div>
                    <label className="text-sm font-bold text-[#4d4635]">
                      Deposit Amount
                    </label>
                    <input
                      type="number"
                      placeholder="45000"
                      className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                    />
                  </div>
                </div>
              </section>

              <div className="flex gap-4">
                <a
                  href="/events"
                  className="flex-1 rounded-xl border border-[#735c00] px-6 py-4 text-center font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
                >
                  Cancel
                </a>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#735c00] px-6 py-4 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
                >
                  Save Event
                </button>
              </div>
            </aside>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}