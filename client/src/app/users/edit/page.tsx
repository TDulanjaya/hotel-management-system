"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ArrowLeft, Save, UserCog } from "lucide-react";
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

function getAvailableRoles(currentRole: string) {
  if (currentRole === "OWNER") {
    return allRoles;
  }

  return allRoles.filter((role) => role !== "OWNER" && role !== "MANAGER");
}

export default function EditUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const [currentRole, setCurrentRole] = useState("MANAGER");
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

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
        const loggedUser = JSON.parse(userStr);
        setCurrentRole(loggedUser.role || "MANAGER");
        setAvailableRoles(getAvailableRoles(loggedUser.role || "MANAGER"));
      }
    } catch {
      setCurrentRole("MANAGER");
      setAvailableRoles(getAvailableRoles("MANAGER"));
    }
  }, []);

  useEffect(() => {
    async function loadUser() {
      if (!userId) {
        setError("User ID is missing.");
        setPageLoading(false);
        return;
      }

      try {
        const user = await getUserById(userId);

        setFormData({
          name: user.name || "",
          email: user.email || "",
          password: "",
          role: user.role || "RECEPTIONIST",
          active: user.active ?? true,
        });
      } catch (err: any) {
        setError(err.message || "Failed to load user.");
      } finally {
        setPageLoading(false);
      }
    }

    loadUser();
  }, [userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "active") {
      setFormData((prev) => ({
        ...prev,
        active: value === "true",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!userId) {
      setError("User ID is missing.");
      return;
    }

    if (!formData.name || !formData.email || !formData.role) {
      setError("Name, email and role are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await updateUser(userId, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        active: formData.active,
        password: formData.password.trim() ? formData.password : undefined,
      });

      alert("User updated successfully.");
      router.push("/users");
    } catch (err: any) {
      setError(err.message || "Failed to update user.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="min-h-screen lg:ml-[280px]">
          <section className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8 pt-16 sm:pt-20 lg:pt-8">
            <Link
              href="/users"
              className="mb-4 sm:mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#735c00] hover:underline"
            >
              <ArrowLeft size={18} />
              Back to Users
            </Link>

            <div className="rounded-2xl sm:rounded-3xl border border-[#d0c5af] bg-white p-5 sm:p-8 shadow-sm">
              <div className="mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-[#735c00]/10 text-[#735c00]">
                  <UserCog size={24} className="sm:w-7 sm:h-7" />
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">Edit User</h1>
                  <p className="mt-1 text-xs sm:text-sm text-[#4d4635]">
                    Update staff details, role, status or password.
                  </p>
                </div>
              </div>

              {pageLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#d4af37] border-t-transparent" />
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                      {error}
                    </div>
                  )}

                  {currentRole === "MANAGER" && (
                    <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-xs sm:text-sm text-yellow-800">
                      <strong>Note:</strong> Managers cannot update Owner or
                      Manager accounts.
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-[#4d4635]">
                        Full Name
                      </label>
                      <input
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 text-base outline-none focus:ring-2 focus:ring-[#d4af37]/30"
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
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 text-base outline-none focus:ring-2 focus:ring-[#d4af37]/30"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#4d4635]">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Leave empty to keep old password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 text-base outline-none focus:ring-2 focus:ring-[#d4af37]/30"
                      />
                      <p className="mt-1 text-xs text-[#6d6251]">
                        Leave this empty if you do not want to change password.
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
                        className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 text-base outline-none focus:ring-2 focus:ring-[#d4af37]/30"
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
                        value={String(formData.active)}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3 text-base outline-none focus:ring-2 focus:ring-[#d4af37]/30"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                      <Link
                        href="/users"
                        className="w-full sm:flex-1 rounded-xl border border-[#d0c5af] px-6 py-3.5 text-center font-bold text-[#4d4635] transition hover:bg-[#ece9e2]"
                      >
                        Cancel
                      </Link>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#735c00] px-6 py-3.5 font-bold text-white transition hover:bg-[#d4af37] disabled:opacity-60"
                      >
                        <Save size={18} />
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}