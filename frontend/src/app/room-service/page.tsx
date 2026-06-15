"use client";
import AppSidebar from "@/components/layout/AppSidebar";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: "▦" },
  { name: "Rooms", href: "/rooms", icon: "▰" },
  { name: "Room Service", href: "/room-service", icon: "⌂" },
  { name: "Kitchen Orders", href: "/kitchen", icon: "▥" },
  { name: "Reservations", href: "/reservations", icon: "▣" },
  { name: "Guests", href: "/guests", icon: "♙" },
  { name: "Inventory", href: "/inventory", icon: "▤" },
];

const stats = [
  {
    title: "Active Orders",
    value: "12",
    note: "↗ +3 from last hour",
  },
  {
    title: "Avg. Prep Time",
    value: "18m",
    note: "⏱ Within luxury target",
  },
  {
    title: "Pending Rev",
    value: "$1,420",
    note: "$ 8 uncharged folios",
  },
  {
    title: "Kitchen Status",
    value: "High",
    note: "● Priority Protocol Active",
  },
];

const orders = [
  {
    room: "Room 402",
    guest: "Mr. Julian Thorne",
    status: "Pending",
    timeLabel: "Ordered",
    time: "12:04 PM",
    border: "gold",
    items: [
      { name: "1x Truffle Eggs Benedict", price: "$32.00" },
      { name: "2x Fresh Squeezed Orange Juice", price: "$18.00" },
    ],
    note:
      "Extra hollandaise on the side, please. Fast delivery if possible, meeting at 12:45.",
    action: "Accept Order",
  },
  {
    room: "Suite 1004",
    guest: "Ms. Elena Rodriguez",
    status: "Preparing",
    timeLabel: "Est. Ready",
    time: "12:25 PM",
    border: "blue",
    items: [
      { name: "1x Wagyu Beef Burger (Medium)", price: "$45.00" },
      { name: "1x Cabernet Sauvignon, Glass", price: "$22.00" },
    ],
    progress: 65,
    note: "65% Progress - Plating phase",
    action: "Mark as Ready",
  },
  {
    room: "Room 215",
    guest: "Dr. Samuel Lee",
    status: "Ready",
    timeLabel: "Completed",
    time: "11:58 AM",
    border: "green",
    items: [
      { name: "1x Afternoon Tea Set", price: "$55.00" },
      { name: "1x Sparkling Water (Large)", price: "$12.00" },
    ],
    note: "Ready for pickup at counter B2",
    action: "Out for Delivery",
  },
];

const history = [
  {
    id: "#RS-8842",
    room: "Room 512",
    guest: "Alice Vance",
    items: "Continental Breakfast...",
    total: "$42.50",
    status: "Delivered",
    action: "Charge to Folio",
  },
  {
    id: "#RS-8839",
    room: "Suite 102",
    guest: "Robert Downy",
    items: "Champagne, Caviar",
    total: "$285.00",
    status: "Charged",
    action: "View Receipt",
  },
];

function statusClass(status: string) {
  if (status === "Pending") return "bg-yellow-50 text-[#806300]";
  if (status === "Preparing") return "bg-slate-100 text-[#3d4b61]";
  if (status === "Ready") return "bg-green-100 text-green-700";
  return "bg-slate-100 text-slate-700";
}

function borderClass(border: string) {
  if (border === "gold") return "border-l-[#d8b328]";
  if (border === "blue") return "border-l-[#9aa9bd]";
  if (border === "green") return "border-l-green-500";
  return "border-l-slate-300";
}

