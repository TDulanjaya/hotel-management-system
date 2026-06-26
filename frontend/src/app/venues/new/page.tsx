"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

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

const defaultImage =
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80";

export default function NewVenuePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const editId = searchParams.get("id");
  const isEditMode = Boolean(editId);

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
    if (!editId) {
      return;
    }

    const savedVenues: Venue[] = JSON.parse(
      localStorage.getItem("hotel_venues") || "[]"
    );

    const selectedVenue = savedVenues.find((venue) => venue.id === editId);

    if (!selectedVenue) {
      alert("Venue not found");
      router.push("/venues");
      return;
    }

    setVenueName(selectedVenue.name);
    setVenueType(selectedVenue.type);
    setCapacity(selectedVenue.capacity);
    setSize(selectedVenue.size);
    setLocation(selectedVenue.location);
    setStatus(selectedVenue.status);
    setPrice(selectedVenue.price);
    setImage(selectedVenue.image);
    setTagsText(selectedVenue.tags.join(", "));
  }, [editId, router]);

  const tags = useMemo(
    () =>
      tagsText
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [tagsText]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const savedVenues: Venue[] = JSON.parse(
      localStorage.getItem("hotel_venues") || "[]"
    );

    const venueData: Venue = {
      id:
        editId ||
        venueName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") + `-${Date.now()}`,
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

    let updatedVenues: Venue[];

    if (isEditMode) {
      updatedVenues = savedVenues.map((venue) =>
        venue.id === editId ? venueData : venue
      );
    } else {
      updatedVenues = [venueData, ...savedVenues];
    }

    localStorage.setItem("hotel_venues", JSON.stringify(updatedVenues));
    router.push("/venues");
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
                {isEditMode ? "Edit Venue" : "Add New Venue"}
              </h1>

              <p className="mt-3 max-w-3xl text-lg text-[#4d4635]">
                Add or update hall price, photo, capacity, status, and venue
                details.
              </p>
            </div>

            <Link
              href="/venues"
              className="rounded-xl border border-[#806300] bg-white px-7 py-4 text-lg font-bold text-[#806300] transition hover:bg-[#faf8f3]"
            >
              Back to Venues
            </Link>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-8 xl:grid-cols-[1fr_0.7fr]"
          >
            <section className="space-y-8">
              <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">Venue Details</h2>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
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
                    <label className="text-sm font-bold text-[#4d4635]">
                      Photo URL
                    </label>
                    <input
                      type="url"
                      required
                      value={image}
                      onChange={(event) => setImage(event.target.value)}
                      placeholder="https://example.com/hall-image.jpg"
                      className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
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
                  className="flex-1 rounded-xl bg-[#d8b328] px-7 py-4 font-bold text-[#4c3a00] transition hover:bg-[#f2c426]"
                >
                  {isEditMode ? "Update Venue" : "Save Venue"}
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
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold">
                      {venueName || "Venue Name"}
                    </h2>

                    <p className="mt-2 text-[#4d4635]">
                      {venueType} · {size || "Size"} · {location || "Location"}
                    </p>

                    <p className="mt-1 text-[#4d4635]">
                      Capacity: {capacity} guests
                    </p>
                  </div>

                  <span className="rounded-full bg-[#f5eed9] px-4 py-2 text-xs font-bold text-[#735c00]">
                    {status}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {tags.length === 0 ? (
                    <span className="rounded-md bg-[#eee9dd] px-3 py-2 text-xs text-[#4d4635]">
                      No tags
                    </span>
                  ) : (
                    tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-[#eee9dd] px-3 py-2 text-xs text-[#4d4635]"
                      >
                        {tag}
                      </span>
                    ))
                  )}
                </div>

                <div className="mt-6 border-t border-[#eee5d4] pt-5">
                  <p className="text-sm font-bold uppercase tracking-wider text-[#806300]">
                    Venue Price
                  </p>
                  <p className="text-4xl font-extrabold text-[#735c00]">
                    ${price.toLocaleString()}
                  </p>
                </div>
              </div>
            </aside>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}