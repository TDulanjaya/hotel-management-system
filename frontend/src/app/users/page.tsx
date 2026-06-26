"use client";

type PermissionType = "check" | "view" | "none";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  Search,
  Bell,
  Download,
  UserPlus,
  Users,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Filter,
  Pencil,
  LockKeyhole,
  CheckCircle,
  Circle,
  Minus,
  Eye,
  Shield,
  Trash2,
} from "lucide-react";
import { getUsers, deleteUser as apiDeleteUser } from "@/lib/api/userApi";
import { getUser, AuthUser } from "@/utils/auth";

type UserItem = {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
};

const stats = [
  {
    title: "Total Staff",
    value: "124",
    note: "+2 this week",
    icon: Users,
    color: "text-[#735c00]",
  },
  {
    title: "Active Roles",
    value: "9",
    icon: ShieldCheck,
    color: "text-[#565e74]",
  },
  {
    title: "Security Flags",
    value: "3",
    icon: ShieldAlert,
    color: "text-[#ba1a1a]",
    pulse: true,
  },
  {
    title: "MFA Adoption",
    value: "94%",
    icon: KeyRound,
    color: "text-[#735c00]",
  },
];



const roles = [
  "OWNER",
  "MANAGER",
  "RECEPTIONIST",
  "WAITER",
  "COOK",
  "INVENTORY",
  "EVENTS",
  "PARKING",
  "Game Staff",
];

const permissionRows: {
  module: string;
  permissions: PermissionType[];
}[] = [
  {
    module: "Room Reservations",
    permissions: [
      "check",
      "check",
      "check",
      "none",
      "none",
      "none",
      "check",
      "none",
      "none",
    ],
  },
  {
    module: "Billing & Folios",
    permissions: [
      "check",
      "check",
      "view",
      "none",
      "none",
      "none",
      "none",
      "none",
      "none",
    ],
  },
  {
    module: "Inventory Control",
    permissions: [
      "check",
      "check",
      "none",
      "none",
      "view",
      "check",
      "none",
      "none",
      "none",
    ],
  },
  {
    module: "System Settings",
    permissions: [
      "check",
      "view",
      "none",
      "none",
      "none",
      "none",
      "none",
      "none",
      "none",
    ],
  },
];

function getRoleColor(role: string) {
  if (role === "OWNER" || role === "MANAGER") return "bg-[#735c00]/10 text-[#735c00] border-[#735c00]/20";
  if (role === "RECEPTIONIST") return "bg-[#565e74]/10 text-[#565e74] border-[#565e74]/20";
  return "bg-[#e4e2de] text-[#4d4635] border-[#d0c5af]";
}

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadUsers();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="min-h-screen lg:ml-[280px]">
          <TopBar />

          <section className="mx-auto max-w-[1600px] space-y-10 p-8">
            <PageHeader />

            <StatsGrid userCount={users.length} />
            <UsersTable users={users} setUsers={setUsers} />
            <PermissionsMatrix />
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#d0c5af] bg-[#fbf9f5] px-8">
      <div className="relative w-full max-w-md">
        <Search
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4d4635]"
        />

        <input
          type="text"
          placeholder="Search users, roles or permissions..."
          className="w-full rounded-xl border-none bg-[#efeeea] py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#d4af37]/40"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative rounded-full p-2 text-[#4d4635] transition hover:bg-[#eae8e4]">
          <Bell size={22} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ba1a1a]" />
        </button>

        <div className="h-8 w-px bg-[#d0c5af]" />

        <div className="flex items-center gap-3">
          <div className="hidden text-right md:block">
            <p className="text-sm font-bold">Julian Sterling</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#4d4635]">
              General Manager
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d0c5af] bg-[#131b2e] font-bold text-[#ffe088]">
            JS
          </div>
        </div>
      </div>
    </header>
  );
}

function PageHeader() {
  return (
    <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
      <div>
        <h1 className="text-4xl font-bold">Users & Roles</h1>

        <p className="mt-2 max-w-2xl text-[#4d4635]">
          Manage personnel access across your luxury property. Assign granular
          permissions to ensure operational security and efficiency.
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <button className="flex items-center gap-2 rounded-xl border border-[#7f7663] px-6 py-3 text-sm font-bold transition hover:bg-[#efeeea]">
          <Download size={18} />
          Export Audit Log
        </button>

        <Link
          href="/users/new"
          className="flex items-center gap-2 rounded-xl bg-[#735c00] px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] active:scale-95"
        >
          <UserPlus size={18} />
          Add New User
        </Link>
      </div>
    </div>
  );
}

