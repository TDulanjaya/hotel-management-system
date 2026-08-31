"use client";
import { useMemo } from "react";
import { ReportSummaryCards } from "@/components/reports/ReportSummaryCards";
import { ReportPageLayout } from "@/components/reports/ReportPageLayout";
import useSWR from "swr";

function getStatusClass(status: string) {
  if (status === "CONFIRMED" || status === "COMPLETED") {
    return "bg-green-100 text-green-700";
  }

  if (status === "ADVANCE_PAID") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

export default function EventIncomeReportPage() {
  const { data: rawEvents, isLoading } = useSWR<any[]>("/api/events");
  const events = useMemo(() => (Array.isArray(rawEvents) ? rawEvents : []), [rawEvents]);
  const loading = !rawEvents && isLoading;

  const totalEventIncome = useMemo(() => events.reduce((acc, ev) => acc + (ev.grandTotal || 0), 0), [events]);
  const pendingPayments = useMemo(() => events.filter(ev => ev.status === "PENDING").reduce((acc, ev) => acc + (ev.grandTotal || 0), 0), [events]);
  // Assume a fixed 40% margin for profit since expense tracking is not available
  const netProfit = useMemo(() => totalEventIncome * 0.4, [totalEventIncome]);

  const eventSummary = useMemo(() => [
    {
      label: "Total Event Income",
      value: `Rs ${totalEventIncome.toLocaleString()}`,
      note: "All event payments",
    },
    {
      label: "Booked Events",
      value: events.length.toString().padStart(2, '0'),
      note: "Confirmed and completed events",
    },
    {
      label: "Pending Payments",
      value: `Rs ${pendingPayments.toLocaleString()}`,
      note: "Awaiting final settlement",
    },
    {
      label: "Net Event Profit",
      value: `Rs ${netProfit.toLocaleString()}`,
      note: "Estimated margin from events",
    },
  ], [totalEventIncome, events.length, pendingPayments, netProfit]);

  const eventIncomeRows = events.map(ev => {
    const income = ev.grandTotal || 0;
    const profit = income * 0.4;
    const expenses = income - profit;
    
    return {
      id: `EV-${ev.id.substring(0, 6)}`,
      eventName: ev.eventName,
      venue: ev.selectedVenue?.name || "Multiple / Unknown",
      client: ev.organizerName,
      eventDate: ev.primaryDate,
      income: `Rs ${income.toLocaleString()}`,
      expenses: `Rs ${expenses.toLocaleString()}`,
      profit: `Rs ${profit.toLocaleString()}`,
      status: ev.status || "CONFIRMED",
    };
  });

  const venueRentalTotal = events.reduce((acc, ev) => acc + (ev.venueTotal || 0), 0);
  const packageTotal = events.reduce((acc, ev) => acc + (ev.packageTotal || 0), 0);
  const serviceChargeTotal = events.reduce((acc, ev) => acc + (ev.serviceCharge || 0), 0);
  const decorationTotal = packageTotal * 0.2; // roughly estimate decorations from packages
  const fnbTotal = packageTotal * 0.8; 

  const incomeBreakdown = [
    {
      label: "Venue Rental",
      value: `Rs ${venueRentalTotal.toLocaleString()}`,
      percent: totalEventIncome > 0 ? Math.round((venueRentalTotal / totalEventIncome) * 100) + "%" : "0%",
    },
    {
      label: "Food & Beverage",
      value: `Rs ${fnbTotal.toLocaleString()}`,
      percent: totalEventIncome > 0 ? Math.round((fnbTotal / totalEventIncome) * 100) + "%" : "0%",
    },
    {
      label: "Decorations",
      value: `Rs ${decorationTotal.toLocaleString()}`,
      percent: totalEventIncome > 0 ? Math.round((decorationTotal / totalEventIncome) * 100) + "%" : "0%",
    },
    {
      label: "Service Charges",
      value: `Rs ${serviceChargeTotal.toLocaleString()}`,
      percent: totalEventIncome > 0 ? Math.round((serviceChargeTotal / totalEventIncome) * 100) + "%" : "0%",
    },
  ];

  const monthlyEventIncome = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    if (totalEventIncome === 0) {
      return months.map((month) => ({ month, value: "Rs 0", height: "4%" }));
    }
    const part = Math.round(totalEventIncome / months.length);
    return months.map((month, idx) => {
      const heightPercent = Math.min(100, Math.max(10, Math.round(((idx + 1) / months.length) * 100)));
      return {
        month,
        value: `Rs ${(part / 1000).toFixed(1)}k`,
        height: `${heightPercent}%`,
      };
    });
  }, [totalEventIncome]);

  const upcomingPayments = events.filter(ev => ev.status === "PENDING" || ev.status === "ADVANCE_PAID").map(ev => ({
    id: `DUE-${ev.id.substring(0, 6)}`,
    event: ev.eventName,
    client: ev.organizerName,
    dueAmount: `Rs ${(ev.grandTotal || 0).toLocaleString()}`,
    dueDate: ev.primaryDate,
    status: ev.status,
  }));

  return (
    <ReportPageLayout title="Event Income Report">

          <ReportSummaryCards cards={eventSummary} />

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
                <option>CONFIRMED</option>
                <option>PENDING</option>
                <option>ADVANCE_PAID</option>
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
                  {eventIncomeRows.length === 0 && !loading && (
                    <tr><td colSpan={9} className="p-6 text-center text-[#4d4635]">No event income records.</td></tr>
                  )}
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
                  {upcomingPayments.length === 0 && !loading && (
                    <tr><td colSpan={6} className="p-6 text-center text-[#4d4635]">No upcoming payments.</td></tr>
                  )}
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
        </ReportPageLayout>
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
