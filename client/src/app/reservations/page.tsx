"use client";
import { AuthUser, getUser } from "@/utils/auth";

import { useEffect, useState } from "react";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SlidePanel from "@/components/ui/SlidePanel";
import {
  getReservations,
  createReservation,
  updateReservation,
  deleteReservation,
} from "@/lib/api/reservationsApi";
import { CalendarCheck, Pencil, Plus, Trash2 } from "lucide-react";

export default function ReservationsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    setUser(getUser());
  }, []);

  
  const [currentRole, setCurrentRole] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [panelOpen, setPanelOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [formData, setFormData] = useState({
    guestName: "",
    guestId: "",
    roomNumber: "",
    checkIn: "",
    checkOut: "",
    adults: 1,
    children: 0,
    status: "PENDING",
    paymentStatus: "PENDING",
    totalAmount: 0,
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
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getReservations({
        page,
        size,
        search: debouncedSearch,
      });

      setItems(Array.isArray(data?.content) ? data.content : []);
      setTotalPages(data?.totalPages || 1);
      setTotalElements(data?.totalElements || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load reservations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, size, debouncedSearch]);

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

  const handleOpenNew = () => {
    setEditItem(null);
    setError("");

    setFormData({
      guestName: "",
      guestId: "",
      roomNumber: "",
      checkIn: "",
      checkOut: "",
      adults: 1,
      children: 0,
      status: "PENDING",
      paymentStatus: "PENDING",
      totalAmount: 0,
      notes: "",
    });

    setPanelOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditItem(item);
    setError("");

    setFormData({
      guestName: item.guestName || "",
      guestId: item.guestId || "",
      roomNumber: item.roomNumber || "",
      checkIn: item.checkIn || "",
      checkOut: item.checkOut || "",
      adults: Number(item.adults || 1),
      children: Number(item.children || 0),
      status: item.status || "PENDING",
      paymentStatus: item.paymentStatus || "PENDING",
      totalAmount: Number(item.totalAmount || 0),
      notes: item.notes || "",
    });

    setPanelOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this reservation?")) return;

    try {
      await deleteReservation(id);
      await fetchData();
      alert("Reservation deleted successfully.");
    } catch (err: any) {
      alert(err.message || "Failed to delete reservation.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.guestName ||
      !formData.guestId ||
      !formData.roomNumber ||
      !formData.checkIn ||
      !formData.checkOut
    ) {
      setError("Guest, room, check-in and check-out details are required.");
      return;
    }

    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        guestName: formData.guestName,
        guestId: formData.guestId,
        roomNumber: formData.roomNumber,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        adults: Number(formData.adults),
        children: Number(formData.children),
        status: formData.status,
        paymentStatus: formData.paymentStatus,
        totalAmount: Number(formData.totalAmount),
        notes: formData.notes,
      };

      if (editItem) {
        await updateReservation(editItem.id, payload);
        alert("Reservation updated successfully.");
      } else {
        await createReservation(payload);
        alert("Reservation created successfully.");
      }

      setPanelOpen(false);
      await fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to save reservation.");
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
                Reservations Module
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Reservations
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Manage guest reservations, stay dates, room allocation and
                payment status.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <div className="flex w-full max-w-[420px] items-center gap-3 rounded-xl border border-[#d9cfbd] bg-white px-4 py-3 shadow-sm">
                <span className="text-xl">⌕</span>

                <input
                  type="text"
                  placeholder="Search by guest, room, status..."
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
                  Add Reservation
                </button>
              )}
            </div>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard label="Total Reservations" value={String(totalElements)} />
            <StatCard
              label="Loaded Records"
              value={String(items.length)}
            />
            <StatCard
              label="Confirmed"
              value={String(items.filter((i) => i.status === "CONFIRMED").length)}
            />
            <StatCard
              label="Total Amount"
              value={`Rs ${items
                .reduce((sum, i) => sum + Number(i.totalAmount || 0), 0)
                .toLocaleString()}`}
            />
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Reservation Records</h2>
              <p className="mt-1 text-sm text-[#4d4635]">
                View, create, edit and delete reservation records.
              </p>
            </div>

            {loading ? (
              <div className="flex h-64 items-center justify-center text-lg font-bold text-[#806300]">
                Loading reservations...
              </div>
            ) : error ? (
              <div className="p-6 font-bold text-red-600">{error}</div>
            ) : items.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center">
                <CalendarCheck size={42} className="mb-4 text-[#735c00]" />

                <p className="mb-4 text-xl font-semibold text-gray-500">
                  No reservations found
                </p>

                {canManage && (
                  <button
                    onClick={handleOpenNew}
                    className="rounded-xl bg-[#806300] px-6 py-2 font-bold text-white hover:bg-[#6b5400]"
                  >
                    + Add Reservation
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] text-left text-sm">
                  <thead className="bg-[#f5eed9] text-[#4c4032]">
                    <tr>
                      <th className="p-4 font-bold">Reservation ID</th>
                      <th className="p-4 font-bold">Guest</th>
                      <th className="p-4 font-bold">Room</th>
                      <th className="p-4 font-bold">Check-in</th>
                      <th className="p-4 font-bold">Check-out</th>
                      <th className="p-4 font-bold">Guests</th>
                      <th className="p-4 font-bold">Amount</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold">Payment</th>
                      <th className="p-4 text-right font-bold">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#d9cfbd]">
                    {items.map((item: any) => (
                      <tr key={item.id} className="hover:bg-[#fbf9f5]">
                        <td className="p-4 font-bold">
                          {item.id?.substring(0, 8) || "-"}
                        </td>

                        <td className="p-4">
                          <p className="font-semibold">
                            {item.guestName || "-"}
                          </p>
                          <p className="text-xs text-[#6d6251]">
                            {item.guestId || "-"}
                          </p>
                        </td>

                        <td className="p-4">{item.roomNumber || "-"}</td>
                        <td className="p-4">{item.checkIn || "-"}</td>
                        <td className="p-4">{item.checkOut || "-"}</td>

                        <td className="p-4">
                          {item.adults || 0} Adult
                          {Number(item.adults || 0) > 1 ? "s" : ""},{" "}
                          {item.children || 0} Child
                          {Number(item.children || 0) !== 1 ? "ren" : ""}
                        </td>

                        <td className="p-4 font-bold">
                          Rs {Number(item.totalAmount || 0).toLocaleString()}
                        </td>

                        <td className="p-4">
                          <StatusBadge status={item.status || "PENDING"} />
                        </td>

                        <td className="p-4">
                          <PaymentBadge
                            status={item.paymentStatus || "PENDING"}
                          />
                        </td>

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
                Showing {items.length} of {totalElements} reservations
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
            title={editItem ? "Edit Reservation" : "Add Reservation"}
            subtitle={
              editItem
                ? "Update selected reservation details."
                : "Create a new guest reservation."
            }
          >
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Guest Name *"
                value={formData.guestName}
                onChange={(value) =>
                  setFormData({ ...formData, guestName: value })
                }
                required
              />

              <InputField
                label="Guest ID/Passport *"
                value={formData.guestId}
                onChange={(value) =>
                  setFormData({ ...formData, guestId: value })
                }
                required
              />

              <InputField
                label="Room Number *"
                value={formData.roomNumber}
                onChange={(value) =>
                  setFormData({ ...formData, roomNumber: value })
                }
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Check-in *"
                  type="date"
                  value={formData.checkIn}
                  onChange={(value) =>
                    setFormData({ ...formData, checkIn: value })
                  }
                  required
                />

                <InputField
                  label="Check-out *"
                  type="date"
                  value={formData.checkOut}
                  onChange={(value) =>
                    setFormData({ ...formData, checkOut: value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Adults"
                  type="number"
                  value={String(formData.adults)}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      adults: parseInt(value) || 1,
                    })
                  }
                />

                <InputField
                  label="Children"
                  type="number"
                  value={String(formData.children)}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      children: parseInt(value) || 0,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold">Status</label>
                  <select
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option>PENDING</option>
                    <option>CONFIRMED</option>
                    <option>CHECKED_IN</option>
                    <option>CHECKED_OUT</option>
                    <option>CANCELLED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold">
                    Payment Status
                  </label>
                  <select
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                    value={formData.paymentStatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentStatus: e.target.value,
                      })
                    }
                  >
                    <option>PENDING</option>
                    <option>PAID</option>
                    <option>PARTIAL</option>
                  </select>
                </div>
              </div>

              <InputField
                label="Total Amount"
                type="number"
                value={String(formData.totalAmount)}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    totalAmount: parseFloat(value) || 0,
                  })
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
                {saving ? "Saving..." : "Save Reservation"}
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

function StatusBadge({ status }: { status: string }) {
  const className =
    status === "CONFIRMED"
      ? "bg-green-100 text-green-700"
      : status === "CHECKED_IN"
      ? "bg-blue-100 text-blue-700"
      : status === "CHECKED_OUT"
      ? "bg-slate-100 text-slate-700"
      : status === "CANCELLED"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${className}`}>
      {status}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const className =
    status === "PAID"
      ? "bg-green-100 text-green-700"
      : status === "PARTIAL"
      ? "bg-blue-100 text-blue-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${className}`}>
      {status}
    </span>
  );
}