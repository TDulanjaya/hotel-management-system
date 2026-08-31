"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button, Badge } from "@/components/ui";
import { AuthUser, getUser } from "@/utils/auth";
import useSWR, { mutate as globalMutate } from "swr";
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
  ArrowUpRight,
  Crown,
  Activity,
  Wifi,
} from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [currentRole, setCurrentRole] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const { data: rawRooms, mutate: mutateRooms, isLoading: roomsLoading } = useSWR<any[]>("/api/rooms?size=1000");
  const { data: rawParking, mutate: mutateParking, isLoading: parkingLoading } = useSWR<any[]>("/api/parking");
  const { data: rawEvents, mutate: mutateEvents, isLoading: eventsLoading } = useSWR<any[]>("/api/events");
  const { data: rawGuests, mutate: mutateGuests, isLoading: guestsLoading } = useSWR<any[]>("/api/guests?size=1000");
  const { data: rawPayments, mutate: mutatePayments, isLoading: paymentsLoading } = useSWR<any[]>("/api/payments");
  const { data: rawRestaurant, mutate: mutateRestaurant, isLoading: restLoading } = useSWR<any[]>("/api/restaurant/orders");
  const { data: rawRoomService, mutate: mutateRoomService, isLoading: rsLoading } = useSWR<any[]>("/api/room-service");

  const rooms = useMemo(() => (Array.isArray(rawRooms) ? rawRooms : []), [rawRooms]);
  const parkingBookings = useMemo(() => (Array.isArray(rawParking) ? rawParking : []), [rawParking]);
  const events = useMemo(() => (Array.isArray(rawEvents) ? rawEvents : []), [rawEvents]);
  const guests = useMemo(() => (Array.isArray(rawGuests) ? rawGuests : []), [rawGuests]);
  const payments = useMemo(() => (Array.isArray(rawPayments) ? rawPayments : []), [rawPayments]);
  const restaurantOrders = useMemo(() => (Array.isArray(rawRestaurant) ? rawRestaurant : []), [rawRestaurant]);
  const roomServiceOrders = useMemo(() => (Array.isArray(rawRoomService) ? rawRoomService : []), [rawRoomService]);

  const loading = !rawRooms && !rawParking && (roomsLoading || parkingLoading || eventsLoading);
  const error = "";

  const loadDashboardData = async () => {
    setRefreshing(true);
    await Promise.all([
      mutateRooms(),
      mutateParking(),
      mutateEvents(),
      mutateGuests(),
      mutatePayments(),
      mutateRestaurant(),
      mutateRoomService(),
    ]);
    setTimeout(() => setRefreshing(false), 500);
  };

  useEffect(() => {
    const currentUser = getUser();
    if (currentUser) {
      setUser(currentUser);
      setCurrentRole(currentUser.role);
      return;
    }

    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setCurrentRole(parsedUser.role || "");
      }
    } catch {
      setCurrentRole("");
    }
  }, []);

  const totalRooms = rooms.length;

  const availableRooms = useMemo(
    () => rooms.filter((room) => room.status === "AVAILABLE" || room.status === "Available").length,
    [rooms]
  );

  const occupiedRooms = useMemo(
    () => rooms.filter((room) => room.status === "OCCUPIED" || room.status === "Occupied").length,
    [rooms]
  );

  const maintenanceRooms = useMemo(
    () => rooms.filter((room) => room.status === "MAINTENANCE" || room.status === "Maintenance").length,
    [rooms]
  );

  const occupancyRate = useMemo(
    () => (totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0),
    [totalRooms, occupiedRooms]
  );

  const activeEvents = useMemo(
    () => events.filter((event) => event.status !== "CANCELLED" && event.status !== "Completed").length,
    [events]
  );

  const activeParking = useMemo(
    () => parkingBookings.filter((parking) => parking.status === "PARKED" || parking.status === "ACTIVE").length,
    [parkingBookings]
  );

  const pendingKitchenOrders = useMemo(
    () => restaurantOrders.filter((order) => order.status === "QUEUED" || order.status === "PREPARING").length,
    [restaurantOrders]
  );

  const pendingRoomServiceOrders = useMemo(
    () => roomServiceOrders.filter((order) => order.status === "PENDING" || order.status === "PREPARING").length,
    [roomServiceOrders]
  );

  const totalRevenue = useMemo(
    () => payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
    [payments]
  );



  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "RECEPTIONIST"]}>
      <div className="min-h-screen overflow-hidden bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="relative px-8 py-10 lg:ml-[280px]">
          <motion.div
            className="pointer-events-none absolute right-[-140px] top-[-160px] h-96 w-96 rounded-full bg-[#d4af37]/25 blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.45, 0.7, 0.45] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="pointer-events-none absolute bottom-[-180px] left-[15%] h-96 w-96 rounded-full bg-[#111827]/10 blur-3xl"
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.55, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.header
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative mb-8 overflow-hidden rounded-[2rem] border border-[#d0c5af] bg-gradient-to-br from-[#111827] via-[#172033] to-[#2c2100] p-8 text-white shadow-2xl"
          >
            <div className="absolute right-8 top-6 opacity-15">
              <Hotel size={150} />
            </div>

            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#d4af37] via-white/60 to-[#735c00]" />

            <div className="relative flex flex-col justify-between gap-8 xl:flex-row xl:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.3em] text-[#f8d75c]">
                  <Sparkles size={14} />
                  Operations Suite
                </div>

                <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
                  Hotel Control Center
                </h1>

                <p className="mt-3 max-w-2xl text-sm text-[#f5e9c9] md:text-base">
                  Real-time operational metrics across rooms, guests, dining,
                  payments and amenities.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <HeroPill icon={<Activity size={15} />} label="Live Metrics" />
                  <HeroPill icon={<ShieldCheck size={15} />} label="Secure Access" />
                  <HeroPill icon={<Wifi size={15} />} label="Online Services" />
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/reservations/new"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#d4af37] px-5 py-3 text-sm font-black text-[#241a00] shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:bg-white"
                >
                  New Reservation
                  <ArrowUpRight size={16} />
                </Link>

                <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
                  <div className="text-right">
                    <p className="text-sm font-black leading-none">
                      {user?.name || "Manager"}
                    </p>

                    <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-[#f8d75c]">
                      {currentRole || user?.role || "MANAGER"}
                    </p>
                  </div>

                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#d4af37] bg-white text-lg font-black uppercase text-[#735c00] shadow-lg"
                  >
                    {user?.name ? user.name.charAt(0) : "M"}
                  </motion.div>
                </div>

                <button
                  onClick={loadDashboardData}
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white hover:text-[#241a00]"
                >
                  <RefreshCw
                    size={16}
                    className={refreshing ? "animate-spin" : "transition group-hover:rotate-180"}
                  />
                  Refresh
                </button>
              </div>
            </div>
          </motion.header>

          <motion.section
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
            }}
            className="relative mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
          >
            <StatCard
              title="Total Rooms"
              value={totalRooms.toString()}
              note={`${availableRooms} available • ${occupiedRooms} occupied`}
              icon={<BedDouble />}
              accent="from-[#d4af37] to-[#735c00]"
            />

            <StatCard
              title="Occupancy Rate"
              value={`${occupancyRate}%`}
              note={`${occupiedRooms} of ${totalRooms} rooms occupied`}
              icon={<TrendingUp />}
              accent="from-green-400 to-emerald-500"
            />

            <StatCard
              title="Active Guests"
              value={guests.length.toString()}
              note="Currently checked-in"
              icon={<Users />}
              accent="from-blue-400 to-cyan-500"
            />

            <StatCard
              title="Total Payments"
              value={`Rs ${totalRevenue.toLocaleString()}`}
              note={`${payments.length} transactions`}
              icon={<Wallet />}
              accent="from-purple-400 to-indigo-500"
            />
          </motion.section>

          <motion.section
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
            }}
            className="relative mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
          >
            <StatCard
              title="Active Events"
              value={activeEvents.toString()}
              note="Scheduled & ongoing"
              icon={<CalendarDays />}
              accent="from-orange-400 to-yellow-500"
            />

            <StatCard
              title="Active Parking"
              value={activeParking.toString()}
              note="Vehicles parked"
              icon={<Car />}
              accent="from-slate-500 to-slate-700"
            />

            <StatCard
              title="Kitchen Queue"
              value={pendingKitchenOrders.toString()}
              note="Orders being prepared"
              icon={<ChefHat />}
              accent="from-red-400 to-orange-500"
            />

            <StatCard
              title="Room Service Queue"
              value={pendingRoomServiceOrders.toString()}
              note="Pending deliveries"
              icon={<Utensils />}
              accent="from-teal-400 to-emerald-500"
            />
          </motion.section>

          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative flex h-72 flex-col items-center justify-center rounded-[2rem] border border-[#d0c5af] bg-white/85 shadow-xl backdrop-blur"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#d4af37] text-[#4b3a00]"
              >
                <RefreshCw size={30} />
              </motion.div>

              <p className="text-lg font-black text-[#806300]">
                Loading control center metrics...
              </p>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-[2rem] border border-red-200 bg-red-50 p-6 font-bold text-red-700 shadow-lg"
            >
              {error}
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.12 } },
              }}
              className="relative"
            >
              <motion.section
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  show: { opacity: 1, y: 0 },
                }}
                className="overflow-hidden rounded-[2rem] border border-[#d0c5af] bg-white/90 p-6 shadow-xl shadow-[#4d3a0010] backdrop-blur"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black">
                      Quick Management Links
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-[#4d4635]">
                      Fast navigation to operational modules.
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d4af37]/20 text-[#735c00]">
                    <Crown size={24} />
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              </motion.section>
            </motion.div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

function HeroPill({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur">
      {icon}
      {label}
    </div>
  );
}

function StatCard({
  title,
  value,
  note,
  icon,
  accent,
}: {
  title: string;
  value: string;
  note: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="group relative overflow-hidden rounded-[1.75rem] border border-[#d0c5af] bg-white p-6 shadow-lg shadow-[#4d3a0010]"
    >
      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${accent}`} />

      <div className="absolute right-5 top-5 text-[#735c00]/10 transition group-hover:scale-110">
        <Sparkles size={64} />
      </div>

      <div
        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg`}
      >
        {icon}
      </div>

      <p className="text-sm font-black uppercase tracking-widest text-[#4d4635]">
        {title}
      </p>

      <h2 className="mt-3 text-4xl font-black text-[#735c00]">{value}</h2>

      <p className="mt-2 text-sm font-semibold text-[#4d4635]">{note}</p>
    </motion.article>
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
    <motion.div whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Link
        href={href}
        className="group flex items-start gap-4 rounded-2xl border border-[#d0c5af] bg-[#fbf9f5] p-4 transition hover:bg-[#f5eed9] hover:shadow-md"
      >
        <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#735c00] text-white shadow-md transition group-hover:bg-[#d4af37] group-hover:text-[#241a00]">
          {icon}
        </div>

        <div className="flex-1">
          <p className="font-black text-[#1b1c1a]">{title}</p>
          <p className="mt-0.5 text-xs font-semibold text-[#4d4635]">{desc}</p>
        </div>

        <ArrowUpRight
          size={16}
          className="mt-1 text-[#735c00] opacity-0 transition group-hover:opacity-100"
        />
      </Link>
    </motion.div>
  );
}