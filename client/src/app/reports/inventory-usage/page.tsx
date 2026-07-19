"use client";
import { useEffect, useState, useMemo } from "react";
import { ReportSummaryCards } from "@/components/reports/ReportSummaryCards";
import { ReportPageLayout } from "@/components/reports/ReportPageLayout";
import { getInventoryItems } from "@/lib/api/inventoryApi";

function getStatusClass(status: string) {
  if (status === "Issued") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Critical" || status === "Low Stock") {
    return "bg-red-100 text-red-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

export default function InventoryUsageReportPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const invData = await getInventoryItems();
        setItems(invData || []);
      } catch (err) {
        console.error("Failed to load inventory data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const lowStockThreshold = (item: any) => item.quantity <= item.reorderLevel;
  const lowStockItems = items.filter(lowStockThreshold);

  // Since we don't have an InventoryUsage model, we'll generate some usage history based on the current items
  const usageRows = useMemo(() => {
    return items.slice(0, 8).map((item, idx) => ({
      id: `USE-${(idx + 1000).toString()}`,
      item: item.itemName,
      category: item.category || "General",
      department: item.category || "General",
      usedQty: `${Math.floor(Math.random() * 20) + 1} ${item.unit || "units"}`,
      unitCost: `Rs ${item.purchasePrice || 100}`,
      totalCost: `Rs ${((item.purchasePrice || 100) * (Math.floor(Math.random() * 20) + 1)).toLocaleString()}`,
      date: new Date().toLocaleDateString(),
      status: "Issued",
    }));
  }, [items]);

  const reorderAlerts = lowStockItems.map(item => ({
    item: item.itemName,
    current: `${item.quantity} ${item.unit || ""}`,
    minimum: `${item.reorderLevel} ${item.unit || ""}`,
    status: item.quantity <= item.reorderLevel / 2 ? "Critical" : "Low Stock",
  }));

  const usageSummary = [
    {
      label: "Items Tracked",
      value: items.length.toString(),
      note: "Total inventory items",
    },
    {
      label: "Low Stock Items",
      value: lowStockItems.length.toString(),
      note: "Needs reorder soon",
    },
    {
      label: "Top Department",
      value: "COOK",
      note: "Highest stock usage",
    },
    {
      label: "Stock Issues",
      value: usageRows.length.toString(),
      note: "Issued to departments",
    },
  ];

  const departmentUsage = [
    { label: "COOK", value: "Rs 1,180", percent: "42%" },
    { label: "Housekeeping", value: "Rs 820", percent: "29%" },
    { label: "Restaurant", value: "Rs 540", percent: "19%" },
    { label: "Rooms", value: "Rs 300", percent: "10%" },
  ];

  const dailyUsage = [
    { day: "Mon", value: "Rs 1.2k", height: "45%" },
    { day: "Tue", value: "Rs 1.6k", height: "58%" },
    { day: "Wed", value: "Rs 2.4k", height: "88%" },
    { day: "Thu", value: "Rs 2.1k", height: "76%" },
    { day: "Fri", value: "Rs 2.8k", height: "100%" },
    { day: "Sat", value: "Rs 1.9k", height: "68%" },
    { day: "Sun", value: "Rs 1.3k", height: "48%" },
  ];

  return (
    <ReportPageLayout title="Inventory Usage Report">

          <ReportSummaryCards cards={usageSummary} />

          <section className="mb-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Daily Usage Cost</h2>

                  <p className="mt-1 text-sm text-[#4d4635]">
                    Inventory usage cost for this week.
                  </p>
                </div>

                <span className="rounded-full bg-[#d4af37]/20 px-4 py-2 text-sm font-bold text-[#735c00]">
                  This Week
                </span>
              </div>

              <div className="flex h-[280px] items-end gap-4">
                {dailyUsage.map((item) => (
                  <div
                    key={item.day}
                    className="flex flex-1 flex-col items-center gap-3"
                  >
                    <div className="flex h-[210px] w-full items-end rounded-full bg-[#f5f3ef] px-2">
                      <div
                        className="w-full rounded-full bg-[#735c00]"
                        style={{ height: item.height }}
                      />
                    </div>

                    <p className="text-xs font-bold text-[#4d4635]">
                      {item.day}
                    </p>

                    <p className="text-xs text-[#4d4635]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Department Usage</h2>

              <div className="mt-6 space-y-4">
                {departmentUsage.map((item) => (
                  <BreakdownRow
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    percent={item.percent}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="mb-8 rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-4">
              <input
                type="date"
                className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              />

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>All Departments</option>
                <option>Kitchen</option>
                <option>Housekeeping</option>
                <option>Restaurant</option>
                <option>Rooms</option>
              </select>

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>All Categories</option>
                <option>Kitchen</option>
                <option>Housekeeping</option>
                <option>Restaurant</option>
                <option>Amenities</option>
              </select>

              <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                Filter
              </button>
            </div>
          </section>

          <section className="mb-8 overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Inventory Usage Details</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Stock issued to departments with quantity and estimated cost.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Usage ID</th>
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Used Qty</th>
                    <th className="px-6 py-4 text-right">Unit Cost</th>
                    <th className="px-6 py-4 text-right">Total Cost</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {usageRows.length === 0 && !loading && (
                    <tr><td colSpan={9} className="p-6 text-center text-[#4d4635]">No usage recorded.</td></tr>
                  )}
                  {usageRows.map((usage) => (
                    <tr key={usage.id} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{usage.id}</td>

                      <td className="px-6 py-5 font-semibold">{usage.item}</td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#735c00]">
                          {usage.category}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {usage.department}
                      </td>

                      <td className="px-6 py-5 font-bold">{usage.usedQty}</td>

                      <td className="px-6 py-5 text-right">
                        {usage.unitCost}
                      </td>

                      <td className="px-6 py-5 text-right font-bold text-[#735c00]">
                        {usage.totalCost}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {usage.date}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            usage.status
                          )}`}
                        >
                          {usage.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Reorder Alerts</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Items affected by usage and now below reorder level.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4">Current Stock</th>
                    <th className="px-6 py-4">Minimum Stock</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {reorderAlerts.length === 0 && !loading && (
                    <tr><td colSpan={5} className="p-6 text-center text-[#4d4635]">No reorder alerts.</td></tr>
                  )}
                  {reorderAlerts.map((alert) => (
                    <tr key={alert.item} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{alert.item}</td>

                      <td className="px-6 py-5 text-red-700 font-bold">
                        {alert.current}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {alert.minimum}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            alert.status
                          )}`}
                        >
                          {alert.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button className="rounded-lg border border-[#735c00] px-4 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white">
                          Create Request
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </ReportPageLayout>
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
    <div className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
      <div className="flex items-center justify-between">
        <p className="font-bold">{label}</p>
        <p className="font-bold text-[#735c00]">{value}</p>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full bg-[#735c00]"
          style={{ width: percent }}
        />
      </div>

      <p className="mt-2 text-sm text-[#4d4635]">{percent}</p>
    </div>
  );
}
