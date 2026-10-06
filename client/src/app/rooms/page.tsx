"use client";

import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SlidePanel from "@/components/ui/SlidePanel";
import { Bed, Pencil, Plus, Trash2, Search, X, Users, DoorOpen, Sparkles } from "lucide-react";
import {
  deleteRoom as apiDeleteRoom,
  createRoom,
  updateRoom,
} from "@/lib/api/roomApi";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { swrRawFetcher } from "@/lib/api/authApi";
import { AuthUser, getUser } from "@/utils/auth";
import { getStatusBadgeClass } from "@/lib/utils/statusStyles";

const roomTypesList = ["All Rooms", "Suite", "Deluxe", "Standard"];

export default function RoomsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    setUser(getUser());
  }, []);

  const [currentRole, setCurrentRole] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [loading, setLoading] = useState(false);
  const [formError, setError] = useState("");

  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "Standard",
    floor: "Floor 1",
    capacity: 2,
    pricePerNight: 0,
    status: "AVAILABLE",
    description: "",
    image: "",
  });

  const canEdit =
    currentRole === "OWNER" ||
    currentRole === "MANAGER" ||
    currentRole === "RECEPTIONIST";

  const canDelete = currentRole === "OWNER" || currentRole === "MANAGER";

  const statusFilters = [
    { label: "Available", value: "AVAILABLE" },
    { label: "Cleaning", value: "CLEANING" },
    { label: "Occupied", value: "OCCUPIED" },
    { label: "Maintenance", value: "MAINTENANCE" },
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

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

  const searchValue = debouncedSearch || selectedStatus;
  const swrKey = `/api/rooms?page=${page}&size=${size}${searchValue ? `&search=${encodeURIComponent(searchValue)}` : ""}`;
  const { data: pageData, error: swrError, isLoading: pageLoading, mutate } = useSWR(swrKey, swrRawFetcher, {
    keepPreviousData: true,
  });

  const rooms = useMemo(() => {
    if (!pageData) return [];
    if (Array.isArray(pageData.content)) return pageData.content;
    if (Array.isArray(pageData)) return pageData;
    return [];
  }, [pageData]);

  const totalPages = pageData?.totalPages || 1;
  const totalElements = pageData?.totalElements || (Array.isArray(pageData) ? pageData.length : 0);
  const error = formError || swrError?.message || "";

  const resetForm = () => {
    setFormData({
      roomNumber: "",
      roomType: "Standard",
      floor: "Floor 1",
      capacity: 2,
      pricePerNight: 0,
      status: "AVAILABLE",
      description: "",
      image: "",
    });
  };

  const deleteRoomRecord = async (id: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return;

    try {
      await apiDeleteRoom(id);
      mutate();
      alert("Room deleted successfully.");
    } catch (err: any) {
      alert(err.message || "Failed to delete room.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]:
        name === "capacity" || name === "pricePerNight" ? Number(value) : value,
    });
  };

  const handleOpenAdd = () => {
    setEditItem(null);
    setError("");
    resetForm();
    setPanelOpen(true);
  };

  const handleOpenEdit = (room: any) => {
    setEditItem(room);
    setError("");
    setFormData({
      roomNumber: room.roomNumber || "",
      roomType: room.roomType || "Standard",
      floor: room.floor || "Floor 1",
      capacity: Number(room.capacity || 2),
      pricePerNight: Number(room.pricePerNight || 0),
      status: room.status || "AVAILABLE",
      description: room.description || "",
      image: room.image || "",
    });
    setPanelOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.roomNumber || !formData.roomType || !formData.floor) {
      setError("Room number, room type and floor are required.");
      return;
    }

    if (Number(formData.capacity) <= 0) {
      setError("Capacity must be greater than 0.");
      return;
    }

    if (Number(formData.pricePerNight) < 0) {
      setError("Price cannot be negative.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        capacity: Number(formData.capacity),
        pricePerNight: Number(formData.pricePerNight),
      };

      if (editItem) {
        await updateRoom(editItem.id, payload);
      } else {
        await createRoom(payload);
      }

      setPanelOpen(false);
      setEditItem(null);
      resetForm();
      mutate();
    } catch (err: any) {
      setError(err.message || "Failed to save room.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "RECEPTIONIST"]}>
      <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
        <AppSidebar />

        <main className="lg:ml-[280px]">
          {/* Topbar Header */}
          <header className="sticky top-0 z-20 flex h-[72px] sm:h-[80px] items-center justify-between border-b border-[#d9cfbd] bg-[#f8f5ef]/95 pl-16 pr-4 sm:px-8 backdrop-blur-xl gap-3">
            <div className="hidden items-center gap-3 xl:flex shrink-0">
              <p className="text-lg font-bold leading-tight text-[#1b1c1a]">
                The Camellia <br />
                <span className="text-xs uppercase tracking-wider text-[#735c00]">Reserve</span>
              </p>
            </div>

            <div className="flex flex-1 justify-center max-w-[500px]">
              <div className="flex w-full items-center gap-2.5 rounded-full border border-[#d9cfbd] bg-white px-3.5 sm:px-5 py-2 sm:py-2.5 shadow-sm">
                <Search className="h-4 w-4 text-[#8a8175] shrink-0" />

                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedStatus("");
                  }}
                  className="w-full bg-transparent text-sm sm:text-base outline-none placeholder:text-slate-400"
                />

                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedStatus("");
                    }}
                    className="text-xs font-bold text-[#8a8175] hover:text-[#181818]"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <div className="hidden text-right md:block">
                <p className="text-sm font-bold text-[#181818] leading-tight">
                  {user?.name || "Staff Member"}
                </p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#806300]">
                  {user?.role || "Front Desk"}
                </p>
              </div>

              <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border-2 border-[#d8b328] bg-[#101827] text-white font-bold text-sm sm:text-base shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            </div>
          </header>

          <section className="p-4 sm:p-6 lg:p-8">
            <div className="room-fade mb-6 sm:mb-8 flex flex-col justify-between gap-4 sm:gap-6 xl:flex-row xl:items-center">
              <div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#735c00]">
                  <DoorOpen className="h-4 w-4" />
                  <span>Rooms Module</span>
                </div>

                <h1 className="mt-1 sm:mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#735c00]">
                  Room Management
                </h1>

                <p className="mt-1 text-xs sm:text-base text-[#3f3b35]">
                  Manage inventory, monitor room status, and handle maintenance.
                </p>
              </div>

              {canEdit && (
                <button
                  onClick={handleOpenAdd}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#d8b328] px-6 py-3 text-sm sm:text-base font-bold text-[#4c3a00] shadow transition hover:bg-[#f2c426] active:scale-[0.98]"
                >
                  <Plus size={18} />
                  <span>Add Room</span>
                </button>
              )}
            </div>

            {/* Quick Stat Cards */}
            <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <StatCard label="Total Rooms" value={String(totalElements)} />
              <StatCard label="Loaded" value={String(rooms.length)} />
              <StatCard
                label="Available"
                value={String(
                  rooms.filter((r: any) => r.status === "AVAILABLE").length
                )}
              />
              <StatCard
                label="Occupied"
                value={String(
                  rooms.filter((r: any) => r.status === "OCCUPIED").length
                )}
              />
            </div>

            {/* Room Type Filter Pills */}
            <div className="room-fade delay-100 mb-4 flex overflow-x-auto pb-1 scrollbar-none">
              <div className="flex rounded-xl bg-[#ebe8e2] p-1 gap-1">
                {roomTypesList.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedStatus("");
                      setSearchTerm(type !== "All Rooms" ? type : "");
                    }}
                    className={`rounded-lg px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                      searchTerm === type ||
                      (searchTerm === "" && type === "All Rooms")
                        ? "bg-white text-[#806300] shadow-sm"
                        : "text-[#4c4032] hover:bg-white/60"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filters */}
            <div className="room-fade delay-150 mb-6 flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setSelectedStatus("");
                  setPage(0);
                }}
                className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold transition hover:shadow-sm ${
                  !selectedStatus
                    ? "bg-[#181818] text-white border-[#181818]"
                    : "bg-white text-[#4c4032] border-[#d0c5af]"
                }`}
              >
                All Status
              </button>

              {statusFilters.map((filter) => {
                const badgeClass = getStatusBadgeClass(filter.value);

                return (
                  <button
                    key={filter.label}
                    onClick={() => {
                      setSelectedStatus(filter.value);
                      setPage(0);
                      setSearchTerm("");
                    }}
                    className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold transition hover:shadow-sm ${badgeClass} ${
                      selectedStatus === filter.value
                        ? "ring-2 ring-current font-extrabold"
                        : ""
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-current" />
                    {filter.label}
                  </button>
                );
              })}
            </div>

            {error && !panelOpen && (
              <p className="mb-4 font-bold text-red-600">{error}</p>
            )}

            {pageLoading ? (
              <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-[#d9cfbd] bg-white p-6 shadow-sm">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#806300] border-t-transparent"></div>
                <p className="text-sm font-semibold text-[#806300]">Loading rooms...</p>
              </div>
            ) : rooms.length === 0 ? (
              <div className="rounded-2xl border border-[#d9cfbd] bg-white p-8 sm:p-10 text-center shadow-sm">
                <Bed size={36} className="mx-auto mb-3 text-[#735c00]" />
                <p className="text-lg sm:text-xl font-bold text-[#735c00]">
                  No rooms found
                </p>
                <p className="mt-1 text-xs sm:text-sm text-[#4d4635]">
                  Adjust your search or add a new room.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {rooms.map((room: any, index: number) => {
                  const badgeClass = getStatusBadgeClass(room.status);

                  return (
                    <article
                      key={room.id || index}
                      className="room-card room-fade rounded-2xl border border-[#d9cfbd] bg-white p-4 sm:p-6 shadow-sm transition hover:shadow-md hover:border-[#735c00]/50"
                      style={{ animationDelay: `${0.1 + index * 0.04}s` }}
                    >
                      <div className="mb-4 flex items-start justify-between gap-2">
                        <div>
                          <h2 className="text-xl font-extrabold text-[#181818]">
                            Room {room.roomNumber}
                          </h2>

                          <p className="text-sm font-semibold text-[#735c00]">
                            {room.roomType}
                          </p>

                          <p className="text-xs text-[#5c5443] mt-0.5">
                            Cap: {room.capacity} • {room.floor}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide ${badgeClass}`}
                        >
                          {room.status}
                        </span>
                      </div>

                      <div className="mb-4 min-h-[42px] rounded-xl bg-[#fbf9f5] border border-[#f0eae0] p-2.5 text-xs text-[#5c5443]">
                        {room.description || "No specific room notes"}
                      </div>

                      <div className="mb-4 flex items-baseline justify-between">
                        <div>
                          <span className="text-lg sm:text-xl font-extrabold text-[#181818]">
                            Rs {Number(room.pricePerNight || 0).toLocaleString()}
                          </span>
                          <span className="text-xs text-[#5c5443]"> / night</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f0eae0]">
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(room)}
                            className="flex items-center justify-center gap-1.5 rounded-xl border border-[#806300] bg-white py-2.5 text-xs font-bold text-[#806300] transition hover:bg-[#806300] hover:text-white"
                          >
                            <Pencil size={13} />
                            <span>Edit</span>
                          </button>
                        )}

                        {canDelete && (
                          <button
                            onClick={() => deleteRoomRecord(room.id)}
                            className="flex items-center justify-center gap-1.5 rounded-xl bg-red-50 border border-red-200 py-2.5 text-xs font-bold text-red-700 transition hover:bg-red-100"
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[#d9cfbd] pt-6 sm:flex-row">
                <p className="text-xs sm:text-sm text-[#4c4032]">
                  Showing {rooms.length} of {totalElements} rooms
                </p>

                <div className="flex gap-2">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    className="rounded-xl border border-[#d0c5af] bg-white px-3.5 py-1.5 text-xs sm:text-sm font-bold text-[#4d4635] disabled:opacity-50"
                  >
                    Prev
                  </button>

                  <span className="flex items-center px-3 text-xs sm:text-sm font-bold text-[#735c00]">
                    Page {page + 1} of {totalPages}
                  </span>

                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(page + 1)}
                    className="rounded-xl border border-[#d0c5af] bg-white px-3.5 py-1.5 text-xs sm:text-sm font-bold text-[#4d4635] disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>
        </main>

        {/* Room SlidePanel */}
        <SlidePanel
          open={panelOpen}
          onClose={() => setPanelOpen(false)}
          title={editItem ? "Edit Room" : "Add New Room"}
          subtitle={
            editItem
              ? `Updating room details for Room ${editItem.roomNumber}`
              : "Configure a new room to add to the hotel inventory"
          }
          icon={<Bed className="h-5 w-5 text-[#735c00]" />}
        >
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs sm:text-sm font-bold text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <InputField
                label="Room Number *"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                required
              />

              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#4d4635] mb-1">
                  Room Type
                </label>

                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-3.5 py-2.5 sm:py-3 text-base outline-none focus:ring-2 focus:ring-[#735c00]/30"
                >
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Presidential Suite">Presidential Suite</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <InputField
                label="Floor *"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                required
              />

              <InputField
                label="Capacity *"
                name="capacity"
                type="number"
                value={String(formData.capacity)}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <InputField
                label="Price Per Night *"
                name="pricePerNight"
                type="number"
                value={String(formData.pricePerNight)}
                onChange={handleChange}
                required
              />

              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#4d4635] mb-1">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-3.5 py-2.5 sm:py-3 text-base outline-none focus:ring-2 focus:ring-[#735c00]/30"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="OCCUPIED">OCCUPIED</option>
                  <option value="CLEANING">CLEANING</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>
            </div>

            <InputField
              label="Image URL"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />

            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#4d4635] mb-1">
                Description / Note
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-3 text-base outline-none focus:ring-2 focus:ring-[#735c00]/30"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:flex-1 rounded-xl bg-[#735c00] py-3.5 text-base font-bold text-white transition hover:bg-[#8f7300] active:scale-[0.98] disabled:opacity-60 text-center"
              >
                {loading ? "Saving..." : editItem ? "Update Room" : "Save Room"}
              </button>

              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="w-full sm:w-auto rounded-xl border border-[#d0c5af] px-6 py-3.5 text-base font-bold text-[#4d4635] transition hover:bg-[#ece9e2] text-center"
              >
                Cancel
              </button>
            </div>
          </form>
        </SlidePanel>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#d9cfbd] bg-white p-3.5 sm:p-5 shadow-sm">
      <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#7f7663]">
        {label}
      </p>
      <p className="mt-1 text-xl sm:text-2xl font-extrabold text-[#735c00]">{value}</p>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs sm:text-sm font-bold text-[#4d4635] mb-1">
        {label}
      </label>

      <input
        required={required}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-3.5 py-2.5 sm:py-3 text-base text-[#1b1c1a] outline-none focus:ring-2 focus:ring-[#735c00]/30 transition"
      />
    </div>
  );
}