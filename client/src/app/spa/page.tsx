"use client";
import { AuthUser, getUser } from "@/utils/auth";

import { useEffect, useState } from "react";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SlidePanel from "@/components/ui/SlidePanel";
import OrderForm from "@/components/forms/OrderForm";
import { getSpaBookings, createSpaBooking, updateSpaBooking, deleteSpaBooking } from "@/lib/api/spaApi";

export default function SpaPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    setUser(getUser());
  }, []);

    const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    roomNumber: "",
    guestName: "",
    items: [] as any[],
    notes: "",
    status: "PENDING",
    totalAmount: 0,
    paymentStatus: "PENDING",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getSpaBookings();
      setItems(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenNew = () => {
    setEditItem(null);
    setFormData({ roomNumber: "", guestName: "", items: [], notes: "", status: "PENDING", totalAmount: 0, paymentStatus: "PENDING" });
    setPanelOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditItem(item);
    const mapped: any = {};
    const defaultState: any = { roomNumber: "", guestName: "", items: [], notes: "", status: "PENDING", totalAmount: 0, paymentStatus: "PENDING" };
    const keys = Object.keys(defaultState);
    keys.forEach((k) => {
      mapped[k] = item[k] !== undefined && item[k] !== null ? item[k] : defaultState[k];
    });
    setFormData(mapped);
    setPanelOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteSpaBooking(id);
        fetchData();
      } catch {
        alert("Failed to delete");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editItem) {
        await updateSpaBooking(editItem.id, formData);
      } else {
        await createSpaBooking(formData);
      }
      setPanelOpen(false);
      fetchData();
    } catch {
      alert("Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  const canEdit = user?.role === "OWNER" || user?.role === "MANAGER" || user?.role === "SPA";
  const canDelete = user?.role === "OWNER" || user?.role === "MANAGER";

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "SPA"]}>
      <div className="flex min-h-screen bg-[#f8f5ef]">
        <AppSidebar />
        <main className="flex-1 p-8 lg:ml-[280px]">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-[#181818]">Spa & Wellness</h1>
            <button onClick={handleOpenNew} className="rounded-xl bg-[#806300] px-6 py-2 text-white font-bold hover:bg-[#6b5400]">+ New Booking</button>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center text-lg text-[#806300]">Loading...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : items.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl bg-white shadow-sm border border-[#d9cfbd]">
              <p className="mb-4 text-xl font-semibold text-gray-500">No spa bookings found</p>
              <button onClick={handleOpenNew} className="rounded-xl bg-[#806300] px-6 py-2 text-white font-bold hover:bg-[#6b5400]">+ New Booking</button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl bg-white shadow-sm border border-[#d9cfbd]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f5eed9] text-[#4c4032]">
                  <tr>
                    <th className="p-4 font-bold">Room</th>
                    <th className="p-4 font-bold">Guest</th>
                    <th className="p-4 font-bold">Treatments</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold">Amount</th>
                    <th className="p-4 font-bold">Payment</th>
                    <th className="p-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d9cfbd]">
                  {items.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-4 font-semibold">{item.roomNumber}</td>
                      <td className="p-4">{item.guestName}</td>
                      <td className="p-4">
                        {Array.isArray(item.items) ? (
                          <div className="text-xs">
                            {item.items.map((i: any, idx: number) => (
                              <div key={idx}>{i.quantity}x {i.name}</div>
                            ))}
                          </div>
                        ) : (
                          item.items
                        )}
                      </td>
                      <td className="p-4">{item.status}</td>
                      <td className="p-4">Rs {item.totalAmount}</td>
                      <td className="p-4">{item.paymentStatus}</td>
                      <td className="p-4 flex gap-2">
                        {canEdit && (
                          <button onClick={() => handleOpenEdit(item)} className="text-blue-600 font-semibold hover:underline">Edit</button>
                        )}
                        {canDelete && (
                          <button onClick={() => handleDelete(item.id)} className="text-red-600 font-semibold hover:underline">Delete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <SlidePanel open={panelOpen} onClose={() => setPanelOpen(false)} title={editItem ? "Edit Spa Booking" : "New Spa Booking"}>
            <OrderForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              categories={["Spa"]}
              loading={submitting}
            />
          </SlidePanel>
        </main>
      </div>
    </ProtectedRoute>
  );
}
