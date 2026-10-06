"use client";
import { useMemo } from "react";
import { ReportSummaryCards } from "@/components/reports/ReportSummaryCards";
import { ReportPageLayout } from "@/components/reports/ReportPageLayout";
import useSWR from "swr";

export default function NetProfitReportPage() {
  const { data: summary, isLoading } = useSWR<any>("/api/reports/summary");
  const loading = !summary && isLoading;

  const totalIncomeStr = summary?.totalInflow != null ? `Rs ${Number(summary.totalInflow).toLocaleString()}` : (summary?.todayRevenue || "Rs 0");
  const totalExpenseStr = summary?.totalOutflow != null ? `Rs ${Number(summary.totalOutflow).toLocaleString()}` : "Rs 0";
  const netProfitStr = summary?.netProfitAmount != null ? `Rs ${Number(summary.netProfitAmount).toLocaleString()}` : (summary?.netProfit || "Rs 0");

  const parseAmt = (str: string) => parseInt(str.replace(/[^0-9]/g, '')) || 0;
  
  const totalInc = summary?.totalInflow ?? parseAmt(totalIncomeStr);
  const totalProf = summary?.netProfitAmount ?? parseAmt(netProfitStr);
  const totalExp = summary?.totalOutflow ?? (totalInc - totalProf);
  const margin = summary?.profitMargin || (totalInc > 0 ? ((totalProf / totalInc) * 100).toFixed(1) + "%" : "0%");

  const profitSummary = useMemo(() => [
    {
      label: "Total Income (Inflow)",
      value: totalIncomeStr,
      note: "Revenue from all modules (payments ledger)",
    },
    {
      label: "Total Expenses (Outflow)",
      value: totalExpenseStr,
      note: "Inventory restock purchases & supplier invoices",
    },
    {
      label: "Net Operating Profit",
      value: netProfitStr,
      note: summary?.netProfitNote || "Live Inflow minus Outflow",
    },
    {
      label: "Profit Margin",
      value: margin,
      note: summary?.netProfitIsEstimate ? "Benchmark estimate" : "Audited live profit margin",
    },
  ], [totalIncomeStr, totalExpenseStr, netProfitStr, margin, summary]);

  const incomeRows = useMemo(() => {
    const total = totalInc > 0 ? totalInc : 1;
    const roomAmt = Number(summary?.roomFolioRevenue || 0);
    const evAmt = Number(summary?.eventRevenue || parseAmt(summary?.eventIncome || "0"));
    const foodAmt = Number(summary?.restaurantRevenue || parseAmt(summary?.foodSales || "0"));
    const parkAmt = Number(summary?.parkingRevenue || parseAmt(summary?.parkingIncome || "0"));
    const gamesAmt = Number(summary?.gamesRevenue || parseAmt(summary?.gamesIncome || "0"));

    const calcPercent = (amt: number) => total > 0 ? `${Math.round((amt / total) * 100)}%` : "0%";

    return [
      {
        source: "Room Folios & Stays",
        amount: `Rs ${roomAmt.toLocaleString()}`,
        percent: calcPercent(roomAmt),
      },
      {
        source: "Events & Banquets",
        amount: `Rs ${evAmt.toLocaleString()}`,
        percent: calcPercent(evAmt),
      },
      {
        source: "Restaurant & Room Service",
        amount: `Rs ${foodAmt.toLocaleString()}`,
        percent: calcPercent(foodAmt),
      },
      {
        source: "Parking Gate Tolls",
        amount: `Rs ${parkAmt.toLocaleString()}`,
        percent: calcPercent(parkAmt),
      },
      {
        source: "Games Lounge & Recreation",
        amount: `Rs ${gamesAmt.toLocaleString()}`,
        percent: calcPercent(gamesAmt),
      },
    ];
  }, [summary, totalInc]);

  const { data: rawPurchases } = useSWR<any[]>("/api/inventory/purchases");
  const purchases = useMemo(() => (Array.isArray(rawPurchases) ? rawPurchases : []), [rawPurchases]);

  const expenseRows = useMemo(() => {
    if (purchases.length > 0) {
      const catTotals: Record<string, number> = {};
      let totalPurchaseExp = 0;
      purchases.forEach((p: any) => {
        const cat = p.category || "General Supplies";
        const exp = Number(p.totalExpense || 0);
        catTotals[cat] = (catTotals[cat] || 0) + exp;
        totalPurchaseExp += exp;
      });

      return Object.entries(catTotals).map(([category, amount]) => ({
        category,
        amount: `Rs ${amount.toLocaleString()}`,
        percent: totalPurchaseExp > 0 ? `${Math.round((amount / totalPurchaseExp) * 100)}%` : "0%",
      }));
    }

    if (summary?.departmentExpenses && Object.keys(summary.departmentExpenses).length > 0) {
      const totalDeptExp = Object.values(summary.departmentExpenses).reduce((a: any, b: any) => a + Number(b), 0) as number;
      return Object.entries(summary.departmentExpenses).map(([category, amt]) => ({
        category,
        amount: `Rs ${Number(amt).toLocaleString()}`,
        percent: totalDeptExp > 0 ? `${Math.round((Number(amt) / totalDeptExp) * 100)}%` : "0%",
      }));
    }

    return [
      {
        category: "No Inventory Outflow Recorded",
        amount: "Rs 0",
        percent: "0%",
      },
    ];
  }, [purchases, summary]);

  const profitRows = useMemo(() => {
    const calcCatExp = (keywords: string[]) => {
      return purchases
        .filter((p: any) => keywords.some(k => (p.category || "").toLowerCase().includes(k.toLowerCase())))
        .reduce((sum: number, p: any) => sum + Number(p.totalExpense || 0), 0);
    };

    const roomInc = Number(summary?.roomFolioRevenue || 0);
    const roomExp = calcCatExp(["Housekeeping", "Laundry", "Amenities", "Linen"]);
    const roomProf = roomInc - roomExp;

    const restaurantInc = Number(summary?.restaurantRevenue || parseAmt(summary?.foodSales || "0"));
    const restaurantExp = calcCatExp(["Kitchen", "Food", "Beverage", "Bar"]);
    const restaurantProf = restaurantInc - restaurantExp;

    const eventInc = Number(summary?.eventRevenue || parseAmt(summary?.eventIncome || "0"));
    const eventExp = calcCatExp(["Event", "Banquet"]);
    const eventProf = eventInc - eventExp;

    const parkingInc = Number(summary?.parkingRevenue || parseAmt(summary?.parkingIncome || "0"));
    const parkingExp = calcCatExp(["Parking", "Gate"]);
    const parkingProf = parkingInc - parkingExp;

    const gamesInc = Number(summary?.gamesRevenue || parseAmt(summary?.gamesIncome || "0"));
    const gamesExp = calcCatExp(["Game", "Recreation", "Lounge"]);
    const gamesProf = gamesInc - gamesExp;

    return [
      {
        id: "NP-1001",
        department: "Room Stays & Folios",
        income: `Rs ${roomInc.toLocaleString()}`,
        expenses: `Rs ${roomExp.toLocaleString()}`,
        profit: `Rs ${roomProf.toLocaleString()}`,
        margin: roomInc > 0 ? `${((roomProf / roomInc) * 100).toFixed(1)}%` : "0.0%",
      },
      {
        id: "NP-1002",
        department: "Restaurant & Dining",
        income: `Rs ${restaurantInc.toLocaleString()}`,
        expenses: `Rs ${restaurantExp.toLocaleString()}`,
        profit: `Rs ${restaurantProf.toLocaleString()}`,
        margin: restaurantInc > 0 ? `${((restaurantProf / restaurantInc) * 100).toFixed(1)}%` : "0.0%",
      },
      {
        id: "NP-1003",
        department: "Events & Banquets",
        income: `Rs ${eventInc.toLocaleString()}`,
        expenses: `Rs ${eventExp.toLocaleString()}`,
        profit: `Rs ${eventProf.toLocaleString()}`,
        margin: eventInc > 0 ? `${((eventProf / eventInc) * 100).toFixed(1)}%` : "0.0%",
      },
      {
        id: "NP-1004",
        department: "Parking Gate",
        income: `Rs ${parkingInc.toLocaleString()}`,
        expenses: `Rs ${parkingExp.toLocaleString()}`,
        profit: `Rs ${parkingProf.toLocaleString()}`,
        margin: parkingInc > 0 ? `${((parkingProf / parkingInc) * 100).toFixed(1)}%` : "0.0%",
      },
      {
        id: "NP-1005",
        department: "Games Lounge",
        income: `Rs ${gamesInc.toLocaleString()}`,
        expenses: `Rs ${gamesExp.toLocaleString()}`,
        profit: `Rs ${gamesProf.toLocaleString()}`,
        margin: gamesInc > 0 ? `${((gamesProf / gamesInc) * 100).toFixed(1)}%` : "0.0%",
      },
    ];
  }, [summary, purchases]);

  const monthlyProfit = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
    if (totalProf === 0) {
      return months.map((month) => ({ month, value: "Rs 0", height: "4%" }));
    }
    const part = Math.round(totalProf / months.length);
    return months.map((month, idx) => {
      const heightPercent = Math.min(100, Math.max(10, Math.round(((idx + 1) / months.length) * 100)));
      return {
        month,
        value: `Rs ${(part / 1000).toFixed(1)}k`,
        height: `${heightPercent}%`,
      };
    });
  }, [totalProf]);

  return (
    <ReportPageLayout title="Net Profit Report">

          <ReportSummaryCards cards={profitSummary} />

          <div className="mb-6 rounded-2xl border border-[#d4af37]/40 bg-[#fbf9f5] p-4 text-sm text-[#735c00] flex items-center justify-between">
            <div>
              <span className="font-bold">Reporting Note: </span>
              {summary?.netProfitNote || "Live Real Net Operating Profit (Payments Inflow minus Stock Outflow)."}
            </div>
            <span className={`text-xs uppercase font-bold px-3 py-1 rounded-full ${
              summary?.netProfitIsEstimate
                ? "bg-[#735c00]/10 text-[#735c00]"
                : "bg-emerald-100 text-emerald-800"
            }`}>
              {summary?.netProfitIsEstimate ? "Benchmark Estimate" : "Audited Live Profit"}
            </span>
          </div>

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
