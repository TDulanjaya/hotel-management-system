import AppSidebar from "@/components/layout/AppSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const events = [
  {
    id: "EVT-1001",
    name: "Global Tech Summit 2024",
    organizer: "Nova Dynamics Corp",
    venue: "Grand Ballroom",
    date: "Oct 12, 2024",
    guests: 450,
    status: "Confirmed",
  },
  {
    id: "EVT-1002",
    name: "Anderson Wedding",
    organizer: "Anderson Family",
    venue: "Terrace Gardens",
    date: "Oct 15, 2024",
    guests: 120,
    status: "Active",
  },
  {
    id: "EVT-1003",
    name: "BioMed Expo",
    organizer: "BioMed Lanka",
    venue: "Conference Hall A",
    date: "Oct 24, 2024",
    guests: 300,
    status: "Pending",
  },
];

function getStatusClass(status: string) {
  if (status === "Confirmed") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Active") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

export default function EventsListPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "events"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Events Module
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Event List
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View and manage hotel events, weddings, conferences, and
                corporate bookings.
              </p>
            </div>

            <a
              href="/events/new"
              className="rounded-xl bg-[#735c00] px-6 py-3 text-center font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
            >
              + New Event
            </a>
          </div>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">All Events</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Current and upcoming hotel events.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Event ID</th>
                    <th className="px-6 py-4">Event Name</th>
                    <th className="px-6 py-4">Organizer</th>
                    <th className="px-6 py-4">Venue</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Guests</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {events.map((event) => (
                    <tr key={event.id} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{event.id}</td>

                      <td className="px-6 py-5 font-semibold">
                        {event.name}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {event.organizer}
                      </td>

                      <td className="px-6 py-5">{event.venue}</td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {event.date}
                      </td>

                      <td className="px-6 py-5">{event.guests}</td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            event.status
                          )}`}
                        >
                          {event.status}
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