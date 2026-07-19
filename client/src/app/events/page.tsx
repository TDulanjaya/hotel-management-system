"use client";
import { useEffect, useState } from "react";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Link from "next/link";

const days = Array.from({ length: 31 }, (_, index) => index + 1);



import { getEvents } from "@/lib/api/eventApi";
import NewEventPanel from "@/components/events/NewEventPanel";
import { useSearchParams } from "next/navigation";

import { Suspense } from "react";

function EventsPageContent() {
  const [eventsData, setEventsData] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const [panelOpen, setPanelOpen] = useState(false);

  const loadEvents = async () => {
    try {
      const data = await getEvents();
      setEventsData(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadEvents();
    if (searchParams.get("openPanel") === "true") {
      setPanelOpen(true);
    }
  }, [searchParams]);

  function getEventForDay(day: number) {
    return eventsData.find((event) => {
      if (!event.primaryDate) return false;
      return new Date(event.primaryDate).getDate() === day;
    });
  }
  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "EVENTS"]}>
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
                  Manage weddings, batch parties, hall bookings, catering and
                  event ledgers.
                </p>
              </div>

              <div className="flex flex-wrap gap-5">
                <button className="rounded-xl border border-[#807464] bg-white px-8 py-4 text-lg font-semibold transition hover:-translate-y-1 hover:bg-[#faf8f3] hover:shadow-lg">
                  ⇩ Export Ledger
                </button>

                <Link
                  href="/events/list"
                  className="rounded-xl border border-[#806300] bg-white px-8 py-4 text-lg font-bold text-[#806300] transition hover:-translate-y-1 hover:bg-[#faf8f3] hover:shadow-lg"
                >
                  ☷ Event List
                </Link>

                <button
                  onClick={() => setPanelOpen(true)}
                  className="rounded-xl bg-[#d8b328] px-9 py-4 text-lg font-bold text-[#4c3a00] transition hover:-translate-y-1 hover:bg-[#f2c426] hover:shadow-xl"
                >
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
                            className={`event-chip mt-5 max-w-[90px] rounded-md border-l-4 p-3 text-xs font-bold border-l-[#806300] bg-[#f5eed9] text-[#806300]`}
                          >
                            {event.eventName}
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

                    <Link
                      href="/events/list"
                      className="font-bold text-[#806300]"
                    >
                      View All
                    </Link>
                  </div>

                  <div className="space-y-6">
                    {eventsData.length === 0 ? (
                      <div className="rounded-xl border border-[#d9cfbd] bg-[#f8f5ef] p-6 text-center">
                        <p className="font-bold text-[#3f3b35]">No events found</p>
                      </div>
                    ) : (
                      eventsData.slice(0, 5).map((event) => (
                        <article
                          key={event.id}
                          className={`event-upcoming-card rounded-2xl border-l-4 bg-[#f2f0ec] p-5 shadow-sm transition hover:-translate-y-2 hover:shadow-xl ${
                            event.status === "Confirmed"
                              ? "border-l-[#806300]"
                              : "border-l-[#3d4b61]"
                          }`}
                        >
                          <div className="mb-5 flex items-start justify-between">
                            <span className="rounded-md bg-[#ebe8e2] px-3 py-2 text-xs font-extrabold uppercase tracking-wider text-[#806300]">
                              {event.status}
                            </span>
  
                            <p className="text-[#3f3b35]">{event.primaryDate} {event.startTime}</p>
                          </div>
  
                          <h3 className="text-xl font-extrabold">
                            {event.eventName}
                          </h3>
  
                          <p className="mt-2 text-[#57534e]">
                            {event.selectedVenue?.name || "No Location"}
                          </p>
  
                          <div className="mt-5 flex items-center justify-between text-sm font-bold text-[#3f3b35]">
                            <span>{event.id}</span>
                            <span>{event.guestCount} guests</span>
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </section>
              </aside>
            </div>
          </section>
          <NewEventPanel 
          open={panelOpen} 
          onClose={() => setPanelOpen(false)} 
          onSuccess={loadEvents} 
        />
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading events...</div>}>
      <EventsPageContent />
    </Suspense>
  );
}
