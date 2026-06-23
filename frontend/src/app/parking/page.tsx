import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const parkingSlots = [
  {
    id: "P-001",
    vehicle: "Honda Fit GP1",
    plate: "CAB-4521",
    guest: "Mr. Daniel Smith",
    room: "Room 204",
    slot: "A-12",
    status: "Occupied",
    fee: "Rs 8.00",
  },
  {
    id: "P-002",
    vehicle: "Toyota Yaris",
    plate: "KQ-8821",
    guest: "Ms. Olivia Brown",
    room: "Room 310",
    slot: "A-18",
    status: "Occupied",
    fee: "Rs 8.00",
  },
  {
    id: "P-003",
    vehicle: "-",
    plate: "-",
    guest: "-",
    room: "-",
    slot: "B-04",
    status: "Available",
    fee: "Rs 0.00",
  },
  {
    id: "P-004",
    vehicle: "Toyota Corolla",
    plate: "WP-7781",
    guest: "Walk-in Guest",
    room: "-",
    slot: "B-09",
    status: "Reserved",
    fee: "Rs 5.00",
  },
];

function getStatusClass(status: string) {
  if (status === "Available") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Occupied") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-blue-100 text-blue-700";
}

export default function ParkingPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "parking"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Parking Module
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Parking Management
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Manage parking slots, vehicles, guest parking, and parking
                charges.
              </p>
            </div>

            <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
              + Add Vehicle
            </button>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard label="Total Slots" value="40" />
            <StatCard label="Occupied" value="18" />
            <StatCard label="Available" value="22" />
            <StatCard label="Today Income" value="Rs 144" />
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Parking Slot Records</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Track guest vehicles and parking slot availability.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Parking ID</th>
                    <th className="px-6 py-4">Slot</th>
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Plate No</th>
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Room</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Fee</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {parkingSlots.map((parking) => (
                    <tr
                      key={parking.id}
                      className="transition hover:bg-[#fbf9f5]"
                    >
                      <td className="px-6 py-5 font-bold">{parking.id}</td>

                      <td className="px-6 py-5 font-semibold">
                        {parking.slot}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {parking.vehicle}
                      </td>

                      <td className="px-6 py-5">{parking.plate}</td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {parking.guest}
                      </td>

                      <td className="px-6 py-5">{parking.room}</td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            parking.status
                          )}`}
                        >
                          {parking.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right font-bold">
                        {parking.fee}
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

      <p className="mt-2 text-4xl font-extrabold text-[#735c00]">{value}</p>
    </div>
  );
}