"use client";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Link from "next/link";
import { getStatusBadgeClass } from "@/lib/utils/statusStyles";
import { useMemo, useState } from "react";
import { downloadAllReports, getReportSummary } from "@/lib/api/reportsApi";
import useSWR from "swr";
import {
  BarChart3,
  Download,
  Filter,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";

function getCategoryClass(category: string) {
  if (category === "Finance" || category === "Payments") {
    return "bg-green-100 text-green-700";
  }

  if (category === "INVENTORY") {
    return "bg-yellow-100 text-yellow-700";
  }

  if (category === "Security") {
    return "bg-red-100 text-red-700";
  }

  return "bg-[#d4af37]/20 text-[#735c00]";
}

export default function ReportsPage() {
  const { data: summary, mutate, isLoading: isSwrLoading, error: swrError } = useSWR<any>("/api/reports/summary");
  const loading = !summary && isSwrLoading;
  const error = swrError?.message || "";
  const [exporting, setExporting] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const handleExportAll = async () => {
    setExporting(true);

    try {
      await downloadAllReports();
    } catch (err: any) {
      alert(err.message || "Failed to export reports.");
    } finally {
      setExporting(false);
    }
  };

  const reports = useMemo(() => [
    {
      title: "Daily Revenue",
      href: "/reports/daily-revenue",
      category: "Finance",
      value: summary?.todayRevenue || "Rs 0",
      note: "Today collection and revenue breakdown.",
      icon: "Rs",
    },
    {
      title: "Net Profit",
      href: "/reports/net-profit",
      category: "Finance",
      value: summary?.netProfit || "Rs 0",
      note: summary?.netProfitNote || "Live Inflow minus Inventory Stock Outflow.",
      icon: "↗",
    },
    {
      title: "Occupancy",
      href: "/reports/occupancy",
      category: "Rooms",
      value: summary?.occupancyRate || "0%",
      note: "Room occupancy and availability report.",
      icon: "▰",
    },
    {
      title: "Low Stock",
      href: "/reports/low-stock",
      category: "INVENTORY",
      value: summary?.lowStockCount || "00",
      note: "Items below minimum stock level.",
      icon: "▧",
    },
    {
      title: "Payment Summary",
      href: "/reports/payment-summary",
      category: "Payments",
      value: summary?.todayRevenue || "Rs 0",
      note: "Card, cash, bank, and online payments.",
      icon: "▤",
    },
    {
      title: "Event Income",
      href: "/reports/event-income",
      category: "EVENTS",
      value: summary?.eventIncome || "Rs 0",
      note: "Event bookings and venue income.",
      icon: "▣",
    },
    {
      title: "Food Sales",
      href: "/reports/food-sales",
      category: "Restaurant",
      value: summary?.foodSales || "Rs 0",
      note: "Restaurant and room service sales.",
      icon: "🍽",
    },
    {
      title: "Parking Income",
      href: "/reports/parking-income",
      category: "PARKING",
      value: summary?.parkingIncome || "Rs 0",
      note: "Parking slot usage and income.",
      icon: "P",
    },
    {
      title: "Inventory Usage",
      href: "/reports/inventory-usage",
      category: "INVENTORY",
      value: summary?.inventoryUsage || "0",
      note: "Stock usage by department.",
      icon: "▥",
    },
    {
      title: "Audit History",
      href: "/reports/audit-history",
      category: "Security",
      value: summary?.auditHistory || "0",
      note: "User actions and system activity logs.",
      icon: "☷",
    },
  ], [summary]);

  const filteredReports = useMemo(() => {
    const keyword = searchText.toLowerCase().trim();

    return reports.filter((report) => {
      const matchesSearch =
        !keyword ||
        report.title.toLowerCase().includes(keyword) ||
        report.category.toLowerCase().includes(keyword) ||
        report.note.toLowerCase().includes(keyword);

      const matchesCategory =
        categoryFilter === "All Categories" ||
        report.category.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [reports, searchText, categoryFilter]);

  const quickStats = useMemo(() => [
    {
      label: "Today Revenue",
      value: summary?.todayRevenue || "Rs 0",
    },
    {
      label: "Occupancy Rate",
      value: summary?.occupancyRate || "0%",
    },
    {
      label: "Pending Payments",
      value: summary?.pendingPayments || "Rs 0",
    },
    {
      label: "Low Stock Items",
      value: summary?.lowStockCount || "0",
    },
  ], [summary]);

  const { data: rawLogs } = useSWR<any[]>("/api/audit-logs");
  const recentReports = useMemo(() => {
    if (!Array.isArray(rawLogs)) return [];
    return rawLogs
      .filter((log) => log.module === "REPORTS" || log.action?.includes("REPORT"))
      .slice(0, 5)
      .map((log) => ({
        name: log.details || "Generated System Report",
        generatedBy: log.userName || log.userId || "System Staff",
        time: log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : "Recently",
        status: "Ready",
      }));
  }, [rawLogs]);

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Management Analytics
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Reports & Analytics
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View hotel revenue, profit, occupancy, inventory, payments,
                events, and audit reports.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => mutate()}
                className="flex items-center gap-2 rounded-xl border border-[#735c00] bg-white px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
              >
                <RefreshCw size={18} />
                Refresh
              </button>

              <button
                onClick={handleExportAll}
                disabled={exporting}
                className="flex items-center gap-2 rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
              >
                <Download size={18} />
                {exporting ? "Exporting..." : "Export CSV"}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 font-bold text-red-700">
              {error}
            </div>
          )}

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            {quickStats.map((stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                loading={loading}
              />
            ))}
          </section>

          <section className="mb-8 rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-[1fr_220px_160px]">
              <div className="flex items-center gap-3 rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3">
                <Search size={18} className="text-[#735c00]" />

                <input
                  type="text"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Search report..."
                  className="w-full bg-transparent outline-none"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              >
                <option>All Categories</option>
                <option>Finance</option>
                <option>Rooms</option>
                <option>INVENTORY</option>
                <option>EVENTS</option>
                <option>Restaurant</option>
                <option>PARKING</option>
                <option>Payments</option>
                <option>Security</option>
              </select>

              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
              >
                <Filter size={18} />
                Filter
              </button>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredReports.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-[#d0c5af] bg-white p-10 text-center shadow-sm">
                <BarChart3 size={46} className="mx-auto mb-4 text-[#735c00]" />

                <p className="text-xl font-bold text-[#735c00]">
                  No reports found
                </p>

                <p className="mt-2 text-[#4d4635]">
                  Try changing search text or category filter.
                </p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <Link
                  key={report.href}
                  href={report.href}
                  className="group rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#735c00] text-xl font-bold text-white transition group-hover:bg-[#d4af37] group-hover:text-[#241a00]">
                      {report.icon}
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${getCategoryClass(
                        report.category
                      )}`}
                    >
                      {report.category}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-[#735c00]">
                    {report.title}
                  </h2>

                  <p className="mt-2 text-3xl font-extrabold">
                    {loading ? "..." : report.value}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-[#4d4635]">
                    {report.note}
                  </p>

                  <div className="mt-6 rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 text-sm font-bold text-[#735c00] transition group-hover:border-[#735c00] group-hover:bg-[#735c00] group-hover:text-white">
                    Open Report →
                  </div>
                </Link>
              ))
            )}
          </section>

          <section className="mt-8 overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="flex items-center gap-2 text-2xl font-bold">
                <ShieldCheck className="text-[#735c00]" />
                Recently Generated Reports
              </h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Latest reports generated by system users.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Report Name</th>
                    <th className="px-6 py-4">Generated By</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {recentReports.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm text-[#4d4635]">
                        No recently generated reports recorded.
                      </td>
                    </tr>
                  ) : (
                    recentReports.map((report) => (
                      <tr
                        key={report.name}
                        className="transition hover:bg-[#fbf9f5]"
                      >
                        <td className="px-6 py-5 font-bold">{report.name}</td>

                        <td className="px-6 py-5 text-[#4d4635]">
                          {report.generatedBy}
                        </td>

                        <td className="px-6 py-5 text-[#4d4635]">
                          {report.time}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusBadgeClass(
                              report.status
                            )}`}
                          >
                            {report.status}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <button
                            onClick={handleExportAll}
                            disabled={exporting}
                            className="rounded-lg border border-[#735c00] px-4 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
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
  loading,
}: {
  label: string;
  value: string;
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-widest text-[#4d4635]">
        {label}
      </p>

      <p className="mt-2 text-4xl font-extrabold text-[#735c00]">
        {loading ? "..." : value}
      </p>
    </div>
  );
}