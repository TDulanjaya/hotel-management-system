import AppSidebar from "@/components/layout/AppSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const sessions = [
  {
    id: "SES-3001",
    guest: "Alexander Van Der Bilt",
    room: "Suite 402",
    game: "Grand Billiards I",
    startTime: "10:30 AM",
    duration: "02:15:20",
    status: "Active",
    amount: "$42.00",
  },
  {
    id: "SES-3002",
    guest: "Marcus Thorne",
    room: "Room 215",
    game: "VIP Gaming Suite",
    startTime: "09:10 AM",
    duration: "03:05:42",
    status: "Overdue",
    amount: "$75.00",
  },
  {
    id: "SES-3003",
    guest: "Sarah Redford",
    room: "Room 305",
    game: "Skyline Cinema",
    startTime: "Yesterday",
    duration: "02:00:00",
    status: "Completed",
    amount: "$80.00",
  },
];

function getStatusClass(status: string) {
  if (status === "Active") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Overdue") {
    return "bg-red-100 text-red-700";
  }

  return "bg-blue-100 text-blue-700";
}

export default function GameSessionsPage() {
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
                Game Sessions
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Active and completed game sessions will be shown here.
              </p>
            </div>

            <a
              href="/games/new-session"
              className="rounded-xl bg-[#735c00] px-6 py-3 text-center font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
            >
              + New Session
            </a>
          </div>

          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <StatCard label="Active Sessions" value="1" color="text-green-700" />
            <StatCard label="Overdue Sessions" value="1" color="text-red-700" />
            <StatCard label="Completed Today" value="1" color="text-blue-700" />
          </div>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Session Records</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Track guest sessions, duration, billing, and current status.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Session ID</th>
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Room</th>
                    <th className="px-6 py-4">Game / Amenity</th>
                    <th className="px-6 py-4">Start Time</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {sessions.map((session) => (
                    <tr
                      key={session.id}
                      className="transition hover:bg-[#fbf9f5]"
                    >
                      <td className="px-6 py-5 font-bold">{session.id}</td>

                      <td className="px-6 py-5 font-semibold">
                        {session.guest}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {session.room}
                      </td>

                      <td className="px-6 py-5">{session.game}</td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {session.startTime}
                      </td>

                      <td className="px-6 py-5 font-bold">
                        {session.duration}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            session.status
                          )}`}
                        >
                          {session.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right font-bold">
                        {session.amount}
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
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-widest text-[#4d4635]">
        {label}
      </p>

      <p className={`mt-2 text-4xl font-extrabold ${color}`}>{value}</p>
    </div>
  );
}