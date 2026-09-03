"use client";
import { AuthUser, getUser } from "@/utils/auth";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  Gamepad2,
  Plus,
  RefreshCw,
  Search,
  Timer,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import {
  deleteGameSession,
  getGameSessions,
  updateGameSession,
} from "@/lib/api/gameApi";

function ribbonClass(status: string) {
  if (status === "ACTIVE") return "border-l-4 border-l-[#735c00]";
  if (status === "OVERDUE") return "border-l-4 border-l-[#ba1a1a]";
  if (status === "COMPLETED") return "border-l-4 border-l-slate-400";
  return "border-l-4 border-l-green-500";
}

function badgeClass(status: string) {
  if (status === "ACTIVE") return "bg-[#dae2fd] text-[#565e74]";
  if (status === "OVERDUE") return "bg-[#ffdad6] text-[#93000a]";
  if (status === "COMPLETED") return "bg-slate-100 text-slate-700";
  return "bg-green-100 text-green-700";
}

export default function GamesPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    setUser(getUser());
  }, []);

  const [currentRole, setCurrentRole] = useState("");
  const [sessions, setSessions] = useState<any[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canManage =
    currentRole === "OWNER" ||
    currentRole === "MANAGER" ||
    currentRole === "GAME_STAFF";

  const canDelete = currentRole === "OWNER" || currentRole === "MANAGER";

  const loadSessions = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getGameSessions();
      const sessionList = Array.isArray(data) ? data : [];
      setSessions(sessionList);
      setFilteredSessions(sessionList);
    } catch (err: any) {
      setError(err.message || "Failed to load game sessions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();

    if (user?.role) {
      setCurrentRole(user.role);
      return;
    }

    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setCurrentRole(parsedUser.role || "");
      }
    } catch {
      setCurrentRole("");
    }
  }, [user]);

  useEffect(() => {
    const keyword = searchText.toLowerCase().trim();

    if (!keyword) {
      setFilteredSessions(sessions);
      return;
    }

    const result = sessions.filter((session) => {
      return (
        session.guestName?.toLowerCase().includes(keyword) ||
        session.roomNumber?.toLowerCase().includes(keyword) ||
        session.gameName?.toLowerCase().includes(keyword) ||
        session.gameType?.toLowerCase().includes(keyword) ||
        session.status?.toLowerCase().includes(keyword)
      );
    });

    setFilteredSessions(result);
  }, [searchText, sessions]);

  const handleEndSession = async (session: any) => {
    const confirmEnd = confirm(
      "Confirm end of rental? This will finalize the charge calculation."
    );

    if (!confirmEnd) return;

    try {
      await updateGameSession(session.id, {
        ...session,
        status: "COMPLETED",
      });

      await loadSessions();
      alert("Game session completed successfully.");
    } catch (err: any) {
      alert(err.message || "Failed to end rental.");
    }
  };

  const handleMarkOverdue = async (session: any) => {
    try {
      await updateGameSession(session.id, {
        ...session,
        status: "OVERDUE",
      });

      await loadSessions();
    } catch (err: any) {
      alert(err.message || "Failed to mark session as overdue.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this game session?")) return;

    try {
      await deleteGameSession(id);
      await loadSessions();
      alert("Game session deleted successfully.");
    } catch (err: any) {
      alert(err.message || "Failed to delete game session.");
    }
  };

  const availableCount = sessions.filter((s) => s.status === "AVAILABLE").length;
  const activeCount = sessions.filter((s) => s.status === "ACTIVE").length;
  const overdueCount = sessions.filter((s) => s.status === "OVERDUE").length;
  const completedCount = sessions.filter((s) => s.status === "COMPLETED").length;

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "GAME_STAFF"]}>
      <div className="min-h-screen bg-[#f5f3ef] text-[#1b1c1a]">
        <AppSidebar />

        <main className="min-h-screen lg:ml-[280px]">
          <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[#d0c5af] bg-[#f8f5ef]/95 pl-16 pr-4 sm:px-8 backdrop-blur-md">
            <div className="flex items-center gap-2 sm:gap-3 rounded-full bg-white px-3 sm:px-4 py-2 border border-[#d0c5af] shadow-sm max-w-[200px] sm:max-w-none">
              <Search size={16} className="text-[#4d4635] shrink-0" />

              <input
                type="text"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search..."
                className="w-full sm:w-72 border-none bg-transparent text-xs sm:text-sm text-[#4d4635] outline-none"
              />
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
              <button className="relative text-[#4d4635] transition hover:text-[#735c00]">
                <Bell size={20} className="sm:w-[22px] sm:h-[22px]" />
                {overdueCount > 0 && (
                  <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#ba1a1a]" />
                )}
              </button>

              <div className="flex items-center gap-3 border-l border-[#d0c5af] pl-3 sm:pl-6">
                <div className="hidden text-right md:block">
                  <p className="text-sm font-bold">{user?.name || "Staff"}</p>
                  <p className="text-xs uppercase tracking-wider text-[#4d4635]">
                    {currentRole || user?.role || "Staff"}
                  </p>
                </div>

                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 border-[#d4af37] bg-[#131b2e] text-xs sm:text-sm font-bold text-[#ffe088]">
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : "US"}
                </div>
              </div>
            </div>
          </header>

          <section className="mx-auto max-w-[1600px] px-4 pb-8 pt-6 sm:px-8 sm:pb-12 sm:pt-10">
            <div className="mb-6 sm:mb-8 flex flex-col justify-between gap-4 sm:gap-6 xl:flex-row xl:items-end">
              <div>
                <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                  Games Module
                </p>

                <h1 className="mt-1 sm:mt-3 text-2xl sm:text-4xl font-bold text-[#735c00]">
                  Games & Amenities
                </h1>

                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#4d4635]">
                  Manage luxury recreation facilities, guest rentals and
                  equipment audit status.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full xl:w-auto">
                <button
                  onClick={loadSessions}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-[#735c00] bg-white px-5 py-3 text-sm sm:text-base font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
                >
                  <RefreshCw size={18} />
                  Refresh
                </button>

                {canManage && (
                  <Link
                    href="/games/new-session"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#735c00] px-5 py-3 text-sm sm:text-base font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
                  >
                    <Plus size={18} />
                    New Game Session
                  </Link>
                )}
              </div>
            </div>

            <div className="mb-6 sm:mb-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <StatCard
                label="Available"
                value={String(availableCount)}
                color="text-green-700"
              />

              <StatCard
                label="Active"
                value={String(activeCount)}
                color="text-[#735c00]"
              />

              <StatCard
                label="Overdue"
                value={String(overdueCount)}
                color="text-[#ba1a1a]"
              />

              <StatCard
                label="Completed"
                value={String(completedCount)}
                color="text-slate-700"
              />
            </div>

            {loading ? (
              <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 sm:p-10 text-center shadow-sm">
                <p className="text-base sm:text-lg font-bold text-[#735c00]">
                  Loading game sessions...
                </p>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 sm:p-10 text-center shadow-sm">
                <p className="font-bold text-red-700">{error}</p>

                <button
                  onClick={loadSessions}
                  className="mt-4 rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white"
                >
                  Try Again
                </button>
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 sm:p-10 text-center shadow-sm">
                <Gamepad2 size={44} className="mx-auto mb-4 text-[#735c00]" />

                <p className="text-xl font-bold text-[#735c00]">
                  No sessions found
                </p>

                <p className="mt-2 text-xs sm:text-sm text-[#4d4635]">
                  Create a new game session to get started.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
                {filteredSessions.map((session) => (
                  <GameSessionCard
                    key={session.id}
                    session={session}
                    canManage={canManage}
                    canDelete={canDelete}
                    onEnd={handleEndSession}
                    onOverdue={handleMarkOverdue}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}

            <section className="mt-6 sm:mt-8 rounded-2xl border border-[#d0c5af] bg-white p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <AlertTriangle size={24} className="text-[#ba1a1a] shrink-0" />

                <div>
                  <h2 className="text-lg sm:text-xl font-bold">Audit Reminder</h2>

                  <p className="text-xs sm:text-sm text-[#4d4635]">
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

function GameSessionCard({
  session,
  canManage,
  canDelete,
  onEnd,
  onOverdue,
  onDelete,
}: {
  session: any;
  canManage: boolean;
  canDelete: boolean;
  onEnd: (session: any) => void;
  onOverdue: (session: any) => void;
  onDelete: (id: string) => void;
  }) {
  const isActive = session.status === "ACTIVE";
  const isOverdue = session.status === "OVERDUE";
  const isAvailable = session.status === "AVAILABLE";
  const isCompleted = session.status === "COMPLETED";

  return (
    <article
      className={`overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${ribbonClass(
        session.status
      )}`}
    >
      <div className="p-4 sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold truncate">
              {session.gameName || "Game Session"}
            </h2>

            <p className="text-xs font-bold uppercase tracking-wide text-[#735c00]">
              {session.gameType || "Amenity"}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold shrink-0 ${badgeClass(
              session.status || "ACTIVE"
            )}`}
          >
            {session.status || "ACTIVE"}
          </span>
        </div>

        {!isAvailable ? (
          <>
            <div className="mb-4 sm:mb-5 flex items-center gap-3 rounded-xl bg-[#f5f3ef] p-3 sm:p-4">
              <User size={20} className="text-[#735c00] shrink-0" />

              <div className="min-w-0">
                <p className="text-xs text-[#4d4635]">Guest / Room</p>

                <p className="text-sm font-bold truncate">
                  {session.guestName || "N/A"} ({session.roomNumber || "N/A"})
                </p>
              </div>
            </div>

            <div className="mb-4 sm:mb-5 flex items-center gap-3 rounded-xl bg-[#101827] p-3 sm:p-4 text-white">
              <Timer size={20} className="text-[#d4af37] shrink-0" />

              <div>
                <p className="text-xs text-white/60">
                  {isOverdue ? "Time Overdue" : "Rental Duration"}
                </p>

                <p className="text-xl sm:text-2xl font-bold">
                  {session.duration || "Active"}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="mb-4 sm:mb-5 rounded-xl bg-green-50 p-3 sm:p-4 text-green-700">
            <div className="flex items-center gap-2">
              <CheckCircle size={18} />

              <p className="font-bold text-sm">Ready for check-in</p>
            </div>

            <p className="mt-1 text-xs sm:text-sm">
              Standard kit checked and available.
            </p>
          </div>
        )}

        <div className="mb-4 sm:mb-5 rounded-xl bg-[#fbf9f5] p-3.5 sm:p-4">
          <p className="mb-2 text-xs sm:text-sm font-bold text-[#4d4635]">
            Session Details
          </p>

          <InfoRow label="Location" value={session.location || "-"} />
          <InfoRow label="Session" value={session.sessionType || "-"} />
          <InfoRow label="Payment" value={session.paymentMethod || "-"} />
          <InfoRow
            label="Amount"
            value={`Rs ${Number(session.totalAmount || 0).toLocaleString()}`}
          />
        </div>

        <div className="space-y-2 sm:space-y-3">
          <p className="text-xs sm:text-sm font-bold text-[#4d4635]">Equipment Kit</p>

          <ChecklistItem
            checked={session.equipmentChecked}
            label="Main equipment checked"
          />

          <ChecklistItem
            checked={session.accessoriesIssued}
            label="Accessories issued"
          />

          <ChecklistItem
            checked={session.guestResponsibilityConfirmed}
            label="Guest responsibility confirmed"
          />
        </div>

        {session.notes && (
          <p className="mt-3 sm:mt-4 rounded-xl bg-yellow-50 p-3 text-xs sm:text-sm font-semibold text-[#806300]">
            Note: {session.notes}
          </p>
        )}
      </div>

      <div className="border-t border-[#d0c5af] bg-[#f5f3ef] p-3 sm:p-4">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {canManage && (isActive || isOverdue) && (
            <button
              onClick={() => onEnd(session)}
              className="flex-1 rounded-xl bg-[#ba1a1a] px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white transition hover:bg-[#93000a]"
            >
              End Rental
            </button>
          )}

          {canManage && isActive && (
            <button
              onClick={() => onOverdue(session)}
              className="flex-1 rounded-xl bg-[#735c00] px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
            >
              Mark Overdue
            </button>
          )}

          {canDelete && isCompleted && (
            <button
              onClick={() => onDelete(session.id)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-red-700 transition hover:bg-red-50"
            >
              <Trash2 size={16} />
              Delete
            </button>
          )}

          {isCompleted && (
            <div className="w-full rounded-xl bg-slate-100 px-4 py-2.5 sm:py-3 text-center text-xs sm:text-sm font-bold text-slate-700">
              Completed
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function ChecklistItem({
  checked,
  label,
}: {
  checked: boolean;
  label: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 text-xs sm:text-sm ${
        checked ? "text-green-700" : "text-[#ba1a1a]"
      }`}
    >
      {checked ? <CheckCircle size={15} /> : <XCircle size={15} />}
      <span>{label}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 text-xs sm:text-sm py-0.5">
      <span className="text-[#4d4635]">{label}</span>
      <span className="font-bold text-[#1b1c1a]">{value}</span>
    </div>
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
    <div className="rounded-2xl border border-[#d0c5af] bg-white p-4 sm:p-6 shadow-sm">
      <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#4d4635]">
        {label}
      </p>

      <p className={`mt-1 sm:mt-2 text-2xl sm:text-4xl font-extrabold ${color}`}>{value}</p>
    </div>
  );
}