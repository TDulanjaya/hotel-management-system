"use client";
import { AuthUser, getUser } from "@/utils/auth";

import { useEffect, useState } from "react";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SlidePanel from "@/components/ui/SlidePanel";
import {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from "@/lib/api/paymentsApi";
import { CreditCard, Pencil, Plus, Trash2 } from "lucide-react";

export default function PaymentsPage() {
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

  const [formData, setFormData] = useState({
    guestName: "",
    roomNumber: "",
    referenceType: "Reservation",
    referenceId: "",
    amount: 0,
    method: "Cash",
    status: "PENDING",
    notes: "",
  });

  const canManage =
    currentRole === "OWNER" ||
    currentRole === "MANAGER" ||
    currentRole === "RECEPTIONIST";

  const canDelete = currentRole === "OWNER" || currentRole === "MANAGER";

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getPayments();
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to load payments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

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
      roomNumber: "",
      referenceType: "Reservation",
      referenceId: "",
      amount: 0,
      method: "Cash",
      status: "PENDING",
      notes: "",
    });
    setPanelOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditItem(item);
    setError("");

    setFormData({
      guestName: item.guestName || "",
      roomNumber: item.roomNumber || "",
      referenceType: item.referenceType || "Reservation",
      referenceId: item.referenceId || "",
      amount: Number(item.amount || 0),
      method: item.method || "Cash",
      status: item.status || "PENDING",
      notes: item.notes || "",
    });

    setPanelOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment?")) return;

    try {
      await deletePayment(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      alert("Payment deleted successfully.");
    } catch (err: any) {
      alert(err.message || "Failed to delete payment.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.guestName || Number(formData.amount) <= 0) {
      setError("Guest name is required and amount must be greater than 0.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        guestName: formData.guestName,
        roomNumber: formData.roomNumber,
        referenceType: formData.referenceType,
        referenceId: formData.referenceId,
        amount: Number(formData.amount),
        method: formData.method,
        status: formData.status,
        notes: formData.notes,
      };

      if (editItem) {
        await updatePayment(editItem.id, payload);
        alert("Payment updated successfully.");
      } else {
        await createPayment(payload);
        alert("Payment created successfully.");
      }

      setPanelOpen(false);
      await fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to save payment.");
    } finally {
      setSaving(false);
    }
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "RECEPTIONIST"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Payments Module
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Payments
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Manage guest payments, payment methods, references and payment
                status.
              </p>
            </div>

            {canManage && (
              <button
                onClick={handleOpenNew}
                className="flex items-center gap-2 rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
              >
                <Plus size={18} />
                Add Payment
              </button>
            )}
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard label="Total Payments" value={String(items.length)} />
            <StatCard
              label="Paid"
              value={String(items.filter((i) => i.status === "PAID").length)}
            />
            <StatCard
              label="Pending"
              value={String(items.filter((i) => i.status === "PENDING").length)}
            />
            <StatCard label="Total Amount" value={`Rs ${totalAmount}`} />
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Payment Records</h2>
              <p className="mt-1 text-sm text-[#4d4635]">
                View, create, edit and delete payment records.
              </p>
            </div>

            {loading ? (
              <div className="flex h-64 items-center justify-center text-lg font-bold text-[#806300]">
                Loading payments...
              </div>
            ) : error ? (
              <div className="p-6 font-bold text-red-600">{error}</div>
            ) : items.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center">
                <CreditCard size={42} className="mb-4 text-[#735c00]" />

                <p className="mb-4 text-xl font-semibold text-gray-500">
                  No payment records found
                </p>

                {canManage && (
                  <button
                    onClick={handleOpenNew}
                    className="rounded-xl bg-[#806300] px-6 py-2 font-bold text-white hover:bg-[#6b5400]"
                  >
                    + Add Payment
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px] text-left text-sm">
                  <thead className="bg-[#f5eed9] text-[#4c4032]">
                    <tr>
                      <th className="p-4 font-bold">Payment ID</th>
                      <th className="p-4 font-bold">Guest</th>
                      <th className="p-4 font-bold">Room</th>
                      <th className="p-4 font-bold">Type</th>
                      <th className="p-4 font-bold">Ref ID</th>
                      <th className="p-4 font-bold">Amount</th>
                      <th className="p-4 font-bold">Method</th>
                      <th className="p-4 font-bold">Status</th>
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
                          {item.guestName || "-"}
                        </td>

                        <td className="p-4">{item.roomNumber || "-"}</td>

                        <td className="p-4">{item.referenceType || "-"}</td>

                        <td className="p-4">{item.referenceId || "-"}</td>

                        <td className="p-4 font-bold">
                          Rs {Number(item.amount || 0)}
                        </td>

                        <td className="p-4">{item.method || "-"}</td>

                        <td className="p-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              item.status === "PAID"
                                ? "bg-green-100 text-green-700"
                                : item.status === "REFUNDED"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {item.status || "PENDING"}
                          </span>
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

          <SlidePanel
            open={panelOpen}
            onClose={() => setPanelOpen(false)}
            title={editItem ? "Edit Payment" : "Add Payment"}
            subtitle={
              editItem
                ? "Update selected payment details."
                : "Create a new guest payment record."
            }
            icon={<CreditCard className="h-5 w-5" />}
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
                label="Room Number"
                value={formData.roomNumber}
                onChange={(value) =>
                  setFormData({ ...formData, roomNumber: value })
                }
              />

              <div>
                <label className="block text-sm font-bold">
                  Reference Type
                </label>
                <select
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                  value={formData.referenceType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      referenceType: e.target.value,
                    })
                  }
                >
                  <option>Reservation</option>
                  <option>Restaurant</option>
                  <option>Parking</option>
                  <option>Room Service</option>
                  <option>Folio</option>
                  <option>Other</option>
                </select>
              </div>

              <InputField
                label="Reference ID"
                value={formData.referenceId}
                onChange={(value) =>
                  setFormData({ ...formData, referenceId: value })
                }
              />

              <InputField
                label="Amount *"
                type="number"
                value={String(formData.amount)}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    amount: parseFloat(value) || 0,
                  })
                }
                required
              />

              <div>
                <label className="block text-sm font-bold">Method</label>
                <select
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                  value={formData.method}
                  onChange={(e) =>
                    setFormData({ ...formData, method: e.target.value })
                  }
                >
                  <option>Cash</option>
                  <option>Card</option>
                  <option>Bank Transfer</option>
                  <option>Charge to Room</option>
                </select>
              </div>

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
                  <option>PAID</option>
                  <option>REFUNDED</option>
                </select>
              </div>

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
                {saving ? "Saving..." : "Save Payment"}
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