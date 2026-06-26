import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const profitSummary = [
  {
    label: "Total Income",
    value: "Rs 42,850",
    note: "Revenue from all hotel modules",
  },
  {
    label: "Total Expenses",
    value: "Rs 23,930",
    note: "Operational and department expenses",
  },
  {
    label: "Net Profit",
    value: "Rs 18,920",
    note: "Final profit after expenses",
  },
  {
    label: "Profit Margin",
    value: "44.1%",
    note: "Net profit percentage",
  },
];

const incomeRows = [
  {
    source: "Room Bookings",
    amount: "Rs 23,400",
    percent: "55%",
  },
  {
    source: "EVENTS",
    amount: "Rs 12,400",
    percent: "29%",
  },
  {
    source: "Restaurant & Room Service",
    amount: "Rs 6,240",
    percent: "15%",
  },
  {
    source: "Parking & Amenities",
    amount: "Rs 810",
    percent: "1%",
  },
];

const expenseRows = [
  {
    category: "Staff Salaries",
    amount: "Rs 9,500",
    percent: "40%",
  },
  {
    category: "Kitchen Supplies",
    amount: "Rs 5,200",
    percent: "22%",
  },
  {
    category: "Housekeeping",
    amount: "Rs 3,400",
    percent: "14%",
  },
  {
    category: "Maintenance",
    amount: "Rs 2,850",
    percent: "12%",
  },
  {
    category: "Utilities",
    amount: "Rs 2,980",
    percent: "12%",
  },
];

const profitRows = [
  {
    id: "NP-1001",
    department: "Rooms",
    income: "Rs 23,400",
    expenses: "Rs 8,200",
    profit: "Rs 15,200",
    margin: "64.9%",
  },
  {
    id: "NP-1002",
    department: "Restaurant",
    income: "Rs 6,240",
    expenses: "Rs 4,300",
    profit: "Rs 1,940",
    margin: "31.0%",
  },
  {
    id: "NP-1003",
    department: "EVENTS",
    income: "Rs 12,400",
    expenses: "Rs 7,200",
    profit: "Rs 5,200",
    margin: "41.9%",
  },
  {
    id: "NP-1004",
    department: "PARKING",
    income: "Rs 810",
    expenses: "Rs 180",
    profit: "Rs 630",
    margin: "77.7%",
  },
];

const monthlyProfit = [
  { month: "Jan", value: "Rs 12k", height: "45%" },
  { month: "Feb", value: "Rs 16k", height: "58%" },
  { month: "Mar", value: "Rs 14k", height: "50%" },
  { month: "Apr", value: "Rs 20k", height: "72%" },
  { month: "May", value: "Rs 18k", height: "66%" },
  { month: "Jun", value: "Rs 25k", height: "90%" },
  { month: "Jul", value: "Rs 28k", height: "100%" },
];

export default function NetProfitReportPage() {
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
                Net Profit Report
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View total income, expenses, department profit, and final hotel
                net profit.
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
            {profitSummary.map((item) => (
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
                  <h2 className="text-2xl font-bold">Monthly Profit Trend</h2>

                  <p className="mt-1 text-sm text-[#4d4635]">
                    Net profit performance across months.
                  </p>
                </div>

                <span className="rounded-full bg-[#d4af37]/20 px-4 py-2 text-sm font-bold text-[#735c00]">
                  This Year
                </span>
              </div>

              <div className="flex h-[280px] items-end gap-4">
                {monthlyProfit.map((item) => (
                  <div
                    key={item.month}
                    className="flex flex-1 flex-col items-center gap-3"
                  >
                    <div className="flex h-[210px] w-full items-end rounded-full bg-[#f5f3ef] px-2">
                      <div
                        className="w-full rounded-full bg-[#735c00]"
                        style={{ height: item.height }}
                      />
                    </div>

                    <p className="text-xs font-bold text-[#4d4635]">
                      {item.month}
                    </p>

                    <p className="text-xs text-[#4d4635]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Profit Formula</h2>

              <div className="mt-6 space-y-4">
                <FormulaRow label="Total Income" value="Rs 42,850" />
                <FormulaRow label="Total Expenses" value="Rs 23,930" />
                <FormulaRow label="Net Profit" value="Rs 18,920" highlight />
              </div>

              <p className="mt-6 rounded-xl bg-[#f5f3ef] p-4 text-sm leading-6 text-[#4d4635]">
                Net Profit = Total Income - Total Expenses. This report helps
                owners and managers understand hotel financial performance.
              </p>
            </div>
          </section>

          <section className="mb-8 grid gap-8 xl:grid-cols-2">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Income Breakdown</h2>

              <div className="mt-6 space-y-4">
                {incomeRows.map((row) => (
                  <BreakdownRow
                    key={row.source}
                    label={row.source}
                    amount={row.amount}
                    percent={row.percent}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Expense Breakdown</h2>

              <div className="mt-6 space-y-4">
                {expenseRows.map((row) => (
                  <BreakdownRow
                    key={row.category}
                    label={row.category}
                    amount={row.amount}
                    percent={row.percent}
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
                <option>Rooms</option>
                <option>Restaurant</option>
                <option>Events</option>
                <option>Parking</option>
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

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Department Profit Details</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Income, expenses, and net profit by department.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Report ID</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4 text-right">Income</th>
                    <th className="px-6 py-4 text-right">Expenses</th>
                    <th className="px-6 py-4 text-right">Net Profit</th>
                    <th className="px-6 py-4 text-right">Margin</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {profitRows.map((row) => (
                    <tr key={row.id} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{row.id}</td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#735c00]">
                          {row.department}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right font-bold">
                        {row.income}
                      </td>

                      <td className="px-6 py-5 text-right text-red-700">
                        {row.expenses}
                      </td>

                      <td className="px-6 py-5 text-right font-bold text-green-700">
                        {row.profit}
                      </td>

                      <td className="px-6 py-5 text-right font-bold text-[#735c00]">
                        {row.margin}
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

function FormulaRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl p-4 ${
        highlight
          ? "bg-[#735c00] text-white"
          : "bg-[#f5f3ef] text-[#1b1c1a]"
      }`}
    >
      <span className="font-bold">{label}</span>
      <span className="font-bold">{value}</span>
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
