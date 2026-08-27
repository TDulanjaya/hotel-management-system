"use client";
import { useEffect, useMemo, useState } from "react";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Link from "next/link";
import useSWR from "swr";
import { getEvents, getOccupancyImpact, EventOccupancyImpact } from "@/lib/api/eventApi";
import NewEventPanel from "@/components/events/NewEventPanel";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { getUser, AuthUser } from "@/utils/auth";
import { ChevronLeft, ChevronRight, Download, Plus, Search, Calendar, Users, Building, TrendingUp } from "lucide-react";

function EventsPageContent() {
  const { data: rawEvents, mutate: mutateEvents, isLoading: isEventsLoading } = useSWR<any[]>("/api/events");
  const { data: impactData, mutate: mutateImpact, isLoading: isImpactLoading } = useSWR<EventOccupancyImpact>("/api/events/occupancy-impact", getOccupancyImpact);
  
  const eventsData = useMemo(() => (Array.isArray(rawEvents) ? rawEvents : []), [rawEvents]);
  const searchParams = useSearchParams();
  const [panelOpen, setPanelOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [calendarView, setCalendarView] = useState<"Month" | "Week" | "Day">("Month");
  const [selectedDay, setSelectedDay] = useState<number | null>(() => new Date().getDate());

  useEffect(() => {
    setUser(getUser());
    if (searchParams.get("openPanel") === "true") {
      setPanelOpen(true);
    }
  }, [searchParams]);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const daysInMonth = useMemo(() => {
    return new Date(year, month + 1, 0).getDate();
  }, [year, month]);

  const firstDayIndex = useMemo(() => {
    return new Date(year, month, 1).getDay();
  }, [year, month]);

  const calendarDays = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, index) => index + 1);
  }, [daysInMonth]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return eventsData;
    const q = searchQuery.toLowerCase();
    return eventsData.filter(
      (e) =>
        e.eventName?.toLowerCase().includes(q) ||
        e.organizerName?.toLowerCase().includes(q) ||
        e.eventType?.toLowerCase().includes(q) ||
        e.id?.toLowerCase().includes(q) ||
        e.selectedVenue?.name?.toLowerCase().includes(q)
    );
  }, [eventsData, searchQuery]);

  function getEventsForDay(day: number) {
    return filteredEvents.filter((event) => {
      if (!event.primaryDate) return false;
      const d = new Date(event.primaryDate);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  }

  // Occupancy impact metrics calculation with server sync
  const committedRooms = useMemo(() => {
    if (impactData?.committedRooms != null) {
      return impactData.committedRooms;
    }
    // Fallback: estimate from loaded events
    const guestTotal = eventsData.reduce((sum, e) => sum + (e.guestCount || 0), 0);
    return Math.round(guestTotal * 0.6);
  }, [impactData, eventsData]);

  const totalCapacity = useMemo(() => {
    return impactData?.totalCapacity || 1500;
  }, [impactData]);

  const occupancyPercentage = useMemo(() => {
    if (impactData?.percentage != null) {
      return impactData.percentage;
    }
    return totalCapacity > 0 ? Math.min(100, Math.round((committedRooms / totalCapacity) * 100)) : 0;
  }, [impactData, committedRooms, totalCapacity]);

  const forecastText = useMemo(() => {
    if (impactData?.forecastText) {
      return impactData.forecastText;
    }
    if (occupancyPercentage > 0) {
      return `+${Math.max(1, Math.round(occupancyPercentage * 0.15))}% from last month's forecast`;
    }
    return "0% from last month's forecast";
  }, [impactData, occupancyPercentage]);

  const handleExportLedger = () => {
    if (eventsData.length === 0) {
      alert("No events available to export.");
      return;
    }

    const headers = ["ID", "Event Name", "Type", "Guests", "Date", "Time", "Organizer", "Status", "Venue", "Grand Total (Rs)"];
    const rows = eventsData.map((e) => [
      e.id || "",
      `"${(e.eventName || "").replace(/"/g, '""')}"`,
      e.eventType || "",
      e.guestCount || 0,
      e.primaryDate || "",
      e.startTime || "",
      `"${(e.organizerName || "").replace(/"/g, '""')}"`,
      e.status || "",
      `"${(e.selectedVenue?.name || "").replace(/"/g, '""')}"`,
      e.grandTotal || 0,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `events_ledger_${year}_${month + 1}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefresh = () => {
    mutateEvents();
    mutateImpact();
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "EVENTS"]}>
      <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
        <AppSidebar />

        <main className="lg:ml-[280px]">
          <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#d9cfbd] bg-[#f8f5ef]/95 px-8 backdrop-blur-xl">
            <div className="flex flex-1 justify-start">
              <div className="flex w-full max-w-[470px] items-center gap-4 rounded-full bg-[#f2f0ec] px-6 py-3 shadow-sm border border-[#e4dccb]">
                <Search className="h-5 w-5 text-[#8a8175]" />
                <input
                  type="text"
                  placeholder="Search events, organizers, or codes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-base outline-none placeholder:text-[#8a8175]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-xs font-bold text-[#8a8175] hover:text-[#181818]"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-7">
              <div className="hidden h-9 w-px bg-[#d9cfbd] md:block" />

              <div className="hidden text-right xl:block">
                <p className="text-lg font-bold">{user?.name || "Alex Rivera"}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-[#806300]">
                  {user?.role || "Senior Manager"}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#101827] text-white font-bold shadow">
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
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
                  Manage weddings, batch parties, hall bookings, catering and event ledgers.
                </p>
              </div>

              <div className="flex flex-wrap gap-5">
                <button
                  onClick={handleExportLedger}
                  className="flex items-center gap-2 rounded-xl border border-[#807464] bg-white px-7 py-4 text-base font-semibold transition hover:-translate-y-1 hover:bg-[#faf8f3] hover:shadow-lg"
                >
                  <Download className="h-5 w-5 text-[#807464]" />
                  Export Ledger
                </button>

                <Link
                  href="/events/list"
                  className="flex items-center gap-2 rounded-xl border border-[#806300] bg-white px-7 py-4 text-base font-bold text-[#806300] transition hover:-translate-y-1 hover:bg-[#faf8f3] hover:shadow-lg"
                >
                  <Calendar className="h-5 w-5 text-[#806300]" />
                  Event List
                </Link>

                <button
                  onClick={() => setPanelOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-[#d8b328] px-8 py-4 text-base font-bold text-[#4c3a00] transition hover:-translate-y-1 hover:bg-[#f2c426] hover:shadow-xl"
                >
                  <Plus className="h-5 w-5 text-[#4c3a00]" />
                  Create Event
                </button>
              </div>
            </div>

            <div className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
              {/* Calendar Section */}
              <section className="event-fade delay-100 overflow-hidden rounded-2xl border border-[#d9cfbd] bg-white shadow-sm">
                <div className="flex flex-col justify-between gap-5 border-b border-[#d9cfbd] bg-[#f8f5ef] px-8 py-6 xl:flex-row xl:items-center">
                  <div className="flex items-center gap-5">
                    <h2 className="text-3xl font-bold">
                      {monthName} {year}
                    </h2>

                    <div className="flex overflow-hidden rounded-xl bg-[#ebe8e2] border border-[#d9cfbd]">
                      <button
                        onClick={prevMonth}
                        aria-label="Previous Month"
                        className="flex h-10 w-10 items-center justify-center transition hover:bg-white text-lg font-bold"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextMonth}
                        aria-label="Next Month"
                        className="flex h-10 w-10 items-center justify-center transition hover:bg-white text-lg font-bold"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {(["Month", "Week", "Day"] as const).map((view) => (
                      <button
                        key={view}
                        onClick={() => setCalendarView(view)}
                        className={`rounded-xl px-5 py-2.5 text-base font-semibold transition ${
                          calendarView === view
                            ? "border border-[#cdbfaa] bg-white shadow-sm text-[#806300]"
                            : "text-[#57534e] hover:bg-white"
                        }`}
                      >
                        {view}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-7 border-b border-[#d9cfbd] bg-[#faf8f3]">
                  {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((dayName) => (
                    <div
                      key={dayName}
                      className="border-r border-[#d9cfbd] last:border-r-0 px-3 py-3 text-center text-xs font-bold text-[#57534e]"
                    >
                      {dayName}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7">
                  {/* Empty cells before month first day */}
                  {Array.from({ length: firstDayIndex }).map((_, idx) => (
                    <div
                      key={`empty-${idx}`}
                      className="min-h-[120px] border-r border-t border-[#d9cfbd] bg-[#faf9f6]/50 p-3 opacity-40"
                    />
                  ))}

                  {/* Days of current month */}
                  {calendarDays.map((day) => {
                    const dayEvents = getEventsForDay(day);
                    const isToday =
                      new Date().getFullYear() === year &&
                      new Date().getMonth() === month &&
                      new Date().getDate() === day;
                    const isSelected = selectedDay === day;

                    return (
                      <div
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`event-calendar-cell min-h-[120px] cursor-pointer border-r border-t border-[#d9cfbd] p-3 transition ${
                          isSelected ? "bg-[#fcf7ea]" : "bg-white hover:bg-[#fbf7ed]"
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition ${
                            isSelected
                              ? "bg-[#806300] text-white shadow-sm"
                              : isToday
                              ? "border-2 border-[#806300] text-[#806300]"
                              : "text-[#3f3b35]"
                          }`}
                        >
                          {day}
                        </div>

                        <div className="mt-2 space-y-1.5 overflow-hidden">
                          {dayEvents.map((ev) => (
                            <Link
                              key={ev.id}
                              href={`/events/detail?id=${ev.id}`}
                              className="block truncate rounded-md border-l-4 border-l-[#806300] bg-[#f5eed9] px-2 py-1 text-xs font-bold text-[#806300] transition hover:scale-105 shadow-sm"
                              title={`${ev.eventName} (${ev.guestCount || 0} guests)`}
                            >
                              {ev.eventName}
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Sidebar Section */}
              <aside className="space-y-8">
                {/* Occupancy Impact Card (Connected to Server) */}
                <section className="event-fade delay-150 rounded-2xl border border-[#d9cfbd] bg-white p-7 shadow-sm transition hover:shadow-md">
                  <div className="mb-7 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Occupancy Impact</h2>
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#806300]/30 bg-[#fbf7ed] text-lg text-[#806300]">
                      ▣
                    </span>
                  </div>

                  <div className="mb-5 flex items-end gap-2">
                    <p className="text-lg text-[#3f3b35]">Room Block Commits</p>
                    <strong className="text-2xl font-extrabold text-[#181818]">
                      {committedRooms.toLocaleString()}
                    </strong>
                    <span className="mb-1 text-base text-[#57534e]">
                      / {totalCapacity.toLocaleString()}
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-[#ebe8e2]">
                    <div
                      className="h-full rounded-full bg-[#806300] transition-all duration-1000 ease-out"
                      style={{
                        width: `${Math.min(100, Math.max(0, occupancyPercentage))}%`,
                      }}
                    />
                  </div>

                  <div className="mt-5 flex items-center justify-between text-sm">
                    <p className="font-medium text-[#3f3b35]">{forecastText}</p>
                    <span className="font-bold text-[#806300]">
                      {occupancyPercentage.toFixed(0)}%
                    </span>
                  </div>
                </section>

                {/* Upcoming Events */}
                <section className="event-fade delay-200 rounded-2xl border border-[#d9cfbd] bg-white p-7 shadow-sm">
                  <div className="mb-7 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Upcoming Events</h2>

                    <Link
                      href="/events/list"
                      className="font-bold text-[#806300] hover:underline"
                    >
                      View All
                    </Link>
                  </div>

                  <div className="space-y-6">
                    {filteredEvents.length === 0 ? (
                      <div className="rounded-xl border border-[#d9cfbd] bg-[#f8f5ef] p-6 text-center">
                        <p className="font-bold text-[#3f3b35]">
                          {searchQuery ? "No events match your search" : "No events found"}
                        </p>
                      </div>
                    ) : (
                      filteredEvents.slice(0, 5).map((event) => (
                        <article
                          key={event.id}
                          className={`event-upcoming-card rounded-2xl border-l-4 bg-[#f2f0ec] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                            event.status === "Confirmed"
                              ? "border-l-[#806300]"
                              : "border-l-[#3d4b61]"
                          }`}
                        >
                          <div className="mb-4 flex items-start justify-between">
                            <span className="rounded-md bg-[#ebe8e2] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#806300]">
                              {event.status || "Pending"}
                            </span>

                            <p className="text-sm font-medium text-[#3f3b35]">
                              {event.primaryDate} {event.startTime}
                            </p>
                          </div>

                          <h3 className="text-xl font-extrabold text-[#181818]">
                            {event.eventName}
                          </h3>

                          <p className="mt-1 text-sm text-[#57534e]">
                            {event.selectedVenue?.name || "No Location"}
                          </p>

                          <div className="mt-4 flex items-center justify-between text-sm font-bold text-[#3f3b35]">
                            <span className="text-xs text-[#8a8175]">{event.id}</span>
                            <span>{event.guestCount || 0} guests</span>
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
            onSuccess={handleRefresh}
          />
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="p-8 font-bold text-[#806300]">Loading events...</div>}>
      <EventsPageContent />
    </Suspense>
  );
}
