"use client";
import AppSidebar from "@/components/layout/AppSidebar";

import Link from "next/link";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: "▦" },
  { name: "Rooms", href: "/rooms", icon: "▰" },
  { name: "Kitchen Orders", href: "/kitchen", icon: "▥" },
  { name: "Restaurant Tables", href: "/restaurant", icon: "▧" },
  { name: "Inventory", href: "/inventory", icon: "▤" },
];

const newOrders = [
  {
    title: "Room 402",
    priority: "HIGH PRIORITY",
    time: "4m ago",
    border: "red",
    items: [
      { name: "2x Wagyu Beef Burger", qty: "x2" },
      { name: "1x Truffle Fries", qty: "x1" },
    ],
    note: "No onions on one burger. Extra pickles.",
  },
  {
    title: "Table 12",
    priority: "NORMAL",
    time: "8m ago",
    border: "neutral",
    items: [
      { name: "1x Caesar Salad", qty: "x1" },
      { name: "1x Atlantic Salmon", qty: "x1" },
    ],
    note: "",
  },
];

const preparingOrders = [
  {
    title: "Poolside 04",
    priority: "NORMAL",
    elapsed: "14:25",
    items: [{ name: "3x Club Sandwich", qty: "x3" }],
    progress: 65,
  },
];

const readyOrders = [
  {
    title: "Grand Ballroom - Event A",
    priority: "PICKUP READY",
    items: [{ name: "24x Hors d'oeuvres Tray", qty: "x1" }],
  },
];

