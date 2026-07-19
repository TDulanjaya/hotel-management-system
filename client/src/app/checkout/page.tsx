"use client";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getStatusBadgeClass } from "@/lib/utils/statusStyles";
import { useState, useEffect } from "react";
import { getDueCheckouts } from "@/lib/api/checkoutApi";

export default function CheckoutPage() {
  const router = useRouter();
  const [checkouts, setCheckouts] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getDueCheckouts();
        setCheckouts(data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const checkoutSummary = [
    { label: "Today Checkouts", value: checkouts.length.toString() },
    { label: "Ready", value: checkouts.filter(c => c.paymentStatus === "COMPLETED").length.toString() },
    { label: "Pending Payment", value: checkouts.filter(c => c.paymentStatus !== "COMPLETED").length.toString() },
    { label: "Completed", value: "0" } // Not applicable since they vanish when checked out
  ];

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "RECEPTIONIST"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Guest Checkout
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Checkout
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Manage guest checkout, final bills, room charges, service
                charges, and payment status.
              </p>
            </div>

            <button
              onClick={() => router.push("/folio")}
              className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
            >
              Go to Folio
            </button>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            {checkoutSummary.map((item) => (
              <StatCard key={item.label} label={item.label} value={item.value} />
            ))}
          </section>

          <section className="mb-8 rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-4">
              <input
                type="text"
                placeholder="Search guest or room..."
                className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              />

              <input
                type="date"
                className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              />

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>All Status</option>
                <option>Ready</option>
                <option>Pending Payment</option>
                <option>Completed</option>
              </select>

              <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                Filter
              </button>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Checkout List</h2>

              <p className="mt-1 text-sm text-[#4d4635]">
                Guests scheduled for checkout today.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Checkout ID</th>
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Room</th>
                    <th className="px-6 py-4">Room Type</th>
                    <th className="px-6 py-4">Check In</th>
                    <th className="px-6 py-4">Check Out</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Total</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {checkouts.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-10 text-center text-[#4d4635]">
                        <p className="text-lg font-bold">No due checkouts today</p>
                      </td>
                    </tr>
                  ) : (
                    checkouts.map((checkout) => (
                      <tr
                        key={checkout.id}
                        className="transition hover:bg-[#fbf9f5]"
                      >
                        <td className="px-6 py-5 font-bold">{checkout.id?.substring(0,8)}</td>

                        <td className="px-6 py-5 font-semibold">
                          {checkout.guestName}
                        </td>

                        <td className="px-6 py-5">
                          <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#735c00]">
                            Room {checkout.roomNumber}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-[#4d4635]">
                          -
                        </td>

                        <td className="px-6 py-5 text-[#4d4635]">
                          {checkout.checkIn}
                        </td>

                        <td className="px-6 py-5 text-[#4d4635]">
                          {checkout.checkOut}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusBadgeClass(
                              checkout.paymentStatus === "COMPLETED" ? "Ready" : "Pending Payment"
                            )}`}
                          >
                            {checkout.paymentStatus === "COMPLETED" ? "Ready" : "Pending Payment"}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-right font-bold text-[#735c00]">
                          Rs {checkout.totalAmount?.toFixed(2)}
                        </td>

                        <td className="px-6 py-5 text-right">
                          <button
                            onClick={() => router.push(`/checkout/detail?id=${checkout.id}`)}
                            className="rounded-lg border border-[#735c00] px-4 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
                          >
                            Process
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
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
