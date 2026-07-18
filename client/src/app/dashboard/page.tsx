"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuthContext } from "@/context/AuthContext";
import { getToken } from "@/utils/auth";
import {
  BedDouble,
  CalendarDays,
  Car,
  ChefHat,
  ClipboardList,
  Hotel,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Utensils,
  Wallet,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8080/api";

function getAuthHeaders() {
  const token = getToken();

  if (!token) {
    throw new Error("You are not logged in.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    let message = "Request failed";

    try {
      const data = await response.json();
      message = data.message || data.error || message;
    } catch {
      message = await response.text();
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  return JSON.parse(text);
}

async function fetchRooms() {
  const response = await fetch(`${API_BASE_URL}/rooms?size=1000`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(response);
  return data?.content !== undefined ? data.content : data;
}

async function fetchParkingBookings() {
  const response = await fetch(`${API_BASE_URL}/parking`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(response);
  return data?.content !== undefined ? data.content : data;
}

async function fetchEvents() {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(response);
  return data?.content !== undefined ? data.content : data;
}

async function fetchGuests() {
  const response = await fetch(`${API_BASE_URL}/guests?size=1000`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(response);
  return data?.content !== undefined ? data.content : data;
}

async function fetchPayments() {
  const response = await fetch(`${API_BASE_URL}/payments`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(response);
  return data?.content !== undefined ? data.content : data;
}

async function fetchRestaurantOrders() {
  const response = await fetch(`${API_BASE_URL}/restaurant/orders`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(response);
  return data?.content !== undefined ? data.content : data;
}

async function fetchRoomServiceOrders() {
  const response = await fetch(`${API_BASE_URL}/room-service`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(response);
  return data?.content !== undefined ? data.content : data;
}

export default function DashboardPage() {
  const { user } = useAuthContext();

  const [currentRole, setCurrentRole] = useState("");
  const [rooms, setRooms] = useState<any[]>([]);
  const [parkingBookings, setParkingBookings] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [guests, setGuests] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [restaurantOrders, setRestaurantOrders] = useState<any[]>([]);
  const [roomServiceOrders, setRoomServiceOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        roomsData,
        parkingData,
        eventsData,
        guestsData,
        paymentsData,
        restaurantData,
        roomServiceData,
      ] = await Promise.all([
        fetchRooms(),
        fetchParkingBookings(),
        fetchEvents(),
        fetchGuests(),
        fetchPayments(),
        fetchRestaurantOrders(),
        fetchRoomServiceOrders(),
      ]);

      setRooms(Array.isArray(roomsData) ? roomsData : []);
      setParkingBookings(Array.isArray(parkingData) ? parkingData : []);
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setGuests(Array.isArray(guestsData) ? guestsData : []);
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      setRestaurantOrders(Array.isArray(restaurantData) ? restaurantData : []);
      setRoomServiceOrders(Array.isArray(roomServiceData) ? roomServiceData : []);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

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

  const totalRooms = rooms.length;

  const availableRooms = rooms.filter(
    (room) => room.status === "AVAILABLE" || room.status === "Available"
  ).length;

  const occupiedRooms = rooms.filter(
    (room) => room.status === "OCCUPIED" || room.status === "Occupied"
  ).length;

  const maintenanceRooms = rooms.filter(
    (room) => room.status === "MAINTENANCE" || room.status === "Maintenance"
  ).length;

  const occupancyRate =
    totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : "0.0";

  const parkingTotal = 50;

  const activeParking = parkingBookings.filter((booking) => {
    const status = String(booking.status || "").toLowerCase();
    return status !== "completed" && status !== "cancelled" && status !== "out";
  }).length;

  const parkingOccupancyRate =
    parkingTotal > 0 ? ((activeParking / parkingTotal) * 100).toFixed(0) : "0";

  const activeEvents = events.filter((event) => {
    const status = String(event.status || "").toLowerCase();
    return status !== "completed" && status !== "cancelled";
  }).length;

  const totalGuests = guests.length;

  const todayRevenue = payments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0
  );

  const pendingFoodOrders = restaurantOrders.filter(
    (order) => order.status === "PENDING" || order.status === "IN_PROGRESS"
  ).length;

  const pendingRoomService = roomServiceOrders.filter(
    (order) => order.status === "PENDING" || order.status === "IN_PROGRESS"
  ).length;

  const systemScore =
    Number(occupancyRate) > 90 || maintenanceRooms > 5 ? "Attention" : "Healthy";

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER"]}>
      <div className="min-h-screen bg-[#f7f4ee] text-[#111827]">
        <AppSidebar />

        <main className="lg:ml-[280px]">
          <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-[#e6dfd2] bg-[#f7f4ee]/90 px-6 backdrop-blur-xl lg:px-8">
            <div className="flex flex-1 items-center gap-4">
              <div className="hidden w-full max-w-[470px] items-center gap-3 rounded-full bg-[#ece9e2] px-5 py-3 md:flex">
                <span className="text-slate-500">⌕</span>

                <input
                  type="text"
                  placeholder="Search rooms, guests, reports..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-5">
              <button
                onClick={loadDashboardData}
                className="flex items-center gap-2 rounded-xl border border-[#735c00] bg-white px-4 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
              >
                <RefreshCw size={16} />
                Refresh
              </button>

              <Link
                href="/reservations"
                className="hidden rounded-xl bg-[#735c00] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00] md:block"
              >
                New Reservation
              </Link>

              <div className="hidden h-8 w-px bg-[#ddd5c8] md:block" />

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-bold leading-none">
                    {user?.name || "Loading..."}
                  </p>

                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {currentRole || user?.role || "..."}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-[#d8b328] bg-white text-lg font-extrabold uppercase text-[#735c00] shadow-sm">
                  {user?.name ? user.name.charAt(0) : "•"}
                </div>
              </div>
            </div>
          </header>

          <section className="px-6 py-10 lg:px-8">
            <section className="mb-8 overflow-hidden rounded-[28px] border border-[#e6dfd2] bg-[#101827] shadow-xl">
              <div className="relative p-8 md:p-10">
                <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#d8b328]/25 blur-3xl" />
                <div className="absolute -bottom-20 left-1/3 h-60 w-60 rounded-full bg-[#735c00]/25 blur-3xl" />

                <div className="relative z-10 grid gap-8 xl:grid-cols-[1.3fr_0.7fr] xl:items-center">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.3em] text-[#d8b328]">
                      <Sparkles size={18} />
                      The Camellia Reserve
                    </p>

                    <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                      Luxury Hotel Operations Command Center
                    </h1>

                    <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
                      Good Morning,{" "}
                      {user?.name ? user.name.split(" ")[0] : "Manager"}. Your
                      live hotel performance, operations flow, and department
                      status are ready.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        href="/reports"
                        className="rounded-xl bg-[#d8b328] px-6 py-3 font-bold text-[#241a00] transition hover:bg-[#f3d766]"
                      >
                        View Reports
                      </Link>

                      <Link
                        href="/rooms"
                        className="rounded-xl border border-white/20 px-6 py-3 font-bold text-white transition hover:bg-white/10"
                      >
                        Manage Rooms
                      </Link>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
                    <p className="text-sm font-bold uppercase tracking-widest text-[#d8b328]">
                      System Health
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <div>
                        <h2 className="text-4xl font-extrabold text-white">
                          {systemScore}
                        </h2>

                        <p className="mt-2 text-sm text-white/65">
                          Based on occupancy and maintenance status.
                        </p>
                      </div>

                      <ShieldCheck className="text-[#d8b328]" size={58} />
                    </div>

                    <div className="mt-6 rounded-2xl bg-white/10 p-4">
                      <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-widest text-white/70">
                        <span>Occupancy</span>
                        <span>{occupancyRate}%</span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-white/20">
                        <div
                          className="h-full rounded-full bg-[#d8b328]"
                          style={{ width: `${occupancyRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 font-bold text-red-700">
                {error}
              </div>
            )}

            <section className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <TopStatCard
                label="Today Revenue"
                value={
                  loading ? "..." : `Rs ${todayRevenue.toLocaleString()}`
                }
                note="From recorded payments"
                icon={<Wallet />}
              />

              <TopStatCard
                label="Total Guests"
                value={loading ? "..." : String(totalGuests)}
                note="Registered guest records"
                icon={<Users />}
              />

              <TopStatCard
                label="Active Events"
                value={loading ? "..." : String(activeEvents)}
                note="Ongoing or upcoming"
                icon={<CalendarDays />}
              />

              <TopStatCard
                label="Parking Used"
                value={loading ? "..." : `${activeParking}/${parkingTotal}`}
                note={`${parkingOccupancyRate}% utilization`}
                icon={<Car />}
              />
            </section>

            <section className="mb-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <section className="rounded-[24px] border border-[#e6dfd2] bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">Room Inventory</h3>

                    <p className="mt-1 text-sm text-[#57534e]">
                      Live occupancy and availability status
                    </p>
                  </div>

                  <BedDouble className="text-[#d8a900]" size={32} />
                </div>

                <div className="mt-7 grid gap-5 md:grid-cols-4">
                  <RoomStatCard
                    title="Total"
                    value={loading ? "..." : String(totalRooms)}
                    note="Rooms"
                  />

                  <RoomStatCard
                    title="Available"
                    value={loading ? "..." : String(availableRooms)}
                    note="Units"
                    highlight
                  />

                  <RoomStatCard
                    title="Occupied"
                    value={loading ? "..." : String(occupiedRooms)}
                    note={loading ? "" : `${occupancyRate}%`}
                  />

                  <RoomStatCard
                    title="Maintenance"
                    value={loading ? "..." : String(maintenanceRooms)}
                    note="Rooms"
                  />
                </div>

                <div className="mt-8">
                  <div className="mb-3 flex justify-between text-xs font-bold uppercase tracking-[0.18em] text-[#57534e]">
                    <span>Occupancy Utilization</span>
                    <span>
                      {Number(occupancyRate) > 85 ? "Near Capacity" : "Normal"}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-[#ebe7dd]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#806300] via-[#b89512] to-[#f3d766] transition-all duration-1000"
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-[24px] border border-[#e6dfd2] bg-white p-6 shadow-sm">
                <h3 className="text-2xl font-bold">Department Flow</h3>

                <div className="mt-7 space-y-5">
                  <FlowRow
                    icon={<Car size={22} />}
                    label="Parking"
                    note={
                      loading
                        ? "Loading..."
                        : `${activeParking}/${parkingTotal} slots occupied`
                    }
                    value={loading ? "..." : `${parkingOccupancyRate}%`}
                  />

                  <FlowRow
                    icon={<Utensils size={22} />}
                    label="Restaurant"
                    note="Pending and preparing orders"
                    value={loading ? "..." : String(pendingFoodOrders)}
                  />

                  <FlowRow
                    icon={<ChefHat size={22} />}
                    label="Room Service"
                    note="Pending room deliveries"
                    value={loading ? "..." : String(pendingRoomService)}
                  />

                  <FlowRow
                    icon={<CalendarDays size={22} />}
                    label="Events"
                    note="Currently active events"
                    value={loading ? "..." : String(activeEvents)}
                  />
                </div>
              </section>
            </section>

            <section className="mb-8 grid gap-6 xl:grid-cols-3">
              <QuickAction
                href="/reservations"
                title="Reservations"
                description="Create bookings, approve reservations and manage stay dates."
                icon={<ClipboardList />}
              />

              <QuickAction
                href="/guests"
                title="Guest Directory"
                description="View guest profiles, contacts, nationality and notes."
                icon={<Users />}
              />

              <QuickAction
                href="/reports"
                title="Reports"
                description="Review revenue, occupancy, inventory and audit summaries."
                icon={<TrendingUp />}
              />

              <QuickAction
                href="/restaurant"
                title="Restaurant"
                description="Manage table orders and restaurant service flow."
                icon={<Utensils />}
              />

              <QuickAction
                href="/events"
                title="Events"
                description="Control event bookings, halls, packages and payments."
                icon={<CalendarDays />}
              />

              <QuickAction
                href="/rooms"
                title="Rooms"
                description="Update room availability, status and room details."
                icon={<Hotel />}
              />
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
              <section className="flex flex-col justify-center rounded-[24px] border border-[#e6dfd2] bg-white p-8 text-center shadow-sm">
                <ShieldCheck className="mx-auto mb-4 text-[#735c00]" size={48} />

                <h3 className="text-xl font-bold text-[#57534e]">
                  No critical alerts at this time.
                </h3>

                <p className="mt-2 text-sm text-[#8a8175]">
                  All systems running smoothly.
                </p>
              </section>

              <section className="rounded-[24px] border border-[#e6dfd2] bg-white p-6 shadow-sm">
                <h3 className="text-2xl font-bold">Today’s Focus</h3>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <FocusCard
                    title="Guest Experience"
                    value={`${totalGuests}`}
                    note="Guest records available"
                  />

                  <FocusCard
                    title="Room Readiness"
                    value={`${availableRooms}`}
                    note="Rooms ready to sell"
                  />

                  <FocusCard
                    title="Service Queue"
                    value={`${pendingFoodOrders + pendingRoomService}`}
                    note="Food and room service tasks"
                  />
                </div>
              </section>
            </section>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function TopStatCard({
  label,
  value,
  note,
  icon,
}: {
  label: string;
  value: string;
  note: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group rounded-[24px] border border-[#e6dfd2] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#d8b328] text-[#4c3a00] transition group-hover:scale-110">
        {icon}
      </div>

      <p className="text-sm font-bold uppercase tracking-widest text-[#57534e]">
        {label}
      </p>

      <p className="mt-2 text-3xl font-extrabold text-[#735c00]">{value}</p>

      <p className="mt-2 text-sm text-[#8a8175]">{note}</p>
    </div>
  );
}

function RoomStatCard({
  title,
  value,
  note,
  highlight = false,
}: {
  title: string;
  value: string;
  note: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-6 ${
        highlight
          ? "border-[#e6cf77] bg-[#fff6d8]"
          : "border-[#e6dfd2] bg-[#f2f0ec]"
      }`}
    >
      <p className="text-sm text-[#3f3b35]">{title}</p>

      <div className="mt-3 flex items-end gap-2">
        <strong
          className={`text-4xl font-extrabold ${
            highlight ? "text-[#806300]" : ""
          }`}
        >
          {value}
        </strong>

        <span className="mb-1 text-sm text-[#57534e]">{note}</span>
      </div>
    </div>
  );
}

function FlowRow({
  icon,
  label,
  note,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  note: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[#f7f4ee] p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff6d8] font-bold text-[#806300]">
          {icon}
        </div>

        <div>
          <p className="font-bold uppercase">{label}</p>
          <p className="text-sm text-[#57534e]">{note}</p>
        </div>
      </div>

      <strong className="text-2xl text-[#735c00]">{value}</strong>
    </div>
  );
}

function QuickAction({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[24px] border border-[#e6dfd2] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#101827] text-[#d8b328] transition group-hover:scale-110">
        {icon}
      </div>

      <h3 className="text-xl font-extrabold text-[#735c00]">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-[#57534e]">{description}</p>

      <p className="mt-5 text-sm font-bold text-[#735c00]">Open Module →</p>
    </Link>
  );
}

function FocusCard({
  title,
  value,
  note,
}: {
  title: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e6dfd2] bg-[#f7f4ee] p-5">
      <p className="text-sm font-bold uppercase tracking-widest text-[#57534e]">
        {title}
      </p>

      <p className="mt-3 text-4xl font-extrabold text-[#735c00]">{value}</p>

      <p className="mt-2 text-sm text-[#8a8175]">{note}</p>
    </div>
  );
}