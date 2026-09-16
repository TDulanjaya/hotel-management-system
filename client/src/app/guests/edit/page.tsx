"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getGuestById, updateGuest } from "@/lib/api/guestsApi";

export default function EditGuestPage() {
  const searchParams = useSearchParams();
  const guestId = searchParams.get("id") || "";
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    nationality: "",
    idType: "Passport",
    idNumber: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    if (!guestId) {
      setError("No guest ID provided.");
      setLoading(false);
      return;
    }

    const fetchGuest = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getGuestById(guestId);
        if (data) {
          setFormData({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            nationality: data.nationality || "",
            idType: data.idType || "Passport",
            idNumber: data.idNumber || "",
            address: data.address || "",
            notes: data.notes || "",
          });
        }
      } catch (err: any) {
        setError(err.message || "Failed to load guest record.");
      } finally {
        setLoading(false);
      }
    };

    fetchGuest();
  }, [guestId]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestId) return;

    if (!formData.name.trim()) {
      setError("Full Name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      await updateGuest(guestId, formData);
      router.push("/guests");
    } catch (err: any) {
      setError(err.message || "Failed to update guest details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "RECEPTIONIST"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Guest Management
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Edit Guest
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Update guest personal details, contact details, ID information,
                and guest preferences.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/guests")}
              className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
            >
              Back to Guests
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 font-semibold">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex h-64 items-center justify-center text-lg font-bold text-[#735c00]">
              Loading guest record...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-8 xl:grid-cols-[1fr_1fr]">
              <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">Personal Details</h2>

                <div className="mt-6 space-y-5">
                  <div>
                    <label className="text-sm font-bold text-[#4d4635]">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Enter guest name"
                      className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[#4d4635]">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="guest@example.com"
                      className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[#4d4635]">Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="+94 77 123 4567"
                      className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[#4d4635]">Nationality</label>
                    <input
                      type="text"
                      value={formData.nationality}
                      onChange={(e) => handleChange("nationality", e.target.value)}
                      placeholder="Enter nationality"
                      className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-bold text-[#4d4635]">ID Type</label>
                      <select
                        value={formData.idType}
                        onChange={(e) => handleChange("idType", e.target.value)}
                        className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                      >
                        <option value="Passport">Passport</option>
                        <option value="National ID">National ID</option>
                        <option value="Driver License">Driver License</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-[#4d4635]">Passport / ID No</label>
                      <input
                        type="text"
                        value={formData.idNumber}
                        onChange={(e) => handleChange("idNumber", e.target.value)}
                        placeholder="Enter ID number"
                        className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">Address & Contact</h2>

                <div className="mt-6 space-y-5">
                  <div>
                    <label className="text-sm font-bold text-[#4d4635]">Residential Address</label>
                    <textarea
                      rows={4}
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      placeholder="Street address, city, country..."
                      className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm xl:col-span-2">
                <h2 className="text-2xl font-bold">Guest Notes</h2>

                <textarea
                  placeholder="Add guest notes, special requests, VIP status, or dietary preferences..."
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  className="mt-6 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                />

                <div className="mt-6 flex flex-wrap gap-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00] disabled:opacity-50"
                  >
                    {saving ? "Updating Guest..." : "Update Guest"}
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/guests")}
                    className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
