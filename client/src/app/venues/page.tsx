"use client";
import { AuthUser, getUser } from "@/utils/auth";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getStatusBadgeClass } from "@/lib/utils/statusStyles";
import SlidePanel from "@/components/ui/SlidePanel";
import ImageUpload from "@/components/ui/ImageUpload";
import useSWR from "swr";
import {
  Building2,
  Edit,
  MapPin,
  Plus,
  RefreshCw,
  Trash2,
  Users,
} from "lucide-react";
import {
  getVenues,
  deleteVenue as apiDeleteVenue,
  createVenue,
} from "@/lib/api/venueApi";

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

const fallbackImage =
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80";

const defaultImage = fallbackImage;

export default function VenuesPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    setUser(getUser());
  }, []);

  const [currentRole, setCurrentRole] = useState("");
  const { data: rawVenues, mutate, isLoading: isSwrLoading, error: swrError } = useSWR<Venue[]>("/api/venues");
  const venues = useMemo(() => (Array.isArray(rawVenues) ? rawVenues : []), [rawVenues]);
  const loading = !rawVenues && isSwrLoading;
  const error = swrError?.message || "";

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

  const canManage =
    currentRole === "OWNER" ||
    currentRole === "MANAGER" ||
    currentRole === "EVENTS";

  const canDelete = currentRole === "OWNER" || currentRole === "MANAGER";

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

  const deleteVenue = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this venue?");
    if (!confirmed) return;

    try {
      await apiDeleteVenue(id);
      mutate();
      alert("Venue deleted successfully.");
    } catch (err: any) {
      alert(err.message || "Unable to delete venue.");
    }
  };

  const totalCapacity = useMemo(
    () =>
      venues.reduce(
        (total, venue) => total + Number(venue.capacity || 0),
        0
      ),
    [venues]
  );

  const availableCount = useMemo(
    () =>
      venues.filter(
        (venue) => venue.status?.toLowerCase() === "available"
      ).length,
    [venues]
  );

  const averagePrice = useMemo(
    () =>
      venues.length > 0
        ? Math.round(
            venues.reduce((total, venue) => total + Number(venue.price || 0), 0) /
              venues.length
          )
        : 0,
    [venues]
  );

  const tags = useMemo(
    () =>
      tagsText
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [tagsText]
  );

  const resetForm = () => {
    setVenueName("");
    setVenueType("Indoor");
    setCapacity(100);
    setSize("");
    setLocation("");
    setStatus("Available");
    setPrice(1000);
    setImage(defaultImage);
    setTagsText("");
    setFormError("");
  };

  const handleOpenNew = () => {
    resetForm();
    setPanelOpen(true);
  };

  const handleCreateVenue = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!venueName.trim()) {
      setFormError("Venue name is required.");
      return;
    }

    if (!size.trim()) {
      setFormError("Venue size is required.");
      return;
    }

    if (!location.trim()) {
      setFormError("Venue location is required.");
      return;
    }

    setFormLoading(true);
    setFormError("");

    const venueData = {
      name: venueName,
      type: venueType,
      capacity: Number(capacity),
      size,
      location,
      status,
      price: Number(price),
      image,
      tags,
    };

    try {
      await createVenue(venueData);
      setPanelOpen(false);
      resetForm();
      mutate();
      alert("Venue created successfully.");
    } catch (err: any) {
      setFormError(err.message || "Failed to create venue.");
    } finally {
      setFormLoading(false);
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
                Venue Dashboard
              </h1>

              <p className="mt-3 max-w-3xl text-[#4d4635]">
                Control hall prices, photos, capacity, status and venue details
                used by event booking.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => mutate()}
                className="flex items-center gap-2 rounded-xl border border-[#806300] bg-white px-6 py-3 font-bold text-[#806300] transition hover:bg-[#faf8f3]"
              >
                <RefreshCw size={18} />
                Refresh
              </button>

              {canManage && (
                <button
                  onClick={handleOpenNew}
                  className="flex items-center gap-2 rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
                >
                  <Plus size={18} />
                  Add Venue
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-8 text-center shadow-sm">
              <p className="text-lg font-bold text-[#735c00]">
                Loading venues from server...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
              <p className="text-lg font-bold text-red-700">{error}</p>

              <button
                onClick={() => mutate()}
                className="mt-4 rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <section className="mb-8 grid gap-5 md:grid-cols-4">
                <StatCard
                  label="Total Venues"
                  value={String(venues.length)}
                  icon={<Building2 />}
                />

                <StatCard
                  label="Available"
                  value={String(availableCount)}
                  icon={<MapPin />}
                />

                <StatCard
                  label="Total Capacity"
                  value={String(totalCapacity)}
                  icon={<Users />}
                />

                <StatCard
                  label="Avg Price"
                  value={`Rs ${averagePrice.toLocaleString()}`}
                  icon={<Building2 />}
                />
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
                      <Image
                        src={venue.image || fallbackImage}
                        alt={venue.name}
                        width={800}
                        height={400}
                        className="h-64 w-full object-cover"
                        unoptimized
                      />

                      <div className="p-6">
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                          <div>
                            <h2 className="text-3xl font-bold">
                              {venue.name}
                            </h2>

                            <p className="mt-2 text-[#4d4635]">
                              {venue.type} · {venue.size} · {venue.location}
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
                              Rs {Number(venue.price || 0).toLocaleString()}
                            </p>
                          </div>

                          <div className="flex gap-3">
                            {canManage && (
                              <Link
                                href={`/venues/edit?id=${venue.id}`}
                                className="flex items-center gap-2 rounded-xl border border-[#735c00] px-5 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
                              >
                                <Edit size={16} />
                                Edit
                              </Link>
                            )}

                            {canDelete && (
                              <button
                                onClick={() => deleteVenue(venue.id)}
                                className="flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 font-bold text-red-700 transition hover:bg-red-50"
                              >
                                <Trash2 size={16} />
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
          subtitle="Add hall price, photo, capacity, status and venue details."
          icon={<MapPin className="h-5 w-5" />}
        >
          {formError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
              {formError}
            </div>
          )}

          <form onSubmit={handleCreateVenue} className="space-y-6">
            <VenueFormFields
              venueName={venueName}
              setVenueName={setVenueName}
              venueType={venueType}
              setVenueType={setVenueType}
              capacity={capacity}
              setCapacity={setCapacity}
              size={size}
              setSize={setSize}
              location={location}
              setLocation={setLocation}
              status={status}
              setStatus={setStatus}
              price={price}
              setPrice={setPrice}
              image={image}
              setImage={setImage}
              tagsText={tagsText}
              setTagsText={setTagsText}
            />

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
                className="flex-1 rounded-xl bg-[#735c00] px-8 py-4 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
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

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4af37] text-[#554300]">
        {icon}
      </div>

      <p className="text-sm font-bold uppercase tracking-widest text-[#4d4635]">
        {label}
      </p>

      <p className="mt-2 text-3xl font-extrabold text-[#735c00]">{value}</p>
    </div>
  );
}

function VenueFormFields({
  venueName,
  setVenueName,
  venueType,
  setVenueType,
  capacity,
  setCapacity,
  size,
  setSize,
  location,
  setLocation,
  status,
  setStatus,
  price,
  setPrice,
  image,
  setImage,
  tagsText,
  setTagsText,
}: any) {
  return (
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
        <label className="text-sm font-bold text-[#4d4635]">Venue Type</label>

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
        <label className="text-sm font-bold text-[#4d4635]">Status</label>

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
        <label className="text-sm font-bold text-[#4d4635]">Capacity</label>

        <input
          type="number"
          min={1}
          required
          value={capacity}
          onChange={(event) => setCapacity(Number(event.target.value))}
          className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-[#4d4635]">Price</label>

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
        <label className="text-sm font-bold text-[#4d4635]">Size</label>

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
        <label className="text-sm font-bold text-[#4d4635]">Location</label>

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
        <label className="text-sm font-bold text-[#4d4635]">Tags</label>

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
  );
}