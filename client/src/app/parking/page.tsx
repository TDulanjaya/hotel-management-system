"use client";
import { AuthUser, getUser } from "@/utils/auth";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getStatusBadgeClass } from "@/lib/utils/statusStyles";
import {
  getParkingBookings,
  deleteParkingBooking as apiDeleteParkingBooking,
  createParkingBooking,
  updateParkingBooking,
} from "@/lib/api/parkingApi";
import { getPricingItemsByCategory } from "@/lib/api/pricingApi";
import { getRooms } from "@/lib/api/roomApi";
import { getEvents } from "@/lib/api/eventApi";
import SlidePanel from "@/components/ui/SlidePanel";
import POSPaymentModal from "@/components/payments/POSPaymentModal";
import { Car, CreditCard, ShieldCheck, LogOut, CheckCircle } from "lucide-react";

export default function ParkingPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    setUser(getUser());
  }, []);

  const [currentRole, setCurrentRole] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [parkingSlots, setParkingSlots] = useState<any[]>([]);

  // Relational state
  const [pricingItems, setPricingItems] = useState<any[]>([]);
  const [occupiedRooms, setOccupiedRooms] = useState<any[]>([]);
  const [eventsList, setEventsList] = useState<any[]>([]);

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [settleItem, setSettleItem] = useState<any>(null);
  const [roomExitItem, setRoomExitItem] = useState<any>(null);

  const handleInitiateExit = (parking: any) => {
    if (parking.billingType === "ROOM_FOLIO") {
      setRoomExitItem(parking);
    } else {
      setSettleItem(parking);
    }
  };

  const handleConfirmRoomExit = async (parking: any) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/parking/${parking.id}/checkout-folio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        await updateParkingBooking(parking.id, {
          ...parking,
          status: "CHECKED_OUT",
        });
      }
      setRoomExitItem(null);
      await loadParking();
      alert("Vehicle successfully checked out. Fee posted to Room Folio.");
    } catch (err: any) {
      alert(err.message || "Failed to check out vehicle.");
    }
  };

  const defaultForm = {
    vehicleNumber: "",
    vehicleModel: "",
    vehicleType: "Car",
    driverName: "",
    contactNumber: "",
    parkingZone: "A",
    slotNumber: "",
    customerType: "WALK_IN",
    billingType: "DIRECT_PAYMENT", // Universal Gate Payment default
    pricingItemId: "",
    roomNumber: "",
    reservationId: "",
    eventId: "",
    serviceType: "Self-Park",
    checkInTime: new Date().toISOString().slice(0, 16),
    expectedCheckOutTime: "",
    guestName: "",
    paymentStatus: "Pending",
    notes: "",
    status: "CHECKED_IN",
  };

  const [formData, setFormData] = useState(defaultForm);

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

  // Load relational masters (Pricing, Rooms, Events)
  useEffect(() => {
    async function loadRelations() {
      try {
        const [items, roomsData, eventsData] = await Promise.all([
          getPricingItemsByCategory("PARKING").catch(() => []),
          getRooms().catch(() => []),
          getEvents().catch(() => []),
        ]);
        const pItems = Array.isArray(items) ? items : [];
        setPricingItems(pItems);
        setOccupiedRooms(Array.isArray(roomsData) ? roomsData : []);
        setEventsList(Array.isArray(eventsData) ? eventsData : []);

        if (pItems.length > 0 && !formData.pricingItemId) {
          const defaultRate = pItems.find((p: any) => p.vehicleType === "Car") || pItems[0];
          if (defaultRate) {
            setFormData((prev) => ({ ...prev, pricingItemId: defaultRate.id }));
          }
        }
      } catch (err) {
        console.error("Failed to load relational masters:", err);
      }
    }
    loadRelations();
  }, []);

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

  const handleOpenAdd = () => {
    setEditItem(null);
    setError("");
    const defaultRate = pricingItems.find((p: any) => p.vehicleType === "Car") || pricingItems[0];
    setFormData({
      ...defaultForm,
      pricingItemId: defaultRate ? defaultRate.id : "",
      checkInTime: new Date().toISOString().slice(0, 16),
    });
    setPanelOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditItem(item);
    setError("");
    setFormData({
      vehicleNumber: item.vehicleNumber || "",
      vehicleModel: item.vehicleModel || "",
      vehicleType: item.vehicleType || "Car",
      driverName: item.driverName || "",
      contactNumber: item.contactNumber || "",
      parkingZone: item.parkingZone || "A",
      slotNumber: item.slotNumber || "",
      customerType: item.customerType || "WALK_IN",
      billingType: item.billingType || "DIRECT_PAYMENT",
      pricingItemId: item.pricingItemId || "",
      roomNumber: item.roomNumber || "",
      reservationId: item.reservationId || "",
      eventId: item.eventId || "",
      serviceType: item.serviceType || "Self-Park",
      checkInTime: item.checkInTime || "",
      expectedCheckOutTime: item.expectedCheckOutTime || "",
      guestName: item.guestName || "",
      paymentStatus: item.paymentStatus || "Pending",
      notes: item.notes || "",
      status: item.status || "CHECKED_IN",
    });
    setPanelOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "vehicleType") {
      const matchingRate = pricingItems.find(
        (p: any) => (p.vehicleType || "").toLowerCase() === value.toLowerCase()
      );
      setFormData((prev) => ({
        ...prev,
        vehicleType: value,
        pricingItemId: matchingRate ? matchingRate.id : prev.pricingItemId,
      }));
      return;
    }

    if (name === "customerType") {
      setFormData((prev) => ({
        ...prev,
        customerType: value,
        billingType: "DIRECT_PAYMENT", // default everyone to Gate Payment
        roomNumber: "",
        reservationId: "",
        eventId: "",
      }));
      return;
    }

    if (name === "roomNumber") {
      const selectedRoom = occupiedRooms.find((r: any) => r.roomNumber === value);
      setFormData((prev) => ({
        ...prev,
        roomNumber: value,
        guestName: selectedRoom?.guestName || prev.guestName,
      }));
      return;
    }

    if (name === "eventId") {
      const selectedEvent = eventsList.find((ev: any) => ev.id === value);
      setFormData((prev) => ({
        ...prev,
        eventId: value,
        guestName: selectedEvent?.organizerName || selectedEvent?.eventName || prev.guestName,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
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

      const payload = {
        ...formData,
        pricingItemId: formData.pricingItemId || (pricingItems[0]?.id ?? ""),
      };

      if (editItem) {
        await updateParkingBooking(editItem.id, payload);
      } else {
        await createParkingBooking(payload);
      }

      setPanelOpen(false);
      setEditItem(null);
      await loadParking();
    } catch (err: any) {
      setError(err.message || "Failed to save parking record");
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
              onClick={handleOpenAdd}
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
                    <th className="px-6 py-4">Room / Event</th>
                    <th className="px-6 py-4">Billing</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Fee</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {pageLoading ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-10 text-center text-[#4d4635]">
                        Loading parking records...
                      </td>
                    </tr>
                  ) : parkingSlots.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-10 text-center text-[#4d4635]">
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
                          {parking.vehicleModel || parking.vehicleType || "-"}
                        </td>

                        <td className="px-6 py-5 font-mono font-medium">
                          {parking.vehicleNumber || "-"}
                        </td>

                        <td className="px-6 py-5 text-[#4d4635]">
                          {parking.guestName || parking.driverName || "-"}
                        </td>

                        <td className="px-6 py-5 text-sm">
                          {parking.roomNumber ? (
                            <span className="font-semibold text-[#735c00]">Room {parking.roomNumber}</span>
                          ) : parking.eventId ? (
                            <span className="font-semibold text-blue-700">Event Linked</span>
                          ) : (
                            <span className="text-[#888]">Visitor</span>
                          )}
                        </td>

                        <td className="px-6 py-5 text-xs font-semibold">
                          <span className={`inline-block rounded-md px-2 py-0.5 ${
                            parking.billingType === "ROOM_FOLIO"
                              ? "bg-amber-100 text-amber-800"
                              : parking.billingType === "EVENT_MASTER_BILL"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}>
                            {parking.billingType === "ROOM_FOLIO"
                              ? "Room Folio"
                              : parking.billingType === "EVENT_MASTER_BILL"
                              ? "Event Master"
                              : "Gate Payment"}
                          </span>
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
                          <div className="flex justify-end gap-2">
                            {parking.status !== "CHECKED_OUT" && (
                              <button
                                type="button"
                                onClick={() => handleInitiateExit(parking)}
                                className="flex items-center gap-1 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-800 shadow-sm"
                              >
                                <LogOut size={13} />
                                Exit & Settle
                              </button>
                            )}

                            {canEdit && (
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(parking)}
                                className="rounded-lg border border-[#735c00] px-3 py-1.5 text-xs font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
                              >
                                Edit
                              </button>
                            )}

                            {canDelete && (
                              <button
                                type="button"
                                onClick={() => deleteParking(parking.id)}
                                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-50"
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
          title={editItem ? "Edit Parking Record" : "Add Parking Record"}
          subtitle={
            editItem
              ? `Updating vehicle ${editItem.vehicleNumber || ""}`
              : "Register vehicle check-in with gate settlement"
          }
          icon={<Car className="h-5 w-5 text-[#735c00]" />}
        >
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 font-bold text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vehicle Identification */}
            <div className="rounded-xl border border-[#e2dacf] bg-[#faf8f4] p-4 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#735c00]">
                Vehicle Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                    Plate Number *
                  </label>
                  <input
                    required
                    type="text"
                    name="vehicleNumber"
                    placeholder="e.g. WP CAB-4521"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                    Vehicle Model *
                  </label>
                  <input
                    required
                    type="text"
                    name="vehicleModel"
                    placeholder="e.g. Honda Fit / Toyota Prius"
                    value={formData.vehicleModel}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                    Type
                  </label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-semibold focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                  >
                    <option value="Car">Car</option>
                    <option value="Van">Van</option>
                    <option value="Bike">Motorcycle</option>
                    <option value="SUV">SUV</option>
                    <option value="Truck">Truck / Bus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                    Parking Zone
                  </label>
                  <select
                    name="parkingZone"
                    value={formData.parkingZone}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-semibold focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                  >
                    <option value="A">Zone A (Front)</option>
                    <option value="B">Zone B (Rear)</option>
                    <option value="C">Zone C (Underground)</option>
                    <option value="VIP">VIP Bay</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                    Slot Number *
                  </label>
                  <input
                    required
                    type="text"
                    name="slotNumber"
                    placeholder="e.g. A-12"
                    value={formData.slotNumber}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-bold focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                  />
                </div>
              </div>
            </div>

            {/* Relational Rate Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                Parking Rate Catalog *
              </label>
              <select
                name="pricingItemId"
                value={formData.pricingItemId}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-semibold text-[#1b1c1a] focus:outline-none focus:ring-2 focus:ring-[#735c00]"
              >
                {pricingItems.length === 0 ? (
                  <option value="">Standard Parking Rate</option>
                ) : (
                  pricingItems.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.name} — Rs {Number(item.price || item.basePrice || 0).toLocaleString()} ({item.priceType || item.pricingUnit || "per hour"})
                      {item.vehicleType ? ` [${item.vehicleType}]` : ""}
                    </option>
                  ))
                )}
              </select>
              <p className="mt-1 text-xs text-[#735c00]">
                Connected directly to Pricing Catalog. Exit toll fee is calculated from this rate.
              </p>
            </div>

            {/* Customer Type & Billing Method */}
            <div className="rounded-xl border border-[#e2dacf] bg-[#faf8f4] p-4 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#735c00]">
                Customer Category & Billing
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                    Customer Category
                  </label>
                  <select
                    name="customerType"
                    value={formData.customerType}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-semibold focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                  >
                    <option value="WALK_IN">Outside Visitor / Walk-in</option>
                    <option value="HOTEL_GUEST">Hotel Resident</option>
                    <option value="EVENT_GUEST">Event Attendee</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                    Payment / Settlement
                  </label>
                  <select
                    name="billingType"
                    value={formData.billingType}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-semibold focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                  >
                    <option value="DIRECT_PAYMENT">Gate Payment (Cash / Card at Exit)</option>
                    {formData.customerType === "HOTEL_GUEST" && (
                      <option value="ROOM_FOLIO">Charge to Room Folio</option>
                    )}
                    {formData.customerType === "EVENT_GUEST" && (
                      <option value="EVENT_MASTER_BILL">Charge to Event Master Bill</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Connected Dynamic Selectors */}
              {formData.customerType === "HOTEL_GUEST" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                    Select Occupied Room *
                  </label>
                  <select
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-semibold text-[#735c00] focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                  >
                    <option value="">-- Choose Guest Room --</option>
                    {occupiedRooms.map((r: any) => (
                      <option key={r.id || r.roomNumber} value={r.roomNumber}>
                        Room {r.roomNumber} — {r.type || "Room"} ({r.status || "OCCUPIED"})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.customerType === "EVENT_GUEST" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                    Select Active Event *
                  </label>
                  <select
                    name="eventId"
                    value={formData.eventId}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-semibold text-[#735c00] focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                  >
                    <option value="">-- Choose Event --</option>
                    {eventsList.map((ev: any) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.eventName || ev.title || "Event"} ({ev.organizerName || ev.clientName || "Organizer"})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Driver & Contact Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                  Driver Name *
                </label>
                <input
                  required
                  type="text"
                  name="driverName"
                  placeholder="Driver / Guest full name"
                  value={formData.driverName}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  placeholder="e.g. +94 77 123 4567"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                  Check-in Time
                </label>
                <input
                  type="datetime-local"
                  name="checkInTime"
                  value={formData.checkInTime}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                  Expected Check-out
                </label>
                <input
                  type="datetime-local"
                  name="expectedCheckOutTime"
                  value={formData.expectedCheckOutTime}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                  Service Type
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-semibold focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                >
                  <option value="Self-Park">Self-Park</option>
                  <option value="Valet">Valet Parking</option>
                  <option value="Assisted">Assisted Parking</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-semibold focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                >
                  <option value="CHECKED_IN">CHECKED_IN</option>
                  <option value="CHECKED_OUT">CHECKED_OUT</option>
                  <option value="RESERVED">RESERVED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                Notes
              </label>
              <textarea
                name="notes"
                placeholder="Optional vehicle or bay notes..."
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#735c00]"
              />
            </div>

            <div className="flex gap-4 pt-4 border-t border-[#d0c5af]">
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="flex-1 rounded-xl border border-[#d0c5af] px-8 py-3.5 font-bold text-[#4d4635] transition hover:bg-[#ece9e2]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-[#735c00] px-8 py-3.5 font-bold text-white transition hover:bg-[#d4af37] disabled:opacity-50"
              >
                {loading ? "Saving..." : editItem ? "Update Record" : "Register Vehicle"}
              </button>
            </div>
          </form>
        </SlidePanel>

        {/* Universal POS Payment Modal for Gate Toll Settlement */}
        {settleItem && (
          <POSPaymentModal
            isOpen={Boolean(settleItem)}
            onClose={() => setSettleItem(null)}
            title="Parking Gate Exit Settlement"
            sourceType="PARKING_BOOKING"
            sourceId={settleItem.id}
            customerName={settleItem.driverName || settleItem.guestName || "Outside Driver"}
            customerType={settleItem.customerType || "WALK_IN"}
            roomNumber={settleItem.roomNumber}
            serviceDescription={`Parking Exit Toll: Plate ${settleItem.vehicleNumber} (${settleItem.vehicleType || "Vehicle"})`}
            totalAmount={Number(settleItem.amount || 0)}
            onPaymentSuccess={async () => {
              setSettleItem(null);
              await loadParking();
            }}
          />
        )}

        {/* Room Folio Resident Exit Confirmation Dialog */}
        {roomExitItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-2 text-[#735c00]">
                <ShieldCheck size={24} />
                <h3 className="text-lg font-extrabold text-[#1b1c1a]">Resident Vehicle Exit</h3>
              </div>
              <p className="text-sm text-[#4d4635]">
                Vehicle <strong className="font-mono text-[#1b1c1a]">{roomExitItem.vehicleNumber}</strong> belongs to in-house guest{" "}
                <strong>{roomExitItem.guestName || "Resident"}</strong> (Room <strong>{roomExitItem.roomNumber}</strong>).
              </p>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-900">
                Parking fee of <strong>Rs {roomExitItem.amount}</strong> is posted to Room Folio and will be paid at Front Desk Room Checkout.
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleConfirmRoomExit(roomExitItem)}
                  className="w-full rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white hover:bg-emerald-800 shadow-md"
                >
                  Confirm Exit (Keep on Room Folio)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const temp = roomExitItem;
                    setRoomExitItem(null);
                    setSettleItem(temp);
                  }}
                  className="w-full rounded-xl border border-[#735c00] py-2.5 text-xs font-bold text-[#735c00] hover:bg-[#735c00]/5"
                >
                  Guest Wants to Pay Cash/Card Now Instead
                </button>
                <button
                  type="button"
                  onClick={() => setRoomExitItem(null)}
                  className="w-full text-center text-xs text-gray-500 hover:underline py-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
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