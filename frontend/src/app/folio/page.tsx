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
  { name: "Kitchen Orders", href: "/kitchen", icon: "▥" },
  { name: "Restaurant Tables", href: "/restaurant", icon: "▧" },
  { name: "Inventory", href: "/inventory", icon: "▤" },
  { name: "Games & Amenities", href: "/games", icon: "▨" },
  { name: "Parking", href: "/parking", icon: "P" },
  { name: "Events", href: "/events", icon: "▣" },
];

const ledgerRows = [
  {
    date: "Oct 21, 2023",
    category: "STAY",
    description: "Accommodation - Night 1 (Room 404)",
    reference: "#RES-8821",
    amount: "$450.00",
    type: "normal",
  },
  {
    date: "Oct 22, 2023",
    category: "STAY",
    description: "Accommodation - Night 2 (Room 404)",
    reference: "#RES-8821",
    amount: "$450.00",
    type: "normal",
  },
  {
    date: "Oct 23, 2023",
    category: "STAY",
    description: "Accommodation - Night 3 (Room 404)",
    reference: "#RES-8821",
    amount: "$450.00",
    type: "normal",
  },
  {
    date: "Oct 22, 2023",
    category: "DINING",
    description: "Room Service Dinner (Steak Frites, Wine)",
    reference: "Check #1092",
    amount: "$142.50",
    type: "normal",
  },
  {
    date: "Oct 23, 2023",
    category: "DINING",
    description: "Restaurant Lunch (L’Escale Brasserie)",
    reference: "Check #2234",
    amount: "$68.00",
    type: "normal",
  },
  {
    date: "Oct 23, 2023",
    category: "SPA",
    description: "Deep Tissue Massage (90 min)",
    reference: "Voucher #900",
    amount: "$220.00",
    type: "normal",
  },
  {
    date: "Oct 24, 2023",
    category: "LOYALTY",
    description: "Loyalty 10% Discount - Accommodations",
    reference: "System Trigger",
    amount: "-$135.00",
    type: "discount",
  },
];

function categoryClass(category: string) {
  if (category === "STAY") return "bg-blue-50 text-blue-700";
  if (category === "DINING") return "bg-green-50 text-green-700";
  if (category === "SPA") return "bg-purple-50 text-purple-700";
  if (category === "LOYALTY") return "bg-yellow-50 text-[#806300]";
  return "bg-slate-100 text-slate-700";
}

