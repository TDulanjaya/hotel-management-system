"use client";

import { useEffect, useState } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
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
  RefreshCw,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  X,
  UserSearch,
  AlertTriangle,
} from "lucide-react";

const summaryCards = [
  {
    title: "Total Daily Collection",
    value: "$42,850.00",
    note: "v. Yesterday: $38,200",
    type: "completed",
    trend: "12%",
  },
  {
    title: "Pending Payments",
    value: "$18,420.50",
    note: "14 Outstanding folios",
    type: "pending",
  },
  {
    title: "Settlement Rate",
    value: "94.2%",
    note: "Strong daily settlement",
    type: "normal",
  },
  {
    title: "Refund Requests",
    value: "$2,100.00",
    note: "3 Requires urgent approval",
    type: "failed",
  },
];

const chartBars = [
  { day: "Mon", height: "60%", value: "$5.2k" },
  { day: "Tue", height: "45%" },
  { day: "Wed", height: "85%" },
  { day: "Thu", height: "70%" },
  { day: "Fri", height: "100%", value: "$8.4k", active: true },
  { day: "Sat", height: "55%" },
  { day: "Sun", height: "30%" },
];

const payments = [
  {
    guest: "Elena Rodriguez",
    reference: "Res #LX-9902 • Room 402",
    method: "Visa **** 4421",
    methodType: "card",
    date: "Oct 24, 2023",
    time: "14:20 PM",
    amount: "$1,250.00",
    status: "Completed",
  },
  {
    guest: "Corporate Gala - 'TechVibe'",
    reference: "Event #EV-0044 • Grand Ballroom",
    method: "Bank Transfer",
    methodType: "bank",
    date: "Oct 24, 2023",
    time: "11:05 AM",
    amount: "$12,400.00",
    status: "Pending",
  },
  {
    guest: "Marcus Thorne",
    reference: "Res #LX-9871 • Suite 01",
    method: "Amex **** 1002",
    methodType: "card",
    date: "Oct 24, 2023",
    time: "09:12 AM",
    amount: "$3,800.00",
    status: "Failed",
  },
  {
    guest: "Sophia Chen",
    reference: "Res #LX-9905 • Room 205",
    method: "Cash",
    methodType: "cash",
    date: "Oct 24, 2023",
    time: "08:45 AM",
    amount: "$450.00",
    status: "Completed",
  },
];

function getStatusClass(status: string) {
  if (status === "Completed") {
    return "bg-[#735c00]/10 text-[#735c00]";
  }

  if (status === "Pending") {
    return "bg-[#565e74]/10 text-[#565e74]";
  }

  return "bg-[#ba1a1a]/10 text-[#ba1a1a]";
}

function getCardBorder(type: string) {
  if (type === "completed") return "border-l-4 border-l-[#735c00]";
  if (type === "pending") return "border-l-4 border-l-[#565e74]";
  if (type === "failed") return "border-l-4 border-l-[#ba1a1a]";
  return "";
}

