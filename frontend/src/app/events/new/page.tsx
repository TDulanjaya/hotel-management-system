"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/AppSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

type Venue = {
  id: string;
  name: string;
  type: string;
  capacity: number;
  size: string;
  price: number;
  image: string;
  tags: string[];
};

type MenuPackage = {
  id: string;
  name: string;
  description: string;
  priceType: "perPerson" | "fixed";
  price: number;
  category: "Menu" | "Bites" | "Drinks" | "Bar" | "Service";
};

const venues: Venue[] = [
  {
    id: "grand-ballroom",
    name: "Grand Ballroom",
    type: "Indoor",
    capacity: 400,
    size: "5,000 sq ft",
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
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
    tags: ["Private Foyer", "Small Meetings", "Catering Spot"],
  },
];

const eventTypes = [
  "Wedding",
  "Batch Party",
  "Birthday Party",
  "Corporate Gala",
  "Conference",
  "Engagement",
  "Anniversary",
  "Dinner Dance",
];

const menuPackages: MenuPackage[] = [
  {
    id: "platinum-catering",
    name: "Platinum Buffet Menu",
    description: "Full course premium buffet with dessert",
    priceType: "perPerson",
    price: 85,
    category: "Menu",
  },
  {
    id: "gold-buffet",
    name: "Gold Buffet Menu",
    description: "Rice, curry, meat, dessert, soft drink",
    priceType: "perPerson",
    price: 55,
    category: "Menu",
  },
  {
    id: "finger-food",
    name: "Finger Food Package",
    description: "Rolls, cutlets, pastries, canapés",
    priceType: "perPerson",
    price: 25,
    category: "Bites",
  },
  {
    id: "soft-drinks",
    name: "Drinks Package",
    description: "Soft drinks, juice, water bottles",
    priceType: "perPerson",
    price: 12,
    category: "Drinks",
  },
  {
    id: "bar-package",
    name: "Limited Bar Package",
    description: "Bar service for selected guests",
    priceType: "perPerson",
    price: 35,
    category: "Bar",
  },
  {
    id: "av-production",
    name: "AV & Sound System",
    description: "LED wall, microphone, surround sound",
    priceType: "fixed",
    price: 1500,
    category: "Service",
  },
  {
    id: "decoration",
    name: "Premium Decoration",
    description: "Stage, flowers, table setup",
    priceType: "fixed",
    price: 1200,
    category: "Service",
  },
  {
    id: "valet-concierge",
    name: "Valet Parking",
    description: "Priority parking for guests",
    priceType: "fixed",
    price: 500,
    category: "Service",
  },
];

