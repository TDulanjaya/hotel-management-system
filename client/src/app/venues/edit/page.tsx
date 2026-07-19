"use client";
import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ImageUpload from "@/components/ui/ImageUpload";
import { getVenueById, updateVenue } from "@/lib/api/venueApi";
import { ArrowLeft, Building2 } from "lucide-react";

const defaultImage =
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80";

export default function EditVenuePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fbf9f5] p-10 text-[#735c00]">
          Loading venue editor...
        </div>
      }
    >
      <EditVenueContent />
    </Suspense>
  );
}

function EditVenueContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const router = useRouter();

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
      if (!id) {
        setError("Venue ID is missing.");
        setFetching(false);
        return;
      }

      try {
        const data = await getVenueById(id);

        setVenueName(data.name || "");
        setVenueType(data.type || "Indoor");
        setCapacity(Number(data.capacity || 100));
        setSize(data.size || "");
        setLocation(data.location || "");
        setStatus(data.status || "Available");
        setPrice(Number(data.price || 0));
        setImage(data.image || defaultImage);
        setTagsText(Array.isArray(data.tags) ? data.tags.join(", ") : "");
      } catch (err: any) {
        setError(err.message || "Failed to load venue details.");
      } finally {
        setFetching(false);
      }
    }

    loadVenue();
  }, [id]);

  const tags = useMemo(
    () =>
      tagsText
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [tagsText]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id) {
      setError("Venue ID is missing.");
      return;
    }

    if (!venueName.trim()) {
      setError("Venue name is required.");
      return;
    }

    if (!size.trim()) {
      setError("Venue size is required.");
      return;
    }

    if (!location.trim()) {
      setError("Venue location is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await updateVenue(id, {
        name: venueName,
        type: venueType,
        capacity: Number(capacity),
        size,
        location,
        status,
        price: Number(price),
        image,
        tags,
      });

      alert("Venue updated successfully.");
      router.push("/venues");
    } catch (err: any) {
      setError(err.message || "Failed to update venue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "EVENTS"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Venue Control
              </p>

              <h1 className="mt-3 text-4xl font-extrabold text-[#735c00]">
                Edit Venue
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Update hall price, photo, capacity, status and venue details.
              </p>
            </div>

            <Link
              href="/venues"
              className="flex items-center gap-2 rounded-xl border border-[#806300] bg-white px-6 py-3 font-bold text-[#806300] transition hover:bg-[#faf8f3]"
            >
              <ArrowLeft size={18} />
              Back to Venues
            </Link>
          </div>

          {fetching ? (
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-8 text-center font-bold text-[#735c00] shadow-sm">
              Loading venue details...
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="grid gap-8 xl:grid-cols-[1fr_0.7fr]"
            >
              <section className="space-y-8">
                <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                  {error && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                      {error}
                    </div>
                  )}

                  <h2 className="flex items-center gap-2 text-2xl font-bold">
                    <Building2 className="text-[#735c00]" />
                    Venue Details
                  </h2>

                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="text-sm font-bold text-[#4d4635]">
                        Venue Name
                      </label>

                      <input
                        type="text"
                        required
                        value={venueName}
                        onChange={(event) => setVenueName(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-[#4d4635]">
                        Venue Type
                      </label>

                      <select
                        value={venueType}
                        onChange={(event) => setVenueType(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                      >
                        <option>Indoor</option>
                        <option>Outdoor</option>
                        <option>Garden</option>
                        <option>Rooftop</option>
                        <option>Conference</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-[#4d4635]">
                        Status
                      </label>

                      <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                      >
                        <option>Available</option>
                        <option>Booked</option>
                        <option>Maintenance</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-[#4d4635]">
                        Capacity
                      </label>

                      <input
                        type="number"
                        min={1}
                        required
                        value={capacity}
                        onChange={(event) =>
                          setCapacity(Number(event.target.value))
                        }
                        className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-[#4d4635]">
                        Price
                      </label>

                      <input
                        type="number"
                        min={0}
                        required
                        value={price}
                        onChange={(event) =>
                          setPrice(Number(event.target.value))
                        }
                        className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-[#4d4635]">
                        Size
                      </label>

                      <input
                        type="text"
                        required
                        value={size}
                        onChange={(event) => setSize(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-[#4d4635]">
                        Location
                      </label>

                      <input
                        type="text"
                        required
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                      />
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
                      <label className="text-sm font-bold text-[#4d4635]">
                        Tags
                      </label>

                      <input
                        type="text"
                        value={tagsText}
                        onChange={(event) => setTagsText(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                      />

                      <p className="mt-2 text-xs text-[#4d4635]">
                        Separate tags using commas.
                      </p>
                    </div>
                  </div>
                </section>

                <div className="flex gap-4">
                  <Link
                    href="/venues"
                    className="flex-1 rounded-xl border border-[#806300] bg-white px-7 py-4 text-center font-bold text-[#806300] transition hover:bg-[#faf8f3]"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-xl bg-[#735c00] px-7 py-4 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
                  >
                    {loading ? "Updating..." : "Update Venue"}
                  </button>
                </div>
              </section>

              <aside className="h-fit overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm xl:sticky xl:top-8">
                <img
                  src={image || defaultImage}
                  alt={venueName || "Venue preview"}
                  className="h-72 w-full object-cover"
                />

                <div className="p-6">
                  <h2 className="text-3xl font-bold">
                    {venueName || "Venue Name"}
                  </h2>

                  <p className="mt-2 text-[#4d4635]">
                    {venueType} · {size || "Size"} · {location || "Location"}
                  </p>

                  <p className="mt-1 text-[#4d4635]">
                    Capacity: {capacity} guests
                  </p>

                  <div className="mt-6 border-t border-[#eee5d4] pt-5">
                    <p className="text-sm font-bold uppercase tracking-wider text-[#806300]">
                      Price
                    </p>

                    <p className="text-4xl font-extrabold text-[#735c00]">
                      Rs {Number(price || 0).toLocaleString()}
                    </p>
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