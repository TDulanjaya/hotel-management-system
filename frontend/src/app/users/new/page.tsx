"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { createUser } from "@/lib/api/userApi";


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

export default function NewUserPage() {
  const router = useRouter();
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
      router.push("/users");
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
        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#735c00]">
              Add New User
            </h1>
            <p className="mt-2 text-[#4d4635]">
              Create a new staff account. Password will be hashed by the backend.
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
                <strong>Note:</strong> As a Manager, you cannot create Owner or
                Manager accounts.
              </div>
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
                  Password is sent once to the backend and hashed with BCrypt.
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
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-[#735c00] px-8 py-3 font-bold text-white transition hover:bg-[#d4af37]"
                >
                  {loading ? "Creating..." : "Create User"}
                </button>
                <Link
                  href="/users"
                  className="rounded-xl border border-[#d0c5af] px-8 py-3 font-bold text-[#4d4635] transition hover:bg-[#f5f3ef]"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}