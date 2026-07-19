"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getParkingBookings, deleteParkingBooking as apiDeleteParkingBooking } from "@/lib/api/parkingApi";
import { getUser, AuthUser } from "@/utils/auth";

function getStatusClass(status: string) {
  if (status === "Completed" || status === "CHECKED_OUT") {
    return "bg-green-100 text-green-700";
  }
  if (status === "Active" || status === "CHECKED_IN" || status === "Occupied") {
    return "bg-blue-100 text-blue-700";
  }
  return "bg-slate-100 text-slate-700";
}

export default function ParkingRecordsPage() {
  const [parkingRecords, setParkingRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<AuthUser | null>(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getParkingBookings();
      setParkingRecords(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load parking records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUser(getUser());
    fetchRecords();
  }, []);

  const deleteRecord = async (id: string) => {
    if (!confirm("Are you sure you want to delete this parking record?")) return;
    try {
      await apiDeleteParkingBooking(id);
      setParkingRecords((prev) => prev.filter((p) => p.id !== id));
      alert("Parking record deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to delete parking record.");
    }
  };

  const activeRecords = parkingRecords.filter(p => p.status === "CHECKED_IN" || p.status === "Active" || p.status === "Occupied").length;
  const completedToday = parkingRecords.filter(p => p.status === "CHECKED_OUT" || p.status === "Completed").length; // simplified logic
  const todayIncome = parkingRecords.reduce((total, p) => total + (Number(p.amount) || 0), 0);

  const recordStats = [
    {
      label: "Total Records",
      value: String(parkingRecords.length),
    },
    {
      label: "Active Parking",
      value: String(activeRecords),
    },
    {
      label: "Completed",
      value: String(completedToday),
    },
    {
      label: "Total Income",
      value: `Rs ${todayIncome.toLocaleString()}`,
    },
  ];

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
                Parking Management
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Parking Records
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View parking history, active vehicles, parking services, payment
                records, and checkout status.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/parking"
                className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
              >
                Back to Parking
              </Link>
            </div>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            {recordStats.map((item) => (
              <StatCard key={item.label} label={item.label} value={item.value} />
            ))}
          </section>

          <section className="mb-8 rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-4">
              <input
                type="text"
                placeholder="Search vehicle or guest..."
                className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              />

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>All Services</option>
                <option>Hotel Guest</option>
                <option>Walk-in</option>
                <option>Event Guest</option>
                <option>Valet</option>
              </select>

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>All Status</option>
                <option>Active</option>
                <option>Completed</option>
              </select>

              <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                Filter
              </button>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Parking Record List</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Active and completed parking records.
              </p>
            </div>

            {loading ? (
              <div className="p-10 text-center">
                <p className="text-lg font-bold text-[#735c00]">Loading parking records...</p>
              </div>
            ) : error ? (
              <div className="p-10 text-center">
                <p className="text-lg font-bold text-red-600">{error}</p>
                <button onClick={fetchRecords} className="mt-4 rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white">Try Again</button>
              </div>
            ) : parkingRecords.length === 0 ? (
              <div className="p-10 text-center">
                <h3 className="text-xl font-bold text-[#735c00]">No parking slots found</h3>
                <p className="mt-2 text-[#4d4635]">There are no parking records available.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1150px] text-left">
                  <thead>
                    <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                      <th className="px-6 py-4">Record ID</th>
                      <th className="px-6 py-4">Vehicle No</th>
                      <th className="px-6 py-4">Vehicle</th>
                      <th className="px-6 py-4">Guest</th>
                      <th className="px-6 py-4">Slot</th>
                      <th className="px-6 py-4">Service</th>
                      <th className="px-6 py-4">Check In</th>
                      <th className="px-6 py-4">Check Out</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#d0c5af]">
                    {parkingRecords.map((record) => (
                      <tr key={record.id} className="transition hover:bg-[#fbf9f5]">
                        <td className="px-6 py-5 font-bold">{record.id?.substring(0, 8)}</td>

                        <td className="px-6 py-5 font-semibold">
                          {record.vehicleNumber || "-"}
                        </td>

                        <td className="px-6 py-5 text-[#4d4635]">
                          {record.vehicleModel || "-"}
                        </td>

                        <td className="px-6 py-5">{record.guestName || record.driverName || "-"}</td>

                        <td className="px-6 py-5">
                          <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#735c00]">
                            {record.slotNumber || "-"}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-[#4d4635]">
                          {record.serviceType || "-"}
                        </td>

                        <td className="px-6 py-5">{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}</td>

                        <td className="px-6 py-5">{record.expectedCheckOutTime ? new Date(record.expectedCheckOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}</td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                              record.status || ""
                            )}`}
                          >
                            {record.status}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-right font-bold text-[#735c00]">
                          Rs {record.amount || 0}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-3">
                            {canEdit && (
                              <Link
                                href={`/parking/edit?id=${record.id}`}
                                className="rounded-lg border border-[#735c00] px-4 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
                              >
                                Edit
                              </Link>
                            )}

                            {canDelete && (
                              <button
                                onClick={() => deleteRecord(record.id)}
                                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50"
                              >
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

      <p className="mt-2 text-3xl font-extrabold text-[#735c00]">{value}</p>
    </div>
  );
}
