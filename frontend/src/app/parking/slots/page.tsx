import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const parkingRecords = [
  {
    id: "PK-1001",
    vehicleNo: "CAB-4521",
    vehicle: "Honda Fit GP1",
    guest: "Daniel Smith",
    slot: "A-12",
    service: "Parking Only",
    checkIn: "08:20 AM",
    checkOut: "02:15 PM",
    amount: "Rs 25.00",
    status: "Completed",
  },
  {
    id: "PK-1002",
    vehicleNo: "KQ-8821",
    vehicle: "Toyota Yaris",
    guest: "Olivia Brown",
    slot: "A-18",
    service: "Parking + Wash",
    checkIn: "09:10 AM",
    checkOut: "03:30 PM",
    amount: "Rs 45.00",
    status: "Completed",
  },
  {
    id: "PK-1003",
    vehicleNo: "WP-7781",
    vehicle: "Toyota Corolla",
    guest: "Walk-in Guest",
    slot: "B-09",
    service: "Parking Only",
    checkIn: "10:45 AM",
    checkOut: "-",
    amount: "Rs 15.00",
    status: "Active",
  },
  {
    id: "PK-1004",
    vehicleNo: "CAQ-3021",
    vehicle: "Honda Civic",
    guest: "Marcus Kane",
    slot: "B-14",
    service: "Valet Service",
    checkIn: "11:30 AM",
    checkOut: "04:20 PM",
    amount: "Rs 60.00",
    status: "Completed",
  },
  {
    id: "PK-1005",
    vehicleNo: "KV-5520",
    vehicle: "Suzuki Wagon R",
    guest: "Event Guest",
    slot: "C-04",
    service: "Event Parking",
    checkIn: "01:00 PM",
    checkOut: "-",
    amount: "Rs 20.00",
    status: "Active",
  },
];

const recordStats = [
  {
    label: "Total Records",
    value: "128",
  },
  {
    label: "Active Parking",
    value: "18",
  },
  {
    label: "Completed Today",
    value: "42",
  },
  {
    label: "Today Income",
    value: "Rs 780",
  },
];

function getStatusClass(status: string) {
  if (status === "Completed") {
    return "bg-green-100 text-green-700";
  }

  return "bg-blue-100 text-blue-700";
}

export default function ParkingRecordsPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "parking"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Parking Management
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Parking Records
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View parking history, active vehicles, parking services, payment
                records, and checkout status.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/parking"
                className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
              >
                Back to Parking
              </a>

              <a
                href="/parking/new"
                className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
              >
                New Parking
              </a>
            </div>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            {recordStats.map((item) => (
              <StatCard key={item.label} label={item.label} value={item.value} />
            ))}
          </section>

          <section className="mb-8 rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-4">
              <input
                type="text"
                placeholder="Search vehicle or guest..."
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
                <option>Active</option>
                <option>Completed</option>
              </select>

              <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                Filter
              </button>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Parking Record List</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Active and completed parking records.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Record ID</th>
                    <th className="px-6 py-4">Vehicle No</th>
                    <th className="px-6 py-4">Vehicle</th>
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
                  {parkingRecords.map((record) => (
                    <tr key={record.id} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{record.id}</td>

                      <td className="px-6 py-5 font-semibold">
                        {record.vehicleNo}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {record.vehicle}
                      </td>

                      <td className="px-6 py-5">{record.guest}</td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#735c00]">
                          {record.slot}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {record.service}
                      </td>

                      <td className="px-6 py-5">{record.checkIn}</td>

                      <td className="px-6 py-5">{record.checkOut}</td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            record.status
                          )}`}
                        >
                          {record.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right font-bold text-[#735c00]">
                        {record.amount}
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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-widest text-[#4d4635]">
        {label}
      </p>

      <p className="mt-2 text-3xl font-extrabold text-[#735c00]">{value}</p>
    </div>
  );
}