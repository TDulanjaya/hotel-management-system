"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ArrowLeft, Calendar, DollarSign, Users, Building2, Receipt } from "lucide-react";

export default function EventLedgerPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id") || "";
  const router = useRouter();

  const { data: rawEvents, isLoading } = useSWR<any[]>("/api/events");
  const events = useMemo(() => (Array.isArray(rawEvents) ? rawEvents : []), [rawEvents]);

  const currentEvent = useMemo(() => {
    if (eventId) {
      return events.find((e) => e.id === eventId) || null;
    }
    return events[0] || null;
  }, [events, eventId]);

  const billingItems = useMemo(() => {
    if (!currentEvent) return [];
    const items = [];

    if (currentEvent.venuePrice || currentEvent.venueName) {
      items.push({
        description: `Venue Rental: ${currentEvent.venueName || "Assigned Hall"}`,
        date: currentEvent.eventDate || "Event Date",
        category: "Venue Rental",
        amount: `Rs ${Number(currentEvent.venuePrice || 0).toLocaleString()}`,
        style: "bg-blue-100 text-blue-800",
      });
    }

    if (Array.isArray(currentEvent.packages) && currentEvent.packages.length > 0) {
      currentEvent.packages.forEach((pkg: any) => {
        items.push({
          description: `Package: ${pkg.packageName || pkg.name || "Event Package"}`,
          date: currentEvent.eventDate || "Event Date",
          category: "Package / Catering",
          amount: `Rs ${Number(pkg.price || pkg.totalPrice || 0).toLocaleString()}`,
          style: "bg-orange-100 text-orange-800",
        });
      });
    }

    if (items.length === 0 && currentEvent.grandTotal) {
      items.push({
        description: `Event Booking Total: ${currentEvent.eventName || "Event"}`,
        date: currentEvent.eventDate || "Event Date",
        category: "Event Total",
        amount: `Rs ${Number(currentEvent.grandTotal || 0).toLocaleString()}`,
        style: "bg-green-100 text-green-800",
      });
    }

    return items;
  }, [currentEvent]);

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "EVENTS"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="min-h-screen px-8 py-10 lg:ml-[280px]">
          <header className="mb-10 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-[#4d4635]">
                <Link href="/events" className="hover:underline">Events Control</Link>
                <span>›</span>
                <span className="font-bold text-[#735c00]">Master Ledger</span>
              </div>

              <h1 className="text-4xl font-extrabold text-[#1b1c1a]">
                {currentEvent?.eventName || (isLoading ? "Loading Event..." : "Event Master Ledger")}
              </h1>

              <div className="mt-4 flex flex-wrap gap-3">
                <span className="rounded-full border border-[#d4af37]/40 bg-[#d4af37]/20 px-4 py-2 text-sm font-bold text-[#735c00]">
                  TYPE: {currentEvent?.eventType || "GENERAL"}
                </span>

                <span className="rounded-full border border-[#dae2fd] bg-[#dae2fd]/50 px-4 py-2 text-sm font-bold text-[#565e74]">
                  STATUS: {currentEvent?.status || "CONFIRMED"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/events"
                className="flex items-center gap-2 rounded-xl border-2 border-[#565e74] px-6 py-3 font-bold text-[#565e74] transition hover:bg-[#565e74]/5"
              >
                <ArrowLeft size={18} />
                Back to Events
              </Link>
            </div>
          </header>

          {!currentEvent && !isLoading ? (
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-12 text-center">
              <Receipt size={48} className="mx-auto mb-3 text-[#735c00]/40" />
              <h2 className="text-2xl font-bold">No Event Selected</h2>
              <p className="mt-1 text-sm text-[#4d4635]">
                Please navigate to the Events page and select an event to view its master ledger.
              </p>
              <Link
                href="/events"
                className="mt-6 inline-block rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#8d6b00]"
              >
                Go to Events
              </Link>
            </div>
          ) : (
            <section className="grid grid-cols-12 gap-6">
              <section className="relative col-span-12 overflow-hidden rounded-xl border border-[#d0c5af] bg-white shadow-sm lg:col-span-4">
                <div className="absolute left-0 top-0 h-full w-1 bg-[#d4af37]" />

                <div className="border-b border-[#d0c5af]/50 p-6">
                  <h2 className="text-xl font-bold">Organizer Information</h2>
                </div>

                <div className="space-y-4 p-6">
                  <InfoRow label="Primary Contact" value={currentEvent?.organizerName || "—"} />
                  <InfoRow label="Contact Phone" value={currentEvent?.organizerPhone || "—"} />
                  <InfoRow label="Billing Email" value={currentEvent?.organizerEmail || "—"} />
                  <InfoRow label="Event Date" value={currentEvent?.eventDate || "—"} />
                  <InfoRow label="Expected Guests" value={currentEvent?.expectedGuests ? `${currentEvent.expectedGuests} Guests` : "—"} />
                  <InfoRow label="Assigned Venue" value={currentEvent?.venueName || "—"} />
                </div>
              </section>

              <section className="col-span-12 rounded-xl border border-[#d0c5af] bg-white p-6 shadow-sm lg:col-span-8">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold">Billing Breakdown</h2>
                  <span className="text-sm font-bold text-[#735c00]">
                    Total: Rs {Number(currentEvent?.grandTotal || 0).toLocaleString()}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                        <th className="px-4 py-3">Item Description</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#d0c5af]">
                      {billingItems.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-[#4d4635]">
                            No billing lines recorded for this event.
                          </td>
                        </tr>
                      ) : (
                        billingItems.map((item: any, idx: number) => (
                          <tr key={idx} className="transition hover:bg-[#fbf9f5]">
                            <td className="px-4 py-4 font-bold text-[#1b1c1a]">{item.description}</td>
                            <td className="px-4 py-4 text-xs font-semibold text-[#4d4635]">{item.category}</td>
                            <td className="px-4 py-4 text-sm text-[#4d4635]">{item.date}</td>
                            <td className="px-4 py-4 text-right font-bold text-[#735c00]">{item.amount}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </section>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#f5f3ef] p-3 text-sm">
      <span className="font-semibold text-[#4d4635]">{label}</span>
      <span className="font-bold text-[#1b1c1a]">{value}</span>
    </div>
  );
}
