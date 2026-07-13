"use client";

import { useEffect, useState } from "react";
import { ReportSummaryCards } from "@/components/reports/ReportSummaryCards";
import { ReportPageLayout } from "@/components/reports/ReportPageLayout";
import { getReportSummary } from "@/lib/api/reportsApi";

export default function NetProfitReportPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getReportSummary();
        setSummary(data);
      } catch (err) {
        console.error("Failed to load net profit report", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalIncomeStr = summary?.todayRevenue || "Rs 0";
  const netProfitStr = summary?.netProfit || "Rs 0";

  // Naive parsing for formatting math (assuming Rs 100,000 format)
  const parseAmt = (str: string) => parseInt(str.replace(/[^0-9]/g, '')) || 0;
  
  const totalInc = parseAmt(totalIncomeStr);
  const totalProf = parseAmt(netProfitStr);
  const totalExp = totalInc - totalProf;
  const margin = totalInc > 0 ? ((totalProf / totalInc) * 100).toFixed(1) + "%" : "0%";

  const profitSummary = [
    {
      label: "Total Income",
      value: totalIncomeStr,
      note: "Revenue from all hotel modules",
    },
    {
      label: "Total Expenses",
      value: `Rs ${totalExp.toLocaleString()}`,
      note: "Operational and department expenses",
    },
    {
      label: "Net Profit",
      value: netProfitStr,
      note: "Final profit after expenses",
    },
    {
      label: "Profit Margin",
      value: margin,
      note: "Net profit percentage",
    },
  ];

  const incomeRows = [
    {
      source: "EVENTS",
      amount: summary?.eventIncome || "Rs 0",
      percent: "29%",
    },
    {
      source: "Restaurant & Room Service",
      amount: summary?.foodSales || "Rs 0",
      percent: "15%",
    },
    {
      source: "Parking & Amenities",
      amount: summary?.parkingIncome || "Rs 0",
      percent: "1%",
    },
  ];

  const expenseRows = [
    {
      category: "Staff Salaries",
      amount: `Rs ${Math.round(totalExp * 0.4).toLocaleString()}`,
      percent: "40%",
    },
    {
      category: "Kitchen Supplies",
      amount: `Rs ${Math.round(totalExp * 0.22).toLocaleString()}`,
      percent: "22%",
    },
    {
      category: "Housekeeping",
      amount: `Rs ${Math.round(totalExp * 0.14).toLocaleString()}`,
      percent: "14%",
    },
    {
      category: "Maintenance",
      amount: `Rs ${Math.round(totalExp * 0.12).toLocaleString()}`,
      percent: "12%",
    },
    {
      category: "Utilities",
      amount: `Rs ${Math.round(totalExp * 0.12).toLocaleString()}`,
      percent: "12%",
    },
  ];

  const profitRows = [
    {
      id: "NP-1002",
      department: "Restaurant",
      income: summary?.foodSales || "Rs 0",
      expenses: `Rs ${Math.round(parseAmt(summary?.foodSales || "Rs 0") * 0.7).toLocaleString()}`,
      profit: `Rs ${Math.round(parseAmt(summary?.foodSales || "Rs 0") * 0.3).toLocaleString()}`,
      margin: "30.0%",
    },
    {
      id: "NP-1003",
      department: "EVENTS",
      income: summary?.eventIncome || "Rs 0",
      expenses: `Rs ${Math.round(parseAmt(summary?.eventIncome || "Rs 0") * 0.6).toLocaleString()}`,
      profit: `Rs ${Math.round(parseAmt(summary?.eventIncome || "Rs 0") * 0.4).toLocaleString()}`,
      margin: "40.0%",
    },
    {
      id: "NP-1004",
      department: "PARKING",
      income: summary?.parkingIncome || "Rs 0",
      expenses: `Rs ${Math.round(parseAmt(summary?.parkingIncome || "Rs 0") * 0.2).toLocaleString()}`,
      profit: `Rs ${Math.round(parseAmt(summary?.parkingIncome || "Rs 0") * 0.8).toLocaleString()}`,
      margin: "80.0%",
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

  return (
    <ReportPageLayout title="Net Profit Report">

          <ReportSummaryCards cards={profitSummary} />

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
                <FormulaRow label="Total Income" value={totalIncomeStr} />
                <FormulaRow label="Total Expenses" value={`Rs ${totalExp.toLocaleString()}`} />
                <FormulaRow label="Net Profit" value={netProfitStr} highlight />
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
        </ReportPageLayout>
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
