"use client";
import { AuthUser, getUser } from "@/utils/auth";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getStatusBadgeClass } from "@/lib/utils/statusStyles";
import {
  getParkingBookings,
  deleteParkingBooking as apiDeleteParkingBooking,
  createParkingBooking,
} from "@/lib/api/parkingApi";
import SlidePanel from "@/components/ui/SlidePanel";
import { Car } from "lucide-react";

export default function ParkingPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    setUser(getUser());
  }, []);

    const [currentRole, setCurrentRole] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [parkingSlots, setParkingSlots] = useState<any[]>([]);

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    vehicleNumber: "",
    vehicleModel: "",
    vehicleType: "Car",
    driverName: "",
    contactNumber: "",
    parkingZone: "A",
    slotNumber: "",
    serviceType: "Hotel Guest",
    checkInTime: "",
    expectedCheckOutTime: "",
    guestName: "",
    roomNumber: "",
    amount: 0,
    paymentStatus: "Pending",
    notes: "",
    status: "CHECKED_IN",
  });

  async function loadParking() {
    try {
      setPageLoading(true);
      const data = await getParkingBookings();
      setParkingSlots(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setParkingSlots([]);
    } finally {
      setPageLoading(false);
    }
  }

  useEffect(() => {
    loadParking();

    if (user?.role) {
      setCurrentRole(user.role);
      return;
    }

    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setCurrentRole(parsedUser.role || "");
      }
    } catch {
      setCurrentRole("");
    }
  }, [user]);

  const deleteParking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this parking record?")) return;

    try {
      await apiDeleteParkingBooking(id);
      setParkingSlots((prev) => prev.filter((p) => p.id !== id));
      alert("Parking record deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to delete parking record.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.vehicleNumber || !formData.vehicleModel || !formData.driverName || !formData.slotNumber) {
      setError("Vehicle number, vehicle model, driver name and slot number are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createParkingBooking({
        ...formData,
        amount: Number(formData.amount),
      });

      setPanelOpen(false);
      await loadParking();

      setFormData({
        vehicleNumber: "",
        vehicleModel: "",
        vehicleType: "Car",
        driverName: "",
        contactNumber: "",
        parkingZone: "A",
        slotNumber: "",
        serviceType: "Hotel Guest",
        checkInTime: "",
        expectedCheckOutTime: "",
        guestName: "",
        roomNumber: "",
        amount: 0,
        paymentStatus: "Pending",
        notes: "",
        status: "CHECKED_IN",
      });
    } catch (err: any) {
      setError(err.message || "Failed to add parking record");
    } finally {
      setLoading(false);
    }
  };

  const canEdit =
    currentRole === "OWNER" ||
    currentRole === "MANAGER" ||
    currentRole === "PARKING";

  const canDelete = currentRole === "OWNER" || currentRole === "MANAGER";

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
                Manage parking slots, vehicles, guest parking, and parking charges.
              </p>
            </div>

            <button
              onClick={() => setPanelOpen(true)}
              className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
            >
              + Add Vehicle
            </button>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard label="Total Records" value={String(parkingSlots.length)} />
            <StatCard
              label="Checked In"
              value={String(
                parkingSlots.filter(
                  (p: any) => p.status === "CHECKED_IN" || p.status === "Occupied"
                ).length
              )}
            />
            <StatCard
              label="Checked Out"
              value={String(
                parkingSlots.filter((p: any) => p.status === "CHECKED_OUT").length
              )}
            />
            <StatCard
              label="Reserved"
              value={String(
                parkingSlots.filter(
                  (p: any) => p.status === "Reserved" || p.status === "RESERVED"
                ).length
              )}
            />
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
                  {pageLoading ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-10 text-center text-[#4d4635]">
                        Loading parking records...
                      </td>
                    </tr>
                  ) : parkingSlots.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-10 text-center text-[#4d4635]">
                        <p className="text-lg font-bold">No parking records found</p>
                      </td>
                    </tr>
                  ) : (
                    parkingSlots.map((parking: any) => (
                      <tr key={parking.id} className="transition hover:bg-[#fbf9f5]">
                        <td className="px-6 py-5 font-bold">
                          {parking.id?.substring(0, 8) || "-"}
                        </td>

                        <td className="px-6 py-5 font-semibold">
                          {parking.slotNumber || "-"}
                        </td>

                        <td className="px-6 py-5 text-[#4d4635]">
                          {parking.vehicleModel || "-"}
                        </td>

                        <td className="px-6 py-5">
                          {parking.vehicleNumber || "-"}
                        </td>

                        <td className="px-6 py-5 text-[#4d4635]">
                          {parking.guestName || parking.driverName || "-"}
                        </td>

                        <td className="px-6 py-5">
                          {parking.roomNumber || "-"}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold tracking-widest ${getStatusBadgeClass(
                              parking.status
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
                                href={`/parking/edit?id=${parking.id}`}
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

        <SlidePanel
          open={panelOpen}
          onClose={() => setPanelOpen(false)}
          title="Add Parking Record"
          subtitle="Register a new guest vehicle or parking spot"
          icon={<Car className="h-5 w-5" />}
        >
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 font-bold text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#4d4635]">
                  Vehicle Number (Plate)
                </label>
                <input
                  required
                  type="text"
                  name="vehicleNumber"
                  placeholder="e.g. CAB-4521"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4d4635]">
                  Vehicle Model
                </label>
                <input
                  required
                  type="text"
                  name="vehicleModel"
                  placeholder="e.g. Honda Fit GP1"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#4d4635]">
                  Vehicle Type
                </label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                >
                  <option value="Car">Car</option>
                  <option value="Van">Van</option>
                  <option value="Bike">Bike</option>
                  <option value="Truck">Truck</option>
                  <option value="SUV">SUV</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4d4635]">
                  Parking Zone
                </label>
                <select
                  name="parkingZone"
                  value={formData.parkingZone}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                >
                  <option value="A">Zone A</option>
                  <option value="B">Zone B</option>
                  <option value="C">Zone C</option>
                  <option value="VIP">VIP Zone</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#4d4635]">
                  Slot Number
                </label>
                <input
                  required
                  type="text"
                  name="slotNumber"
                  placeholder="e.g. A-12"
                  value={formData.slotNumber}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4d4635]">
                  Service Type
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                >
                  <option value="Hotel Guest">Hotel Guest</option>
                  <option value="Walk-in">Walk-in</option>
                  <option value="Event Guest">Event Guest</option>
                  <option value="Valet">Valet</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#4d4635]">
                  Driver Name
                </label>
                <input
                  required
                  type="text"
                  name="driverName"
                  value={formData.driverName}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4d4635]">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#4d4635]">
                  Guest Name
                </label>
                <input
                  type="text"
                  name="guestName"
                  value={formData.guestName}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4d4635]">
                  Room Number
                </label>
                <input
                  type="text"
                  name="roomNumber"
                  placeholder="e.g. Room 204"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#4d4635]">
                  Check-in Time
                </label>
                <input
                  type="datetime-local"
                  name="checkInTime"
                  value={formData.checkInTime}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4d4635]">
                  Expected Check-out
                </label>
                <input
                  type="datetime-local"
                  name="expectedCheckOutTime"
                  value={formData.expectedCheckOutTime}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#4d4635]">
                  Amount (Rs)
                </label>
                <input
                  required
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4d4635]">
                  Payment Status
                </label>
                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Complimentary">Complimentary</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#4d4635]">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
              >
                <option value="CHECKED_IN">CHECKED_IN</option>
                <option value="CHECKED_OUT">CHECKED_OUT</option>
                <option value="RESERVED">RESERVED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#4d4635]">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="flex-1 rounded-xl border border-[#d0c5af] px-8 py-4 font-bold text-[#4d4635] transition hover:bg-[#ece9e2]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-[#735c00] px-8 py-4 font-bold text-white transition hover:bg-[#d4af37]"
              >
                {loading ? "Saving..." : "Save Record"}
              </button>
            </div>
          </form>
        </SlidePanel>
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