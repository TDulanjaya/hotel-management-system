"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthUser, getUser } from "@/utils/auth";
import SlidePanel from "@/components/ui/SlidePanel";
import useSWR from "swr";
import { getAll, create, remove, update } from "@/lib/api/folioApi";
import { CheckCircle, ExternalLink, Eye, FileText, Lock, Plus, Trash2 } from "lucide-react";

export default function FolioPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const { data: rawFolios, mutate, isLoading: isSwrLoading, error: swrError } = useSWR<any[]>("/api/folios");
  const folios = useMemo(() => (Array.isArray(rawFolios) ? rawFolios : []), [rawFolios]);
  const loading = !rawFolios && isSwrLoading;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [viewPanelOpen, setViewPanelOpen] = useState(false);
  const [selectedFolio, setSelectedFolio] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredFolios = useMemo(() => {
    return folios.filter((f: any) => {
      const matchesSearch =
        !searchQuery ||
        f.guestName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.roomNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.reservationId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.id?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        f.status?.toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [folios, searchQuery, statusFilter]);

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
    user?.role === "OWNER" ||
    user?.role === "MANAGER" ||
    user?.role === "RECEPTIONIST";

  useEffect(() => {
    setUser(getUser());
  }, []);

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
            date: new Date().toISOString().split("T")[0],
          },
        ],
      };

      await create(payload);
      setChargePanelOpen(false);
      mutate();
    } catch (err: any) {
      setError(err.message || "Failed to add charge.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (folio: any) => {
    if (folio.status === "CLOSED") {
      alert("Settled folios cannot be deleted to preserve financial audit records.");
      return;
    }
    if (!confirm(`Are you sure you want to delete the folio for ${folio.guestName || "this guest"}?`)) return;

    try {
      await remove(folio.id);
      mutate();
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

      mutate();
    } catch (err: any) {
      alert(err.message || "Failed to close folio.");
    }
  };

  const totalRevenue = folios.reduce(
    (sum, f) => sum + Number(f.totalAmount || 0),
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
              value={`Rs ${totalRevenue.toLocaleString()}`}
            />
          </section>

          <section className="mb-8 rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-3">
              <input
                type="text"
                placeholder="Search by guest name, room, reservation ID..."
                value={searchQuery ?? ""}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
              </select>

              {(searchQuery || statusFilter !== "ALL") ? (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("ALL");
                  }}
                  className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00]/10"
                >
                  Clear Filters
                </button>
              ) : (
                <div className="flex items-center justify-center text-sm font-medium text-[#735c00]">
                  Showing {filteredFolios.length} of {folios.length} folios
                </div>
              )}
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-2 border-b border-[#d0c5af] p-6 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-bold">Folio Records</h2>
                <p className="mt-1 text-sm text-[#4d4635]">
                  View guest folio totals and line item details.
                </p>
              </div>
              <span className="text-sm font-bold text-[#735c00]">
                {filteredFolios.length} folio{filteredFolios.length === 1 ? "" : "s"}
              </span>
            </div>

            {loading ? (
              <div className="flex h-64 items-center justify-center text-lg font-bold text-[#806300]">
                Loading folios...
              </div>
            ) : error ? (
              <div className="p-6 font-bold text-red-600">{error}</div>
            ) : filteredFolios.length === 0 ? (
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
              <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-[#d0c5af] bg-[#f5eed9]/70 text-[#4c4032]">
                    <tr>
                      <th className="px-3.5 py-3.5 text-center font-bold uppercase tracking-wider text-[11px] whitespace-nowrap">Folio ID</th>
                      <th className="px-3.5 py-3.5 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap">Guest</th>
                      <th className="px-3.5 py-3.5 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap">Room / Location</th>
                      <th className="px-3.5 py-3.5 text-center font-bold uppercase tracking-wider text-[11px] whitespace-nowrap">Reservation</th>
                      <th className="px-3.5 py-3.5 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap">Total Amount</th>
                      <th className="px-3.5 py-3.5 text-center font-bold uppercase tracking-wider text-[11px] whitespace-nowrap">Status</th>
                      <th className="px-3.5 py-3.5 text-center font-bold uppercase tracking-wider text-[11px] whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#e8e2d5]">
                    {filteredFolios.map((folio: any) => (
                      <tr key={folio.id} className="transition-colors hover:bg-[#faf7f0]">
                        <td className="px-3.5 py-3.5 whitespace-nowrap text-center">
                          <span className="font-mono text-xs font-bold text-[#735c00] bg-[#735c00]/10 border border-[#735c00]/20 px-2 py-0.5 rounded-md">
                            #{folio.id ? folio.id.slice(-6).toUpperCase() : "N/A"}
                          </span>
                        </td>

                        <td className="px-3.5 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#735c00]/10 text-xs font-bold text-[#735c00] shrink-0">
                              {folio.guestName ? folio.guestName.charAt(0) : "G"}
                            </div>
                            <div>
                              <p className="font-bold text-[#1b1c1a] text-sm leading-tight">{folio.guestName || "Unknown Guest"}</p>
                              <p className="text-[11px] text-[#735c00]/70">
                                {folio.lines?.length || 0} charge item{folio.lines?.length === 1 ? "" : "s"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-3.5 py-3.5 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-md bg-[#f5f3ef] border border-[#d0c5af]/60 px-2 py-0.5 text-xs font-semibold text-[#4d4635]">
                            {folio.roomNumber?.startsWith("Venue") ? folio.roomNumber : `Room ${folio.roomNumber || "-"}`}
                          </span>
                        </td>

                        <td className="px-3.5 py-3.5 whitespace-nowrap text-center">
                          {folio.reservationId ? (
                            <span className="font-mono text-xs font-medium text-[#735c00] bg-[#d4af37]/15 border border-[#d4af37]/30 px-2 py-0.5 rounded-md">
                              #{folio.reservationId.slice(-6).toUpperCase()}
                            </span>
                          ) : (
                            <span className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-500 font-medium">
                              Direct Stay
                            </span>
                          )}
                        </td>

                        <td className="px-3.5 py-3.5 whitespace-nowrap font-extrabold text-[#735c00] text-sm">
                          Rs {Number(folio.totalAmount || 0).toLocaleString()}
                        </td>

                        <td className="px-3.5 py-3.5 whitespace-nowrap text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              folio.status === "CLOSED"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                folio.status === "CLOSED" ? "bg-emerald-500" : "bg-amber-500"
                              }`}
                            />
                            {folio.status || "OPEN"}
                          </span>
                        </td>

                        <td className="px-3.5 py-3.5 whitespace-nowrap text-center">
                          <div className="inline-flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenView(folio)}
                              className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg border border-[#735c00] bg-white px-2.5 py-1 text-xs font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white shrink-0 shadow-sm"
                            >
                              <Eye size={12} />
                              <span>Quick View</span>
                            </button>

                            <Link
                              href={`/folio/detail?id=${folio.id}`}
                              className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg bg-[#735c00] px-2.5 py-1 text-xs font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00] shrink-0 shadow-sm"
                            >
                              <ExternalLink size={12} />
                              <span>Full Details</span>
                            </Link>

                            {canManage && (
                              folio.status !== "CLOSED" ? (
                                <button
                                  onClick={() => handleCloseFolio(folio)}
                                  className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 shrink-0 shadow-sm"
                                >
                                  <CheckCircle size={12} />
                                  <span>Close</span>
                                </button>
                              ) : (
                                <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-bold text-gray-400 cursor-not-allowed shrink-0">
                                  <CheckCircle size={12} />
                                  <span>Settled</span>
                                </span>
                              )
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
            subtitle="Itemized breakdown of all charges for this stay."
            icon={<FileText className="h-5 w-5" />}
          >
            {selectedFolio && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-[#d0c5af] bg-[#f8f5ef] p-5">
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                    <div>
                      <p className="text-[#4d4635] uppercase tracking-wider text-[10px]">Guest Name</p>
                      <p className="text-sm font-bold text-[#1b1c1a] mt-0.5">{selectedFolio.guestName}</p>
                    </div>
                    <div>
                      <p className="text-[#4d4635] uppercase tracking-wider text-[10px]">Room / Venue</p>
                      <p className="text-sm font-bold text-[#1b1c1a] mt-0.5">{selectedFolio.roomNumber}</p>
                    </div>
                    <div>
                      <p className="text-[#4d4635] uppercase tracking-wider text-[10px]">Status</p>
                      <p className="text-sm font-bold text-[#735c00] mt-0.5">{selectedFolio.status}</p>
                    </div>
                    <div>
                      <p className="text-[#4d4635] uppercase tracking-wider text-[10px]">Total Balance</p>
                      <p className="text-sm font-extrabold text-[#735c00] mt-0.5">
                        Rs {Number(selectedFolio.totalAmount || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#d0c5af]/50">
                    <Link
                      href={`/folio/detail?id=${selectedFolio.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#735c00] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00] shadow-sm"
                    >
                      <ExternalLink size={14} />
                      Open Full Breakdown Page
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#4d4635] mb-3">
                    Itemized Charges ({selectedFolio.lines?.length || 0})
                  </h3>

                  <div className="space-y-3">
                    {selectedFolio.lines && selectedFolio.lines.length > 0 ? (
                      selectedFolio.lines.map((line: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start justify-between gap-4 rounded-xl border border-[#d0c5af] bg-[#fbf9f5] p-4 transition hover:bg-white"
                        >
                          <div className="space-y-1">
                            <p className="font-bold text-sm text-[#1b1c1a]">{line.description}</p>
                            <div className="flex items-center gap-2">
                              <span className="rounded-md bg-[#d4af37]/20 px-2 py-0.5 text-[10px] font-bold text-[#735c00]">
                                {line.category || "GENERAL"}
                              </span>
                              <span className="text-xs text-[#4d4635]">
                                {line.date ? new Date(line.date).toLocaleDateString() : "-"}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-sm font-extrabold text-[#735c00]">
                              Rs {Number(line.amount || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic p-4 text-center">No line items attached.</p>
                    )}
                  </div>
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
                  <option>Amenity</option>
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