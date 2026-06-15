"use client";
import AppSidebar from "@/components/layout/AppSidebar";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: "▦" },
  { name: "Rooms", href: "/rooms", icon: "▰" },
  { name: "Reservations", href: "/reservations", icon: "▣" },
  { name: "Parking", href: "/parking", icon: "P" },
  { name: "Events", href: "/events", icon: "▣" },
  { name: "Settings", href: "/settings", icon: "⚙" },
];

const stats = [
  {
    title: "Current Occupancy",
    value: "85%",
    note: "High",
    icon: "P",
    danger: false,
  },
  {
    title: "Available Slots",
    value: "42",
    note: "/ 280",
    icon: "▰",
    danger: false,
  },
  {
    title: "Reserved Event",
    value: "115",
    note: "slots",
    icon: "▣",
    danger: false,
  },
  {
    title: "In Maintenance",
    value: "08",
    note: "repair slots",
    icon: "♨",
    danger: true,
  },
];

const sectionA = [
  { id: "A-101", status: "occupied" },
  { id: "A-102", status: "occupied" },
  { id: "A-103", status: "reserved" },
  { id: "A-104", status: "free" },
  { id: "A-105", status: "free" },
  { id: "A-106", status: "repair" },
];

const sectionB = [
  { id: "B-201", status: "occupied" },
  { id: "B-202", status: "occupied" },
  { id: "B-203", status: "occupied" },
  { id: "B-204", status: "occupied" },
  { id: "B-205", status: "occupied" },
  { id: "B-206", status: "free" },
  { id: "B-207", status: "free" },
  { id: "B-208", status: "free" },
];

function slotClass(status: string) {
  if (status === "occupied") {
    return "bg-[#101827] text-white border-[#101827] shadow-md";
  }

  if (status === "reserved") {
    return "bg-[#d8b328] text-[#4c3a00] border-[#d8b328] shadow-md";
  }

  if (status === "repair") {
    return "bg-red-700 text-white border-red-700";
  }

  return "bg-transparent text-[#7a705f] border-dashed border-[#cdbfaa] hover:bg-white";
}

