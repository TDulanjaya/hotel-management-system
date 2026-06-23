"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

const defaultVenues: Venue[] = [
  {
    id: "grand-ballroom",
    name: "Grand Ballroom",
    type: "Indoor",
    capacity: 400,
    size: "5,000 sq ft",
    location: "Level 2",
    status: "Available",
    price: 4500,
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80",
    tags: ["Stage Access", "Smart Lighting", "Wedding Setup"],
  },
  {
    id: "terrace-garden",
    name: "Terrace Garden",
    type: "Outdoor",
    capacity: 250,
    size: "Garden Venue",
    location: "Outdoor Area",
    status: "Available",
    price: 3500,
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
    tags: ["Panoramic View", "Bar Setup", "Outdoor Dining"],
  },
  {
    id: "conference-hall-a",
    name: "Conference Hall A",
    type: "Indoor",
    capacity: 80,
    size: "Modern AV Room",
    location: "Level 1",
    status: "Available",
    price: 1800,
    image:
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=900&q=80",
    tags: ["Projector", "Video Conference", "Corporate Setup"],
  },
  {
    id: "conference-hall-b",
    name: "Conference Hall B",
    type: "Indoor",
    capacity: 40,
    size: "Breakout Room",
    location: "Level 1",
    status: "Maintenance",
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
    tags: ["Private Foyer", "Small Meetings", "Catering Spot"],
  },
];

function getStatusClass(status: string) {
  if (status === "Available") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Booked") {
    return "bg-yellow-100 text-yellow-700";
  }

  if (status === "Maintenance") {
    return "bg-red-100 text-red-700";
  }

  return "bg-slate-100 text-slate-700";
}

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);

  useEffect(() => {
    const savedVenues = localStorage.getItem("hotel_venues");

    if (savedVenues) {
      setVenues(JSON.parse(savedVenues));
    } else {
      localStorage.setItem("hotel_venues", JSON.stringify(defaultVenues));
      setVenues(defaultVenues);
    }
  }, []);

  const deleteVenue = (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this venue?");

    if (!confirmed) {
      return;
    }

    const updatedVenues = venues.filter((venue) => venue.id !== id);
    setVenues(updatedVenues);
    localStorage.setItem("hotel_venues", JSON.stringify(updatedVenues));
  };

  const resetDefaultVenues = () => {
    const confirmed = confirm("Reset venue list to default data?");

    if (!confirmed) {
      return;
    }

    localStorage.setItem("hotel_venues", JSON.stringify(defaultVenues));
    setVenues(defaultVenues);
  };

  const totalCapacity = venues.reduce((total, venue) => total + venue.capacity, 0);
  const availableCount = venues.filter(
    (venue) => venue.status === "Available"
  ).length;
  const averagePrice =
    venues.length > 0
      ? Math.round(
          venues.reduce((total, venue) => total + venue.price, 0) / venues.length
        )
      : 0;

  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "events"]}>
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
                Reset Defaults
              </button>

              <Link
                href="/venues/new"
                className="rounded-xl bg-[#d8b328] px-7 py-4 text-lg font-bold text-[#4c3a00] transition hover:-translate-y-1 hover:bg-[#f2c426] hover:shadow-xl"
              >
                + Add Venue
              </Link>
            </div>
          </div>

          <section className="mb-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-wider text-[#806300]">
                Total Venues
              </p>
              <h2 className="mt-3 text-4xl font-extrabold">{venues.length}</h2>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-wider text-[#806300]">
                Available Venues
              </p>
              <h2 className="mt-3 text-4xl font-extrabold">{availableCount}</h2>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-wider text-[#806300]">
                Total Capacity
              </p>
              <h2 className="mt-3 text-4xl font-extrabold">{totalCapacity}</h2>
              <p className="mt-2 text-sm text-[#4d4635]">
                Avg price: ${averagePrice.toLocaleString()}
              </p>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            {venues.map((venue) => (
              <article
                key={venue.id}
                className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="h-64 w-full object-cover"
                />

                <div className="p-6">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                      <h2 className="text-3xl font-bold">{venue.name}</h2>

                      <p className="mt-2 text-[#4d4635]">
                        {venue.type} · {venue.size} · {venue.location}
                      </p>

                      <p className="mt-1 text-[#4d4635]">
                        Capacity: {venue.capacity} guests
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-4 py-2 text-xs font-bold ${getStatusClass(
                        venue.status
                      )}`}
                    >
                      {venue.status}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {venue.tags.map((tag) => (
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
                        ${venue.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        href={`/venues/new?id=${venue.id}`}
                        className="rounded-xl border border-[#735c00] px-5 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteVenue(venue.id)}
                        className="rounded-xl border border-red-200 px-5 py-3 font-bold text-red-700 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}