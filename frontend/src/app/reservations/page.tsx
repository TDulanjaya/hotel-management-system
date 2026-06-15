"use client";
import AppSidebar from "@/components/layout/AppSidebar";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: "▦" },
  { name: "Rooms", href: "/rooms", icon: "▰" },
  { name: "Reservations", href: "/reservations", icon: "▣" },
  { name: "Guests", href: "/guests", icon: "♙" },
  { name: "Folios/Billing", href: "/folio", icon: "▤" },
  { name: "Room Service", href: "/room-service", icon: "⌂" },
  { name: "Inventory", href: "/inventory", icon: "▥" },
  { name: "Restaurant Tables", href: "/restaurant", icon: "▧" },
  { name: "Parking", href: "/parking", icon: "P" },
  { name: "Reports", href: "/reports", icon: "▨" },
];

const reservations = [
  {
    id: "RSV-1024",
    guest: "Julian Vane",
    room: "501 · Presidential Suite",
    dates: "Jun 15 - Jun 18",
    source: "Direct Booking",
    status: "Confirmed",
    amount: "$3,750",
  },
  {
    id: "RSV-1025",
    guest: "Nimali Silva",
    room: "308 · Deluxe King",
    dates: "Jun 16 - Jun 19",
    source: "Booking.com",
    status: "Pending",
    amount: "$1,350",
  },
  {
    id: "RSV-1026",
    guest: "WEDDING2026 Group",
    room: "15 Rooms Blocked",
    dates: "Jun 20 - Jun 22",
    source: "Corporate/Event",
    status: "Group Block",
    amount: "$12,800",
  },
  {
    id: "RSV-1027",
    guest: "Alexander Thorne",
    room: "215 · Standard Twin",
    dates: "Jun 14 - Jun 17",
    source: "Expedia",
    status: "Checked In",
    amount: "$840",
  },
];

function statusClass(status: string) {
  if (status === "Confirmed") return "bg-green-100 text-green-700";
  if (status === "Pending") return "bg-yellow-100 text-yellow-700";
  if (status === "Group Block") return "bg-blue-100 text-blue-700";
  if (status === "Checked In") return "bg-slate-200 text-slate-700";
  return "bg-slate-100 text-slate-700";
}

