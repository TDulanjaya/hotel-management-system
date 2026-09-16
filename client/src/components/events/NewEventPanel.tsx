"use client";

import { useEffect, useState } from "react";
import SlidePanel from "@/components/ui/SlidePanel";
import { createEvent } from "@/lib/api/eventApi";
import { getVenues } from "@/lib/api/venueApi";
import { CalendarPlus } from "lucide-react";

interface NewEventPanelProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewEventPanel({ open, onClose, onSuccess }: NewEventPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [venues, setVenues] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "Wedding",
    guestCount: 1,
    primaryDate: "",
    startTime: "",
    organizerName: "",
    phone: "",
    status: "Active",
    venueId: "",
  });

  useEffect(() => {
    async function loadVenues() {
      try {
        const venueList = await getVenues();
        if (Array.isArray(venueList)) {
          setVenues(venueList);
          if (venueList.length > 0 && !formData.venueId) {
            setFormData((prev) => ({ ...prev, venueId: venueList[0].id }));
          }
        }
      } catch (err) {
        console.error("Failed to load venues", err);
      }
    }
    if (open) {
      loadVenues();
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectedVenue = venues.find((v) => v.id === formData.venueId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createEvent({
        ...formData,
        guestCount: Number(formData.guestCount),
        selectedVenue: formData.venueId ? { id: formData.venueId } : null,
      });
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        eventName: "",
        eventType: "Wedding",
        guestCount: 1,
        primaryDate: "",
        startTime: "",
        organizerName: "",
        phone: "",
        status: "Active",
        venueId: venues.length > 0 ? venues[0].id : "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SlidePanel
      open={open}
      onClose={onClose}
      title="Create New Event"
      subtitle="Add details for a new wedding, party, or corporate event."
      icon={<CalendarPlus className="h-5 w-5" />}
    >
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-[#4d4635]">Event Name</label>
          <input required type="text" name="eventName" value={formData.eventName} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#4d4635]">Event Type</label>
            <select name="eventType" value={formData.eventType} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
              <option value="Wedding">Wedding</option>
              <option value="Party">Party</option>
              <option value="Corporate">Corporate</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#4d4635]">Guest Count</label>
            <input required type="number" min={1} name="guestCount" value={formData.guestCount} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#4d4635]">Venue</label>
          <select
            name="venueId"
            value={formData.venueId}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
          >
            <option value="">-- Select a venue --</option>
            {venues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name} — Rs {Number(venue.price || 0).toLocaleString()}
              </option>
            ))}
          </select>
          {selectedVenue && (
            <p className="mt-1 text-xs text-[#4d4635]">
              Base Venue Price: Rs {Number(selectedVenue.price || 0).toLocaleString()} (+10% service charge calculated server-side)
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#4d4635]">Date</label>
            <input required type="date" name="primaryDate" value={formData.primaryDate} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30" />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#4d4635]">Start Time</label>
            <input required type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#4d4635]">Organizer Name</label>
            <input required type="text" name="organizerName" value={formData.organizerName} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30" />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#4d4635]">Phone</label>
            <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30" />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-[#d0c5af] px-8 py-4 font-bold text-[#4d4635] transition hover:bg-[#ece9e2]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-xl bg-[#d8b328] px-8 py-4 font-bold text-[#4c3a00] transition hover:bg-[#f2c426]"
          >
            {loading ? "Saving..." : "Save Event"}
          </button>
        </div>
      </form>
    </SlidePanel>
  );
}
