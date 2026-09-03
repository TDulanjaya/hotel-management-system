"use client";
import { AuthUser, getUser } from "@/utils/auth";
import { useEffect, useMemo, useState } from "react";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SlidePanel from "@/components/ui/SlidePanel";
import OrderForm from "@/components/forms/OrderForm";
import useSWR from "swr";
import {
  getLaundryOrders,
  createLaundryOrder,
  updateLaundryOrder,
  deleteLaundryOrder,
} from "@/lib/api/laundryApi";
import {
  Shirt,
  Sparkles,
  CheckCircle,
  Clock,
  Search,
  Plus,
  Pencil,
  Trash2,
  DollarSign,
  PackageCheck,
} from "lucide-react";

function getStatusBadge(status: string) {
  const normalized = (status || "").toUpperCase();
  if (normalized === "DELIVERED" || normalized === "COMPLETED") {
    return "bg-emerald-100 text-emerald-800 border border-emerald-200";
  }
  if (normalized === "IN_PROGRESS" || normalized === "WASHING" || normalized === "PROCESSING") {
    return "bg-amber-100 text-amber-800 border border-amber-200";
  }
  if (normalized === "CANCELLED") {
    return "bg-rose-100 text-rose-800 border border-rose-200";
  }
  return "bg-sky-100 text-sky-800 border border-sky-200";
}

function getPaymentBadge(status: string) {
  const normalized = (status || "").toUpperCase();
  if (normalized === "PAID" || normalized === "SETTLED") {
    return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  }
  return "bg-amber-50 text-amber-700 border border-amber-200";
}

