"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { createGuest } from "@/lib/api/guestsApi";

export default function NewGuestPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    nationality: "Sri Lankan",
    idType: "National ID",
    idNumber: "",
  });

  const update = (field: string, value: string) =>
    setFormData((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name.trim()) {
      setError("Guest name is required.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      await createGuest(formData);
      router.push("/guests");
    } catch (err: any) {
      setError(err.message || "Failed to create guest.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "RECEPTIONIST"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />
        <main className="px-4 py-6 pt-16 sm:px-8 sm:py-10 lg:ml-[280px] lg:pt-10">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#735c00]">
                  Guest Management
                </p>
                <h1 className="mt-2 text-3xl font-extrabold text-[#735c00]">
                  Add Guest
                </h1>
                <p className="mt-1 text-sm text-[#4d4635]">
                  Create a short guest profile before making a reservation or bill.
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.push("/guests")}
                className="rounded-xl border border-[#735c00] px-4 py-2 text-sm font-bold text-[#735c00] hover:bg-[#735c00] hover:text-white"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="rounded-2xl border border-[#d0c5af] bg-white p-5 shadow-sm sm:p-7">
              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name *" value={formData.name} onChange={(value) => update("name", value)} placeholder="Nadeesha Perera" required />
                <Field label="Phone *" value={formData.phone} onChange={(value) => update("phone", value)} placeholder="+94 77 123 4567" required />
                <Field label="Email *" type="email" value={formData.email} onChange={(value) => update("email", value)} placeholder="guest@example.com" required />
                <Field label="Nationality" value={formData.nationality} onChange={(value) => update("nationality", value)} placeholder="Sri Lankan" />
                <label className="text-sm font-bold text-[#4d4635]">
                  ID type
                  <select value={formData.idType} onChange={(event) => update("idType", event.target.value)} className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>National ID</option>
                    <option>Passport</option>
                    <option>Driver License</option>
                  </select>
                </label>
                <Field label="ID number *" value={formData.idNumber} onChange={(value) => update("idNumber", value)} placeholder="199012345678" required />
              </div>

              <div className="mt-6 flex justify-end">
                <button type="submit" disabled={saving} className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white hover:bg-[#d4af37] hover:text-[#241a00] disabled:opacity-50">
                  {saving ? "Saving..." : "Save Guest"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="text-sm font-bold text-[#4d4635]">
      {label}
      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#735c00]/30"
      />
    </label>
  );
}
