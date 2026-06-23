import AppSidebar from "@/components/layout/AppSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const auditSummary = [
  {
    label: "Total Logs",
    value: "214",
    note: "System actions recorded",
  },
  {
    label: "Login Events",
    value: "64",
    note: "User sign-in records",
  },
  {
    label: "Sensitive Actions",
    value: "18",
    note: "Payments, users, reports",
  },
  {
    label: "Failed Attempts",
    value: "07",
    note: "Blocked or failed access",
  },
];

const auditLogs = [
  {
    id: "AUD-1001",
    user: "Julian Sterling",
    role: "Manager",
    action: "Generated Daily Revenue Report",
    module: "Reports",
    ip: "192.168.1.24",
    date: "Oct 24, 2024",
    time: "09:30 AM",
    severity: "Info",
    status: "Success",
  },
  {
    id: "AUD-1002",
    user: "Admin Owner",
    role: "Owner",
    action: "Created New User Account",
    module: "Users",
    ip: "192.168.1.10",
    date: "Oct 24, 2024",
    time: "10:05 AM",
    severity: "High",
    status: "Success",
  },
  {
    id: "AUD-1003",
    user: "Front Desk Staff",
    role: "Receptionist",
    action: "Attempted to Open Reports",
    module: "Reports",
    ip: "192.168.1.38",
    date: "Oct 24, 2024",
    time: "10:22 AM",
    severity: "Warning",
    status: "Denied",
  },
  {
    id: "AUD-1004",
    user: "Finance Manager",
    role: "Manager",
    action: "Added New Payment",
    module: "Payments",
    ip: "192.168.1.31",
    date: "Oct 24, 2024",
    time: "11:15 AM",
    severity: "High",
    status: "Success",
  },
  {
    id: "AUD-1005",
    user: "Kitchen Staff",
    role: "Kitchen",
    action: "Updated Kitchen Order Status",
    module: "Kitchen",
    ip: "192.168.1.42",
    date: "Oct 24, 2024",
    time: "12:40 PM",
    severity: "Info",
    status: "Success",
  },
  {
    id: "AUD-1006",
    user: "Unknown User",
    role: "Unknown",
    action: "Failed Login Attempt",
    module: "Authentication",
    ip: "192.168.1.99",
    date: "Oct 24, 2024",
    time: "01:05 PM",
    severity: "Critical",
    status: "Failed",
  },
];

const moduleActivity = [
  {
    label: "Reports",
    value: "58 logs",
    percent: "70%",
  },
  {
    label: "Payments",
    value: "44 logs",
    percent: "55%",
  },
  {
    label: "Users",
    value: "26 logs",
    percent: "34%",
  },
  {
    label: "Authentication",
    value: "86 logs",
    percent: "90%",
  },
];

const riskEvents = [
  {
    title: "Unauthorized Report Access",
    text: "Receptionist role attempted to open a manager-only report page.",
    type: "warning",
  },
  {
    title: "Failed Login Attempt",
    text: "Unknown user failed login using invalid credentials.",
    type: "critical",
  },
  {
    title: "Sensitive Payment Action",
    text: "Finance manager added a new payment transaction.",
    type: "info",
  },
];

function getSeverityClass(severity: string) {
  if (severity === "Critical") {
    return "bg-red-100 text-red-700";
  }

  if (severity === "High") {
    return "bg-orange-100 text-orange-700";
  }

  if (severity === "Warning") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-blue-100 text-blue-700";
}

function getStatusClass(status: string) {
  if (status === "Success") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Denied") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-red-100 text-red-700";
}

export default function AuditHistoryReportPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "manager"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Reports & Analytics
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Audit History Report
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View system audit history, user actions, failed login attempts,
                access denied events, and security logs.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/reports"
                className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
              >
                Back to Reports
              </a>

              <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                Export Report
              </button>
            </div>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            {auditSummary.map((item) => (
              <StatCard
                key={item.label}
                label={item.label}
                value={item.value}
                note={item.note}
              />
            ))}
          </section>

          <section className="mb-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Module Activity</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Audit logs grouped by system module.
              </p>

              <div className="mt-6 space-y-4">
                {moduleActivity.map((item) => (
                  <ActivityRow
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    percent={item.percent}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Security Risk Events</h2>

              <div className="mt-6 space-y-4">
                {riskEvents.map((event) => (
                  <RiskCard
                    key={event.title}
                    title={event.title}
                    text={event.text}
                    type={event.type as "warning" | "critical" | "info"}
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
                <option>All Modules</option>
                <option>Authentication</option>
                <option>Reports</option>
                <option>Payments</option>
                <option>Users</option>
                <option>Kitchen</option>
              </select>

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>All Severity</option>
                <option>Info</option>
                <option>Warning</option>
                <option>High</option>
                <option>Critical</option>
              </select>

              <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                Filter
              </button>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">System Audit Logs</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Detailed user action history and access tracking.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Audit ID</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Module</th>
                    <th className="px-6 py-4">IP Address</th>
                    <th className="px-6 py-4">Date / Time</th>
                    <th className="px-6 py-4">Severity</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{log.id}</td>

                      <td className="px-6 py-5 font-semibold">{log.user}</td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#735c00]">
                          {log.role}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {log.action}
                      </td>

                      <td className="px-6 py-5 font-semibold">
                        {log.module}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">{log.ip}</td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {log.date}
                        <br />
                        <span className="text-xs">{log.time}</span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getSeverityClass(
                            log.severity
                          )}`}
                        >
                          {log.severity}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            log.status
                          )}`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
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
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-widest text-[#4d4635]">
        {label}
      </p>

      <p className="mt-2 text-4xl font-extrabold text-[#735c00]">{value}</p>

      <p className="mt-2 text-sm text-[#4d4635]">{note}</p>
    </div>
  );
}

function ActivityRow({
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

function RiskCard({
  title,
  text,
  type,
}: {
  title: string;
  text: string;
  type: "warning" | "critical" | "info";
}) {
  const styles = {
    warning: "border-yellow-200 bg-yellow-50 text-yellow-700",
    critical: "border-red-200 bg-red-50 text-red-700",
    info: "border-blue-200 bg-blue-50 text-blue-700",
  };

  return (
    <div className={`rounded-xl border p-4 ${styles[type]}`}>
      <p className="font-bold">{title}</p>
      <p className="mt-1 text-sm">{text}</p>
    </div>
  );
}