export default function ReservationsPage() {
  const [openModal, setOpenModal] = useState(true);

  return (
    <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
        <AppSidebar />

      <main className={`lg:ml-[280px] ${openModal ? "reservation-page-blur" : ""}`}>
        <header className="sticky top-0 z-20 flex h-[80px] items-center justify-between border-b border-[#d9cfbd] bg-[#f8f5ef]/95 px-8 backdrop-blur-xl">
          <div className="hidden xl:block">
            <p className="text-xl font-semibold leading-tight">
              LuxeStay <br /> Operations
            </p>
          </div>

          <div className="flex flex-1 justify-center">
            <div className="flex w-full max-w-[520px] items-center gap-3 rounded-full border border-[#d9cfbd] bg-white px-5 py-3 shadow-sm">
              <span className="text-xl">⌕</span>
              <input
                type="text"
                placeholder="Search guests, reservations, rooms..."
                className="w-full bg-transparent text-lg outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="text-2xl transition hover:scale-110">♧</button>

            <button
              onClick={() => setOpenModal(true)}
              className="rounded-xl bg-[#806300] px-8 py-4 text-lg font-semibold text-white transition hover:-translate-y-1 hover:bg-[#6b5400] hover:shadow-xl"
            >
              + New Reservation
            </button>

            <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-[#d8b328] bg-white shadow">
              🧑
            </div>
          </div>
        </header>

        <section className="px-8 py-10">
          <div className="reservation-fade mb-10 flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
            <div>
              <h1 className="text-5xl font-extrabold tracking-tight">
                Reservations
              </h1>
              <p className="mt-2 text-xl text-[#3f3b35]">
                Manage room bookings, guest stays, group blocks, and check-in flow.
              </p>
            </div>

            <div className="flex gap-4">
              <button className="rounded-xl border border-[#d9cfbd] bg-white px-6 py-3 text-lg font-semibold text-[#4c4032] transition hover:-translate-y-1 hover:shadow-lg">
                Calendar View
              </button>
              <button className="rounded-xl bg-[#d8b328] px-6 py-3 text-lg font-semibold text-[#4c3a00] transition hover:-translate-y-1 hover:shadow-lg">
                Table View
              </button>
            </div>
          </div>

          <div className="reservation-fade delay-100 mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-[#d9cfbd] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#6b6256]">
                Today Arrivals
              </p>
              <h2 className="mt-3 text-4xl font-extrabold text-[#806300]">
                18
              </h2>
              <p className="mt-2 text-sm text-[#57534e]">
                Expected check-ins
              </p>
            </div>

            <div className="rounded-2xl border border-[#d9cfbd] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#6b6256]">
                Today Departures
              </p>
              <h2 className="mt-3 text-4xl font-extrabold text-[#806300]">
                12
              </h2>
              <p className="mt-2 text-sm text-[#57534e]">
                Before 11:00 AM
              </p>
            </div>

            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wider text-red-700">
                Conflicts
              </p>
              <h2 className="mt-3 text-4xl font-extrabold text-red-700">
                1
              </h2>
              <p className="mt-2 text-sm text-red-600">
                Needs manager review
              </p>
            </div>

            <div className="rounded-2xl border border-[#d9cfbd] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#6b6256]">
                Group Blocks
              </p>
              <h2 className="mt-3 text-4xl font-extrabold text-[#806300]">
                3
              </h2>
              <p className="mt-2 text-sm text-[#57534e]">
                Event reservations
              </p>
            </div>
          </div>

          <section className="reservation-fade delay-150 rounded-2xl border border-[#d9cfbd] bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Reservation List</h2>
                <p className="mt-1 text-[#57534e]">
                  Latest bookings and room allocations
                </p>
              </div>

              <div className="flex gap-3">
                <button className="rounded-xl bg-[#ece9e2] px-4 py-2 font-semibold text-[#4c4032]">
                  Filter
                </button>
                <button className="rounded-xl bg-[#ece9e2] px-4 py-2 font-semibold text-[#4c4032]">
                  Export
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#e6dfd2]">
              <table className="w-full text-left">
                <thead className="bg-[#f3efe6] text-sm uppercase tracking-wider text-[#57534e]">
                  <tr>
                    <th className="px-5 py-4">Reservation</th>
                    <th className="px-5 py-4">Room</th>
                    <th className="px-5 py-4">Dates</th>
                    <th className="px-5 py-4">Source</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {reservations.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className="border-t border-[#eee8dc] transition hover:bg-[#faf7ef]"
                    >
                      <td className="px-5 py-5">
                        <p className="font-bold">{reservation.guest}</p>
                        <p className="text-sm text-[#57534e]">
                          {reservation.id}
                        </p>
                      </td>
                      <td className="px-5 py-5">{reservation.room}</td>
                      <td className="px-5 py-5">{reservation.dates}</td>
                      <td className="px-5 py-5">{reservation.source}</td>
                      <td className="px-5 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-bold ${statusClass(
                            reservation.status
                          )}`}
                        >
                          {reservation.status}
                        </span>
                      </td>
                      <td className="px-5 py-5 text-right font-bold">
                        {reservation.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </main>

      {openModal && (
        <div className="reservation-overlay fixed inset-0 z-50 flex items-center justify-center bg-[#101827]/45 px-4 backdrop-blur-[6px]">
          <div className="reservation-modal w-full max-w-[840px] overflow-hidden rounded-2xl border border-[#d4c7b2] bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#d9cfbd] px-10 py-8">
              <div>
                <h2 className="text-3xl font-bold">New Reservation</h2>
                <p className="mt-1 text-lg text-[#3f3b35]">
                  Complete guest details and room allocation
                </p>
              </div>

              <button
                onClick={() => setOpenModal(false)}
                className="text-4xl leading-none transition hover:rotate-90 hover:text-red-600"
              >
                ×
              </button>
            </div>

            <div className="grid gap-7 px-10 py-8 md:grid-cols-2">
              <div>
                <label className="mb-3 block text-lg font-medium">
                  Guest Lookup
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-[#cdbfaa] bg-[#fbfaf7] px-4 py-4 transition focus-within:border-[#806300] focus-within:ring-4 focus-within:ring-[#d8b328]/20">
                  <span className="text-2xl">♙</span>
                  <input
                    type="text"
                    placeholder="Find or add new guest..."
                    className="w-full bg-transparent text-lg outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-3 block text-lg font-medium">
                  Room Selection
                </label>
                <select className="w-full rounded-xl border border-[#cdbfaa] bg-[#fbfaf7] px-4 py-4 text-lg outline-none transition focus:border-[#806300] focus:ring-4 focus:ring-[#d8b328]/20">
                  <option>Select a room...</option>
                  <option>402 · Presidential Suite</option>
                  <option>308 · Deluxe King</option>
                  <option>215 · Standard Twin</option>
                  <option>501 · Executive Suite</option>
                </select>
              </div>

              <div>
                <label className="mb-3 block text-lg font-medium">
                  Check-in Date
                </label>
                <input
                  type="date"
                  className="w-full rounded-xl border border-[#cdbfaa] bg-[#fbfaf7] px-4 py-4 text-lg outline-none transition focus:border-[#806300] focus:ring-4 focus:ring-[#d8b328]/20"
                />
              </div>

              <div>
                <label className="mb-3 block text-lg font-medium">
                  Check-out Date
                </label>
                <input
                  type="date"
                  className="w-full rounded-xl border border-[#cdbfaa] bg-[#fbfaf7] px-4 py-4 text-lg outline-none transition focus:border-[#806300] focus:ring-4 focus:ring-[#d8b328]/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-3 block text-lg font-medium">
                  Source
                </label>

                <div className="flex flex-wrap gap-6 text-lg">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="radio" name="source" className="accent-[#806300]" />
                    Direct Booking
                  </label>

                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="radio" name="source" className="accent-[#806300]" />
                    OTA (Expedia/Booking)
                  </label>

                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="radio" name="source" className="accent-[#806300]" />
                    Corporate
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-3 block text-lg font-medium">
                  Additional Notes
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter dietary requirements, pillow preferences, or special requests..."
                  className="w-full resize-none rounded-xl border border-[#cdbfaa] bg-[#fbfaf7] px-4 py-4 text-lg outline-none placeholder:text-slate-500 transition focus:border-[#806300] focus:ring-4 focus:ring-[#d8b328]/20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-5 border-t border-[#d9cfbd] bg-[#faf8f3] px-10 py-7">
              <button
                onClick={() => setOpenModal(false)}
                className="rounded-xl border border-[#cdbfaa] bg-white px-8 py-4 text-lg font-medium transition hover:-translate-y-1 hover:bg-[#f3efe6] hover:shadow-lg"
              >
                Cancel
              </button>

              <button
                onClick={() => setOpenModal(false)}
                className="rounded-xl bg-[#d8b328] px-10 py-4 text-lg font-bold text-black transition hover:-translate-y-1 hover:bg-[#f2c426] hover:shadow-xl"
              >
                Confirm Reservation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}