"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { ReportSummaryCards } from "@/components/reports/ReportSummaryCards";
import { ReportPageLayout } from "@/components/reports/ReportPageLayout";

function getSeverityClass(severity: string) {
  switch (severity?.toUpperCase()) {
    case "CRITICAL":
      return "bg-red-100 text-red-700";
    case "HIGH":
    case "WARNING":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-blue-100 text-blue-700";
  }
}

function getStatusClass(status: string) {
  if (status === "Success" || status === "SUCCESS") {
    return "bg-green-100 text-green-700";
  }
  if (status === "Denied" || status === "DENIED") {
    return "bg-yellow-100 text-yellow-800";
  }
  return "bg-red-100 text-red-700";
}

export default function AuditHistoryReportPage() {
  const { data: rawLogs, isLoading } = useSWR<any[]>("/api/audit-logs");
  const auditLogs = useMemo(() => (Array.isArray(rawLogs) ? rawLogs : []), [rawLogs]);

  const [selectedModule, setSelectedModule] = useState("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState("ALL");

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchMod = selectedModule === "ALL" || log.module === selectedModule;
      const matchSev = selectedSeverity === "ALL" || (log.action?.includes("DELETE") ? "Critical" : "Info") === selectedSeverity;
      return matchMod && matchSev;
    });
  }, [auditLogs, selectedModule, selectedSeverity]);

  const auditSummary = useMemo(() => {
    const total = auditLogs.length;
    const authEvents = auditLogs.filter((l) => l.module === "AUTH" || l.module === "AUTHENTICATION" || l.action?.includes("LOGIN")).length;
    const sensitive = auditLogs.filter((l) => l.action?.includes("DELETE") || l.action?.includes("UPDATE")).length;
    const createEvents = auditLogs.filter((l) => l.action?.includes("CREATE")).length;

    return [
      {
        label: "Total Logs",
        value: String(total),
        note: "System actions recorded",
      },
      {
        label: "Auth Events",
        value: String(authEvents),
        note: "Sign-in & auth actions",
      },
      {
        label: "Sensitive Actions",
        value: String(sensitive),
        note: "Updates & deletions",
      },
      {
        label: "Creations",
        value: String(createEvents),
        note: "New entities created",
      },
    ];
  }, [auditLogs]);

  const moduleActivity = useMemo(() => {
    const map = new Map<string, number>();
    auditLogs.forEach((log) => {
      const mod = log.module || "General";
      map.set(mod, (map.get(mod) || 0) + 1);
    });

    const total = auditLogs.length || 1;
    return Array.from(map.entries()).map(([label, count]) => ({
      label,
      value: `${count} log${count > 1 ? "s" : ""}`,
      percent: `${Math.round((count / total) * 100)}%`,
    }));
  }, [auditLogs]);

  return (
    <ReportPageLayout title="Audit History Report">
      <ReportSummaryCards cards={auditSummary} />

      <section className="mb-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Module Activity</h2>
          <p className="mt-1 text-sm text-[#4d4635]">
            Audit logs grouped by system module.
          </p>

          <div className="mt-6 space-y-4">
            {moduleActivity.length === 0 ? (
              <p className="text-sm text-[#4d4635]">No audit logs recorded yet.</p>
            ) : (
              moduleActivity.map((item) => (
                <ActivityRow
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  percent={item.percent}
                />
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Security Status</h2>
          <div className="mt-6 space-y-4">
            <RiskCard
              title="Audit Logging Active"
              text="All system actions and modifications are being logged."
              type="info"
            />
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
          >
            <option value="ALL">All Modules</option>
            <option value="AUTH">Authentication</option>
            <option value="REPORTS">Reports</option>
            <option value="PAYMENTS">Payments</option>
            <option value="USERS">Users</option>
            <option value="ROOM">Rooms</option>
            <option value="INVENTORY">Inventory</option>
          </select>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
          >
            <option value="ALL">All Severity</option>
            <option value="Info">Info</option>
            <option value="Critical">Critical</option>
          </select>

          <button
            onClick={() => {
              setSelectedModule("ALL");
              setSelectedSeverity("ALL");
            }}
            className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
          >
            Reset Filters
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
          <table className="w-full min-w-[1000px] text-left">
            <thead>
              <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Module</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#d0c5af]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#4d4635]">
                    Loading audit records...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#4d4635]">
                    No audit records found in the database.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id || `${log.action}-${log.timestamp}`} className="transition hover:bg-[#fbf9f5]">
                    <td className="px-6 py-5 font-bold text-[#1b1c1a]">
                      {log.userName || log.userId || "System"}
                    </td>
                    <td className="px-6 py-5 font-semibold text-[#735c00]">
                      {log.action}
                    </td>
                    <td className="px-6 py-5 text-[#4d4635]">
                      {log.module || "General"}
                    </td>
                    <td className="max-w-[260px] truncate px-6 py-5 text-sm text-[#4d4635]">
                      {log.details || "—"}
                    </td>
                    <td className="px-6 py-5 text-sm text-[#4d4635]">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : "—"}
                    </td>
                    <td className="px-6 py-5">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                        Success
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </ReportPageLayout>
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
    <div>
      <div className="flex justify-between text-sm font-bold">
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#e8e6e1]">
        <div
          className="h-full rounded-full bg-[#735c00]"
          style={{ width: percent }}
        />
      </div>
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
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-950">
      <h3 className="font-bold">{title}</h3>
      <p className="mt-1 text-sm">{text}</p>
    </div>
  );
}
