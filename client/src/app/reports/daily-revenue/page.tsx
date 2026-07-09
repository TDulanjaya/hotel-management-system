"use client";

import { useEffect, useState, useMemo } from "react";
import { ReportSummaryCards } from "@/components/reports/ReportSummaryCards";
import { ReportPageLayout } from "@/components/reports/ReportPageLayout";
import { getReportSummary } from "@/lib/api/reportsApi";
import { getPayments } from "@/lib/api/paymentsApi";

function getStatusClass(status: string) {
  if (status === "COMPLETED" || status === "PAID") {
    return "bg-green-100 text-green-700";
  }
  return "bg-yellow-100 text-yellow-700";
}

export default function DailyRevenueReportPage() {
  const [summary, setSummary] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sumData, payData] = await Promise.all([
          getReportSummary(),
          getPayments()
        ]);
        setSummary(sumData);
        setPayments(payData || []);
      } catch (err) {
        console.error("Failed to load daily revenue report", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const revenueSummary = [
    {
      label: "Total Revenue",
      value: summary?.todayRevenue || "Rs 0",
      note: "All departments today",
    },
    {
      label: "Room Revenue",
      value: summary?.occupancyRate || "0%", // Replaced since Room Revenue specifically isn't scalar
      note: "Occupancy Rate",
    },
    {
      label: "Food Sales",
      value: summary?.foodSales || "Rs 0",
      note: "Restaurant and room service",
    },
    {
      label: "Event Income",
      value: summary?.eventIncome || "Rs 0",
      note: "Venue and event payments",
    },
  ];

  // Process today's payments
  const todayDateString = new Date().toISOString().split('T')[0];
  
  const todaysPayments = payments.filter(p => {
    if (!p.paidAt && !p.paymentDate) return false;
    const dateObj = new Date(p.paidAt || p.paymentDate);
    return dateObj.toISOString().split('T')[0] === todayDateString;
  });

  const revenueRows = todaysPayments.map(p => ({
    id: `REV-${p.id.substring(0, 6)}`,
    department: "Hotel", // Since payment doesn't always strictly store department
    source: "Payment",
    reference: `Ref #${p.id.substring(0, 8)}`,
    income: `Rs ${p.amount}`,
    paymentMethod: p.paymentMethod || "Unknown",
    time: new Date(p.paidAt || p.paymentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: p.status || "COMPLETED",
  }));

  // Calculate hourly revenue
  const hourlyBuckets = useMemo(() => {
    const buckets: Record<number, number> = {
      8: 0, 10: 0, 12: 0, 14: 0, 16: 0, 18: 0
    };
    
    let maxBucket = 0;

    todaysPayments.forEach(p => {
      const date = new Date(p.paidAt || p.paymentDate);
      let hour = date.getHours();
      
      // Map to nearest bucket (naive mapping)
      if (hour <= 9) buckets[8] += p.amount;
      else if (hour <= 11) buckets[10] += p.amount;
      else if (hour <= 13) buckets[12] += p.amount;
      else if (hour <= 15) buckets[14] += p.amount;
      else if (hour <= 17) buckets[16] += p.amount;
      else buckets[18] += p.amount;
    });

    Object.values(buckets).forEach(val => {
      if (val > maxBucket) maxBucket = val;
    });

    return Object.entries(buckets).map(([hour, val]) => {
      const height = maxBucket === 0 ? 0 : Math.round((val / maxBucket) * 100);
      const timeLabel = parseInt(hour) > 12 ? `${parseInt(hour)-12} PM` : `${hour} AM`;
      return {
        time: timeLabel,
        value: `Rs ${val.toLocaleString()}`,
        height: `${height}%`
      };
    });
  }, [todaysPayments]);

  return (
    <ReportPageLayout title="Daily Revenue Report">

          <ReportSummaryCards cards={revenueSummary} />

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
                {hourlyBuckets.map((item) => (
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
                <BreakdownRow label="Pending Payments" amount={summary?.pendingPayments || "Rs 0"} percent="55%" />
                <BreakdownRow label="EVENTS" amount={summary?.eventIncome || "Rs 0"} percent="29%" />
                <BreakdownRow label="Food Sales" amount={summary?.foodSales || "Rs 0"} percent="15%" />
                <BreakdownRow label="PARKING" amount={summary?.parkingIncome || "Rs 0"} percent="1%" />
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
                  {revenueRows.length === 0 && !loading && (
                    <tr><td colSpan={8} className="p-6 text-center text-[#4d4635]">No transactions today.</td></tr>
                  )}
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
        </ReportPageLayout>
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
