import AppSidebar from "@/components/layout/AppSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const folios = [
  {
    id: "FOL-1001",
    guest: "Mr. Alexander Thorne",
    room: "Room 215",
    roomCharge: "$840.00",
    foodCharge: "$120.00",
    serviceCharge: "$45.00",
    total: "$1,005.00",
    status: "Open",
  },
  {
    id: "FOL-1002",
    guest: "Ms. Helena Thorne",
    room: "Room 308",
    roomCharge: "$900.00",
    foodCharge: "$85.00",
    serviceCharge: "$35.00",
    total: "$1,020.00",
    status: "Pending",
  },
  {
    id: "FOL-1003",
    guest: "Mr. Marcus Kane",
    room: "Suite 402",
    roomCharge: "$3,750.00",
    foodCharge: "$420.00",
    serviceCharge: "$180.00",
    total: "$4,350.00",
    status: "Paid",
  },
];

function getStatusClass(status: string) {
  if (status === "Paid") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Open") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

export default function FolioPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "receptionist"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Front Office Module
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Folio / Billing
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Manage guest folios, room charges, service charges, food bills,
                and final settlement.
              </p>
            </div>

            <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
              + New Folio
            </button>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard label="Open Folios" value="1" />
            <StatCard label="Pending Bills" value="1" />
            <StatCard label="Paid Folios" value="1" />
            <StatCard label="Total Revenue" value="$6,375" />
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Guest Folio Records</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                View and manage guest billing details.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Folio ID</th>
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Room</th>
                    <th className="px-6 py-4 text-right">Room Charge</th>
                    <th className="px-6 py-4 text-right">Food Charge</th>
                    <th className="px-6 py-4 text-right">Service Charge</th>
                    <th className="px-6 py-4 text-right">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {folios.map((folio) => (
                    <tr key={folio.id} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{folio.id}</td>

                      <td className="px-6 py-5 font-semibold">
                        {folio.guest}
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {folio.room}
                      </td>

                      <td className="px-6 py-5 text-right">
                        {folio.roomCharge}
                      </td>

                      <td className="px-6 py-5 text-right">
                        {folio.foodCharge}
                      </td>

                      <td className="px-6 py-5 text-right">
                        {folio.serviceCharge}
                      </td>

                      <td className="px-6 py-5 text-right font-bold text-[#735c00]">
                        {folio.total}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            folio.status
                          )}`}
                        >
                          {folio.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button className="rounded-lg border border-[#735c00] px-4 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white">
                          View Bill
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-3">
            <BillingCard
              title="Room Charges"
              amount="$5,490.00"
              text="Room stay charges from active and completed bookings."
            />

            <BillingCard
              title="Food & Beverage"
              amount="$625.00"
              text="Restaurant, room service, minibar, and kitchen orders."
            />

            <BillingCard
              title="Service Charges"
              amount="$260.00"
              text="Cleaning, laundry, extra services, and hotel fees."
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

function BillingCard({
  title,
  amount,
  text,
}: {
  title: string;
  amount: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-[#735c00]">{title}</h3>

      <p className="mt-3 text-3xl font-extrabold">{amount}</p>

      <p className="mt-2 text-sm text-[#4d4635]">{text}</p>
    </div>
  );
}