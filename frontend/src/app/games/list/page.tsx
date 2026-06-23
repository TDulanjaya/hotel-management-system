import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const games = [
  {
    id: "GM-001",
    name: "Grand Billiards I",
    type: "Billiards",
    location: "Recreation Floor",
    status: "Occupied",
    hourlyRate: "Rs 18.00",
  },
  {
    id: "GM-002",
    name: "VIP Gaming Suite",
    type: "Console Gaming",
    location: "Level 03",
    status: "Overdue",
    hourlyRate: "Rs 25.00",
  },
  {
    id: "GM-003",
    name: "Skyline Cinema",
    type: "Private Cinema",
    location: "Rooftop Zone",
    status: "Available",
    hourlyRate: "Rs 40.00",
  },
  {
    id: "GM-004",
    name: "Table Tennis Center",
    type: "Indoor Sport",
    location: "Recreation Floor",
    status: "Available",
    hourlyRate: "Rs 12.00",
  },
];

function getStatusClass(status: string) {
  if (status === "Available") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Occupied") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-red-100 text-red-700";
}

export default function GamesListPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "game_staff"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Games Module
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Games & Amenities List
              </h1>

              <p className="mt-2 text-[#4d4635]">
                All games, amenities, and recreation facilities will be listed
                here.
              </p>
            </div>

            <a
              href="/games/new-session"
              className="rounded-xl bg-[#735c00] px-6 py-3 text-center font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
            >
              + New Session
            </a>
          </div>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Available Facilities</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Manage hotel recreation items and game stations.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Game ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Hourly Rate</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {games.map((game) => (
                    <tr key={game.id} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{game.id}</td>

                      <td className="px-6 py-5 font-semibold">{game.name}</td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {game.type}
                      </td>

                      <td className="px-6 py-5">{game.location}</td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            game.status
                          )}`}
                        >
                          {game.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right font-bold">
                        {game.hourlyRate}
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