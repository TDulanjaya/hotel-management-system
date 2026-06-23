"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

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
  selectedVenue: {
    id: string;
    name: string;
    type: string;
    capacity: number;
    price: number;
    image: string;
  };
  selectedPackages: {
    id: string;
    name: string;
    priceType: "perPerson" | "fixed";
    price: number;
  }[];
  grandTotal: number;
};

function getStatusClass(status: string) {
  if (status === "Confirmed") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Active") {
    return "bg-blue-100 text-blue-700";
  }

  if (status === "Completed") {
    return "bg-slate-100 text-slate-700";
  }

  if (status === "Cancelled") {
    return "bg-red-100 text-red-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

export default function EventsListPage() {
  const [events, setEvents] = useState<SavedEvent[]>([]);

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("hotel_events") || "[]");
    setEvents(savedEvents);
  }, []);

  const deleteEvent = (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this event?");

    if (!confirmed) {
      return;
    }

    const updatedEvents = events.filter((event) => event.id !== id);
    setEvents(updatedEvents);
    localStorage.setItem("hotel_events", JSON.stringify(updatedEvents));
  };

  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "events"]}>
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
                View saved event bookings with selected venue photo, price,
                packages, and total ledger amount.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/venues"
                className="rounded-xl border border-[#806300] bg-white px-6 py-3 text-center font-bold text-[#806300] transition hover:bg-[#faf8f3]"
              >
                Manage Venues
              </Link>

              <Link
                href="/events/new"
                className="rounded-xl bg-[#735c00] px-6 py-3 text-center font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
              >
                + New Event
              </Link>
            </div>
          </div>

          {events.length === 0 ? (
            <section className="rounded-2xl border border-[#d0c5af] bg-white p-10 text-center shadow-sm">
              <h3 className="text-xl font-bold text-[#735c00]">
                No events found
              </h3>

              <p className="mt-2 text-[#4d4635]">
                Create an event first. The selected venue photo and price will
                appear here.
              </p>

              <Link
                href="/events/new"
                className="mt-6 inline-block rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
              >
                Create First Event
              </Link>
            </section>
          ) : (
            <section className="grid gap-6">
              {events.map((event) => (
                <article
                  key={event.id}
                  className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm"
                >
                  <div className="grid gap-0 xl:grid-cols-[320px_1fr]">
                    <img
                      src={event.selectedVenue?.image}
                      alt={event.selectedVenue?.name || event.eventName}
                      className="h-full min-h-[260px] w-full object-cover"
                    />

                    <div className="p-6">
                      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
                        <div>
                          <p className="text-sm font-bold uppercase tracking-wider text-[#806300]">
                            {event.id}
                          </p>

                          <h2 className="mt-2 text-3xl font-bold">
                            {event.eventName}
                          </h2>

                          <p className="mt-2 text-[#4d4635]">
                            {event.eventType} ·{" "}
                            {event.selectedVenue?.name || "No venue"}
                          </p>

                          <p className="mt-1 text-sm text-[#6d6251]">
                            {event.organizerName} · {event.phone}
                          </p>
                        </div>

                        <span
                          className={`w-fit rounded-full px-4 py-2 text-xs font-bold ${getStatusClass(
                            event.status
                          )}`}
                        >
                          {event.status}
                        </span>
                      </div>

                      <div className="mt-6 grid gap-4 md:grid-cols-4">
                        <div className="rounded-xl bg-[#f5f3ef] p-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-[#806300]">
                            Date
                          </p>
                          <p className="mt-2 font-bold">{event.primaryDate}</p>
                          <p className="text-sm text-[#4d4635]">
                            {event.startTime}
                          </p>
                        </div>

                        <div className="rounded-xl bg-[#f5f3ef] p-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-[#806300]">
                            Guests
                          </p>
                          <p className="mt-2 text-xl font-bold">
                            {event.guestCount}
                          </p>
                        </div>

                        <div className="rounded-xl bg-[#f5f3ef] p-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-[#806300]">
                            Venue Price
                          </p>
                          <p className="mt-2 text-xl font-bold">
                            $
                            {event.selectedVenue?.price?.toLocaleString() || 0}
                          </p>
                        </div>

                        <div className="rounded-xl bg-[#f5f3ef] p-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-[#806300]">
                            Total
                          </p>
                          <p className="mt-2 text-xl font-bold text-[#735c00]">
                            ${event.grandTotal?.toLocaleString() || 0}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <p className="text-sm font-bold text-[#735c00]">
                          Selected Packages
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {event.selectedPackages?.length > 0 ? (
                            event.selectedPackages.map((item) => (
                              <span
                                key={item.id}
                                className="rounded-md bg-[#eee9dd] px-3 py-2 text-xs text-[#4d4635]"
                              >
                                {item.name}
                              </span>
                            ))
                          ) : (
                            <span className="rounded-md bg-[#eee9dd] px-3 py-2 text-xs text-[#4d4635]">
                              No packages
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-[#eee5d4] pt-5">
                        <Link
                          href={`/events/${event.id}`}
                          className="rounded-lg border border-[#735c00] px-4 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
                        >
                          View
                        </Link>

                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}