export default function FolioPage() {
  const [showToast, setShowToast] = useState(true);

  return (
    <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
        <AppSidebar />

      <main className="lg:ml-[280px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#d9cfbd] bg-[#f8f5ef]/95 px-8 backdrop-blur-xl">
          <div className="hidden xl:block">
            <p className="text-2xl font-semibold leading-tight">
              LuxeStay <br /> Operations
            </p>
          </div>

          <div className="flex flex-1 justify-center">
            <div className="flex w-full max-w-[470px] items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm">
              <span className="text-xl">⌕</span>
              <input
                type="text"
                placeholder="Search guests, folios, or rooms..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-xl transition hover:scale-110">♧</button>

            <button className="rounded-xl border border-[#3d4b61] bg-white px-5 py-2 font-semibold text-[#3d4b61] transition hover:-translate-y-1 hover:shadow-lg">
              Support
            </button>

            <button className="rounded-xl bg-[#d8b328] px-8 py-3 font-semibold text-black transition hover:-translate-y-1 hover:bg-[#f2c426] hover:shadow-xl">
              New Reservation
            </button>

            <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-[#d8b328] bg-white shadow">
              🧑
            </div>
          </div>
        </header>

        <section className="px-8 py-8 pb-28">
          <div className="folio-fade mb-7 flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold">
                  Guest Folio - #LS-9920
                </h1>
                <span className="rounded-full border border-[#d8b328] bg-yellow-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#806300]">
                  Open
                </span>
              </div>

              <p className="mt-2 text-[#57534e]">
                Manage transactions, adjustments, and final settlement for the current stay.
              </p>
            </div>

            <div className="flex gap-4">
              <button className="rounded-xl border border-[#9c8f7d] bg-white px-6 py-3 font-medium transition hover:-translate-y-1 hover:shadow-lg">
                ▣ Print Statement
              </button>

              <button className="rounded-xl border border-[#9c8f7d] bg-white px-6 py-3 font-medium transition hover:-translate-y-1 hover:shadow-lg">
                ✉ Email Guest
              </button>
            </div>
          </div>

          <div className="mb-7 grid gap-6 xl:grid-cols-3">
            <div className="folio-fade delay-100 rounded-2xl border border-[#d9cfbd] border-l-4 border-l-[#d8b328] bg-white p-6 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#57534e]">
                Total Outstanding
              </p>

              <h2 className="mt-3 text-5xl font-extrabold text-[#806300]">
                $2,450.00
              </h2>

              <div className="my-8 h-px bg-[#d9cfbd]" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1ead5] text-[#806300]">
                    ▣
                  </div>

                  <div>
                    <p className="text-sm text-[#57534e]">Due Date</p>
                    <p className="font-bold">Check-out (Oct 24)</p>
                  </div>
                </div>

                <span className="text-2xl">↗</span>
              </div>
            </div>

            <div className="folio-fade delay-150 rounded-2xl border border-[#d9cfbd] bg-white p-6 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#57534e]">
                Guest Information
              </p>

              <div className="mt-6 flex items-center gap-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#f1ead5] text-2xl text-[#806300]">
                  ♙
                </div>

                <div>
                  <h2 className="text-2xl font-extrabold leading-tight">
                    Jonathan <br /> Abernathy
                  </h2>
                  <p className="mt-1 text-sm text-[#57534e]">
                    VIP · Loyalty Member #8821
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-[#faf8f3] p-4">
                  <p className="text-sm text-[#57534e]">Room</p>
                  <p className="font-bold">Suite 404</p>
                </div>

                <div className="rounded-xl bg-[#faf8f3] p-4">
                  <p className="text-sm text-[#57534e]">Nights</p>
                  <p className="font-bold">3 Nights</p>
                </div>
              </div>
            </div>

            <div className="folio-fade delay-200 rounded-2xl border border-[#d9cfbd] bg-white p-6 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#57534e]">
                Recent Payment Activity
              </p>

              <div className="mt-6 rounded-xl border border-dashed border-[#cdbfaa] bg-[#fbfaf7] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl text-[#3d4b61]">▤</span>
                    <div>
                      <p className="font-bold">Visa Auth **** 4421</p>
                      <p className="text-sm text-[#57534e]">Oct 21, 14:02</p>
                    </div>
                  </div>

                  <p className="font-bold text-[#d8a900]">$3,000.00</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">↺</span>
                  <div>
                    <p className="font-bold">Pre-authorization Hold</p>
                    <p className="text-sm text-[#57534e]">Status: Pending</p>
                  </div>
                </div>

                <button className="text-xl">•••</button>
              </div>
            </div>
          </div>

          <section className="folio-fade delay-250 overflow-hidden rounded-2xl border border-[#d9cfbd] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#d9cfbd] px-6 py-6">
              <h2 className="text-2xl font-bold">Folio Ledger</h2>

              <button className="rounded-xl border border-[#cdbfaa] bg-white px-4 py-2 font-medium transition hover:bg-[#faf8f3]">
                All Transactions
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-[#faf8f3] text-xs font-bold uppercase tracking-wider text-[#57534e]">
                  <tr>
                    <th className="px-6 py-5">Date</th>
                    <th className="px-6 py-5">Category</th>
                    <th className="px-6 py-5">Description</th>
                    <th className="px-6 py-5">Reference</th>
                    <th className="px-6 py-5 text-right">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {ledgerRows.map((row, index) => (
                    <tr
                      key={index}
                      className={`folio-row border-t border-[#e6dfd2] transition hover:bg-[#fbf7ed] ${
                        row.type === "discount" ? "bg-[#faf8f3]" : ""
                      }`}
                    >
                      <td className="px-6 py-5">{row.date}</td>
                      <td className="px-6 py-5">
                        <span
                          className={`rounded-md px-3 py-1 text-xs font-bold ${categoryClass(
                            row.category
                          )}`}
                        >
                          {row.category}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-5 ${
                          row.type === "discount" ? "font-medium text-[#806300]" : ""
                        }`}
                      >
                        {row.description}
                      </td>
                      <td className="px-6 py-5 text-[#57534e]">{row.reference}</td>
                      <td
                        className={`px-6 py-5 text-right font-medium ${
                          row.type === "discount" ? "text-[#806300]" : ""
                        }`}
                      >
                        {row.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="ml-auto w-full max-w-[380px] px-8 py-8">
              <div className="space-y-4 text-right">
                <div className="flex justify-between gap-8 text-[#57534e]">
                  <span>Subtotal</span>
                  <span>$2,190.50</span>
                </div>

                <div className="flex justify-between gap-8 text-[#57534e]">
                  <span>Taxes (12.5% VAT)</span>
                  <span>$259.50</span>
                </div>

                <div className="h-px bg-[#d9cfbd]" />

                <div className="flex justify-between gap-8 text-2xl font-extrabold">
                  <span>Grand Total</span>
                  <span className="text-[#806300]">$2,450.00</span>
                </div>
              </div>
            </div>
          </section>
        </section>

        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#d9cfbd] bg-white/95 px-8 py-5 backdrop-blur-xl lg:left-[280px]">
          <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
            <div className="flex flex-wrap gap-4">
              <button className="rounded-xl border border-[#3d4b61] bg-white px-8 py-4 font-medium text-[#3d4b61] transition hover:-translate-y-1 hover:shadow-lg">
                + Add Charge
              </button>

              <button className="rounded-xl border border-[#3d4b61] bg-white px-8 py-4 font-medium text-[#3d4b61] transition hover:-translate-y-1 hover:shadow-lg">
                % Apply Discount
              </button>
            </div>

            <div className="flex items-center gap-5">
              <p className="text-lg">
                Split Billing:{" "}
                <span className="font-bold text-[#806300]">Individual Guest</span>
              </p>

              <button className="rounded-xl bg-[#d8b328] px-10 py-4 font-bold text-black transition hover:-translate-y-1 hover:bg-[#f2c426] hover:shadow-xl">
                Settle Folio
              </button>
            </div>
          </div>
        </div>

        {showToast && (
          <button
            onClick={() => setShowToast(false)}
            className="folio-toast fixed bottom-24 right-8 z-50 flex max-w-[380px] items-center gap-4 rounded-xl bg-[#181818] p-5 text-left text-white shadow-2xl"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d8b328] text-black">
              ✓
            </span>

            <span>
              <strong className="block">Transaction Recorded</strong>
              <span className="text-sm text-slate-300">
                Charge Added Successfully to Folio #LS-9920
              </span>
            </span>
          </button>
        )}
      </main>
    </div>
  );
}