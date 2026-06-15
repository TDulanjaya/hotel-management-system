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
  { name: "Parking", href: "/parking", icon: "P" },
  { name: "Events", href: "/events", icon: "▣" },
  { name: "Settings", href: "/settings", icon: "⚙" },
];

const guests = [
  {
    id: 1,
    initials: "JV",
    name: "Julian Vane",
    contact: "+1 202 555 0147",
    email: "j.vane@enterprise.com",
    level: "VIP Level 2",
    room: "Suite 402",
    status: "VIP BLACK ELITE",
    type: "CORPORATE",
    active: true,
    warning: false,
  },
  {
    id: 2,
    initials: "ER",
    name: "Eleanor Rigby",
    contact: "+44 7700 900541",
    email: "eleanor.r@gmail.com",
    level: "Standard Member",
    room: "Not Checked In",
    status: "STANDARD",
    type: "DIRECT",
    active: false,
    warning: false,
  },
  {
    id: 3,
    initials: "MH",
    name: "Marcus Holloway",
    contact: "+1 415 555 0192",
    email: "marcus.h@techcorp.io",
    level: "Loyalty Gold",
    room: "Room 1105",
    status: "LOYALTY GOLD",
    type: "CORPORATE",
    active: true,
    warning: false,
  },
  {
    id: 4,
    initials: "SJ",
    name: "Sarah Jenkins",
    contact: "+61 491 570 110",
    email: "sarah.j@outlook.com",
    level: "Flagged Payment",
    room: "Room 201 Owed",
    status: "PAYMENT ISSUE",
    type: "DIRECT",
    active: false,
    warning: true,
  },
];

const bookingHistory = [
  {
    date: "Oct 24 - Oct 28, 2023",
    detail: "Penthouse Suite (501) · Corporate Rate",
    code: "CODE: VANGUARD-EX-01",
  },
  {
    date: "Aug 12 - Aug 15, 2023",
    detail: "Deluxe King (302) · Weekend Package",
    code: "",
  },
  {
    date: "May 01 - May 04, 2023",
    detail: "Junior Suite (404) · Corporate Rate",
    code: "",
  },
];

