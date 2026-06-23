import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const roomServiceOrders = [
  {
    id: "RS-1001",
    room: "Room 402",
    guest: "Mr. Alexander Thorne",
    items: "Club Sandwich, Orange Juice",
    time: "10:25 AM",
    status: "Preparing",
    amount: "Rs 32.00",
  },
  {
    id: "RS-1002",
    room: "Room 308",
    guest: "Ms. Helena Thorne",
    items: "Caesar Salad, Coffee",
    time: "11:10 AM",
    status: "Delivered",
    amount: "Rs 24.00",
  },
  {
    id: "RS-1003",
    room: "Suite 501",
    guest: "Mr. Marcus Kane",
    items: "Steak Dinner, Red Wine",
    time: "12:05 PM",
    status: "Pending",
    amount: "Rs 88.00",
  },
  {
    id: "RS-1004",
    room: "Room 215",
    guest: "Ms. Sarah Redford",
    items: "Pasta, Mineral Water",
    time: "12:30 PM",
    status: "Cancelled",
    amount: "Rs 0.00",
  },
];

function getStatusClass(status: string) {
  if (status === "Delivered") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Preparing") {
    return "bg-yellow-100 text-yellow-700";
  }

  if (status === "Pending") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-red-100 text-red-700";
}

export default function RoomServicePage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "receptionist", "kitchen"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Room Service Module
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Room Service
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Manage guest room service orders, kitchen preparation, delivery,
                and billing.
              </p>
            </div>

            <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
              + New Room Order
            </button>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard label="Total Orders" value="4" />
            <StatCard label="Preparing" value="1" />
            <StatCard label="Delivered" value="1" />
            <StatCard label="Today Sales" value="Rs 144" />
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Room Service Orders</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Track room orders from request to delivery.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Room</th>
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Items</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {roomServiceOrders.map((order) => (
                    <tr key={order.id} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{order.id}</td>

                      <td className="px-6 py-5 font-semibold">{order.room}</td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {order.guest}
                      </td>

                      <td className="px-6 py-5">{order.items}</td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {order.time}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right font-bold">
                        {order.amount}
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button className="rounded-lg border border-[#735c00] px-4 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white">
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-3">
            <InfoCard
              title="Kitchen Queue"
              value="2 Orders"
              text="Pending and preparing orders waiting for kitchen completion."
            />

            <InfoCard
              title="Delivery Queue"
              value="1 Order"
              text="Prepared orders waiting for room delivery."
            />

            <InfoCard
              title="Billing Sync"
              value="Auto"
              text="Delivered orders are added to guest folio automatically."
            />
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

function InfoCard({
  title,
  value,
  text,
}: {
  title: string;
  value: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-[#735c00]">{title}</h3>

      <p className="mt-3 text-3xl font-extrabold">{value}</p>

      <p className="mt-2 text-sm text-[#4d4635]">{text}</p>
    </div>
  );
}