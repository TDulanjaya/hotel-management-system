import AppSidebar from "@/components/layout/AppSidebar";
import {
  Search,
  Bell,
  Printer,
  CreditCard,
  PlusCircle,
  GitBranch,
  Link2,
  ChevronRight,
} from "lucide-react";

const billingItems = [
  {
    description: "Grand Ballroom Rental (Full Day)",
    date: "Oct 12, 2024",
    category: "Venue Rental",
    amount: "$12,000.00",
    style: "bg-blue-100 text-blue-800",
  },
  {
    description: "Gala Dinner - 450 Covers",
    date: "Oct 12, 2024",
    category: "Catering",
    amount: "$67,500.00",
    style: "bg-orange-100 text-orange-800",
  },
  {
    description: "Group Room Block (120 Rooms x 3 Nights)",
    date: "Oct 10-13, 2024",
    category: "Room Blocks",
    amount: "$48,600.00",
    style: "bg-purple-100 text-purple-800",
  },
  {
    description: "Valet Parking Vouchers (200 Units)",
    date: "Oct 12, 2024",
    category: "Parking",
    amount: "$8,000.00",
    style: "bg-green-100 text-green-800",
  },
  {
    description: "Standard Service Charge (12.5%)",
    date: "Oct 13, 2024",
    category: "Service Fees",
    amount: "$6,480.00",
    style: "bg-gray-100 text-gray-800",
  },
];

const linkedFolios = [
  {
    initials: "JD",
    name: "Julianne Davies",
    room: "Room 402 • Deluxe King",
    amount: "$1,420.50",
    bg: "bg-[#d4af37]",
    text: "text-white",
  },
  {
    initials: "MK",
    name: "Marcus Kane",
    room: "Room 512 • Presidential Suite",
    amount: "$4,105.00",
    bg: "bg-[#dae2fd]",
    text: "text-[#565e74]",
  },
  {
    initials: "SR",
    name: "Sarah Redford",
    room: "Room 305 • Executive Room",
    amount: "$980.20",
    bg: "bg-[#a8b3ca]",
    text: "text-white",
  },
];

