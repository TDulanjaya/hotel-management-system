"use client";
import { AuthUser, getUser } from "@/utils/auth";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  Gamepad2,
  Plus,
  RefreshCw,
  Search,
  Timer,
  Trash2,
  User,
  XCircle,
  Edit3,
} from "lucide-react";
import {
  deleteGameSession,
  getGameSessions,
  updateGameSession,
  createGameSession,
} from "@/lib/api/gameApi";
import { getRooms } from "@/lib/api/roomApi";
import { getEvents } from "@/lib/api/eventApi";
import { getPricingItemsByCategory } from "@/lib/api/pricingApi";
import SlidePanel from "@/components/ui/SlidePanel";
import POSPaymentModal from "@/components/payments/POSPaymentModal";
import { ShieldCheck } from "lucide-react";

function getDurationHours(duration: string) {
  if (duration === "30 Minutes") return 0.5;
  if (duration === "Full Day") return 8;
  const num = Number(duration?.split(" ")[0]);
  return Number.isFinite(num) && num > 0 ? num : 1;
}

function ribbonClass(status: string) {
  if (status === "ACTIVE") return "border-l-4 border-l-[#735c00]";
  if (status === "OVERDUE") return "border-l-4 border-l-[#ba1a1a]";
  if (status === "COMPLETED") return "border-l-4 border-l-slate-400";
  return "border-l-4 border-l-green-500";
}

function badgeClass(status: string) {
  if (status === "ACTIVE") return "bg-[#dae2fd] text-[#565e74]";
  if (status === "OVERDUE") return "bg-[#ffdad6] text-[#93000a]";
  if (status === "COMPLETED") return "bg-slate-100 text-slate-700";
  return "bg-green-100 text-green-700";
}

