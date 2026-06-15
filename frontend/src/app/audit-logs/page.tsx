import AppSidebar from "@/components/layout/AppSidebar";
import {
  Search,
  Bell,
  Download,
  Filter,
  TrendingUp,
  Shield,
  BadgeCheck,
  Lock,
  CircleAlert,
  Trash2,
  CreditCard,
  LogIn,
  Percent,
  CheckCircle,
} from "lucide-react";

const stats = [
  {
    title: "Failed Logins (24h)",
    value: "14",
    note: "+12% from yesterday",
    icon: TrendingUp,
    color: "text-[#ba1a1a]",
    bar: "bg-[#735c00]",
  },
  {
    title: "Manager Overrides",
    value: "08",
    note: "All authenticated",
    icon: Shield,
    color: "text-[#1b1c1a]",
    bar: "bg-[#565e74]",
  },
  {
    title: "Financial Changes",
    value: "126",
    note: "Audited & Matched",
    icon: BadgeCheck,
    color: "text-[#1b1c1a]",
    bar: "bg-[#d4af37]",
  },
  {
    title: "System Integrity",
    value: "100%",
    note: "Logs Immutable",
    icon: Lock,
    color: "text-[#1b1c1a]",
    bar: "bg-[#131b2e]",
  },
];

const logs = [
  {
    type: "warning",
    user: "Julianne Devis",
    initials: "JD",
    action: 'Bypassed "Max Discount Limit"',
    category: "Manager Override",
    time: "Oct 31, 2023 • 14:22:01",
    reason: '"VVIP guest complaint - authorized 40% discount for Suite 402."',
    ip: "192.168.1.42",
    device: "MacOS Chrome",
    icon: CircleAlert,
    highlight: true,
  },
  {
    type: "delete",
    user: "Marcus Knight",
    initials: "MK",
    action: "Deleted Guest Folio #9021",
    category: "Deleted Records",
    time: "Oct 31, 2023 • 13:05:45",
    reason: "Duplicate entry identified during morning audit.",
    ip: "10.0.4.128",
    device: "Windows Edge",
    icon: Trash2,
  },
  {
    type: "payment",
    user: "Sarah Lopez",
    initials: "SL",
    action: "Modified Card Terminal #2",
    category: "Payment Changes",
    time: "Oct 31, 2023 • 11:50:12",
    reason: "Terminal recalibration after failed batch settlement.",
    ip: "192.168.1.15",
    device: "iPad OS",
    icon: CreditCard,
  },
  {
    type: "login",
    user: "unknown_user",
    initials: "??",
    action: "Failed Login Attempt (3/5)",
    category: "Security Alert",
    time: "Oct 31, 2023 • 10:30:00",
    reason: "Invalid password entered from unauthorized IP.",
    ip: "45.22.102.1",
    device: "Unknown Device",
    icon: LogIn,
    danger: true,
  },
  {
    type: "discount",
    user: "Alexander Wright",
    initials: "AW",
    action: "Approved Staff Discount",
    category: "Discount Approval",
    time: "Oct 31, 2023 • 09:15:22",
    reason: "Employee benefit policy #EB-2023.",
    ip: "192.168.1.10",
    device: "MacOS Safari",
    icon: Percent,
  },
];

