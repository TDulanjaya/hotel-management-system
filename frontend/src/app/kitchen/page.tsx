"use client";

import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const newOrders = [
  {
    title: "Room 402",
    priority: "HIGH PRIORITY",
    time: "4m ago",
    border: "red",
    items: ["2x Wagyu Beef Burger", "1x Truffle Fries"],
    note: "No onions on one burger. Extra pickles.",
  },
  {
    title: "Table 12",
    priority: "NORMAL",
    time: "8m ago",
    border: "neutral",
    items: ["1x Caesar Salad", "1x Atlantic Salmon"],
    note: "Serve salmon medium rare.",
  },
  {
    title: "Room 208",
    priority: "NORMAL",
    time: "12m ago",
    border: "neutral",
    items: ["1x Club Sandwich", "1x Fresh Orange Juice"],
    note: "Send with extra napkins.",
  },
];

const preparingOrders = [
  {
    title: "Poolside 04",
    priority: "PREPARING",
    elapsed: "14:25",
    items: ["3x Club Sandwich", "2x Mojito Mocktail"],
    progress: 65,
  },
  {
    title: "Table 07",
    priority: "PREPARING",
    elapsed: "09:10",
    items: ["2x Chicken Alfredo", "1x Garden Salad"],
    progress: 45,
  },
];

const readyOrders = [
  {
    title: "Grand Ballroom - Event A",
    priority: "PICKUP READY",
    items: ["24x Hors d'oeuvres Tray", "12x Sparkling Water"],
  },
  {
    title: "Room 501",
    priority: "PICKUP READY",
    items: ["1x Breakfast Platter", "1x Cappuccino"],
  },
];

const kitchenStats = [
  {
    title: "New Orders",
    value: "03",
    note: "Waiting to start",
  },
  {
    title: "Preparing",
    value: "02",
    note: "In kitchen",
  },
  {
    title: "Ready",
    value: "02",
    note: "Waiting pickup",
  },
  {
    title: "Avg. Prep Time",
    value: "18m",
    note: "Today average",
  },
];

