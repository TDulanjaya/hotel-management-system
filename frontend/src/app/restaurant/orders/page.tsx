import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const orders = [
  {
    id: "ORD-1001",
    table: "Table 04",
    guest: "Walk-in Guest",
    items: "2x Chicken Pasta, 1x Orange Juice",
    status: "Preparing",
    amount: "Rs 42.00",
  },
  {
    id: "ORD-1002",
    table: "Table 09",
    guest: "Mr. James",
    items: "1x Beef Burger, 2x Fries",
    status: "Ready",
    amount: "Rs 36.00",
  },
  {
    id: "ORD-1003",
    table: "Table 02",
    guest: "Ms. Elena",
    items: "1x Caesar Salad, 1x Coffee",
    status: "Pending",
    amount: "Rs 24.00",
  },
];

function getStatusClass(status: string) {
  if (status === "Ready") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Preparing") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-red-100 text-red-700";
}

export default function RestaurantOrdersPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "waiter"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Restaurant Module
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Restaurant Orders
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Food and beverage orders will be managed here.
              </p>
            </div>

            <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
              + New Order
            </button>
          </div>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Today&apos;s Orders</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Live restaurant order list.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Table</th>
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Items</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="transition hover:bg-[#fbf9f5]"
                    >
                      <td className="px-6 py-5 font-bold">{order.id}</td>

                      <td className="px-6 py-5">{order.table}</td>

                      <td className="px-6 py-5">{order.guest}</td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {order.items}
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