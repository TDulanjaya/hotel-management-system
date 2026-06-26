"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AppSidebar from "@/components/layout/Sidebar";
import { getUser } from "@/utils/auth";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: "▦" },
  { name: "Rooms", href: "/rooms", icon: "▰" },
  { name: "Reservations", href: "/reservations", icon: "▣" },
  { name: "Guests", href: "/guests", icon: "♙" },
  { name: "Folios/Billing", href: "/folio", icon: "▤" },
  { name: "Room Service", href: "/room-service", icon: "⌂" },
  { name: "INVENTORY", href: "/inventory", icon: "▥" },
  { name: "Reports", href: "/reports", icon: "▧" },
];

const alerts = [
  {
    title: "Low Stock: Linens",
    description: "Housekeeping inventory below 15%",
    tone: "red",
  },
  {
    title: "AC Unit - Suite 402",
    description: "Scheduled maintenance pending",
    tone: "slate",
  },
  {
    title: "5 Room Service Orders",
    description: "Waiting for kitchen dispatch",
    tone: "amber",
  },
];

const activities = [
  {
    title: "Guest Check-in: Mr. Julian Vane",
    description: "Assigned to Presidential Suite 501. Welcome amenity delivered.",
    time: "10:24 AM",
    icon: "✓",
  },
  {
    title: "Folio Settlement: Event ID #4920",
    description: "Global Tech Symposium final balance of Rs 4,500 settled via Wire Transfer.",
    time: "09:15 AM",
    icon: "↔",
  },
  {
    title: "Room Service Requested",
    description: "Room 304: Breakfast for two. Status: In Preparation.",
    time: "08:42 AM",
    icon: "⌂",
  },
];

const flowItems = [
  { label: "Check-ins", note: "18 scheduled today", value: "18", icon: "↳" },
  { label: "Check-outs", note: "12 due by 11:00 AM", value: "12", icon: "↲" },
  { label: "PARKING", note: "42/50 slots occupied", value: "85%", icon: "P" },
  { label: "Active Events", note: "Ballroom A & Terrace", value: "2", icon: "▣" },
];

const occupancyBars = [
  { day: "MON", value: 62 },
  { day: "TUE", value: 68 },
  { day: "WED", value: 76 },
  { day: "THU", value: 92 },
  { day: "FRI", value: 79 },
  { day: "SAT", value: 73 },
  { day: "SUN", value: 88 },
];

