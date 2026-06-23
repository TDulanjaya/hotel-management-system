import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const kitchenOrders = [
  {
    id: "KIT-1001",
    orderRef: "ORD-501",
    source: "Restaurant",
    location: "Table 12",
    items: "Wagyu Beef Burger, Truffle Fries",
    priority: "High",
    status: "Preparing",
    time: "12:20 PM",
  },
  {
    id: "KIT-1002",
    orderRef: "RS-1001",
    source: "Room Service",
    location: "Room 402",
    items: "Club Sandwich, Orange Juice",
    priority: "Medium",
    status: "Ready",
    time: "12:30 PM",
  },
  {
    id: "KIT-1003",
    orderRef: "ORD-502",
    source: "Restaurant",
    location: "Table 07",
    items: "Chicken Alfredo, Garden Salad",
    priority: "Medium",
    status: "Pending",
    time: "12:45 PM",
  },
  {
    id: "KIT-1004",
    orderRef: "EV-0044",
    source: "Event Catering",
    location: "Grand Ballroom",
    items: "Canapés Tray, Sparkling Water",
    priority: "High",
    status: "Preparing",
    time: "01:00 PM",
  },
];

const orderStats = [
  {
    label: "Total Orders",
    value: "24",
  },
  {
    label: "Pending",
    value: "08",
  },
  {
    label: "Preparing",
    value: "10",
  },
  {
    label: "Ready",
    value: "06",
  },
];

function getStatusClass(status: string) {
  if (status === "Ready") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Preparing") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

function getPriorityClass(priority: string) {
  if (priority === "High") {
    return "bg-red-100 text-red-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

export default function KitchenOrdersPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "kitchen"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Kitchen Management
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Kitchen Orders
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View restaurant, room service, and event catering orders sent to
                the kitchen.
              </p>
            </div>

            <a
              href="/kitchen"
              className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
            >
              Back to Kitchen
            </a>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            {orderStats.map((item) => (
              <StatCard key={item.label} label={item.label} value={item.value} />
            ))}
          </section>

          <section className="mb-8 rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-4">
              <input
                type="text"
                placeholder="Search order..."
                className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              />

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>All Sources</option>
                <option>Restaurant</option>
                <option>Room Service</option>
                <option>Event Catering</option>
              </select>

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>All Status</option>
                <option>Pending</option>
                <option>Preparing</option>
                <option>Ready</option>
              </select>

              <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                Filter
              </button>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Active Kitchen Orders</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Orders waiting, preparing, or ready for serving.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Kitchen ID</th>
                    <th className="px-6 py-4">Order Ref</th>
                    <th className="px-6 py-4">Source</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Items</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {kitchenOrders.map((order) => (
                    <tr key={order.id} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{order.id}</td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {order.orderRef}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#735c00]">
                          {order.source}
                        </span>
                      </td>

                      <td className="px-6 py-5 font-semibold">
                        {order.location}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {order.items}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getPriorityClass(
                            order.priority
                          )}`}
                        >
                          {order.priority}
                        </span>
                      </td>

                      <td className="px-6 py-5">{order.time}</td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
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

      <p className="mt-2 text-3xl font-extrabold text-[#735c00]">{value}</p>
    </div>
  );
}