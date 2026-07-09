"use client";
import { useSearchParams } from "next/navigation";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getById as getFolioById, update as updateFolio } from "@/lib/api/folioApi";
import { getPricingItemsByCategory } from "@/lib/api/pricingApi";

export default function FolioDetailsPage() {
  const searchParams = useSearchParams();
  const rawId = searchParams.get("id");
  const id = rawId as string;
  const router = useRouter();

  const [folio, setFolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [amenityItems, setAmenityItems] = useState<any[]>([]);
  const [showAmenityPanel, setShowAmenityPanel] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [folioData, amenities] = await Promise.all([
          getFolioById(id),
          getPricingItemsByCategory("Amenity"),
        ]);
        setFolio(folioData);
        setAmenityItems(amenities || []);
      } catch (err: any) {
        setError(err.message || "Failed to load folio");
      } finally {
        setLoading(false);
      }
    }
    if (id) loadData();
  }, [id]);

  const addAmenityCharge = async (amenity: any) => {
    if (!folio) return;
    const newLine = {
      description: amenity.name,
      amount: amenity.price,
      date: new Date().toISOString().split("T")[0],
      category: "Amenity",
    };
    const updatedLines = [...(folio.lines || []), newLine];
    const updatedTotal = updatedLines.reduce((acc: number, l: any) => acc + (l.amount || 0), 0);
    try {
      const updated = await updateFolio(id, { ...folio, lines: updatedLines, totalAmount: updatedTotal });
      setFolio(updated);
      setShowAmenityPanel(false);
    } catch {
      alert("Failed to add amenity charge");
    }
  };

  const folioLines = folio?.lines || [];
  const totalAmount = folio?.totalAmount || folioLines.reduce((acc: number, l: any) => acc + (l.amount || 0), 0);

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "RECEPTIONIST"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Guest Folio
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Folio Details
              </h1>

              <p className="mt-2 text-[#4d4635]">
                View guest charges, room service, restaurant bills, parking
                charges, and payment status.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowAmenityPanel(true)}
                className="rounded-xl border border-[#d4af37] bg-[#d4af37]/10 px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#d4af37]/20"
              >
                + Add Amenity
              </button>
              <button
                onClick={() => router.push("/folio")}
                className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
              >
                Back to Folio
              </button>

              <button
                onClick={() => router.push(`/checkout/detail?id=${id}`)}
                className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
              >
                Checkout
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center text-lg text-[#806300]">Loading...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <>
              <section className="mb-8 grid gap-6 md:grid-cols-4">
                <StatCard label="Folio ID" value={folio?.id?.substring(0, 8) || "N/A"} />
                <StatCard label="Guest" value={folio?.guestName || "N/A"} />
                <StatCard label="Room" value={folio?.roomNumber || "N/A"} />
                <StatCard label="Status" value={folio?.status || "Open"} />
              </section>

              <section className="mb-8 grid gap-8 xl:grid-cols-[1fr_1fr]">
                <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-bold">Guest Information</h2>
                  <div className="mt-6 space-y-4">
                    <InfoRow label="Guest Name" value={folio?.guestName || "N/A"} />
                    <InfoRow label="Room Number" value={folio?.roomNumber || "N/A"} />
                    <InfoRow label="Reservation ID" value={folio?.reservationId || "N/A"} />
                  </div>
                </div>

                <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-bold">Folio Summary</h2>
                  <div className="mt-6 space-y-4">
                    <InfoRow label="Total Charges" value={`Rs ${totalAmount.toLocaleString()}`} />
                    <InfoRow label="Line Items" value={`${folioLines.length} items`} />
                  </div>

                  <div className="mt-6 rounded-xl bg-[#735c00] p-5 text-white">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold">Total Amount</p>
                      <p className="text-2xl font-extrabold">Rs {totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8 overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
                <div className="border-b border-[#d0c5af] p-6">
                  <h2 className="text-2xl font-bold">Folio Charges</h2>
                  <p className="mt-1 text-sm text-[#4d4635]">
                    All charges added to this guest folio.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left">
                    <thead>
                      <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                        <th className="px-6 py-4">#</th>
                        <th className="px-6 py-4">Description</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-right">Amount</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#d0c5af]">
                      {folioLines.length === 0 ? (
                        <tr><td colSpan={5} className="p-6 text-center text-[#4d4635]">No charges yet.</td></tr>
                      ) : (
                        folioLines.map((item: any, idx: number) => (
                          <tr key={idx} className="transition hover:bg-[#fbf9f5]">
                            <td className="px-6 py-5 font-bold">{idx + 1}</td>
                            <td className="px-6 py-5 font-semibold">{item.description}</td>
                            <td className="px-6 py-5">
                              <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#735c00]">
                                {item.category || "General"}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-[#4d4635]">{item.date}</td>
                            <td className="px-6 py-5 text-right font-bold text-[#735c00]">
                              Rs {(item.amount || 0).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {/* Amenity Add Panel */}
          {showAmenityPanel && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl border border-[#d0c5af] bg-white p-8 shadow-2xl">
                <h2 className="mb-6 text-2xl font-bold text-[#735c00]">Add Amenity Charge</h2>
                {amenityItems.length === 0 ? (
                  <p className="text-gray-500">No amenity pricing items found. Add items under the &quot;Amenity&quot; category in Service Pricing.</p>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {amenityItems.map((item: any) => (
                      <button
                        key={item.id}
                        onClick={() => addAmenityCharge(item)}
                        className="flex w-full items-center justify-between rounded-xl border border-[#d0c5af] bg-[#fbf9f5] p-4 transition hover:bg-[#f5eed9]"
                      >
                        <span className="font-bold">{item.name}</span>
                        <span className="font-bold text-[#735c00]">Rs {item.price}</span>
                      </button>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => setShowAmenityPanel(false)}
                  className="mt-6 w-full rounded-xl border border-[#d0c5af] py-3 font-bold text-[#4d4635] transition hover:bg-[#f5f3ef]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#f5f3ef] p-4">
      <p className="font-bold text-[#4d4635]">{label}</p>
      <p className="font-bold text-[#735c00]">{value}</p>
    </div>
  );
}
