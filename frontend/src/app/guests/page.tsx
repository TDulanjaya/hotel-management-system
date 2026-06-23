import AppSidebar from "@/components/layout/AppSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const guests = [
  {
    id: "GST-1001",
    name: "Mr. Alexander Thorne",
    email: "alexander@example.com",
    phone: "+1 555 210 4455",
    room: "Room 215",
    status: "Checked In",
    type: "VIP",
  },
  {
    id: "GST-1002",
    name: "Ms. Helena Thorne",
    email: "helena@example.com",
    phone: "+1 555 302 8891",
    room: "Room 308",
    status: "Reserved",
    type: "Corporate",
  },
  {
    id: "GST-1003",
    name: "Mr. Marcus Kane",
    email: "marcus@example.com",
    phone: "+1 555 904 1182",
    room: "Suite 402",
    status: "Checked In",
    type: "Regular",
  },
  {
    id: "GST-1004",
    name: "Ms. Sarah Redford",
    email: "sarah@example.com",
    phone: "+1 555 732 1900",
    room: "-",
    status: "Checked Out",
    type: "Regular",
  },
];

function getStatusClass(status: string) {
  if (status === "Checked In") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Reserved") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-blue-100 text-blue-700";
}

export default function GuestsPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "receptionist"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Front Office Module
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Guests
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Manage hotel guest profiles, contact details, room assignment,
                and guest status.
              </p>
            </div>

            <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
              + Add Guest
            </button>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard label="Total Guests" value="4" />
            <StatCard label="Checked In" value="2" />
            <StatCard label="Reserved" value="1" />
            <StatCard label="Checked Out" value="1" />
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Guest Records</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                View and manage all hotel guests.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Guest ID</th>
                    <th className="px-6 py-4">Guest Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Room</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {guests.map((guest) => (
                    <tr key={guest.id} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{guest.id}</td>

                      <td className="px-6 py-5 font-semibold">
                        {guest.name}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {guest.email}
                      </td>

                      <td className="px-6 py-5">{guest.phone}</td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {guest.room}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#735c00]">
                          {guest.type}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            guest.status
                          )}`}
                        >
                          {guest.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button className="rounded-lg border border-[#735c00] px-4 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white">
                          View
                        </button>
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