export default function PaymentsPage() {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);

  useEffect(() => {
    const closeModal = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPaymentModalOpen(false);
        setRefundModalOpen(false);
      }
    };

    window.addEventListener("keydown", closeModal);

    return () => window.removeEventListener("keydown", closeModal);
  }, []);

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
      <AppSidebar />

      <main className="min-h-screen lg:ml-[280px]">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#d0c5af] bg-[#fbf9f5] px-8 shadow-sm">
          <div className="flex flex-1 items-center gap-4">
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
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-[#4d4635] transition hover:text-[#735c00]">
              <Bell size={22} />
              <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#ba1a1a]" />
            </button>

            <div className="hidden h-8 w-px bg-[#d0c5af] md:block" />

            <div className="hidden text-right md:block">
              <p className="text-sm font-bold leading-none">Julian Sterling</p>
              <p className="mt-1 text-xs text-[#4d4635]">Finance Director</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#d0c5af] bg-[#131b2e] font-bold text-[#ffe088]">
              JS
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-[1600px] px-8 pb-12 pt-10">
          <div className="payments-fade mb-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
            <div>
              <h1 className="mb-2 text-4xl font-bold tracking-tight text-[#735c00]">
                Payments Management
              </h1>

              <p className="text-base text-[#4d4635]">
                Real-time ledger and financial health monitoring.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 rounded-lg border border-[#565e74] px-6 py-3 font-bold text-[#565e74] transition hover:bg-[#565e74]/5">
                <Download size={18} />
                Export Ledger
              </button>

              <button
                onClick={() => setPaymentModalOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-[#735c00] px-6 py-3 font-bold text-white shadow-lg transition hover:bg-[#735c00]/90 active:scale-95"
              >
                <CreditCard size={18} />
                Add Payment
              </button>
            </div>
          </div>

          <div className="payments-fade mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <article
                key={card.title}
                className={`luxury-payment-card rounded-xl bg-white p-6 shadow-sm ${getCardBorder(
                  card.type
                )}`}
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#4d4635]">
                  {card.title}
                </p>

                <div className="flex items-end gap-2">
                  <h3 className="text-2xl font-bold">{card.value}</h3>

                  {card.trend && (
                    <span className="mb-1 flex items-center gap-1 text-xs font-bold text-[#735c00]">
                      <TrendingUp size={14} />
                      {card.trend}
                    </span>
                  )}
                </div>

                {card.title === "Settlement Rate" && (
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#efeeea]">
                    <div className="h-full w-[94.2%] rounded-full bg-[#735c00]" />
                  </div>
                )}

                <p
                  className={`mt-2 text-xs ${
                    card.type === "failed" ? "text-[#ba1a1a]" : "text-[#4d4635]"
                  }`}
                >
                  {card.note}
                </p>
              </article>
            ))}
          </div>

          <div className="payments-fade mb-12 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <section className="luxury-payment-card rounded-xl bg-white p-8 shadow-sm xl:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Daily Collection Trend
                </h2>

                <select className="rounded-lg bg-[#efeeea] px-3 py-2 text-xs outline-none">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>

              <div className="flex h-[280px] w-full items-end gap-4 px-2">
                {chartBars.map((bar) => (
                  <div
                    key={bar.day}
                    className="group flex flex-1 flex-col items-center gap-2"
                  >
                    <div
                      className={`relative w-full rounded-t-lg transition ${
                        bar.active
                          ? "bg-[#735c00]"
                          : "bg-[#eae8e4] group-hover:bg-[#d4af37]"
                      }`}
                      style={{ height: bar.height }}
                    >
                      {bar.value && (
                        <div
                          className={`absolute -top-8 left-1/2 -translate-x-1/2 rounded px-2 py-1 text-[10px] text-white transition ${
                            bar.active
                              ? "bg-[#1b1c1a] opacity-100"
                              : "bg-[#1b1c1a] opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          {bar.value}
                        </div>
                      )}
                    </div>

                    <span
                      className={`text-xs ${
                        bar.active
                          ? "font-bold text-[#735c00]"
                          : "text-[#4d4635]"
                      }`}
                    >
                      {bar.day}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="luxury-payment-card flex flex-col rounded-xl bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold">Payment Methods</h2>

              <div className="flex flex-1 items-center justify-center py-4">
                <div className="payment-donut flex h-48 w-48 items-center justify-center rounded-full">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white text-center">
                    <div>
                      <p className="text-xs uppercase text-[#4d4635]">Volume</p>
                      <p className="text-xl font-bold">1.2k</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#735c00]" />
                  <span className="text-xs">Credit Card (65%)</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#565e74]" />
                  <span className="text-xs">Bank Transfer (20%)</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#d0c5af]" />
                  <span className="text-xs">Cash (10%)</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#a8b3ca]" />
                  <span className="text-xs">Other (5%)</span>
                </div>
              </div>
            </section>
          </div>

          <section className="payments-fade luxury-payment-card overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#d0c5af] px-8 py-6">
              <h2 className="text-xl font-semibold">Payment Ledger</h2>

              <div className="flex gap-2">
                <button className="rounded-lg p-2 transition hover:bg-[#efeeea]">
                  <Filter size={20} />
                </button>

                <button className="rounded-lg p-2 transition hover:bg-[#efeeea]">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#f5f3ef] text-[#4d4635]">
                    <th className="px-8 py-4 text-sm font-semibold">
                      Reference / Guest
                    </th>
                    <th className="px-8 py-4 text-sm font-semibold">Method</th>
                    <th className="px-8 py-4 text-sm font-semibold">
                      Date & Time
                    </th>
                    <th className="px-8 py-4 text-right text-sm font-semibold">
                      Amount
                    </th>
                    <th className="px-8 py-4 text-center text-sm font-semibold">
                      Status
                    </th>
                    <th className="px-8 py-4 text-right text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {payments.map((payment) => (
                    <tr
                      key={payment.reference}
                      className="transition hover:bg-[#fbf9f5]"
                    >
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#1b1c1a]">
                            {payment.guest}
                          </span>
                          <span className="text-xs text-[#4d4635]">
                            {payment.reference}
                          </span>
                        </div>
                      </td>

                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          {payment.methodType === "card" && (
                            <CreditCard size={20} className="text-[#565e74]" />
                          )}

                          {payment.methodType === "bank" && (
                            <Landmark size={20} className="text-[#565e74]" />
                          )}

                          {payment.methodType === "cash" && (
                            <Banknote size={20} className="text-[#565e74]" />
                          )}

                          <span className="text-sm">{payment.method}</span>
                        </div>
                      </td>

                      <td className="px-8 py-5">
                        <div className="flex flex-col text-sm">
                          <span>{payment.date}</span>
                          <span className="text-xs text-[#4d4635]">
                            {payment.time}
                          </span>
                        </div>
                      </td>

                      <td className="px-8 py-5 text-right font-bold">
                        {payment.amount}
                      </td>

                      <td className="px-8 py-5 text-center">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </td>

                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          {payment.status === "Failed" ? (
                            <>
                              <button className="cursor-not-allowed p-2 opacity-30">
                                <Receipt size={20} />
                              </button>

                              <button className="p-2 transition hover:text-[#735c00]">
                                <RefreshCw size={20} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="p-2 transition hover:text-[#735c00]"
                                title="View Receipt"
                              >
                                <Receipt size={20} />
                              </button>

                              <button
                                onClick={() => setRefundModalOpen(true)}
                                className="p-2 transition hover:text-[#ba1a1a]"
                                title="Request Refund"
                              >
                                <Undo2 size={20} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-[#d0c5af] bg-[#f5f3ef] px-8 py-4">
              <p className="text-xs text-[#4d4635]">
                Showing 1-10 of 124 transactions
              </p>

              <div className="flex gap-2">
                <button className="flex h-10 w-10 items-center justify-center rounded border border-[#d0c5af] transition hover:bg-white">
                  <ChevronLeft size={18} />
                </button>

                <button className="flex h-10 w-10 items-center justify-center rounded border border-[#735c00] bg-[#735c00] font-bold text-white">
                  1
                </button>

                <button className="flex h-10 w-10 items-center justify-center rounded border border-[#d0c5af] transition hover:bg-white">
                  2
                </button>

                <button className="flex h-10 w-10 items-center justify-center rounded border border-[#d0c5af] transition hover:bg-white">
                  3
                </button>

                <button className="flex h-10 w-10 items-center justify-center rounded border border-[#d0c5af] transition hover:bg-white">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </section>
        </section>
      </main>

      {paymentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1b1c1a]/40 p-4 backdrop-blur-sm">
          <div className="modal-pop w-full max-w-lg overflow-hidden rounded-xl bg-[#fbf9f5] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#d0c5af] bg-white p-8">
              <h3 className="text-2xl font-bold">New Payment Entry</h3>

              <button
                onClick={() => setPaymentModalOpen(false)}
                className="text-[#4d4635] transition hover:text-[#ba1a1a]"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-6 p-8">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Guest / Folio Reference
                </label>

                <div className="relative">
                  <UserSearch
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4d4635]"
                  />

                  <input
                    type="text"
                    placeholder="Search by name or reservation ID..."
                    className="w-full rounded-lg border border-[#d0c5af] bg-white py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-[#d4af37]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Amount
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold">
                      $
                    </span>

                    <input
                      type="number"
                      step="0.01"
                      defaultValue="0.00"
                      className="w-full rounded-lg border border-[#d0c5af] bg-white py-3 pl-8 pr-4 font-bold outline-none focus:ring-2 focus:ring-[#d4af37]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Payment Method
                  </label>

                  <select className="w-full rounded-lg border border-[#d0c5af] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#d4af37]/30">
                    <option>Credit Card</option>
                    <option>Bank Transfer</option>
                    <option>Cash</option>
                    <option>Digital Wallet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Remarks Optional
                </label>

                <textarea
                  placeholder="e.g. Early check-in fee, Spa services..."
                  className="h-24 w-full resize-none rounded-lg border border-[#d0c5af] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#d4af37]/30"
                />
              </div>
            </div>

            <div className="flex gap-4 border-t border-[#d0c5af] bg-[#f5f3ef] px-8 py-6">
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="flex-1 rounded-lg border border-[#565e74] py-3 font-bold text-[#565e74] transition hover:bg-[#565e74]/5"
              >
                Cancel
              </button>

              <button
                onClick={() => setPaymentModalOpen(false)}
                className="flex-1 rounded-lg bg-[#735c00] py-3 font-bold text-white shadow-md transition hover:bg-[#735c00]/90"
              >
                Process Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {refundModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1b1c1a]/40 p-4 backdrop-blur-sm">
          <div className="modal-pop w-full max-w-md overflow-hidden rounded-xl bg-[#fbf9f5] shadow-2xl">
            <div className="border-b border-[#d0c5af] p-6 text-center">
              <AlertTriangle
                size={52}
                className="mx-auto mb-4 text-[#ba1a1a]"
              />

              <h3 className="text-xl font-bold">
                Request Refund / Adjustment?
              </h3>

              <p className="mt-2 text-sm text-[#4d4635]">
                You are about to initiate a refund for Res #LX-9902 Elena
                Rodriguez in the amount of{" "}
                <span className="font-bold text-[#1b1c1a]">$1,250.00</span>.
              </p>
            </div>

            <div className="space-y-4 p-6">
              <label className="block text-sm font-semibold">
                Reason for Refund
              </label>

              <select className="w-full rounded-lg border border-[#d0c5af] bg-white px-4 py-3 outline-none">
                <option>Guest Cancelled Within Window</option>
                <option>Billing Dispute / Error</option>
                <option>Service Failure Compensation</option>
                <option>Security Deposit Return</option>
              </select>
            </div>

            <div className="flex gap-4 border-t border-[#d0c5af] p-6">
              <button
                onClick={() => setRefundModalOpen(false)}
                className="flex-1 rounded-lg border border-[#565e74] py-2 font-bold text-[#565e74]"
              >
                Back
              </button>

              <button
                onClick={() => setRefundModalOpen(false)}
                className="flex-1 rounded-lg bg-[#ba1a1a] py-2 font-bold text-white shadow-md"
              >
                Confirm Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}