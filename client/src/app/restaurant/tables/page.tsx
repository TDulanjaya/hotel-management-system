import Link from "next/link";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Sparkles,
  Table2,
  Users,
} from "lucide-react";

const tables = [
  {
    id: "T01",
    area: "Main Hall",
    seats: 2,
    status: "AVAILABLE",
    waiter: "Nimal",
  },
  {
    id: "T02",
    area: "Main Hall",
    seats: 4,
    status: "OCCUPIED",
    waiter: "Kasun",
  },
  {
    id: "T03",
    area: "Window Side",
    seats: 4,
    status: "RESERVED",
    waiter: "Amal",
  },
  {
    id: "T04",
    area: "Garden View",
    seats: 6,
    status: "CLEANING",
    waiter: "Sahan",
  },
  {
    id: "T05",
    area: "VIP Area",
    seats: 8,
    status: "AVAILABLE",
    waiter: "Nimal",
  },
  {
    id: "T06",
    area: "Outdoor",
    seats: 4,
    status: "OCCUPIED",
    waiter: "Kasun",
  },
];

function getStatusClass(status: string) {
  if (status === "AVAILABLE") return "bg-green-100 text-green-700";
  if (status === "OCCUPIED") return "bg-red-100 text-red-700";
  if (status === "RESERVED") return "bg-blue-100 text-blue-700";
  if (status === "CLEANING") return "bg-yellow-100 text-yellow-700";

  return "bg-slate-100 text-slate-700";
}

export default function RestaurantTablesPage() {
  const availableCount = tables.filter((table) => table.status === "AVAILABLE").length;
  const occupiedCount = tables.filter((table) => table.status === "OCCUPIED").length;
  const reservedCount = tables.filter((table) => table.status === "RESERVED").length;
  const cleaningCount = tables.filter((table) => table.status === "CLEANING").length;

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "WAITER"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Restaurant Module
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Restaurant Tables
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View table availability, seating capacity, assigned waiter and
                table status.
              </p>
            </div>

            <Link
              href="/restaurant"
              className="flex items-center gap-2 rounded-xl border border-[#806300] bg-white px-6 py-3 font-bold text-[#806300] transition hover:bg-[#faf8f3]"
            >
              <ArrowLeft size={18} />
              Back to Restaurant
            </Link>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard
              label="Available"
              value={String(availableCount)}
              icon={<CheckCircle />}
            />

            <StatCard
              label="Occupied"
              value={String(occupiedCount)}
              icon={<Users />}
            />

            <StatCard
              label="Reserved"
              value={String(reservedCount)}
              icon={<Clock />}
            />

            <StatCard
              label="Cleaning"
              value={String(cleaningCount)}
              icon={<Sparkles />}
            />
          </section>

          <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Table Floor View</h2>
                <p className="mt-1 text-sm text-[#4d4635]">
                  Static table layout for restaurant operations.
                </p>
              </div>

              <Table2 className="text-[#735c00]" size={34} />
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {tables.map((table) => (
                <article
                  key={table.id}
                  className="rounded-2xl border border-[#d0c5af] bg-[#fbf9f5] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-5 flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-extrabold">
                        Table {table.id}
                      </h3>

                      <p className="mt-1 text-sm font-semibold text-[#4d4635]">
                        {table.area}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                        table.status
                      )}`}
                    >
                      {table.status}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm text-[#4d4635]">
                    <div className="flex justify-between">
                      <span>Seats</span>
                      <strong>{table.seats}</strong>
                    </div>

                    <div className="flex justify-between">
                      <span>Assigned Waiter</span>
                      <strong>{table.waiter}</strong>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button className="rounded-xl border border-[#735c00] px-4 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00]/5">
                      View
                    </button>

                    <button className="rounded-xl bg-[#735c00] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                      Update
                    </button>
                  </div>
                </article>
              ))}
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
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4af37] text-[#554300]">
        {icon}
      </div>

      <p className="text-sm font-bold uppercase tracking-widest text-[#4d4635]">
        {label}
      </p>

      <p className="mt-2 text-3xl font-extrabold text-[#735c00]">{value}</p>
    </div>
  );
}