import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const reservations = [
  {
    id: "RSV-1001",
    guest: "Mr. Alexander Thorne",
    room: "Presidential Suite 402",
    checkIn: "Oct 12, 2024",
    checkOut: "Oct 15, 2024",
    guests: 2,
    status: "Confirmed",
    amount: "Rs 3,750",
  },
  {
    id: "RSV-1002",
    guest: "Ms. Helena Thorne",
    room: "Deluxe Room 308",
    checkIn: "Oct 14, 2024",
    checkOut: "Oct 16, 2024",
    guests: 1,
    status: "Pending",
    amount: "Rs 900",
  },
  {
    id: "RSV-1003",
    guest: "Mr. Marcus Kane",
    room: "Standard Room 215",
    checkIn: "Oct 10, 2024",
    checkOut: "Oct 13, 2024",
    guests: 3,
    status: "Checked In",
    amount: "Rs 840",
  },
  {
    id: "RSV-1004",
    guest: "Ms. Sarah Redford",
    room: "Junior Suite 403",
    checkIn: "Oct 18, 2024",
    checkOut: "Oct 21, 2024",
    guests: 2,
    status: "Cancelled",
    amount: "Rs 0",
  },
];

function getStatusClass(status: string) {
  if (status === "Confirmed") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Checked In") {
    return "bg-blue-100 text-blue-700";
  }

  if (status === "Pending") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-red-100 text-red-700";
}

export default function ReservationsPage() {
  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "RECEPTIONIST"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Front Office Module
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Reservations
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Manage guest room bookings, check-in dates, check-out dates, and
                reservation status.
              </p>
            </div>

            <a
              href="/reservations/new"
              className="rounded-xl bg-[#735c00] px-6 py-3 text-center font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
            >
              + New Reservation
            </a>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard label="Total Reservations" value="4" />
            <StatCard label="Confirmed" value="1" />
            <StatCard label="Checked In" value="1" />
            <StatCard label="Pending" value="1" />
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Reservation Records</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                View and manage all current hotel reservations.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Reservation ID</th>
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Room</th>
                    <th className="px-6 py-4">Check In</th>
                    <th className="px-6 py-4">Check Out</th>
                    <th className="px-6 py-4">Guests</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {reservations.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className="transition hover:bg-[#fbf9f5]"
                    >
                      <td className="px-6 py-5 font-bold">
                        {reservation.id}
                      </td>

                      <td className="px-6 py-5 font-semibold">
                        {reservation.guest}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {reservation.room}
                      </td>

                      <td className="px-6 py-5">{reservation.checkIn}</td>

                      <td className="px-6 py-5">{reservation.checkOut}</td>

                      <td className="px-6 py-5">{reservation.guests}</td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            reservation.status
                          )}`}
                        >
                          {reservation.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right font-bold">
                        {reservation.amount}
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