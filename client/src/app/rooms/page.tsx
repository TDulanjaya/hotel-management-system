"use client";

import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SlidePanel from "@/components/ui/SlidePanel";
import { Bed, Pencil, Plus, Trash2 } from "lucide-react";
import {
  deleteRoom as apiDeleteRoom,
  createRoom,
  getRooms,
} from "@/lib/api/roomApi";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import { getStatusBadgeClass } from "@/lib/utils/statusStyles";

const roomTypesList = ["All Rooms", "Suite", "Deluxe", "Standard"];

export default function RoomsPage() {
  const { user } = useAuthContext();

  const [currentRole, setCurrentRole] = useState("");
  const [rooms, setRooms] = useState<any[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

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
    }, 500);

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

  const fetchRooms = async () => {
    setPageLoading(true);
    setError("");

    try {
      const searchValue = debouncedSearch || selectedStatus;

      const data = await getRooms({
        page,
        size,
        search: searchValue,
      });

      setRooms(Array.isArray(data?.content) ? data.content : []);
      setTotalPages(data?.totalPages || 1);
      setTotalElements(data?.totalElements || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load rooms.");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [page, size, debouncedSearch, selectedStatus]);

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
      await fetchRooms();
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
      await createRoom({
        ...formData,
        capacity: Number(formData.capacity),
        pricePerNight: Number(formData.pricePerNight),
      });

      setPanelOpen(false);
      resetForm();
      await fetchRooms();
      alert("Room created successfully.");
    } catch (err: any) {
      setError(err.message || "Failed to add room.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "RECEPTIONIST"]}>
      <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
        <AppSidebar />

        <main className="lg:ml-[280px]">
          <header className="sticky top-0 z-20 flex h-[80px] items-center justify-between border-b border-[#d9cfbd] bg-[#f8f5ef]/95 px-8 backdrop-blur-xl">
            <div className="hidden items-center gap-3 xl:flex">
              <p className="text-xl font-semibold leading-tight">
                The Camellia <br /> Reserve
              </p>
            </div>

            <div className="flex flex-1 justify-center">
              <div className="flex w-full max-w-[520px] items-center gap-3 rounded-full border border-[#d9cfbd] bg-white px-5 py-3 shadow-sm">
                <span className="text-xl">⌕</span>

                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedStatus("");
                  }}
                  className="w-full bg-transparent text-lg outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-5">
              <button className="text-2xl transition hover:scale-110">♧</button>

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

              {canEdit && (
                <button
                  onClick={() => {
                    resetForm();
                    setError("");
                    setPanelOpen(true);
                  }}
                  className="flex items-center gap-2 rounded-2xl bg-[#d8b328] px-8 py-4 text-lg font-semibold text-[#4c3a00] shadow-lg transition hover:-translate-y-1 hover:bg-[#f2c426] hover:shadow-xl"
                >
                  <Plus size={18} />
                  Add Room
                </button>
              )}
            </div>

            <div className="mb-8 grid gap-6 md:grid-cols-4">
              <StatCard label="Total Rooms" value={String(totalElements)} />
              <StatCard label="Loaded" value={String(rooms.length)} />
              <StatCard
                label="Available"
                value={String(
                  rooms.filter((r) => r.status === "AVAILABLE").length
                )}
              />
              <StatCard
                label="Occupied"
                value={String(
                  rooms.filter((r) => r.status === "OCCUPIED").length
                )}
              />
            </div>

            <div className="room-fade delay-100 mb-5 flex flex-wrap items-center gap-5">
              <div className="flex overflow-hidden rounded-xl bg-[#ebe8e2] p-1">
                {roomTypesList.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedStatus("");
                      setSearchTerm(type !== "All Rooms" ? type : "");
                    }}
                    className={`px-8 py-3 text-lg transition ${
                      searchTerm === type ||
                      (searchTerm === "" && type === "All Rooms")
                        ? "rounded-lg bg-white text-[#806300] shadow"
                        : "text-[#4c4032] hover:bg-white/60"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="room-fade delay-150 mb-8 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setSelectedStatus("");
                  setPage(0);
                }}
                className={`flex items-center gap-3 rounded-full border px-5 py-3 text-lg transition hover:-translate-y-1 hover:shadow-md ${
                  !selectedStatus ? "ring-2 ring-current font-extrabold" : ""
                }`}
              >
                All
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
                    className={`flex items-center gap-3 rounded-full border px-5 py-3 text-lg transition hover:-translate-y-1 hover:shadow-md ${badgeClass} ${
                      selectedStatus === filter.value
                        ? "ring-2 ring-current font-extrabold"
                        : ""
                    }`}
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-current" />
                    {filter.label}
                  </button>
                );
              })}
            </div>

            {error && !panelOpen && (
              <p className="mb-4 font-bold text-red-600">{error}</p>
            )}

            {pageLoading ? (
              <div className="flex h-64 items-center justify-center text-lg font-bold text-[#806300]">
                Loading rooms...
              </div>
            ) : rooms.length === 0 ? (
              <div className="rounded-2xl border border-[#d9cfbd] bg-white p-10 text-center shadow-sm">
                <Bed size={42} className="mx-auto mb-4 text-[#735c00]" />
                <p className="text-xl font-bold text-[#735c00]">
                  No rooms found
                </p>
                <p className="mt-2 text-[#4d4635]">
                  Adjust your search or add a new room.
                </p>
              </div>
            ) : (
              <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
                {rooms.map((room: any, index: number) => {
                  const badgeClass = getStatusBadgeClass(room.status);
                  const color =
                    room.status === "AVAILABLE"
                      ? "green"
                      : room.status === "CLEANING"
                      ? "yellow"
                      : room.status === "OCCUPIED"
                      ? "red"
                      : "gray";

                  return (
                    <article
                      key={room.id || index}
                      className="room-card room-fade rounded-2xl border border-[#d9cfbd] border-l-4 border-l-current bg-white p-7 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl"
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

                        <span className={color === "gray" ? "text-red-600" : ""}>
                          {room.description || "No notes"}
                        </span>
                      </div>

                      <div className="mb-6">
                        <strong className="text-2xl">
                          Rs {Number(room.pricePerNight || 0).toLocaleString()}
                        </strong>
                        <span className="text-lg text-[#3f3b35]"> / night</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <button className="rounded-xl bg-[#ece9e2] px-2 py-3 text-sm font-bold text-[#181818] transition hover:bg-[#ded8cc]">
                          View
                        </button>

                        {canEdit && (
                          <Link
                            href={`/rooms/edit?id=${room.id}`}
                            className="flex items-center justify-center gap-1 rounded-xl border border-[#806300] bg-white px-2 py-3 text-center text-sm font-bold text-[#806300] transition hover:-translate-y-1 hover:shadow-lg"
                          >
                            <Pencil size={14} />
                            Edit
                          </Link>
                        )}

                        {canDelete && (
                          <button
                            onClick={() => deleteRoomRecord(room.id)}
                            className="flex items-center justify-center gap-1 rounded-xl bg-red-100 px-2 py-3 text-sm font-bold text-red-700 transition hover:-translate-y-1 hover:bg-red-200 hover:shadow-lg"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#d9cfbd] pt-6 md:flex-row">
                <p className="text-lg text-[#4c4032]">
                  Showing {rooms.length} of {totalElements} rooms
                </p>

                <div className="flex gap-2">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    className="rounded-xl border border-[#d0c5af] bg-white px-4 py-2 font-bold text-[#4d4635] disabled:opacity-50"
                  >
                    Prev
                  </button>

                  <span className="flex items-center px-4 font-bold text-[#735c00]">
                    Page {page + 1} of {totalPages}
                  </span>

                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(page + 1)}
                    className="rounded-xl border border-[#d0c5af] bg-white px-4 py-2 font-bold text-[#4d4635] disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>
        </main>

        <SlidePanel
          open={panelOpen}
          onClose={() => setPanelOpen(false)}
          title="Add New Room"
          subtitle="Configure a new room to add to the hotel inventory"
          icon={<Bed className="h-5 w-5" />}
        >
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 font-bold text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Room Number"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                required
              />

              <div>
                <label className="block text-sm font-bold text-[#4d4635]">
                  Room Type
                </label>

                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
                >
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Presidential Suite">Presidential Suite</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Floor"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                required
              />

              <InputField
                label="Capacity"
                name="capacity"
                type="number"
                value={String(formData.capacity)}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Price Per Night"
                name="pricePerNight"
                type="number"
                value={String(formData.pricePerNight)}
                onChange={handleChange}
                required
              />

              <div>
                <label className="block text-sm font-bold text-[#4d4635]">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
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
              <label className="block text-sm font-bold text-[#4d4635]">
                Description / Note
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="flex-1 rounded-xl border border-[#d0c5af] px-8 py-4 font-bold text-[#4d4635] transition hover:bg-[#ece9e2]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-[#735c00] px-8 py-4 font-bold text-white transition hover:bg-[#d4af37] disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Room"}
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
    <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-widest text-[#4d4635]">
        {label}
      </p>

      <p className="mt-2 text-3xl font-extrabold text-[#735c00]">{value}</p>
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-[#4d4635]">{label}</label>

      <input
        required={required}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
      />
    </div>
  );
}