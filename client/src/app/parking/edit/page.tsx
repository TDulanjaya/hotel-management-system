"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ArrowLeft, Car, Save } from "lucide-react";
import {
  getParkingBookingById,
  updateParkingBooking,
} from "@/lib/api/parkingApi";
import { getPricingItemsByCategory } from "@/lib/api/pricingApi";

export default function EditParkingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parkingId = searchParams.get("id");

  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [pricingItems, setPricingItems] = useState<any[]>([]);

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
    pricingItemId: "",
    amount: 0,
    paymentStatus: "Pending",
    notes: "",
    status: "CHECKED_IN",
  });

  useEffect(() => {
    async function loadParkingRecord() {
      if (!parkingId) {
        setError("Parking record ID is missing.");
        setPageLoading(false);
        return;
      }

      try {
        const record = await getParkingBookingById(parkingId);

        setFormData({
          vehicleNumber: record.vehicleNumber || "",
          vehicleModel: record.vehicleModel || "",
          vehicleType: record.vehicleType || "Car",
          driverName: record.driverName || "",
          contactNumber: record.contactNumber || "",
          parkingZone: record.parkingZone || "A",
          slotNumber: record.slotNumber || "",
          serviceType: record.serviceType || "Hotel Guest",
          checkInTime: record.checkInTime || "",
          expectedCheckOutTime: record.expectedCheckOutTime || "",
          guestName: record.guestName || "",
          roomNumber: record.roomNumber || "",
          pricingItemId: record.pricingItemId || "",
          amount: Number(record.amount || 0),
          paymentStatus: record.paymentStatus || "Pending",
          notes: record.notes || "",
          status: record.status || "CHECKED_IN",
        });

        try {
          const items = await getPricingItemsByCategory("PARKING");
          setPricingItems(items || []);
        } catch (catErr) {
          console.error("Failed to load parking pricing items", catErr);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load parking record.");
      } finally {
        setPageLoading(false);
      }
    }

    loadParkingRecord();
  }, [parkingId]);

  const handlePricingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedItem = pricingItems.find((item) => item.id === selectedId);
    setFormData((prev) => ({
      ...prev,
      pricingItemId: selectedId,
      amount: selectedItem ? selectedItem.price : 0,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "amount") {
      setFormData((prev) => ({
        ...prev,
        amount: Number(value),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!parkingId) {
      setError("Parking record ID is missing.");
      return;
    }

    if (
      !formData.vehicleNumber ||
      !formData.vehicleModel ||
      !formData.driverName ||
      !formData.slotNumber
    ) {
      setError("Vehicle number, vehicle model, driver name and slot number are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateParkingBooking(parkingId, {
        ...formData,
        amount: Number(formData.amount),
      });

      alert("Parking record updated successfully.");
      router.push("/parking");
    } catch (err: any) {
      setError(err.message || "Failed to update parking record.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "PARKING"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="min-h-screen px-8 py-10 lg:ml-[280px]">
          <section className="mx-auto max-w-4xl">
            <Link
              href="/parking"
              className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#735c00] hover:underline"
            >
              <ArrowLeft size={18} />
              Back to Parking
            </Link>

            <div className="rounded-3xl border border-[#d0c5af] bg-white p-8 shadow-sm">
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#735c00]/10 text-[#735c00]">
                  <Car size={28} />
                </div>

                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#735c00]">
                    Parking Module
                  </p>
                  <h1 className="mt-2 text-3xl font-bold">Edit Parking Record</h1>
                  <p className="mt-1 text-sm text-[#4d4635]">
                    Update vehicle, guest, parking slot, payment and status details.
                  </p>
                </div>
              </div>

              {pageLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#d4af37] border-t-transparent" />
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <InputField
                        label="Vehicle Number"
                        name="vehicleNumber"
                        value={formData.vehicleNumber}
                        onChange={handleChange}
                        required
                      />

                      <InputField
                        label="Vehicle Model"
                        name="vehicleModel"
                        value={formData.vehicleModel}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <SelectField
                        label="Vehicle Type"
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        options={["Car", "Van", "Bike", "Truck", "SUV"]}
                      />

                      <SelectField
                        label="Parking Zone"
                        name="parkingZone"
                        value={formData.parkingZone}
                        onChange={handleChange}
                        options={["A", "B", "C", "VIP"]}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <InputField
                        label="Slot Number"
                        name="slotNumber"
                        value={formData.slotNumber}
                        onChange={handleChange}
                        required
                      />

                      <SelectField
                        label="Service Type"
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        options={["Hotel Guest", "Walk-in", "Event Guest", "Valet"]}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <InputField
                        label="Driver Name"
                        name="driverName"
                        value={formData.driverName}
                        onChange={handleChange}
                        required
                      />

                      <InputField
                        label="Contact Number"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <InputField
                        label="Guest Name"
                        name="guestName"
                        value={formData.guestName}
                        onChange={handleChange}
                      />

                      <InputField
                        label="Room Number"
                        name="roomNumber"
                        value={formData.roomNumber}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <InputField
                        label="Check-in Time"
                        name="checkInTime"
                        type="datetime-local"
                        value={formData.checkInTime}
                        onChange={handleChange}
                      />

                      <InputField
                        label="Expected Check-out"
                        name="expectedCheckOutTime"
                        type="datetime-local"
                        value={formData.expectedCheckOutTime}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-bold text-[#4d4635]">
                          Parking Package
                        </label>
                        <select
                          value={formData.pricingItemId}
                          onChange={handlePricingChange}
                          className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-[#fbf9f5] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                        >
                          <option value="">-- Select parking package --</option>
                          {pricingItems.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name} - Rs {item.price}
                            </option>
                          ))}
                        </select>
                      </div>

                      <InputField
                        label="Amount (Rs)"
                        name="amount"
                        type="number"
                        value={String(formData.amount)}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <SelectField
                        label="Payment Status"
                        name="paymentStatus"
                        value={formData.paymentStatus}
                        onChange={handleChange}
                        options={["Pending", "Paid", "Complimentary"]}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#4d4635]">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
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
                        rows={3}
                        className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Link
                        href="/parking"
                        className="flex-1 rounded-xl border border-[#d0c5af] px-8 py-4 text-center font-bold text-[#4d4635] transition hover:bg-[#ece9e2]"
                      >
                        Cancel
                      </Link>

                      <button
                        type="submit"
                        disabled={saving}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#735c00] px-8 py-4 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00] disabled:opacity-60"
                      >
                        <Save size={18} />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-[#4d4635]">{label}</label>
      <input
        required={required}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-[#4d4635]">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}