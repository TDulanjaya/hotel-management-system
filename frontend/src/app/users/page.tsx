"use client";

import { FormEvent, useState } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
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
  X,
  Shield,
} from "lucide-react";

type UserItem = {
  name: string;
  email: string;
  initials: string;
  role: string;
  roleColor: string;
  mfa: boolean;
  lastActive: string;
  active: boolean;
};

type PermissionType = "check" | "view" | "none";

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

const initialUsers: UserItem[] = [
  {
    name: "Sofia Moretti",
    email: "sofia.m@luxestay.com",
    initials: "SM",
    role: "Manager",
    roleColor: "bg-[#735c00]/10 text-[#735c00] border-[#735c00]/20",
    mfa: true,
    lastActive: "2 mins ago",
    active: true,
  },
  {
    name: "James Kinsley",
    email: "j.kinsley@luxestay.com",
    initials: "JK",
    role: "Receptionist",
    roleColor: "bg-[#565e74]/10 text-[#565e74] border-[#565e74]/20",
    mfa: false,
    lastActive: "1 hour ago",
    active: true,
  },
  {
    name: "Elena Belova",
    email: "e.belova@luxestay.com",
    initials: "EB",
    role: "Kitchen Staff",
    roleColor: "bg-[#e4e2de] text-[#4d4635] border-[#d0c5af]",
    mfa: true,
    lastActive: "3 days ago",
    active: false,
  },
];

