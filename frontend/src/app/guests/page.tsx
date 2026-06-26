"use client";

import { useEffect, useState } from "react";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SlidePanel from "@/components/ui/SlidePanel";
import { getGuests, createGuest, updateGuest, deleteGuest } from "@/lib/api/guestsApi";
import { useAuthContext } from "@/context/AuthContext";

export default function GuestsPage() {
  const { user } = useAuthContext();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    nationality: "",
    idType: "Passport",
    idNumber: "",
    address: "",
    notes: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getGuests();
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
    setFormData({ name: "", email: "", phone: "", nationality: "", idType: "Passport", idNumber: "", address: "", notes: "" });
    setPanelOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditItem(item);
    setFormData({
      name: item.name || "",
      email: item.email || "",
      phone: item.phone || "",
      nationality: item.nationality || "",
      idType: item.idType || "Passport",
      idNumber: item.idNumber || "",
      address: item.address || "",
      notes: item.notes || ""
    });
    setPanelOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this guest?")) {
      try {
        await deleteGuest(id);
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
        await updateGuest(editItem.id, formData);
      } else {
        await createGuest(formData);
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
            <h1 className="text-3xl font-extrabold text-[#181818]">Guests</h1>
            <button onClick={handleOpenNew} className="rounded-xl bg-[#806300] px-6 py-2 text-white font-bold hover:bg-[#6b5400]">+ Add Guest</button>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center text-lg text-[#806300]">Loading...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : items.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl bg-white shadow-sm">
              <p className="mb-4 text-xl font-semibold text-gray-500">No guests found</p>
              <button onClick={handleOpenNew} className="rounded-xl bg-[#806300] px-6 py-2 text-white font-bold hover:bg-[#6b5400]">+ Add Guest</button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl bg-white shadow-sm border border-[#d9cfbd]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f5eed9] text-[#4c4032]">
                  <tr>
                    <th className="p-4 font-bold">Name</th>
                    <th className="p-4 font-bold">Email</th>
                    <th className="p-4 font-bold">Phone</th>
                    <th className="p-4 font-bold">Nationality</th>
                    <th className="p-4 font-bold">ID Type</th>
                    <th className="p-4 font-bold">ID Number</th>
                    <th className="p-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d9cfbd]">
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-4 font-semibold">{item.name}</td>
                      <td className="p-4">{item.email}</td>
                      <td className="p-4">{item.phone}</td>
                      <td className="p-4">{item.nationality}</td>
                      <td className="p-4">{item.idType}</td>
                      <td className="p-4">{item.idNumber}</td>
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

          <SlidePanel open={panelOpen} onClose={() => setPanelOpen(false)} title={editItem ? "Edit Guest" : "Add Guest"}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-bold">Name *</label><input required className="w-full rounded border p-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
              <div><label className="block text-sm font-bold">Email *</label><input type="email" required className="w-full rounded border p-2" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
              <div><label className="block text-sm font-bold">Phone</label><input className="w-full rounded border p-2" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
              <div><label className="block text-sm font-bold">Nationality</label><input className="w-full rounded border p-2" value={formData.nationality} onChange={e => setFormData({...formData, nationality: e.target.value})} /></div>
              <div>
                <label className="block text-sm font-bold">ID Type</label>
                <select className="w-full rounded border p-2" value={formData.idType} onChange={e => setFormData({...formData, idType: e.target.value})}>
                  <option>Passport</option>
                  <option>NIC</option>
                  <option>Driving License</option>
                </select>
              </div>
              <div><label className="block text-sm font-bold">ID Number</label><input className="w-full rounded border p-2" value={formData.idNumber} onChange={e => setFormData({...formData, idNumber: e.target.value})} /></div>
              <div><label className="block text-sm font-bold">Address</label><input className="w-full rounded border p-2" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} /></div>
              <div><label className="block text-sm font-bold">Notes</label><textarea className="w-full rounded border p-2" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} /></div>
              <button type="submit" className="w-full rounded bg-[#806300] py-3 text-white font-bold hover:bg-[#6b5400]">Save Guest</button>
            </form>
          </SlidePanel>
        </main>
      </div>
    </ProtectedRoute>
  );
}
