"use client";

import { useEffect, useState } from "react";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SlidePanel from "@/components/ui/SlidePanel";
import { getReservations, createReservation, updateReservation, deleteReservation } from "@/lib/api/reservationsApi";
import { useAuthContext } from "@/context/AuthContext";

export default function PageComponent() {
  const { user } = useAuthContext();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  
  const [formData, setFormData] = useState({ guestName: "", roomNumber: "", checkIn: "", checkOut: "", adults: 1, children: 0, status: "PENDING", paymentStatus: "PENDING", totalAmount: 0, notes: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getReservations();
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
    setFormData({ guestName: "", roomNumber: "", checkIn: "", checkOut: "", adults: 1, children: 0, status: "PENDING", paymentStatus: "PENDING", totalAmount: 0, notes: "" });
    setPanelOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditItem(item);
    const mapped: any = {};
    const defaultState: any = { guestName: "", roomNumber: "", checkIn: "", checkOut: "", adults: 1, children: 0, status: "PENDING", paymentStatus: "PENDING", totalAmount: 0, notes: "" };
    const keys = Object.keys(defaultState);
    keys.forEach(k => {
      mapped[k] = item[k] !== undefined && item[k] !== null ? item[k] : defaultState[k];
    });
    setFormData(mapped);
    setPanelOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      try {
        await deleteReservation(id);
        fetchData();
      } catch (err: any) {
        alert("Failed to delete");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editItem) {
        await updateReservation(editItem.id, formData);
      } else {
        await createReservation(formData);
      }
      setPanelOpen(false);
      fetchData();
    } catch (err: any) {
      alert("Failed to save");
    }
  };

  const canEdit = user?.role === "OWNER" || user?.role === "MANAGER" || user?.role === "RECEPTIONIST";
  const canDelete = user?.role === "OWNER" || user?.role === "MANAGER";

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "RECEPTIONIST"]}>
      <div className="flex min-h-screen bg-[#f8f5ef]">
        <AppSidebar />
        <main className="flex-1 p-8 lg:ml-[280px]">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-[#181818]">Reservations</h1>
            <button onClick={handleOpenNew} className="rounded-xl bg-[#806300] px-6 py-2 text-white font-bold hover:bg-[#6b5400]">+ Add</button>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center text-lg text-[#806300]">Loading...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : items.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl bg-white shadow-sm border border-[#d9cfbd]">
              <p className="mb-4 text-xl font-semibold text-gray-500">No records found</p>
              <button onClick={handleOpenNew} className="rounded-xl bg-[#806300] px-6 py-2 text-white font-bold hover:bg-[#6b5400]">+ Add</button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl bg-white shadow-sm border border-[#d9cfbd]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f5eed9] text-[#4c4032]">
                  <tr>
                    <th className="p-4 font-bold">Guest Name</th><th className="p-4 font-bold">Room</th><th className="p-4 font-bold">Check-in</th><th className="p-4 font-bold">Check-out</th><th className="p-4 font-bold">Adults</th><th className="p-4 font-bold">Status</th><th className="p-4 font-bold">Payment Status</th><th className="p-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d9cfbd]">
                  {items.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      
                      <td className="p-4 font-semibold">{item.guestName}</td>
                      <td className="p-4">{item.roomNumber}</td>
                      <td className="p-4">{item.checkIn}</td>
                      <td className="p-4">{item.checkOut}</td>
                      <td className="p-4">{item.adults}</td>
                      <td className="p-4">{item.status}</td>
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

          <SlidePanel open={panelOpen} onClose={() => setPanelOpen(false)} title={editItem ? "Edit" : "Add"}>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div><label className="block text-sm font-bold">Guest Name *</label><input required className="w-full rounded border p-2" value={formData.guestName} onChange={e => setFormData({...formData, guestName: e.target.value})} /></div>
              <div><label className="block text-sm font-bold">Room Number *</label><input required className="w-full rounded border p-2" value={formData.roomNumber} onChange={e => setFormData({...formData, roomNumber: e.target.value})} /></div>
              <div><label className="block text-sm font-bold">Check-in *</label><input type="date" required className="w-full rounded border p-2" value={formData.checkIn} onChange={e => setFormData({...formData, checkIn: e.target.value})} /></div>
              <div><label className="block text-sm font-bold">Check-out *</label><input type="date" required className="w-full rounded border p-2" value={formData.checkOut} onChange={e => setFormData({...formData, checkOut: e.target.value})} /></div>
              <div><label className="block text-sm font-bold">Adults</label><input type="number" className="w-full rounded border p-2" value={formData.adults} onChange={e => setFormData({...formData, adults: parseInt(e.target.value) || 1})} /></div>
              <div><label className="block text-sm font-bold">Children</label><input type="number" className="w-full rounded border p-2" value={formData.children} onChange={e => setFormData({...formData, children: parseInt(e.target.value) || 0})} /></div>
              <div><label className="block text-sm font-bold">Status</label><select className="w-full rounded border p-2" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}><option>PENDING</option><option>CONFIRMED</option><option>CHECKED_IN</option><option>CHECKED_OUT</option><option>CANCELLED</option></select></div>
              <div><label className="block text-sm font-bold">Payment Status</label><select className="w-full rounded border p-2" value={formData.paymentStatus} onChange={e => setFormData({...formData, paymentStatus: e.target.value})}><option>PENDING</option><option>PAID</option><option>PARTIAL</option></select></div>
              <div><label className="block text-sm font-bold">Total Amount</label><input type="number" className="w-full rounded border p-2" value={formData.totalAmount} onChange={e => setFormData({...formData, totalAmount: parseFloat(e.target.value) || 0})} /></div>
              <div><label className="block text-sm font-bold">Notes</label><textarea className="w-full rounded border p-2" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} /></div>

              <button type="submit" className="w-full rounded bg-[#806300] py-3 text-white font-bold hover:bg-[#6b5400]">Save</button>
            </form>
          </SlidePanel>
        </main>
      </div>
    </ProtectedRoute>
  );
}