export default function GuestsPage() {
  const [selectedGuest, setSelectedGuest] = useState(guests[0]);

  return (
    <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
        <AppSidebar />
      <main className="lg:ml-[280px]">
        <header className="sticky top-0 z-20 flex h-[80px] items-center justify-between border-b border-[#d9cfbd] bg-[#f8f5ef]/95 px-8 backdrop-blur-xl">
          <div className="hidden xl:block">
            <p className="text-2xl font-semibold leading-tight">
              LuxeStay <br /> Operations
            </p>
          </div>

          <div className="flex flex-1 justify-center">
            <div className="flex w-full max-w-[520px] items-center gap-3 rounded-full border border-[#d9cfbd] bg-white px-5 py-3 shadow-sm">
              <span className="text-xl">⌕</span>
              <input
                type="text"
                placeholder="Search guests, rooms, orders..."
                className="w-full bg-transparent text-lg outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="hidden items-center gap-2 text-lg font-semibold xl:flex">
              ? Support
            </button>

            <button className="relative text-2xl transition hover:scale-110">
              ♧
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-600" />
            </button>

            <button className="text-2xl transition hover:scale-110">▦</button>

            <button className="rounded-xl bg-[#806300] px-8 py-4 text-lg font-bold text-white transition hover:-translate-y-1 hover:bg-[#6b5400] hover:shadow-xl">
              New Reservation
            </button>

            <div className="hidden border-l border-[#d9cfbd] pl-5 xl:block">
              <p className="font-bold">Alexander Reed</p>
              <p className="text-xs uppercase text-[#57534e]">Duty Manager</p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#d8b328] bg-white shadow">
              🧑
            </div>
          </div>
        </header>

        <section className="px-8 py-10">
          <div className="guest-fade mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
            <div>
              <h1 className="text-4xl font-extrabold">Guest Directory</h1>
              <p className="mt-2 text-lg text-[#57534e]">
                Manage and view detailed profiles for 1,248 registered guests.
              </p>
            </div>

            <div className="flex gap-4">
              <button className="rounded-xl border border-[#807464] bg-white px-7 py-3 text-lg font-semibold transition hover:-translate-y-1 hover:shadow-lg">
                ≡ Filter
              </button>

              <button className="rounded-xl bg-[#806300] px-7 py-3 text-lg font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#6b5400] hover:shadow-xl">
                ♙ Add Guest
              </button>
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[1.25fr_0.9fr]">
            <section className="guest-fade delay-100 overflow-hidden rounded-2xl border border-[#d9cfbd] bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-[#d9cfbd] px-8 py-5">
                <h2 className="text-lg font-bold">Guest Overview</h2>
                <p className="text-sm text-[#57534e]">Showing 8 of 1,248</p>
              </div>

              <div className="grid grid-cols-[1.3fr_1.2fr_1fr] border-b border-[#d9cfbd] px-8 py-5 text-sm font-bold uppercase tracking-wider text-[#2f2a24]">
                <span>Name</span>
                <span>Contact</span>
                <span>Current Room</span>
              </div>

              <div>
                {guests.map((guest) => {
                  const active = selectedGuest.id === guest.id;

                  return (
                    <button
                      key={guest.id}
                      onClick={() => setSelectedGuest(guest)}
                      className={`guest-row grid w-full grid-cols-[1.3fr_1.2fr_1fr] items-center border-b border-[#e6dfd2] px-8 py-7 text-left transition ${
                        active
                          ? "border-l-4 border-l-[#d8b328] bg-[#fbf7ed]"
                          : "hover:bg-[#faf8f3]"
                      }`}
                    >
                      <div className="flex items-center gap-5">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold ${
                            guest.warning
                              ? "bg-red-50 text-red-700"
                              : active
                              ? "bg-[#f1ead5] text-[#806300]"
                              : "bg-[#eef2ff] text-[#3d4b61]"
                          }`}
                        >
                          {guest.initials}
                        </div>

                        <div>
                          <p className="text-lg font-bold">{guest.name}</p>
                          <span
                            className={`mt-1 inline-block rounded-md px-2 py-1 text-sm ${
                              guest.warning
                                ? "bg-red-50 text-red-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {guest.level}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="font-medium">{guest.contact}</p>
                        <p className="mt-1 text-sm text-[#57534e]">
                          {guest.email}
                        </p>
                      </div>

                      <div
                        className={`font-semibold ${
                          guest.warning ? "text-red-600" : ""
                        }`}
                      >
                        <span
                          className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${
                            guest.active ? "bg-[#806300]" : "bg-slate-300"
                          }`}
                        />
                        {guest.room}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <aside className="guest-fade delay-150 overflow-hidden rounded-2xl border border-[#d9cfbd] border-l-4 border-l-[#d8b328] bg-white shadow-sm">
              <div className="border-b border-[#d9cfbd] p-8">
                <div className="flex items-start justify-between gap-5">
                  <div className="flex gap-6">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-[#ebe8e2] text-5xl font-extrabold text-[#806300]">
                      {selectedGuest.initials}
                    </div>

                    <div>
                      <h2 className="text-5xl font-extrabold leading-tight">
                        {selectedGuest.name.split(" ")[0]} <br />
                        {selectedGuest.name.split(" ")[1]}
                      </h2>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-md border border-[#d9cfbd] bg-[#f5eed9] px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#806300]">
                          {selectedGuest.status}
                        </span>

                        <span className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                          {selectedGuest.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button className="text-3xl transition hover:rotate-12 hover:text-[#806300]">
                    ✎
                  </button>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <button className="rounded-xl bg-[#806300] px-5 py-4 text-lg font-bold text-white transition hover:-translate-y-1 hover:bg-[#6b5400] hover:shadow-xl">
                    ▱ Message Guest
                  </button>

                  <button className="rounded-xl border border-[#807464] bg-white px-5 py-4 text-lg font-bold transition hover:-translate-y-1 hover:bg-[#faf8f3] hover:shadow-lg">
                    ⚿ Reset Keycard
                  </button>
                </div>
              </div>

              <div className="p-8">
                <h3 className="mb-6 text-sm font-extrabold uppercase tracking-[0.2em]">
                  Identification & Stay Data
                </h3>

                <div className="grid gap-7 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-[#57534e]">Passport / ID</p>
                    <p className="mt-2 text-xl font-bold">•••• •••• 4291 ◎</p>
                  </div>

                  <div>
                    <p className="text-sm text-[#57534e]">Total Lifetime Stays</p>
                    <p className="mt-2 text-2xl font-extrabold">42 Nights</p>
                  </div>

                  <div>
                    <p className="text-sm text-[#57534e]">Linked Parking</p>
                    <p className="mt-2 font-bold text-[#806300]">
                      Slot P-12{" "}
                      <span className="font-normal text-[#57534e]">
                        (Valet Active)
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-[#57534e]">Billing Account</p>
                    <p className="mt-2 text-lg font-bold">
                      Direct Bill: Vanguard Inc.
                    </p>
                  </div>
                </div>

                <div className="mt-10">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-sm font-extrabold uppercase tracking-[0.2em]">
                      Recent Booking History
                    </h3>
                    <button className="font-bold text-[#806300]">View All</button>
                  </div>

                  <div className="relative space-y-7 border-l-2 border-[#d9cfbd] pl-7">
                    {bookingHistory.map((booking, index) => (
                      <div key={booking.date} className="relative">
                        <span className="absolute -left-[35px] top-1 h-4 w-4 rounded-full border-4 border-[#f8f5ef] bg-[#cdbfaa]" />
                        {index === 0 && (
                          <span className="absolute -left-[35px] top-1 h-4 w-4 rounded-full bg-[#806300] guest-pulse" />
                        )}

                        <p className="text-lg font-bold">{booking.date}</p>
                        <p className="mt-1 text-sm text-[#57534e]">
                          {booking.detail}
                        </p>

                        {booking.code && (
                          <span className="mt-2 inline-block rounded-md bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                            {booking.code}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-10 rounded-2xl border border-[#d9cfbd] bg-[#faf8f3] p-6">
                  <h3 className="text-sm font-extrabold uppercase tracking-[0.2em]">
                    ! Internal Guest Notes
                  </h3>
                  <p className="mt-4 leading-7 text-[#57534e]">
                    Requires hypoallergenic bedding and extra quiet room
                    allocation. Confirm late checkout before arrival.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}