"use client";
import { useEffect, useState } from "react";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuthContext } from "@/context/AuthContext";
import api from "@/lib/api/axiosInstance";
import { getRooms } from "@/lib/api/roomApi";
import { getParkingBookings } from "@/lib/api/parkingApi";

export default function DashboardPage() {
  const { user } = useAuthContext();
  
  const [totalRooms, setTotalRooms] = useState<number | null>(null);
  const [occupiedRooms, setOccupiedRooms] = useState<number | null>(null);
  const [availableRooms, setAvailableRooms] = useState<number | null>(null);
  
  const [parkingOccupied, setParkingOccupied] = useState<number | null>(null);
  const [parkingTotal, setParkingTotal] = useState<number>(50); // Hardcoded total for now or we could fetch
  
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingParking, setLoadingParking] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const roomData = await getRooms();
        const total = roomData.length;
        const available = roomData.filter((r: any) => r.status === "AVAILABLE").length;
        setTotalRooms(total);
        setAvailableRooms(available);
        setOccupiedRooms(total - available);
      } catch (err) {
        console.error("Failed to load rooms", err);
        setTotalRooms(0);
        setAvailableRooms(0);
        setOccupiedRooms(0);
      } finally {
        setLoadingRooms(false);
      }

      try {
        const parkingData = await getParkingBookings();
        setParkingOccupied(parkingData.length);
      } catch (err) {
        console.error("Failed to load parking", err);
        setParkingOccupied(0);
      } finally {
        setLoadingParking(false);
      }
    };

    fetchDashboardData();
  }, []);

  const occupancyRate = totalRooms && totalRooms > 0 
    ? ((occupiedRooms! / totalRooms) * 100).toFixed(1)
    : "0.0";
    
  const parkingOccupancyRate = parkingOccupied !== null
    ? ((parkingOccupied / parkingTotal) * 100).toFixed(0)
    : "0";

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
                  placeholder="Search rooms, guests, or folios..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-5">
              <button className="rounded-full p-2 transition hover:bg-[#ece9e2]">
                ♧
              </button>
              <button className="rounded-full p-2 transition hover:bg-[#ece9e2]">
                ▦
              </button>
              <div className="hidden h-8 w-px bg-[#ddd5c8] md:block" />
              <button className="hidden rounded-xl px-4 py-2 text-sm font-medium text-[#6c5200] transition hover:bg-[#ece9e2] md:block">
                New Reservation
              </button>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-bold leading-none">{user?.name || "Loading..."}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {user?.role ? user.role.replace(/_/g, ' ') : "..."}
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-[#d8b328] bg-white text-lg font-extrabold uppercase text-[#735c00] shadow-sm">
                  {user?.name ? user.name.charAt(0) : "•"}
                </div>
              </div>
            </div>
          </header>

          <section className="px-6 py-10 lg:px-8">
            <div className="dashboard-fade mb-10 flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
              <div>
                <h2 className="text-4xl font-extrabold tracking-tight text-black">
                  Operations Overview
                </h2>
                <p className="mt-2 text-base text-[#57534e]">
                  Good Morning, {user?.name ? user.name.split(' ')[0] : '...'}. Here is the operational status for today.
                </p>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-1">
              <section className="dashboard-fade rounded-2xl border border-[#e6dfd2] bg-white p-6 shadow-sm delay-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">Room Inventory</h3>
                    <p className="mt-1 text-sm text-[#57534e]">
                      Live occupancy and availability status
                    </p>
                  </div>
                  <span className="text-2xl text-[#d8a900]">▰</span>
                </div>

                <div className="mt-7 grid gap-5 md:grid-cols-3">
                  <div className="rounded-xl border border-[#e6dfd2] bg-[#f2f0ec] p-6">
                    <p className="text-sm text-[#3f3b35]">Total Capacity</p>
                    <div className="mt-3 flex items-end gap-2">
                      <strong className="text-4xl font-extrabold">
                        {loadingRooms ? "..." : totalRooms}
                      </strong>
                      <span className="mb-1 text-sm text-[#57534e]">Rooms</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#e6cf77] bg-[#fff6d8] p-6">
                    <p className="text-sm text-[#3f3b35]">Available</p>
                    <div className="mt-3 flex items-end gap-2">
                      <strong className="text-4xl font-extrabold text-[#806300]">
                        {loadingRooms ? "..." : availableRooms}
                      </strong>
                      <span className="mb-1 text-sm text-[#57534e]">Units</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#e6dfd2] bg-[#f2f3f4] p-6">
                    <p className="text-sm text-[#3f3b35]">Occupied</p>
                    <div className="mt-3 flex items-end gap-2">
                      <strong className="text-4xl font-extrabold">
                        {loadingRooms ? "..." : occupiedRooms}
                      </strong>
                      <span className="mb-1 text-sm text-[#57534e]">{loadingRooms ? "" : `${occupancyRate}%`}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="mb-3 flex justify-between text-xs font-bold uppercase tracking-[0.18em] text-[#57534e]">
                    <span>Occupancy Utilization</span>
                    <span>{parseFloat(occupancyRate) > 85 ? "Near Capacity" : "Normal"}</span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-[#ebe7dd]">
                    <div 
                      className="dashboard-progress h-full rounded-full bg-gradient-to-r from-[#806300] via-[#b89512] to-[#f3d766] transition-all duration-1000" 
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              <section className="dashboard-fade rounded-2xl border border-[#e6dfd2] bg-white p-6 shadow-sm delay-300">
                <h3 className="text-2xl font-bold">Daily Flow</h3>

                <div className="mt-7 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl font-bold bg-[#fff6d8] text-[#806300]">
                        P
                      </div>
                      <div>
                        <p className="font-bold">PARKING</p>
                        <p className="text-sm text-[#57534e]">
                          {loadingParking ? "..." : `${parkingOccupied}/${parkingTotal} slots occupied`}
                        </p>
                      </div>
                    </div>
                    <strong className="text-2xl">{loadingParking ? "..." : `${parkingOccupancyRate}%`}</strong>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl font-bold bg-[#eef2ff] text-[#3d4b61]">
                        ▣
                      </div>
                      <div>
                        <p className="font-bold">Active Events</p>
                        <p className="text-sm text-[#57534e]">Currently ongoing</p>
                      </div>
                    </div>
                    <strong className="text-2xl">0</strong>
                  </div>
                </div>
              </section>
              
              <section className="dashboard-fade rounded-2xl border border-[#e6dfd2] bg-white p-6 shadow-sm delay-350 flex flex-col justify-center items-center text-center">
                <h3 className="text-xl font-bold text-[#57534e]">No critical alerts at this time.</h3>
                <p className="text-sm text-[#8a8175] mt-2">All systems running smoothly.</p>
              </section>
            </div>
            
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
