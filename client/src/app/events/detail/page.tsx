"use client";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { getEventById } from "@/lib/api/eventApi";
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
  email: string;
  kitchenNote: string;
  specialNote: string;
  status: string;
  selectedVenue: {
    id: string;
    name: string;
    type: string;
    capacity: number;
    size: string;
    price: number;
    image: string;
    tags: string[];
  };
  selectedPackages: {
    id: string;
    name: string;
    description: string;
    priceType: "perPerson" | "fixed";
    price: number;
  }[];
  venueTotal: number;
  packageTotal: number;
  serviceCharge: number;
  grandTotal: number;
  createdAt: string;
};

export default function EventDetailsPage() {
  const searchParams = useSearchParams();
  const rawId = searchParams.get("id");
  const id = rawId as string;

  const params = useParams();
  const eventId = id as string;

  const { data: event } = useSWR<SavedEvent>(eventId ? `/api/events/${eventId}` : null, () => getEventById(eventId));

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "EVENTS"]}>
      <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
        <AppSidebar />

        <main className="px-4 py-6 pt-16 sm:px-8 sm:py-10 lg:pt-10 lg:ml-[280px]">
          {!event ? (
            <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 sm:p-10 text-center shadow-sm">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#735c00]">
                Event not found
              </h1>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-[#4d4635]">
                This event may have been deleted or not saved correctly.
              </p>

              <Link
                href="/events/list"
                className="mt-6 inline-block rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
              >
                Back to Event List
              </Link>
            </section>
          ) : (
            <>
              <div className="mb-6 sm:mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-[#806300]">
                    Event Details
                  </p>

                  <h1 className="mt-1 sm:mt-3 text-2xl sm:text-4xl font-bold text-[#735c00]">
                    {event.eventName}
                  </h1>

                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#4d4635]">
                    {event.eventType} - {event.selectedVenue.name}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 w-full sm:w-auto">
                  <Link
                    href="/events/list"
                    className="w-full sm:w-auto rounded-xl border border-[#806300] bg-white px-5 py-3 text-center text-sm sm:text-base font-bold text-[#806300] transition hover:bg-[#faf8f3]"
                  >
                    Back to List
                  </Link>

                  <Link
                    href="/events/new"
                    className="w-full sm:w-auto rounded-xl bg-[#735c00] px-5 py-3 text-center text-sm sm:text-base font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
                  >
                    + New Event
                  </Link>
                </div>
              </div>

              <div className="grid gap-6 sm:gap-8 xl:grid-cols-[1.35fr_0.65fr]">
                <section className="space-y-6 sm:space-y-8">
                  <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
                    <Image
                      src={event.selectedVenue.image}
                      alt={event.selectedVenue.name}
                      width={800}
                      height={400}
                      className="h-48 sm:h-72 w-full object-cover"
                      unoptimized
                    />

                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col justify-between gap-3 sm:gap-4 sm:flex-row sm:items-start">
                        <div>
                          <h2 className="text-2xl sm:text-3xl font-bold">
                            {event.selectedVenue.name}
                          </h2>
                          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#4d4635]">
                            {event.selectedVenue.type} -{" "}
                            {event.selectedVenue.size} - Max{" "}
                            {event.selectedVenue.capacity} guests
                          </p>
                        </div>

                        <span className="self-start rounded-full bg-[#f5eed9] px-3.5 py-1.5 text-xs sm:text-sm font-bold text-[#735c00]">
                          {event.status}
                        </span>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {event.selectedVenue.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-[#eee9dd] px-3 py-2 text-xs text-[#4d4635]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </section>

                  <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                    <h2 className="mb-6 text-2xl font-bold">
                      Event Information
                    </h2>

                    <div className="grid gap-5 md:grid-cols-2">
                      <InfoCard label="Event ID" value={event.id} />
                      <InfoCard label="Event Type" value={event.eventType} />
                      <InfoCard
                        label="Guest Count"
                        value={`${event.guestCount} guests`}
                      />
                      <InfoCard
                        label="Date / Time"
                        value={`${event.primaryDate} - ${event.startTime}`}
                      />
                      <InfoCard
                        label="Organizer"
                        value={event.organizerName}
                      />
                      <InfoCard label="Phone" value={event.phone} />
                      <InfoCard label="Email" value={event.email || "-"} />
                      <InfoCard label="Status" value={event.status} />
                    </div>
                  </section>

                  <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                    <h2 className="mb-6 text-2xl font-bold">
                      Selected Menu & Packages
                    </h2>

                    <div className="space-y-4">
                      {event.selectedPackages.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4"
                        >
                          <div>
                            <p className="font-bold">{item.name}</p>
                            <p className="text-sm text-[#4d4635]">
                              {item.description}
                            </p>
                          </div>

                          <p className="font-bold text-[#735c00]">
                            {item.priceType === "perPerson"
                              ? `$${item.price}/pp`
                              : `$${item.price.toLocaleString()}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                    <h2 className="mb-6 text-2xl font-bold">
                      Kitchen & Special Notes
                    </h2>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
                        <p className="text-sm font-bold text-[#735c00]">
                          Kitchen Note
                        </p>
                        <p className="mt-2 text-[#4d4635]">
                          {event.kitchenNote || "No kitchen note added."}
                        </p>
                      </div>

                      <div className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
                        <p className="text-sm font-bold text-[#735c00]">
                          Special Note
                        </p>
                        <p className="mt-2 text-[#4d4635]">
                          {event.specialNote || "No special note added."}
                        </p>
                      </div>
                    </div>
                  </section>
                </section>

                <aside className="h-fit rounded-2xl bg-[#344056] p-6 text-white shadow-xl xl:sticky xl:top-8">
                  <h2 className="text-2xl font-bold text-[#d8b328]">
                    Booking Ledger
                  </h2>

                  <p className="mt-2 text-sm text-slate-300">
                    {event.selectedVenue.name} - {event.primaryDate}
                  </p>

                  <div className="mt-8 space-y-5 border-b border-white/10 pb-6">
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-300">Base Venue Rental</span>
                      <strong>${event.venueTotal.toLocaleString()}</strong>
                    </div>

                    {event.selectedPackages.map((item) => (
                      <div key={item.id} className="flex justify-between gap-4">
                        <span className="text-slate-300">{item.name}</span>
                        <strong>
                          $
                          {item.priceType === "perPerson"
                            ? (item.price * event.guestCount).toLocaleString()
                            : item.price.toLocaleString()}
                        </strong>
                      </div>
                    ))}

                    <div className="flex justify-between gap-4">
                      <span className="text-slate-300">
                        Service Charge 15%
                      </span>
                      <strong>${event.serviceCharge.toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-bold uppercase tracking-widest text-slate-400">
                      Estimated Total
                    </p>

                    <div className="mt-2 flex items-end justify-between gap-4">
                      <strong className="text-4xl text-[#d8b328]">
                        ${event.grandTotal.toLocaleString()}
                      </strong>
                      <span className="text-xs italic text-slate-300">
                        Tax Included
                      </span>
                    </div>
                  </div>

                  <button className="mt-8 w-full rounded-xl bg-[#d8b328] px-5 py-4 font-bold text-[#4c3a00] transition hover:bg-[#f2c426]">
                    Print Contract
                  </button>
                </aside>
              </div>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
      <p className="text-sm font-bold text-[#735c00]">{label}</p>
      <p className="mt-2 font-semibold text-[#1b1c1a]">{value}</p>
    </div>
  );
}
