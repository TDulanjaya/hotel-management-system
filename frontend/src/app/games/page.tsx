"use client";

import { useEffect, useState } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import {
  Search,
  Bell,
  User,
  Timer,
  AlertTriangle,
  CheckCircle,
  XCircle,
  DoorOpen,
  ReceiptText,
  CreditCard,
  BarChart3,
  Plus,
} from "lucide-react";

const initialAmenities = [
  {
    id: 1,
    title: "Grand Billiards I",
    subtitle: "Professional Grade",
    status: "OCCUPIED",
    ribbon: "occupied",
    guest: "Alexander Van Der Bilt",
    room: "Suite 402",
    timerSeconds: 6135,
    timerLabel: "Rental Timer",
    items: ["Premium Cues (2)", "Aramith Ball Set", "Chalk Block"],
    missing: [],
    actions: ["Adjust Time", "End Rental"],
  },
  {
    id: 2,
    title: "VIP Gaming Suite",
    subtitle: "PlayStation 5 Console",
    status: "OVERDUE",
    ribbon: "warning",
    guest: "Marcus Thorne",
    room: "Room 215",
    overdue: "+00:15:22",
    timerLabel: "Time Overdue",
    items: ["DualSense Controllers (2)"],
    missing: ["Pulse 3D Headset"],
    actions: ["End & Audit"],
  },
  {
    id: 3,
    title: "Skyline Cinema",
    subtitle: "4K Laser Projection",
    status: "AVAILABLE",
    ribbon: "available",
    availableText: "Ready for immediate check-in",
    availableSub: "Max capacity: 8 Guests",
    kitTitle: "Standard Kit",
    kit: ["Universal Remote", "Popcorn Service", "Blanket Set"],
    actions: ["Start Rental"],
  },
  {
    id: 4,
    title: "Table Tennis Center",
    subtitle: "Butterfly Professional",
    status: "AVAILABLE",
    ribbon: "available",
    availableText: "Maintenance complete",
    availableSub: "Floor polished at 08:00 AM",
    kitTitle: "Kit Status",
    kit: ["Cues: Ready", "Balls: Ready"],
    actions: ["Start Rental"],
  },
];

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");

  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");

  const s = (seconds % 60).toString().padStart(2, "0");

  return `${h}:${m}:${s}`;
}

function ribbonClass(ribbon: string) {
  if (ribbon === "occupied") return "border-l-4 border-l-[#735c00]";
  if (ribbon === "warning") return "border-l-4 border-l-[#ba1a1a]";
  return "border-l-4 border-l-green-400";
}

function badgeClass(status: string) {
  if (status === "OCCUPIED") {
    return "bg-[#dae2fd]/40 text-[#5c647a]";
  }

  if (status === "OVERDUE") {
    return "bg-[#ffdad6] text-[#93000a]";
  }

  return "bg-[#e4e2de] text-[#4d4635]";
}

