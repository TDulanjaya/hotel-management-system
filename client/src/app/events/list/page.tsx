"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getUser, AuthUser } from "@/utils/auth";
import { getEvents, deleteEvent as apiDeleteEvent } from "@/lib/api/eventApi";
import NewEventPanel from "@/components/events/NewEventPanel";
import { useSearchParams } from "next/navigation";
import { CalendarPlus, Trash2, Pencil, CalendarDays } from "lucide-react";

type SavedEvent = {
  id: string;
  eventName: string;
  eventType: string;
  guestCount: number;
  primaryDate: string;
  startTime: string;
  organizerName: string;
  phone: string;
  status: string;
  selectedVenue?: {
    name: string;
    type: string;
    capacity: number;
    price: number;
  };
  selectedPackages?: {
    id: string;
    name: string;
    priceType: "perPerson" | "fixed";
    price: number;
  }[];
  grandTotal: number;
};

function getStatusClass(status: string) {
  if (status === "Confirmed") return "bg-green-100 text-green-700";
  if (status === "Active") return "bg-blue-100 text-blue-700";
  if (status === "Completed") return "bg-slate-100 text-slate-700";
  if (status === "Cancelled") return "bg-red-100 text-red-700";

  return "bg-yellow-100 text-yellow-700";
}

function EventsListPageContent() {
  const [events, setEvents] = useState<SavedEvent[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [currentRole, setCurrentRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const [panelOpen, setPanelOpen] = useState(false);

  const canEdit =
    currentRole === "OWNER" ||
    currentRole === "MANAGER" ||
    currentRole === "EVENTS";

  const canDelete =
    currentRole === "OWNER" ||
    currentRole === "MANAGER" ||
    currentRole === "EVENTS";

  const loadEvents = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const authUser = getUser();
    setUser(authUser);

    if (authUser?.role) {
      setCurrentRole(authUser.role);
    } else {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setCurrentRole(parsedUser.role || "");
        }
      } catch {
        setCurrentRole("");
      }
    }

    loadEvents();

    if (searchParams.get("openPanel") === "true") {
      setPanelOpen(true);
    }
  }, [searchParams]);

  const deleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await apiDeleteEvent(id);
      setEvents((prev) => prev.filter((event) => event.id !== id));
      alert("Event deleted successfully.");
    } catch (err: any) {
      alert(err.message || "Failed to delete event.");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "EVENTS"]}>
      <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#806300]">
                Events Module
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Event List
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View saved weddings, parties, hall bookings and event ledger
                totals.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/events"
                className="rounded-xl border border-[#806300] bg-white px-6 py-3 text-center font-bold text-[#806300] transition hover:bg-[#faf8f3]"
              >
                Events Dashboard
              </Link>

              {canEdit && (
                <button
                  onClick={() => setPanelOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-[#735c00] px-6 py-3 text-center font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
                >
                  <CalendarPlus size={18} />
                  New Event
                </button>
              )}
            </div>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard label="Total Events" value={String(events.length)} />
            <StatCard
              label="Active"
              value={String(events.filter((e) => e.status === "Active").length)}
            />
            <StatCard
              label="Confirmed"
              value={String(
                events.filter((e) => e.status === "Confirmed").length
              )}
            />
            <StatCard
              label="Total Value"
              value={`Rs ${events.reduce(
                (sum, e) => sum + Number(e.grandTotal || 0),
                0
              )}`}
            />
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">All Event Bookings</h2>
              <p className="mt-1 text-sm text-[#4d4635]">
                Manage created event records.
              </p>
            </div>

            {loading ? (
              <div className="flex h-64 items-center justify-center text-lg font-bold text-[#806300]">
                Loading events...
              </div>
            ) : error ? (
              <div className="p-6 font-bold text-red-600">{error}</div>
            ) : events.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center p-10 text-center">
                <CalendarDays size={44} className="mb-4 text-[#735c00]" />

                <h3 className="text-xl font-bold text-[#735c00]">
                  No events found
                </h3>

                <p className="mt-2 text-[#4d4635]">
                  Create a wedding, party or hall booking first.
                </p>

                {canEdit && (
                  <button
                    onClick={() => setPanelOpen(true)}
                    className="mt-6 rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
                  >
                    Create First Event
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1150px] text-left">
                  <thead>
                    <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                      <th className="px-6 py-4">Event ID</th>
                      <th className="px-6 py-4">Event</th>
                      <th className="px-6 py-4">Venue</th>
                      <th className="px-6 py-4">Date / Time</th>
                      <th className="px-6 py-4">Guests</th>
                      <th className="px-6 py-4">Packages</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#d0c5af]">
                    {events.map((event) => (
                      <tr key={event.id} className="transition hover:bg-[#fbf9f5]">
                        <td className="px-6 py-5 font-bold">
                          {event.id?.substring(0, 8) || "-"}
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-bold">{event.eventName || "-"}</p>
                          <p className="text-sm text-[#4d4635]">
                            {event.eventType || "-"}
                          </p>
                          <p className="mt-1 text-xs text-[#6d6251]">
                            {event.organizerName || "-"} · {event.phone || "-"}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-bold">
                            {event.selectedVenue?.name || "No venue"}
                          </p>
                          <p className="text-sm text-[#4d4635]">
                            {event.selectedVenue?.type || "-"} · Max{" "}
                            {event.selectedVenue?.capacity || 0}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-[#4d4635]">
                          <p>{event.primaryDate || "-"}</p>
                          <p className="text-xs">{event.startTime || "-"}</p>
                        </td>

                        <td className="px-6 py-5 font-bold">
                          {event.guestCount || 0}
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-bold">
                            {event.selectedPackages?.length || 0} selected
                          </p>

                          <p className="max-w-[260px] truncate text-sm text-[#4d4635]">
                            {event.selectedPackages
                              ?.map((item) => item.name)
                              .join(", ") || "No packages"}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-lg font-bold text-[#735c00]">
                          Rs {Number(event.grandTotal || 0).toLocaleString()}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                              event.status
                            )}`}
                          >
                            {event.status || "Active"}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-3">
                            {canEdit && (
                              <Link
                                href={`/events/edit?id=${event.id}`}
                                className="flex items-center gap-1 rounded-lg border border-[#735c00] px-4 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
                              >
                                <Pencil size={16} />
                                Edit
                              </Link>
                            )}

                            {canDelete && (
                              <button
                                onClick={() => deleteEvent(event.id)}
                                className="flex items-center gap-1 rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50"
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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

export default function EventsListPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading events list...</div>}>
      <EventsListPageContent />
    </Suspense>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-widest text-[#4d4635]">
        {label}
      </p>

      <p className="mt-2 text-3xl font-extrabold text-[#735c00]">{value}</p>
    </div>
  );
}