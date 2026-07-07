"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppSidebar from "@/components/layout/Sidebar";
import {
  Search,
  HelpCircle,
  Bell,
  Grid3X3,
  BedDouble,
  Badge,
  TrendingUp,
  DollarSign,
  UserSearch,
  Siren,
  History,
  AlertTriangle,
  LockOpen,
  Trash2,
  ShieldCheck,
  EyeOff,
  Verified,
  Wrench,
  Plus,
  X,
  Mail,
  Users,
} from "lucide-react";

const snapshotCards = [
  {
    title: "Room Occupancy",
    value: "84.2%",
    note: "+2.4%",
    icon: BedDouble,
  },
  {
    title: "Staff On-Duty",
    value: "12/14",
    note: "Morning Shift",
    icon: Badge,
  },
  {
    title: "Projected RevPAR",
    value: "Rs 288",
    note: "High Demand",
    icon: TrendingUp,
  },
  {
    title: "Daily Revenue",
    value: "Rs 14.2k",
    note: "78%",
    icon: DollarSign,
  },
];

const approvalRequests = [
  {
    title: "Alex Thompson",
    requestedBy: "Requested by Agent Sarah M.",
    detail: "Room 402 • 15% VIP Loyalty Discount • Total: Rs 1,240.00",
    icon: UserSearch,
  },
  {
    title: "Jameson Wedding Block",
    requestedBy: "Requested by Sales Director",
    detail: "12 Rooms • Rs 500/night flat rate authorization",
    icon: Siren,
  },
  {
    title: "Refund: Clara Oswald",
    requestedBy: "Requested by Front Desk",
    detail: "Maintenance Credit • -Rs 45.00 for AC issues",
    icon: History,
  },
];

const complaints = [
  {
    title: "Room 201 • Leak",
    time: "12m ago",
    message:
      "Water dripping from bathroom ceiling. Guest is very frustrated, requested a suite upgrade.",
    urgent: true,
  },
  {
    title: "Valet Delay • Mr. Chen",
    time: "45m ago",
    message:
      "Waited 20 minutes for car. Expressed disappointment during check-out process.",
    urgent: false,
  },
];

const revenueItems = [
  { label: "Rooms Revenue", value: "Rs 294,200" },
  { label: "Food & Beverage", value: "Rs 98,400" },
  { label: "Ancillary Services", value: "Rs 27,400" },
];

const staffActivities = [
  {
    name: "Mark J.",
    action: "logged in",
    role: "Front Desk • 2m ago",
    avatar: "MJ",
  },
  {
    name: "Elena R.",
    action: "completed check-in",
    role: "Concierge • 15m ago",
    avatar: "ER",
  },
  {
    name: "Maint_Bot",
    action: "resolved ticket #421",
    role: "Engineering • 1h ago",
    avatar: "BOT",
  },
];

const auditTrail = [
  {
    icon: LockOpen,
    title: "Manager Override:",
    text: "Room 104 Price Change by ID:2901",
    meta: "14:22:10 • IP: 192.168.1.42",
  },
  {
    icon: Trash2,
    title: "Folio Deleted:",
    text: "#98221 Draft by Agent Sarah M.",
    meta: "14:15:05 • IP: 192.168.1.18",
  },
  {
    icon: ShieldCheck,
    title: "System Config:",
    text: "Tax rate updated to 12.5%",
    meta: "13:58:22 • Auto-Scheduled",
  },
  {
    icon: EyeOff,
    title: "PII Accessed:",
    text: "Vault decryption for reservation #R-902",
    meta: "13:45:11 • User: Admin_Lee",
  },
  {
    icon: Verified,
    title: "New Staff Role:",
    text: "Junior Agent role assigned to 4 users",
    meta: "12:30:00 • User: Admin_Lee",
  },
];

