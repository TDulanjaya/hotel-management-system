import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const payments = [
  {
    id: "PAY-1001",
    guest: "Elena Rodriguez",
    reference: "Res #LX-9902",
    module: "Room Booking",
    method: "Visa **** 4421",
    date: "Oct 24, 2024",
    time: "14:20 PM",
    amount: "Rs 1,250.00",
    status: "Completed",
  },
  {
    id: "PAY-1002",
    guest: "Corporate Gala - TechVibe",
    reference: "Event #EV-0044",
    module: "Events",
    method: "Bank Transfer",
    date: "Oct 24, 2024",
    time: "11:05 AM",
    amount: "Rs 12,400.00",
    status: "Pending",
  },
  {
    id: "PAY-1003",
    guest: "Marcus Thorne",
    reference: "Res #LX-9871",
    module: "Room Booking",
    method: "Amex **** 1002",
    date: "Oct 24, 2024",
    time: "09:12 AM",
    amount: "Rs 3,800.00",
    status: "Failed",
  },
  {
    id: "PAY-1004",
    guest: "Sophia Chen",
    reference: "Folio #FOL-1004",
    module: "Folio",
    method: "Cash",
    date: "Oct 24, 2024",
    time: "08:45 AM",
    amount: "Rs 450.00",
    status: "Completed",
  },
  {
    id: "PAY-1005",
    guest: "Room Service - Room 402",
    reference: "RS #1001",
    module: "Room Service",
    method: "Added to Folio",
    date: "Oct 24, 2024",
    time: "07:40 AM",
    amount: "Rs 32.00",
    status: "Completed",
  },
];

function getStatusClass(status: string) {
  if (status === "Completed") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Pending") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-red-100 text-red-700";
}

export default function PaymentsListPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "receptionist"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Finance Operations
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Payment List
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View all hotel payment transactions, settlement status, and
                payment methods.
              </p>
            </div>

            <a
              href="/payments/new"
              className="rounded-xl bg-[#735c00] px-6 py-3 text-center font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
            >
              + New Payment
            </a>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard label="Total Payments" value="5" />
            <StatCard label="Completed" value="3" />
            <StatCard label="Pending" value="1" />
            <StatCard label="Failed" value="1" />
          </section>

          <section className="mb-8 rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-4">
              <input
                type="text"
                placeholder="Search payment..."
                className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              />

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>All Status</option>
                <option>Completed</option>
                <option>Pending</option>
                <option>Failed</option>
              </select>

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>All Methods</option>
                <option>Card</option>
                <option>Cash</option>
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
              <h2 className="text-2xl font-bold">All Payment Transactions</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Complete transaction history for bookings, events, folios, and
                room service.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left">
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
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {payments.map((payment) => (
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

                      <td className="px-6 py-5 text-[#4d4635]">
                        {payment.date}
                        <br />
                        <span className="text-xs">{payment.time}</span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right font-bold">
                        {payment.amount}
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button className="rounded-lg border border-[#735c00] px-4 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white">
                          View
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