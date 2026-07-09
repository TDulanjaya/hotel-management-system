"use client";

import { useEffect, useState } from "react";
import { ReportSummaryCards } from "@/components/reports/ReportSummaryCards";
import { ReportPageLayout } from "@/components/reports/ReportPageLayout";
import { getInventoryItems } from "@/lib/api/inventoryApi";

function getStatusClass(status: string) {
  if (status === "Critical" || status === "Urgent") {
    return "bg-red-100 text-red-700";
  }

  if (status === "Approved") {
    return "bg-green-100 text-green-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

function getPriorityClass(priority: string) {
  if (priority === "High") {
    return "bg-red-100 text-red-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

export default function LowStockReportPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const invData = await getInventoryItems();
        setItems(invData || []);
      } catch (err) {
        console.error("Failed to load low stock report", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const lowStockThreshold = (item: any) => item.quantity <= item.reorderLevel;
  const criticalThreshold = (item: any) => item.quantity <= item.reorderLevel / 2;

  const lowStockItems = items.filter(lowStockThreshold);
  const criticalItems = items.filter(criticalThreshold);

  // Since we don't have a purchase request API, we'll mock them based on critical items
  const purchaseRequests = criticalItems.map((item, idx) => ({
    id: `PR-00${idx + 1}`,
    item: item.itemName,
    requestedBy: item.category || "Auto",
    quantity: `${item.reorderLevel * 2} ${item.unit || "units"}`,
    estimatedCost: `Rs ${(item.reorderLevel * 2 * (item.purchasePrice || 100)).toLocaleString()}`,
    status: idx === 0 ? "Urgent" : "Pending Approval",
  }));

  const estimatedReorderCost = lowStockItems.reduce((acc, item) => {
    return acc + ((item.reorderLevel * 2 - item.quantity) * (item.purchasePrice || 100));
  }, 0);

  const lowStockSummary = [
    {
      label: "Low Stock Items",
      value: lowStockItems.length.toString().padStart(2, '0'),
      note: "Below reorder level",
    },
    {
      label: "Critical Items",
      value: criticalItems.length.toString().padStart(2, '0'),
      note: "Need urgent purchase",
    },
    {
      label: "Pending Requests",
      value: purchaseRequests.length.toString().padStart(2, '0'),
      note: "Waiting approval",
    },
    {
      label: "Estimated Cost",
      value: `Rs ${estimatedReorderCost.toLocaleString()}`,
      note: "Reorder budget needed",
    },
  ];

  const lowStockTableRows = lowStockItems.map(item => {
    const isCritical = criticalThreshold(item);
    return {
      id: `INV-${item.id.substring(0, 6)}`,
      item: item.itemName,
      category: item.category || "General",
      currentStock: `${item.quantity} ${item.unit || ""}`,
      minimumStock: `${item.reorderLevel} ${item.unit || ""}`,
      reorderQty: `${item.reorderLevel * 2} ${item.unit || ""}`,
      supplier: item.supplierName || "Default Supplier",
      status: isCritical ? "Critical" : "Low Stock",
      priority: isCritical ? "High" : "Medium",
    };
  });

  return (
    <ReportPageLayout title="Low Stock Report">

          <ReportSummaryCards cards={lowStockSummary} />

          <section className="mb-8 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Stock Alert Overview</h2>

              <div className="mt-6 space-y-4">
                <AlertRow
                  label="Critical Items"
                  value={`${criticalItems.length} Items`}
                  percent={items.length > 0 ? Math.round((criticalItems.length / items.length) * 100) + "%" : "0%"}
                  type="critical"
                />

                <AlertRow
                  label="Low Stock Items"
                  value={`${lowStockItems.length - criticalItems.length} Items`}
                  percent={items.length > 0 ? Math.round(((lowStockItems.length - criticalItems.length) / items.length) * 100) + "%" : "0%"}
                  type="warning"
                />

                <AlertRow
                  label="Purchase Requests Created"
                  value={`${purchaseRequests.length} Requests`}
                  percent={lowStockItems.length > 0 ? Math.round((purchaseRequests.length / lowStockItems.length) * 100) + "%" : "0%"}
                  type="normal"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Reorder Priority</h2>

              <div className="mt-6 space-y-4">
                <PriorityCard
                  title="Urgent Purchase Needed"
                  text={criticalItems.length > 0 ? `${criticalItems.map(i => i.itemName).join(', ')} are below critical level.` : "No urgent items."}
                  type="critical"
                />

                <PriorityCard
                  title="Supplier Follow-up"
                  text="Contact suppliers and confirm delivery dates for pending requests."
                  type="warning"
                />

                <PriorityCard
                  title="Inventory Control"
                  text="Update stock levels after purchase order approval."
                  type="success"
                />
              </div>
            </div>
          </section>

          <section className="mb-8 rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-4">
              <input
                type="text"
                placeholder="Search item..."
                className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              />

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>All Categories</option>
                <option>Kitchen</option>
                <option>Restaurant</option>
                <option>Housekeeping</option>
                <option>Amenities</option>
              </select>

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>All Status</option>
                <option>Low Stock</option>
                <option>Critical</option>
              </select>

              <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                Filter
              </button>
            </div>
          </section>

          <section className="mb-8 overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Low Stock Inventory Items</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Items below minimum stock level and required reorder quantity.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Item ID</th>
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Current Stock</th>
                    <th className="px-6 py-4">Minimum Stock</th>
                    <th className="px-6 py-4">Reorder Qty</th>
                    <th className="px-6 py-4">Supplier</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {lowStockTableRows.length === 0 && !loading && (
                    <tr><td colSpan={9} className="p-6 text-center text-[#4d4635]">No low stock items found.</td></tr>
                  )}
                  {lowStockTableRows.map((item) => (
                    <tr key={item.id} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{item.id}</td>

                      <td className="px-6 py-5 font-semibold">{item.item}</td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#735c00]">
                          {item.category}
                        </span>
                      </td>

                      <td className="px-6 py-5 font-bold text-red-700">
                        {item.currentStock}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {item.minimumStock}
                      </td>

                      <td className="px-6 py-5 font-bold">
                        {item.reorderQty}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {item.supplier}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getPriorityClass(
                            item.priority
                          )}`}
                        >
                          {item.priority}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            item.status
                          )}`}
                        >
                          {item.status}
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
              <h2 className="text-2xl font-bold">Purchase Request Status</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Reorder requests created from low stock alerts.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Request ID</th>
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4">Requested By</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4 text-right">Estimated Cost</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {purchaseRequests.length === 0 && !loading && (
                    <tr><td colSpan={6} className="p-6 text-center text-[#4d4635]">No purchase requests found.</td></tr>
                  )}
                  {purchaseRequests.map((request) => (
                    <tr key={request.id} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{request.id}</td>

                      <td className="px-6 py-5 font-semibold">
                        {request.item}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {request.requestedBy}
                      </td>

                      <td className="px-6 py-5">{request.quantity}</td>

                      <td className="px-6 py-5 text-right font-bold text-[#735c00]">
                        {request.estimatedCost}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
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



function AlertRow({
  label,
  value,
  percent,
  type,
}: {
  label: string;
  value: string;
  percent: string;
  type: "critical" | "warning" | "normal";
}) {
  const barColor =
    type === "critical"
      ? "bg-red-600"
      : type === "warning"
      ? "bg-yellow-500"
      : "bg-[#735c00]";

  return (
    <div className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
      <div className="flex items-center justify-between">
        <p className="font-bold">{label}</p>
        <p className="font-bold text-[#735c00]">{value}</p>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: percent }} />
      </div>

      <p className="mt-2 text-sm text-[#4d4635]">{percent}</p>
    </div>
  );
}

function PriorityCard({
  title,
  text,
  type,
}: {
  title: string;
  text: string;
  type: "critical" | "warning" | "success";
}) {
  const styles = {
    critical: "border-red-200 bg-red-50 text-red-700",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-700",
    success: "border-green-200 bg-green-50 text-green-700",
  };

  return (
    <div className={`rounded-xl border p-4 ${styles[type]}`}>
      <p className="font-bold">{title}</p>
      <p className="mt-1 text-sm">{text}</p>
    </div>
  );
}
