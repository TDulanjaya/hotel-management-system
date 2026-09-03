"use client";

import { AuthUser, getUser } from "@/utils/auth";
import { useEffect, useMemo, useState } from "react";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import useSWR from "swr";
import { swrFetcher } from "@/lib/api/authApi";
import { updateKitchenOrder } from "@/lib/api/kitchenApi";
import { useWebSocket } from "@/hooks/useWebSocket";
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
  LayoutGrid,
} from "lucide-react";

export default function KitchenPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [currentRole, setCurrentRole] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [mobileTab, setMobileTab] = useState<"ALL" | "QUEUED" | "PREPARING" | "READY">("ALL");

  const {
    data: rawOrders,
    mutate,
    isLoading: isSwrLoading,
    error: swrError,
  } = useSWR<any[]>("/api/kitchen/orders", swrFetcher, {
    revalidateOnFocus: true,
    refreshInterval: 5000,
  });

  const orders = useMemo(() => (Array.isArray(rawOrders) ? rawOrders : []), [rawOrders]);
  const loading = !rawOrders && isSwrLoading;
  const error = swrError?.message || "";

  const canManage =
    currentRole === "OWNER" ||
    currentRole === "MANAGER" ||
    currentRole === "COOK";

  useEffect(() => {
    setUser(getUser());
  }, []);

  useWebSocket("/topic/kitchen", () => {
    mutate();
  });

  const fetchOrders = async () => {
    setRefreshing(true);
    await mutate();
    setTimeout(() => setRefreshing(false), 400);
  };

  useEffect(() => {
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

  const newOrders = useMemo(
    () => orders.filter((order) => (order.status || "").toUpperCase() === "QUEUED"),
    [orders]
  );
  const preparingOrders = useMemo(
    () => orders.filter((order) => (order.status || "").toUpperCase() === "PREPARING"),
    [orders]
  );
  const readyOrders = useMemo(
    () => orders.filter((order) => (order.status || "").toUpperCase() === "READY"),
    [orders]
  );

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
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-4 py-6 pt-16 sm:px-8 sm:py-10 lg:pt-10 lg:ml-[280px]">
          {/* Header Banner */}
          <header className="relative mb-6 sm:mb-8 overflow-hidden rounded-2xl sm:rounded-3xl border border-[#d0c5af] bg-gradient-to-br from-[#111827] via-[#172033] to-[#2c2100] p-6 sm:p-8 text-white shadow-xl">
            <div className="absolute right-4 top-4 sm:right-8 sm:top-8 opacity-15 pointer-events-none">
              <ChefHat size={96} />
            </div>

            <div className="relative flex flex-col justify-between gap-4 sm:gap-6 sm:flex-row sm:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#f8d75c]">
                  <Sparkles size={14} />
                  Live Kitchen Operations
                </div>

                <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Kitchen Order Board
                </h1>

                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#f5e9c9] max-w-xl">
                  Live real-time food tickets from restaurant tables, room service, and banquet events.
                </p>
              </div>

              <button
                onClick={fetchOrders}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#d4af37] px-6 py-3 font-bold text-[#241a00] shadow-md transition hover:bg-white active:scale-95 text-xs sm:text-sm"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : "transition hover:rotate-180"}
                />
                Refresh Orders
              </button>
            </div>
          </header>

          {/* Metric Cards */}
          <section className="mb-6 sm:mb-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <StatCard
              title="Queued Orders"
              value={newOrders.length.toString().padStart(2, "0")}
              note="Waiting to start"
              icon={<Clock size={20} className="text-amber-600" />}
              badgeBg="bg-amber-50"
            />

            <StatCard
              title="Preparing"
              value={preparingOrders.length.toString().padStart(2, "0")}
              note="On burners & grills"
              icon={<Flame size={20} className="text-blue-600" />}
              badgeBg="bg-blue-50"
            />

            <StatCard
              title="Ready for Pickup"
              value={readyOrders.length.toString().padStart(2, "0")}
              note="Plated & waiting"
              icon={<CheckCircle size={20} className="text-emerald-600" />}
              badgeBg="bg-emerald-50"
            />

            <StatCard
              title="Active Tickets"
              value={orders.length.toString().padStart(2, "0")}
              note="Total in progress"
              icon={<Truck size={20} className="text-[#735c00]" />}
              badgeBg="bg-[#f5eed9]"
            />
          </section>

          {/* Mobile Column View Switcher */}
          <div className="mb-6 flex xl:hidden overflow-x-auto rounded-2xl border border-[#d0c5af] bg-white p-1.5 shadow-sm">
            <button
              onClick={() => setMobileTab("ALL")}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                mobileTab === "ALL"
                  ? "bg-[#735c00] text-white shadow-sm"
                  : "text-[#4d4635] hover:bg-[#f5f3ef]"
              }`}
            >
              <LayoutGrid size={15} />
              All Columns ({orders.length})
            </button>

            <button
              onClick={() => setMobileTab("QUEUED")}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                mobileTab === "QUEUED"
                  ? "bg-[#735c00] text-white shadow-sm"
                  : "text-[#4d4635] hover:bg-[#f5f3ef]"
              }`}
            >
              <Clock size={15} className="text-amber-600" />
              Queued ({newOrders.length})
            </button>

            <button
              onClick={() => setMobileTab("PREPARING")}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                mobileTab === "PREPARING"
                  ? "bg-[#735c00] text-white shadow-sm"
                  : "text-[#4d4635] hover:bg-[#f5f3ef]"
              }`}
            >
              <Flame size={15} className="text-blue-600" />
              Preparing ({preparingOrders.length})
            </button>

            <button
              onClick={() => setMobileTab("READY")}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                mobileTab === "READY"
                  ? "bg-[#735c00] text-white shadow-sm"
                  : "text-[#4d4635] hover:bg-[#f5f3ef]"
              }`}
            >
              <CheckCircle size={15} className="text-emerald-600" />
              Ready ({readyOrders.length})
            </button>
          </div>

          {/* Kanban Board Container */}
          {loading ? (
            <div className="flex h-72 flex-col items-center justify-center rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#735c00] border-t-transparent mb-3" />
              <p className="font-bold text-[#735c00]">Loading kitchen orders...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700 font-bold shadow-sm">
              {error}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex h-72 flex-col items-center justify-center rounded-2xl border border-[#d0c5af] bg-white p-6 text-center shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f3ef] text-[#735c00] mb-4">
                <ChefHat size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#1b1c1a]">No active kitchen orders</h3>
              <p className="mt-1 text-xs sm:text-sm text-[#4d4635] max-w-sm">
                New orders placed from Restaurant, Room Service, or Events will appear on this board live.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 xl:grid-cols-3">
              {(mobileTab === "ALL" || mobileTab === "QUEUED") && (
                <KitchenColumn
                  title="New Orders"
                  label="QUEUED"
                  orders={newOrders}
                  emptyText="No orders waiting in queue."
                  canManage={canManage}
                  icon={<Clock size={18} className="text-amber-700" />}
                  onReject={(order) =>
                    handleUpdateStatus(order.id, order, "CANCELLED")
                  }
                  onNext={(order) =>
                    handleUpdateStatus(order.id, order, "PREPARING")
                  }
                  nextLabel="Start Preparing"
                />
              )}

              {(mobileTab === "ALL" || mobileTab === "PREPARING") && (
                <KitchenColumn
                  title="Preparing"
                  label="PREPARING"
                  orders={preparingOrders}
                  emptyText="No orders currently being prepared."
                  canManage={canManage}
                  icon={<Flame size={18} className="text-blue-700" />}
                  onNext={(order) =>
                    handleUpdateStatus(order.id, order, "READY")
                  }
                  nextLabel="Mark Ready"
                />
              )}

              {(mobileTab === "ALL" || mobileTab === "READY") && (
                <KitchenColumn
                  title="Ready for Pickup"
                  label="READY"
                  orders={readyOrders}
                  emptyText="No orders waiting for pickup."
                  canManage={canManage}
                  icon={<Truck size={18} className="text-emerald-700" />}
                  onNext={(order) =>
                    handleUpdateStatus(order.id, order, "SERVED")
                  }
                  nextLabel="Complete Pickup"
                />
              )}
            </div>
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
  badgeBg,
}: {
  title: string;
  value: string;
  note: string;
  icon: React.ReactNode;
  badgeBg: string;
}) {
  return (
    <article className="rounded-2xl border border-[#d0c5af] bg-white p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#4d4635]">
          {title}
        </p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${badgeBg}`}>
          {icon}
        </div>
      </div>

      <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-[#1b1c1a]">
        {value}
      </h2>

      <p className="mt-1 text-xs text-[#6d6251]">{note}</p>
    </article>
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
    <section className="flex flex-col rounded-2xl sm:rounded-3xl border border-[#d0c5af] bg-white p-4 sm:p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f3ef]">
            {icon}
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#1b1c1a]">{title}</h2>
            <p className="text-xs font-semibold text-[#6d6251]">
              {orders.length} order{orders.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${getLabelClass(
            label
          )}`}
        >
          {label}
        </span>
      </div>

      <div className="space-y-4 rounded-xl bg-[#fbf9f5] p-3 flex-1 min-h-[140px]">
        {orders.length === 0 ? (
          <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-[#d0c5af] bg-white p-4 text-center text-xs font-semibold text-[#6d6251]">
            {emptyText}
          </div>
        ) : (
          orders.map((order, index) => (
            <KitchenOrderCard
              key={order.id || index}
              order={order}
              canManage={canManage}
              onReject={onReject}
              onNext={onNext}
              nextLabel={nextLabel}
            />
          ))
        )}
      </div>
    </section>
  );
}

function KitchenOrderCard({
  order,
  canManage,
  onReject,
  onNext,
  nextLabel,
}: {
  order: any;
  canManage: boolean;
  onReject?: (order: any) => void;
  onNext: (order: any) => void;
  nextLabel: string;
}) {
  const isHighPriority =
    order.priority === "HIGH" || order.priority === "URGENT";

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border border-[#d0c5af] border-l-4 bg-white p-4 shadow-sm transition ${
        isHighPriority ? "border-l-red-600" : "border-l-[#735c00]"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#735c00]">
            {order.orderSource || "Restaurant"}
          </p>

          <h3 className="mt-0.5 text-base sm:text-lg font-bold text-[#1b1c1a]">
            {order.tableOrRoom || "Table / Room"} - {order.guestName || "Walk-in Guest"}
          </h3>
        </div>

        <span
          className={`rounded-lg px-2.5 py-1 text-[11px] font-bold ${
            isHighPriority
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {order.priority || "NORMAL"}
        </span>
      </div>

      <div className="rounded-xl border border-[#ede7db] bg-[#fbf9f5] p-3">
        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#4d4635]">
          <Utensils size={13} className="text-[#735c00]" />
          Items
        </p>

        <OrderItems items={order.items} />
      </div>

      {order.notes && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-2.5 text-xs text-amber-900 border border-amber-200">
          <AlertTriangle size={14} className="text-amber-700 shrink-0 mt-0.5" />
          <span>{order.notes}</span>
        </div>
      )}

      {canManage && (
        <div
          className={`mt-4 grid gap-2 ${
            onReject ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          {onReject && (
            <button
              onClick={() => onReject(order)}
              className="rounded-xl border border-[#d0c5af] bg-white py-2 text-xs font-bold text-[#4d4635] transition hover:bg-[#f5f3ef]"
            >
              Reject
            </button>
          )}

          <button
            onClick={() => onNext(order)}
            className="rounded-xl bg-[#735c00] py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#d4af37] hover:text-[#241a00] active:scale-95"
          >
            {nextLabel}
          </button>
        </div>
      )}
    </article>
  );
}

function OrderItems({ items }: { items: any }) {
  if (Array.isArray(items) && items.length > 0) {
    return (
      <div className="space-y-1.5 text-xs font-semibold">
        {items.map((item: any, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between gap-3 rounded-lg bg-white px-2.5 py-1.5 border border-[#ede7db]"
          >
            <span className="text-[#1b1c1a]">{item.name || "Item"}</span>
            <span className="rounded bg-[#f5eed9] px-2 py-0.5 text-[11px] font-bold text-[#735c00]">
              x{item.quantity || 1}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (typeof items === "string" && items.trim()) {
    return <p className="whitespace-pre-wrap text-xs font-medium text-[#1b1c1a]">{items}</p>;
  }

  return <p className="text-xs text-[#6d6251]">No item details.</p>;
}

function getLabelClass(label: string) {
  if (label === "READY") {
    return "bg-emerald-100 text-emerald-800";
  }

  if (label === "PREPARING") {
    return "bg-blue-100 text-blue-800";
  }

  return "bg-amber-100 text-amber-800";
}