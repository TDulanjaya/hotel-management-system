"use client";

import AppSidebar from "@/components/layout/AppSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const days = Array.from({ length: 31 }, (_, index) => index + 1);

const events = [
  {
    day: 12,
    title: "Tech Summit 2024",
    type: "gold",
  },
  {
    day: 15,
    title: "Anderson Wedding",
    type: "blue",
  },
  {
    day: 24,
    title: "BioMed Expo",
    type: "blue",
  },
];

const upcomingEvents = [
  {
    title: "Global Fintech Summit",
    status: "Confirmed",
    time: "Oct 24, 09:00",
    location: "Grand Ballroom",
    code: "GFIN-24",
    guests: "450+",
    accent: "gold",
  },
  {
    title: "Sterling-Holt Nuptials",
    status: "Active",
    time: "Ongoing",
    location: "Terrace Gardens",
    code: "SHWED24",
    guests: "120",
    accent: "blue",
  },
];

function getEventForDay(day: number) {
  return events.find((event) => event.day === day);
}

export default function EventsPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "events"]}>
      <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
        <AppSidebar />

        <main className="lg:ml-[280px]">
          <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#d9cfbd] bg-[#f8f5ef]/95 px-8 backdrop-blur-xl">
            <div className="flex flex-1 justify-start">
              <div className="flex w-full max-w-[470px] items-center gap-4 rounded-full bg-[#f2f0ec] px-6 py-4 shadow-sm">
                <span className="text-2xl">⌕</span>
                <input
                  type="text"
                  placeholder="Search events, organizers, or codes..."
                  className="w-full bg-transparent text-lg outline-none placeholder:text-[#8a8175]"
                />
              </div>
            </div>

            <div className="flex items-center gap-7">
              <button className="relative text-2xl transition hover:scale-110">
                ♧
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-600" />
              </button>

              <button className="text-2xl transition hover:scale-110">?</button>

              <div className="hidden h-9 w-px bg-[#d9cfbd] md:block" />

              <div className="hidden text-right xl:block">
                <p className="text-lg font-bold">Alex Rivera</p>
                <p className="text-xs font-bold uppercase tracking-wider text-[#806300]">
                  Senior Manager
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#101827] text-white shadow">
                ▣
              </div>
            </div>
          </header>

          <section className="px-8 py-10">
            <div className="event-fade mb-12 flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
              <div>
                <h1 className="text-5xl font-extrabold tracking-tight">
                  Event Operations
                </h1>
                <p className="mt-3 text-xl text-[#3f3b35]">
                  Manage high-profile gatherings and corporate retreats.
                </p>
              </div>

              <div className="flex flex-wrap gap-5">
                <button className="rounded-xl border border-[#807464] bg-white px-8 py-4 text-lg font-semibold transition hover:-translate-y-1 hover:bg-[#faf8f3] hover:shadow-lg">
                  ⇩ Export Ledger
                </button>

                <button className="rounded-xl bg-[#d8b328] px-9 py-4 text-lg font-bold text-[#4c3a00] transition hover:-translate-y-1 hover:bg-[#f2c426] hover:shadow-xl">
                  ⊕ Create Event
                </button>
              </div>
            </div>

            <div className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
              <section className="event-fade delay-100 overflow-hidden rounded-2xl border border-[#d9cfbd] bg-white shadow-sm">
                <div className="flex flex-col justify-between gap-5 border-b border-[#d9cfbd] bg-[#f8f5ef] px-8 py-8 xl:flex-row xl:items-center">
                  <div className="flex items-center gap-5">
                    <h2 className="text-3xl font-bold">October 2024</h2>

                    <div className="flex overflow-hidden rounded-xl bg-[#ebe8e2]">
                      <button className="px-5 py-4 text-2xl transition hover:bg-white">
                        ‹
                      </button>
                      <button className="px-5 py-4 text-2xl transition hover:bg-white">
                        ›
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {["Month", "Week", "Day"].map((view, index) => (
                      <button
                        key={view}
                        className={`rounded-xl px-7 py-3 text-lg transition ${
                          index === 0
                            ? "border border-[#cdbfaa] bg-white shadow-sm"
                            : "hover:bg-white"
                        }`}
                      >
                        {view}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-7 border-b border-[#d9cfbd] bg-[#faf8f3]">
                  {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
                    (day) => (
                      <div
                        key={day}
                        className="border-r border-[#d9cfbd] px-5 py-4 text-center text-sm font-bold text-[#57534e]"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                <div className="grid grid-cols-7">
                  {days.map((day) => {
                    const event = getEventForDay(day);
                    const selected = day === 18;

                    return (
                      <div
                        key={day}
                        className="event-calendar-cell min-h-[132px] border-r border-t border-[#d9cfbd] bg-white p-3 transition hover:bg-[#fbf7ed]"
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                            selected
                              ? "bg-[#806300] text-white"
                              : "text-[#3f3b35]"
                          }`}
                        >
                          {day}
                        </div>

                        {event && (
                          <div
                            className={`event-chip mt-5 max-w-[90px] rounded-md border-l-4 p-3 text-xs font-bold ${
                              event.type === "gold"
                                ? "border-l-[#806300] bg-[#f5eed9] text-[#806300]"
                                : "border-l-[#3d4b61] bg-[#f1f4fb] text-[#3d4b61]"
                            }`}
                          >
                            {event.title}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              <aside className="space-y-8">
                <section className="event-fade delay-150 rounded-2xl border border-[#d9cfbd] bg-white p-7 shadow-sm">
                  <div className="mb-7 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Occupancy Impact</h2>
                    <span className="text-2xl text-[#806300]">▣</span>
                  </div>

                  <div className="mb-5 flex items-end gap-2">
                    <p className="text-lg">Room Block Commits</p>
                    <strong className="text-2xl">1,240</strong>
                    <span className="mb-1 text-[#57534e]">/ 1,500</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-[#ebe8e2]">
                    <div className="event-progress h-full rounded-full bg-[#806300]" />
                  </div>

                  <p className="mt-5 font-medium text-[#3f3b35]">
                    +12% from last month&apos;s forecast
                  </p>
                </section>

                <section className="event-fade delay-200 rounded-2xl border border-[#d9cfbd] bg-white p-7 shadow-sm">
                  <div className="mb-7 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Upcoming Events</h2>
                    <button className="font-bold text-[#806300]">
                      View All
                    </button>
                  </div>

                  <div className="space-y-6">
                    {upcomingEvents.map((event) => (
                      <article
                        key={event.code}
                        className={`event-upcoming-card rounded-2xl border-l-4 bg-[#f2f0ec] p-5 shadow-sm transition hover:-translate-y-2 hover:shadow-xl ${
                          event.accent === "gold"
                            ? "border-l-[#806300]"
                            : "border-l-[#3d4b61]"
                        }`}
                      >
                        <div className="mb-5 flex items-start justify-between">
                          <span className="rounded-md bg-[#ebe8e2] px-3 py-2 text-xs font-extrabold uppercase tracking-wider text-[#806300]">
                            {event.status}
                          </span>

                          <p className="text-[#3f3b35]">{event.time}</p>
                        </div>

                        <h3 className="text-xl font-extrabold">
                          {event.title}
                        </h3>

                        <p className="mt-2 text-[#57534e]">
                          {event.location}
                        </p>

                        <div className="mt-5 flex items-center justify-between text-sm font-bold text-[#3f3b35]">
                          <span>{event.code}</span>
                          <span>{event.guests} guests</span>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </aside>
            </div>

            <div className="mt-8 grid gap-8 border-t border-[#d9cfbd] bg-[#f1eee7] px-8 py-6 xl:grid-cols-[1.6fr_0.85fr]">
              <section className="kitchen-fade delay-200 rounded-2xl border border-[#d9cfbd] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold text-red-600">
                      ⚠ SHORTAGE WARNINGS
                    </h3>
                    <p className="text-sm text-[#57534e]">
                      Supply levels critical for following items:
                    </p>
                  </div>

                  <div className="grid flex-1 gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-extrabold text-red-700">
                          Fresh <br /> Mint
                        </p>
                        <span className="rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
                          2/100g
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-extrabold text-red-700">
                          A5 Wagyu <br /> Patty
                        </p>
                        <span className="rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
                          4/50
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="kitchen-fade delay-250 rounded-2xl border border-[#d9cfbd] bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold uppercase text-[#806300]">
                      ▣ Event Prep
                    </h3>
                    <p className="mt-3 text-sm">Wedding Dinner (80pax)</p>
                  </div>

                  <strong>T-Minus 2h</strong>
                </div>

                <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#ebe8e2]">
                  <div className="kitchen-event-progress h-full rounded-full bg-[#d8b328]" />
                </div>
              </section>
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}