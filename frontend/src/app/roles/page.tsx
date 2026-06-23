import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const roles = [
  {
    name: "Owner",
    key: "owner",
    users: 1,
    access: "Full access to all modules, reports, users, and audit logs.",
    permissions: [
      "Owner Dashboard",
      "Manager Dashboard",
      "Reports",
      "Users",
      "Audit Logs",
      "Settings",
    ],
  },
  {
    name: "Manager",
    key: "manager",
    users: 2,
    access: "Can manage daily hotel operations, reports, users, and modules.",
    permissions: [
      "Manager Dashboard",
      "Rooms",
      "Reservations",
      "Guests",
      "Payments",
      "Reports",
      "Users",
    ],
  },
  {
    name: "Receptionist",
    key: "receptionist",
    users: 4,
    access: "Can manage front desk operations, reservations, guests, and payments.",
    permissions: [
      "Receptionist Dashboard",
      "Reservations",
      "Guests",
      "Rooms",
      "Payments",
    ],
  },
  {
    name: "Kitchen Staff",
    key: "kitchen",
    users: 3,
    access: "Can manage kitchen orders and food preparation workflow.",
    permissions: ["Kitchen", "Restaurant Orders"],
  },
  {
    name: "Inventory Staff",
    key: "inventory",
    users: 2,
    access: "Can manage hotel stock, supplies, and inventory usage.",
    permissions: ["Inventory", "Low Stock"],
  },
  {
    name: "Waiter",
    key: "waiter",
    users: 5,
    access: "Can manage restaurant tables, orders, and restaurant reservations.",
    permissions: [
      "Restaurant",
      "Restaurant Tables",
      "Restaurant Orders",
      "Restaurant Reservations",
    ],
  },
  {
    name: "Events Staff",
    key: "events",
    users: 2,
    access: "Can manage event bookings, event ledgers, and split billing.",
    permissions: ["Events", "Event List", "New Event", "Master Event Ledger"],
  },
  {
    name: "Parking Staff",
    key: "parking",
    users: 2,
    access: "Can manage parking operations and parking income records.",
    permissions: ["Parking"],
  },
  {
    name: "Game Staff",
    key: "game_staff",
    users: 2,
    access: "Can manage games, amenities, rentals, and game sessions.",
    permissions: ["Games", "Games List", "New Game Session", "Game Sessions"],
  },
];

export default function RolesPage() {
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
                Roles & Permissions
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View hotel system roles and the modules each role can access.
              </p>
            </div>

            <a
              href="/users/new"
              className="rounded-xl bg-[#735c00] px-6 py-3 text-center font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
            >
              + Assign User
            </a>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-3">
            <StatCard label="Total Roles" value="9" />
            <StatCard label="System Users" value="23" />
            <StatCard label="Protected Modules" value="18+" />
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            {roles.map((role) => (
              <article
                key={role.key}
                className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-[#735c00]">
                      {role.name}
                    </h2>

                    <p className="mt-1 text-sm font-bold uppercase tracking-widest text-[#4d4635]">
                      {role.key}
                    </p>
                  </div>

                  <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#735c00]">
                    {role.users} users
                  </span>
                </div>

                <p className="min-h-[48px] text-sm text-[#4d4635]">
                  {role.access}
                </p>

                <div className="mt-6">
                  <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#4d4635]">
                    Permissions
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="rounded-full border border-[#d0c5af] bg-[#f5f3ef] px-3 py-1 text-xs font-bold text-[#4d4635]"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
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

          <section className="mt-8 rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold">Role Protection Rule</h2>

            <p className="mt-2 text-[#4d4635]">
              Each page uses <strong>ProtectedRoute</strong> with allowed roles.
              Unauthorized users are redirected to the Access Denied page.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Module</th>
                    <th className="px-6 py-4">Allowed Roles</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  <RoleRow module="Users / Roles / Audit Logs" roles="owner, manager" />
                  <RoleRow module="Events" roles="owner, manager, events" />
                  <RoleRow module="Games" roles="owner, manager, game_staff" />
                  <RoleRow module="Restaurant" roles="owner, manager, waiter" />
                  <RoleRow module="Kitchen" roles="owner, manager, kitchen" />
                  <RoleRow module="Inventory" roles="owner, manager, inventory" />
                  <RoleRow module="Payments" roles="owner, manager, receptionist" />
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

function RoleRow({ module, roles }: { module: string; roles: string }) {
  return (
    <tr className="transition hover:bg-[#fbf9f5]">
      <td className="px-6 py-5 font-bold">{module}</td>
      <td className="px-6 py-5 text-[#4d4635]">{roles}</td>
    </tr>
  );
}