export default function KitchenPage() {
  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "COOK"]}>
      <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
        <AppSidebar />

        <main className="lg:ml-[280px]">
          <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#d9cfbd] bg-[#f8f5ef]/95 px-8 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-extrabold">Kitchen Orders</h1>

              <span className="rounded-full bg-[#f5eed9] px-4 py-2 text-sm font-extrabold uppercase tracking-wider text-[#806300]">
                3 New Live
              </span>
            </div>

            <div className="flex items-center gap-8">
              <div className="hidden items-center gap-3 text-lg text-[#4c4032] md:flex">
                <span className="text-2xl text-[#806300]">⏱</span>
                Avg. Prep: 18m
              </div>

              <button className="rounded-xl bg-[#d8b328] px-8 py-3 text-lg font-semibold text-[#4c3a00] transition hover:-translate-y-1 hover:bg-[#f2c426] hover:shadow-xl">
                Refresh Orders
              </button>
            </div>
          </header>

          <section className="px-8 py-8">
            <div className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#806300]">
                  Dashboard &nbsp;›&nbsp; Kitchen Management
                </p>

                <h1 className="mt-3 text-5xl font-extrabold tracking-tight">
                  Kitchen Order Board
                </h1>

                <p className="mt-3 text-[#57534e]">
                  Manage room service, restaurant, poolside, and event food
                  orders.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <button className="rounded-xl border-2 border-[#3d4b61] bg-white px-7 py-3 text-lg font-semibold text-[#3d4b61] transition hover:-translate-y-1 hover:shadow-lg">
                  Print KOT
                </button>

                <button className="rounded-xl bg-[#806300] px-8 py-3 text-lg font-bold text-white transition hover:-translate-y-1 hover:bg-[#6b5400] hover:shadow-xl">
                  + Manual Order
                </button>
              </div>
            </div>

            <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {kitchenStats.map((stat) => (
                <article
                  key={stat.title}
                  className="rounded-2xl border border-[#d9cfbd] bg-white p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >
                  <p className="text-lg text-[#57534e]">{stat.title}</p>

                  <h2 className="mt-3 text-5xl font-extrabold text-[#181818]">
                    {stat.value}
                  </h2>

                  <p className="mt-2 text-[#806300]">{stat.note}</p>
                </article>
              ))}
            </div>

            <div className="grid gap-8 xl:grid-cols-3">
              <section>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-bold">New Orders</h2>

                  <span className="rounded border border-[#807464] px-2 py-1 text-xs font-bold">
                    NEW
                  </span>
                </div>

                <div className="space-y-6">
                  {newOrders.map((order) => (
                    <article
                      key={order.title}
                      className={`rounded-2xl border border-[#d9cfbd] border-l-4 bg-white p-5 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl ${
                        order.border === "red"
                          ? "border-l-red-600"
                          : "border-l-[#cdbfaa]"
                      }`}
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

                        <span className="text-sm text-[#57534e]">
                          {order.time}
                        </span>
                      </div>

                      <h3 className="text-2xl font-extrabold">{order.title}</h3>

                      <div className="mt-5 space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item}
                            className="rounded-xl bg-[#f5f2eb] px-4 py-3 font-semibold"
                          >
                            {item}
                          </div>
                        ))}
                      </div>

                      {order.note && (
                        <p className="mt-4 rounded-xl bg-yellow-50 p-3 text-sm font-semibold text-[#806300]">
                          Note: {order.note}
                        </p>
                      )}

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <button className="rounded-xl border border-[#d9cfbd] py-3 font-bold transition hover:bg-[#f5f2eb]">
                          Reject
                        </button>

                        <button className="rounded-xl bg-[#806300] py-3 font-bold text-white transition hover:bg-[#6b5400]">
                          Start
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-bold">Preparing</h2>

                  <span className="rounded border border-[#807464] px-2 py-1 text-xs font-bold">
                    IN PROGRESS
                  </span>
                </div>

                <div className="space-y-6">
                  {preparingOrders.map((order) => (
                    <article
                      key={order.title}
                      className="rounded-2xl border border-[#d9cfbd] border-l-4 border-l-[#806300] bg-white p-5 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <span className="rounded-md bg-[#f5eed9] px-3 py-2 text-xs font-extrabold text-[#806300]">
                          {order.priority}
                        </span>

                        <span className="text-sm font-bold text-[#806300]">
                          {order.elapsed}
                        </span>
                      </div>

                      <h3 className="text-2xl font-extrabold">{order.title}</h3>

                      <div className="mt-5 space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item}
                            className="rounded-xl bg-[#f5f2eb] px-4 py-3 font-semibold"
                          >
                            {item}
                          </div>
                        ))}
                      </div>

                      <div className="mt-5">
                        <div className="mb-2 flex justify-between text-sm font-bold">
                          <span>Progress</span>
                          <span>{order.progress}%</span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-[#e5ddd0]">
                          <div
                            className="h-full rounded-full bg-[#806300]"
                            style={{ width: `${order.progress}%` }}
                          />
                        </div>
                      </div>

                      <button className="mt-5 w-full rounded-xl bg-[#d8b328] py-3 font-bold text-[#4c3a00] transition hover:bg-[#f2c426]">
                        Mark Ready
                      </button>
                    </article>
                  ))}
                </div>
              </section>

              <section>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-bold">Ready for Pickup</h2>

                  <span className="rounded border border-green-700 px-2 py-1 text-xs font-bold text-green-700">
                    READY
                  </span>
                </div>

                <div className="space-y-6">
                  {readyOrders.map((order) => (
                    <article
                      key={order.title}
                      className="rounded-2xl border border-green-200 border-l-4 border-l-green-600 bg-green-50 p-5 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <span className="rounded-md bg-green-100 px-3 py-2 text-xs font-extrabold text-green-700">
                          {order.priority}
                        </span>
                      </div>

                      <h3 className="text-2xl font-extrabold">{order.title}</h3>

                      <div className="mt-5 space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item}
                            className="rounded-xl bg-white px-4 py-3 font-semibold"
                          >
                            {item}
                          </div>
                        ))}
                      </div>

                      <button className="mt-5 w-full rounded-xl bg-green-700 py-3 font-bold text-white transition hover:bg-green-800">
                        Complete Pickup
                      </button>
                    </article>
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