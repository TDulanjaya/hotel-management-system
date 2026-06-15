"use client";
import AppSidebar from "@/components/layout/AppSidebar";

import Link from "next/link";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: "▦" },
  { name: "Rooms", href: "/rooms", icon: "▰" },
  { name: "Reservations", href: "/reservations", icon: "▣" },
  { name: "Inventory", href: "/inventory", icon: "▤" },
  { name: "Kitchen Orders", href: "/kitchen", icon: "▥" },
  { name: "Room Service", href: "/room-service", icon: "⌂" },
  { name: "Reports", href: "/reports", icon: "▧" },
  { name: "Settings", href: "/settings", icon: "⚙" },
];

const stats = [
  { title: "Total Items", value: "1,284", note: "+4%", danger: false },
  { title: "Low Stock Items", value: "24", note: "Requires Attention", danger: true },
  { title: "Expired Items", value: "08", note: "Past Due", danger: false },
  { title: "Stock Value", value: "$42.5k", note: "↑ $2.1k", danger: false },
];

const inventoryItems = [
  {
    item: "Organic Grade-A Eggs",
    category: "Kitchen - Dairy",
    qty: "12",
    unit: "Dozen",
    reorder: "25",
    supplier: "GreenValley Farms",
  },
  {
    item: "Luxe Egyptian Cotton Towels",
    category: "Housekeeping",
    qty: "450",
    unit: "Units",
    reorder: "100",
    supplier: "Linen Masters Co.",
  },
  {
    item: "Nespresso Pods - Roma",
    category: "Minibar",
    qty: "85",
    unit: "Sleeves",
    reorder: "100",
    supplier: "Nestlé Professional",
  },
  {
    item: "Artisan Sourdough Loaves",
    category: "Kitchen - Bakery",
    qty: "04",
    unit: "Units",
    reorder: "10",
    supplier: "The Baker’s Atelier",
  },
  {
    item: "Hermès Bath Set (50ml)",
    category: "Guest Amenities",
    qty: "1,200",
    unit: "Sets",
    reorder: "250",
    supplier: "Hermès International",
  },
];

const usageBars = [
  { month: "JAN", height: "35%" },
  { month: "FEB", height: "55%" },
  { month: "MAR", height: "75%" },
  { month: "APR", height: "48%" },
  { month: "MAY", height: "88%" },
  { month: "JUN", height: "64%" },
];

