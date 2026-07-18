"use client";

import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createGameSession } from "@/lib/api/gameApi";
import { ArrowLeft, ClipboardCheck, Gamepad2 } from "lucide-react";

const gameOptions = [
  {
    gameName: "Grand Billiards I",
    gameType: "Billiards",
    location: "Recreation Floor",
    hourlyRate: 2500,
  },
  {
    gameName: "VIP Gaming Suite",
    gameType: "Console Gaming",
    location: "Level 03",
    hourlyRate: 3500,
  },
  {
    gameName: "Skyline Cinema",
    gameType: "Private Cinema",
    location: "Rooftop Zone",
    hourlyRate: 5000,
  },
  {
    gameName: "Table Tennis Center",
    gameType: "Indoor Sport",
    location: "Recreation Floor",
    hourlyRate: 1800,
  },
];

function getDurationHours(duration: string) {
  if (duration === "30 Minutes") return 0.5;
  if (duration === "Full Day") return 8;

  const numberValue = Number(duration.split(" ")[0]);
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : 1;
}

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
    hourlyRate: 2500,
    paymentMethod: "Charge to Room",
    notes: "",
    equipmentChecked: false,
    accessoriesIssued: false,
    guestResponsibilityConfirmed: false,
    status: "ACTIVE",
    gameType: "Billiards",
    location: "Recreation Floor",
  });

  const selectedGame = useMemo(() => {
    return (
      gameOptions.find((item) => item.gameName === formData.gameName) ||
      gameOptions[0]
    );
  }, [formData.gameName]);

  const durationHours = getDurationHours(formData.duration);
  const totalAmount = Math.round(Number(formData.hourlyRate || 0) * durationHours);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = event.target;

    if (type === "checkbox") {
      setFormData((previous) => ({
        ...previous,
        [name]: (event.target as HTMLInputElement).checked,
      }));
      return;
    }

    if (name === "gameName") {
      const selected =
        gameOptions.find((item) => item.gameName === value) || gameOptions[0];

      setFormData((previous) => ({
        ...previous,
        gameName: selected.gameName,
        gameType: selected.gameType,
        location: selected.location,
        hourlyRate: selected.hourlyRate,
      }));
      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: name === "hourlyRate" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.guestName.trim()) {
      setError("Guest name is required.");
      return;
    }

    if (!formData.roomNumber.trim()) {
      setError("Room number is required.");
      return;
    }

    if (!formData.equipmentChecked) {
      setError("Please confirm main equipment checked.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const today = new Date().toISOString().split("T")[0];

      const sessionPayload = {
        ...formData,
        gameType: selectedGame.gameType,
        location: selectedGame.location,
        hourlyRate: Number(formData.hourlyRate),
        totalAmount,
        startTime: formData.startTime
          ? `${today}T${formData.startTime}:00`
          : new Date().toISOString(),
      };

      await createGameSession(sessionPayload);
      alert("Game session started successfully.");
      router.push("/games");
    } catch (err: any) {
      setError(err.message || "Failed to create session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "GAME_STAFF"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Games Module
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                New Game Session
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Start a new amenity rental or game session.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/games")}
              className="flex items-center gap-2 rounded-xl border border-[#735c00] bg-white px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
            >
              <ArrowLeft size={18} />
              Back to Games
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 font-bold text-red-700">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]"
          >
            <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-2xl font-bold">
                <Gamepad2 className="text-[#735c00]" />
                Session Details
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <InputField
                  label="Guest Name"
                  name="guestName"
                  value={formData.guestName}
                  onChange={handleChange}
                  placeholder="Guest Name"
                />

                <InputField
                  label="Room Number"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  placeholder="Suite 402"
                />

                <SelectField
                  label="Game / Amenity"
                  name="gameName"
                  value={formData.gameName}
                  onChange={handleChange}
                  options={gameOptions.map((item) => item.gameName)}
                />

                <SelectField
                  label="Session Type"
                  name="sessionType"
                  value={formData.sessionType}
                  onChange={handleChange}
                  options={[
                    "Hourly Rental",
                    "Package Session",
                    "Complimentary",
                    "Event Booking",
                  ]}
                />

                <InputField
                  label="Start Time"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleChange}
                />

                <SelectField
                  label="Duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  options={[
                    "30 Minutes",
                    "1 Hour",
                    "2 Hours",
                    "3 Hours",
                    "Full Day",
                  ]}
                />

                <InputField
                  label="Hourly Rate"
                  name="hourlyRate"
                  type="number"
                  value={String(formData.hourlyRate)}
                  onChange={handleChange}
                />

                <SelectField
                  label="Payment Method"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  options={["Charge to Room", "Cash", "Card", "Complimentary"]}
                />

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
                <h2 className="flex items-center gap-2 text-2xl font-bold">
                  <ClipboardCheck className="text-[#735c00]" />
                  Equipment Checklist
                </h2>

                <div className="mt-6 space-y-4">
                  <CheckBoxField
                    name="equipmentChecked"
                    checked={formData.equipmentChecked}
                    onChange={handleChange}
                    title="Main equipment checked"
                    description="Console, table, cinema, or game station is ready."
                  />

                  <CheckBoxField
                    name="accessoriesIssued"
                    checked={formData.accessoriesIssued}
                    onChange={handleChange}
                    title="Accessories issued"
                    description="Controllers, cues, rackets, remote, or headset issued."
                  />

                  <CheckBoxField
                    name="guestResponsibilityConfirmed"
                    checked={formData.guestResponsibilityConfirmed}
                    onChange={handleChange}
                    title="Guest responsibility confirmed"
                    description="Guest accepts damage or missing item charges."
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">Session Summary</h2>

                <div className="mt-6 space-y-4">
                  <SummaryRow label="Game Type" value={selectedGame.gameType} />
                  <SummaryRow label="Location" value={selectedGame.location} />
                  <SummaryRow label="Duration" value={formData.duration} />
                  <SummaryRow
                    label="Total"
                    value={`Rs ${totalAmount.toLocaleString()}`}
                  />
                  <SummaryRow label="Billing" value={formData.paymentMethod} />
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
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-[#735c00] px-6 py-4 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
                >
                  {loading ? "Starting..." : "Start Session"}
                </button>
              </div>
            </aside>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: any;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-[#4d4635]">{label}</label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: any;
  options: string[];
}) {
  return (
    <div>
      <label className="text-sm font-bold text-[#4d4635]">{label}</label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckBoxField({
  name,
  checked,
  onChange,
  title,
  description,
}: {
  name: string;
  checked: boolean;
  onChange: any;
  title: string;
  description: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-1 h-5 w-5"
      />

      <div>
        <p className="font-bold">{title}</p>
        <p className="text-sm text-[#4d4635]">{description}</p>
      </div>
    </label>
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