export default function DashboardPage() {
  const [user, setUser] = useState<{name: string, role: string, email: string} | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-[#111827]">
      <AppSidebar />

      <main className="lg:ml-[280px]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-[#e6dfd2] bg-[#f7f4ee]/90 px-6 backdrop-blur-xl lg:px-8">
          <div className="flex flex-1 items-center gap-4">
            <div className="hidden w-full max-w-[470px] items-center gap-3 rounded-full bg-[#ece9e2] px-5 py-3 md:flex">
              <span className="text-slate-500">⌕</span>
              <input
                type="text"
                placeholder="Search rooms, guests, or folios..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="rounded-full p-2 transition hover:bg-[#ece9e2]">
              ♧
            </button>

            <button className="rounded-full p-2 transition hover:bg-[#ece9e2]">
              ▦
            </button>

            <div className="hidden h-8 w-px bg-[#ddd5c8] md:block" />

            <button className="hidden rounded-xl px-4 py-2 text-sm font-medium text-[#6c5200] transition hover:bg-[#ece9e2] md:block">
              New Reservation
            </button>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold leading-none">{user?.name || "Loading..."}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {user?.role ? user.role.replace(/_/g, ' ') : "..."}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-[#d8b328] bg-white text-lg font-extrabold uppercase text-[#735c00] shadow-sm">
                {user?.name ? user.name.charAt(0) : "•"}
              </div>
            </div>
          </div>
        </header>

        <section className="px-6 py-10 lg:px-8">
          <div className="dashboard-fade mb-10 flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight text-black">
                Operations Overview
              </h2>
              <p className="mt-2 text-base text-[#57534e]">
                Good Morning, {user?.name ? user.name.split(' ')[0] : '...'}. Here is the operational status for today.
              </p>
            </div>

            <div className="rounded-2xl border border-[#e6dfd2] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#57534e]">
                Daily Revenue
              </p>
              <h3 className="mt-2 text-3xl font-extrabold text-[#8a6b00]">
                Rs 12,450
              </h3>
              <p className="mt-1 text-sm font-semibold text-green-600">
                ↗ +8.4%
              </p>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
            <section className="dashboard-fade rounded-2xl border border-[#e6dfd2] bg-white p-6 shadow-sm delay-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Room Inventory</h3>
                  <p className="mt-1 text-sm text-[#57534e]">
                    Live occupancy and availability status
                  </p>
                </div>
                <span className="text-2xl text-[#d8a900]">▰</span>
              </div>

              <div className="mt-7 grid gap-5 md:grid-cols-3">
                <div className="rounded-xl border border-[#e6dfd2] bg-[#f2f0ec] p-6">
                  <p className="text-sm text-[#3f3b35]">Total Capacity</p>
                  <div className="mt-3 flex items-end gap-2">
                    <strong className="text-4xl font-extrabold">250</strong>
                    <span className="mb-1 text-sm text-[#57534e]">Rooms</span>
                  </div>
                </div>

                <div className="rounded-xl border border-[#e6cf77] bg-[#fff6d8] p-6">
                  <p className="text-sm text-[#3f3b35]">Available</p>
                  <div className="mt-3 flex items-end gap-2">
                    <strong className="text-4xl font-extrabold text-[#806300]">
                      42
                    </strong>
                    <span className="mb-1 text-sm text-[#57534e]">Units</span>
                  </div>
                </div>

                <div className="rounded-xl border border-[#e6dfd2] bg-[#f2f3f4] p-6">
                  <p className="text-sm text-[#3f3b35]">Occupied</p>
                  <div className="mt-3 flex items-end gap-2">
                    <strong className="text-4xl font-extrabold">208</strong>
                    <span className="mb-1 text-sm text-[#57534e]">83.2%</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-3 flex justify-between text-xs font-bold uppercase tracking-[0.18em] text-[#57534e]">
                  <span>Occupancy Utilization</span>
                  <span>Near Capacity</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-[#ebe7dd]">
                  <div className="dashboard-progress h-full rounded-full bg-gradient-to-r from-[#806300] via-[#b89512] to-[#f3d766]" />
                </div>
              </div>

              <div className="mt-10 h-36 rounded-xl bg-gradient-to-br from-[#faf8f3] to-white" />
            </section>

            <section className="dashboard-fade rounded-2xl border border-[#e6dfd2] bg-white p-6 shadow-sm delay-150">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold">Critical Alerts</h3>
                <span className="h-2 w-2 rounded-full bg-red-600 dashboard-pulse" />
              </div>

              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.title}
                    className={`rounded-xl border p-4 ${
                      alert.tone === "red"
                        ? "border-red-200 bg-red-50 text-red-700"
                        : alert.tone === "amber"
                        ? "border-amber-100 bg-[#f4f1eb] text-[#4c4032]"
                        : "border-slate-100 bg-[#f4f1eb] text-[#4c4032]"
                    }`}
                  >
                    <p className="font-bold">{alert.title}</p>
                    <p className="mt-1 text-sm opacity-80">{alert.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#57534e]">
                  Operations Fast-Track
                </p>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <button className="rounded-xl bg-[#806300] px-4 py-5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
                    ↪ <br /> Check-in
                  </button>

                  <button className="rounded-xl bg-[#2f3b52] px-4 py-5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
                    ▤ <br /> Add Folio
                  </button>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.85fr]">
            <section className="dashboard-fade rounded-2xl border border-[#e6dfd2] bg-white p-6 shadow-sm delay-200">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="text-2xl font-bold">Occupancy Trends</h3>
                <button className="rounded-lg bg-[#ece9e2] px-4 py-2 text-xs font-semibold text-[#3f3b35]">
                  Last 7 Days⌄
                </button>
              </div>

              <div className="flex h-64 items-end justify-between gap-4">
                {occupancyBars.map((bar) => (
                  <div key={bar.day} className="flex h-full flex-1 flex-col justify-end">
                    <div className="relative flex flex-1 items-end justify-center">
                      {bar.day === "THU" && (
                        <span className="absolute -top-7 rounded-md bg-black px-2 py-1 text-xs text-white">
                          92%
                        </span>
                      )}

                      <div
                        className={`dashboard-bar w-full max-w-[52px] rounded-t-lg ${
                          bar.day === "THU" ? "bg-[#806300]" : "bg-[#fff6d8]"
                        }`}
                        style={{ height: `${bar.value}%` }}
                      />
                    </div>

                    <p className="mt-4 text-center text-xs font-semibold text-[#57534e]">
                      {bar.day}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="dashboard-fade rounded-2xl border border-[#e6dfd2] bg-white p-6 shadow-sm delay-250">
              <h3 className="text-2xl font-bold">Revenue Mix</h3>

              <div className="mt-10 flex items-center justify-center gap-8">
                <div className="dashboard-donut flex h-48 w-48 items-center justify-center rounded-full">
                  <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#57534e]">
                      Total
                    </p>
                    <strong className="mt-2 text-2xl">Rs 12.4k</strong>
                  </div>
                </div>

                <div className="space-y-4 text-sm font-semibold">
                  <p>
                    <span className="mr-2 inline-block h-3 w-3 rounded-full bg-[#806300]" />
                    Rooms 70%
                  </p>
                  <p>
                    <span className="mr-2 inline-block h-3 w-3 rounded-full bg-[#d8b328]" />
                    F&B 20%
                  </p>
                  <p>
                    <span className="mr-2 inline-block h-3 w-3 rounded-full bg-[#59657a]" />
                    Events 10%
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.6fr]">
            <section className="dashboard-fade rounded-2xl border border-[#e6dfd2] bg-white p-6 shadow-sm delay-300">
              <h3 className="text-2xl font-bold">Daily Flow</h3>

              <div className="mt-7 space-y-5">
                {flowItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl font-bold ${
                          item.label === "PARKING"
                            ? "bg-[#fff6d8] text-[#806300]"
                            : "bg-[#eef2ff] text-[#3d4b61]"
                        }`}
                      >
                        {item.icon}
                      </div>

                      <div>
                        <p className="font-bold">{item.label}</p>
                        <p className="text-sm text-[#57534e]">{item.note}</p>
                      </div>
                    </div>

                    <strong className="text-2xl">{item.value}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="dashboard-fade rounded-2xl border border-[#e6dfd2] bg-white p-6 shadow-sm delay-350">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="text-2xl font-bold">Recent Activity</h3>
                <button className="text-sm font-bold text-[#806300]">
                  View All Logs
                </button>
              </div>

              <div className="space-y-7">
                {activities.map((activity) => (
                  <div key={activity.title} className="flex gap-5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d8b328] text-sm font-bold text-white">
                      {activity.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between gap-4">
                        <h4 className="font-bold">{activity.title}</h4>
                        <span className="text-xs text-[#57534e]">{activity.time}</span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-[#57534e]">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}