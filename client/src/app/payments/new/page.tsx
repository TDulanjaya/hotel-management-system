import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function NewPaymentPage() {
  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "RECEPTIONIST"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
              Finance Operations
            </p>

            <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
              Add New Payment
            </h1>

            <p className="mt-2 text-[#4d4635]">
              Record a new guest payment, event payment, folio settlement, or
              room service payment.
            </p>
          </div>

          <form className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
            <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Payment Details</h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Guest / Event Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter guest or event name"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Payment Reference
                  </label>
                  <input
                    type="text"
                    placeholder="Reservation ID, Folio ID, Event ID"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Payment Module
                  </label>
                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Room Booking</option>
                    <option>Folio</option>
                    <option>Events</option>
                    <option>Restaurant</option>
                    <option>Room Service</option>
                    <option>Games & Amenities</option>
                    <option>Parking</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Payment Method
                  </label>
                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Cash</option>
                    <option>Card</option>
                    <option>Bank Transfer</option>
                    <option>Added to Folio</option>
                    <option>Online Payment</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Amount
                  </label>
                  <input
                    type="text"
                    placeholder="Rs 0.00"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Currency
                  </label>
                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>USD</option>
                    <option>LKR</option>
                    <option>EUR</option>
                    <option>GBP</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Payment Status
                  </label>
                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Completed</option>
                    <option>Pending</option>
                    <option>Failed</option>
                    <option>Refunded</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-[#4d4635]">
                    Notes
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Add payment note, receipt details, transaction number, or special instruction..."
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>
              </div>
            </section>

            <aside className="space-y-8">
              <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">Payment Summary</h2>

                <div className="mt-6 space-y-4">
                  <SummaryRow label="Subtotal" value="Rs 0.00" />
                  <SummaryRow label="Tax" value="Rs 0.00" />
                  <SummaryRow label="Service Charge" value="Rs 0.00" />
                  <SummaryRow label="Total Payment" value="Rs 0.00" highlight />
                </div>
              </section>

              <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">Payment Options</h2>

                <div className="mt-6 space-y-4">
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
                    <input type="checkbox" defaultChecked className="mt-1 h-5 w-5" />
                    <div>
                      <p className="font-bold">Generate receipt</p>
                      <p className="text-sm text-[#4d4635]">
                        Create a printable receipt after saving payment.
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
                    <input type="checkbox" className="mt-1 h-5 w-5" />
                    <div>
                      <p className="font-bold">Send receipt to guest</p>
                      <p className="text-sm text-[#4d4635]">
                        Email the payment receipt to guest email.
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
                    <input type="checkbox" defaultChecked className="mt-1 h-5 w-5" />
                    <div>
                      <p className="font-bold">Update folio balance</p>
                      <p className="text-sm text-[#4d4635]">
                        Automatically update related folio or reservation bill.
                      </p>
                    </div>
                  </label>
                </div>
              </section>

              <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">Security Note</h2>

                <p className="mt-3 text-sm leading-6 text-[#4d4635]">
                  All payment actions should be recorded in audit logs. Owner,
                  manager, and receptionist roles can add payments.
                </p>
              </section>

              <div className="flex gap-4">
                <a
                  href="/payments/list"
                  className="flex-1 rounded-xl border border-[#735c00] px-6 py-4 text-center font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
                >
                  Cancel
                </a>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#735c00] px-6 py-4 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
                >
                  Save Payment
                </button>
              </div>
            </aside>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function SummaryRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl p-4 ${
        highlight
          ? "bg-[#735c00] text-white"
          : "bg-[#f5f3ef] text-[#1b1c1a]"
      }`}
    >
      <span className="font-bold">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
