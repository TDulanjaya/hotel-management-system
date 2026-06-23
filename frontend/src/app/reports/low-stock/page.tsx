import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const lowStockSummary = [
  {
    label: "Low Stock Items",
    value: "06",
    note: "Below reorder level",
  },
  {
    label: "Critical Items",
    value: "02",
    note: "Need urgent purchase",
  },
  {
    label: "Pending Requests",
    value: "03",
    note: "Waiting approval",
  },
  {
    label: "Estimated Cost",
    value: "Rs 3,850",
    note: "Reorder budget needed",
  },
];

const lowStockItems = [
  {
    id: "INV-1002",
    item: "Basmati Rice",
    category: "Kitchen",
    currentStock: "35 kg",
    minimumStock: "50 kg",
    reorderQty: "100 kg",
    supplier: "FreshMart Supplies",
    status: "Low Stock",
    priority: "Medium",
  },
  {
    id: "INV-1004",
    item: "Room Shampoo Set",
    category: "Amenities",
    currentStock: "18 sets",
    minimumStock: "60 sets",
    reorderQty: "250 sets",
    supplier: "HotelCare Products",
    status: "Critical",
    priority: "High",
  },
  {
    id: "INV-1006",
    item: "Premium Coffee Beans",
    category: "Restaurant",
    currentStock: "12 kg",
    minimumStock: "30 kg",
    reorderQty: "40 kg",
    supplier: "Ceylon Coffee Co.",
    status: "Critical",
    priority: "High",
  },
  {
    id: "INV-1007",
    item: "Laundry Detergent",
    category: "Housekeeping",
    currentStock: "22 liters",
    minimumStock: "40 liters",
    reorderQty: "60 liters",
    supplier: "CleanPro",
    status: "Low Stock",
    priority: "Medium",
  },
  {
    id: "INV-1008",
    item: "Toilet Paper Rolls",
    category: "Amenities",
    currentStock: "90 rolls",
    minimumStock: "150 rolls",
    reorderQty: "300 rolls",
    supplier: "HotelCare Products",
    status: "Low Stock",
    priority: "Medium",
  },
  {
    id: "INV-1009",
    item: "Chicken Breast",
    category: "Kitchen",
    currentStock: "14 kg",
    minimumStock: "25 kg",
    reorderQty: "50 kg",
    supplier: "FreshMart Supplies",
    status: "Low Stock",
    priority: "Medium",
  },
];

const purchaseRequests = [
  {
    id: "PR-001",
    item: "Room Shampoo Set",
    requestedBy: "Housekeeping",
    quantity: "250 sets",
    estimatedCost: "Rs 1,250",
    status: "Urgent",
  },
  {
    id: "PR-002",
    item: "Basmati Rice",
    requestedBy: "Kitchen",
    quantity: "100 kg",
    estimatedCost: "Rs 420",
    status: "Pending Approval",
  },
  {
    id: "PR-003",
    item: "Premium Coffee Beans",
    requestedBy: "Restaurant",
    quantity: "40 kg",
    estimatedCost: "Rs 680",
    status: "Approved",
  },
];

function getStatusClass(status: string) {
  if (status === "Critical" || status === "Urgent") {
    return "bg-red-100 text-red-700";
  }

  if (status === "Approved") {
    return "bg-green-100 text-green-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

function getPriorityClass(priority: string) {
  if (priority === "High") {
    return "bg-red-100 text-red-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

export default function LowStockReportPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "manager"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Reports & Analytics
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Low Stock Report
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View low stock inventory items, critical reorder alerts,
                suppliers, and purchase request status.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/reports"
                className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
              >
                Back to Reports
              </a>

              <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                Export Report
              </button>
            </div>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            {lowStockSummary.map((item) => (
              <StatCard
                key={item.label}
                label={item.label}
                value={item.value}
                note={item.note}
              />
            ))}
          </section>

          <section className="mb-8 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Stock Alert Overview</h2>

              <div className="mt-6 space-y-4">
                <AlertRow
                  label="Critical Items"
                  value="2 Items"
                  percent="35%"
                  type="critical"
                />

                <AlertRow
                  label="Low Stock Items"
                  value="4 Items"
                  percent="65%"
                  type="warning"
                />

                <AlertRow
                  label="Purchase Requests Created"
                  value="3 Requests"
                  percent="50%"
                  type="normal"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Reorder Priority</h2>

              <div className="mt-6 space-y-4">
                <PriorityCard
                  title="Urgent Purchase Needed"
                  text="Room Shampoo Set and Premium Coffee Beans are below critical level."
                  type="critical"
                />

                <PriorityCard
                  title="Supplier Follow-up"
                  text="Contact suppliers and confirm delivery dates for pending requests."
                  type="warning"
                />

                <PriorityCard
                  title="Inventory Control"
                  text="Update stock levels after purchase order approval."
                  type="success"
                />
              </div>
            </div>
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
                <option>Restaurant</option>
                <option>Housekeeping</option>
                <option>Amenities</option>
              </select>

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>All Status</option>
                <option>Low Stock</option>
                <option>Critical</option>
              </select>

              <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                Filter
              </button>
            </div>
          </section>

          <section className="mb-8 overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Low Stock Inventory Items</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Items below minimum stock level and required reorder quantity.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Item ID</th>
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Current Stock</th>
                    <th className="px-6 py-4">Minimum Stock</th>
                    <th className="px-6 py-4">Reorder Qty</th>
                    <th className="px-6 py-4">Supplier</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {lowStockItems.map((item) => (
                    <tr key={item.id} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{item.id}</td>

                      <td className="px-6 py-5 font-semibold">{item.item}</td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#735c00]">
                          {item.category}
                        </span>
                      </td>

                      <td className="px-6 py-5 font-bold text-red-700">
                        {item.currentStock}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {item.minimumStock}
                      </td>

                      <td className="px-6 py-5 font-bold">
                        {item.reorderQty}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {item.supplier}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getPriorityClass(
                            item.priority
                          )}`}
                        >
                          {item.priority}
                        </span>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Purchase Request Status</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Reorder requests created from low stock alerts.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Request ID</th>
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4">Requested By</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4 text-right">Estimated Cost</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {purchaseRequests.map((request) => (
                    <tr key={request.id} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{request.id}</td>

                      <td className="px-6 py-5 font-semibold">
                        {request.item}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {request.requestedBy}
                      </td>

                      <td className="px-6 py-5">{request.quantity}</td>

                      <td className="px-6 py-5 text-right font-bold text-[#735c00]">
                        {request.estimatedCost}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
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
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-widest text-[#4d4635]">
        {label}
      </p>

      <p className="mt-2 text-4xl font-extrabold text-[#735c00]">{value}</p>

      <p className="mt-2 text-sm text-[#4d4635]">{note}</p>
    </div>
  );
}

function AlertRow({
  label,
  value,
  percent,
  type,
}: {
  label: string;
  value: string;
  percent: string;
  type: "critical" | "warning" | "normal";
}) {
  const barColor =
    type === "critical"
      ? "bg-red-600"
      : type === "warning"
      ? "bg-yellow-500"
      : "bg-[#735c00]";

  return (
    <div className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
      <div className="flex items-center justify-between">
        <p className="font-bold">{label}</p>
        <p className="font-bold text-[#735c00]">{value}</p>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: percent }} />
      </div>

      <p className="mt-2 text-sm text-[#4d4635]">{percent}</p>
    </div>
  );
}

function PriorityCard({
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