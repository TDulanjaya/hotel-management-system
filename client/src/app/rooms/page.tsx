"use client";

import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SlidePanel from "@/components/ui/SlidePanel";
import { Bed } from "lucide-react";

const roomTypesList = ["All Rooms", "Suite", "Deluxe", "Standard"];



import { getRooms, deleteRoom as apiDeleteRoom, createRoom } from "@/lib/api/roomApi";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import { getStatusBadgeClass } from "@/lib/utils/statusStyles";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const { user } = useAuthContext();
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const statusFilters = [
    { label: "Available",   count: rooms.filter(r => r.status === "AVAILABLE").length,   color: "green"  },
    { label: "Cleaning",    count: rooms.filter(r => r.status === "CLEANING").length,    color: "yellow" },
    { label: "Occupied",    count: rooms.filter(r => r.status === "OCCUPIED").length,    color: "red"    },
    { label: "Maintenance", count: rooms.filter(r => r.status === "MAINTENANCE").length, color: "gray"   },
  ];

  const displayedRooms = selectedStatus
    ? rooms.filter(r => {
        if (selectedStatus === "Available")   return r.status === "AVAILABLE";
        if (selectedStatus === "Cleaning")    return r.status === "CLEANING";
        if (selectedStatus === "Occupied")    return r.status === "OCCUPIED";
        if (selectedStatus === "Maintenance") return r.status === "MAINTENANCE";
        return true;
      })
    : rooms;

  // Form states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "Standard",
    floor: "Floor 1",
    capacity: 2,
    pricePerNight: 0,
    status: "AVAILABLE",
    description: "",
    image: ""
  });

  const loadRooms = async () => {
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const deleteRoomRecord = async (id: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return;
    try {
      await apiDeleteRoom(id);
      setRooms(prev => prev.filter(r => r.id !== id));
      alert("Room deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete room.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createRoom({
        ...formData,
        capacity: Number(formData.capacity),
        pricePerNight: Number(formData.pricePerNight),
      });
      setPanelOpen(false);
      loadRooms();
      // Reset form
      setFormData({
        roomNumber: "", roomType: "Standard", floor: "Floor 1", capacity: 2, pricePerNight: 0,
        status: "AVAILABLE", description: "", image: ""
      });
    } catch (err: any) {
      setError(err.message || "Failed to add room");
    } finally {
      setLoading(false);
    }
  };

  const canEdit = user?.role === "OWNER" || user?.role === "MANAGER" || user?.role === "RECEPTIONIST";
  const canDelete = user?.role === "OWNER" || user?.role === "MANAGER";

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "RECEPTIONIST"]}>
      <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
        <AppSidebar />

        <main className="lg:ml-[280px]">
          <header className="sticky top-0 z-20 flex h-[80px] items-center justify-between border-b border-[#d9cfbd] bg-[#f8f5ef]/95 px-8 backdrop-blur-xl">
            <div className="hidden items-center gap-3 xl:flex">
              <p className="text-xl font-semibold leading-tight">
                LuxeStay <br /> Operations
              </p>
            </div>

            <div className="flex flex-1 justify-center">
              <div className="flex w-full max-w-[520px] items-center gap-3 rounded-full border border-[#d9cfbd] bg-white px-5 py-3 shadow-sm">
                <span className="text-xl">⌕</span>

                <input
                  type="text"
                  placeholder="Search rooms, guests, bookings..."
                  className="w-full bg-transparent text-lg outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-5">
              <button className="text-2xl transition hover:scale-110">
                ♧
              </button>

              <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-[#d8b328] bg-white shadow">
                🧑
              </div>
            </div>
          </header>

          <section className="px-8 py-10">
            <div className="room-fade mb-12 flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                  Rooms Module
                </p>

                <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                  Room Management
                </h1>

                <p className="mt-2 text-xl text-[#3f3b35]">
                  Manage inventory, monitor room status, and handle maintenance.
                </p>
              </div>

              <button 
                onClick={() => setPanelOpen(true)}
                className="rounded-2xl bg-[#d8b328] px-8 py-4 text-lg font-semibold text-[#4c3a00] shadow-lg transition hover:-translate-y-1 hover:bg-[#f2c426] hover:shadow-xl"
              >
                ⊕ Add Room
              </button>
            </div>

            <div className="room-fade delay-100 mb-5 flex flex-wrap items-center gap-5">
              <div className="flex overflow-hidden rounded-xl bg-[#ebe8e2] p-1">
                {roomTypesList.map((type, index) => (
                  <button
                    key={type}
                    className={`px-8 py-3 text-lg transition ${
                      index === 0
                        ? "rounded-lg bg-white text-[#806300] shadow"
                        : "text-[#4c4032] hover:bg-white/60"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="hidden h-12 w-px bg-[#d9cfbd] md:block" />
            </div>

            <div className="room-fade delay-150 mb-8 flex flex-wrap gap-3">
              {statusFilters.map((filter) => {
                const badgeClass = getStatusBadgeClass(filter.label);

                return (
                  <button
                    key={filter.label}
                    onClick={() => setSelectedStatus(selectedStatus === filter.label ? null : filter.label)}
                    className={`flex items-center gap-3 rounded-full border px-5 py-3 text-lg transition hover:-translate-y-1 hover:shadow-md ${badgeClass} ${selectedStatus === filter.label ? "ring-2 ring-current font-extrabold" : ""}`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full bg-current`}
                    />
                    {filter.label} ({filter.count})
                  </button>
                );
              })}
            </div>

            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
              {displayedRooms.length === 0 ? (
                <div className="col-span-full rounded-2xl border border-[#d9cfbd] bg-white p-10 text-center shadow-sm">
                  <p className="text-xl font-bold text-[#735c00]">No rooms found</p>
                  <p className="mt-2 text-[#4d4635]">Add a new room to get started.</p>
                </div>
              ) : (
                displayedRooms.map((room, index) => {
                  const badgeClass = getStatusBadgeClass(room.status);
                  const color = room.status === "AVAILABLE" ? "green" : room.status === "CLEANING" ? "yellow" : room.status === "OCCUPIED" ? "red" : "gray";
  
                  return (
                    <article
                      key={room.id || index}
                      className={`room-card room-fade rounded-2xl border border-[#d9cfbd] border-l-4 bg-white p-7 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl border-l-current`}
                      style={{ animationDelay: `${0.18 + index * 0.07}s` }}
                    >
                      <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-extrabold">
                            Room {room.roomNumber}
                          </h2>
  
                          <p className="mt-1 text-xl text-[#3f3b35]">
                            {room.roomType}
                          </p>
  
                          <p className="mt-1 text-lg text-[#3f3b35]">
                            Cap: {room.capacity} • {room.floor}
                          </p>
                        </div>
  
                        <span
                          className={`rounded-full px-4 py-2 text-sm font-extrabold tracking-widest ${badgeClass}`}
                        >
                          {room.status}
                        </span>
                      </div>
  
                      <div className="mb-6 flex min-h-[58px] items-center gap-3 text-lg text-[#3f3b35]">
                        <span className="text-xl">
                          {color === "red"
                            ? "♙"
                            : color === "yellow"
                            ? "▥"
                            : color === "gray"
                            ? "♨"
                            : "◉"}
                        </span>
  
                        <span
                          className={
                            color === "gray" ? "text-red-600" : ""
                          }
                        >
                          {room.description || "No notes"}
                        </span>
                      </div>
  
                      <div className="mb-6">
                        <strong className="text-2xl">Rs {room.pricePerNight}</strong>
                        <span className="text-lg text-[#3f3b35]"> / night</span>
                      </div>
  
                      <div className="grid grid-cols-3 gap-2">
                        <button className="rounded-xl bg-[#ece9e2] px-2 py-3 text-sm font-bold text-[#181818] transition hover:bg-[#ded8cc]">
                          View
                        </button>
  
                        {canEdit && (
                          <Link
                            href={`/rooms/edit?id=${room.id}`}
                            className="rounded-xl border border-[#806300] bg-white px-2 py-3 text-center text-sm font-bold text-[#806300] transition hover:-translate-y-1 hover:shadow-lg"
                          >
                            Edit
                          </Link>
                        )}

                        {canDelete && (
                          <button
                            onClick={() => deleteRoomRecord(room.id)}
                            className="rounded-xl bg-red-100 px-2 py-3 text-sm font-bold text-red-700 transition hover:-translate-y-1 hover:bg-red-200 hover:shadow-lg"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        </main>

        <SlidePanel 
          open={panelOpen} 
          onClose={() => setPanelOpen(false)} 
          title="Add New Room" 
          subtitle="Configure a new room to add to the hotel inventory"
          icon={<Bed className="h-5 w-5" />}
        >
          {error && <div className="mb-4 text-red-600 font-bold">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#4d4635]">Room Number</label>
                <input required type="text" name="roomNumber" value={formData.roomNumber} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#4d4635]">Room Type</label>
                <select name="roomType" value={formData.roomType} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3">
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Presidential Suite">Presidential Suite</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#4d4635]">Floor</label>
                <input required type="text" name="floor" value={formData.floor} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#4d4635]">Capacity (Guests)</label>
                <input required type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#4d4635]">Price Per Night</label>
                <input required type="number" name="pricePerNight" value={formData.pricePerNight} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#4d4635]">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3">
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="OCCUPIED">OCCUPIED</option>
                  <option value="CLEANING">CLEANING</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#4d4635]">Image URL (Optional)</label>
              <input type="text" name="image" value={formData.image} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#4d4635]">Description / Note</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" />
            </div>

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={() => setPanelOpen(false)} className="flex-1 rounded-xl border border-[#d0c5af] px-8 py-4 font-bold text-[#4d4635] transition hover:bg-[#ece9e2]">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="flex-1 rounded-xl bg-[#735c00] px-8 py-4 font-bold text-white transition hover:bg-[#d4af37]">
                {loading ? "Saving..." : "Save Room"}
              </button>
            </div>
          </form>
        </SlidePanel>

      </div>
    </ProtectedRoute>
  );
}
