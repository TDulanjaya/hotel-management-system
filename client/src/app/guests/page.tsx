"use client";

import { useEffect, useState } from "react";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SlidePanel from "@/components/ui/SlidePanel";
import { createGuest, updateGuest, deleteGuest } from "@/lib/api/guestsApi";
import { useAuthContext } from "@/context/AuthContext";
import useSWR from "swr";
import { swrFetcher } from "@/lib/api/authApi";

export default function GuestsPage() {
  const { user } = useAuthContext();
  const [panelOpen, setPanelOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

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

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0); // Reset page on search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const query = new URLSearchParams();
  query.append("page", page.toString());
  query.append("size", size.toString());
  if (debouncedSearch) query.append("keyword", debouncedSearch);

  const url = `/api/guests?${query.toString()}`;
  const { data, error: fetchError, mutate } = useSWR(url, swrFetcher);

  const items = data?.content || [];
  const totalPages = data?.totalPages || 1;
  const totalElements = data?.totalElements || 0;
  const loading = !data && !fetchError;

  const handleOpenNew = () => {
    setEditItem(null);
    setFormData({ name: "", email: "", phone: "", nationality: "", idType: "Passport", idNumber: "", address: "", notes: "" });
    setPanelOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditItem(item);
    const mapped: any = {};
    const defaultState: any = { name: "", email: "", phone: "", nationality: "", idType: "Passport", idNumber: "", address: "", notes: "" };
    const keys = Object.keys(defaultState);
    keys.forEach(k => {
      mapped[k] = item[k] !== undefined && item[k] !== null ? item[k] : defaultState[k];
    });
    setFormData(mapped);
    setPanelOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this guest?")) {
      try {
        await deleteGuest(id);
        mutate();
      } catch (err: any) {
        alert("Failed to delete guest");
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
      mutate();
    } catch (err: any) {
      alert(err.message || "Failed to save guest");
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
            
            <div className="flex w-full max-w-[400px] items-center gap-3 rounded-xl border border-[#d9cfbd] bg-white px-4 py-2 shadow-sm mx-4">
              <span className="text-xl">⌕</span>
              <input
                type="text"
                placeholder="Search by name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent outline-none placeholder:text-slate-500"
              />
            </div>

            <button onClick={handleOpenNew} className="rounded-xl bg-[#806300] px-6 py-2 text-white font-bold hover:bg-[#6b5400]">+ Add Guest</button>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center text-lg text-[#806300]">Loading...</div>
          ) : fetchError ? (
            <div className="text-red-600 font-bold text-center mt-10">Error loading guests.</div>
          ) : items.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl bg-white shadow-sm border border-[#d9cfbd]">
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
                  {items.map((item: any) => (
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

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-[#d9cfbd] pt-6">
              <p className="text-sm font-bold text-[#4c4032]">
                Showing {items.length} of {totalElements} guests
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
