import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const usageSummary = [
  {
    label: "Items Used",
    value: "128",
    note: "Total stock movements today",
  },
  {
    label: "Usage Cost",
    value: "Rs 2,840",
    note: "Estimated inventory cost",
  },
  {
    label: "Top Department",
    value: "COOK",
    note: "Highest stock usage",
  },
  {
    label: "Stock Issues",
    value: "09",
    note: "Issued to departments",
  },
];

const usageRows = [
  {
    id: "USE-1001",
    item: "Basmati Rice",
    category: "COOK",
    department: "COOK",
    usedQty: "18 kg",
    unitCost: "Rs 4.20",
    totalCost: "Rs 75.60",
    date: "Oct 24, 2024",
    status: "Issued",
  },
  {
    id: "USE-1002",
    item: "Premium Bath Towels",
    category: "Housekeeping",
    department: "Housekeeping",
    usedQty: "24 pcs",
    unitCost: "Rs 8.50",
    totalCost: "Rs 204.00",
    date: "Oct 24, 2024",
    status: "Issued",
  },
  {
    id: "USE-1003",
    item: "Mineral Water Bottles",
    category: "Restaurant",
    department: "Restaurant",
    usedQty: "96 bottles",
    unitCost: "Rs 0.60",
    totalCost: "Rs 57.60",
    date: "Oct 24, 2024",
    status: "Issued",
  },
  {
    id: "USE-1004",
    item: "Room Shampoo Set",
    category: "Amenities",
    department: "Rooms",
    usedQty: "34 sets",
    unitCost: "Rs 2.10",
    totalCost: "Rs 71.40",
    date: "Oct 24, 2024",
    status: "Low Balance",
  },
  {
    id: "USE-1005",
    item: "Cleaning Liquid",
    category: "Housekeeping",
    department: "Housekeeping",
    usedQty: "12 liters",
    unitCost: "Rs 3.80",
    totalCost: "Rs 45.60",
    date: "Oct 24, 2024",
    status: "Issued",
  },
];

const departmentUsage = [
  {
    label: "COOK",
    value: "Rs 1,180",
    percent: "42%",
  },
  {
    label: "Housekeeping",
    value: "Rs 820",
    percent: "29%",
  },
  {
    label: "Restaurant",
    value: "Rs 540",
    percent: "19%",
  },
  {
    label: "Rooms",
    value: "Rs 300",
    percent: "10%",
  },
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

const reorderAlerts = [
  {
    item: "Room Shampoo Set",
    current: "18 sets",
    minimum: "60 sets",
    status: "Critical",
  },
  {
    item: "Basmati Rice",
    current: "35 kg",
    minimum: "50 kg",
    status: "Low Stock",
  },
  {
    item: "Premium Coffee Beans",
    current: "12 kg",
    minimum: "30 kg",
    status: "Critical",
  },
];

function getStatusClass(status: string) {
  if (status === "Issued") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Critical") {
    return "bg-red-100 text-red-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

export default function InventoryUsageReportPage() {
  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Reports & Analytics
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Inventory Usage Report
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View used inventory items, stock movement, department usage,
                usage cost, and reorder alerts.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/reports"
                className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
              >
                Back to Reports
              </a>

              <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                Export Report
              </button>
            </div>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            {usageSummary.map((item) => (
              <StatCard
                key={item.label}
                label={item.label}
                value={item.value}
                note={item.note}
              />
            ))}
          </section>

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

      <p className="mt-2 text-sm text-[#4d4635]">{note}</p>
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
