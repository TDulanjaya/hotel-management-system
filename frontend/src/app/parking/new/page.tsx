"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { createParkingBooking } from "@/lib/api/parkingApi";

export default function NewParkingPage() {
  const router = useRouter();
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
    status: "CHECKED_IN"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createParkingBooking({
        ...formData,
        amount: Number(formData.amount),
      });
      router.push("/parking");
    } catch (err: any) {
      setError(err.message || "Failed to add parking record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "PARKING"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />
        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#735c00]">Add Parking Record</h1>
          </div>

          <div className="max-w-2xl rounded-2xl border border-[#d0c5af] bg-white p-8 shadow-sm">
            {error && <div className="mb-4 text-red-600">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Vehicle Number (Plate)</label>
                  <input required type="text" name="vehicleNumber" placeholder="e.g. CAB-4521" value={formData.vehicleNumber} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Vehicle Model</label>
                  <input required type="text" name="vehicleModel" placeholder="e.g. Honda Fit GP1" value={formData.vehicleModel} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Vehicle Type</label>
                  <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3">
                    <option value="Car">Car</option>
                    <option value="Van">Van</option>
                    <option value="Bike">Bike</option>
                    <option value="Truck">Truck</option>
                    <option value="SUV">SUV</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Parking Zone</label>
                  <select name="parkingZone" value={formData.parkingZone} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3">
                    <option value="A">Zone A</option>
                    <option value="B">Zone B</option>
                    <option value="C">Zone C</option>
                    <option value="VIP">VIP Zone</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Slot Number</label>
                  <input required type="text" name="slotNumber" placeholder="e.g. A-12" value={formData.slotNumber} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Service Type</label>
                  <select name="serviceType" value={formData.serviceType} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3">
                    <option value="Hotel Guest">Hotel Guest</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Event Guest">Event Guest</option>
                    <option value="Valet">Valet</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Driver Name</label>
                  <input required type="text" name="driverName" value={formData.driverName} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Contact Number</label>
                  <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Guest Name</label>
                  <input type="text" name="guestName" value={formData.guestName} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Room Number</label>
                  <input type="text" name="roomNumber" placeholder="e.g. Room 204" value={formData.roomNumber} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Check-in Time</label>
                  <input type="datetime-local" name="checkInTime" value={formData.checkInTime} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Expected Check-out Time</label>
                  <input type="datetime-local" name="expectedCheckOutTime" value={formData.expectedCheckOutTime} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Amount (Rs)</label>
                  <input required type="number" name="amount" value={formData.amount} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#4d4635]">Payment Status</label>
                  <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3">
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Complimentary">Complimentary</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4d4635]">Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" disabled={loading} className="rounded-xl bg-[#735c00] px-8 py-3 font-bold text-white transition hover:bg-[#d4af37]">
                  {loading ? "Saving..." : "Save Record"}
                </button>
                <Link href="/parking" className="rounded-xl border border-[#d0c5af] px-8 py-3 font-bold text-[#4d4635] transition hover:bg-[#f5f3ef]">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}