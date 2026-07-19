"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getRoomById, updateRoom } from "@/lib/api/roomApi";
import { Bed } from "lucide-react";

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

        <main className="page-slide-in px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Rooms Module
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Edit Room
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Update room details, room status, capacity and price.
              </p>
            </div>

            <Link
              href="/rooms"
              className="rounded-xl border border-[#806300] bg-white px-6 py-3 text-center font-bold text-[#806300] transition hover:bg-[#faf8f3]"
            >
              Back to Rooms
            </Link>
          </div>

          <section className="max-w-4xl rounded-2xl border border-[#d0c5af] bg-white p-8 shadow-sm">
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 font-bold text-red-700">
                {error}
              </div>
            )}

            {fetching ? (
              <div className="flex h-48 items-center justify-center text-lg font-bold text-[#806300]">
                Loading room details...
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[#d0c5af] pb-5">
                  <Bed className="text-[#735c00]" />
                  <h2 className="text-2xl font-bold">Room Information</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <InputField
                    label="Room Number *"
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
                      <option value="Presidential Suite">
                        Presidential Suite
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
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

                <div className="grid gap-4 md:grid-cols-2">
                  <InputField
                    label="Price Per Night *"
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

                <div className="flex flex-wrap gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-[#735c00] px-8 py-3 font-bold text-white transition hover:bg-[#d4af37] disabled:opacity-60"
                  >
                    {loading ? "Updating..." : "Update Room"}
                  </button>

                  <Link
                    href="/rooms"
                    className="rounded-xl border border-[#d0c5af] px-8 py-3 font-bold text-[#4d4635] transition hover:bg-[#f5f3ef]"
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

export default function EditRoomPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading edit room...</div>}>
      <EditRoomPageContent />
    </Suspense>
  );
}