"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

const activityLogs = [
  {
    action: "Logged in",
    module: "Authentication",
    time: "Today, 09:15 AM",
    status: "Success",
  },
  {
    action: "Opened dashboard",
    module: "Dashboard",
    time: "Today, 09:17 AM",
    status: "Success",
  },
  {
    action: "Updated profile settings",
    module: "Settings",
    time: "Yesterday, 04:20 PM",
    status: "Success",
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

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
                Update basic staff profile information.
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Full Name
                  </label>

                  <input
                    type="text"
                    defaultValue={user?.name || ""}
                    placeholder="Staff name"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Email
                  </label>

                  <input
                    type="email"
                    defaultValue={user?.email || ""}
                    placeholder="staff@luxestay.com"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Role
                  </label>

                  <input
                    type="text"
                    value={user?.role?.replace("_", " ") || ""}
                    readOnly
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#eae8e4] px-4 py-3 font-bold capitalize text-[#735c00] outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Department
                  </label>

                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Administration</option>
                    <option>Front Office</option>
                    <option>Kitchen</option>
                    <option>Inventory</option>
                    <option>Restaurant</option>
                    <option>Events</option>
                    <option>Parking</option>
                    <option>Games & Amenities</option>
                  </select>
                </div>

                <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                  Save Profile
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Security</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Change password and protect your account.
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Current Password
                  </label>

                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    New Password
                  </label>

                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <button className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white">
                  Update Password
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm xl:col-span-2">
              <h2 className="text-2xl font-bold">System Preferences</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Control notification and system behavior preferences.
              </p>

              <div className="mt-6 grid gap-5 md:grid-cols-3">
                <PreferenceCard
                  title="Notifications"
                  text="Receive alerts for bookings, events, orders, payments, and system updates."
                />

                <PreferenceCard
                  title="Audit Logs"
                  text="Track account actions and important system changes."
                />

                <PreferenceCard
                  title="Role Based Access"
                  text="Current user access is controlled by assigned staff role."
                />

                <PreferenceCard
                  title="Payment Alerts"
                  text="Get notified when payments, refunds, or settlements need review."
                />

                <PreferenceCard
                  title="Inventory Alerts"
                  text="Receive warnings when stock items reach low or critical level."
                />

                <PreferenceCard
                  title="Event Reminders"
                  text="Receive reminders about upcoming event bookings and venue schedules."
                />
              </div>
            </section>

            <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm xl:col-span-2">
              <h2 className="text-2xl font-bold">Recent Account Activity</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Latest actions from this account.
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
                    {activityLogs.map((log) => (
                      <tr key={log.action} className="transition hover:bg-[#fbf9f5]">
                        <td className="px-6 py-5 font-bold">{log.action}</td>

                        <td className="px-6 py-5 text-[#4d4635]">
                          {log.module}
                        </td>

                        <td className="px-6 py-5 text-[#4d4635]">
                          {log.time}
                        </td>

                        <td className="px-6 py-5">
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
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

      <p className="mt-2 text-2xl font-extrabold capitalize text-[#735c00]">
        {value}
      </p>
    </div>
  );
}

function PreferenceCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="font-bold text-[#735c00]">{title}</h3>

        <label className="relative inline-flex cursor-pointer items-center">
          <input type="checkbox" className="peer sr-only" defaultChecked />
          <div className="peer h-6 w-11 rounded-full bg-[#d0c5af] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-[#735c00] peer-checked:after:translate-x-full" />
        </label>
      </div>

      <p className="text-sm leading-6 text-[#4d4635]">{text}</p>
    </div>
  );
}