import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const billingItems = [
  {
    description: "Grand Ballroom Rental (Full Day)",
    date: "Oct 12, 2024",
    category: "Venue Rental",
    amount: "Rs 12,000.00",
    style: "bg-blue-100 text-blue-800",
  },
  {
    description: "Gala Dinner - 450 Covers",
    date: "Oct 12, 2024",
    category: "Catering",
    amount: "Rs 67,500.00",
    style: "bg-orange-100 text-orange-800",
  },
  {
    description: "Group Room Block (120 Rooms x 3 Nights)",
    date: "Oct 10-13, 2024",
    category: "Room Blocks",
    amount: "Rs 48,600.00",
    style: "bg-purple-100 text-purple-800",
  },
  {
    description: "Valet Parking Vouchers (200 Units)",
    date: "Oct 12, 2024",
    category: "Parking",
    amount: "Rs 8,000.00",
    style: "bg-green-100 text-green-800",
  },
  {
    description: "Standard Service Charge (12.5%)",
    date: "Oct 13, 2024",
    category: "Service Fees",
    amount: "Rs 6,480.00",
    style: "bg-gray-100 text-gray-800",
  },
];

const linkedFolios = [
  {
    initials: "JD",
    name: "Julianne Davies",
    room: "Room 402 • Deluxe King",
    amount: "Rs 1,420.50",
    active: true,
  },
  {
    initials: "MK",
    name: "Marcus Kane",
    room: "Room 512 • Presidential Suite",
    amount: "Rs 4,105.00",
    active: false,
  },
  {
    initials: "SR",
    name: "Sarah Redford",
    room: "Room 305 • Executive Room",
    amount: "Rs 980.20",
    active: false,
  },
];

