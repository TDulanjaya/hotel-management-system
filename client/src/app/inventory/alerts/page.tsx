"use client";

import { useMemo } from "react";
import Link from "next/link";
import useSWR from "swr";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AlertTriangle, ArrowLeft, PackageCheck } from "lucide-react";

export default function InventoryAlertsPage() {
  const { data: rawItems, isLoading } = useSWR<any[]>("/api/inventory");
  const items = useMemo(() => (Array.isArray(rawItems) ? rawItems : []), [rawItems]);

  const lowStockItems = useMemo(() => {
    return items.filter((item) => {
      const qty = Number(item.quantity || 0);
      const reorder = Number(item.reorderLevel || 10);
      return qty <= reorder;
    });
  }, [items]);

  const criticalItems = useMemo(() => {
    return lowStockItems.filter((item) => {
      const qty = Number(item.quantity || 0);
      const reorder = Number(item.reorderLevel || 10);
      return qty <= Math.max(1, Math.floor(reorder / 2));
    });
  }, [lowStockItems]);

  const normalLowItems = useMemo(() => {
    return lowStockItems.filter((item) => !criticalItems.includes(item));
  }, [lowStockItems, criticalItems]);

  const departmentAlerts = useMemo(() => {
    const map = new Map<string, number>();
    lowStockItems.forEach((item) => {
      const cat = item.category || "General";
      map.set(cat, (map.get(cat) || 0) + 1);
    });

    const total = lowStockItems.length || 1;
    return Array.from(map.entries()).map(([label, count]) => ({
      label,
      value: `${count} item${count > 1 ? "s" : ""}`,
      percent: `${Math.round((count / total) * 100)}%`,
    }));
  }, [lowStockItems]);

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "INVENTORY"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Inventory Management
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Inventory Alerts
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View low stock alerts, critical stock warnings, and reorder actions.
              </p>
            </div>

            <Link
              href="/inventory"
              className="flex items-center gap-2 rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
            >
              <ArrowLeft size={18} />
              Back to Inventory
            </Link>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-3">
            <StatCard
              label="Total Alerts"
              value={String(lowStockItems.length)}
              note="Items needing attention"
            />
            <StatCard
              label="Critical Stock"
              value={String(criticalItems.length)}
              note="Critically low inventory"
            />
            <StatCard
              label="Low Stock"
              value={String(normalLowItems.length)}
              note="Below reorder threshold"
            />
          </section>

          <section className="mb-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Alert Priority</h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <AlertCard
                  title="Critical Stock"
                  value={`${criticalItems.length} Items`}
                  text="Stock is critically low. Immediate purchase request needed."
                  type="critical"
                />

                <AlertCard
                  title="Low Stock"
                  value={`${normalLowItems.length} Items`}
                  text="Items are below configured reorder level."
                  type="warning"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Category Distribution</h2>

              <div className="mt-6 space-y-4">
                {departmentAlerts.length === 0 ? (
                  <p className="text-sm text-[#4d4635]">No low-stock categories detected.</p>
                ) : (
                  departmentAlerts.map((item) => (
                    <BreakdownRow
                      key={item.label}
                      label={item.label}
                      value={item.value}
                      percent={item.percent}
                    />
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold">Active Inventory Alerts</h2>

            <p className="mt-1 text-sm text-[#4d4635]">
              Real-time list of inventory items that require restocking.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Current Stock</th>
                    <th className="px-6 py-4">Reorder Level</th>
                    <th className="px-6 py-4">Supplier</th>
                    <th className="px-6 py-4">Alert Type</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {lowStockItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-[#4d4635]">
                        <PackageCheck className="mx-auto mb-2 text-green-600" size={32} />
                        All inventory stock levels are healthy! No active alerts.
                      </td>
                    </tr>
                  ) : (
                    lowStockItems.map((item) => {
                      const isCritical = Number(item.quantity || 0) <= Math.max(1, Math.floor(Number(item.reorderLevel || 10) / 2));
                      return (
                        <tr key={item.id || item.itemName} className="transition hover:bg-[#fbf9f5]">
                          <td className="px-6 py-5 font-bold">{item.itemName}</td>
                          <td className="px-6 py-5 text-[#4d4635]">{item.category || "General"}</td>
                          <td className="px-6 py-5 font-semibold text-red-700">
                            {item.quantity} {item.unit || "units"}
                          </td>
                          <td className="px-6 py-5 text-[#4d4635]">
                            {item.reorderLevel || 10} {item.unit || "units"}
                          </td>
                          <td className="px-6 py-5 text-[#4d4635]">{item.supplierName || "—"}</td>
                          <td className="px-6 py-5">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${
                                isCritical
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {isCritical ? "Critical" : "Low Stock"}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-widest text-[#4d4635]">
        {label}
      </p>

      <p className="mt-2 text-4xl font-extrabold text-[#735c00]">{value}</p>

      <p className="mt-2 text-sm text-[#7f7663]">{note}</p>
    </div>
  );
}

function AlertCard({
  title,
  value,
  text,
  type,
}: {
  title: string;
  value: string;
  text: string;
  type: string;
}) {
  const isCritical = type === "critical";

  return (
    <div
      className={`rounded-xl border p-5 ${
        isCritical
          ? "border-red-200 bg-red-50 text-red-950"
          : "border-yellow-200 bg-yellow-50 text-yellow-950"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-bold">{title}</h3>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            isCritical
              ? "bg-red-200 text-red-800"
              : "bg-yellow-200 text-yellow-800"
          }`}
        >
          {value}
        </span>
      </div>

      <p className="mt-3 text-sm">{text}</p>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  percent,
}: {
  label: string;
  value: string;
  percent: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm font-bold">
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#e8e6e1]">
        <div
          className="h-full rounded-full bg-[#735c00]"
          style={{ width: percent }}
        />
      </div>
    </div>
  );
}
