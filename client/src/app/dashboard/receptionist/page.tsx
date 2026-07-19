"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppSidebar from "@/components/layout/Sidebar";
import {
  Search,
  Bell,
  LogIn,
  LogOut,
  CreditCard,
  ArrowRight,
  Clock,
  CheckCheck,
  AlertCircle,
  BedDouble,
  Filter,
  MoreVertical,
  Brush,
  PlaneTakeoff,
  Plus,
} from "lucide-react";

import { getRooms } from "@/lib/api/roomApi";
import { getReservations } from "@/lib/api/reservationsApi";
import { getPayments } from "@/lib/api/paymentsApi";

function roomStatusClass(status: string) {
  if (status === "AVAILABLE") {
    return "bg-green-100 text-green-700 border-green-200";
  }

  if (status === "OCCUPIED") {
    return "bg-blue-100 text-blue-700 border-blue-200";
  }

  if (status === "CLEANING" || status === "MAINTENANCE") {
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  }

  return "bg-red-100 text-red-700 border-red-200";
}

export default function ReceptionistDashboardPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [roomsData, resData, payData] = await Promise.all([
          getRooms(),
          getReservations(),
          getPayments()
        ]);
        setRooms(roomsData || []);
        setReservations(resData || []);
        setPayments(payData || []);
      } catch (err) {
        console.error("Error loading receptionist data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Today's date string for comparison
  const today = new Date().toISOString().split('T')[0];
  
  const todaysArrivals = reservations.filter(r => r.checkInDate === today);
  const todaysDepartures = reservations.filter(r => r.checkOutDate === today);
  const roomsToClean = rooms.filter(r => r.status === "CLEANING" || r.status === "MAINTENANCE").length;
  
  const availableRoomsCount = rooms.filter(r => r.status === "AVAILABLE").length;
  const availabilityRate = rooms.length > 0 ? ((availableRoomsCount / rooms.length) * 100).toFixed(1) + "%" : "0%";

  const statusCards = [
    {
      title: "Today's Arrivals",
      value: todaysArrivals.length.toString(),
      note: `${todaysArrivals.filter(r => r.status === "PENDING").length} Pending`,
      icon: Clock,
      color: "text-[#735c00]",
      bg: "bg-[#d4af37]/15",
    },
    {
      title: "Today's Departures",
      value: todaysDepartures.length.toString(),
      note: `${todaysDepartures.filter(r => r.status === "COMPLETED").length} Checked out`,
      icon: CheckCheck,
      color: "text-[#545f73]",
      bg: "bg-[#545f73]/15",
    },
    {
      title: "Rooms to Clean",
      value: roomsToClean.toString(),
      note: "Needs attention",
      icon: AlertCircle,
      color: "text-[#ba1a1a]",
      bg: "bg-[#ba1a1a]/10",
    },
    {
      title: "Availability",
      value: availabilityRate,
      note: `${availableRoomsCount} Rooms left`,
      icon: BedDouble,
      color: "text-[#565e74]",
      bg: "bg-[#565e74]/15",
    },
  ];

  const arrivalsList = todaysArrivals.map(r => ({
    guest: r.guestName || "Unknown",
    member: `Guests: ${r.numberOfGuests}`,
    roomType: r.roomType || `Room ${r.roomId}`,
    eta: "Today",
    status: r.status,
    badge: r.status === "CONFIRMED" ? "bg-blue-50 text-blue-700" : "bg-yellow-50 text-yellow-700",
  }));

  const departuresList = todaysDepartures.map(r => ({
    guest: r.guestName || "Unknown",
    member: `Guests: ${r.numberOfGuests}`,
    room: r.roomId,
    balance: `Rs ${r.totalAmount}`,
    status: r.paymentStatus === "PAID" ? "Ready" : "Unpaid Folio",
    badge: r.paymentStatus === "PAID" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700",
    action: r.paymentStatus === "PAID" ? "CHECK OUT" : "VIEW FOLIO",
  }));

  const folioActivities = [...payments]
    .sort((a, b) => new Date(b.paymentDate || b.paidAt || 0).getTime() - new Date(a.paymentDate || a.paidAt || 0).getTime())
    .slice(0, 4)
    .map(p => ({
      guest: `Payment #${p.id.substring(0, 6)}`,
      service: p.paymentMethod || "Payment",
      amount: `Rs ${p.amount}`,
      time: p.paymentDate || p.paidAt ? new Date(p.paymentDate || p.paidAt).toLocaleTimeString() : "Recent",
      color: "text-[#735c00]",
    }));

  return (
    <ProtectedRoute allowedRoles={["RECEPTIONIST", "MANAGER", "OWNER"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="min-h-screen lg:ml-[280px]">
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#d0c5af] bg-[#fbf9f5] px-8 shadow-sm">
            <div className="relative hidden w-full max-w-md md:block">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7f7663]"
              />

              <input
                type="text"
                placeholder="Search guests, rooms, or folios..."
                className="w-full rounded-full border border-[#d0c5af] bg-[#f5f3ef] py-2 pl-10 pr-4 text-sm outline-none transition focus:border-[#735c00] focus:ring-2 focus:ring-[#735c00]/20"
              />
            </div>

            <div className="flex items-center gap-6">
              <button className="relative text-[#4d4635] transition hover:text-[#735c00]">
                <Bell size={22} />
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#ba1a1a]" />
              </button>

              <div className="hidden h-8 w-px bg-[#d0c5af] md:block" />

              <div className="hidden text-right md:block">
                <p className="text-sm font-bold text-[#1b1c1a]">
                  Alex Rivera
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7f7663]">
                  Front Desk Receptionist
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#d4af37] bg-[#131b2e] font-bold text-[#ffe088]">
                AR
              </div>
            </div>
          </header>

          <section className="mx-auto max-w-[1600px] px-8 pb-12 pt-10">
            <div className="mb-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                  Front Desk Operations
                </p>

                <h1 className="mt-3 text-4xl font-extrabold">
                  Receptionist Dashboard
                </h1>

                <p className="mt-3 text-[#4d4635]">
                  Manage arrivals, departures, room status, folios, and daily
                  front desk activities.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 rounded-lg border border-[#d0c5af] bg-white px-5 py-3 text-sm font-bold transition hover:bg-[#efeeea]">
                  <LogIn size={18} />
                  New Check-in
                </button>

                <button className="flex items-center gap-2 rounded-lg bg-[#d4af37] px-5 py-3 text-sm font-bold text-[#554300] shadow-sm transition hover:opacity-90">
                  <Plus size={18} />
                  New Reservation
                </button>
              </div>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {statusCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    key={card.title}
                    className="rounded-xl border border-[#d0c5af] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="mb-5 flex items-start justify-between">
                      <div>
                        <p className="text-sm font-bold text-[#4d4635]">
                          {card.title}
                        </p>
                        <h2 className="mt-2 text-4xl font-extrabold">
                          {loading ? "..." : card.value}
                        </h2>
                      </div>

                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bg}`}
                      >
                        <Icon size={24} className={card.color} />
                      </div>
                    </div>

                    <p className={`text-sm font-bold ${card.color}`}>
                      {card.note}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="grid grid-cols-12 gap-6">
              <section className="col-span-12 rounded-xl border border-[#d0c5af] bg-white shadow-sm xl:col-span-8">
                <div className="flex items-center justify-between border-b border-[#d0c5af] p-6">
                  <div>
                    <h2 className="text-xl font-bold">
                      Arrivals & Departures
                    </h2>
                    <p className="text-sm text-[#4d4635]">
                      Today&apos;s guest movement and front desk actions.
                    </p>
                  </div>

                  <button className="rounded-lg p-2 text-[#4d4635] transition hover:bg-[#efeeea]">
                    <Filter size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 font-bold text-[#735c00]">
                      <PlaneTakeoff size={20} />
                      Arrivals
                    </h3>

                    <div className="space-y-4">
                      {arrivalsList.length === 0 && !loading && (
                        <p className="text-sm text-[#4d4635]">No arrivals for today.</p>
                      )}
                      {arrivalsList.map((arrival, idx) => (
                        <article
                          key={idx}
                          className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-bold">{arrival.guest}</p>
                              <p className="text-sm text-[#4d4635]">
                                {arrival.member} • {arrival.roomType}
                              </p>
                            </div>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${arrival.badge}`}
                            >
                              {arrival.status}
                            </span>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-sm font-bold text-[#4d4635]">
                              ETA: {arrival.eta}
                            </span>

                            <button className="flex items-center gap-1 text-sm font-bold text-[#735c00]">
                              Check In <ArrowRight size={16} />
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 flex items-center gap-2 font-bold text-[#735c00]">
                      <LogOut size={20} />
                      Departures
                    </h3>

                    <div className="space-y-4">
                      {departuresList.length === 0 && !loading && (
                        <p className="text-sm text-[#4d4635]">No departures for today.</p>
                      )}
                      {departuresList.map((departure, idx) => (
                        <article
                          key={idx}
                          className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-bold">{departure.guest}</p>
                              <p className="text-sm text-[#4d4635]">
                                {departure.member} • Room {departure.room}
                              </p>
                            </div>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${departure.badge}`}
                            >
                              {departure.status}
                            </span>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-sm font-bold text-[#4d4635]">
                              Balance: {departure.balance}
                            </span>

                            <button className="flex items-center gap-1 text-sm font-bold text-[#735c00]">
                              {departure.action} <ArrowRight size={16} />
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <aside className="col-span-12 space-y-6 xl:col-span-4">
                <section className="rounded-xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">Folio Activity</h2>
                      <p className="text-sm text-[#4d4635]">
                        Latest billing movements.
                      </p>
                    </div>

                    <CreditCard size={22} className="text-[#735c00]" />
                  </div>

                  <div className="space-y-4">
                    {folioActivities.length === 0 && !loading && (
                      <p className="text-sm text-[#4d4635]">No recent activities.</p>
                    )}
                    {folioActivities.map((activity, idx) => (
                      <article
                        key={idx}
                        className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-bold">
                              {activity.guest}
                            </p>
                            <p className="text-xs text-[#4d4635]">
                              {activity.service}
                            </p>
                          </div>

                          <p className={`text-sm font-bold ${activity.color}`}>
                            {activity.amount}
                          </p>
                        </div>

                        <p className="mt-2 text-xs text-[#7f7663]">
                          {activity.time}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              </aside>

              <section className="col-span-12 rounded-xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Room Status Board</h2>
                    <p className="text-sm text-[#4d4635]">
                      Live room availability and housekeeping status.
                    </p>
                  </div>

                  <button className="rounded-lg p-2 text-[#4d4635] transition hover:bg-[#efeeea]">
                    <MoreVertical size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 xl:grid-cols-12">
                  {rooms.length === 0 && !loading && (
                    <div className="col-span-12 p-4 text-center text-[#4d4635]">No rooms loaded.</div>
                  )}
                  {rooms.map((room) => (
                    <div
                      key={room.roomNumber}
                      className={`rounded-xl border p-3 text-center text-xs font-bold ${roomStatusClass(
                        room.status
                      )}`}
                    >
                      <p className="text-base">{room.roomNumber}</p>

                      <div className="mt-1 flex items-center justify-center gap-1">
                        {(room.status === "CLEANING" || room.status === "MAINTENANCE") && <Brush size={13} />}
                        <span className="text-[10px]">{room.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
