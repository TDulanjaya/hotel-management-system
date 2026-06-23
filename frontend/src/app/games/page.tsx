"use client";

import { useEffect, useState } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  Search,
  Bell,
  User,
  Timer,
  AlertTriangle,
  CheckCircle,
  XCircle,
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
    timerSeconds: 4522,
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
    guest: "",
    room: "",
    timerSeconds: 0,
    items: ["Universal Remote", "Popcorn Service", "Blanket Set"],
    missing: [],
    actions: ["Start Rental"],
  },
  {
    id: 4,
    title: "Table Tennis Center",
    subtitle: "Butterfly Professional",
    status: "AVAILABLE",
    ribbon: "available",
    guest: "",
    room: "",
    timerSeconds: 0,
    items: ["Paddles Ready", "Balls Ready", "Net Checked"],
    missing: [],
    actions: ["Start Rental"],
  },
];

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");

  return `${h}:${m}:${s}`;
}

function ribbonClass(ribbon: string) {
  if (ribbon === "occupied") return "border-l-4 border-l-[#735c00]";
  if (ribbon === "warning") return "border-l-4 border-l-[#ba1a1a]";
  return "border-l-4 border-l-green-500";
}

function badgeClass(status: string) {
  if (status === "OCCUPIED") return "bg-[#dae2fd] text-[#565e74]";
  if (status === "OVERDUE") return "bg-[#ffdad6] text-[#93000a]";
  return "bg-green-100 text-green-700";
}

export default function GamesPage() {
  const [amenities, setAmenities] = useState(initialAmenities);
  const [runningSeconds, setRunningSeconds] = useState(6135);

  useEffect(() => {
    const interval = setInterval(() => {
      setRunningSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAction = (id: number, action: string) => {
    if (action === "End Rental" || action === "End & Audit") {
      const confirmEnd = window.confirm(
        "Confirm end of rental? This will finalize the charge calculation."
      );

      if (confirmEnd) {
        setAmenities((prev) => prev.filter((item) => item.id !== id));
      }
    }
  };

  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "game_staff"]}>
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
            <div className="mb-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                  Games Module
                </p>

                <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                  Games & Amenities
                </h1>

                <p className="mt-2 text-[#4d4635]">
                  Real-time oversight of luxury recreation facilities and guest
                  rentals.
                </p>
              </div>

              <a
                href="/games/new-session"
                className="flex items-center gap-2 rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
              >
                <Plus size={18} />
                New Game Session
              </a>
            </div>

            <div className="mb-8 grid gap-6 md:grid-cols-3">
              <StatCard label="Available" value="8" color="text-green-700" />
              <StatCard label="Occupied" value="4" color="text-[#735c00]" />
              <StatCard label="Overdue" value="1" color="text-[#ba1a1a]" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {amenities.map((amenity) => (
                <article
                  key={amenity.id}
                  className={`overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${ribbonClass(
                    amenity.ribbon
                  )}`}
                >
                  <div className="p-6">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-bold">{amenity.title}</h2>
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
                        <div className="mb-5 flex items-center gap-3 rounded-xl bg-[#f5f3ef] p-4">
                          <User size={22} className="text-[#735c00]" />

                          <div>
                            <p className="text-xs text-[#4d4635]">
                              Guest / Room
                            </p>
                            <p className="text-sm font-bold">
                              {amenity.guest} ({amenity.room})
                            </p>
                          </div>
                        </div>

                        <div className="mb-5 flex items-center gap-3 rounded-xl bg-[#101827] p-4 text-white">
                          <Timer size={22} className="text-[#d4af37]" />

                          <div>
                            <p className="text-xs text-white/60">
                              {amenity.status === "OVERDUE"
                                ? "Time Overdue"
                                : "Rental Timer"}
                            </p>
                            <p className="text-2xl font-bold">
                              {amenity.id === 1
                                ? formatTime(runningSeconds)
                                : formatTime(amenity.timerSeconds)}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="mb-5 rounded-xl bg-green-50 p-4 text-green-700">
                        <div className="flex items-center gap-2">
                          <CheckCircle size={20} />
                          <p className="font-bold">Ready for check-in</p>
                        </div>
                        <p className="mt-1 text-sm">
                          Standard kit checked and available.
                        </p>
                      </div>
                    )}

                    <div className="space-y-3">
                      <p className="text-sm font-bold text-[#4d4635]">
                        Equipment Kit
                      </p>

                      {amenity.items.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle size={16} className="text-green-600" />
                          <span>{item}</span>
                        </div>
                      ))}

                      {amenity.missing.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 text-sm text-[#ba1a1a]"
                        >
                          <XCircle size={16} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-[#d0c5af] bg-[#f5f3ef] p-4">
                    <div className="flex flex-wrap gap-3">
                      {amenity.actions.map((action) => (
                        <button
                          key={action}
                          onClick={() => handleAction(amenity.id, action)}
                          className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold transition ${
                            action.includes("End")
                              ? "bg-[#ba1a1a] text-white hover:bg-[#93000a]"
                              : "bg-[#735c00] text-white hover:bg-[#d4af37] hover:text-[#241a00]"
                          }`}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <section className="mt-8 rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <AlertTriangle size={24} className="text-[#ba1a1a]" />
                <div>
                  <h2 className="text-xl font-bold">Audit Reminder</h2>
                  <p className="text-sm text-[#4d4635]">
                    Overdue sessions and missing equipment should be checked
                    before closing the rental.
                  </p>
                </div>
              </div>
            </section>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-widest text-[#4d4635]">
        {label}
      </p>
      <p className={`mt-2 text-4xl font-extrabold ${color}`}>{value}</p>
    </div>
  );
}