export default function GamesPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    setUser(getUser());
  }, []);

  const [currentRole, setCurrentRole] = useState("");
  const [sessions, setSessions] = useState<any[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // SlidePanel State
  const [panelOpen, setPanelOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [settleSessionItem, setSettleSessionItem] = useState<any>(null);
  const [roomEndSessionItem, setRoomEndSessionItem] = useState<any>(null);

  // Relational Masters
  const [occupiedRooms, setOccupiedRooms] = useState<any[]>([]);
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [gamePricingItems, setGamePricingItems] = useState<any[]>([]);

  const defaultFormData = {
    guestName: "",
    customerType: "WALK_IN",
    billingType: "DIRECT_PAYMENT",
    pricingItemId: "",
    roomNumber: "",
    eventId: "",
    gameName: "Grand Billiards Table I",
    gameType: "Billiards",
    location: "Recreation Floor",
    sessionType: "Hourly Rental",
    startTime: "",
    duration: "1 Hour",
    hourlyRate: 2500,
    totalAmount: 2500,
    paymentMethod: "Direct Gate Payment",
    notes: "",
    equipmentChecked: true,
    accessoriesIssued: true,
    guestResponsibilityConfirmed: true,
    status: "ACTIVE",
  };

  const [formData, setFormData] = useState(defaultFormData);

  const canManage =
    currentRole === "OWNER" ||
    currentRole === "MANAGER" ||
    currentRole === "GAME_STAFF";

  const canDelete = currentRole === "OWNER" || currentRole === "MANAGER";

  const loadSessions = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getGameSessions();
      const sessionList = Array.isArray(data) ? data : [];
      setSessions(sessionList);
      setFilteredSessions(sessionList);
    } catch (err: any) {
      setError(err.message || "Failed to load game sessions.");
    } finally {
      setLoading(false);
    }
  };

  // Load relational masters (Rooms, Events, and Game Pricing Items)
  useEffect(() => {
    async function loadRelations() {
      try {
        const [roomsData, eventsData, pricingData] = await Promise.all([
          getRooms().catch(() => []),
          getEvents().catch(() => []),
          getPricingItemsByCategory("GAME").catch(() => []),
        ]);
        setOccupiedRooms(Array.isArray(roomsData) ? roomsData : []);
        setEventsList(Array.isArray(eventsData) ? eventsData : []);
        const gItems = Array.isArray(pricingData) ? pricingData : [];
        setGamePricingItems(gItems);

        if (gItems.length > 0 && !formData.pricingItemId) {
          const first = gItems[0];
          setFormData((prev) => ({
            ...prev,
            pricingItemId: first.id,
            gameName: first.name,
            hourlyRate: first.price || 2500,
            totalAmount: Math.round((first.price || 2500) * getDurationHours(prev.duration)),
          }));
        }
      } catch (err) {
        console.error("Failed to load relational masters:", err);
      }
    }
    loadRelations();
  }, []);

  const handleOpenAdd = () => {
    setEditItem(null);
    setFormError("");
    const initialItem = gamePricingItems[0];
    const initialRate = initialItem?.price || 2500;
    setFormData({
      ...defaultFormData,
      pricingItemId: initialItem?.id || "",
      gameName: initialItem?.name || "Grand Billiards Table I",
      hourlyRate: initialRate,
      totalAmount: initialRate,
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    setPanelOpen(true);
  };

  const handleOpenEdit = (session: any) => {
    setEditItem(session);
    setFormError("");
    const matched = gamePricingItems.find((g) => g.id === session.pricingItemId || g.name === session.gameName);
    const rate = session.hourlyRate || matched?.price || 2500;
    setFormData({
      pricingItemId: session.pricingItemId || matched?.id || (gamePricingItems[0]?.id || ""),
      guestName: session.guestName || "",
      customerType: session.customerType || (session.roomNumber ? "HOTEL_GUEST" : "WALK_IN"),
      billingType: session.billingType || session.paymentMethod || "DIRECT_PAYMENT",
      roomNumber: session.roomNumber || "",
      eventId: session.eventId || "",
      gameName: session.gameName || matched?.name || "Grand Billiards Table I",
      gameType: session.gameType || "Billiards",
      location: session.location || "Recreation Floor",
      sessionType: session.sessionType || "Hourly Rental",
      startTime: session.startTime ? String(session.startTime).slice(11, 16) : "",
      duration: session.duration || "1 Hour",
      hourlyRate: rate,
      totalAmount: session.totalAmount || Math.round(rate * getDurationHours(session.duration || "1 Hour")),
      paymentMethod: session.paymentMethod || "Direct Gate Payment",
      notes: session.notes || "",
      equipmentChecked: session.equipmentChecked ?? true,
      accessoriesIssued: session.accessoriesIssued ?? true,
      guestResponsibilityConfirmed: session.guestResponsibilityConfirmed ?? true,
      status: session.status || "ACTIVE",
    });
    setPanelOpen(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
      return;
    }

    if (name === "pricingItemId") {
      const selected = gamePricingItems.find((g) => g.id === value);
      const hours = getDurationHours(formData.duration);
      const rate = selected?.price || 2500;
      setFormData((prev) => ({
        ...prev,
        pricingItemId: selected?.id || value,
        gameName: selected?.name || prev.gameName,
        hourlyRate: rate,
        totalAmount: Math.round(rate * hours),
      }));
      return;
    }

    if (name === "duration") {
      const hours = getDurationHours(value);
      setFormData((prev) => ({
        ...prev,
        duration: value,
        totalAmount: Math.round(prev.hourlyRate * hours),
      }));
      return;
    }

    if (name === "hourlyRate") {
      const rate = Number(value) || 0;
      const hours = getDurationHours(formData.duration);
      setFormData((prev) => ({
        ...prev,
        hourlyRate: rate,
        totalAmount: Math.round(rate * hours),
      }));
      return;
    }

    if (name === "customerType") {
      setFormData((prev) => ({
        ...prev,
        customerType: value,
        billingType: "DIRECT_PAYMENT",
        roomNumber: "",
        eventId: "",
      }));
      return;
    }

    if (name === "roomNumber") {
      const room = occupiedRooms.find((r: any) => r.roomNumber === value);
      setFormData((prev) => ({
        ...prev,
        roomNumber: value,
        guestName: room?.guestName || prev.guestName,
      }));
      return;
    }

    if (name === "eventId") {
      const ev = eventsList.find((item: any) => item.id === value);
      setFormData((prev) => ({
        ...prev,
        eventId: value,
        guestName: ev?.organizerName || ev?.eventName || prev.guestName,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.guestName.trim()) {
      setFormError("Guest name or resident selection is required.");
      return;
    }

    try {
      setFormSubmitting(true);
      setFormError("");

      const payload = {
        ...formData,
        sessionDate: new Date().toISOString().split("T")[0],
      };

      if (editItem) {
        await updateGameSession(editItem.id, payload);
      } else {
        await createGameSession(payload);
      }

      setPanelOpen(false);
      setEditItem(null);
      await loadSessions();
    } catch (err: any) {
      setFormError(err.message || "Failed to save game session.");
    } finally {
      setFormSubmitting(false);
    }
  };

  useEffect(() => {
    loadSessions();

    if (user?.role) {
      setCurrentRole(user.role);
      return;
    }

    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setCurrentRole(parsedUser.role || "");
      }
    } catch {
      setCurrentRole("");
    }
  }, [user]);

  useEffect(() => {
    const keyword = searchText.toLowerCase().trim();

    if (!keyword) {
      setFilteredSessions(sessions);
      return;
    }

    const result = sessions.filter((session) => {
      return (
        session.guestName?.toLowerCase().includes(keyword) ||
        session.roomNumber?.toLowerCase().includes(keyword) ||
        session.gameName?.toLowerCase().includes(keyword) ||
        session.gameType?.toLowerCase().includes(keyword) ||
        session.status?.toLowerCase().includes(keyword)
      );
    });

    setFilteredSessions(result);
  }, [searchText, sessions]);

  const handleEndSession = async (session: any) => {
    if (session.billingType === "ROOM_FOLIO") {
      setRoomEndSessionItem(session);
    } else {
      setSettleSessionItem(session);
    }
  };

  const handleConfirmRoomEndSession = async (session: any) => {
    try {
      await updateGameSession(session.id, {
        ...session,
        status: "COMPLETED",
      });
      setRoomEndSessionItem(null);
      await loadSessions();
    } catch (err: any) {
      alert(err.message || "Failed to end rental.");
    }
  };

  const handleMarkOverdue = async (session: any) => {
    try {
      await updateGameSession(session.id, {
        ...session,
        status: "OVERDUE",
      });

      await loadSessions();
    } catch (err: any) {
      alert(err.message || "Failed to mark session as overdue.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this game session?")) return;

    try {
      await deleteGameSession(id);
      await loadSessions();
      alert("Game session deleted successfully.");
    } catch (err: any) {
      alert(err.message || "Failed to delete game session.");
    }
  };

  const availableCount = sessions.filter((s) => s.status === "AVAILABLE").length;
  const activeCount = sessions.filter((s) => s.status === "ACTIVE").length;
  const overdueCount = sessions.filter((s) => s.status === "OVERDUE").length;
  const completedCount = sessions.filter((s) => s.status === "COMPLETED").length;

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "GAME_STAFF"]}>
      <div className="min-h-screen bg-[#f5f3ef] text-[#1b1c1a]">
        <AppSidebar />

        <main className="min-h-screen lg:ml-[280px]">
          <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[#d0c5af] bg-[#f8f5ef]/95 pl-16 pr-4 sm:px-8 backdrop-blur-md">
            <div className="flex items-center gap-2 sm:gap-3 rounded-full bg-white px-3 sm:px-4 py-2 border border-[#d0c5af] shadow-sm max-w-[200px] sm:max-w-none">
              <Search size={16} className="text-[#4d4635] shrink-0" />

              <input
                type="text"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search..."
                className="w-full sm:w-72 border-none bg-transparent text-xs sm:text-sm text-[#4d4635] outline-none"
              />
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
              <button className="relative text-[#4d4635] transition hover:text-[#735c00]">
                <Bell size={20} className="sm:w-[22px] sm:h-[22px]" />
                {overdueCount > 0 && (
                  <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#ba1a1a]" />
                )}
              </button>

              <div className="flex items-center gap-3 border-l border-[#d0c5af] pl-3 sm:pl-6">
                <div className="hidden text-right md:block">
                  <p className="text-sm font-bold">{user?.name || "Staff"}</p>
                  <p className="text-xs uppercase tracking-wider text-[#4d4635]">
                    {currentRole || user?.role || "Staff"}
                  </p>
                </div>

                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 border-[#d4af37] bg-[#131b2e] text-xs sm:text-sm font-bold text-[#ffe088]">
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : "US"}
                </div>
              </div>
            </div>
          </header>

          <section className="mx-auto max-w-[1600px] px-4 pb-8 pt-6 sm:px-8 sm:pb-12 sm:pt-10">
            <div className="mb-6 sm:mb-8 flex flex-col justify-between gap-4 sm:gap-6 xl:flex-row xl:items-end">
              <div>
                <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                  Games Module
                </p>

                <h1 className="mt-1 sm:mt-3 text-2xl sm:text-4xl font-bold text-[#735c00]">
                  Games & Amenities
                </h1>

                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#4d4635]">
                  Manage luxury recreation facilities, guest rentals and
                  equipment audit status.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full xl:w-auto">
                <button
                  onClick={loadSessions}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-[#735c00] bg-white px-5 py-3 text-sm sm:text-base font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
                >
                  <RefreshCw size={18} />
                  Refresh
                </button>

                {canManage && (
                  <button
                    onClick={handleOpenAdd}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#735c00] px-5 py-3 text-sm sm:text-base font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
                  >
                    <Plus size={18} />
                    New Game Session
                  </button>
                )}
              </div>
            </div>

            <div className="mb-6 sm:mb-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <StatCard
                label="Available"
                value={String(availableCount)}
                color="text-green-700"
              />

              <StatCard
                label="Active"
                value={String(activeCount)}
                color="text-[#735c00]"
              />

              <StatCard
                label="Overdue"
                value={String(overdueCount)}
                color="text-[#ba1a1a]"
              />

              <StatCard
                label="Completed"
                value={String(completedCount)}
                color="text-slate-700"
              />
            </div>

            {loading ? (
              <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 sm:p-10 text-center shadow-sm">
                <p className="text-base sm:text-lg font-bold text-[#735c00]">
                  Loading game sessions...
                </p>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 sm:p-10 text-center shadow-sm">
                <p className="font-bold text-red-700">{error}</p>

                <button
                  onClick={loadSessions}
                  className="mt-4 rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white"
                >
                  Try Again
                </button>
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 sm:p-10 text-center shadow-sm">
                <Gamepad2 size={44} className="mx-auto mb-4 text-[#735c00]" />

                <p className="text-xl font-bold text-[#735c00]">
                  No sessions found
                </p>

                <p className="mt-2 text-xs sm:text-sm text-[#4d4635]">
                  Create a new game session to get started.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
                {filteredSessions.map((session) => (
                  <GameSessionCard
                    key={session.id}
                    session={session}
                    canManage={canManage}
                    canDelete={canDelete}
                    onEdit={handleOpenEdit}
                    onEnd={handleEndSession}
                    onOverdue={handleMarkOverdue}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}

            <section className="mt-6 sm:mt-8 rounded-2xl border border-[#d0c5af] bg-white p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <AlertTriangle size={24} className="text-[#ba1a1a] shrink-0" />

                <div>
                  <h2 className="text-lg sm:text-xl font-bold">Audit Reminder</h2>

                  <p className="text-xs sm:text-sm text-[#4d4635]">
                    Overdue sessions and missing equipment should be checked
                    before closing the rental.
                  </p>
                </div>
              </div>
            </section>
          </section>
        </main>

        {/* Slide-over Panel for Game Session */}
        <SlidePanel
          open={panelOpen}
          onClose={() => setPanelOpen(false)}
          title={editItem ? "Edit Game Session" : "New Game Session"}
          subtitle={
            editItem
              ? `Update session for ${editItem.guestName || "Guest"}`
              : "Register and start a recreation amenity rental"
          }
          icon={<Gamepad2 className="h-5 w-5 text-[#735c00]" />}
        >
          {formError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 font-bold text-red-700">
              {formError}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Facility / Game Selection */}
            <div className="rounded-xl border border-[#e2dacf] bg-[#faf8f4] p-4 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#735c00]">
                Amenity & Activity
              </h3>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                  Select Facility / Game (from Service Pricing) *
                </label>
                <select
                  name="pricingItemId"
                  value={formData.pricingItemId}
                  onChange={handleFormChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-semibold text-[#735c00] focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                >
                  {gamePricingItems.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name} — Rs {Number(opt.price || 0).toLocaleString()}/hr
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                    Hourly Rate (Rs)
                  </label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleFormChange}
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-bold focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                  />
                </div>
              </div>
            </div>

            {/* Guest Category & Relational Selector */}
            <div className="rounded-xl border border-[#e2dacf] bg-[#faf8f4] p-4 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#735c00]">
                Customer & Billing
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                    Customer Category
                  </label>
                  <select
                    name="customerType"
                    value={formData.customerType}
                    onChange={handleFormChange}
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-semibold focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                  >
                    <option value="WALK_IN">Outside Visitor / Walk-in</option>
                    <option value="HOTEL_GUEST">Hotel Resident</option>
                    <option value="EVENT_GUEST">Event Attendee</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                    Payment / Settlement
                  </label>
                  <select
                    name="billingType"
                    value={formData.billingType}
                    onChange={handleFormChange}
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-semibold focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                  >
                    <option value="DIRECT_PAYMENT">Gate / Cash / Card Payment</option>
                    {formData.customerType === "HOTEL_GUEST" && (
                      <option value="ROOM_FOLIO">Charge to Room Folio</option>
                    )}
                    {formData.customerType === "EVENT_GUEST" && (
                      <option value="EVENT_MASTER_BILL">Charge to Event Master Bill</option>
                    )}
                  </select>
                </div>
              </div>

              {formData.customerType === "HOTEL_GUEST" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                    Select Occupied Room *
                  </label>
                  <select
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleFormChange}
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-semibold text-[#735c00] focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                  >
                    <option value="">-- Choose Resident Room --</option>
                    {occupiedRooms.map((r: any) => (
                      <option key={r.id || r.roomNumber} value={r.roomNumber}>
                        Room {r.roomNumber} — {r.type || "Room"} ({r.guestName || "Guest"})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.customerType === "EVENT_GUEST" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                    Select Active Event *
                  </label>
                  <select
                    name="eventId"
                    value={formData.eventId}
                    onChange={handleFormChange}
                    className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-semibold text-[#735c00] focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                  >
                    <option value="">-- Choose Active Event --</option>
                    {eventsList.map((ev: any) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.eventName || ev.title || "Event"} ({ev.organizerName || "Organizer"})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                  Guest Name *
                </label>
                <input
                  required
                  type="text"
                  name="guestName"
                  placeholder="Player / Guest full name"
                  value={formData.guestName}
                  onChange={handleFormChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                />
              </div>
            </div>

            {/* Timing & Calculation */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                  Duration
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleFormChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-semibold focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                >
                  <option value="30 Minutes">30 Minutes</option>
                  <option value="1 Hour">1 Hour</option>
                  <option value="2 Hours">2 Hours</option>
                  <option value="3 Hours">3 Hours</option>
                  <option value="Full Day">Full Day (8 Hrs)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                  Calculated Total
                </label>
                <div className="mt-1 flex h-[48px] items-center rounded-xl border border-[#d0c5af] bg-[#fbf9f5] px-4 font-mono text-base font-extrabold text-[#735c00]">
                  Rs {Number(formData.totalAmount || 0).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-semibold focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="OVERDUE">OVERDUE</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                  Start Time
                </label>
                <input
                  type="text"
                  name="startTime"
                  placeholder="e.g. 14:30"
                  value={formData.startTime}
                  onChange={handleFormChange}
                  className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                />
              </div>
            </div>

            {/* Equipment Safety & Checklist */}
            <div className="space-y-3 rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                Audit & Equipment Handover
              </p>
              <label className="flex items-center gap-3 text-sm font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  name="equipmentChecked"
                  checked={formData.equipmentChecked}
                  onChange={handleFormChange}
                  className="h-4 w-4 rounded accent-[#735c00]"
                />
                Main equipment verified and intact
              </label>

              <label className="flex items-center gap-3 text-sm font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  name="accessoriesIssued"
                  checked={formData.accessoriesIssued}
                  onChange={handleFormChange}
                  className="h-4 w-4 rounded accent-[#735c00]"
                />
                Accessories & controllers issued
              </label>

              <label className="flex items-center gap-3 text-sm font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  name="guestResponsibilityConfirmed"
                  checked={formData.guestResponsibilityConfirmed}
                  onChange={handleFormChange}
                  className="h-4 w-4 rounded accent-[#735c00]"
                />
                Guest terms & responsibility confirmed
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                Notes
              </label>
              <textarea
                name="notes"
                placeholder="Optional activity or audit notes..."
                value={formData.notes}
                onChange={handleFormChange}
                rows={2}
                className="mt-1 w-full rounded-xl border border-[#d0c5af] bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#735c00]"
              />
            </div>

            <div className="flex gap-4 pt-4 border-t border-[#d0c5af]">
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="flex-1 rounded-xl border border-[#d0c5af] px-8 py-3.5 font-bold text-[#4d4635] transition hover:bg-[#ece9e2]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={formSubmitting}
                className="flex-1 rounded-xl bg-[#735c00] px-8 py-3.5 font-bold text-white transition hover:bg-[#d4af37] disabled:opacity-50"
              >
                {formSubmitting
                  ? "Saving..."
                  : editItem
                  ? "Update Session"
                  : "Start Session"}
              </button>
            </div>
          </form>
        </SlidePanel>

        {/* Universal POS Payment Modal for Recreation Games Settlement */}
        {settleSessionItem && (
          <POSPaymentModal
            isOpen={Boolean(settleSessionItem)}
            onClose={() => setSettleSessionItem(null)}
            title="Games Lounge Session Settlement"
            sourceType="GAME_SESSION"
            sourceId={settleSessionItem.id}
            customerName={settleSessionItem.guestName || "Walk-in Gamer"}
            customerType={settleSessionItem.customerType || "WALK_IN"}
            roomNumber={settleSessionItem.roomNumber}
            serviceDescription={`Recreation Session: ${settleSessionItem.gameName} (${settleSessionItem.duration || "Hourly"})`}
            totalAmount={Number(settleSessionItem.totalAmount || 0)}
            onPaymentSuccess={async () => {
              setSettleSessionItem(null);
              await loadSessions();
            }}
          />
        )}

        {/* Room Folio Resident Game Session Close Dialog */}
        {roomEndSessionItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-2 text-[#735c00]">
                <ShieldCheck size={24} />
                <h3 className="text-lg font-extrabold text-[#1b1c1a]">Resident Session Settlement</h3>
              </div>
              <p className="text-sm text-[#4d4635]">
                Game session for <strong className="text-[#1b1c1a]">{roomEndSessionItem.gameName}</strong> was enjoyed by in-house guest{" "}
                <strong>{roomEndSessionItem.guestName || "Resident"}</strong> (Room <strong>{roomEndSessionItem.roomNumber}</strong>).
              </p>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-900">
                Session fee of <strong>Rs {roomEndSessionItem.totalAmount}</strong> is posted to Room Folio and will be paid at Front Desk Room Checkout.
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleConfirmRoomEndSession(roomEndSessionItem)}
                  className="w-full rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white hover:bg-emerald-800 shadow-md"
                >
                  Confirm & Close (Keep on Room Folio)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const temp = roomEndSessionItem;
                    setRoomEndSessionItem(null);
                    setSettleSessionItem(temp);
                  }}
                  className="w-full rounded-xl border border-[#735c00] py-2.5 text-xs font-bold text-[#735c00] hover:bg-[#735c00]/5"
                >
                  Guest Wants to Pay Cash/Card Now Instead
                </button>
                <button
                  type="button"
                  onClick={() => setRoomEndSessionItem(null)}
                  className="w-full text-center text-xs text-gray-500 hover:underline py-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

function GameSessionCard({
  session,
  canManage,
  canDelete,
  onEdit,
  onEnd,
  onOverdue,
  onDelete,
}: {
  session: any;
  canManage: boolean;
  canDelete: boolean;
  onEdit: (session: any) => void;
  onEnd: (session: any) => void;
  onOverdue: (session: any) => void;
  onDelete: (id: string) => void;
}) {
  const isActive = session.status === "ACTIVE";
  const isOverdue = session.status === "OVERDUE";
  const isAvailable = session.status === "AVAILABLE";
  const isCompleted = session.status === "COMPLETED";

  return (
    <article
      className={`overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${ribbonClass(
        session.status
      )}`}
    >
      <div className="p-4 sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold truncate">
              {session.gameName || "Game Session"}
            </h2>

            <p className="text-xs font-bold uppercase tracking-wide text-[#735c00]">
              {session.gameType || "Amenity"}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold shrink-0 ${badgeClass(
              session.status || "ACTIVE"
            )}`}
          >
            {session.status || "ACTIVE"}
          </span>
        </div>

        {!isAvailable ? (
          <>
            <div className="mb-4 sm:mb-5 flex items-center gap-3 rounded-xl bg-[#f5f3ef] p-3 sm:p-4">
              <User size={20} className="text-[#735c00] shrink-0" />

              <div className="min-w-0">
                <p className="text-xs text-[#4d4635]">Guest / Room</p>

                <p className="text-sm font-bold truncate">
                  {session.guestName || "N/A"} ({session.roomNumber || "N/A"})
                </p>
              </div>
            </div>

            <div className="mb-4 sm:mb-5 flex items-center gap-3 rounded-xl bg-[#101827] p-3 sm:p-4 text-white">
              <Timer size={20} className="text-[#d4af37] shrink-0" />

              <div>
                <p className="text-xs text-white/60">
                  {isOverdue ? "Time Overdue" : "Rental Duration"}
                </p>

                <p className="text-xl sm:text-2xl font-bold">
                  {session.duration || "Active"}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="mb-4 sm:mb-5 rounded-xl bg-green-50 p-3 sm:p-4 text-green-700">
            <div className="flex items-center gap-2">
              <CheckCircle size={18} />

              <p className="font-bold text-sm">Ready for check-in</p>
            </div>

            <p className="mt-1 text-xs sm:text-sm">
              Standard kit checked and available.
            </p>
          </div>
        )}

        <div className="mb-4 sm:mb-5 rounded-xl bg-[#fbf9f5] p-3.5 sm:p-4">
          <p className="mb-2 text-xs sm:text-sm font-bold text-[#4d4635]">
            Session Details
          </p>

          <InfoRow label="Location" value={session.location || "-"} />
          <InfoRow label="Session" value={session.sessionType || "-"} />
          <InfoRow label="Payment" value={session.paymentMethod || "-"} />
          <InfoRow
            label="Amount"
            value={`Rs ${Number(session.totalAmount || 0).toLocaleString()}`}
          />
        </div>

        <div className="space-y-2 sm:space-y-3">
          <p className="text-xs sm:text-sm font-bold text-[#4d4635]">Equipment Kit</p>

          <ChecklistItem
            checked={session.equipmentChecked}
            label="Main equipment checked"
          />

          <ChecklistItem
            checked={session.accessoriesIssued}
            label="Accessories issued"
          />

          <ChecklistItem
            checked={session.guestResponsibilityConfirmed}
            label="Guest responsibility confirmed"
          />
        </div>

        {session.notes && (
          <p className="mt-3 sm:mt-4 rounded-xl bg-yellow-50 p-3 text-xs sm:text-sm font-semibold text-[#806300]">
            Note: {session.notes}
          </p>
        )}
      </div>

      <div className="border-t border-[#d0c5af] bg-[#f5f3ef] p-3 sm:p-4">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {canManage && (
            <button
              onClick={() => onEdit(session)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[#735c00] px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
            >
              <Edit3 size={15} />
              Edit
            </button>
          )}

          {canManage && (isActive || isOverdue) && (
            <button
              onClick={() => onEnd(session)}
              className="flex-1 rounded-xl bg-[#ba1a1a] px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white transition hover:bg-[#93000a]"
            >
              End Rental
            </button>
          )}

          {canManage && isActive && (
            <button
              onClick={() => onOverdue(session)}
              className="flex-1 rounded-xl bg-[#735c00] px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
            >
              Mark Overdue
            </button>
          )}

          {canDelete && isCompleted && (
            <button
              onClick={() => onDelete(session.id)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-red-700 transition hover:bg-red-50"
            >
              <Trash2 size={16} />
              Delete
            </button>
          )}

          {isCompleted && (
            <div className="w-full rounded-xl bg-slate-100 px-4 py-2.5 sm:py-3 text-center text-xs sm:text-sm font-bold text-slate-700">
              Completed
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function ChecklistItem({
  checked,
  label,
}: {
  checked: boolean;
  label: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 text-xs sm:text-sm ${
        checked ? "text-green-700" : "text-[#ba1a1a]"
      }`}
    >
      {checked ? <CheckCircle size={15} /> : <XCircle size={15} />}
      <span>{label}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 text-xs sm:text-sm py-0.5">
      <span className="text-[#4d4635]">{label}</span>
      <span className="font-bold text-[#1b1c1a]">{value}</span>
    </div>
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
    <div className="rounded-2xl border border-[#d0c5af] bg-white p-4 sm:p-6 shadow-sm">
      <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#4d4635]">
        {label}
      </p>

      <p className={`mt-1 sm:mt-2 text-2xl sm:text-4xl font-extrabold ${color}`}>{value}</p>
    </div>
  );
}