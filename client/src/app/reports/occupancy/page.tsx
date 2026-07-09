"use client";

import { useEffect, useState, useMemo } from "react";
import { ReportSummaryCards } from "@/components/reports/ReportSummaryCards";
import { ReportPageLayout } from "@/components/reports/ReportPageLayout";
import { getRooms } from "@/lib/api/roomApi";

function getRateClass(rate: string) {
  const numberRate = Number(rate.replace("%", ""));

  if (numberRate >= 80) {
    return "bg-green-100 text-green-700";
  }

  if (numberRate >= 50) {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-red-100 text-red-700";
}

export default function OccupancyReportPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const roomData = await getRooms();
        setRooms(roomData || []);
      } catch (err) {
        console.error("Failed to load occupancy data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === "OCCUPIED").length;
  const availableRooms = rooms.filter(r => r.status === "AVAILABLE").length;
  const cleaningRooms = rooms.filter(r => r.status === "CLEANING").length;
  const maintenanceRooms = rooms.filter(r => r.status === "MAINTENANCE").length;
  
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) + "%" : "0%";

  const occupancySummary = [
    {
      label: "Total Rooms",
      value: totalRooms.toString(),
      note: "All active rooms",
    },
    {
      label: "Occupied Rooms",
      value: occupiedRooms.toString(),
      note: "Currently checked-in",
    },
    {
      label: "Available Rooms",
      value: availableRooms.toString(),
      note: "Ready for booking",
    },
    {
      label: "Occupancy Rate",
      value: occupancyRate,
      note: "Today room usage",
    },
  ];

  const occupancyTrend = [
    { day: "Mon", value: "68%", height: "68%" },
    { day: "Tue", value: "72%", height: "72%" },
    { day: "Wed", value: "80%", height: "80%" },
    { day: "Thu", value: "76%", height: "76%" },
    { day: "Fri", value: "89%", height: "89%" },
    { day: "Sat", value: "94%", height: "94%" },
    { day: "Sun", value: occupancyRate, height: occupancyRate },
  ];

  // Group by floor (derive floor from first digit of 3-digit room number)
  const roomStatusRows = useMemo(() => {
    const floors: Record<string, any> = {};
    
    rooms.forEach(room => {
      const roomStr = room.roomNumber.toString();
      const floorNum = roomStr.length > 2 ? roomStr.substring(0, roomStr.length - 2) : "1";
      const floorName = `Floor ${floorNum}`;
      
      if (!floors[floorName]) {
        floors[floorName] = { floor: floorName, total: 0, occupied: 0, available: 0, cleaning: 0, maintenance: 0 };
      }
      
      floors[floorName].total += 1;
      if (room.status === "OCCUPIED") floors[floorName].occupied += 1;
      else if (room.status === "AVAILABLE") floors[floorName].available += 1;
      else if (room.status === "CLEANING") floors[floorName].cleaning += 1;
      else if (room.status === "MAINTENANCE") floors[floorName].maintenance += 1;
    });
    
    return Object.values(floors).map(f => {
      const rate = f.total > 0 ? Math.round((f.occupied / f.total) * 100) + "%" : "0%";
      return { ...f, rate };
    }).sort((a, b) => a.floor.localeCompare(b.floor));
  }, [rooms]);

  // Group by room type
  const roomTypeRows = useMemo(() => {
    const types: Record<string, any> = {};
    
    rooms.forEach(room => {
      const type = room.type || "Standard Room";
      
      if (!types[type]) {
        types[type] = { type, total: 0, occupied: 0, available: 0 };
      }
      
      types[type].total += 1;
      if (room.status === "OCCUPIED") types[type].occupied += 1;
      else if (room.status === "AVAILABLE") types[type].available += 1;
    });
    
    return Object.values(types).map(t => {
      const rate = t.total > 0 ? Math.round((t.occupied / t.total) * 100) + "%" : "0%";
      return { ...t, rate };
    });
  }, [rooms]);

  return (
    <ReportPageLayout title="Occupancy Report">

          <ReportSummaryCards cards={occupancySummary} />

          <section className="mb-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Weekly Occupancy Trend</h2>

                  <p className="mt-1 text-sm text-[#4d4635]">
                    Room occupancy percentage for this week.
                  </p>
                </div>

                <span className="rounded-full bg-[#d4af37]/20 px-4 py-2 text-sm font-bold text-[#735c00]">
                  This Week
                </span>
              </div>

              <div className="flex h-[280px] items-end gap-4">
                {occupancyTrend.map((item) => (
                  <div
                    key={item.day}
                    className="flex flex-1 flex-col items-center gap-3"
                  >
                    <div className="flex h-[210px] w-full items-end rounded-full bg-[#f5f3ef] px-2">
                      <div
                        className="w-full rounded-full bg-[#735c00]"
                        style={{ height: item.height }}
                      />
                    </div>

                    <p className="text-xs font-bold text-[#4d4635]">
                      {item.day}
                    </p>

                    <p className="text-xs text-[#4d4635]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Room Status Breakdown</h2>

              <div className="mt-6 space-y-4">
                <BreakdownRow 
                  label="Occupied" 
                  value={`${occupiedRooms} Rooms`} 
                  percent={totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) + "%" : "0%"} 
                />
                <BreakdownRow 
                  label="Available" 
                  value={`${availableRooms} Rooms`} 
                  percent={totalRooms > 0 ? Math.round((availableRooms / totalRooms) * 100) + "%" : "0%"} 
                />
                <BreakdownRow 
                  label="Cleaning" 
                  value={`${cleaningRooms} Rooms`} 
                  percent={totalRooms > 0 ? Math.round((cleaningRooms / totalRooms) * 100) + "%" : "0%"} 
                />
                <BreakdownRow
                  label="Maintenance"
                  value={`${maintenanceRooms} Rooms`}
                  percent={totalRooms > 0 ? Math.round((maintenanceRooms / totalRooms) * 100) + "%" : "0%"}
                />
              </div>
            </div>
          </section>

          <section className="mb-8 rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-4">
              <input
                type="date"
                className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              />

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>All Floors</option>
                <option>Floor 1</option>
                <option>Floor 2</option>
                <option>Floor 3</option>
                <option>Floor 4</option>
                <option>Floor 5</option>
              </select>

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>All Room Types</option>
                <option>Presidential Suite</option>
                <option>Executive Suite</option>
                <option>Deluxe Room</option>
                <option>Standard Room</option>
              </select>

              <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                Filter
              </button>
            </div>
          </section>

          <section className="mb-8 overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Occupancy by Floor</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Floor-wise room status and occupancy percentage.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Floor</th>
                    <th className="px-6 py-4 text-right">Total Rooms</th>
                    <th className="px-6 py-4 text-right">Occupied</th>
                    <th className="px-6 py-4 text-right">Available</th>
                    <th className="px-6 py-4 text-right">Cleaning</th>
                    <th className="px-6 py-4 text-right">Maintenance</th>
                    <th className="px-6 py-4 text-right">Rate</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {roomStatusRows.length === 0 && !loading && (
                    <tr><td colSpan={7} className="p-6 text-center text-[#4d4635]">No rooms found.</td></tr>
                  )}
                  {roomStatusRows.map((row) => (
                    <tr key={row.floor} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{row.floor}</td>

                      <td className="px-6 py-5 text-right">{row.total}</td>

                      <td className="px-6 py-5 text-right font-bold text-green-700">
                        {row.occupied}
                      </td>

                      <td className="px-6 py-5 text-right text-[#4d4635]">
                        {row.available}
                      </td>

                      <td className="px-6 py-5 text-right text-yellow-700">
                        {row.cleaning}
                      </td>

                      <td className="px-6 py-5 text-right text-red-700">
                        {row.maintenance}
                      </td>

                      <td className="px-6 py-5 text-right">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getRateClass(
                            row.rate
                          )}`}
                        >
                          {row.rate}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Occupancy by Room Type</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Room type-wise occupancy and availability.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Room Type</th>
                    <th className="px-6 py-4 text-right">Total</th>
                    <th className="px-6 py-4 text-right">Occupied</th>
                    <th className="px-6 py-4 text-right">Available</th>
                    <th className="px-6 py-4 text-right">Rate</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {roomTypeRows.length === 0 && !loading && (
                    <tr><td colSpan={5} className="p-6 text-center text-[#4d4635]">No rooms found.</td></tr>
                  )}
                  {roomTypeRows.map((row) => (
                    <tr key={row.type} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{row.type}</td>

                      <td className="px-6 py-5 text-right">{row.total}</td>

                      <td className="px-6 py-5 text-right font-bold text-green-700">
                        {row.occupied}
                      </td>

                      <td className="px-6 py-5 text-right text-[#4d4635]">
                        {row.available}
                      </td>

                      <td className="px-6 py-5 text-right">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getRateClass(
                            row.rate
                          )}`}
                        >
                          {row.rate}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </ReportPageLayout>
  );
}



function BreakdownRow({
  label,
  value,
  percent,
}: {
  label: string;
  value: string;
  percent: string;
}) {
  return (
    <div className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
      <div className="flex items-center justify-between">
        <p className="font-bold">{label}</p>
        <p className="font-bold text-[#735c00]">{value}</p>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full bg-[#735c00]"
          style={{ width: percent }}
        />
      </div>

      <p className="mt-2 text-sm text-[#4d4635]">{percent}</p>
    </div>
  );
}
