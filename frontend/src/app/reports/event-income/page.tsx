import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const eventSummary = [
  {
    label: "Total Event Income",
    value: "Rs 12,400",
    note: "All event payments today",
  },
  {
    label: "Booked Events",
    value: "06",
    note: "Confirmed event bookings",
  },
  {
    label: "Pending Payments",
    value: "Rs 3,200",
    note: "Waiting settlement",
  },
  {
    label: "Net Event Profit",
    value: "Rs 5,200",
    note: "Income after event costs",
  },
];

const eventIncomeRows = [
  {
    id: "EV-1001",
    eventName: "Corporate Gala - TechVibe",
    venue: "Grand Ballroom",
    client: "TechVibe Pvt Ltd",
    eventDate: "Oct 24, 2024",
    income: "Rs 12,400.00",
    expenses: "Rs 7,200.00",
    profit: "Rs 5,200.00",
    status: "Paid",
  },
  {
    id: "EV-1002",
    eventName: "Anderson Wedding",
    venue: "Terrace Gardens",
    client: "Anderson Family",
    eventDate: "Oct 26, 2024",
    income: "Rs 6,500.00",
    expenses: "Rs 3,100.00",
    profit: "Rs 3,400.00",
    status: "Pending",
  },
  {
    id: "EV-1003",
    eventName: "BioMed Expo",
    venue: "Conference Hall A",
    client: "BioMed Group",
    eventDate: "Oct 28, 2024",
    income: "Rs 3,200.00",
    expenses: "Rs 1,450.00",
    profit: "Rs 1,750.00",
    status: "Paid",
  },
  {
    id: "EV-1004",
    eventName: "Luxury Product Launch",
    venue: "Rooftop Lounge",
    client: "Velora Brands",
    eventDate: "Oct 30, 2024",
    income: "Rs 4,800.00",
    expenses: "Rs 2,200.00",
    profit: "Rs 2,600.00",
    status: "Advance Paid",
  },
];

const incomeBreakdown = [
  {
    label: "Venue Rental",
    value: "Rs 8,900",
    percent: "45%",
  },
  {
    label: "Food & Beverage",
    value: "Rs 6,200",
    percent: "31%",
  },
  {
    label: "Decorations",
    value: "Rs 2,400",
    percent: "12%",
  },
  {
    label: "Service Charges",
    value: "Rs 2,300",
    percent: "12%",
  },
];

const monthlyEventIncome = [
  { month: "Jan", value: "Rs 8k", height: "42%" },
  { month: "Feb", value: "Rs 10k", height: "50%" },
  { month: "Mar", value: "Rs 14k", height: "70%" },
  { month: "Apr", value: "Rs 11k", height: "55%" },
  { month: "May", value: "Rs 18k", height: "90%" },
  { month: "Jun", value: "Rs 20k", height: "100%" },
];

const upcomingPayments = [
  {
    id: "DUE-001",
    event: "Anderson Wedding",
    client: "Anderson Family",
    dueAmount: "Rs 3,200",
    dueDate: "Oct 25, 2024",
    status: "Due Soon",
  },
  {
    id: "DUE-002",
    event: "Luxury Product Launch",
    client: "Velora Brands",
    dueAmount: "Rs 2,400",
    dueDate: "Oct 29, 2024",
    status: "Advance Paid",
  },
  {
    id: "DUE-003",
    event: "Annual Staff Dinner",
    client: "Ceylon Foods",
    dueAmount: "Rs 1,800",
    dueDate: "Nov 02, 2024",
    status: "Pending",
  },
];

function getStatusClass(status: string) {
  if (status === "Paid") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Advance Paid") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

export default function EventIncomeReportPage() {
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
                Event Income Report
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View event bookings, venue income, event payments, event
                expenses, and final event profit details.
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
            {eventSummary.map((item) => (
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
                  <h2 className="text-2xl font-bold">Monthly Event Income</h2>

                  <p className="mt-1 text-sm text-[#4d4635]">
                    Event income performance by month.
                  </p>
                </div>

                <span className="rounded-full bg-[#d4af37]/20 px-4 py-2 text-sm font-bold text-[#735c00]">
                  This Year
                </span>
              </div>

              <div className="flex h-[280px] items-end gap-4">
                {monthlyEventIncome.map((item) => (
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
              <h2 className="text-2xl font-bold">Income Breakdown</h2>

              <div className="mt-6 space-y-4">
                {incomeBreakdown.map((item) => (
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
                <option>All Venues</option>
                <option>Grand Ballroom</option>
                <option>Terrace Gardens</option>
                <option>Conference Hall A</option>
                <option>Rooftop Lounge</option>
              </select>

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>All Status</option>
                <option>Paid</option>
                <option>Pending</option>
                <option>Advance Paid</option>
              </select>

              <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                Filter
              </button>
            </div>
          </section>

          <section className="mb-8 overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Event Income Details</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Event income, expenses, profit, venue, and payment status.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Event ID</th>
                    <th className="px-6 py-4">Event Name</th>
                    <th className="px-6 py-4">Venue</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Event Date</th>
                    <th className="px-6 py-4 text-right">Income</th>
                    <th className="px-6 py-4 text-right">Expenses</th>
                    <th className="px-6 py-4 text-right">Profit</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {eventIncomeRows.map((event) => (
                    <tr key={event.id} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{event.id}</td>

                      <td className="px-6 py-5 font-semibold">
                        {event.eventName}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#735c00]">
                          {event.venue}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {event.client}
                      </td>

                      <td className="px-6 py-5">{event.eventDate}</td>

                      <td className="px-6 py-5 text-right font-bold text-[#735c00]">
                        {event.income}
                      </td>

                      <td className="px-6 py-5 text-right text-red-700">
                        {event.expenses}
                      </td>

                      <td className="px-6 py-5 text-right font-bold text-green-700">
                        {event.profit}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            event.status
                          )}`}
                        >
                          {event.status}
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
              <h2 className="text-2xl font-bold">Upcoming Event Payments</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Pending and upcoming event payment settlements.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Due ID</th>
                    <th className="px-6 py-4">Event</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Due Amount</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {upcomingPayments.map((payment) => (
                    <tr key={payment.id} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{payment.id}</td>

                      <td className="px-6 py-5 font-semibold">
                        {payment.event}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {payment.client}
                      </td>

                      <td className="px-6 py-5">{payment.dueDate}</td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right font-bold text-[#735c00]">
                        {payment.dueAmount}
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