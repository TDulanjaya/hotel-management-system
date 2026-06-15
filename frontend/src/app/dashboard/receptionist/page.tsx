"use client";

import AppSidebar from "@/components/layout/AppSidebar";
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
  BrushCleaning,
  PlaneTakeoff,
  Plus,
} from "lucide-react";

const statusCards = [
  {
    title: "Today's Arrivals",
    value: "42",
    note: "12 Pending",
    color: "#735c00",
    icon: Clock,
  },
  {
    title: "Today's Departures",
    value: "28",
    note: "16 Checked out",
    color: "#545f73",
    icon: CheckCheck,
  },
  {
    title: "Rooms to Clean",
    value: "15",
    note: "8 Priority",
    color: "#ba1a1a",
    icon: AlertCircle,
  },
  {
    title: "Availability",
    value: "12%",
    note: "18 Rooms left",
    color: "#d4af37",
    icon: BedDouble,
  },
];

const rooms = Array.from({ length: 50 }, (_, index) => {
  const roomNumber = 101 + index;
  const statuses = ["Available", "Occupied", "Cleaning", "Maintenance"];
  const status = statuses[index % statuses.length];

  return {
    number: roomNumber,
    status,
  };
});

const folioActivities = [
  {
    guest: "Elena Sorova (Rm 402)",
    service: "Spa & Wellness Service",
    amount: "+$450.00",
    time: "2 mins ago",
    color: "text-[#735c00]",
  },
  {
    guest: "James Wilson (Rm 105)",
    service: "Room Service Breakfast",
    amount: "Pending",
    time: "15 mins ago",
    color: "text-[#ba1a1a]",
  },
  {
    guest: "Marcus Thorne (Rm 212)",
    service: "Minibar - Premium Spirits",
    amount: "Paid",
    time: "1 hour ago",
    color: "text-green-600",
  },
  {
    guest: "Sophie Chen (Rm 304)",
    service: "Extended Stay Upgrade",
    amount: "+$1,200.00",
    time: "3 hours ago",
    color: "text-[#735c00]",
  },
];

const arrivals = [
  {
    guest: "Jonathan Burke",
    member: "Gold Member",
    roomType: "Executive Suite",
    eta: "14:30",
    status: "Pre-arrival",
    badge: "bg-yellow-50 text-yellow-700",
  },
  {
    guest: "Sarah McAllister",
    member: "Regular",
    roomType: "Deluxe King",
    eta: "15:15",
    status: "In Transit",
    badge: "bg-blue-50 text-blue-700",
  },
];

const departures = [
  {
    guest: "Robert Langdon",
    member: "Platinum Member",
    room: "502",
    balance: "$0.00",
    status: "Ready",
    badge: "bg-green-50 text-green-700",
    action: "CHECK OUT",
  },
  {
    guest: "Emily Blunt",
    member: "VIP",
    room: "Penthouse 1",
    balance: "$2,840.12",
    status: "Unpaid Folio",
    badge: "bg-red-50 text-red-700",
    action: "VIEW FOLIO",
  },
];