export default function ManagerDashboardPage() {
  const [hiddenRequests, setHiddenRequests] = useState<string[]>([]);
  const [fabOpen, setFabOpen] = useState(false);

  const handleApproval = (title: string) => {
    setHiddenRequests((current) => [...current, title]);
  };

  return (
    <ProtectedRoute allowedRoles={["MANAGER", "OWNER"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="min-h-screen lg:ml-[280px]">
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#d0c5af] bg-[#fbf9f5]/90 px-8 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">LuxeStay Operations</h1>

              <div className="hidden h-6 w-px bg-[#d0c5af] md:block" />

              <div className="relative hidden md:block">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7f7663]"
                />

                <input
                  type="text"
                  placeholder="Search reservations or folios..."
                  className="w-72 rounded-full bg-[#efeeea] py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#d4af37]/40"
                />
              </div>
            </div>

            <div className="flex items-center gap-5">
              <button className="hidden items-center gap-1 text-sm font-semibold text-[#4d4635] transition hover:text-[#735c00] lg:flex">
                <HelpCircle size={18} />
                Support
              </button>

              <button className="relative rounded-full p-2 text-[#4d4635] transition hover:bg-[#efeeea]">
                <Bell size={20} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ba1a1a]" />
              </button>

              <button className="rounded-full p-2 text-[#4d4635] transition hover:bg-[#efeeea]">
                <Grid3X3 size={20} />
              </button>

              <button className="hidden rounded-lg bg-[#d4af37] px-6 py-2 font-bold text-[#554300] shadow-sm transition hover:opacity-90 xl:block">
                New Reservation
              </button>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d0c5af] bg-[#131b2e] font-bold text-[#ffe088]">
                MR
              </div>
            </div>
          </header>

          <section className="mx-auto max-w-[1600px] p-8">
            <div className="manager-fade mb-8">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Manager Control Center
              </p>

              <h2 className="mt-3 text-4xl font-extrabold">
                Manager Dashboard
              </h2>

              <p className="mt-3 text-[#4d4635]">
                Monitor hotel operations, approvals, staff activity, revenue,
                and urgent guest feedback.
              </p>
            </div>

            <section className="manager-fade mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {snapshotCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    key={card.title}
                    className="flex h-32 cursor-default flex-col justify-between rounded-xl border border-[#d0c5af] bg-white p-6 shadow-sm transition hover:scale-[1.02]"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-sm font-semibold text-[#4d4635]">
                        {card.title}
                      </span>

                      <Icon size={22} className="text-[#735c00]" />
                    </div>

                    <div className="flex items-end justify-between">
                      <p className="text-4xl font-bold">{card.value}</p>

                      <span className="rounded bg-[#ffe088] px-2 py-1 text-xs font-bold text-[#735c00]">
                        {card.note}
                      </span>
                    </div>
                  </article>
                );
              })}
            </section>

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 flex flex-col gap-6 xl:col-span-8">
                <section className="manager-fade overflow-hidden rounded-xl border border-[#d0c5af] border-l-4 border-l-[#d4af37] bg-white shadow-sm">
                  <div className="flex flex-col justify-between gap-4 border-b border-[#d0c5af] p-6 lg:flex-row lg:items-center">
                    <div>
                      <h3 className="text-xl font-semibold">
                        Pending Discount Authorizations
                      </h3>

                      <p className="text-sm text-[#4d4635]">
                        Front desk override requests requiring manager approval.
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-[#ffe088] px-4 py-2 text-sm font-bold text-[#241a00]">
                      4 Urgent
                    </span>
                  </div>

                  <div className="divide-y divide-[#d0c5af]">
                    {approvalRequests
                      .filter((item) => !hiddenRequests.includes(item.title))
                      .map((request) => {
                        const Icon = request.icon;

                        return (
                          <div
                            key={request.title}
                            className="flex flex-col justify-between gap-5 p-6 transition hover:bg-[#f5f3ef] lg:flex-row lg:items-center"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dae2fd] text-[#5c647a]">
                                <Icon size={20} />
                              </div>

                              <div>
                                <h4 className="font-bold">
                                  {request.title}{" "}
                                  <span className="font-normal text-[#4d4635]">
                                    {request.requestedBy}
                                  </span>
                                </h4>

                                <p className="text-xs text-[#4d4635]">
                                  {request.detail}
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <button
                                onClick={() => handleApproval(request.title)}
                                className="rounded-lg border border-[#7f7663] px-5 py-2 text-sm font-semibold transition hover:border-[#ba1a1a] hover:bg-[#ffdad6] hover:text-[#93000a]"
                              >
                                Deny
                              </button>

                              <button
                                onClick={() => handleApproval(request.title)}
                                className="rounded-lg bg-[#d4af37] px-5 py-2 text-sm font-bold text-[#554300] shadow-sm transition hover:opacity-90"
                              >
                                Approve
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <button className="w-full border-t border-[#d0c5af] bg-[#f5f3ef] py-4 text-sm font-bold text-[#735c00] transition hover:bg-[#e4e2de]">
                    View All 12 Requests
                  </button>
                </section>

                <section className="manager-fade overflow-hidden rounded-xl border border-[#d0c5af] border-l-4 border-l-[#ba1a1a] bg-white shadow-sm">
                  <div className="flex flex-col justify-between gap-3 border-b border-[#d0c5af] p-6 lg:flex-row lg:items-center">
                    <h3 className="text-xl font-semibold">
                      High Priority Feedback
                    </h3>

                    <span className="flex animate-pulse items-center gap-1 font-bold text-[#ba1a1a]">
                      <AlertTriangle size={18} />
                      Immediate Attention Required
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
                    {complaints.map((complaint) => (
                      <div
                        key={complaint.title}
                        className={`rounded-lg border p-4 ${
                          complaint.urgent
                            ? "border-[#ba1a1a]/10 bg-[#ffdad6]/40"
                            : "border-[#d0c5af] bg-[#f5f3ef]"
                        }`}
                      >
                        <div className="mb-2 flex justify-between">
                          <span className="font-bold">{complaint.title}</span>
                          <span
                            className={`text-xs font-bold ${
                              complaint.urgent
                                ? "text-[#ba1a1a]"
                                : "text-[#4d4635]"
                            }`}
                          >
                            {complaint.time}
                          </span>
                        </div>

                        <p className="text-sm italic text-[#4d4635]">
                          &quot;{complaint.message}&quot;
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <aside className="col-span-12 flex flex-col gap-6 xl:col-span-4">
                <section className="manager-fade rounded-xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                  <h3 className="mb-6 text-xl font-semibold">
                    Revenue Progress
                  </h3>

                  <div className="mb-8">
                    <div className="mb-2 flex items-end justify-between">
                      <span className="text-sm font-semibold text-[#4d4635]">
                        Monthly Target
                      </span>
                      <span className="font-bold">Rs 420k / Rs 500k</span>
                    </div>

                    <div className="h-4 w-full overflow-hidden rounded-full bg-[#e4e2de]">
                      <div className="manager-progress h-full w-[84%] bg-[#d4af37]" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {revenueItems.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-[#4d4635]">
                          {item.label}
                        </span>
                        <span className="font-bold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="manager-fade overflow-hidden rounded-xl border border-[#d0c5af] bg-white shadow-sm">
                  <div className="border-b border-[#d0c5af] p-6">
                    <h3 className="text-xl font-semibold">Staff Activity</h3>
                  </div>

                  <div className="space-y-4 p-4">
                    {staffActivities.map((staff) => (
                      <div key={staff.name} className="flex gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#efeeea] text-xs font-bold text-[#735c00]">
                          {staff.name === "Maint_Bot" ? (
                            <Wrench size={18} />
                          ) : (
                            staff.avatar
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-bold">
                            {staff.name}{" "}
                            <span className="font-normal text-[#4d4635]">
                              {staff.action}
                            </span>
                          </p>

                          <p className="text-xs text-[#7f7663]">
                            {staff.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="manager-fade rounded-xl border border-[#d0c5af] border-l-4 border-l-[#111c2d] bg-white p-6 shadow-sm">
                  <h3 className="mb-4 font-bold">Audit Trail Last 5</h3>

                  <ul className="space-y-3">
                    {auditTrail.map((audit) => {
                      const Icon = audit.icon;

                      return (
                        <li
                          key={`${audit.title}-${audit.text}`}
                          className="flex items-start gap-2 text-xs"
                        >
                          <Icon
                            size={15}
                            className="mt-0.5 shrink-0 text-[#735c00]"
                          />

                          <div>
                            <span className="font-bold">{audit.title}</span>{" "}
                            {audit.text}
                            <p className="text-[#7f7663]">{audit.meta}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              </aside>
            </div>
          </section>
        </main>

        <div className="fixed bottom-10 right-10 z-50 flex flex-col items-end gap-4">
          {fabOpen && (
            <div className="flex flex-col items-end gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-[#d0c5af] bg-white px-4 py-2 shadow-lg transition hover:bg-[#efeeea]">
                <span className="font-semibold">Emergency Alert</span>
                <Bell size={18} className="text-[#ba1a1a]" />
              </button>

              <button className="flex items-center gap-2 rounded-lg border border-[#d0c5af] bg-white px-4 py-2 shadow-lg transition hover:bg-[#efeeea]">
                <span className="font-semibold">Internal Memo</span>
                <Mail size={18} className="text-[#735c00]" />
              </button>

              <button className="flex items-center gap-2 rounded-lg border border-[#d0c5af] bg-white px-4 py-2 shadow-lg transition hover:bg-[#efeeea]">
                <span className="font-semibold">Schedule Meeting</span>
                <Users size={18} className="text-[#735c00]" />
              </button>
            </div>
          )}

          <button
            onClick={() => setFabOpen(!fabOpen)}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[#3c475a] text-[#d4af37] shadow-2xl transition hover:scale-110 active:scale-95"
          >
            {fabOpen ? <X size={32} /> : <Plus size={32} />}
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
