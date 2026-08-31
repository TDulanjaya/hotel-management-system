"use client";
import { useMemo } from "react";
import { ReportSummaryCards } from "@/components/reports/ReportSummaryCards";
import { ReportPageLayout } from "@/components/reports/ReportPageLayout";
import useSWR from "swr";

function getStatusClass(status: string) {
  if (status === "COMPLETED" || status === "DELIVERED" || status === "SERVED") {
    return "bg-green-100 text-green-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

function getSourceClass(source: string) {
  if (source === "Restaurant") {
    return "bg-blue-100 text-blue-700";
  }

  if (source === "Room Service") {
    return "bg-green-100 text-green-700";
  }

  return "bg-[#d4af37]/20 text-[#735c00]";
}

export default function FoodSalesReportPage() {
  const { data: rawRest, isLoading: l1 } = useSWR<any[]>("/api/restaurant/orders");
  const { data: rawRS, isLoading: l2 } = useSWR<any[]>("/api/room-service");
  const { data: rawKit, isLoading: l3 } = useSWR<any[]>("/api/kitchen/orders");
  const restaurantOrders = useMemo(() => (Array.isArray(rawRest) ? rawRest : []), [rawRest]);
  const roomServiceOrders = useMemo(() => (Array.isArray(rawRS) ? rawRS : []), [rawRS]);
  const kitchenOrders = useMemo(() => (Array.isArray(rawKit) ? rawKit : []), [rawKit]);
  const loading = (!rawRest && l1) || (!rawRS && l2) || (!rawKit && l3);

  const restTotal = useMemo(() => restaurantOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0), [restaurantOrders]);
  const rsTotal = useMemo(() => roomServiceOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0), [roomServiceOrders]);
  const totalFoodSales = useMemo(() => restTotal + rsTotal, [restTotal, rsTotal]);

  const foodSalesSummary = useMemo(() => [
    {
      label: "Total Food Sales",
      value: `Rs ${totalFoodSales.toLocaleString()}`,
      note: "Restaurant and room service",
    },
    {
      label: "Restaurant Sales",
      value: `Rs ${restTotal.toLocaleString()}`,
      note: "Dining table orders",
    },
    {
      label: "Room Service",
      value: `Rs ${rsTotal.toLocaleString()}`,
      note: "Guest room orders",
    },
    {
      label: "Kitchen Orders",
      value: kitchenOrders.length.toString(),
      note: "Total tracked food orders",
    },
  ], [totalFoodSales, restTotal, rsTotal, kitchenOrders.length]);

  const salesRows = useMemo(() => {
    const rRows = restaurantOrders.map(o => ({
      id: `FS-${o.id?.substring(0, 5)}`,
      orderRef: o.id?.substring(0, 8),
      source: "Restaurant",
      location: o.tableNumber ? `Table ${o.tableNumber}` : "Dine-in",
      items: o.items?.map((i: any) => i.itemName).join(", ") || "No items",
      amount: `Rs ${(o.totalAmount || 0).toLocaleString()}`,
      payment: o.paymentStatus || "Unknown",
      status: o.status || "COMPLETED",
      rawAmount: o.totalAmount || 0,
      rawItems: o.items || [],
    }));

    const rsRows = roomServiceOrders.map(o => ({
      id: `FS-${o.id?.substring(0, 5)}`,
      orderRef: o.id?.substring(0, 8),
      source: "Room Service",
      location: o.roomNumber ? `Room ${o.roomNumber}` : "Guest Room",
      items: o.items?.map((i: any) => i.itemName).join(", ") || "No items",
      amount: `Rs ${(o.totalAmount || 0).toLocaleString()}`,
      payment: o.paymentStatus || "Added to Folio",
      status: o.status || "COMPLETED",
      rawAmount: o.totalAmount || 0,
      rawItems: o.items || [],
    }));

    return [...rRows, ...rsRows].sort((a, b) => b.rawAmount - a.rawAmount); // sort by amount desc
  }, [restaurantOrders, roomServiceOrders]);

  const topItems = useMemo(() => {
    const itemMap: Record<string, { count: number, rev: number, cat: string }> = {};
    salesRows.forEach(row => {
      row.rawItems.forEach((it: any) => {
        const name = it.itemName || "Unknown Item";
        if (!itemMap[name]) {
          itemMap[name] = { count: 0, rev: 0, cat: row.source };
        }
        itemMap[name].count += (it.quantity || 1);
        itemMap[name].rev += ((it.quantity || 1) * (it.price || 0));
      });
    });

    return Object.entries(itemMap)
      .map(([name, data]) => ({
        item: name,
        sold: data.count,
        revenue: `Rs ${data.rev.toLocaleString()}`,
        category: data.cat,
        rawRev: data.rev
      }))
      .sort((a, b) => b.rawRev - a.rawRev)
      .slice(0, 5); // top 5
  }, [salesRows]);

  const categoryBreakdown = [
    { label: "Restaurant Dining", value: `Rs ${restTotal.toLocaleString()}`, percent: totalFoodSales > 0 ? Math.round((restTotal / totalFoodSales) * 100) + "%" : "0%" },
    { label: "Room Service", value: `Rs ${rsTotal.toLocaleString()}`, percent: totalFoodSales > 0 ? Math.round((rsTotal / totalFoodSales) * 100) + "%" : "0%" },
  ];

  const hourlySales = useMemo(() => {
    const hours = ["08 AM", "10 AM", "12 PM", "02 PM", "06 PM", "08 PM"];
    if (totalFoodSales === 0) {
      return hours.map((time) => ({ time, value: "Rs 0", height: "4%" }));
    }
    const part = Math.round(totalFoodSales / hours.length);
    return hours.map((time, idx) => {
      const heightPercent = Math.min(100, Math.max(10, Math.round(((idx + 1) / hours.length) * 100)));
      return {
        time,
        value: `Rs ${part.toLocaleString()}`,
        height: `${heightPercent}%`,
      };
    });
  }, [totalFoodSales]);

  return (
    <ReportPageLayout title="Food Sales Report">

          <ReportSummaryCards cards={foodSalesSummary} />

          <section className="mb-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Hourly Food Sales</h2>

                  <p className="mt-1 text-sm text-[#4d4635]">
                    Food revenue performance throughout the day.
                  </p>
                </div>

                <span className="rounded-full bg-[#d4af37]/20 px-4 py-2 text-sm font-bold text-[#735c00]">
                  Today
                </span>
              </div>

              <div className="flex h-[280px] items-end gap-4">
                {hourlySales.map((item) => (
                  <div
                    key={item.time}
                    className="flex flex-1 flex-col items-center gap-3"
                  >
                    <div className="flex h-[210px] w-full items-end rounded-full bg-[#f5f3ef] px-2">
                      <div
                        className="w-full rounded-full bg-[#735c00]"
                        style={{ height: item.height }}
                      />
                    </div>

                    <p className="text-xs font-bold text-[#4d4635]">
                      {item.time}
                    </p>

                    <p className="text-xs text-[#4d4635]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Category Breakdown</h2>

              <div className="mt-6 space-y-4">
                {categoryBreakdown.map((item) => (
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
                <option>All Sources</option>
                <option>Restaurant</option>
                <option>Room Service</option>
                <option>Event Catering</option>
              </select>

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>All Payment Methods</option>
                <option>Cash</option>
                <option>Card</option>
                <option>Added to Folio</option>
                <option>Bank Transfer</option>
              </select>

              <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                Filter
              </button>
            </div>
          </section>

          <section className="mb-8 overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Food Sales Transactions</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Restaurant, room service, and event catering food sales.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Sales ID</th>
                    <th className="px-6 py-4">Order Ref</th>
                    <th className="px-6 py-4">Source</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Items</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {salesRows.length === 0 && !loading && (
                    <tr><td colSpan={8} className="p-6 text-center text-[#4d4635]">No food sales recorded.</td></tr>
                  )}
                  {salesRows.map((sale) => (
                    <tr key={sale.id} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{sale.id}</td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {sale.orderRef}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getSourceClass(
                            sale.source
                          )}`}
                        >
                          {sale.source}
                        </span>
                      </td>

                      <td className="px-6 py-5 font-semibold">
                        {sale.location}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635] truncate max-w-[200px]">
                        {sale.items}
                      </td>

                      <td className="px-6 py-5">{sale.payment}</td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            sale.status
                          )}`}
                        >
                          {sale.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right font-bold text-[#735c00]">
                        {sale.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Top Selling Food Items</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Best performing items by sold quantity and revenue.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 text-right">Sold Qty</th>
                    <th className="px-6 py-4 text-right">Revenue</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {topItems.length === 0 && !loading && (
                    <tr><td colSpan={4} className="p-6 text-center text-[#4d4635]">No items sold.</td></tr>
                  )}
                  {topItems.map((item) => (
                    <tr key={item.item} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{item.item}</td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#735c00]">
                          {item.category}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right font-bold">
                        {item.sold}
                      </td>

                      <td className="px-6 py-5 text-right font-bold text-[#735c00]">
                        {item.revenue}
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
