"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthUser, getUser, logout } from "@/utils/auth";

const allowedRoles = [
  "OWNER",
  "MANAGER",
  "RECEPTIONIST",
  "COOK",
  "INVENTORY",
  "WAITER",
  "EVENTS",
  "PARKING",
  "GAME_STAFF",
] as const;

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const { data: rawLogs } = useSWR<any[]>("/api/audit-logs");
  const activityLogs = useMemo(() => {
    if (!Array.isArray(rawLogs)) return [];
    return rawLogs.slice(0, 5).map((log) => ({
      action: log.action || "Action performed",
      module: log.module || "System",
      time: log.timestamp ? new Date(log.timestamp).toLocaleString() : "Recently",
      status: "Success",
    }));
  }, [rawLogs]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <ProtectedRoute allowedRoles={[...allowedRoles]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                System Settings
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Settings
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Manage your profile, account security, system preferences, and
                login session.
              </p>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white px-6 py-4 shadow-sm">
              <p className="text-sm font-bold text-[#4d4635]">Current Role</p>
              <p className="mt-1 text-xl font-extrabold capitalize text-[#735c00]">
                {user?.role?.replace("_", " ") || "Loading..."}
              </p>
            </div>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard label="Account Status" value="Active" />
            <StatCard label="Role" value={user?.role?.replace("_", " ") || "-"} />
            <StatCard label="Login Session" value="Valid" />
            <StatCard label="Security" value="Enabled" />
          </section>

          <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
            <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Profile Details</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Basic staff profile information.
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Full Name
                  </label>

                  <input
                    type="text"
                    disabled
                    value={user?.name || ""}
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Email Address
                  </label>

                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Assigned Role
                  </label>

                  <input
                    type="text"
                    disabled
                    value={user?.role || ""}
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Account Security</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Password and security configuration.
              </p>

              <div className="mt-6 space-y-5">
                <div className="rounded-xl bg-[#fbf9f5] p-4 border border-[#d0c5af]">
                  <p className="text-sm font-bold text-[#1b1c1a]">Password Management</p>
                  <p className="mt-1 text-xs text-[#4d4635]">Use the Forgot Password feature on the login screen to reset your password.</p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm xl:col-span-2">
              <h2 className="text-2xl font-bold">Recent Account Activity</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Latest actions recorded from the audit system.
              </p>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[800px] text-left">
                  <thead>
                    <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                      <th className="px-6 py-4">Action</th>
                      <th className="px-6 py-4">Module</th>
                      <th className="px-6 py-4">Time</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#d0c5af]">
                    {activityLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-sm text-[#4d4635]">
                          No recent account activity logs.
                        </td>
                      </tr>
                    ) : (
                      activityLogs.map((log, idx) => (
                        <tr key={idx} className="transition hover:bg-[#fbf9f5]">
                          <td className="px-6 py-5 font-bold">{log.action}</td>
                          <td className="px-6 py-5 text-[#4d4635]">{log.module}</td>
                          <td className="px-6 py-5 text-[#4d4635]">{log.time}</td>
                          <td className="px-6 py-5">
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-2xl border border-[#ba1a1a]/30 bg-[#ffdad6]/40 p-6 shadow-sm xl:col-span-2">
              <h2 className="text-2xl font-bold text-[#ba1a1a]">
                Logout Account
              </h2>

              <p className="mt-2 text-[#93000a]">
                This will remove your login session from this browser and return
                you to the login page.
              </p>

              <button
                onClick={handleLogout}
                className="mt-6 rounded-xl bg-[#ba1a1a] px-6 py-3 font-bold text-white transition hover:bg-[#93000a]"
              >
                Logout
              </button>
            </section>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-widest text-[#4d4635]">
        {label}
      </p>

      <p className="mt-2 text-3xl font-extrabold text-[#735c00]">{value}</p>
    </div>
  );
}
