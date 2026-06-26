"use client";
import { useSearchParams } from "next/navigation";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ImageUpload from "@/components/ui/ImageUpload";
import { getVenueById, updateVenue } from "@/lib/api/venueApi";

const defaultImage = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80";

export default function EditVenuePage() {
  const searchParams = useSearchParams();
  const rawId = searchParams.get("id");

  const router = useRouter();
  const params = useParams();
  const id = rawId as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [venueName, setVenueName] = useState("");
  const [venueType, setVenueType] = useState("Indoor");
  const [capacity, setCapacity] = useState(100);
  const [size, setSize] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Available");
  const [price, setPrice] = useState(1000);
  const [image, setImage] = useState(defaultImage);
  const [tagsText, setTagsText] = useState("");

  useEffect(() => {
    async function loadVenue() {
      try {
        const data = await getVenueById(id);
        setVenueName(data.name || "");
        setVenueType(data.type || "Indoor");
        setCapacity(data.capacity || 100);
        setSize(data.size || "");
        setLocation(data.location || "");
        setStatus(data.status || "Available");
        setPrice(data.price || 0);
        setImage(data.image || defaultImage);
        setTagsText(data.tags ? data.tags.join(", ") : "");
      } catch (err: any) {
        setError("Failed to load venue details.");
      } finally {
        setFetching(false);
      }
    }
    loadVenue();
  }, [id]);

  const tags = tagsText.split(",").map((tag) => tag.trim()).filter(Boolean);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await updateVenue(id, {
        name: venueName,
        type: venueType,
        capacity,
        size,
        location,
        status,
        price,
        image,
        tags,
      });
      router.push("/venues");
    } catch (err: any) {
      setError(err.message || "Failed to update venue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "EVENTS"]}>
      <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#806300]">
                Venue Control
              </p>
              <h1 className="mt-3 text-5xl font-extrabold tracking-tight">Edit Venue</h1>
            </div>
            <Link href="/venues" className="rounded-xl border border-[#806300] bg-white px-7 py-4 text-lg font-bold text-[#806300] transition hover:bg-[#faf8f3]">
              Back to Venues
            </Link>
          </div>

          {fetching ? (
            <p>Loading venue details...</p>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-8 xl:grid-cols-[1fr_0.7fr]">
              <section className="space-y-8">
                <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                  {error && <div className="mb-4 text-red-600">{error}</div>}
                  <h2 className="text-2xl font-bold">Venue Details</h2>

                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="text-sm font-bold text-[#4d4635]">Venue Name</label>
                      <input type="text" required value={venueName} onChange={(e) => setVenueName(e.target.value)} className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30" />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-[#4d4635]">Venue Type</label>
                      <select value={venueType} onChange={(e) => setVenueType(e.target.value)} className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                        <option>Indoor</option>
                        <option>Outdoor</option>
                        <option>Garden</option>
                        <option>Rooftop</option>
                        <option>Conference</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-[#4d4635]">Status</label>
                      <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                        <option>Available</option>
                        <option>Booked</option>
                        <option>Maintenance</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-[#4d4635]">Capacity</label>
                      <input type="number" min={1} required value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30" />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-[#4d4635]">Price</label>
                      <input type="number" min={0} required value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30" />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-[#4d4635]">Size</label>
                      <input type="text" required value={size} onChange={(e) => setSize(e.target.value)} className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30" />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-[#4d4635]">Location</label>
                      <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)} className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-bold text-[#4d4635]">
                        Venue Photo
                      </label>
                      <ImageUpload 
                        value={image === defaultImage ? null : image}
                        onChange={(base64) => setImage(base64 || defaultImage)}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm font-bold text-[#4d4635]">Tags (comma separated)</label>
                      <input type="text" value={tagsText} onChange={(e) => setTagsText(e.target.value)} className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30" />
                    </div>
                  </div>
                </section>

                <div className="flex gap-4">
                  <Link href="/venues" className="flex-1 rounded-xl border border-[#806300] bg-white px-7 py-4 text-center font-bold text-[#806300] transition hover:bg-[#faf8f3]">
                    Cancel
                  </Link>
                  <button type="submit" disabled={loading} className="flex-1 rounded-xl bg-[#d8b328] px-7 py-4 font-bold text-[#4c3a00] transition hover:bg-[#f2c426]">
                    {loading ? "Updating..." : "Update Venue"}
                  </button>
                </div>
              </section>

              <aside className="h-fit overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm xl:sticky xl:top-8">
                <img src={image || defaultImage} alt={venueName} className="h-72 w-full object-cover" />
                <div className="p-6">
                  <h2 className="text-3xl font-bold">{venueName || "Venue Name"}</h2>
                  <p className="mt-2 text-[#4d4635]">{venueType} · {size || "Size"} · {location || "Location"}</p>
                  <p className="mt-1 text-[#4d4635]">Capacity: {capacity} guests</p>
                  <div className="mt-6 border-t border-[#eee5d4] pt-5">
                    <p className="text-sm font-bold uppercase tracking-wider text-[#806300]">Price</p>
                    <p className="text-4xl font-extrabold text-[#735c00]">${price.toLocaleString()}</p>
                  </div>
                </div>
              </aside>
            </form>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
