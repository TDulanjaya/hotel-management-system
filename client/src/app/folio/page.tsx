"use client";

import { useEffect, useState } from "react";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SlidePanel from "@/components/ui/SlidePanel";
import { getAll, create, remove, update } from "@/lib/api/folioApi";
import { useAuthContext } from "@/context/AuthContext";
import { CheckCircle, Eye, FileText, Plus, Trash2 } from "lucide-react";

export default function FolioPage() {
  const { user } = useAuthContext();

  const [currentRole, setCurrentRole] = useState("");
  const [folios, setFolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [viewPanelOpen, setViewPanelOpen] = useState(false);
  const [selectedFolio, setSelectedFolio] = useState<any>(null);

  const [chargePanelOpen, setChargePanelOpen] = useState(false);
  const [formData, setFormData] = useState({
    guestName: "",
    roomNumber: "",
    reservationId: "",
    description: "",
    amount: 0,
    category: "Room",
    status: "OPEN",
  });

  const canManage =
    currentRole === "OWNER" ||
    currentRole === "MANAGER" ||
    currentRole === "RECEPTIONIST";

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAll();
      setFolios(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to load folios.");
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

  const handleOpenView = (folio: any) => {
    setSelectedFolio(folio);
    setViewPanelOpen(true);
  };

  const handleOpenCharge = () => {
    setFormData({
      guestName: "",
      roomNumber: "",
      reservationId: "",
      description: "",
      amount: 0,
      category: "Room",
      status: "OPEN",
    });
    setError("");
    setChargePanelOpen(true);
  };

  const handleChargeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.guestName || !formData.roomNumber || !formData.description) {
      setError("Guest name, room number and description are required.");
      return;
    }

    if (Number(formData.amount) <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        guestName: formData.guestName,
        roomNumber: formData.roomNumber,
        reservationId: formData.reservationId,
        totalAmount: Number(formData.amount),
        status: formData.status,
        lines: [
          {
            description: formData.description,
            amount: Number(formData.amount),
            category: formData.category,
            date: new Date().toISOString(),
          },
        ],
      };

      await create(payload);
      setChargePanelOpen(false);
      await fetchData();
      alert("Folio charge created successfully.");
    } catch (err: any) {
      setError(err.message || "Failed to add charge.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this folio?")) return;

    try {
      await remove(id);
      setFolios((prev) => prev.filter((folio) => folio.id !== id));
      alert("Folio deleted successfully.");
    } catch (err: any) {
      alert(err.message || "Failed to delete folio.");
    }
  };

  const handleCloseFolio = async (folio: any) => {
    if (!confirm("Mark this folio as CLOSED?")) return;

    try {
      await update(folio.id, {
        ...folio,
        status: "CLOSED",
      });

      await fetchData();
      alert("Folio closed successfully.");
    } catch (err: any) {
      alert(err.message || "Failed to close folio.");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "RECEPTIONIST"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Folio Module
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Guest Folios
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Manage guest charges, room bills, line items and folio status.
              </p>
            </div>

            {canManage && (
              <button
                onClick={handleOpenCharge}
                className="flex items-center gap-2 rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
              >
                <Plus size={18} />
                Add New Charge
              </button>
            )}
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard label="Total Folios" value={String(folios.length)} />

            <StatCard
              label="Open"
              value={String(folios.filter((f) => f.status === "OPEN").length)}
            />

            <StatCard
              label="Closed"
              value={String(
                folios.filter((f) => f.status === "CLOSED").length
              )}
            />

            <StatCard
              label="Total Revenue"
              value={`Rs ${folios.reduce(
                (sum, f) => sum + Number(f.totalAmount || 0),
                0
              )}`}
            />
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Folio Records</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                View guest folio totals and line item details.
              </p>
            </div>

            {loading ? (
              <div className="flex h-64 items-center justify-center text-lg font-bold text-[#806300]">
                Loading folios...
              </div>
            ) : error ? (
              <div className="p-6 font-bold text-red-600">{error}</div>
            ) : folios.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center">
                <FileText size={42} className="mb-4 text-[#735c00]" />

                <p className="mb-4 text-xl font-semibold text-gray-500">
                  No folios found
                </p>

                {canManage && (
                  <button
                    onClick={handleOpenCharge}
                    className="rounded-xl bg-[#806300] px-6 py-2 font-bold text-white hover:bg-[#6b5400]"
                  >
                    + Add New Charge
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="bg-[#f5eed9] text-[#4c4032]">
                    <tr>
                      <th className="p-4 font-bold">Folio ID</th>
                      <th className="p-4 font-bold">Guest</th>
                      <th className="p-4 font-bold">Room</th>
                      <th className="p-4 font-bold">Reservation</th>
                      <th className="p-4 font-bold">Total Amount</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 text-right font-bold">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#d9cfbd]">
                    {folios.map((folio: any) => (
                      <tr key={folio.id} className="hover:bg-[#fbf9f5]">
                        <td className="p-4 font-bold">
                          {folio.id?.substring(0, 8) || "-"}
                        </td>

                        <td className="p-4 font-semibold">
                          {folio.guestName || "-"}
                        </td>

                        <td className="p-4">{folio.roomNumber || "-"}</td>

                        <td className="p-4">{folio.reservationId || "-"}</td>

                        <td className="p-4 font-bold">
                          Rs {Number(folio.totalAmount || 0)}
                        </td>

                        <td className="p-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              folio.status === "CLOSED"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {folio.status || "OPEN"}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenView(folio)}
                              className="flex items-center gap-1 rounded-lg border border-[#735c00] px-3 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
                            >
                              <Eye size={16} />
                              View
                            </button>

                            {canManage && folio.status !== "CLOSED" && (
                              <button
                                onClick={() => handleCloseFolio(folio)}
                                className="flex items-center gap-1 rounded-lg border border-green-200 px-3 py-2 text-sm font-bold text-green-700 transition hover:bg-green-50"
                              >
                                <CheckCircle size={16} />
                                Close
                              </button>
                            )}

                            {canManage && (
                              <button
                                onClick={() => handleDelete(folio.id)}
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
            open={viewPanelOpen}
            onClose={() => setViewPanelOpen(false)}
            title="Folio Line Items"
            subtitle="View all charges attached to this folio."
            icon={<FileText className="h-5 w-5" />}
          >
            {selectedFolio && (
              <div>
                <div className="mb-6 rounded-xl border border-[#d0c5af] bg-[#f8f5ef] p-4 text-sm font-semibold">
                  <p>Guest: {selectedFolio.guestName}</p>
                  <p>Room: {selectedFolio.roomNumber}</p>
                  <p>Total: Rs {selectedFolio.totalAmount}</p>
                  <p>Status: {selectedFolio.status}</p>
                </div>

                <div className="space-y-4">
                  {selectedFolio.lines && selectedFolio.lines.length > 0 ? (
                    selectedFolio.lines.map((line: any, idx: number) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-[#d0c5af] bg-white p-4"
                      >
                        <p className="font-bold">{line.description}</p>
                        <p className="mt-1 text-sm">Amount: Rs {line.amount}</p>
                        <p className="text-sm">Category: {line.category}</p>
                        <p className="text-sm">
                          Date:{" "}
                          {line.date
                            ? new Date(line.date).toLocaleString()
                            : "-"}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>No line items found.</p>
                  )}
                </div>
              </div>
            )}
          </SlidePanel>

          <SlidePanel
            open={chargePanelOpen}
            onClose={() => setChargePanelOpen(false)}
            title="Add New Charge"
            subtitle="Create a new guest folio charge."
            icon={<Plus className="h-5 w-5" />}
          >
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleChargeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold">Guest Name *</label>
                <input
                  required
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                  value={formData.guestName}
                  onChange={(e) =>
                    setFormData({ ...formData, guestName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold">Room Number *</label>
                <input
                  required
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                  value={formData.roomNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, roomNumber: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold">Reservation ID</label>
                <input
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                  value={formData.reservationId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reservationId: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold">
                  Description *
                </label>
                <input
                  required
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold">Amount *</label>
                <input
                  required
                  type="number"
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold">Category</label>
                <select
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option>Room</option>
                  <option>Restaurant</option>
                  <option>Parking</option>
                  <option>Room Service</option>
                  <option>Event</option>
                  <option>Other</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-[#806300] py-3 font-bold text-white hover:bg-[#6b5400] disabled:opacity-60"
              >
                {saving ? "Creating..." : "Create Charge"}
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