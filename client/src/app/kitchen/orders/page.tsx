"use client";
import { AuthUser, getUser } from "@/utils/auth";

import { useEffect, useState } from "react";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SlidePanel from "@/components/ui/SlidePanel";
import OrderForm from "@/components/forms/OrderForm";
import { createKitchenOrder, updateKitchenOrder, deleteKitchenOrder } from "@/lib/api/kitchenApi";
import useSWR from "swr";
import { swrFetcher } from "@/lib/api/authApi";
import { useWebSocket } from "@/hooks/useWebSocket";

export default function PageComponent() {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    setUser(getUser());
  }, []);

    const [panelOpen, setPanelOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({ orderSource: "Restaurant", tableOrRoom: "", guestName: "", items: [] as any[], priority: "NORMAL", status: "QUEUED", notes: "" });

  const { data: items, error: fetchError, mutate } = useSWR("/api/kitchen/orders", swrFetcher);
  const loading = !items && !fetchError;

  useWebSocket("/topic/kitchen", () => {
    mutate(); // Refresh SWR when a WebSocket message is received
  });

  const handleOpenNew = () => {
    setEditItem(null);
    setFormData({ orderSource: "Restaurant", tableOrRoom: "", guestName: "", items: [], priority: "NORMAL", status: "QUEUED", notes: "" });
    setPanelOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditItem(item);
    const mapped: any = {};
    const defaultState: any = { orderSource: "Restaurant", tableOrRoom: "", guestName: "", items: [], priority: "NORMAL", status: "QUEUED", notes: "" };
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
        await deleteKitchenOrder(id);
        mutate();
      } catch (err: any) {
        alert("Failed to delete");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editItem) {
        await updateKitchenOrder(editItem.id, formData);
      } else {
        await createKitchenOrder(formData);
      }
      setPanelOpen(false);
      mutate();
    } catch (err: any) {
      alert("Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  const canEdit = user?.role === "OWNER" || user?.role === "MANAGER" || user?.role === "COOK";
  const canDelete = user?.role === "OWNER" || user?.role === "MANAGER";

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "COOK"]}>
      <div className="flex min-h-screen bg-[#f8f5ef]">
        <AppSidebar />
        <main className="flex-1 p-8 lg:ml-[280px]">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-[#181818]">Kitchen Orders</h1>
            <button onClick={handleOpenNew} className="rounded-xl bg-[#806300] px-6 py-2 text-white font-bold hover:bg-[#6b5400]">+ Add</button>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center text-lg text-[#806300]">Loading...</div>
          ) : fetchError ? (
            <div className="text-red-600">Error loading data.</div>
          ) : !items || items.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl bg-white shadow-sm border border-[#d9cfbd]">
              <p className="mb-4 text-xl font-semibold text-gray-500">No records found</p>
              <button onClick={handleOpenNew} className="rounded-xl bg-[#806300] px-6 py-2 text-white font-bold hover:bg-[#6b5400]">+ Add</button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl bg-white shadow-sm border border-[#d9cfbd]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f5eed9] text-[#4c4032]">
                  <tr>
                    <th className="p-4 font-bold">Order Source</th><th className="p-4 font-bold">Table/Room</th><th className="p-4 font-bold">Guest</th><th className="p-4 font-bold">Items</th><th className="p-4 font-bold">Priority</th><th className="p-4 font-bold">Status</th><th className="p-4 font-bold">Received At</th><th className="p-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d9cfbd]">
                  {items.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      
                      <td className="p-4 font-semibold">{item.orderSource}</td>
                      <td className="p-4">{item.tableOrRoom}</td>
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
                      <td className="p-4">{item.priority}</td>
                      <td className="p-4"><button onClick={() => {
                        const statuses = ["QUEUED", "PREPARING", "READY", "SERVED"];
                        const next = statuses[(statuses.indexOf(item.status) + 1) % statuses.length];
                        updateKitchenOrder(item.id, { ...item, status: next }).then(() => mutate());
                      }} className="rounded bg-gray-100 px-2 py-1 text-xs font-bold">{item.status || "QUEUED"}</button></td>
                      <td className="p-4">{item.receivedAt ? new Date(item.receivedAt).toLocaleString() : ''}</td>

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

          <SlidePanel open={panelOpen} onClose={() => setPanelOpen(false)} title={editItem ? "Edit Order" : "New Order"}>
            <OrderForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              categories={["Menu", "Bites"]}
              loading={submitting}
            />
          </SlidePanel>
        </main>
      </div>
    </ProtectedRoute>
  );
}