export default function EventLedgerPage() {
  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
      <AppSidebar />

      <main className="min-h-screen lg:ml-[280px]">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#d0c5af] bg-[#fbf9f5] px-8 shadow-sm">
          <div className="flex w-96 items-center gap-4 rounded-full border border-[#d0c5af] bg-[#efeeea] px-4 py-2">
            <Search size={20} className="text-[#4d4635]" />
            <input
              type="text"
              placeholder="Search ledgers, groups, or folios..."
              className="w-full border-none bg-transparent text-sm outline-none"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative rounded-full p-2 text-[#4d4635] transition hover:bg-[#eae8e4]">
              <Bell size={22} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#ba1a1a]" />
            </button>

            <div className="flex items-center gap-3 border-l border-[#d0c5af] pl-4">
              <div className="hidden text-right md:block">
                <p className="text-sm font-bold">Alex Rivera</p>
                <p className="text-[10px] font-bold uppercase tracking-tight text-[#4d4635]">
                  Event Manager
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#d4af37] bg-[#131b2e] font-bold text-[#ffe088]">
                AR
              </div>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-[1600px] p-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div>
              <nav className="mb-2 flex items-center gap-2 text-sm text-[#4d4635]">
                <span>Events Control</span>
                <ChevronRight size={14} />
                <span className="font-bold text-[#735c00]">Master Ledger</span>
              </nav>

              <h1 className="mb-2 text-4xl font-bold">
                Annual Global Tech Summit 2024
              </h1>

              <div className="flex flex-wrap items-center gap-4">
                <span className="rounded-full border border-[#d4af37]/40 bg-[#d4af37]/20 px-3 py-1 text-sm font-bold text-[#735c00]">
                  GROUP: GTS-2024-X
                </span>

                <span className="rounded-full border border-[#dae2fd]/40 bg-[#dae2fd]/30 px-3 py-1 text-sm font-bold text-[#565e74]">
                  STATUS: OPEN
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 rounded-lg border-2 border-[#565e74] px-6 py-3 text-sm font-bold text-[#565e74] transition hover:bg-[#565e74]/5">
                <Printer size={20} />
                Print Event Invoice
              </button>

              <button className="flex items-center gap-2 rounded-lg bg-[#735c00] px-6 py-3 text-sm font-bold text-white transition hover:shadow-xl">
                <CreditCard size={20} />
                Settle Event Bill
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <section className="relative col-span-12 overflow-hidden rounded-xl border border-[#d0c5af] bg-white shadow-sm lg:col-span-4">
              <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#d4af37]" />

              <div className="border-b border-[#d0c5af]/40 p-6">
                <h2 className="text-xl font-semibold">Organizer Information</h2>
              </div>

              <div className="space-y-4 p-6 text-sm">
                <InfoRow label="Primary Contact" value="Ms. Helena Thorne" />
                <InfoRow label="Company" value="Nova Dynamics Corp" />
                <InfoRow
                  label="Billing Email"
                  value="h.thorne@novadynamics.com"
                />
                <InfoRow label="Phone" value="+1 (555) 942-0192" />
              </div>
            </section>

            <section className="col-span-12 flex flex-col items-center justify-between gap-6 rounded-xl border border-[#d0c5af] bg-white p-8 shadow-sm md:flex-row lg:col-span-8">
              <SummaryCard label="Total Charges" value="$142,580.00" />
              <SummaryCard
                label="Deposits Paid"
                value="$45,000.00"
                color="text-[#735c00]"
              />
              <SummaryCard
                label="Balance Due"
                value="$97,580.00"
                color="text-[#ba1a1a]"
                last
              />
            </section>

            <section className="col-span-12 overflow-hidden rounded-xl border border-[#d0c5af] bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-[#d0c5af] bg-[#f5f3ef] p-6">
                <h2 className="text-xl font-semibold">
                  Itemized Billing Ledger
                </h2>

                <button className="flex items-center gap-1 text-sm font-bold text-[#735c00] hover:underline">
                  <PlusCircle size={20} />
                  Add Manual Charge
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#d0c5af] bg-[#eae8e4] text-sm text-[#4d4635]">
                      <th className="px-8 py-4 font-bold">Description</th>
                      <th className="px-8 py-4 font-bold">Date</th>
                      <th className="px-8 py-4 font-bold">Category</th>
                      <th className="px-8 py-4 text-right font-bold">Amount</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#d0c5af]/50">
                    {billingItems.map((item) => (
                      <tr
                        key={item.description}
                        className="transition hover:bg-[#f5f3ef]"
                      >
                        <td className="px-8 py-5 font-medium">
                          {item.description}
                        </td>
                        <td className="px-8 py-5 text-sm text-[#4d4635]">
                          {item.date}
                        </td>
                        <td className="px-8 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${item.style}`}
                          >
                            {item.category}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right text-lg font-semibold">
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
                        $142,580.00
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>

            <section className="col-span-12 overflow-hidden rounded-xl border border-[#d0c5af] bg-white shadow-sm lg:col-span-5">
              <div className="flex items-center gap-3 border-b border-[#d0c5af]/40 p-6">
                <GitBranch size={22} className="text-[#735c00]" />
                <h2 className="text-xl font-semibold">Split Billing Rules</h2>
              </div>

              <div className="space-y-6 p-6">
                <RuleCard
                  checked
                  title="Auto-Bill Rooms to Master"
                  description="Room & Tax only; incidentals billed to individual."
                />

                <RuleCard
                  title="Bill Incidentals to Master"
                  description="Minibar, Room Service, and Amenities charges."
                />

                <div className="space-y-3">
                  <p className="px-1 text-sm font-bold text-[#4d4635]">
                    Override Discount (%)
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      defaultValue="15"
                      className="flex-1 rounded-lg border border-[#d0c5af] p-3 outline-none focus:ring-2 focus:ring-[#d4af37]/40"
                    />

                    <button className="rounded-lg bg-[#565e74] px-4 font-bold text-white">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="col-span-12 overflow-hidden rounded-xl border border-[#d0c5af] bg-white shadow-sm lg:col-span-7">
              <div className="flex items-center justify-between border-b border-[#d0c5af]/40 p-6">
                <div className="flex items-center gap-3">
                  <Link2 size={22} className="text-[#735c00]" />
                  <h2 className="text-xl font-semibold">Linked Guest Folios</h2>
                </div>

                <span className="text-xs font-bold text-[#4d4635]">
                  120 TOTAL GUESTS
                </span>
              </div>

              <div className="p-6">
                <div className="max-h-[320px] space-y-4 overflow-y-auto pr-2">
                  {linkedFolios.map((folio, index) => (
                    <div
                      key={folio.name}
                      className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition hover:border-[#735c00]/50 ${
                        index === 0
                          ? "border-transparent bg-[#f5f3ef]"
                          : "border-[#d0c5af]/40 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${folio.bg} ${folio.text}`}
                        >
                          {folio.initials}
                        </div>

                        <div>
                          <p className="text-sm font-bold">{folio.name}</p>
                          <p className="text-sm text-[#4d4635]">
                            {folio.room}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-bold">{folio.amount}</p>
                        <p className="text-[10px] font-bold uppercase text-[#735c00]">
                          Billed to Master
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-6 w-full rounded-lg border border-[#565e74] py-3 text-sm font-bold text-[#565e74] transition hover:bg-[#565e74]/5">
                  View All Linked Folios (120)
                </button>
              </div>
            </section>
          </div>

          <footer className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#d0c5af]/40 pt-12 text-[#4d4635] md:flex-row">
            <p className="text-sm">
              © 2024 LuxeStay Elite Operations System. All transactions
              encrypted and audited.
            </p>

            <div className="flex gap-8">
              <a className="text-xs font-bold uppercase tracking-wider hover:text-[#735c00]">
                Audit Log
              </a>
              <a className="text-xs font-bold uppercase tracking-wider hover:text-[#735c00]">
                Contact Finance
              </a>
              <a className="text-xs font-bold uppercase tracking-wider hover:text-[#735c00]">
                System Status
              </a>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-bold text-[#4d4635]">{label}</span>
      <span className="text-right text-[#1b1c1a]">{value}</span>
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
      className={`flex-1 text-center ${
        last ? "" : "border-b border-[#d0c5af]/40 pb-6 md:border-b-0 md:border-r md:pb-0"
      }`}
    >
      <p className="mb-1 text-xs font-bold uppercase text-[#4d4635]">
        {label}
      </p>

      <p className={`text-4xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function RuleCard({
  checked = false,
  title,
  description,
}: {
  checked?: boolean;
  title: string;
  description: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${
        checked
          ? "border-[#d0c5af]/40 bg-[#f5f3ef]"
          : "border-[#d0c5af]/40 bg-white"
      }`}
    >
      <input
        type="checkbox"
        defaultChecked={checked}
        className="h-5 w-5 rounded text-[#735c00]"
      />

      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="text-sm text-[#4d4635]">{description}</p>
      </div>
    </label>
  );
}