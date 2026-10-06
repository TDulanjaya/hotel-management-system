"use client";
import { AuthUser, getUser } from "@/utils/auth";

import { useEffect, useMemo, useState } from "react";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SlidePanel from "@/components/ui/SlidePanel";
import OrderForm from "@/components/forms/OrderForm";
import useSWR from "swr";
import {
  getRestaurantOrders,
  createRestaurantOrder,
  updateRestaurantOrder,
  deleteRestaurantOrder,
} from "@/lib/api/restaurantApi";
import POSPaymentModal from "@/components/payments/POSPaymentModal";
import { ClipboardList, Pencil, Plus, Trash2, Utensils, CreditCard, ShieldCheck } from "lucide-react";

export default function RestaurantOrdersPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    setUser(getUser());
  }, []);

  const [currentRole, setCurrentRole] = useState("");
  const { data: rawItems, mutate, isLoading: isSwrLoading, error: swrError } = useSWR<any[]>("/api/restaurant/orders");
  const { data: rawTables } = useSWR<any[]>("/api/restaurant/tables");
  const { data: rawReservations } = useSWR<any>("/api/reservations?size=1000");
  const items = useMemo(() => (Array.isArray(rawItems) ? rawItems : []), [rawItems]);
  const tables = useMemo(() => (Array.isArray(rawTables) ? rawTables : []), [rawTables]);
  const activeRooms = useMemo(() => {
    const reservations = Array.isArray(rawReservations) ? rawReservations : rawReservations?.content || [];
    return reservations
      .filter((reservation: any) => reservation.status === "CHECKED_IN")
      .map((reservation: any) => ({ roomNumber: reservation.roomNumber, guestName: reservation.guestName }));
  }, [rawReservations]);
  const loading = !rawItems && isSwrLoading;
  const [error, setError] = useState("");

  const [panelOpen, setPanelOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [settleOrderItem, setSettleOrderItem] = useState<any>(null);
  const [settleChoiceOrder, setSettleChoiceOrder] = useState<any>(null);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string>("");

  const handleInitiateSettle = (order: any) => {
    setSettleChoiceOrder(order);
    setSelectedRoomNumber(order.roomNumber || (activeRooms[0]?.roomNumber ?? ""));
  };

  const handleConfirmRoomOrder = async (order: any, chosenRoom?: string) => {
    try {
      const roomNum = chosenRoom || order.roomNumber || selectedRoomNumber;
      if (!roomNum) {
        alert("Please select an active resident room.");
        return;
      }
      const matched = activeRooms.find((r: any) => r.roomNumber === roomNum);
      await updateRestaurantOrder(order.id, {
        ...order,
        customerType: "HOTEL_GUEST",
        billingType: "ROOM_FOLIO",
        roomNumber: roomNum,
        guestName: matched?.guestName || order.guestName,
        status: "COMPLETED",
      });
      setSettleChoiceOrder(null);
      await mutate();
      alert(`Order completed and posted to Room ${roomNum} Folio. Table freed.`);
    } catch (err: any) {
      alert(err.message || "Failed to complete order.");
    }
  };

  const [formData, setFormData] = useState({
    orderSource: "TABLE",
    tableNumber: "",
    guestName: "",
    roomNumber: "",
    items: [] as any[],
    notes: "",
    status: "PENDING",
    totalAmount: 0,
    customerType: "WALK_IN",
    billingType: "DIRECT_PAYMENT",
  });

  const canManage =
    currentRole === "OWNER" ||
    currentRole === "MANAGER" ||
    currentRole === "WAITER";

  const canDelete = currentRole === "OWNER" || currentRole === "MANAGER";

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

  const resetForm = () => {
    setFormData({
      orderSource: "TABLE",
      tableNumber: "",
      guestName: "",
      roomNumber: "",
      items: [],
      notes: "",
      status: "PENDING",
      totalAmount: 0,
      customerType: "WALK_IN",
      billingType: "DIRECT_PAYMENT",
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
      orderSource: item.roomNumber ? "ROOM" : "TABLE",
      tableNumber: item.tableNumber || "",
      guestName: item.guestName || "",
      roomNumber: item.roomNumber || "",
      items: Array.isArray(item.items) ? item.items : [],
      notes: item.notes || "",
      status: item.status || "PENDING",
      totalAmount: Number(item.totalAmount || 0),
      customerType: item.customerType || (item.roomNumber ? "HOTEL_GUEST" : "WALK_IN"),
      billingType: item.billingType || (item.roomNumber ? "ROOM_FOLIO" : "DIRECT_PAYMENT"),
    });

    setPanelOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      await deleteRestaurantOrder(id);
      mutate();
      alert("Order deleted successfully.");
    } catch (err: any) {
      alert(err.message || "Failed to delete order.");
    }
  };

  const handleStatusChange = async (item: any) => {
    const statuses = ["PENDING", "IN_PROGRESS", "SERVED", "COMPLETED", "CANCELLED"];
    const currentIndex = statuses.indexOf(item.status || "PENDING");
    const next = statuses[(currentIndex + 1) % statuses.length];

    try {
      await updateRestaurantOrder(item.id, {
        ...item,
        status: next,
      });

      mutate();
    } catch (err: any) {
      alert(err.message || "Failed to update status.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.orderSource === "TABLE" && !formData.tableNumber) {
      setError("Select a registered restaurant table.");
      return;
    }
    if (formData.orderSource === "ROOM" && !formData.roomNumber) {
      setError("Select an active guest room.");
      return;
    }

    if (!Array.isArray(formData.items) || formData.items.length === 0) {
      setError("Please add at least one order item.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        tableNumber: formData.tableNumber,
        guestName: formData.guestName,
        roomNumber: formData.roomNumber,
        customerType: formData.customerType,
        billingType: formData.billingType,
        items: formData.items,
        notes: formData.notes,
        status: formData.status,
      };

      if (editItem) {
        await updateRestaurantOrder(editItem.id, payload);
        alert("Order updated successfully.");
      } else {
        await createRestaurantOrder(payload);
        alert("Order created successfully.");
      }

      setPanelOpen(false);
      mutate();
    } catch (err: any) {
      setError(err.message || "Failed to save order.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalSales = items.reduce(
    (sum, item) => sum + Number(item.totalAmount || 0),
    0
  );

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "WAITER"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Restaurant Module
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Restaurant Orders
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Manage table orders, room orders, kitchen status and payments.
              </p>
            </div>

            {canManage && (
              <button
                onClick={handleOpenNew}
                className="flex items-center gap-2 rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
              >
                <Plus size={18} />
                Add Order
              </button>
            )}
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard label="Total Orders" value={String(items.length)} />
            <StatCard
              label="Pending"
              value={String(items.filter((i) => i.status === "PENDING").length)}
            />
            <StatCard
              label="Served"
              value={String(items.filter((i) => i.status === "SERVED").length)}
            />
            <StatCard label="Total Sales" value={`Rs ${totalSales.toLocaleString()}`} />
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="flex items-center gap-2 text-2xl font-bold">
                <ClipboardList className="text-[#735c00]" />
                Order Records
              </h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                View, create, edit and delete restaurant orders.
              </p>
            </div>

            {loading ? (
              <div className="flex h-64 items-center justify-center text-lg font-bold text-[#806300]">
                Loading restaurant orders...
              </div>
            ) : error ? (
              <div className="p-6 font-bold text-red-600">{error}</div>
            ) : items.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center">
                <Utensils size={42} className="mb-4 text-[#735c00]" />

                <p className="mb-4 text-xl font-semibold text-gray-500">
                  No restaurant orders found
                </p>

                {canManage && (
                  <button
                    onClick={handleOpenNew}
                    className="rounded-xl bg-[#806300] px-6 py-2 font-bold text-white hover:bg-[#6b5400]"
                  >
                    + Add Order
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-left text-sm">
                  <thead className="bg-[#f5eed9] text-[#4c4032]">
                    <tr>
                      <th className="p-4 font-bold">Order ID</th>
                      <th className="p-4 font-bold">Table</th>
                      <th className="p-4 font-bold">Guest</th>
                      <th className="p-4 font-bold">Room</th>
                      <th className="p-4 font-bold">Items</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold">Amount</th>
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

                        <td className="p-4 font-semibold">
                          {item.tableNumber || "-"}
                        </td>

                        <td className="p-4">{item.guestName || "-"}</td>
                        <td className="p-4">{item.roomNumber || "-"}</td>

                        <td className="p-4">
                          {Array.isArray(item.items) && item.items.length > 0 ? (
                            <div className="space-y-1 text-xs">
                              {item.items.map((i: any, idx: number) => (
                                <div key={idx}>
                                  {i.quantity}x {i.name}
                                </div>
                              ))}
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>

                        <td className="p-4">
                          {canManage ? (
                            <button
                              onClick={() => handleStatusChange(item)}
                              className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                                item.status || "PENDING"
                              )}`}
                            >
                              {item.status || "PENDING"}
                            </button>
                          ) : (
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                                item.status || "PENDING"
                              )}`}
                            >
                              {item.status || "PENDING"}
                            </span>
                          )}
                        </td>

                        <td className="p-4 font-bold">
                          Rs {Number(item.totalAmount || 0).toLocaleString()}
                        </td>

                        <td className="p-4">
                          <PaymentBadge status={item.paymentStatus || "PENDING"} />
                        </td>

                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            {item.paymentStatus !== "PAID" && item.status !== "COMPLETED" && (
                              <button
                                type="button"
                                onClick={() => handleInitiateSettle(item)}
                                className="flex items-center gap-1 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-emerald-800 shadow-sm"
                              >
                                <CreditCard size={15} />
                                Settle Bill
                              </button>
                            )}

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
            title={editItem ? "Edit Order" : "New Order"}
            subtitle={
              editItem
                ? "Update selected restaurant order."
                : "Create a new restaurant order."
            }
          >
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            <OrderForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              categories={["RESTAURANT_FOOD", "DESSERT", "BEVERAGE"]}
              loading={submitting}
              tableOptions={tables}
              roomOptions={activeRooms}
              showStatus={false}
            />
          </SlidePanel>

          {/* Universal POS Payment Modal for Table Order Settlement */}
          {settleOrderItem && (
            <POSPaymentModal
              isOpen={Boolean(settleOrderItem)}
              onClose={() => setSettleOrderItem(null)}
              title="Restaurant Dining Bill Settlement"
              sourceType="RESTAURANT_ORDER"
              sourceId={settleOrderItem.id}
              customerName={settleOrderItem.guestName || (settleOrderItem.tableNumber ? `Table ${settleOrderItem.tableNumber}` : "Dine-In Guest")}
              customerType={settleOrderItem.customerType || "WALK_IN"}
              roomNumber={settleOrderItem.roomNumber}
              serviceDescription={`Dine-In Dining: ${settleOrderItem.tableNumber ? `Table ${settleOrderItem.tableNumber}` : "Restaurant Order"} (${(settleOrderItem.items || []).length} items)`}
              totalAmount={Number(settleOrderItem.totalAmount || 0)}
              onPaymentSuccess={async () => {
                setSettleOrderItem(null);
                await mutate();
              }}
            />
          )}

          {/* Table Settle & Billing Modal */}
          {settleChoiceOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-2xl space-y-4">
                <div className="flex items-center gap-2 text-[#735c00]">
                  <ShieldCheck size={24} />
                  <h3 className="text-lg font-extrabold text-[#1b1c1a]">Settle & Free Table</h3>
                </div>

                <div className="rounded-xl border border-[#e2dacf] bg-[#faf8f4] p-3 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-sm">
                    <span>
                      {settleChoiceOrder.tableNumber ? `Table ${settleChoiceOrder.tableNumber}` : `Room ${settleChoiceOrder.roomNumber}`}
                    </span>
                    <span className="text-[#735c00]">
                      Rs {Number(settleChoiceOrder.totalAmount || 0).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-500">
                    Guest: <strong>{settleChoiceOrder.guestName || "Restaurant Diner"}</strong>
                  </p>
                </div>

                {/* Option 1: Charge to Room Folio */}
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 space-y-2">
                  <span className="text-xs font-bold text-amber-900 block">
                    Option A: Charge to Hotel Resident Room
                  </span>
                  <div>
                    <label className="text-[11px] font-bold text-[#4d4635] block mb-1">
                      Active In-House Room
                    </label>
                    <select
                      value={selectedRoomNumber}
                      onChange={(e) => setSelectedRoomNumber(e.target.value)}
                      className="w-full rounded-lg border border-[#d0c5af] bg-white p-2 text-xs font-bold text-[#1b1c1a] focus:ring-2 focus:ring-[#735c00]"
                    >
                      <option value="">-- Select Guest Room --</option>
                      {activeRooms.map((r: any) => (
                        <option key={r.roomNumber} value={r.roomNumber}>
                          Room {r.roomNumber} — {r.guestName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleConfirmRoomOrder(settleChoiceOrder, selectedRoomNumber)}
                    className="w-full rounded-lg bg-amber-800 py-2.5 text-xs font-bold text-white hover:bg-amber-900 transition shadow-sm"
                  >
                    Post to Room Folio & Settle Table
                  </button>
                </div>

                {/* Option 2: Pay Direct at POS */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 space-y-2">
                  <span className="text-xs font-bold text-emerald-900 block">
                    Option B: Pay Direct Now (Walk-in / Cash / Card)
                  </span>
                  <p className="text-[11px] text-gray-600">
                    Settle immediately at the cashier counter via Cash, Card Terminal, or LankaQR.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const temp = settleChoiceOrder;
                      setSettleChoiceOrder(null);
                      setSettleOrderItem(temp);
                    }}
                    className="w-full rounded-lg bg-emerald-700 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-sm"
                  >
                    Collect Payment at POS Counter
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setSettleChoiceOrder(null)}
                  className="w-full text-center text-xs text-gray-500 hover:underline pt-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
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

function getStatusClass(status: string) {
  if (status === "SERVED" || status === "COMPLETED") {
    return "bg-green-100 text-green-700";
  }

  if (status === "IN_PROGRESS") {
    return "bg-blue-100 text-blue-700";
  }

  if (status === "CANCELLED") {
    return "bg-red-100 text-red-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

function PaymentBadge({ status }: { status: string }) {
  const className =
    status === "PAID"
      ? "bg-green-100 text-green-700"
      : status === "CHARGE_TO_ROOM"
      ? "bg-blue-100 text-blue-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${className}`}>
      {status}
    </span>
  );
}