"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getRoomById, updateRoom } from "@/lib/api/roomApi";
import { Bed, ArrowLeft, Save } from "lucide-react";

function EditRoomPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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

  useEffect(() => {
    async function loadRoom() {
      if (!id) {
        setError("Room ID is missing.");
        setFetching(false);
        return;
      }

      try {
        setFetching(true);
        setError("");

        const data = await getRoomById(id);

        setFormData({
          roomNumber: data.roomNumber || "",
          roomType: data.roomType || "Standard",
          floor: data.floor || "Floor 1",
          capacity: Number(data.capacity || 2),
          pricePerNight: Number(data.pricePerNight || 0),
          status: data.status || "AVAILABLE",
          description: data.description || "",
          image: data.image || "",
        });
      } catch (err: any) {
        setError(err.message || "Failed to load room details.");
      } finally {
        setFetching(false);
      }
    }

    loadRoom();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]:
        name === "capacity" || name === "pricePerNight"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      setError("Room ID is missing.");
      return;
    }

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

    try {
      setLoading(true);
      setError("");

      await updateRoom(id, {
        ...formData,
        capacity: Number(formData.capacity),
        pricePerNight: Number(formData.pricePerNight),
      });

      alert("Room updated successfully.");
      router.push("/rooms");
    } catch (err: any) {
      setError(err.message || "Failed to update room.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "RECEPTIONIST"]}>
      <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
        <AppSidebar />

        <main className="page-slide-in px-4 py-6 pt-16 sm:px-6 sm:py-8 lg:px-8 lg:pt-8 lg:ml-[280px]">
          <div className="mb-6 sm:mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Rooms Module
              </p>

              <h1 className="mt-1 sm:mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#735c00]">
                Edit Room
              </h1>

              <p className="mt-1 text-xs sm:text-sm text-[#4d4635]">
                Update room details, room status, capacity and price.
              </p>
            </div>

            <Link
              href="/rooms"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#806300] bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-[#806300] shadow-sm transition hover:bg-[#faf8f3]"
            >
              <ArrowLeft size={16} />
              <span>Back to Rooms</span>
            </Link>
          </div>

          <section className="max-w-4xl rounded-2xl border border-[#d0c5af] bg-white p-4 sm:p-8 shadow-sm">
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 font-bold text-red-700 text-xs sm:text-sm">
                {error}
              </div>
            )}

            {fetching ? (
              <div className="flex h-48 flex-col items-center justify-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#806300] border-t-transparent"></div>
                <p className="text-sm font-bold text-[#806300]">Loading room details...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 border-b border-[#d0c5af] pb-4 sm:pb-5">
                  <div className="rounded-lg bg-[#735c00]/10 p-2 text-[#735c00]">
                    <Bed className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#181818]">Room Information</h2>
                    <p className="text-xs text-[#7f7663]">Room properties and pricing</p>
                  </div>
                </div>

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
                      <option value="Presidential Suite">
                        Presidential Suite
                      </option>
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

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#735c00] px-8 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-[#8f7300] active:scale-[0.98] disabled:opacity-60 text-center"
                  >
                    <Save size={18} />
                    <span>{loading ? "Updating..." : "Update Room"}</span>
                  </button>

                  <Link
                    href="/rooms"
                    className="rounded-xl border border-[#d0c5af] px-8 py-3.5 text-base font-bold text-[#4d4635] transition hover:bg-[#f5f3ef] text-center"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            )}
          </section>
        </main>
      </div>
    </ProtectedRoute>
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

export default function EditRoomPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading edit room...</div>}>
      <EditRoomPageContent />
    </Suspense>
  );
}