function roomStatusClass(status: string) {
  if (status === "Available") {
    return "bg-green-500 text-green-800";
  }

  if (status === "Occupied") {
    return "bg-blue-500 text-blue-800";
  }

  if (status === "Cleaning") {
    return "bg-yellow-500 text-yellow-800";
  }

  return "bg-red-500 text-red-800";
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
      <AppSidebar />

      <main className="min-h-screen lg:ml-[280px]">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#d0c5af] bg-[#fbf9f5] px-8 shadow-sm">
          <div className="flex w-1/2 items-center gap-4">
            <div className="relative w-full max-w-md">
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
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-[#4d4635] transition hover:text-[#735c00]">
              <Bell size={22} />
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#ba1a1a]" />
            </button>

            <div className="hidden h-8 w-px bg-[#d0c5af] md:block" />

            <div className="hidden text-right md:block">
              <p className="text-sm font-bold text-[#1b1c1a]">Alex Rivera</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#7f7663]">
                Front Desk Manager
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#d4af37] bg-[#131b2e] font-bold text-[#ffe088]">
              AR
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-[1600px] px-8 pb-12 pt-10">
          <div className="dashboard-fade mb-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-xl bg-[#131b2e] p-10 text-white lg:col-span-8">
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#d4af37]/20 blur-3xl" />

              <div className="relative z-10">
                <h1 className="mb-2 text-4xl font-bold tracking-tight">
                  Welcome back, Alex.
                </h1>

                <p className="max-w-lg text-base leading-relaxed text-white/80">
                  The hotel is at 88% occupancy today. 14 arrivals expected in
                  the next two hours.
                </p>
              </div>

              <div className="relative z-10 mt-8 flex flex-wrap gap-4">
                <button className="flex items-center gap-2 rounded-lg bg-[#735c00] px-8 py-3 font-bold text-white transition hover:brightness-110 active:scale-95">
                  <LogIn size={18} />
                  Check-in Guest
                </button>

                <button className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-8 py-3 font-bold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95">
                  <LogOut size={18} />
                  Check-out
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-[#d0c5af] bg-white p-6 shadow-sm lg:col-span-4">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
                <CreditCard size={22} className="text-[#735c00]" />
                Quick Payment
              </h2>

              <div className="space-y-4">
                <div className="rounded-lg border border-[#d0c5af]/50 bg-[#efeeea] p-4">
                  <label className="mb-1 block text-[10px] font-bold uppercase text-[#7f7663]">
                    Total Outstanding
                  </label>

                  <p className="text-3xl font-bold">$12,450.80</p>
                </div>

                <button className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#131b2e] py-4 font-bold text-[#131b2e] transition hover:bg-[#131b2e] hover:text-white">
                  Collect Payment
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="dashboard-fade mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {statusCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="relative overflow-hidden rounded-xl border border-[#d0c5af] bg-white p-6 shadow-sm"
                >
                  <div
                    className="absolute left-0 top-0 h-full w-1"
                    style={{ backgroundColor: card.color }}
                  />

                  <p className="mb-1 text-sm font-semibold text-[#7f7663]">
                    {card.title}
                  </p>

                  <h3 className="text-4xl font-bold">{card.value}</h3>

                  <p
                    className="mt-2 flex items-center gap-1 text-xs font-bold"
                    style={{ color: card.color }}
                  >
                    <Icon size={14} />
                    {card.note}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="dashboard-fade grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <section className="overflow-hidden rounded-xl border border-[#d0c5af] bg-white shadow-sm lg:col-span-8">
              <div className="flex flex-col justify-between gap-4 border-b border-[#d0c5af] p-6 xl:flex-row xl:items-center">
                <h2 className="text-2xl font-semibold">
                  Room Availability Status
                </h2>

                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    Available
                  </span>

                  <span className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    Occupied
                  </span>

                  <span className="flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-700">
                    <span className="h-2 w-2 rounded-full bg-yellow-500" />
                    Cleaning
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 p-6 sm:grid-cols-6 md:grid-cols-8 xl:grid-cols-10">
                {rooms.map((room) => {
                  const ribbon = roomStatusClass(room.status).split(" ")[0];

                  return (
                    <div
                      key={room.number}
                      className="group relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border border-[#d0c5af] transition hover:border-[#735c00] hover:shadow-md"
                    >
                      <div
                        className={`absolute bottom-1 left-0 top-1 w-1 rounded-r ${ribbon}`}
                      />

                      <span className="text-xs font-bold">{room.number}</span>

                      <span className="text-[8px] uppercase tracking-tighter text-[#7f7663] group-hover:text-[#735c00]">
                        {room.status.slice(0, 4)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            <aside className="space-y-6 lg:col-span-4">
              <section className="overflow-hidden rounded-xl border border-[#d0c5af] bg-white shadow-sm">
                <div className="border-b border-[#d0c5af] p-6">
                  <h2 className="text-xl font-semibold">
                    Recent Folio Activity
                  </h2>
                </div>

                <div className="max-h-[400px] overflow-y-auto dashboard-scroll">
                  <div className="divide-y divide-[#d0c5af]">
                    {folioActivities.map((activity) => (
                      <div
                        key={activity.guest}
                        className="p-4 transition hover:bg-[#f5f3ef]"
                      >
                        <div className="mb-1 flex items-start justify-between">
                          <p className="font-bold">{activity.guest}</p>
                          <span
                            className={`text-xs font-bold ${activity.color}`}
                          >
                            {activity.amount}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-xs text-[#7f7663]">
                            {activity.service}
                          </p>
                          <p className="text-[10px] italic text-[#7f7663]">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#f5f3ef] p-4 text-center">
                  <button className="text-xs font-bold text-[#735c00] hover:underline">
                    View All Billing Activities
                  </button>
                </div>
              </section>

              <section className="relative overflow-hidden rounded-xl bg-[#131b2e] p-6 text-white">
                <div className="relative z-10">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-[#d4af37]">
                    Traffic Insights
                  </h3>

                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-3xl font-bold">88%</p>
                      <p className="text-[10px] font-bold uppercase text-white/60">
                        Current Occupancy
                      </p>
                    </div>

                    <div className="h-10 w-px bg-white/10" />

                    <div className="flex-1">
                      <p className="text-3xl font-bold">14</p>
                      <p className="text-[10px] font-bold uppercase text-white/60">
                        Pending Check-ins
                      </p>
                    </div>
                  </div>

                  <div className="mb-6 h-1.5 w-full rounded-full bg-white/10">
                    <div className="h-full w-[88%] rounded-full bg-[#735c00]" />
                  </div>

                  <p className="text-sm leading-relaxed text-white/80">
                    Peak check-in hour expected at{" "}
                    <span className="font-bold text-[#d4af37]">15:00</span>.
                    Staff levels are adequate.
                  </p>
                </div>
              </section>
            </aside>
          </div>

          <section className="dashboard-fade mt-12 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="overflow-hidden rounded-xl border border-[#d0c5af] bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-[#d0c5af] p-6">
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                  <BrushCleaning size={22} className="text-[#735c00]" />
                  Today's Arrivals
                </h2>

                <button className="text-[#7f7663] transition hover:text-[#735c00]">
                  <Filter size={20} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#f5f3ef] text-[10px] font-semibold uppercase tracking-wider text-[#7f7663]">
                    <tr>
                      <th className="px-6 py-3">Guest</th>
                      <th className="px-6 py-3">Room Type</th>
                      <th className="px-6 py-3">ETA</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#d0c5af] text-sm">
                    {arrivals.map((arrival) => (
                      <tr
                        key={arrival.guest}
                        className="transition hover:bg-[#f5f3ef]/50"
                      >
                        <td className="px-6 py-4">
                          <div className="font-bold">{arrival.guest}</div>
                          <div className="text-[10px] text-[#7f7663]">
                            {arrival.member}
                          </div>
                        </td>

                        <td className="px-6 py-4">{arrival.roomType}</td>
                        <td className="px-6 py-4">{arrival.eta}</td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded px-2 py-1 text-[10px] font-bold uppercase ${arrival.badge}`}
                          >
                            {arrival.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button className="rounded-full p-2 text-[#735c00] transition hover:bg-[#735c00]/10">
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#d0c5af] bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-[#d0c5af] p-6">
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                  <PlaneTakeoff size={22} className="text-[#545f73]" />
                  Today's Departures
                </h2>

                <button className="text-[#7f7663] transition hover:text-[#735c00]">
                  <Filter size={20} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#f5f3ef] text-[10px] font-semibold uppercase tracking-wider text-[#7f7663]">
                    <tr>
                      <th className="px-6 py-3">Guest</th>
                      <th className="px-6 py-3">Room</th>
                      <th className="px-6 py-3">Balance</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#d0c5af] text-sm">
                    {departures.map((departure) => (
                      <tr
                        key={departure.guest}
                        className="transition hover:bg-[#f5f3ef]/50"
                      >
                        <td className="px-6 py-4">
                          <div className="font-bold">{departure.guest}</div>
                          <div className="text-[10px] text-[#7f7663]">
                            {departure.member}
                          </div>
                        </td>

                        <td className="px-6 py-4">{departure.room}</td>

                        <td className="px-6 py-4 font-bold text-[#ba1a1a]">
                          {departure.balance}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded px-2 py-1 text-[10px] font-bold uppercase ${departure.badge}`}
                          >
                            {departure.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            className={`rounded px-3 py-1 text-[10px] font-bold transition ${
                              departure.action === "CHECK OUT"
                                ? "bg-[#131b2e] text-white hover:brightness-125"
                                : "border border-[#131b2e] text-[#131b2e] hover:bg-[#131b2e] hover:text-white"
                            }`}
                          >
                            {departure.action}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </section>
      </main>

      <button className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#735c00] text-white shadow-2xl transition hover:scale-110 active:scale-95">
        <Plus size={30} />
      </button>
    </div>
  );
}