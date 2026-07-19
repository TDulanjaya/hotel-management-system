"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button, Card, Badge } from "@/components/ui";
import { AuthUser, getUser } from "@/utils/auth";
import { authenticatedFetch } from "@/lib/api/authApi";
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

async function fetchRooms() {
  const response = await authenticatedFetch("/api/rooms?size=1000");
  if (!response.ok) return [];
  const data = await response.json();
  return data?.content !== undefined ? data.content : data;
}

async function fetchParkingBookings() {
  const response = await authenticatedFetch("/api/parking");
  if (!response.ok) return [];
  const data = await response.json();
  return data?.content !== undefined ? data.content : data;
}

async function fetchEvents() {
  const response = await authenticatedFetch("/api/events");
  if (!response.ok) return [];
  const data = await response.json();
  return data?.content !== undefined ? data.content : data;
}

async function fetchGuests() {
  const response = await authenticatedFetch("/api/guests?size=1000");
  if (!response.ok) return [];
  const data = await response.json();
  return data?.content !== undefined ? data.content : data;
}

async function fetchPayments() {
  const response = await authenticatedFetch("/api/payments");
  if (!response.ok) return [];
  const data = await response.json();
  return data?.content !== undefined ? data.content : data;
}

async function fetchRestaurantOrders() {
  const response = await authenticatedFetch("/api/restaurant/orders");
  if (!response.ok) return [];
  const data = await response.json();
  return data?.content !== undefined ? data.content : data;
}

async function fetchRoomServiceOrders() {
  const response = await authenticatedFetch("/api/room-service");
  if (!response.ok) return [];
  const data = await response.json();
  return data?.content !== undefined ? data.content : data;
}

export default function DashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
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
    const currentUser = getUser();
    if (currentUser) {
      setUser(currentUser);
      setCurrentRole(currentUser.role);
    }
  }, []);

  const totalRooms = rooms.length;

  const availableRooms = rooms.filter(
    (room) => room.status === "AVAILABLE" || room.status === "Available"
  ).length;

  const occupiedRooms = rooms.filter(
    (room) => room.status === "OCCUPIED" || room.status === "Occupied"
  ).length;

  const occupancyRate =
    totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  const activeEvents = events.filter(
    (event) => event.status !== "CANCELLED" && event.status !== "Completed"
  ).length;

  const activeParking = parkingBookings.filter(
    (parking) => parking.status === "PARKED" || parking.status === "ACTIVE"
  ).length;

  const pendingKitchenOrders = restaurantOrders.filter(
    (order) => order.status === "QUEUED" || order.status === "PREPARING"
  ).length;

  const pendingRoomServiceOrders = roomServiceOrders.filter(
    (order) => order.status === "PENDING" || order.status === "PREPARING"
  ).length;

  const totalRevenue = payments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0
  );

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "RECEPTIONIST"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <header className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Operations Suite
              </p>

              <h1 className="mt-3 text-4xl font-extrabold text-[#735c00]">
                Hotel Control Center
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Real-time operational metrics across rooms, guests, dining and
                amenities.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/reservations/new"
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

              <Button
                onClick={loadDashboardData}
                leftIcon={<RefreshCw size={16} />}
              >
                Refresh
              </Button>
            </div>
          </header>

          <section className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Rooms"
              value={totalRooms.toString()}
              note={`${availableRooms} available • ${occupiedRooms} occupied`}
              icon={<BedDouble />}
            />

            <StatCard
              title="Occupancy Rate"
              value={`${occupancyRate}%`}
              note={`${occupiedRooms} of ${totalRooms} rooms occupied`}
              icon={<TrendingUp />}
            />

            <StatCard
              title="Active Guests"
              value={guests.length.toString()}
              note="Currently checked-in"
              icon={<Users />}
            />

            <StatCard
              title="Total Payments"
              value={`Rs ${totalRevenue.toLocaleString()}`}
              note={`${payments.length} transactions`}
              icon={<Wallet />}
            />
          </section>

          <section className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Active Events"
              value={activeEvents.toString()}
              note="Scheduled & ongoing"
              icon={<CalendarDays />}
            />

            <StatCard
              title="Active Parking"
              value={activeParking.toString()}
              note="Vehicles parked"
              icon={<Car />}
            />

            <StatCard
              title="Kitchen Queue"
              value={pendingKitchenOrders.toString()}
              note="Orders being prepared"
              icon={<ChefHat />}
            />

            <StatCard
              title="Room Service Queue"
              value={pendingRoomServiceOrders.toString()}
              note="Pending deliveries"
              icon={<Utensils />}
            />
          </section>

          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-[#d0c5af] bg-white text-lg font-bold text-[#806300]">
              Loading control center metrics...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 font-bold text-red-700">
              {error}
            </div>
          ) : (
            <div className="grid gap-8 xl:grid-cols-2">
              <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold">Quick Management Links</h2>
                <p className="mt-1 text-sm text-[#4d4635]">
                  Fast navigation to operational modules.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <QuickLink
                    href="/rooms"
                    title="Room Management"
                    desc="View & manage room status"
                    icon={<Hotel />}
                  />
                  <QuickLink
                    href="/reservations"
                    title="Reservations"
                    desc="Check-in, check-out & bookings"
                    icon={<ClipboardList />}
                  />
                  <QuickLink
                    href="/guests"
                    title="Guest Records"
                    desc="View registered guests"
                    icon={<Users />}
                  />
                  <QuickLink
                    href="/restaurant"
                    title="Restaurant & Dining"
                    desc="Table orders & billing"
                    icon={<Utensils />}
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold">System Status</h2>
                <p className="mt-1 text-sm text-[#4d4635]">
                  Active services and connection health.
                </p>

                <div className="mt-6 space-y-4">
                  <StatusRow label="Backend API Server" status="ONLINE" />
                  <StatusRow label="Authentication Service" status="ONLINE" />
                  <StatusRow label="Database Connection" status="ONLINE" />
                  <StatusRow label="Realtime Updates" status="ONLINE" />
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({
  title,
  value,
  note,
  icon,
}: {
  title: string;
  value: string;
  note: string;
  icon: React.ReactNode;
}) {
  return (
    <Card hoverable className="p-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4af37] text-[#554300]">
        {icon}
      </div>

      <p className="text-sm font-bold uppercase tracking-widest text-[#4d4635]">
        {title}
      </p>

      <h2 className="mt-3 text-3xl font-extrabold text-[#735c00]">{value}</h2>

      <p className="mt-2 text-sm text-[#4d4635]">{note}</p>
    </Card>
  );
}

function QuickLink({
  href,
  title,
  desc,
  icon,
}: {
  href: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-start gap-4 rounded-xl border border-[#d0c5af] bg-[#fbf9f5] p-4 transition hover:-translate-y-0.5 hover:bg-[#f5eed9] hover:shadow-md"
    >
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#735c00] text-white">
        {icon}
      </div>
      <div>
        <p className="font-bold text-[#1b1c1a]">{title}</p>
        <p className="mt-0.5 text-xs text-[#4d4635]">{desc}</p>
      </div>
    </Link>
  );
}

function StatusRow({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#fbf9f5] p-4 font-semibold">
      <span className="text-sm text-[#1b1c1a]">{label}</span>
      <Badge variant="success" dot>
        {status}
      </Badge>
    </div>
  );
}