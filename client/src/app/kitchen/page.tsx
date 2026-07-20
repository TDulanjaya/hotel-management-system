"use client";

import { AuthUser, getUser } from "@/utils/auth";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getKitchenOrders, updateKitchenOrder } from "@/lib/api/kitchenApi";
import {
  AlertTriangle,
  CheckCircle,
  ChefHat,
  Clock,
  Flame,
  RefreshCw,
  Sparkles,
  Truck,
  Utensils,
} from "lucide-react";

export default function KitchenPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [currentRole, setCurrentRole] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const canManage =
    currentRole === "OWNER" ||
    currentRole === "MANAGER" ||
    currentRole === "COOK";

  useEffect(() => {
    setUser(getUser());
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setRefreshing(true);
    setError("");

    try {
      const data = await getKitchenOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to load kitchen orders.");
    } finally {
      setLoading(false);
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchOrders();

    if (user?.role) {
      setCurrentRole(user.role);
      return;
    }

    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setCurrentRole(parsedUser.role || "");
      }
    } catch {
      setCurrentRole("");
    }
  }, [user]);

  const newOrders = orders.filter((order) => order.status === "QUEUED");
  const preparingOrders = orders.filter(
    (order) => order.status === "PREPARING"
  );
  const readyOrders = orders.filter((order) => order.status === "READY");

  const handleUpdateStatus = async (
    id: string,
    currentItem: any,
    newStatus: string
  ) => {
    try {
      await updateKitchenOrder(id, {
        ...currentItem,
        status: newStatus,
      });

      await fetchOrders();
    } catch (err: any) {
      alert(err.message || "Failed to update kitchen order status.");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "COOK"]}>
      <div className="min-h-screen overflow-hidden bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="relative px-8 py-10 lg:ml-[280px]">
          <motion.div
            className="pointer-events-none absolute right-[-120px] top-[-120px] h-80 w-80 rounded-full bg-[#d4af37]/25 blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.45, 0.7, 0.45] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="pointer-events-none absolute bottom-[-160px] left-[20%] h-96 w-96 rounded-full bg-[#735c00]/10 blur-3xl"
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.35, 0.6, 0.35] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.header
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative mb-8 overflow-hidden rounded-[2rem] border border-[#d0c5af] bg-gradient-to-br from-[#111827] via-[#172033] to-[#2c2100] p-8 text-white shadow-2xl"
          >
            <div className="absolute right-8 top-8 opacity-20">
              <ChefHat size={120} />
            </div>

            <div className="relative flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-[#f8d75c]">
                  <Sparkles size={14} />
                  Kitchen Module
                </div>

                <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
                  Kitchen Order Board
                </h1>

                <p className="mt-3 max-w-2xl text-sm text-[#f5e9c9] md:text-base">
                  Manage restaurant, room service and event food preparation
                  status with a live kitchen workflow.
                </p>
              </div>

              <button
                onClick={fetchOrders}
                className="group flex items-center justify-center gap-2 rounded-2xl bg-[#d4af37] px-6 py-4 font-extrabold text-[#241a00] shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:bg-white"
              >
                <RefreshCw
                  size={18}
                  className={refreshing ? "animate-spin" : "transition group-hover:rotate-180"}
                />
                Refresh Orders
              </button>
            </div>
          </motion.header>

          <motion.section
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="relative mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
          >
            <StatCard
              title="New Orders"
              value={newOrders.length.toString().padStart(2, "0")}
              note="Waiting to start"
              icon={<Clock />}
              accent="from-yellow-400 to-orange-400"
            />

            <StatCard
              title="Preparing"
              value={preparingOrders.length.toString().padStart(2, "0")}
              note="In kitchen"
              icon={<ChefHat />}
              accent="from-blue-400 to-cyan-400"
            />

            <StatCard
              title="Ready"
              value={readyOrders.length.toString().padStart(2, "0")}
              note="Waiting pickup"
              icon={<CheckCircle />}
              accent="from-green-400 to-emerald-400"
            />

            <StatCard
              title="Total Orders"
              value={orders.length.toString().padStart(2, "0")}
              note="All active orders"
              icon={<Truck />}
              accent="from-[#d4af37] to-[#735c00]"
            />
          </motion.section>

          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative flex h-72 flex-col items-center justify-center rounded-[2rem] border border-[#d0c5af] bg-white/80 shadow-xl backdrop-blur"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#d4af37] text-[#4b3a00]"
              >
                <RefreshCw size={30} />
              </motion.div>

              <p className="text-lg font-extrabold text-[#806300]">
                Loading kitchen orders...
              </p>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-[2rem] border border-red-200 bg-red-50 p-6 font-bold text-red-700 shadow-lg"
            >
              {error}
            </motion.div>
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative flex h-72 flex-col items-center justify-center rounded-[2rem] border border-[#d0c5af] bg-white/90 shadow-xl"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#d4af37]/20 text-[#735c00]"
              >
                <ChefHat size={48} />
              </motion.div>

              <p className="text-xl font-black text-[#4d4635]">
                No kitchen orders found
              </p>

              <p className="mt-2 text-sm font-semibold text-[#8a7f66]">
                New orders will appear here automatically after refresh.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.12,
                  },
                },
              }}
              className="relative grid gap-8 xl:grid-cols-3"
            >
              <KitchenColumn
                title="New Orders"
                label="QUEUED"
                orders={newOrders}
                emptyText="No new orders."
                canManage={canManage}
                icon={<Clock size={18} />}
                onReject={(order) =>
                  handleUpdateStatus(order.id, order, "CANCELLED")
                }
                onNext={(order) =>
                  handleUpdateStatus(order.id, order, "PREPARING")
                }
                nextLabel="Start Preparing"
              />

              <KitchenColumn
                title="Preparing"
                label="PREPARING"
                orders={preparingOrders}
                emptyText="No orders preparing."
                canManage={canManage}
                icon={<Flame size={18} />}
                onNext={(order) => handleUpdateStatus(order.id, order, "READY")}
                nextLabel="Mark Ready"
              />

              <KitchenColumn
                title="Ready for Pickup"
                label="READY"
                orders={readyOrders}
                emptyText="No orders ready."
                canManage={canManage}
                icon={<Truck size={18} />}
                onNext={(order) =>
                  handleUpdateStatus(order.id, order, "SERVED")
                }
                nextLabel="Complete Pickup"
              />
            </motion.div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({
  title,
  value,
  note,
  icon,
  accent,
}: {
  title: string;
  value: string;
  note: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="group relative overflow-hidden rounded-[1.75rem] border border-[#d0c5af] bg-white p-6 shadow-lg shadow-[#4d3a0010]"
    >
      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${accent}`} />

      <div className="absolute right-5 top-5 text-[#735c00]/10 transition group-hover:scale-110">
        <Utensils size={64} />
      </div>

      <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg`}>
        {icon}
      </div>

      <p className="text-sm font-black uppercase tracking-widest text-[#4d4635]">
        {title}
      </p>

      <h2 className="mt-3 text-5xl font-black text-[#735c00]">{value}</h2>

      <p className="mt-2 text-sm font-semibold text-[#4d4635]">{note}</p>
    </motion.article>
  );
}

