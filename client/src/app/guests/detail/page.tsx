"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ArrowLeft, Plus } from "lucide-react";

export default function GuestDetailsPage() {
  const searchParams = useSearchParams();
  const guestId = searchParams.get("id") || "";
  const router = useRouter();

  const { data: guest, isLoading: guestLoading } = useSWR<any>(
    guestId ? `/api/guests/${guestId}` : null
  );

  const { data: rawReservations } = useSWR<any>("/api/reservations?size=1000");
  const reservations: any[] = useMemo(() => {
    const list = Array.isArray(rawReservations)
      ? rawReservations
      : rawReservations?.content || [];
    if (!guestId) return [];
    return list.filter((r: any) => r.guestId === guestId || r.guestName === guest?.name);
  }, [rawReservations, guestId, guest]);

  const currentStay = useMemo(() => {
    return reservations.find(
      (r: any) => r.status === "CHECKED_IN" || r.status === "ACTIVE"
    ) || reservations[0];
  }, [reservations]);

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "RECEPTIONIST"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Guest Management
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Guest Details
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View guest profile, stay history, and contact details.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/guests")}
                className="flex items-center gap-2 rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
              >
                <ArrowLeft size={18} />
                Back to Guests
              </button>

              <button
                onClick={() => router.push(`/reservations`)}
                className="flex items-center gap-2 rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
              >
                <Plus size={18} />
                New Reservation
              </button>
            </div>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-3">
            <StatCard label="Guest ID" value={guestId || "—"} />
            <StatCard
              label="Total Stays"
              value={String(reservations.length)}
            />
            <StatCard
              label="Status"
              value={currentStay ? currentStay.status : "No Active Stay"}
            />
          </section>

          <section className="mb-8 grid gap-8 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Personal Information</h2>

              <div className="mt-6 space-y-4">
                <InfoRow label="Full Name" value={guest?.name || (guestLoading ? "Loading..." : "—")} />
                <InfoRow label="Email" value={guest?.email || "—"} />
                <InfoRow label="Phone" value={guest?.phone || "—"} />
                <InfoRow label="Nationality" value={guest?.nationality || "—"} />
                <InfoRow
                  label="ID / Passport"
                  value={guest?.idNumber ? `${guest?.idType || "ID"}: ${guest.idNumber}` : "—"}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Current Stay</h2>

              {currentStay ? (
                <div className="mt-6 space-y-4">
                  <InfoRow label="Room" value={`Room ${currentStay.roomId || "—"}`} />
                  <InfoRow label="Check In" value={currentStay.checkInDate || "—"} />
                  <InfoRow label="Check Out" value={currentStay.checkOutDate || "—"} />
                  <InfoRow label="Status" value={currentStay.status || "—"} />
                  <InfoRow
                    label="Total Amount"
                    value={`Rs ${Number(currentStay.totalAmount || 0).toLocaleString()}`}
                  />
                </div>
              ) : (
                <div className="flex h-48 flex-col items-center justify-center text-center text-[#4d4635]">
                  <p className="font-semibold">No active stay currently.</p>
                  <p className="mt-1 text-xs">Guest is not checked into any room.</p>
                </div>
              )}
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Stay History</h2>
              <p className="mt-1 text-sm text-[#4d4635]">
                Previous and current room stay records from the database.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Reservation ID</th>
                    <th className="px-6 py-4">Room</th>
                    <th className="px-6 py-4">Check In</th>
                    <th className="px-6 py-4">Check Out</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {reservations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-[#4d4635]">
                        No reservation or stay history found for this guest.
                      </td>
                    </tr>
                  ) : (
                    reservations.map((stay: any) => (
                      <tr key={stay.id} className="transition hover:bg-[#fbf9f5]">
                        <td className="px-6 py-5 font-bold">{stay.id}</td>
                        <td className="px-6 py-5">
                          <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#735c00]">
                            Room {stay.roomId || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-[#4d4635]">{stay.checkInDate}</td>
                        <td className="px-6 py-5 text-[#4d4635]">{stay.checkOutDate}</td>
                        <td className="px-6 py-5">
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                            {stay.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right font-bold text-[#735c00]">
                          Rs {Number(stay.totalAmount || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-widest text-[#4d4635]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-extrabold text-[#735c00]">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#f5f3ef] p-4">
      <p className="font-bold text-[#4d4635]">{label}</p>
      <p className="font-bold text-[#735c00]">{value}</p>
    </div>
  );
}
