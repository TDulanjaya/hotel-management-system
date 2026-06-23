"use client";

import { useParams, useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function EditInventoryItemPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params?.id as string;

  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "inventory"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Inventory Management
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Edit Inventory Item
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Update item details, stock level, reorder quantity, supplier,
                and inventory status.
              </p>
            </div>

            <button
              onClick={() => router.push("/inventory")}
              className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
            >
              Back to Inventory
            </button>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard label="Item ID" value={itemId || "N/A"} />
            <StatCard label="Category" value="Kitchen" />
            <StatCard label="Current Stock" value="35 kg" />
            <StatCard label="Status" value="Low Stock" />
          </section>

          <section className="grid gap-8 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Item Details</h2>

              <div className="mt-6 space-y-5">
                <InputField label="Item Name" defaultValue="Basmati Rice" />

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Category
                  </label>

                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Kitchen</option>
                    <option>Restaurant</option>
                    <option>Housekeeping</option>
                    <option>Amenities</option>
                    <option>Maintenance</option>
                  </select>
                </div>

                <InputField label="Unit" defaultValue="kg" />

                <InputField label="Supplier" defaultValue="FreshMart Supplies" />

                <InputField label="Storage Location" defaultValue="Kitchen Store A" />
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Stock Control</h2>

              <div className="mt-6 space-y-5">
                <InputField label="Current Stock" type="number" defaultValue="35" />

                <InputField label="Minimum Stock" type="number" defaultValue="50" />

                <InputField label="Reorder Quantity" type="number" defaultValue="100" />

                <InputField label="Unit Cost" defaultValue="Rs 4.20" />

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Stock Status
                  </label>

                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Low Stock</option>
                    <option>In Stock</option>
                    <option>Critical</option>
                    <option>Out of Stock</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm xl:col-span-2">
              <h2 className="text-2xl font-bold">Notes</h2>

              <textarea
                defaultValue="Stock is below reorder level. Create purchase request if stock drops further."
                rows={5}
                className="mt-6 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              />

              <div className="mt-6 flex flex-wrap gap-4">
                <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                  Save Changes
                </button>

                <button
                  onClick={() => router.push("/inventory")}
                  className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
                >
                  Cancel
                </button>
              </div>
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

      <p className="mt-2 text-2xl font-extrabold text-[#735c00]">{value}</p>
    </div>
  );
}

function InputField({
  label,
  defaultValue,
  type = "text",
}: {
  label: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-[#4d4635]">{label}</label>

      <input
        type={type}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
      />
    </div>
  );
}
