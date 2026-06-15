"use client";

import AppSidebar from "@/components/layout/AppSidebar";
import {
  Search,
  Bell,
  Grid3X3,
  Plus,
  Download,
  Filter,
  TrendingUp,
  ArrowUp,
  Wallet,
  Landmark,
  BedDouble,
  PartyPopper,
  Utensils,
  ParkingCircle,
  AlertTriangle,
} from "lucide-react";

const topMetrics = [
  {
    title: "Total Revenue",
    value: "$185,000",
    note: "12.4% vs last month",
    icon: TrendingUp,
    ribbon: "bg-[#d4af37]",
    noteColor: "text-[#735c00]",
  },
  {
    title: "Net Profit",
    value: "$45,200",
    note: "8.1% margin increase",
    icon: Wallet,
    ribbon: "bg-[#565e74]",
    noteColor: "text-[#565e74]",
  },
  {
    title: "Bank Deposits",
    value: "$120,000",
    note: "Next settlement: Tomorrow",
    icon: Landmark,
    ribbon: "bg-[#545f73]",
    noteColor: "text-[#545f73]",
  },
];

const revenueCards = [
  {
    title: "Room Revenue",
    value: "$110,000",
    icon: BedDouble,
    bg: "bg-[#d4af37]/10",
    color: "text-[#735c00]",
  },
  {
    title: "Event Revenue",
    value: "$32,000",
    icon: PartyPopper,
    bg: "bg-[#565e74]/10",
    color: "text-[#565e74]",
  },
  {
    title: "Food & Beverage",
    value: "$28,000",
    icon: Utensils,
    bg: "bg-[#545f73]/10",
    color: "text-[#545f73]",
  },
  {
    title: "Parking",
    value: "$15,000",
    icon: ParkingCircle,
    bg: "bg-[#4d4635]/10",
    color: "text-[#4d4635]",
  },
];

const auditAlerts = [
  {
    tag: "High Discrepancy",
    time: "2h ago",
    text: "Folio #8829: Manual override of breakfast charges by $450.",
    color: "text-[#ba1a1a]",
  },
  {
    tag: "Refund Flag",
    time: "5h ago",
    text: "Bulk refund initiated for Penthouse 402 without GM approval.",
    color: "text-[#735c00]",
  },
  {
    tag: "Late Check-in",
    time: "Yesterday",
    text: "System bypass on 4:00 AM check-in without night audit log.",
    color: "text-[#4d4635]",
  },
];

const discountHistory = [
  {
    manager: "Sarah Jenkins",
    employeeId: "#LS-4491",
    type: "Customer Recovery",
    guest: "Mr. Henderson (R:404)",
    amount: "-$250.00",
    reason: "Maintenance Issue",
    date: "Oct 24, 2023",
    badge: "bg-[#d4af37]/10 text-[#735c00]",
  },
  {
    manager: "Marcus Thorne",
    employeeId: "#LS-2104",
    type: "VIP Comp",
    guest: "Traveler Group Intl.",
    amount: "-$1,100.00",
    reason: "Strategic Partnership",
    date: "Oct 22, 2023",
    badge: "bg-[#545f73]/10 text-[#545f73]",
  },
  {
    manager: "Sarah Jenkins",
    employeeId: "#LS-4491",
    type: "Family & Friend",
    guest: "J. Miller (R:112)",
    amount: "-$85.00",
    reason: "Employee Perk",
    date: "Oct 20, 2023",
    badge: "bg-[#565e74]/10 text-[#565e74]",
  },
  {
    manager: "Elena Rodriguez",
    employeeId: "#LS-8822",
    type: "Price Match",
    guest: "Ms. Choi (R:205)",
    amount: "-$45.00",
    reason: "OTA Price Guarantee",
    date: "Oct 19, 2023",
    badge: "bg-[#d4af37]/10 text-[#735c00]",
  },
];

