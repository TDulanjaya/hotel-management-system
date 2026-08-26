"use client";
import { useMemo } from "react";
import { ReportSummaryCards } from "@/components/reports/ReportSummaryCards";
import { ReportPageLayout } from "@/components/reports/ReportPageLayout";
import useSWR from "swr";

function getStatusClass(status: string) {
  if (status === "COMPLETED" || status === "APPROVED" || status === "PAID") {
    return "bg-green-100 text-green-700";
  }

  if (status === "PENDING" || status === "PENDING_APPROVAL" || status === "PROCESSING") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-red-100 text-red-700";
}

export default function PaymentSummaryReportPage() {
  const { data: rawPayments, isLoading } = useSWR<any[]>("/api/payments");
  const payments = useMemo(() => (Array.isArray(rawPayments) ? rawPayments : []), [rawPayments]);
  const loading = !rawPayments && isLoading;

  const totalPayments = useMemo(() => payments.reduce((acc, p) => acc + (p.amount || 0), 0), [payments]);
  const completedPayments = useMemo(() => payments.filter(p => p.status === "COMPLETED" || p.status === "PAID" || !p.status), [payments]);
  const pendingPayments = useMemo(() => payments.filter(p => p.status === "PENDING"), [payments]);
  const failedPayments = useMemo(() => payments.filter(p => p.status === "FAILED"), [payments]);
  const refundedPayments = useMemo(() => payments.filter(p => p.status === "REFUNDED"), [payments]);

  const completedTotal = useMemo(() => completedPayments.reduce((acc, p) => acc + (p.amount || 0), 0), [completedPayments]);
  const pendingTotal = useMemo(() => pendingPayments.reduce((acc, p) => acc + (p.amount || 0), 0), [pendingPayments]);
  const failedTotal = useMemo(() => failedPayments.reduce((acc, p) => acc + (p.amount || 0), 0), [failedPayments]);
  const refundedTotal = useMemo(() => refundedPayments.reduce((acc, p) => acc + (p.amount || 0), 0), [refundedPayments]);
  const netCollection = useMemo(() => completedTotal - refundedTotal, [completedTotal, refundedTotal]);

  const paymentSummary = useMemo(() => [
    {
      label: "Total Collection",
      value: `Rs ${netCollection.toLocaleString()}`,
      note: "Net received payments",
    },
    {
      label: "Completed",
      value: `Rs ${completedTotal.toLocaleString()}`,
      note: "Successfully processed payments",
    },
    {
      label: "Pending",
      value: `Rs ${pendingTotal.toLocaleString()}`,
      note: "Waiting authorization or settlement",
    },
    {
      label: "Refunded",
      value: `Rs ${refundedTotal.toLocaleString()}`,
      note: "Amount returned to guests",
    },
  ], [netCollection, completedTotal, pendingTotal, refundedTotal]);

  const paymentMethods = useMemo(() => {
    const methods: Record<string, { amount: number; count: number }> = {};
    payments.forEach(p => {
      const method = p.paymentMethod || "UNKNOWN";
      if (!methods[method]) methods[method] = { amount: 0, count: 0 };
      methods[method].amount += (p.amount || 0);
      methods[method].count += 1;
    });

    return Object.entries(methods).map(([method, data]) => ({
      method,
      amount: `Rs ${data.amount.toLocaleString()}`,
      count: data.count,
      percent: totalPayments > 0 ? ((data.amount / totalPayments) * 100).toFixed(1) + "%" : "0%"
    }));
  }, [payments, totalPayments]);

  const paymentRows = payments.map(p => ({
    id: `PAY-${p.id.substring(0, 6)}`,
    guest: "Guest/Customer",
    reference: `Ref #${p.id.substring(0, 8)}`,
    module: "Hotel System",
    method: p.paymentMethod || "UNKNOWN",
    amount: `Rs ${p.amount}`,
    date: p.paidAt || p.paymentDate ? new Date(p.paidAt || p.paymentDate).toLocaleDateString() : "Unknown",
    status: p.status || "COMPLETED",
  }));

  const refundRows = refundedPayments.map(p => ({
    id: `REF-${p.id.substring(0, 6)}`,
    guest: "Guest/Customer",
    reference: `PAY-${p.id.substring(0, 6)}`,
    amount: `Rs ${p.amount}`,
    reason: "Requested by guest",
    status: "APPROVED",
  }));

  return (
    <ReportPageLayout title="Payment Summary Report">

          <ReportSummaryCards cards={paymentSummary} />

          <section className="mb-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Payment Method Breakdown</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Collection grouped by payment method.
              </p>

              <div className="mt-6 space-y-4">
                {paymentMethods.length === 0 && !loading && (
                  <p className="text-sm text-[#4d4635]">No payment data.</p>
                )}
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
                <SummaryRow label="Completed Payments" value={`Rs ${completedTotal.toLocaleString()}`} />
                <SummaryRow label="Pending Payments" value={`Rs ${pendingTotal.toLocaleString()}`} />
                <SummaryRow label="Failed Payments" value={`Rs ${failedTotal.toLocaleString()}`} />
                <SummaryRow label="Refund Requests" value={`Rs ${refundedTotal.toLocaleString()}`} />
                <SummaryRow label="Net Collection" value={`Rs ${netCollection.toLocaleString()}`} highlight />
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
                  {paymentRows.length === 0 && !loading && (
                    <tr><td colSpan={8} className="p-6 text-center text-[#4d4635]">No transactions.</td></tr>
                  )}
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
                  {refundRows.length === 0 && !loading && (
                    <tr><td colSpan={6} className="p-6 text-center text-[#4d4635]">No refund requests.</td></tr>
                  )}
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
        </ReportPageLayout>
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
