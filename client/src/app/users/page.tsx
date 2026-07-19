"use client";

type PermissionType = "check" | "view" | "none";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SlidePanel from "@/components/ui/SlidePanel";
import { Alert } from "@/components/ui";
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
import { getUsers, deleteUser as apiDeleteUser, createUser } from "@/lib/api/userApi";
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
  const [users, setUsers] = useState<UserItem[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);

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
  });

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadUsers();
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      await createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      setPanelOpen(false);
      loadUsers();
      setFormData({
        name: "",
        email: "",
        password: "",
        role: availableRoles[0] || "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to create user");
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

          <section className="mx-auto max-w-[1600px] space-y-10 p-8">
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
                  onClick={() => setPanelOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-[#735c00] px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] active:scale-95"
                >
                  <UserPlus size={18} />
                  Add New User
                </button>
              </div>
            </div>

            <StatsGrid users={users} />
            <UsersTable users={users} setUsers={setUsers} />
            <PermissionsMatrix />
          </section>
        </main>

        <SlidePanel 
          open={panelOpen} 
          onClose={() => setPanelOpen(false)} 
          title="Add New User" 
          subtitle="Create a new staff account. Password will be hashed by the server."
          icon={<UserPlus className="h-5 w-5" />}
        >
          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}

          {creatorRole === "MANAGER" && (
            <Alert variant="warning" className="mb-6">
              As a Manager, you cannot create Owner or Manager accounts.
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#4d4635]">
                Full Name
              </label>
              <input
                required
                type="text"
                name="name"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#4d4635]">
                Email Address
              </label>
              <input
                required
                type="email"
                name="email"
                placeholder="e.g. john@luxestay.com"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#4d4635]">
                Password
              </label>
              <input
                required
                type="password"
                name="password"
                placeholder="Set a strong password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
              />
              <p className="mt-1 text-xs text-[#6d6251]">
                Password is sent once to the server and hashed with BCrypt.
                It will never be displayed.
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#4d4635]">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
              >
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="flex-1 rounded-xl border border-[#d0c5af] px-8 py-4 font-bold text-[#4d4635] transition hover:bg-[#ece9e2]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-[#735c00] px-8 py-4 font-bold text-white transition hover:bg-[#d4af37]"
              >
                {loading ? "Creating..." : "Create User"}
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


function StatsGrid({ users }: { users: UserItem[] }) {
  const totalRoles = new Set(users.map(u => u.role)).size;
  const systemUsers = users.length;
  const protectedModules = 14;

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
      title: "Protected Modules",
      value: String(protectedModules),
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
  const currentUser = getUser();

  useEffect(() => {
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
  const canDelete = currentUser?.role === "OWNER";

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
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("OWNER");
  
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

  const permissionRows: { module: string; permissions: PermissionType[] }[] = [
    { module: "Room Reservations",  permissions: ["check","check","check","none","none","none","none","none","none"] },
    { module: "Billing & Folios",   permissions: ["check","check","view","none","none","none","none","none","none"] },
    { module: "Users & Roles",      permissions: ["check","check","none","none","none","none","none","none","none"] },
    { module: "Reports",            permissions: ["check","check","none","none","none","none","none","none","none"] },
    { module: "Audit Logs",         permissions: ["check","check","none","none","none","none","none","none","none"] },
    { module: "System Settings",    permissions: ["check","view","none","none","none","none","none","none","none"] },
    { module: "Events & Venues",    permissions: ["check","check","none","none","none","none","check","none","none"] },
    { module: "Inventory Control",  permissions: ["check","check","none","none","view","check","none","none","none"] },
    { module: "Parking",            permissions: ["check","check","none","none","none","none","none","check","none"] },
    { module: "Restaurant Orders",  permissions: ["check","check","none","check","none","none","none","none","none"] },
    { module: "Kitchen Orders",     permissions: ["check","check","none","none","check","none","none","none","none"] },
    { module: "Room Service",       permissions: ["check","check","none","none","none","none","none","none","none"] },
    { module: "Games & Amenities",  permissions: ["check","check","none","none","none","none","none","none","check"] },
    { module: "Service Pricing",    permissions: ["check","check","none","none","none","none","none","none","none"] },
  ];

  const handleSavePermissions = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Permissions updated. Server integration pending.");
    setPanelOpen(false);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-semibold">Role Permissions Matrix</h2>

          <p className="mt-1 text-sm text-[#4d4635]">
            Institutional luxury control mapping for all staff tiers.
          </p>
        </div>

        <button onClick={() => setPanelOpen(true)} className="rounded-xl border border-[#735c00] px-6 py-2 font-bold text-[#735c00] transition hover:bg-[#735c00]/5">
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

      <SlidePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        title="Edit Role Permissions"
        subtitle="Modify access levels for system modules."
        icon={<Shield className="h-5 w-5" />}
      >
        <form onSubmit={handleSavePermissions} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#4d4635]">Select Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
            >
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-[#4d4635]">Module Access</h3>
            {permissionRows.map((row) => (
              <div key={row.module} className="flex items-center justify-between border-b border-[#d0c5af]/50 pb-3">
                <span className="text-sm font-semibold">{row.module}</span>
                <select className="rounded-lg border border-[#d0c5af] bg-[#f5f3ef] p-2 text-sm outline-none">
                  <option value="check">Full Access</option>
                  <option value="view">View Only</option>
                  <option value="none">No Access</option>
                </select>
              </div>
            ))}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              className="flex-1 rounded-xl border border-[#d0c5af] px-8 py-4 font-bold text-[#4d4635] transition hover:bg-[#ece9e2]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-[#735c00] px-8 py-4 font-bold text-white transition hover:bg-[#d4af37]"
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
