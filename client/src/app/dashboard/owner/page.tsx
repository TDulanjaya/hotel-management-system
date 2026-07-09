"use client";

import { useEffect, useState } from "react";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  Search,
  Bell,
  Grid3X3,
  Plus,
  TrendingUp,
  Wallet,
  Landmark,
  BedDouble,
  PartyPopper,
  Utensils,
  ParkingCircle,
  AlertTriangle,
} from "lucide-react";

import { getReportSummary } from "@/lib/api/reportsApi";
import { getAll as getAudits } from "@/lib/api/auditApi";

export default function OwnerDashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sumData, auditData] = await Promise.all([
          getReportSummary(),
          getAudits(),
        ]);
        setSummary(sumData);
        setAuditLogs((auditData || []).slice(0, 3));
      } catch (err) {
        console.error("Error loading owner dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const topMetrics = [
    {
      title: "Today Revenue",
      value: summary?.todayRevenue || "Rs 0",
      note: "Daily collection",
      icon: TrendingUp,
      ribbon: "bg-[#d4af37]",
      noteColor: "text-[#735c00]",
    },
    {
      title: "Net Profit",
      value: summary?.netProfit || "Rs 0",
      note: "Est. daily profit margin",
      icon: Wallet,
      ribbon: "bg-[#565e74]",
      noteColor: "text-[#565e74]",
    },
    {
      title: "Pending Payments",
      value: summary?.pendingPayments || "Rs 0",
      note: "Awaiting settlement",
      icon: Landmark,
      ribbon: "bg-[#545f73]",
      noteColor: "text-[#545f73]",
    },
  ];

  const revenueCards = [
    {
      title: "Room Occupancy",
      value: summary?.occupancyRate || "0%",
      icon: BedDouble,
      bg: "bg-[#d4af37]/10",
      color: "text-[#735c00]",
    },
    {
      title: "Event Revenue",
      value: summary?.eventIncome || "Rs 0",
      icon: PartyPopper,
      bg: "bg-[#565e74]/10",
      color: "text-[#565e74]",
    },
    {
      title: "Food & Beverage",
      value: summary?.foodSales || "Rs 0",
      icon: Utensils,
      bg: "bg-[#545f73]/10",
      color: "text-[#545f73]",
    },
    {
      title: "PARKING",
      value: summary?.parkingIncome || "Rs 0",
      icon: ParkingCircle,
      bg: "bg-[#4d4635]/10",
      color: "text-[#4d4635]",
    },
  ];

  const auditAlerts = auditLogs.map(audit => ({
    tag: audit.action || "System Event",
    time: new Date(audit.timestamp).toLocaleTimeString(),
    text: audit.details || "No details provided",
    color: "text-[#ba1a1a]",
  }));

  return (
    <ProtectedRoute allowedRoles={["OWNER"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="min-h-screen lg:ml-[280px]">
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#d0c5af] bg-[#fbf9f5]/95 px-8 backdrop-blur-md">
            <div className="relative hidden w-96 md:block">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4d4635]"
              />

              <input
                type="text"
                placeholder="Search financial records..."
                className="w-full rounded-lg bg-[#efeeea] py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#d4af37]/40"
              />
            </div>

            <div className="flex items-center gap-6">
              <button className="rounded-full p-2 text-[#4d4635] transition hover:text-[#735c00]">
                <Bell size={21} />
              </button>

              <button className="rounded-full p-2 text-[#4d4635] transition hover:text-[#735c00]">
                <Grid3X3 size={21} />
              </button>

              <div className="hidden h-8 w-px bg-[#d0c5af] md:block" />

              <div className="hidden text-right md:block">
                <p className="text-sm font-bold">Alex Stratton</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#735c00]">
                  Property Owner
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d0c5af] bg-[#131b2e] font-bold text-[#ffe088]">
                AS
              </div>
            </div>
          </header>

          <section className="mx-auto max-w-[1600px] px-8 pb-12 pt-10">
            <div className="mb-10 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                  Property Owner
                </p>

                <h1 className="mt-3 text-4xl font-extrabold">
                  Executive Dashboard
                </h1>

                <p className="mt-3 text-[#4d4635]">
                  Welcome back, Alex. Here is your portfolio financial
                  performance.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="rounded-lg border border-[#d0c5af] bg-[#f5f3ef] px-6 py-3 text-sm font-bold text-[#4d4635] transition hover:bg-[#efeeea]">
                  Download Statement
                </button>

                <button className="flex items-center gap-2 rounded-lg bg-[#d4af37] px-6 py-3 text-sm font-bold text-[#554300] transition hover:opacity-90">
                  <Plus size={18} />
                  New Reservation
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {topMetrics.map((metric) => {
                const Icon = metric.icon;

                return (
                  <article
                    key={metric.title}
                    className="relative overflow-hidden rounded-xl border border-[#d0c5af] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div
                      className={`absolute left-0 top-0 h-full w-1 ${metric.ribbon}`}
                    />

                    <div className="mb-4 flex items-start justify-between">
                      <p className="text-sm font-semibold text-[#4d4635]">
                        {metric.title}
                      </p>

                      <Icon size={22} className={metric.noteColor} />
                    </div>

                    <h2 className="text-4xl font-bold">{loading ? "..." : metric.value}</h2>

                    <p className={`mt-3 text-sm font-bold ${metric.noteColor}`}>
                      {metric.note}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
              {revenueCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    key={card.title}
                    className="rounded-xl border border-[#d0c5af] bg-white p-6 shadow-sm"
                  >
                    <div
                      className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${card.bg}`}
                    >
                      <Icon size={24} className={card.color} />
                    </div>

                    <p className="text-sm font-bold text-[#4d4635]">
                      {card.title}
                    </p>

                    <h3 className="mt-2 text-3xl font-bold">{loading ? "..." : card.value}</h3>
                  </article>
                );
              })}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <section className="rounded-xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">Revenue Overview</h2>

                <div className="mt-8 flex h-72 items-end justify-between gap-4">
                  {[45, 60, 52, 78, 70, 90, 82].map((height, index) => (
                    <div
                      key={index}
                      className="w-full rounded-t-xl bg-[#d4af37]"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <AlertTriangle size={24} className="text-[#ba1a1a]" />
                  <h2 className="text-2xl font-bold">Audit Alerts</h2>
                </div>

                <div className="space-y-4">
                  {auditAlerts.length === 0 && !loading && (
                    <div className="text-sm text-[#4d4635]">No recent audit alerts.</div>
                  )}
                  {auditAlerts.map((alert, idx) => (
                    <article
                      key={idx}
                      className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4"
                    >
                      <div className="flex items-center justify-between">
                        <p className={`font-bold ${alert.color}`}>
                          {alert.tag}
                        </p>

                        <span className="text-xs text-[#4d4635]">
                          {alert.time}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-[#4d4635]">
                        {alert.text}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
