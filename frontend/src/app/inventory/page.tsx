import AppSidebar from "@/components/layout/AppSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const inventoryItems = [
  {
    id: "INV-1001",
    name: "Premium Bath Towels",
    category: "Housekeeping",
    stock: 240,
    minimum: 80,
    unit: "pcs",
    supplier: "Luxe Linen Co.",
    status: "In Stock",
  },
  {
    id: "INV-1002",
    name: "Basmati Rice",
    category: "Kitchen",
    stock: 35,
    minimum: 50,
    unit: "kg",
    supplier: "FreshMart Supplies",
    status: "Low Stock",
  },
  {
    id: "INV-1003",
    name: "Mineral Water Bottles",
    category: "Restaurant",
    stock: 420,
    minimum: 150,
    unit: "bottles",
    supplier: "AquaPure",
    status: "In Stock",
  },
  {
    id: "INV-1004",
    name: "Room Shampoo Set",
    category: "Amenities",
    stock: 18,
    minimum: 60,
    unit: "sets",
    supplier: "HotelCare Products",
    status: "Critical",
  },
  {
    id: "INV-1005",
    name: "Cleaning Liquid",
    category: "Housekeeping",
    stock: 75,
    minimum: 40,
    unit: "liters",
    supplier: "CleanPro",
    status: "In Stock",
  },
];

const purchaseRequests = [
  {
    id: "PR-001",
    item: "Basmati Rice",
    requestedBy: "Kitchen",
    quantity: "100 kg",
    status: "Pending Approval",
  },
  {
    id: "PR-002",
    item: "Room Shampoo Set",
    requestedBy: "Housekeeping",
    quantity: "250 sets",
    status: "Urgent",
  },
  {
    id: "PR-003",
    item: "Premium Coffee Beans",
    requestedBy: "Restaurant",
    quantity: "40 kg",
    status: "Approved",
  },
];

function getStatusClass(status: string) {
  if (status === "In Stock") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Low Stock") {
    return "bg-yellow-100 text-yellow-700";
  }

  if (status === "Critical") {
    return "bg-red-100 text-red-700";
  }

  if (status === "Approved") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Urgent") {
    return "bg-red-100 text-red-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

function getStockPercent(stock: number, minimum: number) {
  const percent = Math.min((stock / (minimum * 3)) * 100, 100);
  return `${percent}%`;
}

export default function InventoryPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "inventory"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Inventory Module
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Inventory Management
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Manage hotel stock, kitchen supplies, room amenities,
                housekeeping items, and purchase requests.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white">
                + Purchase Request
              </button>

              <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                + Add Item
              </button>
            </div>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard label="Total Items" value="5" />
            <StatCard label="In Stock" value="3" />
            <StatCard label="Low Stock" value="1" />
            <StatCard label="Critical" value="1" />
          </section>

          <section className="mb-8 rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-4">
              <input
                type="text"
                placeholder="Search item..."
                className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              />

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>All Categories</option>
                <option>Kitchen</option>
                <option>Housekeeping</option>
                <option>Restaurant</option>
                <option>Amenities</option>
              </select>

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>All Status</option>
                <option>In Stock</option>
                <option>Low Stock</option>
                <option>Critical</option>
              </select>

              <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                Filter
              </button>
            </div>
          </section>

          <section className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
              <div className="border-b border-[#d0c5af] p-6">
                <h2 className="text-2xl font-bold">Inventory Stock List</h2>

                <p className="mt-1 text-sm text-[#4d4635]">
                  Track stock quantity, reorder level, supplier, and item
                  status.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-left">
                  <thead>
                    <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                      <th className="px-6 py-4">Item ID</th>
                      <th className="px-6 py-4">Item</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4">Minimum</th>
                      <th className="px-6 py-4">Supplier</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#d0c5af]">
                    {inventoryItems.map((item) => (
                      <tr key={item.id} className="transition hover:bg-[#fbf9f5]">
                        <td className="px-6 py-5 font-bold">{item.id}</td>

                        <td className="px-6 py-5">
                          <p className="font-bold">{item.name}</p>

                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#f5f3ef]">
                            <div
                              className="h-full rounded-full bg-[#735c00]"
                              style={{
                                width: getStockPercent(item.stock, item.minimum),
                              }}
                            />
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#735c00]">
                            {item.category}
                          </span>
                        </td>

                        <td className="px-6 py-5 font-bold">
                          {item.stock} {item.unit}
                        </td>

                        <td className="px-6 py-5 text-[#4d4635]">
                          {item.minimum} {item.unit}
                        </td>

                        <td className="px-6 py-5 text-[#4d4635]">
                          {item.supplier}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                              item.status
                            )}`}
                          >
                            {item.status}
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
            </div>

            <aside className="space-y-8">
              <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">Purchase Requests</h2>

                <div className="mt-6 space-y-4">
                  {purchaseRequests.map((request) => (
                    <div
                      key={request.id}
                      className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-[#735c00]">
                            {request.item}
                          </p>

                          <p className="mt-1 text-sm text-[#4d4635]">
                            {request.id} • {request.requestedBy}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </div>

                      <p className="mt-3 text-sm font-bold">
                        Quantity: {request.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">Inventory Alerts</h2>

                <div className="mt-6 space-y-4">
                  <AlertCard
                    title="Critical Stock"
                    text="Room Shampoo Set is below minimum stock level."
                    type="critical"
                  />

                  <AlertCard
                    title="Low Stock"
                    text="Basmati Rice needs reorder approval."
                    type="warning"
                  />

                  <AlertCard
                    title="Good Stock"
                    text="Towels, water bottles, and cleaning items are stable."
                    type="success"
                  />
                </div>
              </section>
            </aside>
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

function AlertCard({
  title,
  text,
  type,
}: {
  title: string;
  text: string;
  type: "critical" | "warning" | "success";
}) {
  const styles = {
    critical: "border-red-200 bg-red-50 text-red-700",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-700",
    success: "border-green-200 bg-green-50 text-green-700",
  };

  return (
    <div className={`rounded-xl border p-4 ${styles[type]}`}>
      <p className="font-bold">{title}</p>
      <p className="mt-1 text-sm">{text}</p>
    </div>
  );
}