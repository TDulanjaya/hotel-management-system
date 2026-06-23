"use client";

import { useState } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  Search,
  Bell,
  Download,
  CreditCard,
  Plus,
  TrendingUp,
  Banknote,
  Landmark,
  Receipt,
  Undo2,
  X,
} from "lucide-react";

const summaryCards = [
  {
    title: "Total Daily Collection",
    value: "$42,850.00",
    note: "Yesterday: $38,200",
    icon: TrendingUp,
    type: "completed",
  },
  {
    title: "Pending Payments",
    value: "$18,420.50",
    note: "14 outstanding folios",
    icon: Receipt,
    type: "pending",
  },
  {
    title: "Settlement Rate",
    value: "94.2%",
    note: "Strong daily settlement",
    icon: Landmark,
    type: "normal",
  },
  {
    title: "Refund Requests",
    value: "$2,100.00",
    note: "3 require approval",
    icon: Undo2,
    type: "failed",
  },
];

const chartBars = [
  { day: "Mon", height: "60%", value: "$5.2k" },
  { day: "Tue", height: "45%", value: "$4.1k" },
  { day: "Wed", height: "85%", value: "$7.6k" },
  { day: "Thu", height: "70%", value: "$6.8k" },
  { day: "Fri", height: "100%", value: "$8.4k", active: true },
  { day: "Sat", height: "55%", value: "$4.9k" },
  { day: "Sun", height: "30%", value: "$2.7k" },
];

