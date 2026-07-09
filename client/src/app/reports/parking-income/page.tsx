"use client";

import { useEffect, useState, useMemo } from "react";
import { ReportSummaryCards } from "@/components/reports/ReportSummaryCards";
import { ReportPageLayout } from "@/components/reports/ReportPageLayout";
import { getParkingBookings } from "@/lib/api/parkingApi";

function getStatusClass(status: string) {
  if (status === "COMPLETED" || status === "PAID") {
    return "bg-green-100 text-green-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

function getRateClass(rate: string) {
  const rateNumber = Number(rate.replace("%", ""));

  if (rateNumber >= 60) {
    return "bg-green-100 text-green-700";
  }

  if (rateNumber >= 35) {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-red-100 text-red-700";
}

export default function ParkingIncomeReportPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getParkingBookings();
        setBookings(data || []);
      } catch (err) {
        console.error("Failed to load parking bookings", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalIncome = bookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0);
  const occupiedSlots = bookings.filter(b => b.status === "ACTIVE" || b.status === "PARKED").length;
  // Assume a fixed 50 slots for the hotel parking space if not tracked dynamically
  const totalSlots = 50;
  const availableSlots = Math.max(0, totalSlots - occupiedSlots);
  const additionalServices = bookings.reduce((acc, b) => {
    return acc + (b.services ? b.services.reduce((sAcc: number, s: any) => sAcc + (s.price || 0), 0) : 0);
  }, 0);

  const parkingSummary = [
    {
      label: "Total Parking Income",
      value: `Rs ${totalIncome.toLocaleString()}`,
      note: "Today parking collection",
    },
    {
      label: "Occupied Slots",
      value: occupiedSlots.toString(),
      note: "Currently used parking slots",
    },
    {
      label: "Available Slots",
      value: availableSlots.toString(),
      note: "Ready for new vehicles",
    },
    {
      label: "Vehicle Services",
      value: `Rs ${additionalServices.toLocaleString()}`,
      note: "Wash and valet income",
    },
  ];

  const parkingRows = bookings.map(b => ({
    id: `PK-${b.id?.substring(0, 6)}`,
    vehicle: `${b.vehicleMake || ""} ${b.vehicleModel || ""}`.trim() || "Unknown Vehicle",
    plate: b.licensePlate || "N/A",
    guest: b.guestName || "Walk-in Guest",
    slot: b.slotNumber || "Unassigned",
    service: b.services && b.services.length > 0 ? b.services.map((s: any) => s.name).join(", ") : "Parking Only",
    checkIn: b.checkInTime ? new Date(b.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-",
    checkOut: b.checkOutTime ? new Date(b.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-",
    amount: `Rs ${(b.totalAmount || 0).toLocaleString()}`,
    status: b.status || "ACTIVE",
  }));

  const serviceBreakdown = useMemo(() => {
    let parkingOnly = 0;
    let servicesTotal = 0;
    
    bookings.forEach(b => {
      let svcAmount = 0;
      if (b.services && b.services.length > 0) {
        svcAmount = b.services.reduce((acc: number, s: any) => acc + (s.price || 0), 0);
      }
      servicesTotal += svcAmount;
      parkingOnly += ((b.totalAmount || 0) - svcAmount);
    });

    return [
      { label: "Parking Fees", value: `Rs ${parkingOnly.toLocaleString()}`, percent: totalIncome > 0 ? Math.round((parkingOnly / totalIncome) * 100) + "%" : "0%" },
      { label: "Add-on Services", value: `Rs ${servicesTotal.toLocaleString()}`, percent: totalIncome > 0 ? Math.round((servicesTotal / totalIncome) * 100) + "%" : "0%" },
    ];
  }, [bookings, totalIncome]);

  const hourlyIncome = [
    { time: "08 AM", value: "Rs 90", height: "45%" },
    { time: "10 AM", value: "Rs 140", height: "70%" },
    { time: "12 PM", value: "Rs 160", height: "80%" },
    { time: "02 PM", value: "Rs 200", height: "100%" },
    { time: "04 PM", value: "Rs 120", height: "60%" },
    { time: "06 PM", value: "Rs 70", height: "35%" },
  ];

  // Mock slot usage as zones are not strictly defined in model
  const slotUsage = [
    {
      zone: "Zone A",
      total: 20,
      occupied: Math.min(20, occupiedSlots),
      available: Math.max(0, 20 - occupiedSlots),
      income: `Rs ${Math.round(totalIncome * 0.5).toLocaleString()}`,
      rate: `${Math.min(100, Math.round((occupiedSlots / 20) * 100))}%`,
    },
    {
      zone: "Zone B",
      total: 30,
      occupied: Math.max(0, occupiedSlots - 20),
      available: Math.max(0, 30 - Math.max(0, occupiedSlots - 20)),
      income: `Rs ${Math.round(totalIncome * 0.5).toLocaleString()}`,
      rate: `${Math.min(100, Math.round((Math.max(0, occupiedSlots - 20) / 30) * 100))}%`,
    }
  ];

  return (
    <ReportPageLayout title="Parking Income Report">

          <ReportSummaryCards cards={parkingSummary} />

          <section className="mb-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Hourly Parking Income</h2>

                  <p className="mt-1 text-sm text-[#4d4635]">
                    Parking collection throughout the day.
                  </p>
                </div>

                <span className="rounded-full bg-[#d4af37]/20 px-4 py-2 text-sm font-bold text-[#735c00]">
                  Today
                </span>
              </div>

              <div className="flex h-[280px] items-end gap-4">
                {hourlyIncome.map((item) => (
                  <div
                    key={item.time}
                    className="flex flex-1 flex-col items-center gap-3"
                  >
                    <div className="flex h-[210px] w-full items-end rounded-full bg-[#f5f3ef] px-2">
                      <div
                        className="w-full rounded-full bg-[#735c00]"
                        style={{ height: item.height }}
                      />
                    </div>

                    <p className="text-xs font-bold text-[#4d4635]">
                      {item.time}
                    </p>

                    <p className="text-xs text-[#4d4635]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Service Breakdown</h2>

              <div className="mt-6 space-y-4">
                {serviceBreakdown.map((item) => (
                  <BreakdownRow
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    percent={item.percent}
                  />
                ))}
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
                <option>All Services</option>
                <option>Parking Only</option>
                <option>Parking + Wash</option>
                <option>Valet Service</option>
                <option>Event Parking</option>
              </select>

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>All Status</option>
                <option>Paid</option>
                <option>Pending</option>
              </select>

              <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                Filter
              </button>
            </div>
          </section>

          <section className="mb-8 overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Parking Income Transactions</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Parking slot income, vehicle services, and payment status.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Parking ID</th>
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Plate No</th>
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Slot</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Check In</th>
                    <th className="px-6 py-4">Check Out</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {parkingRows.length === 0 && !loading && (
                    <tr><td colSpan={10} className="p-6 text-center text-[#4d4635]">No parking records.</td></tr>
                  )}
                  {parkingRows.map((parking) => (
                    <tr
                      key={parking.id}
                      className="transition hover:bg-[#fbf9f5]"
                    >
                      <td className="px-6 py-5 font-bold">{parking.id}</td>

                      <td className="px-6 py-5 font-semibold">
                        {parking.vehicle}
                      </td>

                      <td className="px-6 py-5">{parking.plate}</td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {parking.guest}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#735c00]">
                          {parking.slot}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {parking.service}
                      </td>

                      <td className="px-6 py-5">{parking.checkIn}</td>

                      <td className="px-6 py-5">{parking.checkOut}</td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            parking.status
                          )}`}
                        >
                          {parking.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right font-bold text-[#735c00]">
                        {parking.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Parking Slot Usage</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Zone-wise parking usage and income.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Zone</th>
                    <th className="px-6 py-4 text-right">Total Slots</th>
                    <th className="px-6 py-4 text-right">Occupied</th>
                    <th className="px-6 py-4 text-right">Available</th>
                    <th className="px-6 py-4 text-right">Usage Rate</th>
                    <th className="px-6 py-4 text-right">Income</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {slotUsage.map((zone) => (
                    <tr key={zone.zone} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{zone.zone}</td>

                      <td className="px-6 py-5 text-right">{zone.total}</td>

                      <td className="px-6 py-5 text-right font-bold text-green-700">
                        {zone.occupied}
                      </td>

                      <td className="px-6 py-5 text-right text-[#4d4635]">
                        {zone.available}
                      </td>

                      <td className="px-6 py-5 text-right">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getRateClass(
                            zone.rate
                          )}`}
                        >
                          {zone.rate}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right font-bold text-[#735c00]">
                        {zone.income}
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
