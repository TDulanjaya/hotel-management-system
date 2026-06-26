"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getUser, AuthUser } from "@/utils/auth";
import { getParkingBookings, deleteParkingBooking as apiDeleteParkingBooking } from "@/lib/api/parkingApi";

function getStatusClass(status: string) {
  if (status === "Available" || status === "AVAILABLE") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Occupied" || status === "OCCUPIED" || status === "CHECKED_IN") {
    return "bg-yellow-100 text-yellow-700";
  }

  if (status === "CHECKED_OUT") {
    return "bg-slate-100 text-slate-700";
  }

  return "bg-blue-100 text-blue-700";
}

export default function ParkingPage() {
  const [parkingSlots, setParkingSlots] = useState<any[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getUser());
    async function loadParking() {
      try {
        const data = await getParkingBookings();
        setParkingSlots(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadParking();
  }, []);

  const deleteParking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this parking record?")) return;
    try {
      await apiDeleteParkingBooking(id);
      setParkingSlots(prev => prev.filter(p => p.id !== id));
      alert("Parking record deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to delete parking record.");
    }
  };

  const canEdit = user?.role === "OWNER" || user?.role === "MANAGER" || user?.role === "PARKING";
  const canDelete = user?.role === "OWNER" || user?.role === "MANAGER";

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "PARKING"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Parking Module
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Parking Management
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Manage parking slots, vehicles, guest parking, and parking
                charges.
              </p>
            </div>

            <Link href="/parking/new" className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
              + Add Vehicle
            </Link>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard label="Total Records" value={String(parkingSlots.length)} />
            <StatCard label="Checked In" value={String(parkingSlots.filter(p => p.status === "CHECKED_IN" || p.status === "Occupied").length)} />
            <StatCard label="Checked Out" value={String(parkingSlots.filter(p => p.status === "CHECKED_OUT").length)} />
            <StatCard label="Reserved" value={String(parkingSlots.filter(p => p.status === "Reserved" || p.status === "RESERVED").length)} />
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Parking Slot Records</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Track guest vehicles and parking slot availability.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Parking ID</th>
                    <th className="px-6 py-4">Slot</th>
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Plate No</th>
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Room</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Fee</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {parkingSlots.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-10 text-center text-[#4d4635]">
                        <p className="text-lg font-bold">No parking records found</p>
                      </td>
                    </tr>
                  ) : (
                    parkingSlots.map((parking) => (
                      <tr
                        key={parking.id}
                        className="transition hover:bg-[#fbf9f5]"
                      >
                        <td className="px-6 py-5 font-bold">{parking.id?.substring(0, 8) || "-"}</td>
  
                        <td className="px-6 py-5 font-semibold">
                          {parking.slotNumber || "-"}
                        </td>
  
                        <td className="px-6 py-5 text-[#4d4635]">
                          {parking.vehicleModel || "-"}
                        </td>
  
                        <td className="px-6 py-5">{parking.vehicleNumber || "-"}</td>
  
                        <td className="px-6 py-5 text-[#4d4635]">
                          {parking.guestName || parking.driverName || "-"}
                        </td>
  
                        <td className="px-6 py-5">{parking.roomNumber || "-"}</td>
  
                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                              parking.status || ""
                            )}`}
                          >
                            {parking.status}
                          </span>
                        </td>
  
                        <td className="px-6 py-5 text-right font-bold">
                          Rs {parking.amount || 0}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-3">
                            {canEdit && (
                              <Link
                                href={`/parking/${parking.id}/edit`}
                                className="rounded-lg border border-[#735c00] px-4 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
                              >
                                Edit
                              </Link>
                            )}

                            {canDelete && (
                              <button
                                onClick={() => deleteParking(parking.id)}
                                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50"
                              >
                                Delete
                              </button>
                            )}
                          </div>
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

      <p className="mt-2 text-4xl font-extrabold text-[#735c00]">{value}</p>
    </div>
  );
}