export default function OwnerDashboardPage() {
  return (
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
          <div className="owner-fade mb-10 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
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

          <div className="grid grid-cols-12 gap-6">
            {topMetrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <article
                  key={metric.title}
                  className="owner-fade relative col-span-12 overflow-hidden rounded-xl border border-[#d0c5af] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg md:col-span-4"
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

                  <h2 className="text-4xl font-bold">{metric.value}</h2>

                  <p
                    className={`mt-2 flex items-center text-xs font-bold ${metric.noteColor}`}
                  >
                    <ArrowUp size={14} className="mr-1" />
                    {metric.note}
                  </p>
                </article>
              );
            })}

            <section className="owner-fade col-span-12 grid grid-cols-1 gap-6 md:col-span-8 md:grid-cols-2">
              {revenueCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    key={card.title}
                    className="flex items-center gap-4 rounded-xl border border-[#d0c5af] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.bg} ${card.color}`}
                    >
                      <Icon size={24} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#4d4635]">
                        {card.title}
                      </p>

                      <h3 className="text-xl font-bold">{card.value}</h3>
                    </div>
                  </article>
                );
              })}
            </section>

            <section className="owner-fade col-span-12 overflow-hidden rounded-xl border border-[#d0c5af] bg-white shadow-sm md:col-span-4">
              <div className="flex items-center justify-between border-b border-[#d0c5af] bg-white p-6">
                <h2 className="text-xl font-semibold">Audit Alerts</h2>

                <AlertTriangle size={24} className="text-[#ba1a1a]" />
              </div>

              <div className="divide-y divide-[#d0c5af]">
                {auditAlerts.map((alert) => (
                  <div
                    key={alert.text}
                    className="p-4 transition hover:bg-[#f5f3ef]"
                  >
                    <div className="mb-1 flex items-start justify-between">
                      <span
                        className={`text-xs font-bold uppercase ${alert.color}`}
                      >
                        {alert.tag}
                      </span>

                      <span className="text-xs text-[#4d4635]">
                        {alert.time}
                      </span>
                    </div>

                    <p className="text-sm">{alert.text}</p>
                  </div>
                ))}
              </div>

              <button className="w-full bg-[#f5f3ef] py-4 text-sm font-bold text-[#735c00] transition hover:underline">
                Review All Alerts
              </button>
            </section>

            <section className="owner-fade col-span-12 mt-6 overflow-hidden rounded-xl border border-[#d0c5af] bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-4 border-b border-[#d0c5af] p-6 xl:flex-row xl:items-center">
                <div>
                  <h2 className="text-xl font-semibold">
                    Manager Discount History
                  </h2>

                  <p className="text-sm text-[#4d4635]">
                    Monthly summary of price overrides and comp rooms.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button className="rounded-lg border border-[#d0c5af] p-2 transition hover:bg-[#efeeea]">
                    <Filter size={20} className="text-[#4d4635]" />
                  </button>

                  <button className="rounded-lg border border-[#d0c5af] p-2 transition hover:bg-[#efeeea]">
                    <Download size={20} className="text-[#4d4635]" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#f5f3ef] text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                      <th className="px-6 py-4">Manager Name</th>
                      <th className="px-6 py-4">Employee ID</th>
                      <th className="px-6 py-4">Discount Type</th>
                      <th className="px-6 py-4">Guest Reference</th>
                      <th className="px-6 py-4 text-right">Amount Comped</th>
                      <th className="px-6 py-4">Reason Code</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#d0c5af] text-sm">
                    {discountHistory.map((item) => (
                      <tr
                        key={`${item.manager}-${item.guest}`}
                        className="transition hover:bg-[#f5f3ef]/50"
                      >
                        <td className="px-6 py-4 font-semibold">
                          {item.manager}
                        </td>

                        <td className="px-6 py-4 text-[#4d4635]">
                          {item.employeeId}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase ${item.badge}`}
                          >
                            {item.type}
                          </span>
                        </td>

                        <td className="px-6 py-4">{item.guest}</td>

                        <td className="px-6 py-4 text-right font-bold text-[#ba1a1a]">
                          {item.amount}
                        </td>

                        <td className="px-6 py-4">{item.reason}</td>

                        <td className="px-6 py-4 text-[#4d4635]">
                          {item.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}