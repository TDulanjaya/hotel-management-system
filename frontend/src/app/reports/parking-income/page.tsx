import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const parkingSummary = [
  {
    label: "Total Parking Income",
    value: "Rs 780",
    note: "Today parking collection",
  },
  {
    label: "Occupied Slots",
    value: "18",
    note: "Currently used parking slots",
  },
  {
    label: "Available Slots",
    value: "22",
    note: "Ready for new vehicles",
  },
  {
    label: "Vehicle Services",
    value: "Rs 240",
    note: "Wash and valet income",
  },
];

const parkingRows = [
  {
    id: "PK-1001",
    vehicle: "Honda Fit GP1",
    plate: "CAB-4521",
    guest: "Mr. Daniel Smith",
    slot: "A-12",
    service: "Parking Only",
    checkIn: "08:20 AM",
    checkOut: "02:15 PM",
    amount: "Rs 25.00",
    status: "Paid",
  },
  {
    id: "PK-1002",
    vehicle: "Toyota Yaris",
    plate: "KQ-8821",
    guest: "Ms. Olivia Brown",
    slot: "A-18",
    service: "Parking + Wash",
    checkIn: "09:10 AM",
    checkOut: "03:30 PM",
    amount: "Rs 45.00",
    status: "Paid",
  },
  {
    id: "PK-1003",
    vehicle: "Toyota Corolla",
    plate: "WP-7781",
    guest: "Walk-in Guest",
    slot: "B-09",
    service: "Parking Only",
    checkIn: "10:45 AM",
    checkOut: "-",
    amount: "Rs 15.00",
    status: "Pending",
  },
  {
    id: "PK-1004",
    vehicle: "Honda Civic",
    plate: "CAQ-3021",
    guest: "Mr. Marcus Kane",
    slot: "B-14",
    service: "Valet Service",
    checkIn: "11:30 AM",
    checkOut: "04:20 PM",
    amount: "Rs 60.00",
    status: "Paid",
  },
  {
    id: "PK-1005",
    vehicle: "Suzuki Wagon R",
    plate: "KV-5520",
    guest: "Event Guest",
    slot: "C-04",
    service: "Event Parking",
    checkIn: "01:00 PM",
    checkOut: "-",
    amount: "Rs 20.00",
    status: "Pending",
  },
];

const serviceBreakdown = [
  {
    label: "Parking Only",
    value: "Rs 420",
    percent: "54%",
  },
  {
    label: "Valet Service",
    value: "Rs 180",
    percent: "23%",
  },
  {
    label: "Vehicle Wash",
    value: "Rs 120",
    percent: "15%",
  },
  {
    label: "Event Parking",
    value: "Rs 60",
    percent: "8%",
  },
];

const hourlyIncome = [
  { time: "08 AM", value: "Rs 90", height: "45%" },
  { time: "10 AM", value: "Rs 140", height: "70%" },
  { time: "12 PM", value: "Rs 160", height: "80%" },
  { time: "02 PM", value: "Rs 200", height: "100%" },
  { time: "04 PM", value: "Rs 120", height: "60%" },
  { time: "06 PM", value: "Rs 70", height: "35%" },
];

const slotUsage = [
  {
    zone: "Zone A",
    total: 15,
    occupied: 10,
    available: 5,
    income: "Rs 340",
    rate: "67%",
  },
  {
    zone: "Zone B",
    total: 15,
    occupied: 6,
    available: 9,
    income: "Rs 260",
    rate: "40%",
  },
  {
    zone: "Zone C",
    total: 10,
    occupied: 2,
    available: 8,
    income: "Rs 180",
    rate: "20%",
  },
];

function getStatusClass(status: string) {
  if (status === "Paid") {
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
                Parking Income Report
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View parking bookings, parking payments, vehicle services,
                slot usage, and parking income details.
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
            {parkingSummary.map((item) => (
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