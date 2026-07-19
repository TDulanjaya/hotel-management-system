"use client";
import { AuthUser, getUser } from "@/utils/auth";

import { useEffect, useState } from "react";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getKitchenOrders, updateKitchenOrder } from "@/lib/api/kitchenApi";
import {
  AlertTriangle,
  CheckCircle,
  ChefHat,
  Clock,
  RefreshCw,
  Truck,
} from "lucide-react";

export default function KitchenPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    setUser(getUser());
  }, []);

  
  const [currentRole, setCurrentRole] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canManage =
    currentRole === "OWNER" ||
    currentRole === "MANAGER" ||
    currentRole === "COOK";

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getKitchenOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to load kitchen orders.");
    } finally {
      setLoading(false);
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
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <header className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Kitchen Module
              </p>

              <h1 className="mt-3 text-4xl font-extrabold text-[#735c00]">
                Kitchen Order Board
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Manage restaurant, room service and event food preparation
                status.
              </p>
            </div>

            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
            >
              <RefreshCw size={18} />
              Refresh Orders
            </button>
          </header>

          <section className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="New Orders"
              value={newOrders.length.toString().padStart(2, "0")}
              note="Waiting to start"
              icon={<Clock />}
            />

            <StatCard
              title="Preparing"
              value={preparingOrders.length.toString().padStart(2, "0")}
              note="In kitchen"
              icon={<ChefHat />}
            />

            <StatCard
              title="Ready"
              value={readyOrders.length.toString().padStart(2, "0")}
              note="Waiting pickup"
              icon={<CheckCircle />}
            />

            <StatCard
              title="Total Orders"
              value={orders.length.toString().padStart(2, "0")}
              note="All active orders"
              icon={<Truck />}
            />
          </section>

          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-[#d0c5af] bg-white text-lg font-bold text-[#806300]">
              Loading kitchen orders...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 font-bold text-red-700">
              {error}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-[#d0c5af] bg-white">
              <ChefHat size={48} className="mb-4 text-[#735c00]" />

              <p className="text-xl font-bold text-[#4d4635]">
                No kitchen orders found
              </p>
            </div>
          ) : (
            <div className="grid gap-8 xl:grid-cols-3">
              <KitchenColumn
                title="New Orders"
                label="QUEUED"
                orders={newOrders}
                emptyText="No new orders."
                canManage={canManage}
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
                onNext={(order) => handleUpdateStatus(order.id, order, "READY")}
                nextLabel="Mark Ready"
              />

              <KitchenColumn
                title="Ready for Pickup"
                label="READY"
                orders={readyOrders}
                emptyText="No orders ready."
                canManage={canManage}
                onNext={(order) =>
                  handleUpdateStatus(order.id, order, "SERVED")
                }
                nextLabel="Complete Pickup"
              />
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
}: {
  title: string;
  value: string;
  note: string;
  icon: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4af37] text-[#554300]">
        {icon}
      </div>

      <p className="text-sm font-bold uppercase tracking-widest text-[#4d4635]">
        {title}
      </p>

      <h2 className="mt-3 text-4xl font-extrabold text-[#735c00]">{value}</h2>

      <p className="mt-2 text-sm text-[#4d4635]">{note}</p>
    </article>
  );
}

function KitchenColumn({
  title,
  label,
  orders,
  emptyText,
  canManage,
  onReject,
  onNext,
  nextLabel,
}: {
  title: string;
  label: string;
  orders: any[];
  emptyText: string;
  canManage: boolean;
  onReject?: (order: any) => void;
  onNext: (order: any) => void;
  nextLabel: string;
}) {
  return (
    <section className="rounded-2xl border border-[#d0c5af] bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>

        <span className={`rounded-full px-3 py-1 text-xs font-bold ${getLabelClass(label)}`}>
          {label}
        </span>
      </div>

      <div className="space-y-5">
        {orders.length === 0 ? (
          <p className="rounded-xl bg-[#fbf9f5] p-4 text-sm font-semibold text-[#4d4635]">
            {emptyText}
          </p>
        ) : (
          orders.map((order) => (
            <KitchenOrderCard
              key={order.id}
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
      className={`rounded-2xl border border-[#d9cfbd] border-l-4 bg-[#fbf9f5] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
        isHighPriority ? "border-l-red-600" : "border-l-[#735c00]"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#735c00]">
            {order.orderSource || "Kitchen Order"}
          </p>

          <h3 className="mt-2 text-xl font-extrabold">
            {order.tableOrRoom || "-"} - {order.guestName || "-"}
          </h3>
        </div>

        <span
          className={`rounded-md px-3 py-2 text-xs font-extrabold ${
            isHighPriority
              ? "bg-red-50 text-red-600"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {order.priority || "NORMAL"}
        </span>
      </div>

      <div className="rounded-xl bg-white p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#4d4635]">
          Items
        </p>

        <OrderItems items={order.items} />
      </div>

      {order.notes && (
        <p className="mt-4 flex gap-2 rounded-xl bg-yellow-50 p-3 text-sm font-semibold text-[#806300]">
          <AlertTriangle size={18} />
          {order.notes}
        </p>
      )}

      {canManage && (
        <div className={`mt-5 grid gap-3 ${onReject ? "grid-cols-2" : "grid-cols-1"}`}>
          {onReject && (
            <button
              onClick={() => onReject(order)}
              className="rounded-xl border border-[#d9cfbd] py-3 font-bold transition hover:bg-[#f5f2eb]"
            >
              Reject
            </button>
          )}

          <button
            onClick={() => onNext(order)}
            className="rounded-xl bg-[#735c00] py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
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
      <div className="space-y-1 text-sm font-semibold">
        {items.map((item: any, index: number) => (
          <div key={index} className="flex justify-between gap-4">
            <span>{item.name || "Item"}</span>
            <span>x{item.quantity || 1}</span>
          </div>
        ))}
      </div>
    );
  }

  if (typeof items === "string" && items.trim()) {
    return <p className="whitespace-pre-wrap text-sm font-semibold">{items}</p>;
  }

  return <p className="text-sm text-gray-500">No items added.</p>;
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