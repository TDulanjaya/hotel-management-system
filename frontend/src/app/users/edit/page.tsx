"use client";
import { useSearchParams } from "next/navigation";


import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getUserById, updateUser } from "@/lib/api/userApi";

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

export default function EditUserPage() {
  const searchParams = useSearchParams();
  const rawId = searchParams.get("id");

  const router = useRouter();
  const params = useParams();
  const id = rawId as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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
  }, [creatorRole]);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getUserById(id);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          password: "", 
          role: data.role || "",
          active: data.active !== false
        });
      } catch (err: any) {
        setError("Failed to load user details.");
      } finally {
        setFetching(false);
      }
    }
    loadUser();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let value: any = e.target.value;
    if (e.target.name === "active") {
      value = e.target.value === "true";
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.name || !formData.email || !formData.role) {
      setError("Name, email, and role are required");
      setLoading(false);
      return;
    }

    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        active: formData.active
      };
      if (formData.password) {
        updateData.password = formData.password;
      }
      
      await updateUser(id, updateData);
      router.push("/users");
    } catch (err: any) {
      setError(err.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />
        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#735c00]">
              Edit User
            </h1>
            <p className="mt-2 text-[#4d4635]">
              Update staff account details.
            </p>
          </div>

          <div className="max-w-2xl rounded-2xl border border-[#d0c5af] bg-white p-8 shadow-sm">
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                {error}
              </div>
            )}

            {creatorRole === "MANAGER" && (
              <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                <strong>Note:</strong> As a Manager, you cannot assign Owner or
                Manager roles.
              </div>
            )}

            {fetching ? (
              <p>Loading user details...</p>
            ) : (
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
                    Password (Optional)
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Leave blank to keep current password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                  />
                  <p className="mt-1 text-xs text-[#6d6251]">
                    If entered, password will be hashed with BCrypt.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                  <div>
                    <label className="block text-sm font-bold text-[#4d4635]">
                      Status
                    </label>
                    <select
                      name="active"
                      value={formData.active.toString()}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive (Deactivated)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-[#735c00] px-8 py-3 font-bold text-white transition hover:bg-[#d4af37]"
                  >
                    {loading ? "Updating..." : "Update User"}
                  </button>
                  <Link
                    href="/users"
                    className="rounded-xl border border-[#d0c5af] px-8 py-3 font-bold text-[#4d4635] transition hover:bg-[#f5f3ef]"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
