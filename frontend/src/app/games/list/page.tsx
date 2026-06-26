"use client";

import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useEffect, useState } from "react";
import { getGameSessions } from "@/lib/api/gameApi";

function getStatusClass(status: string) {
  if (status === "AVAILABLE") {
    return "bg-green-100 text-green-700";
  }

  if (status === "ACTIVE") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-red-100 text-red-700";
}

export default function GamesListPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await getGameSessions();
        setSessions(data);
      } catch (err) {
        console.error("Failed to load sessions:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSessions();
  }, []);

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
                Games & Amenities List
              </h1>

              <p className="mt-2 text-[#4d4635]">
                All games, amenities, and recreation facilities will be listed
                here.
              </p>
            </div>

            <a
              href="/games/new-session"
              className="rounded-xl bg-[#735c00] px-6 py-3 text-center font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
            >
              + New Session
            </a>
          </div>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Available Facilities</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Manage hotel recreation items and game stations.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Game ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Hourly Rate</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-[#4d4635]">
                        <p className="text-lg font-bold">Loading games...</p>
                      </td>
                    </tr>
                  ) : sessions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-[#4d4635]">
                        <p className="text-lg font-bold">No games found</p>
                        <p className="mt-1 text-sm">Create a new game session to get started.</p>
                      </td>
                    </tr>
                  ) : (
                    sessions.map((game) => (
                      <tr key={game.id} className="transition hover:bg-[#fbf9f5]">
                        <td className="px-6 py-5 font-bold">{game.id.substring(game.id.length - 6).toUpperCase()}</td>

                        <td className="px-6 py-5 font-semibold">{game.gameName}</td>

                        <td className="px-6 py-5 text-[#4d4635]">
                          {game.gameType}
                        </td>

                        <td className="px-6 py-5">{game.location}</td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                              game.status
                            )}`}
                          >
                            {game.status}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-right font-bold">
                          Rs {game.hourlyRate}
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