const payments = [
  {
    guest: "Elena Rodriguez",
    reference: "Res #LX-9902 • Room 402",
    method: "Visa **** 4421",
    methodType: "card",
    date: "Oct 24, 2024",
    time: "14:20 PM",
    amount: "$1,250.00",
    status: "Completed",
  },
  {
    guest: "Corporate Gala - TechVibe",
    reference: "Event #EV-0044 • Grand Ballroom",
    method: "Bank Transfer",
    methodType: "bank",
    date: "Oct 24, 2024",
    time: "11:05 AM",
    amount: "$12,400.00",
    status: "Pending",
  },
  {
    guest: "Marcus Thorne",
    reference: "Res #LX-9871 • Suite 01",
    method: "Amex **** 1002",
    methodType: "card",
    date: "Oct 24, 2024",
    time: "09:12 AM",
    amount: "$3,800.00",
    status: "Failed",
  },
  {
    guest: "Sophia Chen",
    reference: "Res #LX-9905 • Room 205",
    method: "Cash",
    methodType: "cash",
    date: "Oct 24, 2024",
    time: "08:45 AM",
    amount: "$450.00",
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

function getCardBorder(type: string) {
  if (type === "completed") return "border-l-4 border-l-green-500";
  if (type === "pending") return "border-l-4 border-l-yellow-500";
  if (type === "failed") return "border-l-4 border-l-red-500";
  return "border-l-4 border-l-[#d4af37]";
}

function getMethodIcon(type: string) {
  if (type === "cash") return Banknote;
  if (type === "bank") return Landmark;
  return CreditCard;
}

export default function PaymentsPage() {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "receptionist"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="min-h-screen lg:ml-[280px]">
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#d0c5af] bg-[#fbf9f5] px-8 shadow-sm">
            <div className="relative w-full max-w-[420px]">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4d4635]"
              />

              <input
                type="text"
                placeholder="Search transactions, folios, or guest names..."
                className="w-full rounded-full border border-[#d0c5af] bg-[#f5f3ef] py-2 pl-10 pr-4 text-sm outline-none transition focus:border-[#735c00] focus:ring-2 focus:ring-[#d4af37]/30"
              />
            </div>

            <div className="flex items-center gap-6">
              <button className="relative text-[#4d4635] transition hover:text-[#735c00]">
                <Bell size={22} />
                <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-600" />
              </button>

              <div className="hidden h-8 w-px bg-[#d0c5af] md:block" />

              <div className="hidden text-right md:block">
                <p className="text-sm font-bold leading-none">
                  Julian Sterling
                </p>
                <p className="mt-1 text-xs text-[#4d4635]">
                  Finance Director
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#d0c5af] bg-[#131b2e] font-bold text-[#ffe088]">
                JS
              </div>
            </div>
          </header>

          <section className="mx-auto max-w-[1600px] px-8 pb-12 pt-10">
            <div className="mb-10 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                  Finance Operations
                </p>

                <h1 className="mt-3 text-4xl font-extrabold text-[#735c00]">
                  Payments Dashboard
                </h1>

                <p className="mt-3 text-[#4d4635]">
                  Track payments, refunds, settlements, and guest folio
                  transactions.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 rounded-xl border border-[#d0c5af] bg-white px-5 py-3 text-sm font-bold transition hover:bg-[#efeeea]">
                  <Download size={18} />
                  Export
                </button>

                <button
                  onClick={() => setRefundModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl border border-red-300 bg-white px-5 py-3 text-sm font-bold text-red-700 transition hover:bg-red-50"
                >
                  <Undo2 size={18} />
                  Refund
                </button>

                <button
                  onClick={() => setPaymentModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-[#735c00] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#d4af37] hover:text-[#241a00]"
                >
                  <Plus size={18} />
                  New Payment
                </button>
              </div>
            </div>

            <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    key={card.title}
                    className={`rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${getCardBorder(
                      card.type
                    )}`}
                  >
                    <div className="mb-5 flex items-start justify-between">
                      <div>
                        <p className="text-sm font-bold text-[#4d4635]">
                          {card.title}
                        </p>

                        <h2 className="mt-2 text-3xl font-extrabold">
                          {card.value}
                        </h2>
                      </div>

                      <div className="rounded-xl bg-[#f5f3ef] p-3 text-[#735c00]">
                        <Icon size={24} />
                      </div>
                    </div>

                    <p className="text-sm text-[#4d4635]">{card.note}</p>
                  </article>
                );
              })}
            </section>

            <section className="mb-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Weekly Collection</h2>
                    <p className="mt-1 text-sm text-[#4d4635]">
                      Daily payment income overview.
                    </p>
                  </div>

                  <span className="rounded-full bg-[#d4af37]/20 px-4 py-2 text-sm font-bold text-[#735c00]">
                    This Week
                  </span>
                </div>

                <div className="flex h-[280px] items-end gap-4">
                  {chartBars.map((bar) => (
                    <div
                      key={bar.day}
                      className="flex flex-1 flex-col items-center gap-3"
                    >
                      <div className="flex h-[220px] w-full items-end rounded-full bg-[#f5f3ef] px-2">
                        <div
                          className={`w-full rounded-full transition ${
                            bar.active ? "bg-[#735c00]" : "bg-[#d4af37]"
                          }`}
                          style={{ height: bar.height }}
                        />
                      </div>

                      <p className="text-xs font-bold text-[#4d4635]">
                        {bar.day}
                      </p>

                      <p className="text-xs text-[#4d4635]">{bar.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">Payment Methods</h2>

                <div className="mt-6 space-y-4">
                  <MethodRow label="Card Payments" value="$23,200" percent="54%" />
                  <MethodRow label="Bank Transfers" value="$14,600" percent="34%" />
                  <MethodRow label="Cash Payments" value="$5,050" percent="12%" />
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-4 border-b border-[#d0c5af] p-6 md:flex-row md:items-center">
                <div>
                  <h2 className="text-2xl font-bold">Recent Transactions</h2>
                  <p className="mt-1 text-sm text-[#4d4635]">
                    Latest guest, event, and folio payment records.
                  </p>
                </div>

                <a
                  href="/payments/list"
                  className="rounded-xl border border-[#735c00] px-5 py-3 text-center text-sm font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
                >
                  View All
                </a>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-left">
                  <thead>
                    <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                      <th className="px-6 py-4">Guest / Event</th>
                      <th className="px-6 py-4">Reference</th>
                      <th className="px-6 py-4">Method</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#d0c5af]">
                    {payments.map((payment) => {
                      const MethodIcon = getMethodIcon(payment.methodType);

                      return (
                        <tr
                          key={`${payment.guest}-${payment.amount}`}
                          className="transition hover:bg-[#fbf9f5]"
                        >
                          <td className="px-6 py-5 font-bold">
                            {payment.guest}
                          </td>

                          <td className="px-6 py-5 text-[#4d4635]">
                            {payment.reference}
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <span className="rounded-lg bg-[#f5f3ef] p-2 text-[#735c00]">
                                <MethodIcon size={18} />
                              </span>
                              <span className="font-semibold">
                                {payment.method}
                              </span>
                            </div>
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
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </section>
        </main>

        {paymentModalOpen && (
          <PaymentModal onClose={() => setPaymentModalOpen(false)} />
        )}

        {refundModalOpen && (
          <RefundModal onClose={() => setRefundModalOpen(false)} />
        )}
      </div>
    </ProtectedRoute>
  );
}

function MethodRow({
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

function PaymentModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#735c00]">New Payment</h2>

          <button onClick={onClose} className="rounded-lg p-2 hover:bg-[#f5f3ef]">
            <X size={22} />
          </button>
        </div>

        <div className="grid gap-5">
          <InputBox label="Guest / Event Name" placeholder="Enter guest or event name" />
          <InputBox label="Reference" placeholder="Reservation ID, Folio ID, or Event ID" />
          <InputBox label="Amount" placeholder="$0.00" />

          <div>
            <label className="text-sm font-bold text-[#4d4635]">
              Payment Method
            </label>
            <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none">
              <option>Card</option>
              <option>Cash</option>
              <option>Bank Transfer</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00]"
          >
            Cancel
          </button>

          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white hover:bg-[#d4af37] hover:text-[#241a00]"
          >
            Save Payment
          </button>
        </div>
      </div>
    </div>
  );
}

function RefundModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-red-700">Refund Request</h2>

          <button onClick={onClose} className="rounded-lg p-2 hover:bg-[#f5f3ef]">
            <X size={22} />
          </button>
        </div>

        <div className="grid gap-5">
          <InputBox label="Transaction ID" placeholder="Enter transaction ID" />
          <InputBox label="Refund Amount" placeholder="$0.00" />
          <InputBox label="Reason" placeholder="Enter refund reason" />
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00]"
          >
            Cancel
          </button>

          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-red-700 px-6 py-3 font-bold text-white hover:bg-red-800"
          >
            Request Refund
          </button>
        </div>
      </div>
    </div>
  );
}

function InputBox({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="text-sm font-bold text-[#4d4635]">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
      />
    </div>
  );
}