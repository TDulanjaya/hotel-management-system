import { ReportSummaryCards } from "@/components/reports/ReportSummaryCards";
import { ReportPageLayout } from "@/components/reports/ReportPageLayout";



const foodSalesSummary = [
  {
    label: "Total Food Sales",
    value: "Rs 6,240",
    note: "Restaurant and room service",
  },
  {
    label: "Restaurant Sales",
    value: "Rs 4,180",
    note: "Dining table orders",
  },
  {
    label: "Room Service",
    value: "Rs 1,460",
    note: "Guest room orders",
  },
  {
    label: "Kitchen Orders",
    value: "86",
    note: "Completed food orders",
  },
];

const salesRows = [
  {
    id: "FS-1001",
    orderRef: "ORD-501",
    source: "Restaurant",
    location: "Table 12",
    items: "Wagyu Beef Burger, Truffle Fries",
    amount: "Rs 86.00",
    payment: "Card",
    status: "Completed",
  },
  {
    id: "FS-1002",
    orderRef: "RS-1001",
    source: "Room Service",
    location: "Room 402",
    items: "Club Sandwich, Orange Juice",
    amount: "Rs 32.00",
    payment: "Added to Folio",
    status: "Completed",
  },
  {
    id: "FS-1003",
    orderRef: "ORD-502",
    source: "Restaurant",
    location: "Table 07",
    items: "Chicken Alfredo, Garden Salad",
    amount: "Rs 58.00",
    payment: "Cash",
    status: "Completed",
  },
  {
    id: "FS-1004",
    orderRef: "EV-0044",
    source: "Event Catering",
    location: "Grand Ballroom",
    items: "Hors d'oeuvres Tray, Sparkling Water",
    amount: "Rs 1,250.00",
    payment: "Bank Transfer",
    status: "Pending",
  },
  {
    id: "FS-1005",
    orderRef: "RS-1002",
    source: "Room Service",
    location: "Room 308",
    items: "Caesar Salad, Coffee",
    amount: "Rs 24.00",
    payment: "Added to Folio",
    status: "Completed",
  },
];

const categoryBreakdown = [
  {
    label: "Main Course",
    value: "Rs 2,850",
    percent: "46%",
  },
  {
    label: "Beverages",
    value: "Rs 1,420",
    percent: "23%",
  },
  {
    label: "Desserts",
    value: "Rs 760",
    percent: "12%",
  },
  {
    label: "Event Catering",
    value: "Rs 1,210",
    percent: "19%",
  },
];

const topItems = [
  {
    item: "Wagyu Beef Burger",
    sold: 34,
    revenue: "Rs 1,360",
    category: "Main Course",
  },
  {
    item: "Chicken Alfredo",
    sold: 28,
    revenue: "Rs 980",
    category: "Main Course",
  },
  {
    item: "Club Sandwich",
    sold: 26,
    revenue: "Rs 780",
    category: "Room Service",
  },
  {
    item: "Cappuccino",
    sold: 46,
    revenue: "Rs 460",
    category: "Beverages",
  },
];

const hourlySales = [
  { time: "08 AM", value: "Rs 420", height: "30%" },
  { time: "10 AM", value: "Rs 680", height: "45%" },
  { time: "12 PM", value: "Rs 1.4k", height: "90%" },
  { time: "02 PM", value: "Rs 950", height: "60%" },
  { time: "06 PM", value: "Rs 1.6k", height: "100%" },
  { time: "08 PM", value: "Rs 1.1k", height: "75%" },
];

function getStatusClass(status: string) {
  if (status === "Completed") {
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

                      <td className="px-6 py-5 text-[#4d4635]">
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