const roles = [
  "Owner",
  "Manager",
  "Receptionist",
  "Waiter",
  "Kitchen",
  "Inventory",
  "Events",
  "Parking",
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

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleUserStatus = (index: number) => {
    setUsers((currentUsers) =>
      currentUsers.map((user, currentIndex) =>
        currentIndex === index ? { ...user, active: !user.active } : user
      )
    );
  };

  const handleCreateUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setModalOpen(false);
  };

  return (
    <ProtectedRoute allowedRoles={["owner", "manager"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="min-h-screen lg:ml-[280px]">
          <TopBar />

          <section className="mx-auto max-w-[1600px] space-y-10 p-8">
            <PageHeader onAddUser={() => setModalOpen(true)} />

            <StatsGrid />

            <UsersTable users={users} onToggleStatus={toggleUserStatus} />

            <PermissionsMatrix />
          </section>
        </main>

        {modalOpen && (
          <AddUserModal
            onClose={() => setModalOpen(false)}
            onSubmit={handleCreateUser}
          />
        )}
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

function PageHeader({ onAddUser }: { onAddUser: () => void }) {
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

        <button
          onClick={onAddUser}
          className="flex items-center gap-2 rounded-xl bg-[#735c00] px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] active:scale-95"
        >
          <UserPlus size={18} />
          Add New User
        </button>
      </div>
    </div>
  );
}

function StatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article
            key={stat.title}
            className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-start justify-between">
              <div
                className={`rounded-lg bg-[#735c00]/10 p-2 ${stat.color} ${
                  stat.pulse ? "security-pulse" : ""
                }`}
              >
                <Icon size={24} />
              </div>

              {stat.note && (
                <span className="rounded-full bg-green-50 px-2 py-1 text-xs text-green-600">
                  {stat.note}
                </span>
              )}
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
  onToggleStatus,
}: {
  users: UserItem[];
  onToggleStatus: (index: number) => void;
}) {
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
            {users.map((user, index) => (
              <tr
                key={user.email}
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
                      {user.initials}
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
                      user.roleColor
                    } ${user.active ? "" : "opacity-50"}`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="px-8 py-5 text-center">
                  {user.mfa ? (
                    <CheckCircle
                      size={22}
                      className={`mx-auto text-green-600 ${
                        user.active ? "" : "opacity-50"
                      }`}
                    />
                  ) : (
                    <Circle size={22} className="mx-auto text-[#4d4635]" />
                  )}
                </td>

                <td
                  className={`px-8 py-5 text-sm text-[#4d4635] ${
                    user.active ? "" : "opacity-50"
                  }`}
                >
                  {user.lastActive}
                </td>

                <td className="px-8 py-5">
                  <button
                    onClick={() => onToggleStatus(index)}
                    className={`relative h-6 w-11 rounded-full transition ${
                      user.active ? "bg-[#735c00]" : "bg-[#e4e2de]"
                    }`}
                  >
                    <span
                      className={`absolute top-[2px] h-5 w-5 rounded-full bg-white transition ${
                        user.active ? "left-[22px]" : "left-[2px]"
                      }`}
                    />
                  </button>
                </td>

                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 transition group-hover:opacity-100">
                    <button className="rounded-lg p-2 text-[#4d4635] hover:bg-[#efeeea]">
                      <Pencil size={18} />
                    </button>

                    <button className="rounded-lg p-2 text-[#4d4635] hover:bg-[#efeeea]">
                      <LockKeyhole size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[#d0c5af] p-6 text-[#4d4635]">
        <p className="text-sm">Showing 1 to 10 of 124 users</p>

        <div className="flex gap-2">
          <button
            disabled
            className="flex h-10 w-10 items-center justify-center rounded-lg opacity-30"
          >
            ‹
          </button>

          <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#735c00] font-bold text-white">
            1
          </button>

          <button className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-[#efeeea]">
            2
          </button>

          <button className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-[#efeeea]">
            3
          </button>

          <button className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-[#efeeea]">
            ›
          </button>
        </div>
      </div>
    </section>
  );
}

function PermissionsMatrix() {
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

function PermissionIcon({ type }: { type: PermissionType }) {
  if (type === "check") {
    return <CheckCircle size={22} className="mx-auto text-[#735c00]" />;
  }

  if (type === "view") {
    return <Eye size={22} className="mx-auto text-[#735c00]/50" />;
  }

  return <Minus size={22} className="mx-auto text-[#4d4635]/20" />;
}

function AddUserModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#131b2e]/60 p-4 backdrop-blur-sm">
      <div className="modal-pop w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#d0c5af] bg-[#f5f3ef] p-8">
          <div>
            <h2 className="text-2xl font-bold">Provision New Personnel</h2>
            <p className="mt-1 text-sm text-[#4d4635]">
              Assign secure credentials and access roles.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-[#efeeea]"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6 p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormInput
              label="Full Legal Name"
              placeholder="e.g. Marcus Aurelius"
            />

            <FormInput
              label="Work Email Address"
              type="email"
              placeholder="m.aurelius@luxestay.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#4d4635]">
              Primary Operational Role
            </label>

            <select className="w-full rounded-xl border border-[#d0c5af] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#d4af37]/40">
              <option>Select a role...</option>
              <option>Manager</option>
              <option>Receptionist</option>
              <option>Waiter</option>
              <option>Kitchen Staff</option>
              <option>Inventory Staff</option>
              <option>Event Coordinator</option>
              <option>Parking Staff</option>
              <option>Game Staff</option>
            </select>
          </div>

          <div className="space-y-4 rounded-2xl border border-[#735c00]/10 bg-[#735c00]/5 p-6">
            <h3 className="flex items-center gap-2 font-bold text-[#735c00]">
              <Shield size={20} />
              Security Provisions
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Enforce Multi-Factor Authentication</p>
                <p className="text-xs text-[#4d4635]">
                  Required for Manager and above roles.
                </p>
              </div>

              <button
                type="button"
                className="relative h-6 w-11 rounded-full bg-[#735c00]"
              >
                <span className="absolute left-[22px] top-[2px] h-5 w-5 rounded-full bg-white" />
              </button>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-[#7f7663] py-3 font-bold transition hover:bg-[#efeeea]"
            >
              Discard
            </button>

            <button
              type="submit"
              className="flex-[2] rounded-xl bg-[#735c00] py-3 font-bold text-white shadow-lg transition hover:scale-[1.01] active:scale-95"
            >
              Generate Invite Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormInput({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-[#4d4635]">{label}</label>

      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#d0c5af] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#d4af37]/40"
      />
    </div>
  );
}