export default function ParkingPage() {
  const [selectedSlot, setSelectedSlot] = useState("A-103");

  return (
    <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
      <AppSidebar />

      <main className="lg:ml-[280px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#d9cfbd] bg-[#f8f5ef]/95 px-8 backdrop-blur-xl">
          <div className="flex flex-1 justify-start">
            <div className="flex w-full max-w-[470px] items-center gap-4 rounded-full border border-[#cdbfaa] bg-[#f2f0ec] px-6 py-4 shadow-sm">
              <span className="text-2xl">⌕</span>
              <input
                type="text"
                placeholder="Search vehicle, room, or guest..."
                className="w-full bg-transparent text-lg outline-none placeholder:text-[#8a8175]"
              />
            </div>
          </div>

          <div className="flex items-center gap-7">
            <button className="relative text-2xl transition hover:scale-110">
              ♧
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-600" />
            </button>

            <div className="hidden h-9 w-px bg-[#d9cfbd] md:block" />

            <div className="hidden text-right xl:block">
              <p className="text-lg font-medium">Eleanor Vance</p>
              <p className="text-xs uppercase text-[#57534e]">Fleet Manager</p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#d8b328] bg-white shadow">
              🧑
            </div>
          </div>
        </header>

        <section className="grid min-h-[calc(100vh-76px)] xl:grid-cols-[1fr_390px]">
          <div>
            <div className="parking-fade grid border-b border-[#d9cfbd] md:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.title}
                  className={`parking-stat-card flex items-center gap-6 border-r border-[#d9cfbd] bg-white p-8 ${
                    stat.danger ? "border-2 border-red-600" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-full text-3xl font-extrabold ${
                      stat.danger
                        ? "bg-red-100 text-red-700"
                        : "bg-[#f5eed9] text-[#806300]"
                    }`}
                  >
                    {stat.icon}
                  </div>

                  <div>
                    <p className="text-lg uppercase text-[#3f3b35]">
                      {stat.title}
                    </p>

                    <div className="mt-2 flex items-end gap-2">
                      <h2 className="text-2xl font-bold">{stat.value}</h2>
                      <span
                        className={`mb-1 text-lg ${
                          stat.danger
                            ? "text-red-700"
                            : stat.note === "High"
                            ? "text-red-600"
                            : "text-[#3f3b35]"
                        }`}
                      >
                        {stat.note}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <section className="parking-fade delay-100 border-b border-[#d9cfbd] bg-white px-10 py-8">
              <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
                <div>
                  <h1 className="text-xl font-medium">Level 1: Main Plaza</h1>
                  <p className="mt-1 text-lg text-[#3f3b35]">
                    Real-time slot availability map
                  </p>
                </div>

                <div className="flex flex-wrap gap-5 text-lg">
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 rounded-full bg-emerald-500" />
                    Free
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 rounded-full bg-[#101827]" />
                    Occupied
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 rounded-full bg-[#d8b328]" />
                    Reserved
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 rounded-full bg-red-700" />
                    Repair
                  </span>
                </div>
              </div>
            </section>

            <section className="px-10 py-10">
              <div className="parking-fade delay-150 mb-12">
                <h2 className="mb-5 text-xl font-extrabold uppercase tracking-[0.18em] text-[#3f3324]">
                  Section A (Valet Only)
                </h2>

                <div className="grid max-w-[760px] grid-cols-2 gap-4 md:grid-cols-5">
                  {sectionA.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`parking-slot relative rounded-lg border-2 px-6 py-5 text-xl font-extrabold transition hover:-translate-y-1 hover:shadow-xl ${slotClass(
                        slot.status
                      )} ${
                        selectedSlot === slot.id
                          ? "ring-4 ring-[#d8b328]/30"
                          : ""
                      }`}
                    >
                      {slot.status === "repair" ? "⚠" : slot.id}

                      {slot.status === "reserved" && (
                        <span className="absolute right-2 top-2 text-sm">▣</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="parking-fade delay-200 mb-10">
                <h2 className="mb-5 text-xl font-extrabold uppercase tracking-[0.18em] text-[#3f3324]">
                  Section B (General Guest)
                </h2>

                <div className="grid max-w-[760px] grid-cols-2 gap-4 md:grid-cols-5">
                  {sectionB.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`parking-slot rounded-lg border-2 px-6 py-5 text-xl font-extrabold transition hover:-translate-y-1 hover:shadow-xl ${slotClass(
                        slot.status
                      )} ${
                        selectedSlot === slot.id
                          ? "ring-4 ring-[#d8b328]/30"
                          : ""
                      }`}
                    >
                      {slot.id}
                    </button>
                  ))}
                </div>
              </div>

              <div className="parking-fade delay-250 parking-visualizer relative max-w-[760px] overflow-hidden rounded-2xl border-4 border-white bg-[#d9d5cc] p-8 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-black/20" />

                <div className="relative z-10 flex min-h-[240px] flex-col items-center justify-center text-center">
                  <div className="text-6xl text-[#806300]">▱</div>
                  <h3 className="mt-6 text-2xl font-bold">
                    Interactive Floor Map Visualizer
                  </h3>

                  <button className="mt-6 rounded-full border-2 border-[#806300] bg-white/40 px-10 py-3 text-lg font-semibold text-[#806300] backdrop-blur transition hover:-translate-y-1 hover:bg-white hover:shadow-xl">
                    View Full Schematic
                  </button>
                </div>
              </div>
            </section>
          </div>

          <aside className="border-l border-[#d9cfbd] bg-white">
            <section className="parking-fade delay-100 border-b border-[#d9cfbd]">
              <div className="bg-[#d8b328] px-9 py-6">
                <h2 className="text-xl font-medium text-[#4c3a00]">
                  Vehicle Check-In
                </h2>
              </div>

              <div className="space-y-6 p-9">
                <div>
                  <label className="mb-3 block text-lg font-extrabold uppercase">
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. LUX-8899"
                    className="w-full rounded-xl border border-[#cdbfaa] bg-[#f2f0ec] px-5 py-4 text-lg outline-none transition focus:border-[#806300] focus:ring-4 focus:ring-[#d8b328]/20"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-lg font-extrabold uppercase">
                    Guest Room / ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Suite 402"
                    className="w-full rounded-xl border border-[#cdbfaa] bg-[#f2f0ec] px-5 py-4 text-lg outline-none transition focus:border-[#806300] focus:ring-4 focus:ring-[#d8b328]/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-3 block text-lg font-extrabold uppercase">
                      Entry Time
                    </label>
                    <input
                      type="time"
                      defaultValue="09:43"
                      className="w-full rounded-xl border border-[#cdbfaa] bg-[#f2f0ec] px-4 py-4 text-lg outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-lg font-extrabold uppercase">
                      Entry Date
                    </label>
                    <input
                      type="date"
                      defaultValue="2026-06-10"
                      className="w-full rounded-xl border border-[#cdbfaa] bg-[#f2f0ec] px-4 py-4 text-lg outline-none"
                    />
                  </div>
                </div>

                <button className="w-full rounded-xl bg-[#101827] px-6 py-5 text-xl font-extrabold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#263248] hover:shadow-xl">
                  Register Entry
                </button>

                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-[#d9cfbd]" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em]">
                    Or Action
                  </span>
                  <div className="h-px flex-1 bg-[#d9cfbd]" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="rounded-xl border border-[#cdbfaa] bg-white px-5 py-4 text-lg font-bold transition hover:-translate-y-1 hover:shadow-lg">
                    Scan Plate
                  </button>

                  <button className="rounded-xl border border-[#cdbfaa] bg-white px-5 py-4 text-lg font-bold transition hover:-translate-y-1 hover:shadow-lg">
                    Manual Slot
                  </button>
                </div>
              </div>
            </section>

            <section className="parking-fade delay-200 p-9">
              <h2 className="mb-6 flex items-center gap-3 text-xl">
                ▣ Quick Billing
              </h2>

              <div className="space-y-5">
                <button className="parking-billing-card w-full rounded-xl border border-[#d9cfbd] bg-white p-5 text-left transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">Add to Guest Folio</h3>
                      <p className="mt-1 text-lg text-[#3f3b35]">
                        Automated daily parking charge
                      </p>
                    </div>
                    <span className="text-3xl text-[#cdbfaa]">›</span>
                  </div>
                </button>

                <button className="parking-billing-card w-full rounded-xl border border-[#d9cfbd] bg-white p-5 text-left transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">Add to Master Event Ledger</h3>
                      <p className="mt-1 text-lg text-[#3f3b35]">
                        Charge parking block to organizer
                      </p>
                    </div>
                    <span className="text-3xl text-[#cdbfaa]">›</span>
                  </div>
                </button>

                <button className="parking-billing-card w-full rounded-xl border border-[#d9cfbd] bg-white p-5 text-left transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">Temporary Visitor Pass</h3>
                      <p className="mt-1 text-lg text-[#3f3b35]">
                        Create short-stay parking ticket
                      </p>
                    </div>
                    <span className="text-3xl text-[#cdbfaa]">›</span>
                  </div>
                </button>
              </div>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}