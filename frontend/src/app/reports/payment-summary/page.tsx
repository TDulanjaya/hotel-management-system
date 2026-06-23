import AppSidebar from "@/components/layout/AppSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const paymentSummary = [
  {
    label: "Total Payments",
    value: "$42,850",
    note: "All payment collections",
  },
  {
    label: "Completed",
    value: "$31,420",
    note: "Successfully settled",
  },
  {
    label: "Pending",
    value: "$9,330",
    note: "Waiting confirmation",
  },
  {
    label: "Refunds",
    value: "$2,100",
    note: "Refund requests today",
  },
];

const paymentMethods = [
  {
    method: "Card Payments",
    amount: "$23,200",
    count: 32,
    percent: "54%",
  },
  {
    method: "Bank Transfers",
    amount: "$14,600",
    count: 8,
    percent: "34%",
  },
  {
    method: "Cash Payments",
    amount: "$5,050",
    count: 18,
    percent: "12%",
  },
];

const paymentRows = [
  {
    id: "PAY-1001",
    guest: "Elena Rodriguez",
    reference: "Res #LX-9902",
    module: "Room Booking",
    method: "Card",
    amount: "$1,250.00",
    date: "Oct 24, 2024",
    status: "Completed",
  },
  {
    id: "PAY-1002",
    guest: "Corporate Gala - TechVibe",
    reference: "Event #EV-0044",
    module: "Events",
    method: "Bank Transfer",
    amount: "$12,400.00",
    date: "Oct 24, 2024",
    status: "Pending",
  },
  {
    id: "PAY-1003",
    guest: "Marcus Thorne",
    reference: "Res #LX-9871",
    module: "Room Booking",
    method: "Card",
    amount: "$3,800.00",
    date: "Oct 24, 2024",
    status: "Failed",
  },
  {
    id: "PAY-1004",
    guest: "Sophia Chen",
    reference: "Folio #FOL-1004",
    module: "Folio",
    method: "Cash",
    amount: "$450.00",
    date: "Oct 24, 2024",
    status: "Completed",
  },
  {
    id: "PAY-1005",
    guest: "Room Service - Room 402",
    reference: "RS #1001",
    module: "Room Service",
    method: "Added to Folio",
    amount: "$32.00",
    date: "Oct 24, 2024",
    status: "Completed",
  },
];

const refundRows = [
  {
    id: "REF-001",
    guest: "Daniel Smith",
    reference: "PAY-0988",
    amount: "$750.00",
    reason: "Booking cancellation",
    status: "Pending Approval",
  },
  {
    id: "REF-002",
    guest: "Sarah Redford",
    reference: "PAY-0991",
    amount: "$1,100.00",
    reason: "Duplicate payment",
    status: "Approved",
  },
  {
    id: "REF-003",
    guest: "Walk-in Guest",
    reference: "PAY-0994",
    amount: "$250.00",
    reason: "Service adjustment",
    status: "Processing",
  },
];

function getStatusClass(status: string) {
  if (status === "Completed" || status === "Approved") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Pending" || status === "Pending Approval" || status === "Processing") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-red-100 text-red-700";
}

export default function PaymentSummaryReportPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "manager"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Reports & Analytics
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Payment Summary Report
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View cash, card, bank transfers, online payments, refunds,
                failed payments, and pending settlements.
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
            {paymentSummary.map((item) => (
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
              <h2 className="text-2xl font-bold">Payment Method Breakdown</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Collection grouped by payment method.
              </p>

              <div className="mt-6 space-y-4">
                {paymentMethods.map((item) => (
                  <MethodRow
                    key={item.method}
                    label={item.method}
                    amount={item.amount}
                    count={`${item.count} payments`}
                    percent={item.percent}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Settlement Overview</h2>

              <div className="mt-6 space-y-4">
                <SummaryRow label="Completed Payments" value="$31,420" />
                <SummaryRow label="Pending Payments" value="$9,330" />
                <SummaryRow label="Failed Payments" value="$3,800" />
                <SummaryRow label="Refund Requests" value="$2,100" />
                <SummaryRow label="Net Collection" value="$40,750" highlight />
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
                <option>All Methods</option>
                <option>Cash</option>
                <option>Card</option>
                <option>Bank Transfer</option>
                <option>Online Payment</option>
              </select>

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>All Status</option>
                <option>Completed</option>
                <option>Pending</option>
                <option>Failed</option>
                <option>Refunded</option>
              </select>

              <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                Filter
              </button>
            </div>
          </section>

          <section className="mb-8 overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Payment Transactions</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Payment records by guest, module, method, and status.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Payment ID</th>
                    <th className="px-6 py-4">Guest / Event</th>
                    <th className="px-6 py-4">Reference</th>
                    <th className="px-6 py-4">Module</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {paymentRows.map((payment) => (
                    <tr
                      key={payment.id}
                      className="transition hover:bg-[#fbf9f5]"
                    >
                      <td className="px-6 py-5 font-bold">{payment.id}</td>

                      <td className="px-6 py-5 font-semibold">
                        {payment.guest}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {payment.reference}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#735c00]">
                          {payment.module}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {payment.method}
                      </td>

                      <td className="px-6 py-5">{payment.date}</td>

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
                        {payment.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Refund Requests</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Refund records and approval status.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Refund ID</th>
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Payment Ref</th>
                    <th className="px-6 py-4">Reason</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {refundRows.map((refund) => (
                    <tr key={refund.id} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{refund.id}</td>

                      <td className="px-6 py-5 font-semibold">
                        {refund.guest}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {refund.reference}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {refund.reason}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            refund.status
                          )}`}
                        >
                          {refund.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right font-bold text-red-700">
                        {refund.amount}
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

function MethodRow({
  label,
  amount,
  count,
  percent,
}: {
  label: string;
  amount: string;
  count: string;
  percent: string;
}) {
  return (
    <div className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold">{label}</p>
          <p className="mt-1 text-sm text-[#4d4635]">{count}</p>
        </div>

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

function SummaryRow({
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