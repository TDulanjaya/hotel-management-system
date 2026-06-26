"use client";

import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGameSession } from "@/lib/api/gameApi";

export default function NewGameSessionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    guestName: "",
    roomNumber: "",
    gameName: "Grand Billiards I",
    sessionType: "Hourly Rental",
    startTime: "",
    duration: "1 Hour",
    hourlyRate: 25,
    paymentMethod: "Charge to Room",
    notes: "",
    equipmentChecked: false,
    accessoriesIssued: false,
    guestResponsibilityConfirmed: false,
    status: "ACTIVE",
    gameType: "Billiards",
    location: "Recreation Floor"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // derive gameType and location based on gameName (simple hardcoding for demo as requested)
      let gameType = "Billiards";
      let location = "Recreation Floor";
      if (formData.gameName === "VIP Gaming Suite") { gameType = "Console Gaming"; location = "Level 03"; }
      if (formData.gameName === "Skyline Cinema") { gameType = "Private Cinema"; location = "Rooftop Zone"; }
      if (formData.gameName === "Table Tennis Center") { gameType = "Indoor Sport"; location = "Recreation Floor"; }

      const amount = Number(formData.hourlyRate) * parseInt(formData.duration.split(" ")[0] || "1");

      const sessionPayload = {
        ...formData,
        gameType,
        location,
        hourlyRate: Number(formData.hourlyRate),
        totalAmount: isNaN(amount) ? Number(formData.hourlyRate) : amount,
        startTime: formData.startTime ? new Date().toISOString().split("T")[0] + "T" + formData.startTime : new Date().toISOString()
      };

      await createGameSession(sessionPayload);
      router.push("/games");
    } catch (err: any) {
      setError(err.message || "Failed to create session.");
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "GAME_STAFF"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
              Games Module
            </p>

            <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
              New Game Session
            </h1>

            <p className="mt-2 text-[#4d4635]">
              Start a new amenity rental or game session here.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 font-bold text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
            <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Session Details</h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Guest Name
                  </label>
                  <input
                    type="text"
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleChange}
                    placeholder="Alexander Van Der Bilt"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Room Number
                  </label>
                  <input
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    placeholder="Suite 402"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Game / Amenity
                  </label>
                  <select name="gameName" value={formData.gameName} onChange={handleChange} className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option value="Grand Billiards I">Grand Billiards I</option>
                    <option value="VIP Gaming Suite">VIP Gaming Suite</option>
                    <option value="Skyline Cinema">Skyline Cinema</option>
                    <option value="Table Tennis Center">Table Tennis Center</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Session Type
                  </label>
                  <select name="sessionType" value={formData.sessionType} onChange={handleChange} className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option value="Hourly Rental">Hourly Rental</option>
                    <option value="Package Session">Package Session</option>
                    <option value="Complimentary">Complimentary</option>
                    <option value="Event Booking">Event Booking</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Duration
                  </label>
                  <select name="duration" value={formData.duration} onChange={handleChange} className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option value="30 Minutes">30 Minutes</option>
                    <option value="1 Hour">1 Hour</option>
                    <option value="2 Hours">2 Hours</option>
                    <option value="3 Hours">3 Hours</option>
                    <option value="Full Day">Full Day</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Hourly Rate
                  </label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    placeholder="25"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Payment Method
                  </label>
                  <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option value="Charge to Room">Charge to Room</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Complimentary">Complimentary</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-[#4d4635]">
                    Notes
                  </label>
                  <textarea
                    rows={5}
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Special request, equipment condition, guest instruction..."
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>
              </div>
            </section>

            <aside className="space-y-8">
              <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">Equipment Checklist</h2>

                <div className="mt-6 space-y-4">
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
                    <input type="checkbox" name="equipmentChecked" checked={formData.equipmentChecked} onChange={handleChange} className="mt-1 h-5 w-5" />
                    <div>
                      <p className="font-bold">Main equipment checked</p>
                      <p className="text-sm text-[#4d4635]">
                        Console, table, cinema, or game station is ready.
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
                    <input type="checkbox" name="accessoriesIssued" checked={formData.accessoriesIssued} onChange={handleChange} className="mt-1 h-5 w-5" />
                    <div>
                      <p className="font-bold">Accessories issued</p>
                      <p className="text-sm text-[#4d4635]">
                        Controllers, cues, rackets, remote, or headset issued.
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
                    <input type="checkbox" name="guestResponsibilityConfirmed" checked={formData.guestResponsibilityConfirmed} onChange={handleChange} className="mt-1 h-5 w-5" />
                    <div>
                      <p className="font-bold">Guest responsibility confirmed</p>
                      <p className="text-sm text-[#4d4635]">
                        Guest accepts damage or missing item charges.
                      </p>
                    </div>
                  </label>
                </div>
              </section>

              <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">Session Summary</h2>

                <div className="mt-6 space-y-4">
                  <SummaryRow label="Status" value="Ready to Start" />
                  <SummaryRow label="Billing" value={formData.paymentMethod} />
                  <SummaryRow label="Audit" value="Required on End" />
                </div>
              </section>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.push("/games")}
                  className="flex-1 rounded-xl border border-[#735c00] px-6 py-4 text-center font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 rounded-xl bg-[#735c00] px-6 py-4 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
                >
                  {loading ? "Starting..." : "Start Session"}
                </button>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#f5f3ef] p-4">
      <span className="font-bold text-[#4d4635]">{label}</span>
      <span className="font-bold text-[#735c00]">{value}</span>
    </div>
  );
}
