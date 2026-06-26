"use client";

import { useEffect, useState } from "react";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SlidePanel from "@/components/ui/SlidePanel";
import { getAll, create } from "@/lib/api/folioApi";
import { useAuthContext } from "@/context/AuthContext";

export default function FolioPage() {
  const { user } = useAuthContext();
  const [folios, setFolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [viewPanelOpen, setViewPanelOpen] = useState(false);
  const [selectedFolio, setSelectedFolio] = useState<any>(null);

  const [chargePanelOpen, setChargePanelOpen] = useState(false);
  const [formData, setFormData] = useState({
    guestName: "",
    roomNumber: "",
    description: "",
    amount: 0,
    category: "Room"
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAll();
      setFolios(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenView = (folio: any) => {
    setSelectedFolio(folio);
    setViewPanelOpen(true);
  };

  const handleOpenCharge = () => {
    setFormData({ guestName: "", roomNumber: "", description: "", amount: 0, category: "Room" });
    setChargePanelOpen(true);
  };

  const handleChargeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create a Folio entry from the charge data as requested
      const payload = {
        guestName: formData.guestName,
        roomNumber: formData.roomNumber,
        totalAmount: formData.amount,
        status: "OPEN",
        lines: [
          {
            description: formData.description,
            amount: formData.amount,
            category: formData.category,
            date: new Date().toISOString()
          }
        ]
      };
      await create(payload);
      setChargePanelOpen(false);
      fetchData();
    } catch (err: any) {
      alert("Failed to add charge");
    }
  };

  const canAddCharge = user?.role === "OWNER" || user?.role === "MANAGER" || user?.role === "RECEPTIONIST";

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "RECEPTIONIST"]}>
      <div className="flex min-h-screen bg-[#f8f5ef]">
        <AppSidebar />
        <main className="flex-1 p-8 lg:ml-[280px]">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-[#181818]">Guest Folios</h1>
            {canAddCharge && (
              <button onClick={handleOpenCharge} className="rounded-xl bg-[#806300] px-6 py-2 text-white font-bold hover:bg-[#6b5400]">
                + Add New Charge
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center text-lg text-[#806300]">Loading...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : folios.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl bg-white shadow-sm border border-[#d9cfbd]">
              <p className="mb-4 text-xl font-semibold text-gray-500">No folios found</p>
              {canAddCharge && (
                <button onClick={handleOpenCharge} className="rounded-xl bg-[#806300] px-6 py-2 text-white font-bold hover:bg-[#6b5400]">
                  + Add New Charge
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl bg-white shadow-sm border border-[#d9cfbd]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f5eed9] text-[#4c4032]">
                  <tr>
                    <th className="p-4 font-bold">Guest</th>
                    <th className="p-4 font-bold">Room</th>
                    <th className="p-4 font-bold">Total Amount</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d9cfbd]">
                  {folios.map((folio: any) => (
                    <tr key={folio.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => handleOpenView(folio)}>
                      <td className="p-4 font-semibold">{folio.guestName}</td>
                      <td className="p-4">{folio.roomNumber}</td>
                      <td className="p-4">{folio.totalAmount}</td>
                      <td className="p-4">{folio.status}</td>
                      <td className="p-4">
                        <button className="text-blue-600 font-semibold hover:underline">View Lines</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* VIEW LINES PANEL */}
          <SlidePanel open={viewPanelOpen} onClose={() => setViewPanelOpen(false)} title="Folio Line Items">
            {selectedFolio && (
              <div>
                <div className="mb-4 text-sm font-semibold">
                  <p>Guest: {selectedFolio.guestName}</p>
                  <p>Room: {selectedFolio.roomNumber}</p>
                  <p>Total: {selectedFolio.totalAmount}</p>
                </div>
                <div className="space-y-4">
                  {selectedFolio.lines && selectedFolio.lines.length > 0 ? (
                    selectedFolio.lines.map((line: any, idx: number) => (
                      <div key={idx} className="border p-3 rounded bg-gray-50">
                        <p className="font-bold">{line.description}</p>
                        <p className="text-sm">Amount: {line.amount}</p>
                        <p className="text-sm">Category: {line.category}</p>
                        <p className="text-sm">Date: {line.date}</p>
                      </div>
                    ))
                  ) : (
                    <p>No line items found.</p>
                  )}
                </div>
              </div>
            )}
          </SlidePanel>

          {/* ADD CHARGE PANEL */}
          <SlidePanel open={chargePanelOpen} onClose={() => setChargePanelOpen(false)} title="Add New Charge">
            <form onSubmit={handleChargeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold">Guest Name *</label>
                <input required className="w-full rounded border p-2" value={formData.guestName} onChange={e => setFormData({...formData, guestName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold">Room Number *</label>
                <input required className="w-full rounded border p-2" value={formData.roomNumber} onChange={e => setFormData({...formData, roomNumber: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold">Description *</label>
                <input required className="w-full rounded border p-2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold">Amount *</label>
                <input required type="number" className="w-full rounded border p-2" value={formData.amount} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value) || 0})} />
              </div>
              <div>
                <label className="block text-sm font-bold">Category</label>
                <select className="w-full rounded border p-2" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option>Room</option>
                  <option>Restaurant</option>
                  <option>Parking</option>
                  <option>Other</option>
                </select>
              </div>
              <button type="submit" className="w-full rounded bg-[#806300] py-3 text-white font-bold hover:bg-[#6b5400]">
                Create Charge
              </button>
            </form>
          </SlidePanel>
        </main>
      </div>
    </ProtectedRoute>
  );
}
