import AppSidebar from "@/components/layout/AppSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const reservations = [
  {
    id: "RES-2001",
    guest: "Mr. Daniel Smith",
    table: "Table 05",
    date: "Today",
    time: "7:30 PM",
    guests: 4,
    status: "Confirmed",
  },
  {
    id: "RES-2002",
    guest: "Ms. Olivia Brown",
    table: "Table 09",
    date: "Today",
    time: "8:00 PM",
    guests: 2,
    status: "Pending",
  },
  {
    id: "RES-2003",
    guest: "Walk-in Hold",
    table: "Table 02",
    date: "Tomorrow",
    time: "6:45 PM",
    guests: 3,
    status: "Confirmed",
  },
];

function getStatusClass(status: string) {
  if (status === "Confirmed") {
    return "bg-green-100 text-green-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

export default function RestaurantReservationsPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "waiter"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Restaurant Module
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Restaurant Reservations
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Table bookings and shift reservations will be managed here.
              </p>
            </div>

            <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
              + New Reservation
            </button>
          </div>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Today&apos;s Table Bookings</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Manage upcoming restaurant table reservations.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Reservation ID</th>
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Table</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Guests</th>
                    <th className="px-6 py-4">Status</th>
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

                      <td className="px-6 py-5">{reservation.guest}</td>

                      <td className="px-6 py-5">{reservation.table}</td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {reservation.date}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {reservation.time}
                      </td>

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