export default function AuditLogsPage() {
  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
      <AppSidebar />

      <main className="min-h-screen lg:ml-[280px]">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#d0c5af] bg-[#fbf9f5] px-8 shadow-sm">
          <div className="relative w-full max-w-md">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4d4635]"
            />

            <input
              type="text"
              placeholder="Search logs by user, IP, or action..."
              className="w-full rounded-lg border-none bg-[#f5f3ef] py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#d4af37]/40"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative rounded-full p-2 text-[#4d4635] transition hover:bg-[#eae8e4]">
              <Bell size={22} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ba1a1a]" />
            </button>

            <div className="h-8 w-px bg-[#d0c5af]" />

            <div className="flex items-center gap-3">
              <div className="hidden text-right md:block">
                <p className="text-sm font-bold">Alexander Wright</p>
                <p className="text-xs text-[#4d4635]">General Manager</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#d4af37]/40 bg-[#131b2e] font-bold text-[#ffe088]">
                AW
              </div>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-[1600px] p-8">
          <div className="mb-10 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs text-[#4d4635]">
                <span>Security</span>
                <span>›</span>
                <span className="font-bold text-[#735c00]">Audit Logs</span>
              </div>

              <h1 className="text-4xl font-bold">Immutable System Logs</h1>

              <p className="mt-2 text-[#4d4635]">
                Comprehensive tracking of all administrative and sensitive
                operations.
              </p>
            </div>

            <div className="flex gap-4">
              <button className="flex items-center gap-2 rounded-lg border border-[#7f7663] bg-white px-4 py-2 text-sm font-bold text-[#565e74] transition hover:bg-[#eae8e4]">
                <Download size={18} />
                Export PDF
              </button>

              <button className="flex items-center gap-2 rounded-lg bg-[#735c00] px-4 py-2 text-sm font-bold text-white transition hover:opacity-90">
                <Filter size={18} />
                Advanced Filters
              </button>
            </div>
          </div>

          <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <article
                  key={stat.title}
                  className="relative overflow-hidden rounded-xl border border-[#d0c5af] bg-white p-6 shadow-sm"
                >
                  <div
                    className={`absolute bottom-0 left-0 top-0 w-1 ${stat.bar}`}
                  />

                  <p className="text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                    {stat.title}
                  </p>

                  <h2 className={`mt-2 text-4xl font-bold ${stat.color}`}>
                    {stat.value}
                  </h2>

                  <p className="mt-1 flex items-center gap-1 text-xs text-[#4d4635]">
                    <Icon size={14} />
                    {stat.note}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
            <span className="text-xs font-bold uppercase text-[#4d4635]">
              Filter By:
            </span>

            <select className="rounded-lg border border-[#d0c5af] bg-white px-4 py-2 text-sm outline-none">
              <option>All Actions</option>
              <option>Login Attempts</option>
              <option>Manager Overrides</option>
              <option>Payment Changes</option>
              <option>Record Deletions</option>
            </select>

            <select className="rounded-lg border border-[#d0c5af] bg-white px-4 py-2 text-sm outline-none">
              <option>All Roles</option>
              <option>Super Admin</option>
              <option>Manager</option>
              <option>Front Desk</option>
              <option>Audit</option>
            </select>

            <input
              type="text"
              defaultValue="Oct 24, 2023 - Oct 31, 2023"
              className="rounded-lg border border-[#d0c5af] bg-white px-4 py-2 text-sm outline-none"
            />

            <span className="ml-auto text-xs italic text-[#4d4635]">
              Showing 1,240 of 48,209 records
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="grid grid-cols-[80px_1fr_180px_190px_280px_150px_60px] border-b border-[#d0c5af] bg-[#eae8e4] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#4d4635]">
              <div>Type</div>
              <div>User & Action</div>
              <div>Category</div>
              <div>Timestamp</div>
              <div>Reason / Description</div>
              <div>IP & Device</div>
              <div className="text-center">Auth</div>
            </div>

            <div className="divide-y divide-[#d0c5af]">
              {logs.map((log) => {
                const Icon = log.icon;

                return (
                  <div
                    key={`${log.user}-${log.time}`}
                    className={`audit-row grid grid-cols-[80px_1fr_180px_190px_280px_150px_60px] items-center px-6 py-5 transition hover:bg-[#f5f3ef] ${
                      log.highlight ? "bg-[#ffdad6]/30" : ""
                    } ${log.danger ? "bg-[#ba1a1a]/5" : ""}`}
                  >
                    <div className="flex justify-center">
                      <Icon
                        size={22}
                        className={
                          log.danger || log.highlight
                            ? "text-[#ba1a1a]"
                            : "text-[#735c00]"
                        }
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#735c00]/10 text-xs font-bold text-[#735c00]">
                        {log.initials}
                      </div>

                      <div>
                        <p className="text-sm font-bold">{log.user}</p>
                        <p
                          className={`text-sm ${
                            log.danger
                              ? "font-bold text-[#ba1a1a]"
                              : "text-[#4d4635]"
                          }`}
                        >
                          {log.action}
                        </p>
                      </div>
                    </div>

                    <div>
                      <span
                        className={`rounded px-2 py-1 text-[11px] font-bold uppercase ${
                          log.danger || log.highlight
                            ? "bg-[#ba1a1a]/10 text-[#ba1a1a]"
                            : "bg-[#735c00]/10 text-[#735c00]"
                        }`}
                      >
                        {log.category}
                      </span>
                    </div>

                    <p className="text-sm text-[#4d4635]">{log.time}</p>

                    <p
                      className={`text-sm ${
                        log.danger
                          ? "italic text-[#ba1a1a]"
                          : "text-[#4d4635]"
                      }`}
                    >
                      {log.reason}
                    </p>

                    <p className="font-mono text-xs text-[#4d4635]">
                      {log.ip}
                      <br />
                      <span className="opacity-60">{log.device}</span>
                    </p>

                    <div className="flex justify-center">
                      <Lock size={20} className="text-[#735c00]" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-[#d0c5af] bg-[#f5f3ef] px-6 py-4">
              <button
                disabled
                className="px-4 py-2 text-xs text-[#4d4635] opacity-50"
              >
                Previous
              </button>

              <div className="flex gap-2">
                <button className="h-8 w-8 rounded bg-[#735c00] text-xs font-bold text-white">
                  1
                </button>
                <button className="h-8 w-8 rounded text-xs text-[#4d4635] hover:bg-[#eae8e4]">
                  2
                </button>
                <button className="h-8 w-8 rounded text-xs text-[#4d4635] hover:bg-[#eae8e4]">
                  3
                </button>
                <span className="px-2">...</span>
                <button className="h-8 w-8 rounded text-xs text-[#4d4635] hover:bg-[#eae8e4]">
                  482
                </button>
              </div>

              <button className="px-4 py-2 text-xs text-[#4d4635] hover:text-[#735c00]">
                Next
              </button>
            </div>
          </div>

          <div className="mt-8 flex items-start gap-4 rounded-xl border border-dashed border-[#7f7663] bg-[#131b2e]/5 p-6">
            <CheckCircle size={34} className="text-[#735c00]" />

            <div>
              <h2 className="text-xl font-semibold">
                Blockchain Verified Log Integrity
              </h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                These logs are cryptographically hashed and anchored. Any
                attempt to modify, delete, or obscure a record will trigger an
                immediate security notification.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}