export default function KitchenPage() {
  return (
    <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
      <AppSidebar />

      <main className="lg:ml-[280px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#d9cfbd] bg-[#f8f5ef]/95 px-8 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-extrabold">Kitchen Orders</h1>
            <span className="rounded-full bg-[#f5eed9] px-4 py-2 text-sm font-extrabold uppercase tracking-wider text-[#806300]">
              4 New Live
            </span>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden items-center gap-3 text-lg text-[#4c4032] md:flex">
              <span className="text-2xl text-[#806300]">⏱</span>
              Avg. Prep: 18m
            </div>

            <button className="text-2xl transition hover:scale-110">♧</button>

            <button className="rounded-xl bg-[#d8b328] px-8 py-3 text-lg font-semibold text-[#4c3a00] transition hover:-translate-y-1 hover:bg-[#f2c426] hover:shadow-xl">
              New Reservation
            </button>
          </div>
        </header>

        <section className="grid min-h-[calc(100vh-76px)] grid-rows-[1fr_auto]">
          <div className="grid gap-8 px-8 py-8 xl:grid-cols-3">
            <section className="kitchen-fade">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl">New Orders&nbsp; (3)</h2>
                <span className="rounded border border-[#807464] px-1 text-xs">
                  NEW
                </span>
              </div>

              <div className="space-y-6">
                {newOrders.map((order, index) => (
                  <article
                    key={order.title}
                    className={`kitchen-card rounded-2xl border border-[#d9cfbd] border-l-4 bg-white p-5 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl ${
                      order.border === "red"
                        ? "border-l-red-600"
                        : "border-l-[#cdbfaa]"
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <span
                        className={`rounded-md px-3 py-2 text-xs font-extrabold ${
                          order.priority === "HIGH PRIORITY"
                            ? "bg-red-50 text-red-600"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {order.priority}
                      </span>

                      <p className="text-sm font-medium">◷ {order.time}</p>
                    </div>

                    <h3 className="mb-5 text-xl">{order.title}</h3>

                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between text-lg"
                        >
                          <p>{item.name}</p>
                          <strong>{item.qty}</strong>
                        </div>
                      ))}
                    </div>

                    {order.note && (
                      <div className="mt-6 rounded-xl border-l-4 border-[#806300] bg-[#f0eeea] p-4 italic text-[#57534e]">
                        Note: {order.note}
                      </div>
                    )}

                    <button className="mt-6 w-full rounded-xl bg-[#d8b328] px-6 py-4 text-lg font-extrabold uppercase tracking-wide text-[#4c3a00] transition hover:-translate-y-1 hover:bg-[#f2c426] hover:shadow-xl">
                      Start Preparing
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <section className="kitchen-fade delay-100">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl">Preparing&nbsp; (2)</h2>
                <span className="text-2xl text-[#806300]">♨</span>
              </div>

              <div className="space-y-6">
                {preparingOrders.map((order) => (
                  <article
                    key={order.title}
                    className="kitchen-card rounded-2xl border border-[#d9cfbd] border-l-4 border-l-[#806300] bg-white p-5 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <span className="rounded-md bg-slate-100 px-3 py-2 text-xs font-extrabold text-slate-600">
                        {order.priority}
                      </span>

                      <div className="text-right">
                        <p className="text-xs font-bold uppercase text-[#806300]">
                          Elapsed
                        </p>
                        <p className="text-2xl font-extrabold">
                          {order.elapsed}
                        </p>
                      </div>
                    </div>

                    <h3 className="mb-5 text-xl">{order.title}</h3>

                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between text-lg"
                        >
                          <p>{item.name}</p>
                          <strong>{item.qty}</strong>
                        </div>
                      ))}
                    </div>

                    <div className="mt-7 h-2 overflow-hidden rounded-full bg-[#ebe8e2]">
                      <div
                        className="kitchen-progress h-full rounded-full bg-[#806300]"
                        style={{ width: `${order.progress}%` }}
                      />
                    </div>

                    <button className="mt-7 w-full rounded-xl bg-[#5a657c] px-6 py-4 text-lg font-extrabold uppercase tracking-wide text-white transition hover:-translate-y-1 hover:bg-[#3d4b61] hover:shadow-xl">
                      Mark As Ready
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <section className="kitchen-fade delay-150">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl">Ready&nbsp; (1)</h2>
                <span className="text-2xl text-[#806300]">◎</span>
              </div>

              <div className="space-y-6">
                {readyOrders.map((order) => (
                  <article
                    key={order.title}
                    className="kitchen-card ready-glow rounded-2xl border border-[#d8b328] bg-[#f7f1e1] p-5 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <span className="rounded-md bg-[#d8b328] px-3 py-2 text-xs font-extrabold text-[#4c3a00]">
                        {order.priority}
                      </span>

                      <span className="text-4xl text-[#d8b328]">♧</span>
                    </div>

                    <h3 className="mb-7 text-xl">{order.title}</h3>

                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between text-lg"
                        >
                          <p>{item.name}</p>
                          <strong>{item.qty}</strong>
                        </div>
                      ))}
                    </div>

                    <button className="mt-8 w-full rounded-xl bg-[#3d4b61] px-6 py-4 text-lg font-extrabold uppercase tracking-wide text-white transition hover:-translate-y-1 hover:bg-[#2f3b52] hover:shadow-xl">
                      Complete & File
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <div className="grid gap-8 border-t border-[#d9cfbd] bg-[#f1eee7] px-8 py-6 xl:grid-cols-[1.6fr_0.85fr]">
            <section className="kitchen-fade delay-200 rounded-2xl border border-[#d9cfbd] bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-red-600">
                    ⚠ SHORTAGE WARNINGS
                  </h3>
                  <p className="text-sm text-[#57534e]">
                    Supply levels critical for following items:
                  </p>
                </div>

                <div className="grid flex-1 gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-extrabold text-red-700">
                        Fresh <br /> Mint
                      </p>
                      <span className="rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
                        2/100g
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-extrabold text-red-700">
                        A5 Wagyu <br /> Patty
                      </p>
                      <span className="rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
                        4/50
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="kitchen-fade delay-250 rounded-2xl border border-[#d9cfbd] bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold uppercase text-[#806300]">
                    ▣ Event Prep
                  </h3>
                  <p className="mt-3 text-sm">Wedding Dinner (80pax)</p>
                </div>

                <strong>T-Minus 2h</strong>
              </div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#ebe8e2]">
                <div className="kitchen-event-progress h-full rounded-full bg-[#d8b328]" />
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}