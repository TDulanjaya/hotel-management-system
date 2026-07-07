"use client";

import { useEffect, useState } from "react";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getKitchenOrders, updateKitchenOrder } from "@/lib/api/kitchenApi";
import { useAuthContext } from "@/context/AuthContext";

export default function KitchenPage() {
  const { user } = useAuthContext();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await getKitchenOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const newOrders = orders.filter(o => o.status === "QUEUED");
  const preparingOrders = orders.filter(o => o.status === "PREPARING");
  const readyOrders = orders.filter(o => o.status === "READY");

  const kitchenStats = [
    { title: "New Orders", value: newOrders.length.toString().padStart(2, '0'), note: "Waiting to start" },
    { title: "Preparing", value: preparingOrders.length.toString().padStart(2, '0'), note: "In kitchen" },
    { title: "Ready", value: readyOrders.length.toString().padStart(2, '0'), note: "Waiting pickup" },
    { title: "Total Today", value: orders.length.toString().padStart(2, '0'), note: "All orders" },
  ];

  const handleUpdateStatus = async (id: string, currentItem: any, newStatus: string) => {
    try {
      await updateKitchenOrder(id, { ...currentItem, status: newStatus });
      fetchOrders();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "COOK"]}>
      <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
        <AppSidebar />

        <main className="lg:ml-[280px]">
          <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#d9cfbd] bg-[#f8f5ef]/95 px-8 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-extrabold">Kitchen Orders</h1>
              <span className="rounded-full bg-[#f5eed9] px-4 py-2 text-sm font-extrabold uppercase tracking-wider text-[#806300]">
                {newOrders.length} New Live
              </span>
            </div>
            <div className="flex items-center gap-8">
              <button onClick={fetchOrders} className="rounded-xl bg-[#d8b328] px-8 py-3 text-lg font-semibold text-[#4c3a00] transition hover:-translate-y-1 hover:bg-[#f2c426] hover:shadow-xl">
                Refresh Orders
              </button>
            </div>
          </header>

          <section className="px-8 py-8">
            <div className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#806300]">
                  Dashboard &nbsp;&gt;&nbsp; Kitchen Management
                </p>
                <h1 className="mt-3 text-5xl font-extrabold tracking-tight">
                  Kitchen Order Board
                </h1>
                <p className="mt-3 text-[#57534e]">
                  Manage room service, restaurant, poolside, and event food orders.
                </p>
              </div>
            </div>

            <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {kitchenStats.map((stat) => (
                <article key={stat.title} className="rounded-2xl border border-[#d9cfbd] bg-white p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
                  <p className="text-lg text-[#57534e]">{stat.title}</p>
                  <h2 className="mt-3 text-5xl font-extrabold text-[#181818]">{stat.value}</h2>
                  <p className="mt-2 text-[#806300]">{stat.note}</p>
                </article>
              ))}
            </div>

            {loading ? (
              <div className="flex h-64 items-center justify-center text-lg text-[#806300]">Loading Orders...</div>
            ) : (
              <div className="grid gap-8 xl:grid-cols-3">
                {/* NEW ORDERS */}
                <section>
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-bold">New Orders</h2>
                    <span className="rounded border border-[#807464] px-2 py-1 text-xs font-bold">NEW</span>
                  </div>
                  <div className="space-y-6">
                    {newOrders.map((order) => (
                      <article key={order.id} className={`rounded-2xl border border-[#d9cfbd] border-l-4 bg-white p-5 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl ${order.priority === "HIGH" || order.priority === "URGENT" ? "border-l-red-600" : "border-l-[#cdbfaa]"}`}>
                        <div className="mb-3 flex items-start justify-between">
                          <span className={`rounded-md px-3 py-2 text-xs font-extrabold ${order.priority === "HIGH" || order.priority === "URGENT" ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-600"}`}>
                            {order.priority}
                          </span>
                        </div>
                        <h3 className="text-2xl font-extrabold">{order.tableOrRoom} - {order.guestName}</h3>
                        <div className="mt-5 space-y-3">
                          <div className="rounded-xl bg-[#f5f2eb] px-4 py-3 font-semibold whitespace-pre-wrap">{order.items}</div>
                        </div>
                        {order.notes && (
                          <p className="mt-4 rounded-xl bg-yellow-50 p-3 text-sm font-semibold text-[#806300]">Note: {order.notes}</p>
                        )}
                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <button onClick={() => handleUpdateStatus(order.id, order, "CANCELLED")} className="rounded-xl border border-[#d9cfbd] py-3 font-bold transition hover:bg-[#f5f2eb]">Reject</button>
                          <button onClick={() => handleUpdateStatus(order.id, order, "PREPARING")} className="rounded-xl bg-[#806300] py-3 font-bold text-white transition hover:bg-[#6b5400]">Start</button>
                        </div>
                      </article>
                    ))}
                    {newOrders.length === 0 && <p className="text-gray-500">No new orders.</p>}
                  </div>
                </section>

                {/* PREPARING */}
                <section>
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Preparing</h2>
                    <span className="rounded border border-[#807464] px-2 py-1 text-xs font-bold">IN PROGRESS</span>
                  </div>
                  <div className="space-y-6">
                    {preparingOrders.map((order) => (
                      <article key={order.id} className="rounded-2xl border border-[#d9cfbd] border-l-4 border-l-[#806300] bg-white p-5 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl">
                        <div className="mb-3 flex items-start justify-between">
                          <span className="rounded-md bg-[#f5eed9] px-3 py-2 text-xs font-extrabold text-[#806300]">{order.priority}</span>
                        </div>
                        <h3 className="text-2xl font-extrabold">{order.tableOrRoom} - {order.guestName}</h3>
                        <div className="mt-5 space-y-3">
                          <div className="rounded-xl bg-[#f5f2eb] px-4 py-3 font-semibold whitespace-pre-wrap">{order.items}</div>
                        </div>
                        {order.notes && (
                          <p className="mt-4 rounded-xl bg-yellow-50 p-3 text-sm font-semibold text-[#806300]">Note: {order.notes}</p>
                        )}
                        <button onClick={() => handleUpdateStatus(order.id, order, "READY")} className="mt-5 w-full rounded-xl bg-[#d8b328] py-3 font-bold text-[#4c3a00] transition hover:bg-[#f2c426]">
                          Mark Ready
                        </button>
                      </article>
                    ))}
                    {preparingOrders.length === 0 && <p className="text-gray-500">No orders preparing.</p>}
                  </div>
                </section>

                {/* READY */}
                <section>
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Ready for Pickup</h2>
                    <span className="rounded border border-green-700 px-2 py-1 text-xs font-bold text-green-700">READY</span>
                  </div>
                  <div className="space-y-6">
                    {readyOrders.map((order) => (
                      <article key={order.id} className="rounded-2xl border border-green-200 border-l-4 border-l-green-600 bg-green-50 p-5 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl">
                        <div className="mb-3 flex items-start justify-between">
                          <span className="rounded-md bg-green-100 px-3 py-2 text-xs font-extrabold text-green-700">{order.priority}</span>
                        </div>
                        <h3 className="text-2xl font-extrabold">{order.tableOrRoom} - {order.guestName}</h3>
                        <div className="mt-5 space-y-3">
                          <div className="rounded-xl bg-white px-4 py-3 font-semibold whitespace-pre-wrap">{order.items}</div>
                        </div>
                        <button onClick={() => handleUpdateStatus(order.id, order, "SERVED")} className="mt-5 w-full rounded-xl bg-green-700 py-3 font-bold text-white transition hover:bg-green-800">
                          Complete Pickup
                        </button>
                      </article>
                    ))}
                    {readyOrders.length === 0 && <p className="text-gray-500">No orders ready.</p>}
                  </div>
                </section>
              </div>
            )}
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
