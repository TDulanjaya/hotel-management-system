"use client";

import { useEffect, useState, useMemo, FormEvent } from "react";
import Link from "next/link";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuthContext } from "@/context/AuthContext";
import { getStatusBadgeClass } from "@/lib/utils/statusStyles";
import SlidePanel from "@/components/ui/SlidePanel";
import ImageUpload from "@/components/ui/ImageUpload";
import { MapPin } from "lucide-react";

type Venue = {
  id: string;
  name: string;
  type: string;
  capacity: number;
  size: string;
  location: string;
  status: string;
  price: number;
  image: string;
  tags: string[];
};

import { getVenues, deleteVenue as apiDeleteVenue, createVenue } from "@/lib/api/venueApi";

const fallbackImage =
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80";
const defaultImage = fallbackImage;


export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuthContext();
  
  const [panelOpen, setPanelOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const [venueName, setVenueName] = useState("");
  const [venueType, setVenueType] = useState("Indoor");
  const [capacity, setCapacity] = useState(100);
  const [size, setSize] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Available");
  const [price, setPrice] = useState(1000);
  const [image, setImage] = useState(defaultImage);
  const [tagsText, setTagsText] = useState("");

  const fetchVenues = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getVenues();
      setVenues(data);
    } catch (error) {
      console.error("Venue fetch error:", error);
      setError("Unable to load venues from server. Please check server server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const deleteVenue = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this venue?");
    if (!confirmed) return;

    try {
      await apiDeleteVenue(id);
      setVenues((previousVenues) =>
        previousVenues.filter((venue) => venue.id !== id)
      );
    } catch (error) {
      console.error("Delete venue error:", error);
      alert("Unable to delete venue. Please check server server.");
    }
  };

  const resetDefaultVenues = () => {
    fetchVenues();
  };

  const totalCapacity = venues.reduce(
    (total, venue) => total + (venue.capacity || 0),
    0
  );

  const availableCount = venues.filter(
    (venue) => venue.status?.toLowerCase() === "available"
  ).length;

  const averagePrice =
    venues.length > 0
      ? Math.round(
          venues.reduce((total, venue) => total + (venue.price || 0), 0) /
            venues.length
        )
      : 0;

  const tags = useMemo(
    () =>
      tagsText
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [tagsText]
  );

  const handleCreateVenue = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormLoading(true);
    setFormError("");

    const venueData = {
      name: venueName,
      type: venueType,
      capacity,
      size,
      location,
      status,
      price,
      image,
      tags,
    };

    try {
      await createVenue(venueData);
      setPanelOpen(false);
      fetchVenues();
      setVenueName("");
      setVenueType("Indoor");
      setCapacity(100);
      setSize("");
      setLocation("");
      setStatus("Available");
      setPrice(1000);
      setImage(defaultImage);
      setTagsText("");
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || "Failed to create venue");
    } finally {
      setFormLoading(false);
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

              <h1 className="mt-3 text-5xl font-extrabold tracking-tight">
                Venue Dashboard
              </h1>

              <p className="mt-3 max-w-3xl text-lg text-[#4d4635]">
                Control hall prices, photos, capacity, status, and venue details
                used by event booking.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={resetDefaultVenues}
                className="rounded-xl border border-[#806300] bg-white px-6 py-4 font-bold text-[#806300] transition hover:bg-[#faf8f3]"
              >
                Refresh Data
              </button>

              <button
                onClick={() => setPanelOpen(true)}
                className="rounded-xl bg-[#d8b328] px-7 py-4 text-lg font-bold text-[#4c3a00] transition hover:-translate-y-1 hover:bg-[#f2c426] hover:shadow-xl"
              >
                + Add Venue
              </button>
            </div>
          </div>

          {loading && (
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-8 text-center shadow-sm">
              <p className="text-lg font-bold text-[#735c00]">
                Loading venues from server...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
              <p className="text-lg font-bold text-red-700">{error}</p>
              <button
                onClick={fetchVenues}
                className="mt-4 rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              <section className="mb-8 grid gap-5 md:grid-cols-3">
                <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                  <p className="text-sm font-bold uppercase tracking-wider text-[#806300]">
                    Total Venues
                  </p>
                  <h2 className="mt-3 text-4xl font-extrabold">
                    {venues.length}
                  </h2>
                </div>

                <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                  <p className="text-sm font-bold uppercase tracking-wider text-[#806300]">
                    Available Venues
                  </p>
                  <h2 className="mt-3 text-4xl font-extrabold">
                    {availableCount}
                  </h2>
                </div>

                <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                  <p className="text-sm font-bold uppercase tracking-wider text-[#806300]">
                    Total Capacity
                  </p>
                  <h2 className="mt-3 text-4xl font-extrabold">
                    {totalCapacity}
                  </h2>
                  <p className="mt-2 text-sm text-[#4d4635]">
                    Avg price: ${averagePrice.toLocaleString()}
                  </p>
                </div>
              </section>

              <section className="grid gap-6 xl:grid-cols-2">
                {venues.length === 0 ? (
                  <div className="col-span-2 rounded-2xl border border-[#d0c5af] bg-white p-10 text-center shadow-sm">
                    <p className="text-xl font-bold text-[#735c00]">
                      No venues found
                    </p>
                    <p className="mt-2 text-[#4d4635]">
                      Create a new venue to get started.
                    </p>
                  </div>
                ) : (
                  venues.map((venue) => (
                  <article
                    key={venue.id}
                    className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <img
                      src={venue.image || fallbackImage}
                      alt={venue.name}
                      className="h-64 w-full object-cover"
                    />

                    <div className="p-6">
                      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                        <div>
                          <h2 className="text-3xl font-bold">{venue.name}</h2>

                          <p className="mt-2 text-[#4d4635]">
                            {venue.type} Â· {venue.size} Â· {venue.location}
                          </p>

                          <p className="mt-1 text-[#4d4635]">
                            Capacity: {venue.capacity} guests
                          </p>
                        </div>

                        <span
                            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider ${getStatusBadgeClass(
                              venue.status
                            )}`}
                        >
                          {venue.status}
                        </span>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {(venue.tags || []).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-[#eee9dd] px-3 py-2 text-xs text-[#4d4635]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-6 flex flex-col justify-between gap-4 border-t border-[#eee5d4] pt-5 md:flex-row md:items-center">
                        <div>
                          <p className="text-sm font-bold uppercase tracking-wider text-[#806300]">
                            Venue Price
                          </p>
                          <p className="text-3xl font-extrabold text-[#735c00]">
                            ${venue.price?.toLocaleString()}
                          </p>
                        </div>

                        <div className="flex gap-3">
                          {(user?.role === "OWNER" || user?.role === "MANAGER" || user?.role === "EVENTS") && (
                            <Link
                              href={`/venues/edit?id=${venue.id}`}
                              className="rounded-xl border border-[#735c00] px-5 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
                            >
                              Edit
                            </Link>
                          )}

                          {(user?.role === "OWNER" || user?.role === "MANAGER") && (
                            <button
                              onClick={() => deleteVenue(venue.id)}
                              className="rounded-xl border border-red-200 px-5 py-3 font-bold text-red-700 transition hover:bg-red-50"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                  ))
                )}
              </section>
            </>
          )}
        </main>

        <SlidePanel 
          open={panelOpen} 
          onClose={() => setPanelOpen(false)} 
          title="Add New Venue" 
          subtitle="Add or update hall price, photo, capacity, status, and venue details."
          icon={<MapPin className="h-5 w-5" />}
        >
          {formError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              {formError}
            </div>
          )}

          <form onSubmit={handleCreateVenue} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-[#4d4635]">
                  Venue / Hall Name
                </label>
                <input
                  type="text"
                  required
                  value={venueName}
                  onChange={(event) => setVenueName(event.target.value)}
                  placeholder="Grand Ballroom"
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
                  onChange={(event) => setPrice(Number(event.target.value))}
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
                  placeholder="5,000 sq ft"
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
                  placeholder="Level 2"
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
                  placeholder="Stage Access, Smart Lighting, Wedding Setup"
                  className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                />
                <p className="mt-2 text-xs text-[#4d4635]">
                  Separate tags using commas.
                </p>
              </div>
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
                disabled={formLoading}
                className="flex-1 rounded-xl bg-[#d8b328] px-8 py-4 font-bold text-[#4c3a00] transition hover:bg-[#f2c426]"
              >
                {formLoading ? "Creating..." : "Save Venue"}
              </button>
            </div>
          </form>
        </SlidePanel>
      </div>
    </ProtectedRoute>
  );
}
