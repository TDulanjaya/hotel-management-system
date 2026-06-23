import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Link from "next/link";

const reports = [
  {
    title: "Daily Revenue",
    href: "/reports/daily-revenue",
    category: "Finance",
    value: "Rs 42,850",
    note: "Today collection and revenue breakdown.",
    icon: "$",
  },
  {
    title: "Net Profit",
    href: "/reports/net-profit",
    category: "Finance",
    value: "Rs 18,920",
    note: "Revenue minus expenses and operating cost.",
    icon: "↗",
  },
  {
    title: "Occupancy",
    href: "/reports/occupancy",
    category: "Rooms",
    value: "78%",
    note: "Room occupancy and availability report.",
    icon: "▰",
  },
  {
    title: "Low Stock",
    href: "/reports/low-stock",
    category: "Inventory",
    value: "06",
    note: "Items below minimum stock level.",
    icon: "▧",
  },
  {
    title: "Payment Summary",
    href: "/reports/payment-summary",
    category: "Payments",
    value: "Rs 42,850",
    note: "Card, cash, bank, and online payments.",
    icon: "▤",
  },
  {
    title: "Event Income",
    href: "/reports/event-income",
    category: "Events",
    value: "Rs 12,400",
    note: "Event bookings and venue income.",
    icon: "▣",
  },
  {
    title: "Food Sales",
    href: "/reports/food-sales",
    category: "Restaurant",
    value: "Rs 6,240",
    note: "Restaurant and room service sales.",
    icon: "🍽",
  },
  {
    title: "Parking Income",
    href: "/reports/parking-income",
    category: "Parking",
    value: "Rs 780",
    note: "Parking slot usage and income.",
    icon: "P",
  },
  {
    title: "Inventory Usage",
    href: "/reports/inventory-usage",
    category: "Inventory",
    value: "128",
    note: "Stock usage by department.",
    icon: "▥",
  },
  {
    title: "Audit History",
    href: "/reports/audit-history",
    category: "Security",
    value: "214",
    note: "User actions and system activity logs.",
    icon: "☷",
  },
];

const quickStats = [
  {
    label: "Today Revenue",
    value: "Rs 42,850",
  },
  {
    label: "Occupancy Rate",
    value: "78%",
  },
  {
    label: "Pending Payments",
    value: "Rs 18,420",
  },
  {
    label: "Low Stock Items",
    value: "06",
  },
];

const recentReports = [
  {
    name: "Daily Revenue Report",
    generatedBy: "Manager",
    time: "Today, 09:30 AM",
    status: "Ready",
  },
  {
    name: "Low Stock Report",
    generatedBy: "Inventory Staff",
    time: "Today, 08:15 AM",
    status: "Ready",
  },
  {
    name: "Audit History Report",
    generatedBy: "Owner",
    time: "Yesterday, 05:40 PM",
    status: "Reviewed",
  },
];

function getCategoryClass(category: string) {
  if (category === "Finance" || category === "Payments") {
    return "bg-green-100 text-green-700";
  }

  if (category === "Inventory") {
    return "bg-yellow-100 text-yellow-700";
  }

  if (category === "Security") {
    return "bg-red-100 text-red-700";
  }

  return "bg-[#d4af37]/20 text-[#735c00]";
}

function getStatusClass(status: string) {
  if (status === "Ready") {
    return "bg-green-100 text-green-700";
  }

  return "bg-blue-100 text-blue-700";
}

export default function ReportsPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "manager"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Management Analytics
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Reports & Analytics
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View hotel revenue, profit, occupancy, inventory, payments,
                events, and audit reports.
              </p>
            </div>

            <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
              Export All Reports
            </button>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            {quickStats.map((stat) => (
              <StatCard key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </section>

          <section className="mb-8 rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-4">
              <input
                type="text"
                placeholder="Search report..."
                className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              />

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>All Categories</option>
                <option>Finance</option>
                <option>Rooms</option>
                <option>Inventory</option>
                <option>Events</option>
                <option>Security</option>
              </select>

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>This Month</option>
                <option>Today</option>
                <option>This Week</option>
                <option>This Year</option>
              </select>

              <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                Filter
              </button>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {reports.map((report) => (
              <Link
                key={report.href}
                href={report.href}
                className="group rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#735c00] text-xl font-bold text-white transition group-hover:bg-[#d4af37] group-hover:text-[#241a00]">
                    {report.icon}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${getCategoryClass(
                      report.category
                    )}`}
                  >
                    {report.category}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-[#735c00]">
                  {report.title}
                </h2>

                <p className="mt-2 text-3xl font-extrabold">{report.value}</p>

                <p className="mt-3 text-sm leading-6 text-[#4d4635]">
                  {report.note}
                </p>

                <div className="mt-6 rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 text-sm font-bold text-[#735c00] transition group-hover:border-[#735c00] group-hover:bg-[#735c00] group-hover:text-white">
                  Open Report →
                </div>
              </Link>
            ))}
          </section>

          <section className="mt-8 overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Recently Generated Reports</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Latest reports generated by system users.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Report Name</th>
                    <th className="px-6 py-4">Generated By</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {recentReports.map((report) => (
                    <tr key={report.name} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{report.name}</td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {report.generatedBy}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {report.time}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            report.status
                          )}`}
                        >
                          {report.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button className="rounded-lg border border-[#735c00] px-4 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white">
                          Download
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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-widest text-[#4d4635]">
        {label}
      </p>

      <p className="mt-2 text-4xl font-extrabold text-[#735c00]">{value}</p>
    </div>
  );
}