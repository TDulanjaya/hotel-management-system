"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SlidePanel from "@/components/ui/SlidePanel";
import { getUser, AuthUser } from "@/utils/auth";
import {
  RestaurantTableItem,
  createRestaurantTable,
  updateRestaurantTable,
  deleteRestaurantTable,
} from "@/lib/api/tableApi";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Sparkles,
  Table2,
  Users,
  Plus,
  Pencil,
  Trash2,
  Filter,
  Eye,
  Info,
} from "lucide-react";

function getStatusBadge(status: string) {
  switch (status?.toUpperCase()) {
    case "AVAILABLE":
      return "bg-green-100 text-green-700 border-green-200";
    case "OCCUPIED":
      return "bg-red-100 text-red-700 border-red-200";
    case "RESERVED":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "CLEANING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

export default function RestaurantTablesPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    setUser(getUser());
  }, []);

  const {
    data: rawTables,
    mutate,
    isLoading,
    error: fetchError,
  } = useSWR<RestaurantTableItem[]>("/api/restaurant/tables");

  const tables = useMemo(
    () => (Array.isArray(rawTables) ? rawTables : []),
    [rawTables]
  );

  const [selectedArea, setSelectedArea] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Panel States
  const [panelOpen, setPanelOpen] = useState(false);
  const [viewPanelOpen, setViewPanelOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<RestaurantTableItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form State
  const [formData, setFormData] = useState<Partial<RestaurantTableItem>>({
    tableNumber: "",
    area: "Main Hall",
    seats: 4,
    status: "AVAILABLE",
    waiter: "",
    notes: "",
  });

  const availableCount = tables.filter((t) => t.status === "AVAILABLE").length;
  const occupiedCount = tables.filter((t) => t.status === "OCCUPIED").length;
  const reservedCount = tables.filter((t) => t.status === "RESERVED").length;
  const cleaningCount = tables.filter((t) => t.status === "CLEANING").length;

  const allAreas = useMemo(() => {
    const areas = new Set<string>();
    tables.forEach((t) => {
      if (t.area) areas.add(t.area);
    });
    return Array.from(areas);
  }, [tables]);

  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      const matchArea = selectedArea === "ALL" || table.area === selectedArea;
      const matchStatus = selectedStatus === "ALL" || table.status === selectedStatus;
      return matchArea && matchStatus;
    });
  }, [tables, selectedArea, selectedStatus]);

  const handleOpenAdd = () => {
    setSelectedTable(null);
    setIsEditing(false);
    setErrorMsg("");
    setFormData({
      tableNumber: `T0${tables.length + 1}`,
      area: "Main Hall",
      seats: 4,
      status: "AVAILABLE",
      waiter: "",
      notes: "",
    });
    setPanelOpen(true);
  };

  const handleOpenEdit = (table: RestaurantTableItem) => {
    setSelectedTable(table);
    setIsEditing(true);
    setErrorMsg("");
    setFormData({
      tableNumber: table.tableNumber,
      area: table.area,
      seats: table.seats,
      status: table.status,
      waiter: table.waiter || "",
      notes: table.notes || "",
    });
    setPanelOpen(true);
  };

  const handleOpenView = (table: RestaurantTableItem) => {
    setSelectedTable(table);
    setViewPanelOpen(true);
  };

  const handleQuickStatusChange = async (
    table: RestaurantTableItem,
    newStatus: string
  ) => {
    if (!table.id) return;
    try {
      await updateRestaurantTable(table.id, {
        ...table,
        status: newStatus,
      });
      await mutate();
      if (selectedTable?.id === table.id) {
        setSelectedTable({ ...table, status: newStatus });
      }
      setSuccessMsg(`Table ${table.tableNumber} status updated to ${newStatus}`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update status");
      setTimeout(() => setErrorMsg(""), 4000);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.tableNumber || !formData.tableNumber.trim()) {
      setErrorMsg("Table number is required");
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing && selectedTable?.id) {
        await updateRestaurantTable(selectedTable.id, formData);
        setSuccessMsg(`Table ${formData.tableNumber} updated successfully!`);
      } else {
        await createRestaurantTable(formData);
        setSuccessMsg(`Table ${formData.tableNumber} created successfully!`);
      }

      await mutate();
      setPanelOpen(false);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save table");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (table: RestaurantTableItem) => {
    if (!table.id) return;
    if (!confirm(`Are you sure you want to delete Table ${table.tableNumber}?`)) {
      return;
    }

    try {
      await deleteRestaurantTable(table.id);
      await mutate();
      setPanelOpen(false);
      setViewPanelOpen(false);
      setSuccessMsg(`Table ${table.tableNumber} deleted successfully.`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete table");
      setTimeout(() => setErrorMsg(""), 4000);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "WAITER"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Restaurant Module
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Restaurant Tables
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View table availability, seating capacity, assigned waiter and table status.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-2 rounded-xl bg-[#735c00] px-5 py-3 font-bold text-white shadow-md transition hover:bg-[#8d6b00]"
              >
                <Plus size={18} />
                Add Table
              </button>

              <Link
                href="/restaurant"
                className="flex items-center gap-2 rounded-xl border border-[#806300] bg-white px-6 py-3 font-bold text-[#806300] transition hover:bg-[#faf8f3]"
              >
                <ArrowLeft size={18} />
                Back to Restaurant
              </Link>
            </div>
          </div>

          {/* Feedback Messages */}
          {successMsg && (
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800 shadow-sm animate-fadeIn">
              ✓ {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-800 shadow-sm animate-fadeIn">
              ⚠ {errorMsg}
            </div>
          )}

          {/* Stat Cards Grid */}
          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard
              label="Available"
              value={String(availableCount)}
              icon={<CheckCircle size={24} />}
            />
            <StatCard
              label="Occupied"
              value={String(occupiedCount)}
              icon={<Users size={24} />}
            />
            <StatCard
              label="Reserved"
              value={String(reservedCount)}
              icon={<Clock size={24} />}
            />
            <StatCard
              label="Cleaning"
              value={String(cleaningCount)}
              icon={<Sparkles size={24} />}
            />
          </section>

          {/* Main Content Section */}
          <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-2xl font-bold">Table Floor View</h2>
                <p className="mt-1 text-sm text-[#4d4635]">
                  Live table layout connected to backend database.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Area Filter */}
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-[#735c00]" />
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    aria-label="Filter tables by area"
                    className="rounded-xl border border-[#d0c5af] bg-[#fbf9f5] px-3 py-2 text-sm font-semibold text-[#1b1c1a] outline-none transition focus:border-[#735c00]"
                  >
                    <option value="ALL">All Areas</option>
                    {allAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  aria-label="Filter tables by status"
                  className="rounded-xl border border-[#d0c5af] bg-[#fbf9f5] px-3 py-2 text-sm font-semibold text-[#1b1c1a] outline-none transition focus:border-[#735c00]"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="AVAILABLE">Available</option>
                  <option value="OCCUPIED">Occupied</option>
                  <option value="RESERVED">Reserved</option>
                  <option value="CLEANING">Cleaning</option>
                </select>

                <Table2 className="hidden text-[#735c00] lg:block" size={32} />
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex h-48 flex-col items-center justify-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#735c00] border-t-transparent" />
                <p className="text-sm font-semibold text-[#735c00]">
                  Loading restaurant tables...
                </p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredTables.length === 0 && (
              <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-[#d0c5af] p-8 text-center">
                <Table2 size={40} className="text-[#806300]/40" />
                <p className="mt-3 text-lg font-bold text-[#1b1c1a]">No tables found</p>
                <p className="mt-1 text-sm text-[#4d4635]">
                  {tables.length === 0
                    ? "Click 'Add Table' to add your first restaurant table."
                    : "Try adjusting your filters to see more tables."}
                </p>
              </div>
            )}

            {/* Table Cards Grid */}
            {!isLoading && filteredTables.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredTables.map((table) => (
                  <article
                    key={table.id || table.tableNumber}
                    className="rounded-2xl border border-[#d0c5af] bg-[#fbf9f5] p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="mb-5 flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-extrabold text-[#1b1c1a]">
                          Table {table.tableNumber}
                        </h3>

                        <p className="mt-1 text-sm font-semibold text-[#4d4635]">
                          {table.area || "Main Hall"}
                        </p>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusBadge(
                          table.status
                        )}`}
                      >
                        {table.status}
                      </span>
                    </div>

                    <div className="space-y-3 text-sm text-[#4d4635]">
                      <div className="flex justify-between border-b border-[#ece9e2] pb-2">
                        <span>Seats</span>
                        <strong className="text-[#1b1c1a]">{table.seats}</strong>
                      </div>

                      <div className="flex justify-between border-b border-[#ece9e2] pb-2">
                        <span>Assigned Waiter</span>
                        <strong className="text-[#1b1c1a]">
                          {table.waiter || "Unassigned"}
                        </strong>
                      </div>

                      {table.notes && (
                        <div className="flex justify-between text-xs text-[#7f7663]">
                          <span>Notes</span>
                          <span className="max-w-[180px] truncate text-right font-medium">
                            {table.notes}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleOpenView(table)}
                        className="rounded-xl border border-[#735c00] px-4 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleOpenEdit(table)}
                        className="rounded-xl bg-[#735c00] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
                      >
                        Update
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>

        {/* SlidePanel: Add / Update Table */}
        <SlidePanel
          open={panelOpen}
          onClose={() => setPanelOpen(false)}
          title={isEditing ? `Update Table ${formData.tableNumber}` : "Add New Table"}
          subtitle="Configure table capacity, floor area, assigned waiter and status"
          icon={<Table2 size={20} />}
        >
          <form onSubmit={handleSubmitForm} className="space-y-5">
            {errorMsg && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-[#1b1c1a]">
                Table Number / Identifier *
              </label>
              <input
                type="text"
                required
                value={formData.tableNumber}
                onChange={(e) =>
                  setFormData({ ...formData, tableNumber: e.target.value })
                }
                placeholder="e.g. T01, T02, VIP-1"
                className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white px-4 py-2.5 text-sm font-medium text-[#1b1c1a] outline-none transition focus:border-[#735c00] focus:ring-2 focus:ring-[#735c00]/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#1b1c1a]">
                  Floor / Area
                </label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                  placeholder="e.g. Main Hall, Garden View, Outdoor"
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white px-4 py-2.5 text-sm font-medium text-[#1b1c1a] outline-none transition focus:border-[#735c00] focus:ring-2 focus:ring-[#735c00]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1b1c1a]">
                  Seats / Capacity *
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  required
                  value={formData.seats}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seats: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white px-4 py-2.5 text-sm font-medium text-[#1b1c1a] outline-none transition focus:border-[#735c00] focus:ring-2 focus:ring-[#735c00]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1b1c1a]">
                Table Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white px-4 py-2.5 text-sm font-medium text-[#1b1c1a] outline-none transition focus:border-[#735c00] focus:ring-2 focus:ring-[#735c00]/20"
              >
                <option value="AVAILABLE">AVAILABLE (Ready for guests)</option>
                <option value="OCCUPIED">OCCUPIED (Dining in progress)</option>
                <option value="RESERVED">RESERVED (Booked ahead)</option>
                <option value="CLEANING">CLEANING (Housekeeping / Reset)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1b1c1a]">
                Assigned Waiter / Staff
              </label>
              <input
                type="text"
                value={formData.waiter}
                onChange={(e) =>
                  setFormData({ ...formData, waiter: e.target.value })
                }
                placeholder="e.g. Nimal, Kasun, Amal"
                className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white px-4 py-2.5 text-sm font-medium text-[#1b1c1a] outline-none transition focus:border-[#735c00] focus:ring-2 focus:ring-[#735c00]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1b1c1a]">
                Notes / Special Instructions
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="e.g. Window side, high chairs available, special anniversary setup..."
                className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white px-4 py-2.5 text-sm font-medium text-[#1b1c1a] outline-none transition focus:border-[#735c00] focus:ring-2 focus:ring-[#735c00]/20"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-4">
              {isEditing && selectedTable && (
                <button
                  type="button"
                  onClick={() => handleDelete(selectedTable)}
                  className="flex items-center gap-1.5 rounded-xl border border-red-300 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              )}

              <div className="ml-auto flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPanelOpen(false)}
                  className="rounded-xl border border-[#d0c5af] px-5 py-2.5 text-sm font-bold text-[#4d4635] transition hover:bg-[#ece9e2]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-xl bg-[#735c00] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#8d6b00] disabled:opacity-50"
                >
                  {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create Table"}
                </button>
              </div>
            </div>
          </form>
        </SlidePanel>

        {/* SlidePanel: View Table Details */}
        <SlidePanel
          open={viewPanelOpen}
          onClose={() => setViewPanelOpen(false)}
          title={`Table ${selectedTable?.tableNumber || ""}`}
          subtitle="Table details and quick status actions"
          icon={<Info size={20} />}
        >
          {selectedTable && (
            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-2xl border border-[#d0c5af] bg-white p-5 shadow-sm">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#7f7663]">
                    Current Status
                  </p>
                  <p className="mt-1 text-xl font-extrabold text-[#1b1c1a]">
                    {selectedTable.status}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-4 py-1.5 text-sm font-bold ${getStatusBadge(
                    selectedTable.status
                  )}`}
                >
                  {selectedTable.status}
                </span>
              </div>

              <div className="rounded-2xl border border-[#d0c5af] bg-white p-5 shadow-sm">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#735c00]">
                  Quick Status Change
                </h4>
                <p className="mt-1 text-xs text-[#4d4635]">
                  Click below to quickly change table status:
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      handleQuickStatusChange(selectedTable, "AVAILABLE")
                    }
                    className={`rounded-xl border p-2.5 text-xs font-bold transition ${
                      selectedTable.status === "AVAILABLE"
                        ? "border-green-600 bg-green-100 text-green-800"
                        : "border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
                    }`}
                  >
                    ✓ Available
                  </button>

                  <button
                    onClick={() =>
                      handleQuickStatusChange(selectedTable, "OCCUPIED")
                    }
                    className={`rounded-xl border p-2.5 text-xs font-bold transition ${
                      selectedTable.status === "OCCUPIED"
                        ? "border-red-600 bg-red-100 text-red-800"
                        : "border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                    }`}
                  >
                    ● Occupied
                  </button>

                  <button
                    onClick={() =>
                      handleQuickStatusChange(selectedTable, "RESERVED")
                    }
                    className={`rounded-xl border p-2.5 text-xs font-bold transition ${
                      selectedTable.status === "RESERVED"
                        ? "border-blue-600 bg-blue-100 text-blue-800"
                        : "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"
                    }`}
                  >
                    ⏱ Reserved
                  </button>

                  <button
                    onClick={() =>
                      handleQuickStatusChange(selectedTable, "CLEANING")
                    }
                    className={`rounded-xl border p-2.5 text-xs font-bold transition ${
                      selectedTable.status === "CLEANING"
                        ? "border-yellow-600 bg-yellow-100 text-yellow-900"
                        : "border-yellow-300 bg-yellow-50 text-yellow-800 hover:bg-yellow-100"
                    }`}
                  >
                    ✨ Cleaning
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-[#d0c5af] bg-white p-5 shadow-sm space-y-4 text-sm text-[#4d4635]">
                <div className="flex justify-between border-b border-[#ece9e2] pb-3">
                  <span className="font-semibold">Floor Area</span>
                  <span className="font-bold text-[#1b1c1a]">
                    {selectedTable.area || "Main Hall"}
                  </span>
                </div>

                <div className="flex justify-between border-b border-[#ece9e2] pb-3">
                  <span className="font-semibold">Seating Capacity</span>
                  <span className="font-bold text-[#1b1c1a]">
                    {selectedTable.seats} Seats
                  </span>
                </div>

                <div className="flex justify-between border-b border-[#ece9e2] pb-3">
                  <span className="font-semibold">Assigned Waiter</span>
                  <span className="font-bold text-[#1b1c1a]">
                    {selectedTable.waiter || "None Assigned"}
                  </span>
                </div>

                {selectedTable.notes && (
                  <div className="pt-1">
                    <span className="block font-semibold">Notes / Details</span>
                    <p className="mt-1 rounded-xl bg-[#fbf9f5] p-3 text-xs text-[#1b1c1a]">
                      {selectedTable.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedTable)}
                  className="flex items-center gap-1.5 rounded-xl border border-red-300 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  Delete Table
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setViewPanelOpen(false);
                    handleOpenEdit(selectedTable);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-[#735c00] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#8d6b00]"
                >
                  <Pencil size={16} />
                  Edit Table
                </button>
              </div>
            </div>
          )}
        </SlidePanel>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4af37] text-[#554300]">
        {icon}
      </div>

      <p className="text-sm font-bold uppercase tracking-widest text-[#4d4635]">
        {label}
      </p>

      <p className="mt-2 text-3xl font-extrabold text-[#735c00]">{value}</p>
    </div>
  );
}