export default function NewEventPage() {
  const router = useRouter();

  const [selectedVenueId, setSelectedVenueId] = useState("grand-ballroom");
  const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([
    "gold-buffet",
  ]);

  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("Wedding");
  const [guestCount, setGuestCount] = useState(150);
  const [primaryDate, setPrimaryDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [kitchenNote, setKitchenNote] = useState("");
  const [specialNote, setSpecialNote] = useState("");
  const [status, setStatus] = useState("Pending");

  const selectedVenue = useMemo(
    () => venues.find((venue) => venue.id === selectedVenueId) || venues[0],
    [selectedVenueId]
  );

  const selectedPackages = useMemo(
    () =>
      menuPackages.filter((menuPackage) =>
        selectedPackageIds.includes(menuPackage.id)
      ),
    [selectedPackageIds]
  );

  const togglePackage = (packageId: string) => {
    setSelectedPackageIds((previous) =>
      previous.includes(packageId)
        ? previous.filter((id) => id !== packageId)
        : [...previous, packageId]
    );
  };

  const venueTotal = selectedVenue.price;

  const packageTotal = selectedPackages.reduce((total, item) => {
    if (item.priceType === "perPerson") {
      return total + item.price * guestCount;
    }

    return total + item.price;
  }, 0);

  const serviceCharge = Math.round((venueTotal + packageTotal) * 0.15);
  const grandTotal = venueTotal + packageTotal + serviceCharge;
  const capacityExceeded = guestCount > selectedVenue.capacity;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (capacityExceeded) {
      alert(`Guest count exceeds ${selectedVenue.name} capacity.`);
      return;
    }

    const savedEvents = JSON.parse(localStorage.getItem("hotel_events") || "[]");

    const newEvent = {
      id: `EVT-${Date.now()}`,
      eventName,
      eventType,
      guestCount,
      primaryDate,
      startTime,
      organizerName,
      phone,
      email,
      kitchenNote,
      specialNote,
      status,
      selectedVenue,
      selectedPackages,
      venueTotal,
      packageTotal,
      serviceCharge,
      grandTotal,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "hotel_events",
      JSON.stringify([newEvent, ...savedEvents])
    );

    router.push("/events/list");
  };

  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "events"]}>
      <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#806300]">
                Event Booking
              </p>

              <h1 className="mt-3 text-5xl font-extrabold tracking-tight">
                Create Event Booking
              </h1>

              <p className="mt-3 max-w-3xl text-lg text-[#4d4635]">
                Choose one hall, select menu packages, enter event details, and
                generate the booking ledger automatically.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/events/list"
                className="rounded-xl border border-[#806300] bg-white px-7 py-4 text-lg font-bold text-[#806300] transition hover:-translate-y-1 hover:bg-[#faf8f3] hover:shadow-lg"
              >
                Event List
              </Link>

              <Link
                href="/events"
                className="rounded-xl bg-[#d8b328] px-7 py-4 text-lg font-bold text-[#4c3a00] transition hover:-translate-y-1 hover:bg-[#f2c426] hover:shadow-xl"
              >
                Back to Events
              </Link>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr]"
          >
            <section className="space-y-8">
              <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">1. Hall Selection</h2>

                <p className="mt-2 text-sm text-[#4d4635]">
                  Select the hall from dropdown. Only the selected hall preview
                  is shown, so the page stays short and clean.
                </p>

                <div className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                  <div>
                    <label className="text-sm font-bold text-[#4d4635]">
                      Select Hall / Venue
                    </label>

                    <select
                      value={selectedVenueId}
                      onChange={(e) => setSelectedVenueId(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-4 text-lg font-semibold outline-none focus:ring-2 focus:ring-[#735c00]/30"
                    >
                      {venues.map((venue) => (
                        <option key={venue.id} value={venue.id}>
                          {venue.name} - Max {venue.capacity} Guests
                        </option>
                      ))}
                    </select>

                    <div className="mt-5 rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
                      <p className="text-sm font-bold text-[#735c00]">
                        Selected Hall Price
                      </p>
                      <p className="mt-1 text-3xl font-extrabold">
                        ${selectedVenue.price.toLocaleString()}
                      </p>
                      <p className="mt-1 text-sm text-[#4d4635]">
                        Base rental charge
                      </p>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
                    <img
                      src={selectedVenue.image}
                      alt={selectedVenue.name}
                      className="h-56 w-full object-cover"
                    />

                    <div className="p-5">
                      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                        <div>
                          <h3 className="text-3xl font-bold">
                            {selectedVenue.name}
                          </h3>

                          <p className="mt-2 text-[#4d4635]">
                            {selectedVenue.type} · {selectedVenue.size} · Max{" "}
                            {selectedVenue.capacity} guests
                          </p>
                        </div>

                        <span className="rounded-md bg-[#d8b328] px-3 py-2 text-xs font-bold text-[#4c3a00]">
                          SELECTED
                        </span>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {selectedVenue.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-[#eee9dd] px-3 py-2 text-xs text-[#4d4635]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">2. Event Details</h2>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="text-sm font-bold text-[#4d4635]">
                      Event Name
                    </label>

                    <input
                      type="text"
                      required
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      placeholder="Chamika Wedding / Batch Party 2026"
                      className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[#4d4635]">
                      Event Type
                    </label>

                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                    >
                      {eventTypes.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[#4d4635]">
                      Guest Count
                    </label>

                    <input
                      type="number"
                      required
                      min={1}
                      max={selectedVenue.capacity}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                    />

                    {capacityExceeded && (
                      <p className="mt-2 text-sm font-bold text-red-600">
                        Guest count exceeds {selectedVenue.name} capacity.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[#4d4635]">
                      Date
                    </label>

                    <input
                      type="date"
                      required
                      value={primaryDate}
                      onChange={(e) => setPrimaryDate(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[#4d4635]">
                      Start Time
                    </label>

                    <input
                      type="time"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[#4d4635]">
                      Status
                    </label>

                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                    >
                      <option>Pending</option>
                      <option>Confirmed</option>
                      <option>Active</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">3. Menu & Packages</h2>

                <p className="mt-2 text-sm text-[#4d4635]">
                  Tick required menu, bites, drinks, bar, and service packages.
                  Total will update automatically.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {menuPackages.map((item) => {
                    const checked = selectedPackageIds.includes(item.id);

                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => togglePackage(item.id)}
                        className={`flex items-start justify-between gap-4 rounded-xl border p-4 text-left transition hover:-translate-y-1 hover:shadow-md ${
                          checked
                            ? "border-[#d8b328] bg-[#fff9e6]"
                            : "border-[#d0c5af] bg-white"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <span
                            className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded border text-sm font-bold ${
                              checked
                                ? "border-[#735c00] bg-[#735c00] text-white"
                                : "border-[#d0c5af] bg-white text-transparent"
                            }`}
                          >
                            ✓
                          </span>

                          <div>
                            <span className="rounded bg-[#eee9dd] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#735c00]">
                              {item.category}
                            </span>

                            <h3 className="mt-2 font-bold">{item.name}</h3>

                            <p className="mt-1 text-sm text-[#4d4635]">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <p className="shrink-0 font-bold text-[#735c00]">
                          {item.priceType === "perPerson"
                            ? `+$${item.price}/pp`
                            : `+$${item.price.toLocaleString()}`}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">
                  4. Organizer & Kitchen Notes
                </h2>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-bold text-[#4d4635]">
                      Organizer Name
                    </label>

                    <input
                      type="text"
                      required
                      value={organizerName}
                      onChange={(e) => setOrganizerName(e.target.value)}
                      placeholder="Mr. / Ms. Organizer"
                      className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[#4d4635]">
                      Phone
                    </label>

                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+94 77 123 4567"
                      className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-bold text-[#4d4635]">
                      Email
                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[#4d4635]">
                      Kitchen Note
                    </label>

                    <textarea
                      rows={5}
                      value={kitchenNote}
                      onChange={(e) => setKitchenNote(e.target.value)}
                      placeholder="No pork, 20 vegetarian plates, serve dinner at 8.30 PM"
                      className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[#4d4635]">
                      Special Note
                    </label>

                    <textarea
                      rows={5}
                      value={specialNote}
                      onChange={(e) => setSpecialNote(e.target.value)}
                      placeholder="Decoration, parking, VIP tables, room blocks..."
                      className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                    />
                  </div>
                </div>
              </section>
            </section>

            <aside className="h-fit rounded-2xl bg-[#344056] p-6 text-white shadow-xl xl:sticky xl:top-8">
              <h2 className="text-2xl font-bold text-[#d8b328]">
                Booking Ledger
              </h2>

              <p className="mt-2 text-sm text-slate-300">
                {selectedVenue.name} · {primaryDate || "Select date"}
              </p>

              <div className="mt-8 space-y-5 border-b border-white/10 pb-6">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-300">Base Venue Rental</span>
                  <strong>${venueTotal.toLocaleString()}</strong>
                </div>

                {selectedPackages.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4">
                    <span className="text-slate-300">{item.name}</span>

                    <strong>
                      $
                      {item.priceType === "perPerson"
                        ? (item.price * guestCount).toLocaleString()
                        : item.price.toLocaleString()}
                    </strong>
                  </div>
                ))}

                <div className="flex justify-between gap-4">
                  <span className="text-slate-300">Service Charge 15%</span>
                  <strong>${serviceCharge.toLocaleString()}</strong>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-bold uppercase tracking-widest text-slate-400">
                  Estimated Total
                </p>

                <div className="mt-2 flex items-end justify-between gap-4">
                  <strong className="text-4xl text-[#d8b328]">
                    ${grandTotal.toLocaleString()}
                  </strong>

                  <span className="text-xs italic text-slate-300">
                    Tax Included
                  </span>
                </div>
              </div>

              <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">Selected Hall</p>
                <p className="mt-1 text-lg font-bold">{selectedVenue.name}</p>
                <p className="mt-1 text-sm text-slate-300">
                  Capacity: {selectedVenue.capacity} guests
                </p>
              </div>

              <button
                type="submit"
                disabled={capacityExceeded}
                className="mt-8 w-full rounded-xl bg-[#d8b328] px-5 py-4 font-bold text-[#4c3a00] transition hover:bg-[#f2c426] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirm & Save Event
              </button>

              <Link
                href="/events/list"
                className="mt-4 block w-full rounded-xl border border-white/20 px-5 py-4 text-center font-bold text-white transition hover:bg-white/10"
              >
                Go to Event List
              </Link>
            </aside>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}