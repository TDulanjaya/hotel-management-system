"use client";

import { useEffect, useState } from "react";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  Search,
  Bell,
  User,
  Timer,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react";
import { getGameSessions, updateGameSession } from "@/lib/api/gameApi";
import { useAuthContext } from "@/context/AuthContext";

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");

  return `${h}:${m}:${s}`;
}

function ribbonClass(ribbon: string) {
  if (ribbon === "occupied") return "border-l-4 border-l-[#735c00]";
  if (ribbon === "warning") return "border-l-4 border-l-[#ba1a1a]";
  return "border-l-4 border-l-green-500";
}

function badgeClass(status: string) {
  if (status === "OCCUPIED") return "bg-[#dae2fd] text-[#565e74]";
  if (status === "OVERDUE") return "bg-[#ffdad6] text-[#93000a]";
  return "bg-green-100 text-green-700";
}

export default function GamesPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const { user } = useAuthContext();

  const loadSessions = async () => {
    try {
      const data = await getGameSessions();
      setSessions(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleAction = async (session: any, action: string) => {
    if (action === "End Rental" || action === "End & Audit") {
      const confirmEnd = window.confirm(
        "Confirm end of rental? This will finalize the charge calculation."
      );

      if (confirmEnd) {
        try {
          await updateGameSession(session.id, { ...session, status: "COMPLETED" });
          loadSessions();
        } catch (err) {
          console.error(err);
          alert("Failed to end rental.");
        }
      }
    }
  };

  const availableCount = sessions.filter((s) => s.status === "AVAILABLE").length;
  const occupiedCount = sessions.filter((s) => s.status === "ACTIVE").length;
  const overdueCount = sessions.filter((s) => s.status === "OVERDUE").length;

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "GAME_STAFF"]}>
      <div className="min-h-screen bg-[#f5f3ef] text-[#1b1c1a]">
        <AppSidebar />

        <main className="min-h-screen lg:ml-[280px]">
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#d0c5af] bg-[#fbf9f5] px-8">
            <div className="flex items-center gap-4">
              <Search size={22} className="text-[#735c00]" />

              <input
                type="text"
                placeholder="Search guests or amenities..."
                className="w-72 border-none bg-transparent text-sm text-[#4d4635] outline-none"
              />
            </div>

            <div className="flex items-center gap-6">
              <button className="relative text-[#4d4635] transition hover:text-[#735c00]">
                <Bell size={22} />
                <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#ba1a1a]" />
              </button>

              <div className="flex items-center gap-3 border-l border-[#d0c5af] pl-6">
                <div className="hidden text-right md:block">
                  <p className="text-sm font-bold">{user?.name || "Guest"}</p>
                  <p className="text-xs uppercase tracking-wider text-[#4d4635]">{user?.role || "Staff"}</p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#d4af37] bg-[#131b2e] font-bold text-[#ffe088]">
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : "US"}
                </div>
              </div>
            </div>
          </header>

          <section className="mx-auto max-w-[1600px] px-8 pb-12 pt-10">
            <div className="mb-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                  Games Module
                </p>

                <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                  Games & Amenities
                </h1>

                <p className="mt-2 text-[#4d4635]">
                  Real-time oversight of luxury recreation facilities and guest
                  rentals.
                </p>
              </div>

              <a
                href="/games/new-session"
                className="flex items-center gap-2 rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
              >
                <Plus size={18} />
                New Game Session
              </a>
            </div>

            <div className="mb-8 grid gap-6 md:grid-cols-3">
              <StatCard label="Available" value={String(availableCount)} color="text-green-700" />
              <StatCard label="Occupied" value={String(occupiedCount)} color="text-[#735c00]" />
              <StatCard label="Overdue" value={String(overdueCount)} color="text-[#ba1a1a]" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {sessions.length === 0 ? (
                <div className="col-span-full rounded-2xl border border-[#d0c5af] bg-white p-10 text-center shadow-sm">
                  <p className="text-xl font-bold text-[#735c00]">No sessions found</p>
                  <p className="mt-2 text-[#4d4635]">Create a new game session to get started.</p>
                </div>
              ) : sessions.map((session) => {
                const ribbon = session.status === "ACTIVE" ? "occupied" : session.status === "OVERDUE" ? "warning" : "available";
                const actions = session.status === "ACTIVE" || session.status === "OVERDUE" ? ["End Rental"] : ["Start Rental"];
                const items = session.equipmentChecked ? ["Equipment Checked"] : ["Equipment Unchecked"];
                const missing: string[] = [];

                return (
                <article
                  key={session.id}
                  className={`overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${ribbonClass(
                    ribbon
                  )}`}
                >
                  <div className="p-6">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-bold">{session.gameName}</h2>
                        <p className="text-xs font-bold uppercase tracking-wide text-[#735c00]">
                          {session.gameType}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${badgeClass(
                          session.status
                        )}`}
                      >
                        {session.status}
                      </span>
                    </div>

                    {session.status !== "AVAILABLE" ? (
                      <>
                        <div className="mb-5 flex items-center gap-3 rounded-xl bg-[#f5f3ef] p-4">
                          <User size={22} className="text-[#735c00]" />

                          <div>
                            <p className="text-xs text-[#4d4635]">
                              Guest / Room
                            </p>
                            <p className="text-sm font-bold">
                              {session.guestName || 'N/A'} ({session.roomNumber || 'N/A'})
                            </p>
                          </div>
                        </div>

                        <div className="mb-5 flex items-center gap-3 rounded-xl bg-[#101827] p-4 text-white">
                          <Timer size={22} className="text-[#d4af37]" />

                          <div>
                            <p className="text-xs text-white/60">
                              {session.status === "OVERDUE"
                                ? "Time Overdue"
                                : "Rental Timer"}
                            </p>
                            <p className="text-2xl font-bold">
                              {session.duration || "Active"}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="mb-5 rounded-xl bg-green-50 p-4 text-green-700">
                        <div className="flex items-center gap-2">
                          <CheckCircle size={20} />
                          <p className="font-bold">Ready for check-in</p>
                        </div>
                        <p className="mt-1 text-sm">
                          Standard kit checked and available.
                        </p>
                      </div>
                    )}

                    <div className="space-y-3">
                      <p className="text-sm font-bold text-[#4d4635]">
                        Equipment Kit
                      </p>

                      {items.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle size={16} className="text-green-600" />
                          <span>{item}</span>
                        </div>
                      ))}

                      {missing.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 text-sm text-[#ba1a1a]"
                        >
                          <XCircle size={16} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-[#d0c5af] bg-[#f5f3ef] p-4">
                    <div className="flex flex-wrap gap-3">
                      {actions.map((action) => (
                        <button
                          key={action}
                          onClick={() => handleAction(session, action)}
                          className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold transition ${
                            action.includes("End")
                              ? "bg-[#ba1a1a] text-white hover:bg-[#93000a]"
                              : "bg-[#735c00] text-white hover:bg-[#d4af37] hover:text-[#241a00]"
                          }`}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                </article>
              );})}
            </div>

            <section className="mt-8 rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <AlertTriangle size={24} className="text-[#ba1a1a]" />
                <div>
                  <h2 className="text-xl font-bold">Audit Reminder</h2>
                  <p className="text-sm text-[#4d4635]">
                    Overdue sessions and missing equipment should be checked
                    before closing the rental.
                  </p>
                </div>
              </div>
            </section>
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
