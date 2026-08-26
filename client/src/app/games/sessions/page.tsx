"use client";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useMemo } from "react";
import useSWR from "swr";
import { getGameSessions } from "@/lib/api/gameApi";

function getStatusClass(status: string) {
  if (status === "ACTIVE") {
    return "bg-green-100 text-green-700";
  }

  if (status === "OVERDUE") {
    return "bg-red-100 text-red-700";
  }

  return "bg-blue-100 text-blue-700";
}

export default function GameSessionsPage() {
  const { data: rawSessions, isLoading } = useSWR<any[]>("/api/games/sessions");
  const sessions = useMemo(() => (Array.isArray(rawSessions) ? rawSessions : []), [rawSessions]);
  const loading = !rawSessions && isLoading;

  const activeCount = useMemo(() => sessions.filter((s) => s.status === "ACTIVE").length, [sessions]);
  const overdueCount = useMemo(() => sessions.filter((s) => s.status === "OVERDUE").length, [sessions]);
  const completedCount = useMemo(() => sessions.filter((s) => s.status === "COMPLETED").length, [sessions]);

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "GAME_STAFF"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Games Module
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Game Sessions
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Active and completed game sessions will be shown here.
              </p>
            </div>

            <a
              href="/games/new-session"
              className="rounded-xl bg-[#735c00] px-6 py-3 text-center font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
            >
              + New Session
            </a>
          </div>

          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <StatCard label="Active Sessions" value={String(activeCount)} color="text-green-700" />
            <StatCard label="Overdue Sessions" value={String(overdueCount)} color="text-red-700" />
            <StatCard label="Completed Today" value={String(completedCount)} color="text-blue-700" />
          </div>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Session Records</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Track guest sessions, duration, billing, and current status.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Session ID</th>
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Room</th>
                    <th className="px-6 py-4">Game / Amenity</th>
                    <th className="px-6 py-4">Start Time</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-[#4d4635]">
                        <p className="text-lg font-bold">Loading sessions...</p>
                      </td>
                    </tr>
                  ) : sessions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-[#4d4635]">
                        <p className="text-lg font-bold">No sessions found</p>
                        <p className="mt-1 text-sm">Create a new game session to get started.</p>
                      </td>
                    </tr>
                  ) : (
                    sessions.map((session) => (
                      <tr
                        key={session.id}
                        className="transition hover:bg-[#fbf9f5]"
                      >
                        <td className="px-6 py-5 font-bold">{session.id.substring(session.id.length - 6).toUpperCase()}</td>

                        <td className="px-6 py-5 font-semibold">
                          {session.guestName || "N/A"}
                        </td>

                        <td className="px-6 py-5 text-[#4d4635]">
                          {session.roomNumber || "N/A"}
                        </td>

                        <td className="px-6 py-5">{session.gameName}</td>

                        <td className="px-6 py-5 text-[#4d4635]">
                          {session.startTime ? new Date(session.startTime).toLocaleTimeString() : "N/A"}
                        </td>

                        <td className="px-6 py-5 font-bold">
                          {session.duration}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                              session.status
                            )}`}
                          >
                            {session.status}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-right font-bold">
                          Rs {session.totalAmount}
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
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-widest text-[#4d4635]">
        {label}
      </p>

      <p className={`mt-2 text-4xl font-extrabold ${color}`}>{value}</p>
    </div>
  );
}
