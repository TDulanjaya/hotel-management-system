"use client";

import { useEffect, useState } from "react";
import SlidePanel from "@/components/ui/SlidePanel";
import { createEvent, updateEvent } from "@/lib/api/eventApi";
import { getVenues } from "@/lib/api/venueApi";
import { getPricingItemsByCategory } from "@/lib/api/pricingApi";
import { getRooms } from "@/lib/api/roomApi";
import { CalendarPlus, Plus, Trash2 } from "lucide-react";

interface NewEventPanelProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editItem?: any | null;
}

export default function NewEventPanel({
  open,
  onClose,
  onSuccess,
  editItem,
}: NewEventPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [venues, setVenues] = useState<any[]>([]);
  const [availablePackages, setAvailablePackages] = useState<any[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<any[]>([]);
  const [occupiedRooms, setOccupiedRooms] = useState<any[]>([]);

  const defaultFormData = {
    eventName: "",
    eventType: "Wedding",
    guestCount: 50,
    primaryDate: "",
    startTime: "",
    organizerName: "",
    phone: "",
    email: "",
    roomNumber: "",
    kitchenNote: "",
    specialNote: "",
    status: "Active",
    venueId: "",
  };

  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    async function loadData() {
      try {
        const [venueList, pkgs, svcs, rooms] = await Promise.all([
          getVenues().catch(() => []),
          getPricingItemsByCategory("EVENT_PACKAGE").catch(() => []),
          getPricingItemsByCategory("EVENT_SERVICE").catch(() => []),
          getRooms().catch(() => []),
        ]);
        if (Array.isArray(venueList)) {
          setVenues(venueList);
          if (venueList.length > 0 && !formData.venueId && !editItem) {
            setFormData((prev) => ({ ...prev, venueId: venueList[0].id }));
          }
        }
        setOccupiedRooms(Array.isArray(rooms) ? rooms : []);
        const allPackages = [...(Array.isArray(pkgs) ? pkgs : []), ...(Array.isArray(svcs) ? svcs : [])];
        setAvailablePackages(allPackages);
      } catch (err) {
        console.error("Failed to load event masters", err);
      }
    }
    if (open) {
      loadData();
    }
  }, [open, editItem]);

  useEffect(() => {
    if (open) {
      if (editItem) {
        setFormData({
          eventName: editItem.eventName || "",
          eventType: editItem.eventType || "Wedding",
          guestCount: Number(editItem.guestCount || 50),
          primaryDate: editItem.primaryDate || "",
          startTime: editItem.startTime || "",
          organizerName: editItem.organizerName || "",
          phone: editItem.phone || "",
          email: editItem.email || "",
          roomNumber: editItem.roomNumber || "",
          kitchenNote: editItem.kitchenNote || "",
          specialNote: editItem.specialNote || "",
          status: editItem.status || "Active",
          venueId: editItem.selectedVenue?.id || editItem.venueId || "",
        });
        setSelectedPackages(Array.isArray(editItem.selectedPackages) ? editItem.selectedPackages : []);
      } else {
        setFormData(defaultFormData);
        setSelectedPackages([]);
      }
      setError("");
    }
  }, [open, editItem]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addPackage = (pricingItemId: string) => {
    if (!pricingItemId) return;
    const pkg = availablePackages.find((p) => p.id === pricingItemId);
    if (!pkg) return;

    const existingIndex = selectedPackages.findIndex((p) => p.id === pricingItemId);
    let updated = [...selectedPackages];
    if (existingIndex >= 0) {
      updated[existingIndex].quantity += 1;
    } else {
      updated.push({
        id: pkg.id,
        name: pkg.name,
        category: pkg.category,
        price: pkg.price || 0,
        priceType: pkg.priceType || "fixed",
        quantity: 1,
      });
    }
    setSelectedPackages(updated);
  };

  const removePackage = (id: string) => {
    setSelectedPackages((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePackageQty = (id: string, delta: number) => {
    setSelectedPackages((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p))
        .filter((p) => p.quantity > 0)
    );
  };

  const selectedVenue = venues.find((v) => v.id === formData.venueId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        guestCount: Number(formData.guestCount),
        selectedVenue: formData.venueId ? { id: formData.venueId } : null,
        selectedPackages: selectedPackages.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          priceType: p.priceType,
          quantity: p.quantity,
        })),
      };

      if (editItem) {
        await updateEvent(editItem.id, payload);
      } else {
        await createEvent(payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SlidePanel
      open={open}
      onClose={onClose}
      title={editItem ? "Edit Event" : "Create New Event"}
      subtitle={
        editItem
          ? `Updating configuration for ${editItem.eventName}`
          : "Add details for a new wedding, party, or corporate event."
      }
      icon={<CalendarPlus className="h-5 w-5 text-[#735c00]" />}
    >
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-[#4d4635]">Event Name *</label>
          <input
            required
            type="text"
            name="eventName"
            placeholder="e.g. Perera Wedding Reception / Annual Gala"
            value={formData.eventName}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30 font-semibold"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#4d4635]">Event Type *</label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30 font-semibold"
            >
              <option value="Wedding">Wedding</option>
              <option value="Party">Party</option>
              <option value="Corporate">Corporate Conference</option>
              <option value="Banquet">Private Banquet</option>
              <option value="Cocktail">Cocktail Reception</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#4d4635]">Guest Count *</label>
            <input
              required
              type="number"
              min={1}
              name="guestCount"
              value={formData.guestCount}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30 font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#4d4635]">Venue *</label>
          <select
            name="venueId"
            value={formData.venueId}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30 font-semibold"
          >
            <option value="">-- Select a venue --</option>
            {venues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name} — Rs {Number(venue.price || 0).toLocaleString()} (Cap: {venue.capacity})
              </option>
            ))}
          </select>
          {selectedVenue && (
            <p className="mt-1 text-xs text-[#735c00]">
              Base Venue Price: Rs {Number(selectedVenue.price || 0).toLocaleString()} (+10% service charge calculated server-side)
            </p>
          )}
        </div>

        {/* Dynamic Banquet Packages & Add-on Services from Database */}
        <div className="rounded-xl border border-[#e2dacf] bg-[#faf8f4] p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#735c00]">
              Catering Packages & Add-on Services (Service Pricing)
            </h3>
            <span className="text-xs font-bold text-[#4d4635]">
              {selectedPackages.length} selected
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
              Add Package or Service
            </label>
            <select
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  addPackage(e.target.value);
                  e.target.value = "";
                }
              }}
              className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-semibold text-[#735c00] focus:outline-none focus:ring-2 focus:ring-[#735c00]"
            >
              <option value="">-- Choose Banquet Package or Service --</option>
              {availablePackages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} — Rs {Number(pkg.price || 0).toLocaleString()} ({pkg.priceType === "perPerson" ? "per person" : "fixed"})
                </option>
              ))}
            </select>
          </div>

          {selectedPackages.length > 0 && (
            <div className="space-y-2 border-t border-[#e2dacf] pt-3">
              {selectedPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="flex items-center justify-between rounded-lg border border-[#d0c5af] bg-white p-2.5 text-sm"
                >
                  <div className="flex-1 pr-2">
                    <p className="font-bold text-[#1b1c1a]">{pkg.name}</p>
                    <p className="text-xs text-[#735c00] font-semibold">
                      Rs {Number(pkg.price || 0).toLocaleString()} {pkg.priceType === "perPerson" ? "× guest count" : "fixed"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updatePackageQty(pkg.id, -1)}
                      className="h-7 w-7 rounded-lg border border-[#d0c5af] font-bold hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-xs px-1">{pkg.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updatePackageQty(pkg.id, 1)}
                      className="h-7 w-7 rounded-lg border border-[#d0c5af] font-bold hover:bg-slate-100"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removePackage(pkg.id)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#4d4635]">Event Date *</label>
            <input
              required
              type="date"
              name="primaryDate"
              value={formData.primaryDate}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#4d4635]">Start Time *</label>
            <input
              required
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
            />
          </div>
        </div>

        {/* Organizer Details */}
        <div className="rounded-xl border border-[#e2dacf] bg-[#faf8f4] p-4 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#735c00]">
            Organizer / Client Contact
          </h3>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
              Organizer Full Name *
            </label>
            <input
              required
              type="text"
              name="organizerName"
              placeholder="e.g. Mr. Sunil Perera"
              value={formData.organizerName}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                Phone Number *
              </label>
              <input
                required
                type="text"
                name="phone"
                placeholder="+94 77 123 4567"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="sunil@example.com"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
              Linked In-House Room / Suite (Optional)
            </label>
            <select
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-semibold text-[#1b1c1a] focus:outline-none focus:ring-2 focus:ring-[#735c00]"
            >
              <option value="">-- None (Outside Event Organizer) --</option>
              {occupiedRooms.map((r) => (
                <option key={r.id || r.roomNumber} value={r.roomNumber}>
                  Room {r.roomNumber} ({r.type || "Room"}) {r.guestName ? `— ${r.guestName}` : ""}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-[#565e74]">
              Select if the organizer or bridal couple is staying in a hotel room or suite.
            </p>
          </div>
        </div>

        {/* Operational Notes (Kitchen & Venue) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
              Kitchen / Catering Notes
            </label>
            <textarea
              name="kitchenNote"
              placeholder="Catering instructions, allergies, dietary requirements..."
              value={formData.kitchenNote}
              onChange={handleChange}
              rows={2}
              className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-3 text-sm outline-none focus:ring-2 focus:ring-[#735c00]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
              Special / AV Setup Notes
            </label>
            <textarea
              name="specialNote"
              placeholder="Stage, sound system, projection, floral decor..."
              value={formData.specialNote}
              onChange={handleChange}
              rows={2}
              className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-3 text-sm outline-none focus:ring-2 focus:ring-[#735c00]/30"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#4d4635]">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-3 font-semibold outline-none focus:ring-2 focus:ring-[#735c00]/30"
          >
            <option value="Active">Active</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Tentative">Tentative</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex gap-4 pt-4 border-t border-[#d0c5af]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-[#d0c5af] px-8 py-3.5 font-bold text-[#4d4635] transition hover:bg-[#ece9e2]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-xl bg-[#d8b328] px-8 py-3.5 font-bold text-[#4c3a00] transition hover:bg-[#f2c426] disabled:opacity-50"
          >
            {loading ? "Saving..." : editItem ? "Update Event" : "Create Event"}
          </button>
        </div>
      </form>
    </SlidePanel>
  );
}
