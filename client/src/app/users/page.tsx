"use client";

type PermissionType = "check" | "view" | "none";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SlidePanel from "@/components/ui/SlidePanel";
import { Alert } from "@/components/ui";
import useSWR from "swr";
import {
  Search,
  Bell,
  Download,
  UserPlus,
  Users,
  ShieldCheck,
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
import { getUsers, deleteUser as apiDeleteUser, createUser, updateUser } from "@/lib/api/userApi";
import { getUser } from "@/utils/auth";

type UserItem = {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
};

const allRoles = [
  "OWNER",
  "MANAGER",
  "RECEPTIONIST",
  "WAITER",
  "ROOM_SERVICE",
  "COOK",
  "INVENTORY",
  "EVENTS",
  "PARKING",
  "GAME_STAFF",
];

function getAvailableRoles(creatorRole: string) {
  if (creatorRole === "OWNER") {
    return allRoles;
  }
  return allRoles.filter((role) => role !== "OWNER" && role !== "MANAGER");
}

function getRoleColor(role: string) {
  if (role === "OWNER" || role === "MANAGER") return "bg-[#735c00]/10 text-[#735c00] border-[#735c00]/20";
  if (role === "RECEPTIONIST") return "bg-[#565e74]/10 text-[#565e74] border-[#565e74]/20";
  return "bg-[#e4e2de] text-[#4d4635] border-[#d0c5af]";
}

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
}

