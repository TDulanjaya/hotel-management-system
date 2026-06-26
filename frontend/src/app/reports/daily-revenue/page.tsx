import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const revenueSummary = [
  {
    label: "Total Revenue",
    value: "Rs 42,850",
    note: "All departments today",
  },
  {
    label: "Room Revenue",
    value: "Rs 23,400",
    note: "Bookings and stay charges",
  },
  {
    label: "Food Sales",
    value: "Rs 6,240",
    note: "Restaurant and room service",
  },
  {
    label: "Event Income",
    value: "Rs 12,400",
    note: "Venue and event payments",
  },
];

const revenueRows = [
  {
    id: "REV-1001",
    department: "Rooms",
    source: "Room Booking",
    reference: "Res #LX-9902",
    income: "Rs 1,250.00",
    paymentMethod: "Card",
    time: "09:20 AM",
    status: "Completed",
  },
  {
    id: "REV-1002",
    department: "Restaurant",
    source: "Food Sales",
    reference: "Table #12",
    income: "Rs 320.00",
    paymentMethod: "Cash",
    time: "11:45 AM",
    status: "Completed",
  },
  {
    id: "REV-1003",
    department: "EVENTS",
    source: "Grand Ballroom",
    reference: "Event #EV-0044",
    income: "Rs 12,400.00",
    paymentMethod: "Bank Transfer",
    time: "01:10 PM",
    status: "Pending",
  },
  {
    id: "REV-1004",
    department: "Room Service",
    source: "Room Order",
    reference: "Room 402",
    income: "Rs 88.00",
    paymentMethod: "Added to Folio",
    time: "02:35 PM",
    status: "Completed",
  },
  {
    id: "REV-1005",
    department: "PARKING",
    source: "Parking Slot",
    reference: "Slot A-12",
    income: "Rs 25.00",
    paymentMethod: "Cash",
    time: "03:05 PM",
    status: "Completed",
  },
];

const hourlyRevenue = [
  { time: "08 AM", value: "Rs 2.1k", height: "35%" },
  { time: "10 AM", value: "Rs 5.4k", height: "65%" },
  { time: "12 PM", value: "Rs 7.8k", height: "90%" },
  { time: "02 PM", value: "Rs 4.6k", height: "55%" },
  { time: "04 PM", value: "Rs 9.2k", height: "100%" },
  { time: "06 PM", value: "Rs 6.3k", height: "72%" },
];

function getStatusClass(status: string) {
  if (status === "Completed") {
    return "bg-green-100 text-green-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

export default function DailyRevenueReportPage() {
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
                Daily Revenue Report
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View today&apos;s revenue from rooms, restaurant, room service,
                events, parking, and other hotel operations.
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
            {revenueSummary.map((item) => (
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
                  <h2 className="text-2xl font-bold">Hourly Revenue</h2>

                  <p className="mt-1 text-sm text-[#4d4635]">
                    Revenue collected throughout the day.
                  </p>
                </div>

                <span className="rounded-full bg-[#d4af37]/20 px-4 py-2 text-sm font-bold text-[#735c00]">
                  Today
                </span>
              </div>

              <div className="flex h-[280px] items-end gap-4">
                {hourlyRevenue.map((item) => (
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
              <h2 className="text-2xl font-bold">Revenue Breakdown</h2>

              <div className="mt-6 space-y-4">
                <BreakdownRow label="Rooms" amount="Rs 23,400" percent="55%" />
                <BreakdownRow label="EVENTS" amount="Rs 12,400" percent="29%" />
                <BreakdownRow label="Food Sales" amount="Rs 6,240" percent="15%" />
                <BreakdownRow label="PARKING" amount="Rs 810" percent="1%" />
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
                <option>Rooms</option>
                <option>Restaurant</option>
                <option>Room Service</option>
                <option>Events</option>
                <option>Parking</option>
              </select>

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>All Payment Methods</option>
                <option>Cash</option>
                <option>Card</option>
                <option>Bank Transfer</option>
                <option>Added to Folio</option>
              </select>

              <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                Filter
              </button>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Revenue Transactions</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Detailed list of daily revenue entries.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Revenue ID</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Source</th>
                    <th className="px-6 py-4">Reference</th>
                    <th className="px-6 py-4">Payment Method</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Income</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {revenueRows.map((row) => (
                    <tr key={row.id} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{row.id}</td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#735c00]">
                          {row.department}
                        </span>
                      </td>

                      <td className="px-6 py-5 font-semibold">{row.source}</td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {row.reference}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {row.paymentMethod}
                      </td>

                      <td className="px-6 py-5">{row.time}</td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            row.status
                          )}`}
                        >
                          {row.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right font-bold text-[#735c00]">
                        {row.income}
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
  amount,
  percent,
}: {
  label: string;
  amount: string;
  percent: string;
}) {
  return (
    <div className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
      <div className="flex items-center justify-between">
        <p className="font-bold">{label}</p>
        <p className="font-bold text-[#735c00]">{amount}</p>
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