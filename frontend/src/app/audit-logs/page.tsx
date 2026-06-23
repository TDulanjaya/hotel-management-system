import AppSidebar from "@/components/layout/AppSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const auditStats = [
  {
    label: "Total Logs",
    value: "214",
    note: "All recorded actions",
  },
  {
    label: "Success Actions",
    value: "186",
    note: "Completed safely",
  },
  {
    label: "Denied Actions",
    value: "21",
    note: "Blocked by role access",
  },
  {
    label: "Failed Attempts",
    value: "07",
    note: "Login or system failures",
  },
];

const auditLogs = [
  {
    id: "AUD-1001",
    user: "Admin Owner",
    role: "Owner",
    action: "Created new staff user",
    module: "Users",
    ip: "192.168.1.10",
    device: "Chrome / Windows",
    date: "Oct 24, 2024",
    time: "09:15 AM",
    status: "Success",
    severity: "High",
  },
  {
    id: "AUD-1002",
    user: "Julian Sterling",
    role: "Manager",
    action: "Generated daily revenue report",
    module: "Reports",
    ip: "192.168.1.24",
    device: "Edge / Windows",
    date: "Oct 24, 2024",
    time: "09:30 AM",
    status: "Success",
    severity: "Info",
  },
  {
    id: "AUD-1003",
    user: "Front Desk Staff",
    role: "Receptionist",
    action: "Attempted to access reports",
    module: "Reports",
    ip: "192.168.1.38",
    device: "Chrome / Windows",
    date: "Oct 24, 2024",
    time: "10:22 AM",
    status: "Denied",
    severity: "Warning",
  },
  {
    id: "AUD-1004",
    user: "Finance Manager",
    role: "Manager",
    action: "Added new payment transaction",
    module: "Payments",
    ip: "192.168.1.31",
    device: "Chrome / MacOS",
    date: "Oct 24, 2024",
    time: "11:15 AM",
    status: "Success",
    severity: "High",
  },
  {
    id: "AUD-1005",
    user: "Kitchen Staff",
    role: "Kitchen",
    action: "Updated kitchen order status",
    module: "Kitchen",
    ip: "192.168.1.42",
    device: "Tablet / Android",
    date: "Oct 24, 2024",
    time: "12:40 PM",
    status: "Success",
    severity: "Info",
  },
  {
    id: "AUD-1006",
    user: "Unknown User",
    role: "Unknown",
    action: "Failed login attempt",
    module: "Authentication",
    ip: "192.168.1.99",
    device: "Unknown Device",
    date: "Oct 24, 2024",
    time: "01:05 PM",
    status: "Failed",
    severity: "Critical",
  },
];

const moduleActivity = [
  {
    label: "Authentication",
    value: "86 logs",
    percent: "90%",
  },
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
];

const alerts = [
  {
    title: "Access Denied",
    text: "Receptionist attempted to access reports without permission.",
    type: "warning",
  },
  {
    title: "Failed Login",
    text: "Unknown user failed login using invalid credentials.",
    type: "critical",
  },
  {
    title: "Sensitive Action",
    text: "Manager added a payment transaction.",
    type: "info",
  },
];

function getStatusClass(status: string) {
  if (status === "Success") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Denied") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-red-100 text-red-700";
}

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

export default function AuditLogsPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "manager"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Security Monitoring
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Audit Logs
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Track user actions, login attempts, access denied events, and
                sensitive system activities.
              </p>
            </div>

            <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
              Export Logs
            </button>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            {auditStats.map((stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                note={stat.note}
              />
            ))}
          </section>

          <section className="mb-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Module Activity</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Audit activity grouped by system modules.
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
              <h2 className="text-2xl font-bold">Security Alerts</h2>

              <div className="mt-6 space-y-4">
                {alerts.map((alert) => (
                  <AlertCard
                    key={alert.title}
                    title={alert.title}
                    text={alert.text}
                    type={alert.type as "warning" | "critical" | "info"}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="mb-8 rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-4">
              <input
                type="text"
                placeholder="Search logs..."
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
                <option>All Status</option>
                <option>Success</option>
                <option>Denied</option>
                <option>Failed</option>
              </select>

              <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                Filter
              </button>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">System Activity Logs</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Complete list of recorded system actions.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Audit ID</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Module</th>
                    <th className="px-6 py-4">IP Address</th>
                    <th className="px-6 py-4">Device</th>
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
                        {log.device}
                      </td>

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

function AlertCard({
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