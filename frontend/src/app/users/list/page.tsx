import AppSidebar from "@/components/layout/AppSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const users = [
  {
    id: "USR-001",
    name: "Alexander Wright",
    email: "owner@luxestay.com",
    role: "Owner",
    department: "Administration",
    status: "Active",
  },
  {
    id: "USR-002",
    name: "Julian Sterling",
    email: "manager@luxestay.com",
    role: "Manager",
    department: "Operations",
    status: "Active",
  },
  {
    id: "USR-003",
    name: "Emma Johnson",
    email: "receptionist@luxestay.com",
    role: "Receptionist",
    department: "Front Office",
    status: "Active",
  },
  {
    id: "USR-004",
    name: "Marcus Thorne",
    email: "kitchen@luxestay.com",
    role: "Kitchen Staff",
    department: "Kitchen",
    status: "Inactive",
  },
  {
    id: "USR-005",
    name: "Sarah Lopez",
    email: "events@luxestay.com",
    role: "Events Staff",
    department: "Events",
    status: "Active",
  },
];

function getStatusClass(status: string) {
  if (status === "Active") {
    return "bg-green-100 text-green-700";
  }

  return "bg-red-100 text-red-700";
}

export default function UsersListPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "manager"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                User Management
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Users List
              </h1>

              <p className="mt-2 text-[#4d4635]">
                All system users will be listed here.
              </p>
            </div>

            <a
              href="/users/new"
              className="rounded-xl bg-[#735c00] px-6 py-3 text-center font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
            >
              + New User
            </a>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-3">
            <StatCard label="Total Users" value="5" />
            <StatCard label="Active Users" value="4" />
            <StatCard label="Inactive Users" value="1" />
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">System Users</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Manage staff accounts, roles, departments, and account status.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">User ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {users.map((user) => (
                    <tr key={user.id} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{user.id}</td>

                      <td className="px-6 py-5 font-semibold">{user.name}</td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {user.email}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#735c00]">
                          {user.role}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {user.department}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            user.status
                          )}`}
                        >
                          {user.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button className="rounded-lg border border-[#735c00] px-4 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white">
                          Edit
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