function StatsGrid({ userCount }: { userCount: number }) {
  const dynamicStats = [
    {
      title: "Total Staff",
      value: String(userCount),
      icon: Users,
      color: "text-[#735c00]",
    },
    {
      title: "Active Roles",
      value: "9",
      icon: ShieldCheck,
      color: "text-[#565e74]",
    },
    {
      title: "Security Flags",
      value: "0",
      icon: ShieldAlert,
      color: "text-[#ba1a1a]",
    },
    {
      title: "MFA Adoption",
      value: "-",
      icon: KeyRound,
      color: "text-[#735c00]",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
      {dynamicStats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article
            key={stat.title}
            className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-start justify-between">
              <div
                className={`rounded-lg bg-[#735c00]/10 p-2 ${stat.color}`}
              >
                <Icon size={24} />
              </div>
            </div>

            <p className="text-xs font-bold uppercase tracking-widest text-[#4d4635]">
              {stat.title}
            </p>

            <p className={`mt-1 text-4xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </article>
        );
      })}
    </div>
  );
}

function UsersTable({
  users,
  setUsers,
}: {
  users: UserItem[];
  setUsers: React.Dispatch<React.SetStateAction<UserItem[]>>;
}) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setCurrentUser(getUser());
  }, []);

  const deleteUserRecord = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await apiDeleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      alert("User deleted successfully.");
    } catch (err: any) {
      alert(err.message || "Failed to delete user.");
    }
  };

  const canEdit = currentUser?.role === "OWNER" || currentUser?.role === "MANAGER";
  const canDelete = currentUser?.role === "OWNER" || currentUser?.role === "MANAGER";

  return (
    <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#d0c5af] bg-white/60 p-6">
        <h2 className="text-xl font-semibold">Active Personnel</h2>

        <button className="rounded-lg p-2 text-[#4d4635] transition hover:bg-[#efeeea]">
          <Filter size={20} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
              <th className="px-8 py-4 font-bold">Name</th>
              <th className="px-8 py-4 font-bold">Role</th>
              <th className="px-8 py-4 text-center font-bold">MFA Status</th>
              <th className="px-8 py-4 font-bold">Last Active</th>
              <th className="px-8 py-4 font-bold">Status</th>
              <th className="px-8 py-4 text-right font-bold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#d0c5af]">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-12 text-center text-[#4d4635]">
                  <p className="text-lg font-bold">No users found</p>
                  <p className="mt-1 text-sm">Add a new user to grant system access.</p>
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={user.id || user.email}
                  className={`group border-l-4 transition hover:bg-[#fbf9f5] ${
                    user.active ? "border-l-[#735c00]" : "border-l-[#ba1a1a]"
                  }`}
                >
                  <td className="px-8 py-5">
                    <div
                      className={`flex items-center gap-3 ${
                        user.active ? "" : "opacity-50"
                      }`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#735c00]/10 font-bold text-[#735c00]">
                        {getInitials(user.name)}
                      </div>
  
                      <div>
                        <p className="text-sm font-bold">{user.name}</p>
                        <p className="text-xs text-[#4d4635]">{user.email}</p>
                      </div>
                    </div>
                  </td>
  
                  <td className="px-8 py-5">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${
                        getRoleColor(user.role)
                      } ${user.active ? "" : "opacity-50"}`}
                    >
                      {user.role}
                    </span>
                  </td>
  
                  <td className="px-8 py-5 text-center">
                    <Circle size={22} className="mx-auto text-[#4d4635]" />
                  </td>
  
                  <td
                    className={`px-8 py-5 text-sm text-[#4d4635] ${
                      user.active ? "" : "opacity-50"
                    }`}
                  >
                    -
                  </td>
  
                  <td className="px-8 py-5">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                      user.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </td>
  
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 transition group-hover:opacity-100">
                      {!(currentUser?.role === "MANAGER" && (user.role === "OWNER" || user.role === "MANAGER")) && (
                        <>
                          {canEdit && (
                            <Link href={`/users/edit?id=${user.id}`} className="rounded-lg p-2 text-[#4d4635] hover:bg-[#efeeea]">
                              <Pencil size={18} />
                            </Link>
                          )}

                          {canDelete && user.role !== "OWNER" && (
                            <button onClick={() => deleteUserRecord(user.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                              <Trash2 size={18} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[#d0c5af] p-6 text-[#4d4635]">
        <p className="text-sm">Showing {users.length} users</p>
      </div>
    </section>
  );
}

function PermissionsMatrix() {
  const roles = [
    "OWNER",
    "MANAGER",
    "RECEPTIONIST",
    "WAITER",
    "COOK",
    "INVENTORY",
    "EVENTS",
    "PARKING",
    "GAME_STAFF",
  ];



  const permissionRows: {
    module: string;
    permissions: PermissionType[];
  }[] = [
    {
      module: "Room Reservations",
      permissions: [
        "check", "check", "check", "none", "none", "none", "check", "none", "none",
      ],
    },
    {
      module: "Billing & Folios",
      permissions: [
        "check", "check", "view", "none", "none", "none", "none", "none", "none",
      ],
    },
    {
      module: "Inventory Control",
      permissions: [
        "check", "check", "none", "none", "view", "check", "none", "none", "none",
      ],
    },
    {
      module: "System Settings",
      permissions: [
        "check", "view", "none", "none", "none", "none", "none", "none", "none",
      ],
    },
  ];
  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-semibold">Role Permissions Matrix</h2>

          <p className="mt-1 text-sm text-[#4d4635]">
            Institutional luxury control mapping for all staff tiers.
          </p>
        </div>

        <button className="rounded-xl border border-[#735c00] px-6 py-2 font-bold text-[#735c00] transition hover:bg-[#735c00]/5">
          Edit All Roles
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#131b2e] text-white">
                <th className="sticky left-0 z-10 bg-[#131b2e] px-8 py-6 text-xs font-bold uppercase tracking-[0.2em]">
                  Access Level / Module
                </th>

                {roles.map((role) => (
                  <th
                    key={role}
                    className="px-6 py-6 text-center text-xs font-bold"
                  >
                    {role}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#d0c5af]">
              {permissionRows.map((row) => (
                <tr key={row.module}>
                  <td className="sticky left-0 bg-white px-8 py-4 font-bold shadow-sm">
                    {row.module}
                  </td>

                  {row.permissions.map((permission, index) => (
                    <td key={index} className="px-4 text-center">
                      <PermissionIcon type={permission} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function PermissionIcon({ type }: { type: "check" | "view" | "none" }) {
  if (type === "check") {
    return <CheckCircle size={22} className="mx-auto text-[#735c00]" />;
  }

  if (type === "view") {
    return <Eye size={22} className="mx-auto text-[#735c00]/50" />;
  }

  return <Minus size={22} className="mx-auto text-[#4d4635]/20" />;
}