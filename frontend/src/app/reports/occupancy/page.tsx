import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const occupancySummary = [
  {
    label: "Total Rooms",
    value: "42",
    note: "All active rooms",
  },
  {
    label: "Occupied Rooms",
    value: "22",
    note: "Currently checked-in",
  },
  {
    label: "Available Rooms",
    value: "14",
    note: "Ready for booking",
  },
  {
    label: "Occupancy Rate",
    value: "78%",
    note: "Today room usage",
  },
];

const roomStatusRows = [
  {
    floor: "Floor 1",
    total: 10,
    occupied: 7,
    available: 2,
    cleaning: 1,
    maintenance: 0,
    rate: "70%",
  },
  {
    floor: "Floor 2",
    total: 10,
    occupied: 8,
    available: 1,
    cleaning: 1,
    maintenance: 0,
    rate: "80%",
  },
  {
    floor: "Floor 3",
    total: 10,
    occupied: 5,
    available: 4,
    cleaning: 1,
    maintenance: 0,
    rate: "50%",
  },
  {
    floor: "Floor 4",
    total: 8,
    occupied: 2,
    available: 5,
    cleaning: 0,
    maintenance: 1,
    rate: "25%",
  },
  {
    floor: "Floor 5",
    total: 4,
    occupied: 0,
    available: 2,
    cleaning: 1,
    maintenance: 1,
    rate: "0%",
  },
];

const occupancyTrend = [
  { day: "Mon", value: "68%", height: "68%" },
  { day: "Tue", value: "72%", height: "72%" },
  { day: "Wed", value: "80%", height: "80%" },
  { day: "Thu", value: "76%", height: "76%" },
  { day: "Fri", value: "89%", height: "89%" },
  { day: "Sat", value: "94%", height: "94%" },
  { day: "Sun", value: "78%", height: "78%" },
];

const roomTypeRows = [
  {
    type: "Presidential Suite",
    total: 2,
    occupied: 1,
    available: 1,
    rate: "50%",
  },
  {
    type: "Executive Suite",
    total: 6,
    occupied: 4,
    available: 2,
    rate: "67%",
  },
  {
    type: "Deluxe Room",
    total: 14,
    occupied: 9,
    available: 5,
    rate: "64%",
  },
  {
    type: "Standard Room",
    total: 20,
    occupied: 8,
    available: 12,
    rate: "40%",
  },
];

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
  return (
    <ProtectedRoute allowedRoles={["owner", "manager"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Reports & Analytics
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Occupancy Report
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View room occupancy rate, available rooms, booked rooms,
                cleaning rooms, and maintenance rooms.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/reports"
                className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
              >
                Back to Reports
              </a>

              <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                Export Report
              </button>
            </div>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            {occupancySummary.map((item) => (
              <StatCard
                key={item.label}
                label={item.label}
                value={item.value}
                note={item.note}
              />
            ))}
          </section>

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
                <BreakdownRow label="Occupied" value="22 Rooms" percent="52%" />
                <BreakdownRow label="Available" value="14 Rooms" percent="33%" />
                <BreakdownRow label="Cleaning" value="4 Rooms" percent="10%" />
                <BreakdownRow
                  label="Maintenance"
                  value="2 Rooms"
                  percent="5%"
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
        </main>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-widest text-[#4d4635]">
        {label}
      </p>

      <p className="mt-2 text-4xl font-extrabold text-[#735c00]">{value}</p>

      <p className="mt-2 text-sm text-[#4d4635]">{note}</p>
    </div>
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