export default function GamesPage() {
  const [amenities, setAmenities] = useState(initialAmenities);
  const [timerSeconds, setTimerSeconds] = useState(6135);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleEndRental = (id: number, action: string) => {
    if (action !== "End Rental" && action !== "End & Audit") return;

    const confirmEnd = window.confirm(
      "Confirm end of rental? This will finalize the charge calculation."
    );

    if (confirmEnd) {
      setAmenities((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f3ef] text-[#1b1c1a]">
      <AppSidebar />

      <main className="min-h-screen lg:ml-[280px]">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#d0c5af] bg-[#fbf9f5] px-8">
          <div className="flex items-center gap-4">
            <Search size={22} className="text-[#735c00]" />

            <input
              type="text"
              placeholder="Search guests or amenities..."
              className="w-72 border-none bg-transparent text-sm text-[#4d4635] outline-none"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-[#4d4635] transition hover:text-[#735c00]">
              <Bell size={22} />
              <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#ba1a1a]" />
            </button>

            <div className="flex items-center gap-3 border-l border-[#d0c5af] pl-6">
              <div className="hidden text-right md:block">
                <p className="text-sm font-bold">Julian Sterling</p>
                <p className="text-xs text-[#4d4635]">Floor Manager</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#d4af37] bg-[#131b2e] font-bold text-[#ffe088]">
                JS
              </div>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-[1600px] px-8 pb-12 pt-10">
          <div className="games-fade mb-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
            <div>
              <h1 className="text-3xl font-bold">Games & Amenities</h1>

              <p className="mt-1 text-sm text-[#4d4635]">
                Real-time oversight of luxury recreation facilities.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="flex items-center gap-2 rounded-full border border-[#d0c5af] bg-white px-4 py-2 text-sm shadow-sm">
                <span className="h-3 w-3 rounded-full bg-green-500" />
                8 Available
              </div>

              <div className="flex items-center gap-2 rounded-full border border-[#d0c5af] bg-white px-4 py-2 text-sm shadow-sm">
                <span className="h-3 w-3 rounded-full bg-[#735c00]" />
                4 Occupied
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:col-span-8">
              {amenities.map((amenity) => (
                <article
                  key={amenity.id}
                  className={`games-card games-fade flex flex-col overflow-hidden ${ribbonClass(
                    amenity.ribbon
                  )} ${
                    amenity.ribbon === "warning" ? "pulse-warning" : ""
                  } ${
                    amenity.ribbon === "available"
                      ? "opacity-90 hover:opacity-100"
                      : ""
                  }`}
                >
                  <div className="flex-grow p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-semibold">
                          {amenity.title}
                        </h2>

                        <p className="text-xs font-bold uppercase tracking-wide text-[#735c00]">
                          {amenity.subtitle}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${badgeClass(
                          amenity.status
                        )}`}
                      >
                        {amenity.status}
                      </span>
                    </div>

                    {amenity.status !== "AVAILABLE" ? (
                      <>
                        <div className="mb-6 space-y-4">
                          <div className="flex items-center gap-3">
                            <User size={22} className="text-[#7f7663]" />

                            <div>
                              <p className="text-xs text-[#4d4635]">
                                Guest / Room
                              </p>

                              <p className="text-sm font-bold">
                                {amenity.guest} ({amenity.room})
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {amenity.ribbon === "warning" ? (
                              <AlertTriangle
                                size={22}
                                className="text-[#ba1a1a]"
                              />
                            ) : (
                              <Timer size={22} className="text-[#735c00]" />
                            )}

                            <div>
                              <p className="text-xs text-[#4d4635]">
                                {amenity.timerLabel}
                              </p>

                              <p
                                className={`text-sm font-bold ${
                                  amenity.ribbon === "warning"
                                    ? "text-[#ba1a1a]"
                                    : "text-[#735c00]"
                                }`}
                              >
                                {amenity.timerSeconds
                                  ? formatTime(timerSeconds)
                                  : amenity.overdue}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-[#d0c5af] pt-4">
                          <p className="mb-2 text-xs font-bold uppercase text-[#4d4635]">
                            Issued Items
                          </p>

                          <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
                            {amenity.items?.map((item) => (
                              <div
                                key={item}
                                className="flex items-center gap-2 text-xs"
                              >
                                <CheckCircle
                                  size={18}
                                  className="text-green-600"
                                />
                                {item}
                              </div>
                            ))}

                            {amenity.missing?.map((item) => (
                              <div
                                key={item}
                                className="flex items-center gap-2 text-xs font-bold text-[#ba1a1a]"
                              >
                                <XCircle size={18} />
                                {item}
                              </div>
                            ))}
                          </div>

                          {amenity.missing && amenity.missing.length > 0 && (
                            <p className="mt-2 text-[11px] italic text-[#ba1a1a]">
                              * Headset reported missing in previous check
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col items-center justify-center py-8 text-center text-[#4d4635]">
                          <DoorOpen size={56} className="mb-2 opacity-25" />

                          <p className="text-sm font-bold">
                            {amenity.availableText}
                          </p>

                          <p className="text-xs">{amenity.availableSub}</p>
                        </div>

                        <div className="border-t border-[#d0c5af] pt-4">
                          <p className="mb-2 text-xs font-bold uppercase text-[#4d4635]">
                            {amenity.kitTitle}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {amenity.kit?.map((kit) => (
                              <span
                                key={kit}
                                className="rounded bg-[#efeeea] px-2 py-1 text-[10px]"
                              >
                                {kit}
                              </span>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex gap-3 bg-[#efeeea] p-4">
                    {amenity.actions.map((action) => (
                      <button
                        key={action}
                        onClick={() => handleEndRental(amenity.id, action)}
                        className={`flex-1 rounded-lg py-2 text-sm font-bold transition ${
                          action === "Adjust Time"
                            ? "bg-[#565e74] text-white hover:bg-[#565e74]/90"
                            : "bg-[#735c00] text-white shadow-md hover:bg-[#735c00]/90"
                        }`}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <aside className="col-span-12 lg:col-span-4">
              <section className="games-fade sticky top-24 overflow-hidden rounded-xl border border-[#d0c5af] bg-white p-6 shadow-lg">
                <div className="absolute left-0 top-0 h-1 w-full bg-[#735c00]" />

                <div className="mb-6 flex items-center gap-3">
                  <ReceiptText size={24} className="text-[#735c00]" />
                  <h2 className="text-xl font-semibold">
                    Charge Calculation
                  </h2>
                </div>

                <div className="mb-6 rounded-lg bg-[#efeeea] p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs text-[#4d4635]">Selected Guest</p>

                    <p className="text-sm font-bold text-[#735c00]">
                      Alexander Van Der Bilt
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#4d4635]">Room</p>
                    <p className="text-sm font-bold">Suite 402</p>
                  </div>
                </div>

                <div className="mb-8 space-y-4">
                  <ChargeItem
                    title="Billiards - Grand Table I"
                    detail="Rate: $45.00 / hour"
                    note="Duration: 1h 42m"
                    amount="$76.50"
                  />

                  <ChargeItem
                    title="Lounge Service - Premium Bar"
                    detail="Single Malt Tasting (x2)"
                    amount="$54.00"
                  />

                  <ChargeItem
                    title="Amenities Surcharge"
                    detail="Cleaning & Setup Fee"
                    amount="$15.00"
                  />
                </div>

                <div className="-mx-6 -mb-6 mt-8 bg-[#131b2e] p-6 text-white">
                  <div className="mb-6 flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-70">
                      Total Charges
                    </p>

                    <p className="text-4xl font-bold text-[#d4af37]">
                      $145.50
                    </p>
                  </div>

                  <button className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#735c00] py-4 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] active:scale-95">
                    <CreditCard size={20} />
                    Add to Guest Folio
                  </button>

                  <p className="mt-4 text-center text-[10px] uppercase tracking-tighter opacity-50">
                    Confirmation receipt will be sent to guest email
                  </p>
                </div>
              </section>

              <section className="games-fade mt-6 rounded-xl border border-[#dae2fd] bg-[#dae2fd]/20 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <BarChart3 size={22} className="text-[#565e74]" />

                  <p className="text-sm font-bold uppercase text-[#565e74]">
                    Floor Efficiency
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span>Amenity Occupancy</span>
                      <span>72%</span>
                    </div>

                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#d0c5af]">
                      <div className="h-full w-[72%] bg-[#735c00]" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs">Active Sessions</p>
                    <p className="font-bold">14</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs">Avg. Rental Time</p>
                    <p className="font-bold">54m</p>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </section>
      </main>

      <button className="group fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#735c00] text-white shadow-2xl transition hover:scale-110 active:scale-95">
        <Plus size={32} className="transition-transform group-hover:rotate-90" />

        <div className="pointer-events-none absolute right-20 whitespace-nowrap rounded-lg bg-[#131b2e] px-4 py-2 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
          Quick Check-In
        </div>
      </button>
    </div>
  );
}

function ChargeItem({
  title,
  detail,
  note,
  amount,
}: {
  title: string;
  detail: string;
  note?: string;
  amount: string;
}) {
  return (
    <div className="flex items-start justify-between border-t border-[#d0c5af] pt-4 first:border-t-0 first:pt-0">
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="text-xs text-[#4d4635]">{detail}</p>
        {note && <p className="text-[11px] text-[#735c00]">{note}</p>}
      </div>

      <p className="text-sm font-bold">{amount}</p>
    </div>
  );
}