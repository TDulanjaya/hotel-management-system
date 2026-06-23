"use client";

import { useParams, useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const folioItems = [
  {
    id: "FOL-ITEM-001",
    description: "Room Charge - Executive Suite",
    category: "Room",
    date: "Oct 21, 2024",
    amount: "Rs 400.00",
  },
  {
    id: "FOL-ITEM-002",
    description: "Room Charge - Executive Suite",
    category: "Room",
    date: "Oct 22, 2024",
    amount: "Rs 400.00",
  },
  {
    id: "FOL-ITEM-003",
    description: "Room Charge - Executive Suite",
    category: "Room",
    date: "Oct 23, 2024",
    amount: "Rs 400.00",
  },
  {
    id: "FOL-ITEM-004",
    description: "Club Sandwich, Orange Juice",
    category: "Room Service",
    date: "Oct 23, 2024",
    amount: "Rs 32.00",
  },
  {
    id: "FOL-ITEM-005",
    description: "Restaurant Dinner",
    category: "Restaurant",
    date: "Oct 23, 2024",
    amount: "Rs 142.00",
  },
  {
    id: "FOL-ITEM-006",
    description: "Parking Fee",
    category: "Parking",
    date: "Oct 24, 2024",
    amount: "Rs 25.00",
  },
];

const paymentRows = [
  {
    id: "PAY-1001",
    method: "Card",
    date: "Oct 24, 2024",
    amount: "Rs 800.00",
    status: "Paid",
  },
  {
    id: "PAY-1002",
    method: "Cash",
    date: "Oct 24, 2024",
    amount: "Rs 0.00",
    status: "Pending",
  },
];

function getStatusClass(status: string) {
  if (status === "Paid") {
    return "bg-green-100 text-green-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

export default function FolioDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const folioId = params?.id as string;

  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "receptionist"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Guest Folio
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Folio Details
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View guest charges, room service, restaurant bills, parking
                charges, and payment status.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/folio")}
                className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
              >
                Back to Folio
              </button>

              <button
                onClick={() => router.push(`/checkout/${folioId}`)}
                className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
              >
                Checkout
              </button>
            </div>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard label="Folio ID" value={folioId || "N/A"} />
            <StatCard label="Guest" value="Elena Rodriguez" />
            <StatCard label="Room" value="402" />
            <StatCard label="Status" value="Open" />
          </section>

          <section className="mb-8 grid gap-8 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Guest Information</h2>

              <div className="mt-6 space-y-4">
                <InfoRow label="Guest Name" value="Elena Rodriguez" />
                <InfoRow label="Email" value="elena@example.com" />
                <InfoRow label="Room Type" value="Executive Suite" />
                <InfoRow label="Check In" value="Oct 21, 2024" />
                <InfoRow label="Check Out" value="Oct 24, 2024" />
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Folio Summary</h2>

              <div className="mt-6 space-y-4">
                <InfoRow label="Room Charges" value="Rs 1,200.00" />
                <InfoRow label="Service Charges" value="Rs 199.00" />
                <InfoRow label="Tax" value="Rs 185.00" />
                <InfoRow label="Paid Amount" value="Rs 800.00" />
              </div>

              <div className="mt-6 rounded-xl bg-[#735c00] p-5 text-white">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold">Balance Due</p>
                  <p className="text-2xl font-extrabold">Rs 784.00</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8 overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Folio Charges</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                All charges added to this guest folio.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Item ID</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {folioItems.map((item) => (
                    <tr key={item.id} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{item.id}</td>

                      <td className="px-6 py-5 font-semibold">
                        {item.description}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#735c00]">
                          {item.category}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {item.date}
                      </td>

                      <td className="px-6 py-5 text-right font-bold text-[#735c00]">
                        {item.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Payment History</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Payments linked to this folio.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Payment ID</th>
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

                      <td className="px-6 py-5 text-[#4d4635]">
                        {payment.method}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {payment.date}
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

                      <td className="px-6 py-5 text-right font-bold text-[#735c00]">
                        {payment.amount}
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

      <p className="mt-2 text-2xl font-extrabold text-[#735c00]">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#f5f3ef] p-4">
      <p className="font-bold text-[#4d4635]">{label}</p>
      <p className="font-bold text-[#735c00]">{value}</p>
    </div>
  );
}
