import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const alertSummary = [
  {
    label: "Total Alerts",
    value: "09",
    note: "Inventory warnings",
  },
  {
    label: "Critical",
    value: "03",
    note: "Need urgent action",
  },
  {
    label: "Low Stock",
    value: "05",
    note: "Below reorder level",
  },
  {
    label: "Expired Soon",
    value: "01",
    note: "Check expiry date",
  },
];

const inventoryAlerts = [
  {
    id: "ALT-1001",
    item: "Room Shampoo Set",
    category: "Amenities",
    currentStock: "18 sets",
    minimumStock: "60 sets",
    supplier: "HotelCare Products",
    alertType: "Critical",
    action: "Create Purchase Request",
  },
  {
    id: "ALT-1002",
    item: "Premium Coffee Beans",
    category: "Restaurant",
    currentStock: "12 kg",
    minimumStock: "30 kg",
    supplier: "Ceylon Coffee Co.",
    alertType: "Critical",
    action: "Create Purchase Request",
  },
  {
    id: "ALT-1003",
    item: "Basmati Rice",
    category: "COOK",
    currentStock: "35 kg",
    minimumStock: "50 kg",
    supplier: "FreshMart Supplies",
    alertType: "Low Stock",
    action: "Reorder Soon",
  },
  {
    id: "ALT-1004",
    item: "Laundry Detergent",
    category: "Housekeeping",
    currentStock: "22 liters",
    minimumStock: "40 liters",
    supplier: "CleanPro",
    alertType: "Low Stock",
    action: "Reorder Soon",
  },
  {
    id: "ALT-1005",
    item: "Fresh Milk",
    category: "COOK",
    currentStock: "16 liters",
    minimumStock: "20 liters",
    supplier: "Daily Dairy",
    alertType: "Expired Soon",
    action: "Use First",
  },
];

const departmentAlerts = [
  {
    label: "COOK",
    value: "3 alerts",
    percent: "60%",
  },
  {
    label: "Housekeeping",
    value: "2 alerts",
    percent: "40%",
  },
  {
    label: "Amenities",
    value: "2 alerts",
    percent: "40%",
  },
  {
    label: "Restaurant",
    value: "2 alerts",
    percent: "40%",
  },
];

function getAlertClass(type: string) {
  if (type === "Critical") {
    return "bg-red-100 text-red-700";
  }

  if (type === "Expired Soon") {
    return "bg-orange-100 text-orange-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

export default function InventoryAlertsPage() {
  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "INVENTORY"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Inventory Management
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Inventory Alerts
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View low stock alerts, critical stock warnings, expiry warnings,
                and reorder actions.
              </p>
            </div>

            <a
              href="/inventory"
              className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
            >
              Back to Inventory
            </a>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            {alertSummary.map((item) => (
              <StatCard
                key={item.label}
                label={item.label}
                value={item.value}
                note={item.note}
              />
            ))}
          </section>

          <section className="mb-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Alert Priority</h2>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <AlertCard
                  title="Critical Stock"
                  value="3 Items"
                  text="Stock is too low. Purchase request needed now."
                  type="critical"
                />

                <AlertCard
                  title="Low Stock"
                  value="5 Items"
                  text="Items are below reorder level."
                  type="warning"
                />

                <AlertCard
                  title="Expiry Warning"
                  value="1 Item"
                  text="Item should be used or replaced soon."
                  type="expiry"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Department Alerts</h2>

              <div className="mt-6 space-y-4">
                {departmentAlerts.map((item) => (
                  <BreakdownRow
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    percent={item.percent}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="mb-8 rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-4">
              <input
                type="text"
                placeholder="Search alert item..."
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
                <option>All Alert Types</option>
                <option>Critical</option>
                <option>Low Stock</option>
                <option>Expired Soon</option>
              </select>

              <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                Filter
              </button>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Active Inventory Alerts</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Items that need reorder, stock review, or expiry action.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Alert ID</th>
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Current Stock</th>
                    <th className="px-6 py-4">Minimum Stock</th>
                    <th className="px-6 py-4">Supplier</th>
                    <th className="px-6 py-4">Alert Type</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {inventoryAlerts.map((alert) => (
                    <tr key={alert.id} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{alert.id}</td>

                      <td className="px-6 py-5 font-semibold">{alert.item}</td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#735c00]">
                          {alert.category}
                        </span>
                      </td>

                      <td className="px-6 py-5 font-bold text-red-700">
                        {alert.currentStock}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {alert.minimumStock}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {alert.supplier}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getAlertClass(
                            alert.alertType
                          )}`}
                        >
                          {alert.alertType}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button className="rounded-lg border border-[#735c00] px-4 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white">
                          {alert.action}
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

      <p className="mt-2 text-3xl font-extrabold text-[#735c00]">{value}</p>

      <p className="mt-2 text-sm text-[#4d4635]">{note}</p>
    </div>
  );
}

function AlertCard({
  title,
  value,
  text,
  type,
}: {
  title: string;
  value: string;
  text: string;
  type: "critical" | "warning" | "expiry";
}) {
  const styles = {
    critical: "border-red-200 bg-red-50 text-red-700",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-700",
    expiry: "border-orange-200 bg-orange-50 text-orange-700",
  };

  return (
    <div className={`rounded-xl border p-5 ${styles[type]}`}>
      <p className="text-sm font-bold uppercase tracking-widest">{title}</p>
      <p className="mt-2 text-2xl font-extrabold">{value}</p>
      <p className="mt-2 text-sm">{text}</p>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  percent,
}: {
  label: string;
  value: string;
  percent: string;
}) {
  return (
    <div className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
      <div className="flex items-center justify-between">
        <p className="font-bold">{label}</p>
        <p className="font-bold text-[#735c00]">{value}</p>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full bg-[#735c00]"
          style={{ width: percent }}
        />
      </div>

      <p className="mt-2 text-sm text-[#4d4635]">{percent}</p>
    </div>
  );
}