export default function EventLedgerPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "events"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="min-h-screen px-8 py-10 lg:ml-[280px]">
          <header className="mb-10 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-[#4d4635]">
                <span>Events Control</span>
                <span>›</span>
                <span className="font-bold text-[#735c00]">Master Ledger</span>
              </div>

              <h1 className="text-4xl font-extrabold">
                Annual Global Tech Summit 2024
              </h1>

              <div className="mt-4 flex flex-wrap gap-3">
                <span className="rounded-full border border-[#d4af37]/40 bg-[#d4af37]/20 px-4 py-2 text-sm font-bold text-[#735c00]">
                  GROUP: GTS-2024-X
                </span>

                <span className="rounded-full border border-[#dae2fd] bg-[#dae2fd]/50 px-4 py-2 text-sm font-bold text-[#565e74]">
                  STATUS: OPEN
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="rounded-xl border-2 border-[#565e74] px-6 py-3 font-bold text-[#565e74] transition hover:bg-[#565e74]/5">
                Print Event Invoice
              </button>

              <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                Settle Event Bill
              </button>
            </div>
          </header>

          <section className="grid grid-cols-12 gap-6">
            <section className="relative col-span-12 overflow-hidden rounded-xl border border-[#d0c5af] bg-white shadow-sm lg:col-span-4">
              <div className="absolute left-0 top-0 h-full w-1 bg-[#d4af37]" />

              <div className="border-b border-[#d0c5af]/50 p-6">
                <h2 className="text-xl font-bold">Organizer Information</h2>
              </div>

              <div className="space-y-4 p-6">
                <InfoRow label="Primary Contact" value="Ms. Helena Thorne" />
                <InfoRow label="Company" value="Nova Dynamics Corp" />
                <InfoRow
                  label="Billing Email"
                  value="h.thorne@novadynamics.com"
                />
                <InfoRow label="Phone" value="+1 (555) 942-0192" />
              </div>
            </section>

            <section className="col-span-12 grid rounded-xl border border-[#d0c5af] bg-white p-8 shadow-sm md:grid-cols-3 lg:col-span-8">
              <SummaryCard label="Total Charges" value="Rs 142,580.00" />
              <SummaryCard
                label="Deposits Paid"
                value="Rs 45,000.00"
                color="text-[#735c00]"
              />
              <SummaryCard
                label="Balance Due"
                value="Rs 97,580.00"
                color="text-[#ba1a1a]"
                last
              />
            </section>

            <section className="col-span-12 overflow-hidden rounded-xl border border-[#d0c5af] bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-4 border-b border-[#d0c5af] bg-[#f5f3ef] p-6 md:flex-row md:items-center">
                <h2 className="text-xl font-bold">Itemized Billing Ledger</h2>

                <button className="font-bold text-[#735c00] hover:underline">
                  + Add Manual Charge
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left">
                  <thead>
                    <tr className="border-b border-[#d0c5af] bg-[#eae8e4] text-sm uppercase tracking-wider text-[#4d4635]">
                      <th className="px-8 py-4">Description</th>
                      <th className="px-8 py-4">Date</th>
                      <th className="px-8 py-4">Category</th>
                      <th className="px-8 py-4 text-right">Amount</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#d0c5af]/50">
                    {billingItems.map((item) => (
                      <tr key={item.description} className="hover:bg-[#f5f3ef]">
                        <td className="px-8 py-5 font-semibold">
                          {item.description}
                        </td>

                        <td className="px-8 py-5 text-[#4d4635]">
                          {item.date}
                        </td>

                        <td className="px-8 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${item.style}`}
                          >
                            {item.category}
                          </span>
                        </td>

                        <td className="px-8 py-5 text-right text-lg font-bold">
                          {item.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr className="bg-white font-bold">
                      <td className="px-8 py-6 text-right text-xl" colSpan={3}>
                        Total Gross Charges
                      </td>

                      <td className="px-8 py-6 text-right text-xl text-[#735c00]">
                        Rs 142,580.00
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>

            <section className="col-span-12 overflow-hidden rounded-xl border border-[#d0c5af] bg-white shadow-sm lg:col-span-5">
              <div className="flex items-center gap-3 border-b border-[#d0c5af]/50 p-6">
                <span className="text-2xl text-[#735c00]">⤨</span>
                <h2 className="text-xl font-bold">Split Billing Rules</h2>
              </div>

              <div className="space-y-6 p-6">
                <BillingRule
                  checked
                  title="Auto-Bill Rooms to Master"
                  text="Room & Tax only; incidentals billed to individual."
                />

                <BillingRule
                  title="Bill Incidentals to Master"
                  text="Minibar, Room Service, and Amenities charges."
                />

                <div className="space-y-3">
                  <p className="font-bold text-[#4d4635]">
                    Override Discount (%)
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      defaultValue={15}
                      className="flex-1 rounded-lg border border-[#d0c5af] p-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                    />

                    <button className="rounded-lg bg-[#565e74] px-5 font-bold text-white">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="col-span-12 overflow-hidden rounded-xl border border-[#d0c5af] bg-white shadow-sm lg:col-span-7">
              <div className="flex items-center justify-between border-b border-[#d0c5af]/50 p-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-[#735c00]">🔗</span>
                  <h2 className="text-xl font-bold">Linked Guest Folios</h2>
                </div>

                <span className="text-xs font-bold uppercase text-[#4d4635]">
                  120 Total Guests
                </span>
              </div>

              <div className="p-6">
                <div className="max-h-[320px] space-y-4 overflow-y-auto pr-2">
                  {linkedFolios.map((folio) => (
                    <div
                      key={folio.name}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition hover:border-[#735c00]/50 ${
                        folio.active
                          ? "border-transparent bg-[#f5f3ef]"
                          : "border-[#d0c5af]/50 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                            folio.active
                              ? "bg-[#d4af37] text-white"
                              : "bg-[#dae2fd] text-[#565e74]"
                          }`}
                        >
                          {folio.initials}
                        </div>

                        <div>
                          <p className="font-bold">{folio.name}</p>
                          <p className="text-sm text-[#4d4635]">
                            {folio.room}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold">{folio.amount}</p>
                        <p className="text-[10px] font-bold uppercase text-[#735c00]">
                          Billed to Master
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-6 w-full rounded-xl border border-[#565e74] py-3 font-bold text-[#565e74] transition hover:bg-[#565e74]/5">
                  View All Linked Folios (120)
                </button>
              </div>
            </section>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-bold text-[#4d4635]">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color = "text-[#1b1c1a]",
  last = false,
}: {
  label: string;
  value: string;
  color?: string;
  last?: boolean;
}) {
  return (
    <div
      className={`text-center ${
        !last
          ? "border-b border-[#d0c5af]/50 pb-6 md:border-b-0 md:border-r md:pb-0"
          : "pt-6 md:pt-0"
      }`}
    >
      <p className="text-sm font-bold uppercase tracking-widest text-[#4d4635]">
        {label}
      </p>

      <p className={`mt-2 text-4xl font-extrabold ${color}`}>{value}</p>
    </div>
  );
}

function BillingRule({
  checked = false,
  title,
  text,
}: {
  checked?: boolean;
  title: string;
  text: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#d0c5af]/50 bg-[#f5f3ef] p-4">
      <input
        type="checkbox"
        defaultChecked={checked}
        className="mt-1 h-5 w-5 rounded text-[#735c00]"
      />

      <div>
        <p className="font-bold">{title}</p>
        <p className="text-sm text-[#4d4635]">{text}</p>
      </div>
    </label>
  );
}