export default function UsersPage() {
  const { data: rawUsers, mutate } = useSWR<UserItem[]>("/api/users");
  const users = useMemo(() => (Array.isArray(rawUsers) ? rawUsers : []), [rawUsers]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editItem, setEditItem] = useState<UserItem | null>(null);

  // Form states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [creatorRole, setCreatorRole] = useState("MANAGER");
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    active: true,
  });

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setCreatorRole(user.role || "MANAGER");
      }
    } catch {
    }
  }, []);

  useEffect(() => {
    const roles = getAvailableRoles(creatorRole);
    setAvailableRoles(roles);
    
    if (roles.length > 0 && !formData.role) {
      setFormData((prev) => ({ ...prev, role: roles[0] }));
    }
  }, [creatorRole]);

  const handleOpenAdd = () => {
    setEditItem(null);
    setError("");
    setFormData({
      name: "",
      email: "",
      password: "",
      role: availableRoles[0] || "RECEPTIONIST",
      active: true,
    });
    setPanelOpen(true);
  };

  const handleOpenEdit = (user: UserItem) => {
    setEditItem(user);
    setError("");
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || availableRoles[0] || "RECEPTIONIST",
      active: user.active ?? true,
    });
    setPanelOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.name || !formData.email || !formData.role) {
      setError("Name, email and role are required");
      setLoading(false);
      return;
    }

    if (!editItem && !formData.password) {
      setError("Password is required for new accounts");
      setLoading(false);
      return;
    }

    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        active: formData.active,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (editItem) {
        await updateUser(editItem.id, payload);
      } else {
        await createUser(payload);
      }

      setPanelOpen(false);
      setEditItem(null);
      mutate();
      setFormData({
        name: "",
        email: "",
        password: "",
        role: availableRoles[0] || "",
        active: true,
      });
    } catch (err: any) {
      setError(err.message || "Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="min-h-screen lg:ml-[280px]">
          <TopBar />

          <section className="mx-auto max-w-[1600px] space-y-6 sm:space-y-10 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col justify-between gap-4 sm:gap-6 xl:flex-row xl:items-end">
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold">Users & Roles</h1>
                <p className="mt-2 max-w-2xl text-sm sm:text-base text-[#4d4635]">
                  Manage personnel access across your luxury property. Assign granular
                  permissions to ensure operational security and efficiency.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <button className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#7f7663] px-6 py-3 text-sm font-bold transition hover:bg-[#efeeea]">
                  <Download size={18} />
                  Export Audit Log
                </button>

                <button
                  onClick={handleOpenAdd}
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#735c00] px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] active:scale-95"
                >
                  <UserPlus size={18} />
                  Add New User
                </button>
              </div>
            </div>

            <StatsGrid users={users} />
            <UsersTable 
              users={users} 
              onUserDeleted={() => mutate()} 
              onEditUser={handleOpenEdit}
            />
            <PermissionsMatrix />
          </section>
        </main>

        <SlidePanel 
          open={panelOpen} 
          onClose={() => setPanelOpen(false)} 
          title={editItem ? "Edit User Account" : "Add New User"} 
          subtitle={
            editItem 
              ? `Updating credentials & access for ${editItem.name}`
              : "Create a new staff account. Password will be hashed by the server."
          }
          icon={<UserPlus className="h-5 w-5 text-[#735c00]" />}
        >
          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}

          {creatorRole === "MANAGER" && (
            <Alert variant="warning" className="mb-6">
              As a Manager, you cannot create or edit Owner or Manager accounts.
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#4d4635]">
                Full Name *
              </label>
              <input
                required
                type="text"
                name="name"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#4d4635]">
                Email Address *
              </label>
              <input
                required
                type="email"
                name="email"
                placeholder="e.g. john@camelliareserve.com"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#4d4635]">
                Password {editItem ? "(Leave blank to keep current)" : "*"}
              </label>
              <input
                type="password"
                name="password"
                placeholder={editItem ? "•••••••• (unchanged)" : "Set a strong password"}
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 text-base"
              />
              <p className="mt-1 text-xs text-[#6d6251]">
                Password is sent once to the server and hashed with BCrypt. It will never be displayed.
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#4d4635]">
                Role *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 text-base font-semibold"
              >
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {editItem && (
              <div className="rounded-xl border border-[#d0c5af] bg-[#faf8f4] p-4">
                <label className="flex items-center gap-3 text-sm font-bold text-[#4d4635] cursor-pointer">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    className="h-4 w-4 rounded accent-[#735c00]"
                  />
                  Active Account Status
                </label>
                <p className="mt-1 text-xs text-[#6d6251] ml-7">
                  Inactive users cannot log into the hotel management portal.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-[#d0c5af]">
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="w-full sm:flex-1 rounded-xl border border-[#d0c5af] px-6 py-3.5 font-bold text-[#4d4635] transition hover:bg-[#ece9e2]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:flex-1 rounded-xl bg-[#735c00] px-6 py-3.5 font-bold text-white transition hover:bg-[#d4af37] disabled:opacity-50"
              >
                {loading ? "Saving..." : editItem ? "Update User" : "Create User"}
              </button>
            </div>
          </form>
        </SlidePanel>
      </div>
    </ProtectedRoute>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#d0c5af] bg-[#fbf9f5] pl-16 pr-4 sm:px-8">
      <div className="relative w-full max-w-xs sm:max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4d4635]"
        />

        <input
          type="text"
          placeholder="Search users or roles..."
          className="w-full rounded-xl border-none bg-[#efeeea] py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#d4af37]/40"
        />
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <button className="relative rounded-full p-2 text-[#4d4635] transition hover:bg-[#eae8e4]">
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ba1a1a]" />
        </button>

        <div className="hidden sm:block h-8 w-px bg-[#d0c5af]" />

        <div className="flex items-center gap-3">
          <div className="hidden text-right md:block">
            <p className="text-sm font-bold">Julian Sterling</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#4d4635]">
              General Manager
            </p>
          </div>

          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-[#d0c5af] bg-[#131b2e] text-xs sm:text-sm font-bold text-[#ffe088]">
            JS
          </div>
        </div>
      </div>
    </header>
  );
}


function StatsGrid({ users }: { users: UserItem[] }) {
  const totalRoles = new Set(users.map(u => u.role)).size;
  const systemUsers = users.length;

  const dynamicStats = [
    {
      title: "Total Staff",
      value: String(systemUsers),
      icon: Users,
      color: "text-[#735c00]",
    },
    {
      title: "Active Roles",
      value: String(totalRoles),
      icon: ShieldCheck,
      color: "text-[#565e74]",
    },
    {
      title: "MFA Adoption",
      value: "-",
      icon: KeyRound,
      color: "text-[#735c00]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      {dynamicStats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article
            key={stat.title}
            className="rounded-2xl border border-[#d0c5af] bg-white p-5 sm:p-6 shadow-sm"
          >
            <div className="mb-3 sm:mb-4 flex items-start justify-between">
              <div
                className={`rounded-lg bg-[#735c00]/10 p-2 ${stat.color}`}
              >
                <Icon size={22} />
              </div>
            </div>

            <p className="text-xs font-bold uppercase tracking-widest text-[#4d4635]">
              {stat.title}
            </p>

            <p className={`mt-1 text-2xl sm:text-4xl font-bold ${stat.color}`}>
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
  onUserDeleted,
  onEditUser,
}: {
  users: UserItem[];
  onUserDeleted?: () => void;
  onEditUser?: (user: UserItem) => void;
}) {
  const currentUser = getUser();

  const deleteUserRecord = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await apiDeleteUser(id);
      onUserDeleted?.();
      alert("User deleted successfully.");
    } catch (err: any) {
      alert(err.message || "Failed to delete user.");
    }
  };

  const canEdit = currentUser?.role === "OWNER" || currentUser?.role === "MANAGER";
  const canDelete = currentUser?.role === "OWNER";

  return (
    <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#d0c5af] bg-white/60 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold">Active Personnel</h2>

        <button className="rounded-lg p-2 text-[#4d4635] transition hover:bg-[#efeeea]">
          <Filter size={18} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
              <th className="px-4 sm:px-8 py-3.5 font-bold">Name</th>
              <th className="px-4 sm:px-8 py-3.5 font-bold">Role</th>
              <th className="px-4 sm:px-8 py-3.5 text-center font-bold">MFA Status</th>
              <th className="px-4 sm:px-8 py-3.5 font-bold">Last Active</th>
              <th className="px-4 sm:px-8 py-3.5 font-bold">Status</th>
              <th className="px-4 sm:px-8 py-3.5 text-right font-bold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#d0c5af]">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 sm:px-8 py-12 text-center text-[#4d4635]">
                  <p className="text-base sm:text-lg font-bold">No users found</p>
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
                  <td className="px-4 sm:px-8 py-4">
                    <div
                      className={`flex items-center gap-3 ${
                        user.active ? "" : "opacity-50"
                      }`}
                    >
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#735c00]/10 font-bold text-[#735c00] text-xs sm:text-sm">
                        {getInitials(user.name)}
                      </div>
  
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate">{user.name}</p>
                        <p className="text-xs text-[#4d4635] truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
  
                  <td className="px-4 sm:px-8 py-4">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                        getRoleColor(user.role)
                      } ${user.active ? "" : "opacity-50"}`}
                    >
                      {user.role}
                    </span>
                  </td>
  
                  <td className="px-4 sm:px-8 py-4 text-center">
                    <Circle size={18} className="mx-auto text-[#4d4635]" />
                  </td>
  
                  <td
                    className={`px-4 sm:px-8 py-4 text-sm text-[#4d4635] ${
                      user.active ? "" : "opacity-50"
                    }`}
                  >
                    -
                  </td>
  
                  <td className="px-4 sm:px-8 py-4">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      user.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </td>
  
                  <td className="px-4 sm:px-8 py-4 text-right">
                    <div className="flex justify-end gap-1 sm:gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition">
                      {!(currentUser?.role === "MANAGER" && (user.role === "OWNER" || user.role === "MANAGER")) && (
                        <>
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => onEditUser?.(user)}
                              className="rounded-lg p-1.5 sm:p-2 text-[#4d4635] hover:bg-[#efeeea]"
                            >
                              <Pencil size={16} />
                            </button>
                          )}

                          {canDelete && user.role !== "OWNER" && (
                            <button onClick={() => deleteUserRecord(user.id)} className="rounded-lg p-1.5 sm:p-2 text-red-600 hover:bg-red-50">
                              <Trash2 size={16} />
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
    </section>
  );
}

function PermissionsMatrix() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("OWNER");
  
  const roles = [
    "OWNER",
    "MANAGER",
    "RECEPTIONIST",
    "COOK",
    "WAITER",
    "ROOM_SERVICE",
    "INVENTORY",
    "EVENTS",
    "PARKING",
    "GAME_STAFF",
  ];

  const permissionRows: { module: string; permissions: PermissionType[] }[] = [
    { module: "Room Reservations",  permissions: ["check","check","check","none","none","none","none","none","none","none"] },
    { module: "Billing & Folios",   permissions: ["check","check","view","none","none","none","none","none","none","none"] },
    { module: "Users & Roles",      permissions: ["check","check","none","none","none","none","none","none","none","none"] },
    { module: "Reports",            permissions: ["check","check","none","none","none","none","none","none","none","none"] },
    { module: "Audit Logs",         permissions: ["check","check","none","none","none","none","none","none","none","none"] },
    { module: "System Settings",    permissions: ["check","view","none","none","none","none","none","none","none","none"] },
    { module: "Events & Venues",    permissions: ["check","check","none","none","none","none","none","check","none","none"] },
    { module: "Inventory Control",  permissions: ["check","check","none","none","none","none","check","none","none","none"] },
    { module: "Parking",            permissions: ["check","check","none","none","none","none","none","none","check","none"] },
    { module: "Restaurant Orders",  permissions: ["check","check","none","none","check","none","none","none","none","none"] },
    { module: "Kitchen Orders",     permissions: ["check","check","none","check","none","none","none","none","none","none"] },
    { module: "Room Service",       permissions: ["check","check","none","none","none","check","none","none","none","none"] },
    { module: "Games & Amenities",  permissions: ["check","check","none","none","none","none","none","none","none","check"] },
    { module: "Service Pricing",    permissions: ["check","check","none","none","none","none","none","none","none","none"] },
  ];

  const handleSavePermissions = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Permissions updated. Server integration pending.");
    setPanelOpen(false);
  };

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">Role Permissions Matrix</h2>

          <p className="mt-1 text-xs sm:text-sm text-[#4d4635]">
            Institutional luxury control mapping for all staff tiers.
          </p>
        </div>

        <button onClick={() => setPanelOpen(true)} className="w-full sm:w-auto rounded-xl border border-[#735c00] px-6 py-2.5 font-bold text-[#735c00] transition hover:bg-[#735c00]/5 text-sm sm:text-base">
          Edit All Roles
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="bg-[#131b2e] text-white">
                <th className="sticky left-0 z-10 bg-[#131b2e] px-4 sm:px-8 py-4 sm:py-6 text-xs font-bold uppercase tracking-[0.2em]">
                  Access Level / Module
                </th>

                {roles.map((role) => (
                  <th
                    key={role}
                    className="px-4 sm:px-6 py-4 sm:py-6 text-center text-xs font-bold whitespace-nowrap"
                  >
                    {role}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#d0c5af]">
              {permissionRows.map((row) => (
                <tr key={row.module}>
                  <td className="sticky left-0 bg-white px-4 sm:px-8 py-3.5 font-bold shadow-sm whitespace-nowrap text-sm">
                    {row.module}
                  </td>

                  {row.permissions.map((permission, index) => (
                    <td key={index} className="px-4 py-3.5 text-center">
                      <PermissionIcon type={permission} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        title="Edit Role Permissions"
        subtitle="Modify access levels for system modules."
        icon={<Shield className="h-5 w-5" />}
      >
        <form onSubmit={handleSavePermissions} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#4d4635]">Select Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 text-base"
            >
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-[#4d4635]">Module Access</h3>
            {permissionRows.map((row) => (
              <div key={row.module} className="flex items-center justify-between border-b border-[#d0c5af]/50 pb-3 gap-2">
                <span className="text-sm font-semibold">{row.module}</span>
                <select className="rounded-lg border border-[#d0c5af] bg-[#f5f3ef] p-2 text-xs sm:text-sm outline-none">
                  <option value="check">Full Access</option>
                  <option value="view">View Only</option>
                  <option value="none">No Access</option>
                </select>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              className="w-full sm:flex-1 rounded-xl border border-[#d0c5af] px-6 py-3.5 font-bold text-[#4d4635] transition hover:bg-[#ece9e2]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:flex-1 rounded-xl bg-[#735c00] px-6 py-3.5 font-bold text-white transition hover:bg-[#d4af37]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </SlidePanel>
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