export default function LaundryPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    setUser(getUser());
  }, []);

  const {
    data: rawItems,
    mutate,
    isLoading: isSwrLoading,
    error: swrError,
  } = useSWR<any[]>("/api/laundry");
  const items = useMemo(() => (Array.isArray(rawItems) ? rawItems : []), [rawItems]);
  const loading = !rawItems && isSwrLoading;
  const error = swrError?.message || "";

  const [panelOpen, setPanelOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [formData, setFormData] = useState({
    roomNumber: "",
    guestName: "",
    items: [] as any[],
    notes: "",
    status: "PENDING",
    totalAmount: 0,
    paymentStatus: "PENDING",
  });

  const filteredItems = useMemo(() => {
    return items.filter((item: any) => {
      const matchSearch =
        !searchTerm ||
        (item.roomNumber && String(item.roomNumber).toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.guestName && item.guestName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus =
        statusFilter === "ALL" ||
        (item.status && item.status.toUpperCase() === statusFilter);

      return matchSearch && matchStatus;
    });
  }, [items, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = items.length;
    const pending = items.filter((i) => (i.status || "").toUpperCase() === "PENDING").length;
    const inProgress = items.filter((i) => ["IN_PROGRESS", "WASHING", "PROCESSING"].includes((i.status || "").toUpperCase())).length;
    const completed = items.filter((i) => ["COMPLETED", "DELIVERED"].includes((i.status || "").toUpperCase())).length;
    const totalRevenue = items.reduce((sum, i) => sum + (Number(i.totalAmount) || 0), 0);

    return { total, pending, inProgress, completed, totalRevenue };
  }, [items]);

  const handleOpenNew = () => {
    setEditItem(null);
    setFormData({
      roomNumber: "",
      guestName: "",
      items: [],
      notes: "",
      status: "PENDING",
      totalAmount: 0,
      paymentStatus: "PENDING",
    });
    setPanelOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditItem(item);
    const mapped: any = {};
    const defaultState: any = {
      roomNumber: "",
      guestName: "",
      items: [],
      notes: "",
      status: "PENDING",
      totalAmount: 0,
      paymentStatus: "PENDING",
    };
    const keys = Object.keys(defaultState);
    keys.forEach((k) => {
      mapped[k] = item[k] !== undefined && item[k] !== null ? item[k] : defaultState[k];
    });
    setFormData(mapped);
    setPanelOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this laundry order?")) {
      try {
        await deleteLaundryOrder(id);
        mutate();
      } catch {
        alert("Failed to delete laundry order");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editItem) {
        await updateLaundryOrder(editItem.id, formData);
      } else {
        await createLaundryOrder(formData);
      }
      setPanelOpen(false);
      mutate();
    } catch {
      alert("Failed to save laundry order");
    } finally {
      setSubmitting(false);
    }
  };

  const canEdit =
    user?.role === "OWNER" || user?.role === "MANAGER" || user?.role === "LAUNDRY";
  const canDelete = user?.role === "OWNER" || user?.role === "MANAGER";

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "LAUNDRY"]}>
      <div className="flex min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="flex-1 px-4 py-6 pt-16 sm:px-8 sm:py-10 lg:pt-10 lg:ml-[280px]">
          {/* Header */}
          <div className="mb-6 sm:mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Housekeeping & Services
              </p>
              <h1 className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-extrabold text-[#735c00]">
                Laundry Service
              </h1>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#4d4635]">
                Manage guest dry cleaning, pressing, wash & fold orders, and delivery statuses.
              </p>
            </div>

            {canEdit && (
              <button
                onClick={handleOpenNew}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#735c00] px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-md transition hover:bg-[#d4af37] hover:text-[#241a00] active:scale-95"
              >
                <Plus size={18} />
                New Laundry Order
              </button>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="mb-6 sm:mb-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#4d4635]">
                  Total Orders
                </p>
                <Shirt size={20} className="text-[#735c00]" />
              </div>
              <p className="mt-2 text-2xl sm:text-4xl font-extrabold text-[#1b1c1a]">
                {stats.total}
              </p>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#4d4635]">
                  Active / Washing
                </p>
                <Clock size={20} className="text-amber-600" />
              </div>
              <p className="mt-2 text-2xl sm:text-4xl font-extrabold text-amber-700">
                {stats.pending + stats.inProgress}
              </p>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#4d4635]">
                  Completed
                </p>
                <CheckCircle size={20} className="text-emerald-600" />
              </div>
              <p className="mt-2 text-2xl sm:text-4xl font-extrabold text-emerald-700">
                {stats.completed}
              </p>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#4d4635]">
                  Total Billing
                </p>
                <DollarSign size={20} className="text-[#735c00]" />
              </div>
              <p className="mt-2 text-xl sm:text-3xl font-extrabold text-[#735c00] truncate">
                Rs {stats.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4d4635]"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by room number or guest name..."
                className="w-full rounded-xl border border-[#d0c5af] bg-white py-3 pl-10 pr-4 text-sm sm:text-base text-[#1b1c1a] outline-none focus:ring-2 focus:ring-[#735c00]/30 shadow-sm"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-[#d0c5af] bg-white px-4 py-3 text-sm sm:text-base font-semibold text-[#4d4635] outline-none focus:ring-2 focus:ring-[#735c00]/30 shadow-sm"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="DELIVERED">Delivered</option>
            </select>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#735c00] border-t-transparent mb-3" />
              <p className="font-bold text-[#735c00]">Loading laundry orders...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700 font-bold">
              {error}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[#d0c5af] bg-white p-8 sm:p-12 text-center shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f3ef] text-[#735c00] mb-4">
                <Shirt size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#1b1c1a]">No laundry orders found</h3>
              <p className="mt-1 text-xs sm:text-sm text-[#4d4635] max-w-sm">
                {searchTerm || statusFilter !== "ALL"
                  ? "Try adjusting your search or status filter."
                  : "Create a new laundry order to start tracking room dry cleaning and laundry."}
              </p>
              {canEdit && (
                <button
                  onClick={handleOpenNew}
                  className="mt-6 rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
                >
                  + Create First Order
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Mobile Card View (Small Screens) */}
              <div className="space-y-4 sm:hidden">
                {filteredItems.map((item: any) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-[#d0c5af] bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="inline-block rounded-lg bg-[#f5f3ef] px-2.5 py-1 text-xs font-bold text-[#735c00]">
                          Room {item.roomNumber || "N/A"}
                        </span>
                        <h4 className="text-base font-bold text-[#1b1c1a] mt-1">
                          {item.guestName || "Unassigned Guest"}
                        </h4>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status || "PENDING"}
                      </span>
                    </div>

                    <div className="rounded-xl bg-[#fbf9f5] p-3 mb-3 border border-[#ede7db] text-xs">
                      <p className="font-bold text-[#4d4635] mb-1">Items & Services:</p>
                      {Array.isArray(item.items) && item.items.length > 0 ? (
                        <div className="space-y-0.5">
                          {item.items.map((i: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-[#1b1c1a]">
                              <span>{i.name || "Item"}</span>
                              <span className="font-bold">x{i.quantity || 1}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[#6d6251]">
                          {typeof item.items === "string" && item.items ? item.items : "Standard laundry bag"}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs mb-4">
                      <div>
                        <span className="text-[#6d6251]">Total: </span>
                        <span className="font-bold text-[#735c00] text-sm">
                          Rs {Number(item.totalAmount || 0).toLocaleString()}
                        </span>
                      </div>

                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getPaymentBadge(
                          item.paymentStatus
                        )}`}
                      >
                        {item.paymentStatus || "PENDING"}
                      </span>
                    </div>

                    {(canEdit || canDelete) && (
                      <div className="flex gap-2 border-t border-[#d0c5af] pt-3">
                        {canEdit && (
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[#735c00] bg-white py-2 text-xs font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop / Tablet Table View */}
              <div className="hidden sm:block overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#d0c5af] bg-[#f5eed9] text-xs uppercase tracking-widest text-[#4c4032]">
                        <th className="px-6 py-4 font-bold">Room</th>
                        <th className="px-6 py-4 font-bold">Guest</th>
                        <th className="px-6 py-4 font-bold">Items</th>
                        <th className="px-6 py-4 font-bold">Status</th>
                        <th className="px-6 py-4 font-bold">Total Amount</th>
                        <th className="px-6 py-4 font-bold">Payment</th>
                        <th className="px-6 py-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#d0c5af]">
                      {filteredItems.map((item: any) => (
                        <tr key={item.id} className="transition hover:bg-[#fbf9f5]">
                          <td className="px-6 py-4 font-bold text-[#735c00]">
                            {item.roomNumber ? `Room ${item.roomNumber}` : "N/A"}
                          </td>
                          <td className="px-6 py-4 font-medium text-[#1b1c1a]">
                            {item.guestName || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-xs">
                            {Array.isArray(item.items) && item.items.length > 0 ? (
                              <div className="space-y-0.5">
                                {item.items.map((i: any, idx: number) => (
                                  <div key={idx} className="text-[#4d4635]">
                                    <span className="font-bold">{i.quantity}x</span> {i.name}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[#6d6251]">
                                {typeof item.items === "string" && item.items ? item.items : "-"}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusBadge(
                                item.status
                              )}`}
                            >
                              {item.status || "PENDING"}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-[#735c00]">
                            Rs {Number(item.totalAmount || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${getPaymentBadge(
                                item.paymentStatus
                              )}`}
                            >
                              {item.paymentStatus || "PENDING"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {canEdit && (
                                <button
                                  onClick={() => handleOpenEdit(item)}
                                  className="flex items-center gap-1 rounded-lg border border-[#d0c5af] bg-white px-3 py-1.5 text-xs font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
                                >
                                  <Pencil size={13} />
                                  Edit
                                </button>
                              )}
                              {canDelete && (
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100"
                                >
                                  <Trash2 size={13} />
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
              </div>
            </>
          )}

          <SlidePanel
            open={panelOpen}
            onClose={() => setPanelOpen(false)}
            title={editItem ? "Edit Laundry Order" : "New Laundry Order"}
          >
            <OrderForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              categories={["Laundry"]}
              loading={submitting}
            />
          </SlidePanel>
        </main>
      </div>
    </ProtectedRoute>
  );
}