export default function RoomServicePage() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
      <AppSidebar />

      <main className="lg:ml-[280px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#d9cfbd] bg-[#f8f5ef]/95 px-8 backdrop-blur-xl">
          <h1 className="text-2xl font-extrabold">Room Service Orders</h1>

          <div className="flex flex-1 justify-center">
            <div className="flex w-full max-w-[430px] items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm">
              <span className="text-xl">⌕</span>
              <input
                type="text"
                placeholder="Search orders, rooms, guests..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative text-2xl transition hover:scale-110">
              ♧
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#806300]" />
            </button>

            <div className="hidden h-8 w-px bg-[#d9cfbd] md:block" />

            <button className="rounded-full bg-[#806300] px-8 py-3 text-lg font-bold text-white transition hover:-translate-y-1 hover:bg-[#6b5400] hover:shadow-xl">
              + New Order
            </button>

            <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-[#d8b328] bg-white shadow">
              🧑
            </div>
          </div>
        </header>

        <section className="px-8 py-8">
          <div className="room-service-fade grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.title}
                className="rounded-2xl border border-[#d9cfbd] bg-white p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <p className="text-lg uppercase tracking-wider text-[#57534e]">
                  {stat.title}
                </p>

                <h2 className="mt-2 text-5xl font-extrabold">
                  {stat.value}
                </h2>

                <p
                  className={`mt-5 text-sm font-semibold ${
                    stat.title === "Kitchen Status"
                      ? "text-red-600"
                      : "text-[#806300]"
                  }`}
                >
                  {stat.note}
                </p>
              </div>
            ))}
          </div>

          <div className="room-service-fade delay-100 mt-12 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div>
              <h2 className="text-3xl font-extrabold">Live Orders</h2>
              <p className="mt-2 text-lg text-[#57534e]">
                Monitor and manage real-time guest requests.
              </p>
            </div>

            <div className="flex rounded-full bg-[#ebe8e2] p-1">
              {["All", "Pending", "Preparing"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full px-5 py-2 font-semibold transition ${
                    activeFilter === filter
                      ? "bg-white text-[#806300] shadow"
                      : "text-[#3f3b35] hover:bg-white/60"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 grid gap-7 xl:grid-cols-3">
            {orders.map((order, index) => (
              <article
                key={order.room}
                className={`room-order-card room-service-fade rounded-2xl border border-[#d9cfbd] border-l-4 bg-white p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl ${borderClass(
                  order.border
                )}`}
                style={{ animationDelay: `${0.14 + index * 0.08}s` }}
              >
                <div className="mb-5 flex items-start justify-between">
                  <span
                    className={`rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wider ${statusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>

                  <div className="text-right">
                    <p className="text-xs font-bold uppercase text-[#8a7d6a]">
                      {order.timeLabel}
                    </p>
                    <p className="font-bold text-[#806300]">{order.time}</p>
                  </div>
                </div>

                <h3 className="text-2xl font-extrabold">{order.room}</h3>
                <p className="mt-1 text-[#57534e]">{order.guest}</p>

                <div className="mt-6 space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex justify-between gap-4 text-lg"
                    >
                      <p>{item.name}</p>
                      <p className="text-[#8a8175]">{item.price}</p>
                    </div>
                  ))}
                </div>

                {order.progress && (
                  <div className="mt-6">
                    <div className="h-2 overflow-hidden rounded-full bg-[#e8e3d9]">
                      <div
                        className="room-service-progress h-full rounded-full bg-[#d8b328]"
                        style={{ width: `${order.progress}%` }}
                      />
                    </div>
                    <p className="mt-3 text-center text-sm font-medium text-[#57534e]">
                      {order.note}
                    </p>
                  </div>
                )}

                {!order.progress && order.status === "Pending" && (
                  <div className="mt-6 rounded-xl border-l-2 border-[#d8b328] bg-[#f4f1eb] p-4">
                    <p className="text-sm font-bold uppercase text-[#d8a900]">
                      Guest Note
                    </p>
                    <p className="mt-2 italic leading-6 text-[#57534e]">
                      “{order.note}”
                    </p>
                  </div>
                )}

                {!order.progress && order.status === "Ready" && (
                  <div className="mt-6 rounded-xl bg-green-50 p-4 font-bold text-green-700">
                    ◎ {order.note}
                  </div>
                )}

                <div className="my-6 h-px bg-[#d9cfbd]" />

                <div className="flex gap-3">
                  <button
                    className={`flex-1 rounded-xl px-5 py-4 text-lg font-semibold transition hover:-translate-y-1 hover:shadow-lg ${
                      order.status === "Ready"
                        ? "bg-[#806300] text-white"
                        : "bg-[#3d4b61] text-[#f2c426]"
                    }`}
                  >
                    {order.action}
                  </button>

                  {order.status !== "Ready" && (
                    <button className="rounded-xl border border-[#d9cfbd] bg-white px-5 py-4 text-xl transition hover:bg-[#faf8f3]">
                      {order.status === "Pending" ? "⋮" : "▣"}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>

          <section className="room-service-fade delay-150 mt-12 overflow-hidden rounded-2xl border border-[#d9cfbd] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#d9cfbd] px-6 py-5">
              <h2 className="text-2xl font-bold">Order History</h2>
              <button className="font-semibold text-[#806300]">
                View All History
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-[#faf8f3] text-sm font-bold uppercase tracking-wider text-[#7a705f]">
                  <tr>
                    <th className="px-6 py-5">ID</th>
                    <th className="px-6 py-5">Room</th>
                    <th className="px-6 py-5">Guest</th>
                    <th className="px-6 py-5">Items</th>
                    <th className="px-6 py-5">Total</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((row) => (
                    <tr
                      key={row.id}
                      className="border-t border-[#e6dfd2] transition hover:bg-[#faf8f3]"
                    >
                      <td className="px-6 py-6 font-bold">{row.id}</td>
                      <td className="px-6 py-6">{row.room}</td>
                      <td className="px-6 py-6">{row.guest}</td>
                      <td className="px-6 py-6">{row.items}</td>
                      <td className="px-6 py-6 font-medium">{row.total}</td>
                      <td className="px-6 py-6">
                        <span
                          className={`rounded-full px-4 py-2 text-sm font-bold ${
                            row.status === "Charged"
                              ? "text-[#806300]"
                              : "bg-[#ebe8e2] text-[#57534e]"
                          }`}
                        >
                          {row.status === "Charged" ? "◎ Charged" : row.status}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <button
                          className={`rounded-lg px-5 py-3 font-semibold transition hover:-translate-y-1 hover:shadow-lg ${
                            row.action === "Charge to Folio"
                              ? "border border-[#806300] text-[#806300]"
                              : "text-[#8a8175]"
                          }`}
                        >
                          {row.action}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}