export default function InventoryPage() {
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
            <div className="flex w-full max-w-[520px] items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm">
              <span className="text-xl">⌕</span>
              <input
                type="text"
                placeholder="Search inventory, suppliers, or recipe"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative text-2xl transition hover:scale-110">
              ♧
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-600" />
            </button>

            <div className="hidden h-8 w-px bg-[#d9cfbd] md:block" />

            <button className="rounded-xl bg-[#806300] px-8 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-[#6b5400] hover:shadow-xl">
              ⊕ New Reservation
            </button>

            <div className="hidden text-right xl:block">
              <p className="font-bold">James Harrington</p>
              <p className="text-xs uppercase text-[#57534e]">
                Inventory Manager
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-[#d8b328] bg-white shadow">
              📋
            </div>
          </div>
        </header>

        <section className="px-8 py-8">
          <div className="inventory-fade mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#806300]">
                Dashboard &nbsp;›&nbsp; Inventory Management
              </p>

              <h1 className="mt-3 text-5xl font-extrabold tracking-tight">
                Stock Inventory
              </h1>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="rounded-xl border-2 border-[#3d4b61] bg-white px-7 py-3 text-lg font-semibold text-[#3d4b61] transition hover:-translate-y-1 hover:shadow-lg">
                ↺ Update Stock
              </button>

              <button className="rounded-xl bg-[#806300] px-8 py-3 text-lg font-bold text-white transition hover:-translate-y-1 hover:bg-[#6b5400] hover:shadow-xl">
                + Add Stock
              </button>
            </div>
          </div>

          <div className="inventory-fade delay-100 mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.title}
                className="inventory-stat-card rounded-2xl border border-[#d9cfbd] bg-white p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                style={{ animationDelay: `${index * 0.07}s` }}
              >
                <p className="text-lg text-[#57534e]">{stat.title}</p>

                <div className="mt-3 flex items-end gap-3">
                  <h2
                    className={`text-5xl font-extrabold ${
                      stat.danger ? "text-red-600" : "text-[#181818]"
                    }`}
                  >
                    {stat.value}
                  </h2>

                  <p
                    className={`mb-2 text-lg ${
                      stat.danger ? "text-red-600" : "text-[#806300]"
                    }`}
                  >
                    {stat.note}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-7 xl:grid-cols-[1.45fr_0.45fr]">
            <div>
              <div className="inventory-fade delay-150 mb-7 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 p-6">
                <div className="flex items-center gap-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600">
                    ⚠
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-red-600">
                      Critical Stock Warning
                    </h2>
                    <p className="mt-1 text-lg text-[#3f3b35]">
                      3 Kitchen essentials and 2 Housekeeping items are below
                      critical reorder levels.
                    </p>
                  </div>
                </div>

                <button className="rounded-xl bg-red-700 px-8 py-4 text-lg font-bold text-white transition hover:-translate-y-1 hover:bg-red-800 hover:shadow-xl">
                  Review Critical Items
                </button>
              </div>

              <section className="inventory-fade delay-200 overflow-hidden rounded-2xl border border-[#d9cfbd] bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-[#d9cfbd] px-6 py-6">
                  <h2 className="text-lg font-medium">Inventory Ledger</h2>

                  <div className="flex gap-3">
                    <button className="rounded-xl border border-[#d9cfbd] bg-white px-4 py-3 text-xl transition hover:bg-[#faf8f3]">
                      ≡
                    </button>

                    <button className="rounded-xl border border-[#d9cfbd] bg-white px-4 py-3 text-xl transition hover:bg-[#faf8f3]">
                      ⇩
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left">
                    <thead className="bg-[#faf8f3] text-sm font-bold uppercase tracking-wide text-[#3f3b35]">
                      <tr>
                        <th className="px-6 py-5">Item Name</th>
                        <th className="px-6 py-5">Category</th>
                        <th className="px-6 py-5">Qty</th>
                        <th className="px-6 py-5">Unit</th>
                        <th className="px-6 py-5">Reorder Level</th>
                        <th className="px-6 py-5">Supplier</th>
                      </tr>
                    </thead>

                    <tbody>
                      {inventoryItems.map((item, index) => {
                        const critical = Number(item.qty.replace(",", "")) < Number(item.reorder);

                        return (
                          <tr
                            key={item.item}
                            className={`inventory-row border-t border-[#e6dfd2] transition hover:bg-[#fbf7ed] ${
                              critical ? "bg-red-50/30" : ""
                            }`}
                            style={{ animationDelay: `${0.22 + index * 0.05}s` }}
                          >
                            <td className="px-6 py-6 text-lg font-semibold">
                              {item.item}
                            </td>
                            <td className="px-6 py-6">{item.category}</td>
                            <td
                              className={`px-6 py-6 font-bold ${
                                critical ? "text-red-600" : ""
                              }`}
                            >
                              {item.qty}
                            </td>
                            <td className="px-6 py-6">{item.unit}</td>
                            <td className="px-6 py-6">{item.reorder}</td>
                            <td className="px-6 py-6">{item.supplier}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            <aside className="space-y-7">
              <section className="inventory-fade delay-250 rounded-2xl border border-[#d9cfbd] bg-white p-6 shadow-sm">
                <h2 className="text-lg leading-7">
                  Recipe Ingredient <br /> Mapping
                </h2>

                <div className="mt-7 space-y-5">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg">
                        Signature <br /> Omelette
                      </h3>
                      <p className="text-xs font-bold text-[#806300]">
                        3 <br /> ITEMS
                      </p>
                    </div>

                    <div className="mt-3 rounded-xl bg-[#f2f0ec] p-4 text-sm">
                      <div className="flex justify-between">
                        <span>Grade-A Eggs</span>
                        <strong>3 Units</strong>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <span>Artisan Butter</span>
                        <strong>15g</strong>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <span>Baby Spinach</span>
                        <strong>20g</strong>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg">
                        Espresso <br /> Macchiato
                      </h3>
                      <p className="text-xs font-bold text-[#806300]">
                        2 <br /> ITEMS
                      </p>
                    </div>

                    <div className="mt-3 rounded-xl bg-[#f2f0ec] p-4 text-sm">
                      <div className="flex justify-between">
                        <span>Roma Coffee Pod</span>
                        <strong>1 Unit</strong>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <span>Whole Milk</span>
                        <strong>40ml</strong>
                      </div>
                    </div>
                  </div>

                  <button className="w-full rounded-xl border border-dashed border-[#cdbfaa] px-5 py-4 text-lg transition hover:-translate-y-1 hover:bg-[#faf8f3] hover:shadow-lg">
                    + New Recipe Map
                  </button>
                </div>
              </section>

              <section className="inventory-fade delay-300 rounded-2xl border border-[#d9cfbd] bg-white p-6 shadow-sm">
                <div className="flex justify-between">
                  <h2 className="text-lg leading-7">
                    Monthly Usage <br /> Kitchen vs Housekeeping
                  </h2>
                  <span className="text-2xl text-[#806300]">↗</span>
                </div>

                <div className="mt-8 flex h-40 items-end justify-between gap-3">
                  {usageBars.map((bar, index) => (
                    <div key={bar.month} className="flex flex-1 flex-col items-center">
                      <div
                        className="inventory-bar w-full max-w-[28px] rounded-t-md bg-[#d8b328]"
                        style={{
                          height: bar.height,
                          animationDelay: `${index * 0.08}s`,
                        }}
                      />
                      <p className="mt-3 text-xs text-[#57534e]">{bar.month}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="inventory-fade delay-350 supplier-card overflow-hidden rounded-2xl border border-[#d9cfbd] bg-[#181818] p-5 text-white shadow-sm">
                <div className="mt-20">
                  <h2 className="text-xl font-bold">Supplier Excellence Hub</h2>
                  <p className="text-sm text-slate-300">
                    Manage partner relationships & contracts
                  </p>
                </div>
              </section>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}