"use client";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getStatusBadgeClass } from "@/lib/utils/statusStyles";

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

import { useState, useEffect } from "react";
import { getAll as getAudits } from "@/lib/api/auditApi";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAudits();
        setLogs(data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const totalLogs = logs.length;
  const successActions = logs.filter(l => l.action?.toLowerCase().includes("created") || l.action?.toLowerCase().includes("updated") || l.action?.toLowerCase().includes("deleted")).length;
  
  const auditStats = [
    { label: "Total Logs", value: totalLogs.toString(), note: "All recorded actions" },
    { label: "Success Actions", value: successActions.toString(), note: "Completed safely" },
    { label: "Denied Actions", value: "0", note: "Blocked by role access" },
    { label: "Failed Attempts", value: "0", note: "Login or system failures" },
  ];

  const modules = Array.from(new Set(logs.map(l => l.module)));
  const moduleActivity = modules.map(mod => {
    const count = logs.filter(l => l.module === mod).length;
    return {
      label: mod || "Unknown",
      value: `${count} logs`,
      percent: `${Math.round((count / (totalLogs || 1)) * 100)}%`
    };
  });

  const alerts = logs.slice(0, 3).map(l => ({
    title: "System Action",
    text: l.action,
    type: "info"
  }));
  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER"]}>
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
                  {logs.map((log) => (
                    <tr key={log.id} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{log.id?.substring(0,8)}</td>

                      <td className="px-6 py-5 font-semibold">{log.userName || log.userId}</td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#735c00]">
                          SYSTEM
                        </span>
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {log.details || log.action}
                      </td>

                      <td className="px-6 py-5 font-semibold">
                        {log.module}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">-</td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        -
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {new Date(log.timestamp).toLocaleDateString()}
                        <br />
                        <span className="text-xs">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getSeverityClass(
                            "Info"
                          )}`}
                        >
                          Info
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusBadgeClass(
                            "Success"
                          )}`}
                        >
                          Success
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