function KitchenColumn({
  title,
  label,
  orders,
  emptyText,
  canManage,
  icon,
  onReject,
  onNext,
  nextLabel,
}: {
  title: string;
  label: string;
  orders: any[];
  emptyText: string;
  canManage: boolean;
  icon: React.ReactNode;
  onReject?: (order: any) => void;
  onNext: (order: any) => void;
  nextLabel: string;
}) {
  return (
    <motion.section
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0 },
      }}
      className="rounded-[1.75rem] border border-[#d0c5af] bg-white/85 p-5 shadow-xl shadow-[#4d3a0010] backdrop-blur"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d4af37]/20 text-[#735c00]">
            {icon}
          </div>

          <div>
            <h2 className="text-xl font-black">{title}</h2>
            <p className="text-xs font-semibold text-[#8a7f66]">
              {orders.length} order{orders.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-black ${getLabelClass(
            label
          )}`}
        >
          {label}
        </span>
      </div>

      <div className="min-h-[130px] space-y-5 rounded-2xl bg-[#fbf9f5]/70 p-3">
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-24 items-center justify-center rounded-2xl border border-dashed border-[#d0c5af] bg-white/70 p-4 text-center text-sm font-bold text-[#8a7f66]"
          >
            {emptyText}
          </motion.div>
        ) : (
          orders.map((order, index) => (
            <KitchenOrderCard
              key={order.id}
              order={order}
              index={index}
              canManage={canManage}
              onReject={onReject}
              onNext={onNext}
              nextLabel={nextLabel}
            />
          ))
        )}
      </div>
    </motion.section>
  );
}

function KitchenOrderCard({
  order,
  index,
  canManage,
  onReject,
  onNext,
  nextLabel,
}: {
  order: any;
  index: number;
  canManage: boolean;
  onReject?: (order: any) => void;
  onNext: (order: any) => void;
  nextLabel: string;
}) {
  const isHighPriority =
    order.priority === "HIGH" || order.priority === "URGENT";

  return (
    <motion.article
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -5, scale: 1.01 }}
      className={`relative overflow-hidden rounded-[1.5rem] border border-[#d9cfbd] border-l-4 bg-white p-5 shadow-md transition ${
        isHighPriority ? "border-l-red-600" : "border-l-[#735c00]"
      }`}
    >
      {isHighPriority && (
        <motion.div
          className="absolute right-4 top-4 h-3 w-3 rounded-full bg-red-500"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}

      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-[#735c00]">
            {order.orderSource || "Kitchen Order"}
          </p>

          <h3 className="mt-2 text-xl font-black">
            {order.tableOrRoom || "-"} - {order.guestName || "-"}
          </h3>
        </div>

        <span
          className={`rounded-xl px-3 py-2 text-xs font-black ${
            isHighPriority
              ? "bg-red-50 text-red-600"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {order.priority || "NORMAL"}
        </span>
      </div>

      <div className="rounded-2xl border border-[#eee5d5] bg-[#fbf9f5] p-4">
        <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#4d4635]">
          <Utensils size={14} />
          Items
        </p>

        <OrderItems items={order.items} />
      </div>

      {order.notes && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex gap-2 rounded-2xl bg-yellow-50 p-3 text-sm font-bold text-[#806300]"
        >
          <AlertTriangle size={18} />
          {order.notes}
        </motion.p>
      )}

      {canManage && (
        <div
          className={`mt-5 grid gap-3 ${
            onReject ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          {onReject && (
            <button
              onClick={() => onReject(order)}
              className="rounded-2xl border border-[#d9cfbd] py-3 font-black transition hover:-translate-y-0.5 hover:bg-[#f5f2eb]"
            >
              Reject
            </button>
          )}

          <button
            onClick={() => onNext(order)}
            className="rounded-2xl bg-[#735c00] py-3 font-black text-white shadow-lg shadow-[#735c00]/20 transition hover:-translate-y-0.5 hover:bg-[#d4af37] hover:text-[#241a00]"
          >
            {nextLabel}
          </button>
        </div>
      )}
    </motion.article>
  );
}

function OrderItems({ items }: { items: any }) {
  if (Array.isArray(items) && items.length > 0) {
    return (
      <div className="space-y-2 text-sm font-bold">
        {items.map((item: any, index: number) => (
          <div
            key={index}
            className="flex justify-between gap-4 rounded-xl bg-white px-3 py-2"
          >
            <span>{item.name || "Item"}</span>
            <span className="rounded-lg bg-[#d4af37]/20 px-2 py-1 text-[#735c00]">
              x{item.quantity || 1}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (typeof items === "string" && items.trim()) {
    return <p className="whitespace-pre-wrap text-sm font-bold">{items}</p>;
  }

  return <p className="text-sm font-semibold text-gray-500">No items added.</p>;
}

function getLabelClass(label: string) {
  if (label === "READY") {
    return "bg-green-100 text-green-700";
  }

  if (label === "PREPARING") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-yellow-100 text-yellow-700";
}