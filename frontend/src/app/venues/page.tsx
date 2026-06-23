import AppSidebar from "@/components/layout/AppSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const venues = [
  {
    id: "VEN-001",
    name: "Grand Ballroom",
    type: "Indoor Hall",
    capacity: 500,
    location: "Level 02",
    status: "Available",
    rate: "$12,000/day",
  },
  {
    id: "VEN-002",
    name: "Terrace Gardens",
    type: "Outdoor Venue",
    capacity: 180,
    location: "Garden Wing",
    status: "Booked",
    rate: "$6,500/day",
  },
  {
    id: "VEN-003",
    name: "Conference Hall A",
    type: "Conference Room",
    capacity: 120,
    location: "Level 01",
    status: "Available",
    rate: "$3,200/day",
  },
  {
    id: "VEN-004",
    name: "Rooftop Lounge",
    type: "Luxury Lounge",
    capacity: 90,
    location: "Rooftop",
    status: "Maintenance",
    rate: "$4,800/day",
  },
];

function getStatusClass(status: string) {
  if (status === "Available") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Booked") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-red-100 text-red-700";
}

export default function VenuesPage() {
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
                Venues
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Manage hotel event venues, capacity, availability, and venue
                rental charges.
              </p>
            </div>

            <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
              + Add Venue
            </button>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard label="Total Venues" value="4" />
            <StatCard label="Available" value="2" />
            <StatCard label="Booked" value="1" />
            <StatCard label="Maintenance" value="1" />
          </section>

          <section className="grid gap-6 xl:grid-cols-4">
            {venues.map((venue) => (
              <article
                key={venue.id}
                className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#4d4635]">
                      {venue.id}
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-[#735c00]">
                      {venue.name}
                    </h2>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                      venue.status
                    )}`}
                  >
                    {venue.status}
                  </span>
                </div>

                <div className="space-y-4">
                  <InfoRow label="Type" value={venue.type} />
                  <InfoRow label="Capacity" value={`${venue.capacity} guests`} />
                  <InfoRow label="Location" value={venue.location} />
                  <InfoRow label="Rate" value={venue.rate} />
                </div>

                <div className="mt-6 flex gap-3">
                  <button className="flex-1 rounded-xl border border-[#735c00] px-4 py-3 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white">
                    View
                  </button>

                  <button className="flex-1 rounded-xl bg-[#735c00] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                    Edit
                  </button>
                </div>
              </article>
            ))}
          </section>

          <section className="mt-8 overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Venue Schedule Overview</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Upcoming venue usage and availability summary.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Venue</th>
                    <th className="px-6 py-4">Today</th>
                    <th className="px-6 py-4">Tomorrow</th>
                    <th className="px-6 py-4">Next Event</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  <tr className="transition hover:bg-[#fbf9f5]">
                    <td className="px-6 py-5 font-bold">Grand Ballroom</td>
                    <td className="px-6 py-5 text-green-700">Free</td>
                    <td className="px-6 py-5 text-yellow-700">Reserved</td>
                    <td className="px-6 py-5 text-[#4d4635]">
                      Global Tech Summit
                    </td>
                    <td className="px-6 py-5">
                      <button className="rounded-lg border border-[#735c00] px-4 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white">
                        Check Calendar
                      </button>
                    </td>
                  </tr>

                  <tr className="transition hover:bg-[#fbf9f5]">
                    <td className="px-6 py-5 font-bold">Terrace Gardens</td>
                    <td className="px-6 py-5 text-yellow-700">Booked</td>
                    <td className="px-6 py-5 text-green-700">Free</td>
                    <td className="px-6 py-5 text-[#4d4635]">
                      Anderson Wedding
                    </td>
                    <td className="px-6 py-5">
                      <button className="rounded-lg border border-[#735c00] px-4 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white">
                        Check Calendar
                      </button>
                    </td>
                  </tr>

                  <tr className="transition hover:bg-[#fbf9f5]">
                    <td className="px-6 py-5 font-bold">Conference Hall A</td>
                    <td className="px-6 py-5 text-green-700">Free</td>
                    <td className="px-6 py-5 text-green-700">Free</td>
                    <td className="px-6 py-5 text-[#4d4635]">BioMed Expo</td>
                    <td className="px-6 py-5">
                      <button className="rounded-lg border border-[#735c00] px-4 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white">
                        Check Calendar
                      </button>
                    </td>
                  </tr>
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-[#f5f3ef] p-4">
      <span className="font-bold text-[#4d4635]">{label}</span>
      <span className="text-right font-bold">{value}</span>
    </div>
  );
}