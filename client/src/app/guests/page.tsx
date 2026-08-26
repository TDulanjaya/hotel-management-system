"use client";
import { AuthUser, getUser } from "@/utils/auth";

import { useEffect, useMemo, useState } from "react";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SlidePanel from "@/components/ui/SlidePanel";
import useSWR from "swr";
import { swrRawFetcher } from "@/lib/api/authApi";
import {
  createGuest,
  updateGuest,
  deleteGuest,
} from "@/lib/api/guestsApi";
import { Pencil, Plus, Trash2, Users } from "lucide-react";

export default function GuestsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    setUser(getUser());
  }, []);

  const [currentRole, setCurrentRole] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    nationality: "",
    idType: "Passport",
    idNumber: "",
    address: "",
    notes: "",
  });

  const canManage =
    currentRole === "OWNER" ||
    currentRole === "MANAGER" ||
    currentRole === "RECEPTIONIST";

  const canDelete = currentRole === "OWNER" || currentRole === "MANAGER";

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (user?.role) {
      setCurrentRole(user.role);
      return;
    }

    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setCurrentRole(parsedUser.role || "");
      }
    } catch {
      setCurrentRole("");
    }
  }, [user]);

  const swrKey = `/api/guests?page=${page}&size=${size}${debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ""}`;
  const { data: pageData, error: swrError, isLoading: pageLoading, mutate } = useSWR(swrKey, swrRawFetcher, {
    keepPreviousData: true,
  });

  const items = useMemo(() => {
    if (!pageData) return [];
    if (Array.isArray(pageData.content)) return pageData.content;
    if (Array.isArray(pageData)) return pageData;
    return [];
  }, [pageData]);

  const totalPages = pageData?.totalPages || 1;
  const totalElements = pageData?.totalElements || (Array.isArray(pageData) ? pageData.length : 0);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      nationality: "",
      idType: "Passport",
      idNumber: "",
      address: "",
      notes: "",
    });
  };

  const handleOpenNew = () => {
    setEditItem(null);
    setError("");
    resetForm();
    setPanelOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditItem(item);
    setError("");

    setFormData({
      name: item.name || "",
      email: item.email || "",
      phone: item.phone || "",
      nationality: item.nationality || "",
      idType: item.idType || "Passport",
      idNumber: item.idNumber || "",
      address: item.address || "",
      notes: item.notes || "",
    });

    setPanelOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this guest?")) return;

    try {
      await deleteGuest(id);
      mutate();
      alert("Guest deleted successfully.");
    } catch (err: any) {
      alert(err.message || "Failed to delete guest.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      setError("Name and email are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        nationality: formData.nationality,
        idType: formData.idType,
        idNumber: formData.idNumber,
        address: formData.address,
        notes: formData.notes,
      };

      if (editItem) {
        await updateGuest(editItem.id, payload);
        alert("Guest updated successfully.");
      } else {
        await createGuest(payload);
        alert("Guest created successfully.");
      }

      setPanelOpen(false);
      mutate();
    } catch (err: any) {
      setError(err.message || "Failed to save guest.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "RECEPTIONIST"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Guests Module
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Guests
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Manage guest profiles, contact information, identity details and
                notes.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <div className="flex w-full max-w-[420px] items-center gap-3 rounded-xl border border-[#d9cfbd] bg-white px-4 py-3 shadow-sm">
                <span className="text-xl">⌕</span>

                <input
                  type="text"
                  placeholder="Search by name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent outline-none placeholder:text-slate-500"
                />
              </div>

              {canManage && (
                <button
                  onClick={handleOpenNew}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
                >
                  <Plus size={18} />
                  Add Guest
                </button>
              )}
            </div>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard label="Total Guests" value={String(totalElements)} />
            <StatCard label="Loaded Records" value={String(items.length)} />
            <StatCard
              label="With Email"
              value={String(items.filter((i: any) => i.email).length)}
            />
            <StatCard
              label="With Phone"
              value={String(items.filter((i: any) => i.phone).length)}
            />
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Guest Records</h2>
              <p className="mt-1 text-sm text-[#4d4635]">
                View, create, edit and delete guest records.
              </p>
            </div>

            {pageLoading ? (
              <div className="flex h-64 items-center justify-center text-lg font-bold text-[#806300]">
                Loading guests...
              </div>
            ) : error ? (
              <div className="p-6 font-bold text-red-600">{error}</div>
            ) : items.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center">
                <Users size={42} className="mb-4 text-[#735c00]" />

                <p className="mb-4 text-xl font-semibold text-gray-500">
                  No guests found
                </p>

                {canManage && (
                  <button
                    onClick={handleOpenNew}
                    className="rounded-xl bg-[#806300] px-6 py-2 font-bold text-white hover:bg-[#6b5400]"
                  >
                    + Add Guest
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-left text-sm">
                  <thead className="bg-[#f5eed9] text-[#4c4032]">
                    <tr>
                      <th className="p-4 font-bold">Guest ID</th>
                      <th className="p-4 font-bold">Name</th>
                      <th className="p-4 font-bold">Email</th>
                      <th className="p-4 font-bold">Phone</th>
                      <th className="p-4 font-bold">Nationality</th>
                      <th className="p-4 font-bold">ID Type</th>
                      <th className="p-4 font-bold">ID Number</th>
                      <th className="p-4 text-right font-bold">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#d9cfbd]">
                    {items.map((item: any) => (
                      <tr key={item.id} className="hover:bg-[#fbf9f5]">
                        <td className="p-4 font-bold">
                          {item.id?.substring(0, 8) || "-"}
                        </td>

                        <td className="p-4 font-semibold">
                          {item.name || "-"}
                        </td>

                        <td className="p-4">{item.email || "-"}</td>
                        <td className="p-4">{item.phone || "-"}</td>
                        <td className="p-4">{item.nationality || "-"}</td>
                        <td className="p-4">{item.idType || "-"}</td>
                        <td className="p-4">{item.idNumber || "-"}</td>

                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            {canManage && (
                              <button
                                onClick={() => handleOpenEdit(item)}
                                className="flex items-center gap-1 rounded-lg border border-[#735c00] px-3 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
                              >
                                <Pencil size={16} />
                                Edit
                              </button>
                            )}

                            {canDelete && (
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50"
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {totalPages > 1 && (
            <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-[#d9cfbd] pt-6 md:flex-row">
              <p className="text-sm font-bold text-[#4c4032]">
                Showing {items.length} of {totalElements} guests
              </p>

              <div className="flex gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                  className="rounded border border-[#d0c5af] bg-white px-4 py-2 font-bold text-[#4d4635] hover:bg-slate-50 disabled:opacity-50"
                >
                  Prev
                </button>

                <span className="flex items-center px-4 font-bold text-[#735c00]">
                  Page {page + 1} of {totalPages}
                </span>

                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(page + 1)}
                  className="rounded border border-[#d0c5af] bg-white px-4 py-2 font-bold text-[#4d4635] hover:bg-slate-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          <SlidePanel
            open={panelOpen}
            onClose={() => setPanelOpen(false)}
            title={editItem ? "Edit Guest" : "Add Guest"}
            subtitle={
              editItem
                ? "Update selected guest details."
                : "Create a new guest profile."
            }
          >
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Name *"
                value={formData.name}
                onChange={(value) => setFormData({ ...formData, name: value })}
                required
              />

              <InputField
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(value) => setFormData({ ...formData, email: value })}
                required
              />

              <InputField
                label="Phone"
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: value })}
              />

              <InputField
                label="Nationality"
                value={formData.nationality}
                onChange={(value) =>
                  setFormData({ ...formData, nationality: value })
                }
              />

              <div>
                <label className="block text-sm font-bold">ID Type</label>
                <select
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                  value={formData.idType}
                  onChange={(e) =>
                    setFormData({ ...formData, idType: e.target.value })
                  }
                >
                  <option>Passport</option>
                  <option>NIC</option>
                  <option>Driving License</option>
                </select>
              </div>

              <InputField
                label="ID Number"
                value={formData.idNumber}
                onChange={(value) =>
                  setFormData({ ...formData, idNumber: value })
                }
              />

              <InputField
                label="Address"
                value={formData.address}
                onChange={(value) =>
                  setFormData({ ...formData, address: value })
                }
              />

              <div>
                <label className="block text-sm font-bold">Notes</label>
                <textarea
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-[#806300] py-3 font-bold text-white hover:bg-[#6b5400] disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Guest"}
              </button>
            </form>
          </SlidePanel>
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

function InputField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-bold">{label}</label>

      <input
        required={required}
        type={type}
        className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}