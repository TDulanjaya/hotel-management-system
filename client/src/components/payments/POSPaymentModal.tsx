"use client";

import React, { useState } from "react";
import { createPayment } from "@/lib/api/paymentsApi";
import { CheckCircle2, CreditCard, DollarSign, Printer, QrCode, X, Receipt, Building2 } from "lucide-react";

export type POSPaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  sourceType: "PARKING_BOOKING" | "GAME_SESSION" | "RESTAURANT_ORDER" | "EVENT_BILL" | "DIRECT_BILL";
  sourceId: string;
  customerName?: string;
  customerType?: string;
  roomNumber?: string;
  serviceDescription?: string;
  totalAmount: number;
  onPaymentSuccess: (payment: any) => void;
};

export default function POSPaymentModal({
  isOpen,
  onClose,
  title = "Bill Settlement & Payment Collection",
  sourceType,
  sourceId,
  customerName = "Walk-in Guest",
  customerType = "WALK_IN",
  roomNumber,
  serviceDescription,
  totalAmount,
  onPaymentSuccess,
}: POSPaymentModalProps) {
  const [method, setMethod] = useState<string>("CASH");
  const [tenderedAmount, setTenderedAmount] = useState<number>(totalAmount);
  const [transactionRef, setTransactionRef] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [completedPayment, setCompletedPayment] = useState<any>(null);

  if (!isOpen) return null;

  const changeDue = Math.max(0, (Number(tenderedAmount) || 0) - totalAmount);

  const handleQuickCash = (extra: number) => {
    setTenderedAmount((prev) => (Number(prev) || 0) + extra);
  };

  const handleExactCash = () => {
    setTenderedAmount(totalAmount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (method === "CASH" && (Number(tenderedAmount) || 0) < totalAmount) {
      setError(`Tendered amount must be at least Rs ${totalAmount.toLocaleString()}`);
      return;
    }

    if (["CARD_TERMINAL", "BANK_TRANSFER", "CEFT", "LANKAQR", "ONLINE_PAYMENT"].includes(method) && !transactionRef.trim()) {
      setError("Please provide a transaction approval code or payment reference.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        amount: totalAmount,
        method,
        referenceType: sourceType,
        referenceId: sourceId,
        transactionReference: transactionRef.trim() || undefined,
        guestName: customerName,
        roomNumber: roomNumber || undefined,
        notes: notes.trim() || undefined,
      };

      const payment = await createPayment(payload);
      setCompletedPayment({
        ...payment,
        totalAmount,
        tenderedAmount: method === "CASH" ? tenderedAmount : totalAmount,
        changeDue: method === "CASH" ? changeDue : 0,
        customerName,
        customerType,
        roomNumber,
        serviceDescription,
        method,
        transactionRef,
      });
      onPaymentSuccess(payment);
    } catch (err: any) {
      setError(err.message || "Failed to process payment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#d0c5af]/60 bg-[#fbf9f5] px-6 py-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#735c00]">
              POS Direct Settlement
            </span>
            <h2 className="text-lg font-extrabold text-[#1b1c1a]">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        {completedPayment ? (
          /* Receipt Screen */
          <div className="p-6">
            <div className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 p-3 text-emerald-800">
              <CheckCircle2 size={22} className="text-emerald-600" />
              <span className="font-bold">Payment Settled Successfully</span>
            </div>

            {/* Printable Receipt Card */}
            <div
              id="printable-pos-receipt"
              className="rounded-xl border border-dashed border-[#d0c5af] bg-[#faf8f4] p-5 font-mono text-sm text-[#1b1c1a]"
            >
              <div className="border-b border-[#d0c5af]/60 pb-3 text-center">
                <h3 className="font-sans text-base font-extrabold text-[#735c00]">LUXESTAY HOTEL & SUITES</h3>
                <p className="text-xs text-[#565e74]">Official Guest Settlement Receipt</p>
                <p className="mt-1 text-[11px] text-gray-500">
                  {new Date().toLocaleString("en-LK", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>

              <div className="my-3 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Receipt Ref:</span>
                  <span className="font-bold">{completedPayment.id ? completedPayment.id.slice(-8).toUpperCase() : "REC-POS"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Customer:</span>
                  <span className="font-bold">{completedPayment.customerName}</span>
                </div>
                {completedPayment.roomNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Room:</span>
                    <span className="font-bold">Room {completedPayment.roomNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Description:</span>
                  <span className="font-bold">{completedPayment.serviceDescription || "Facility Service"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Method:</span>
                  <span className="font-bold">{completedPayment.method}</span>
                </div>
                {completedPayment.transactionRef && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Trans Ref:</span>
                    <span className="font-bold">{completedPayment.transactionRef}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-[#d0c5af]/60 pt-3">
                <div className="flex justify-between text-base font-bold text-[#735c00]">
                  <span>Total Amount Paid:</span>
                  <span>Rs {completedPayment.totalAmount.toLocaleString()}</span>
                </div>
                {completedPayment.method === "CASH" && (
                  <>
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>Cash Tendered:</span>
                      <span>Rs {Number(completedPayment.tenderedAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-emerald-700">
                      <span>Change Given:</span>
                      <span>Rs {Number(completedPayment.changeDue).toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-4 border-t border-dashed border-[#d0c5af] pt-2 text-center text-[10px] text-gray-500">
                Thank you for choosing LuxeStay. Have a pleasant day!
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handlePrint}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#735c00] bg-white py-3 text-sm font-bold text-[#735c00] hover:bg-[#735c00]/5"
              >
                <Printer size={16} />
                Print Receipt
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl bg-[#735c00] py-3 text-sm font-bold text-white hover:bg-[#d4af37] hover:text-[#241a00]"
              >
                Done / Finish
              </button>
            </div>
          </div>
        ) : (
          /* Payment Input Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700">
                {error}
              </div>
            )}

            {/* Bill Summary Banner */}
            <div className="flex items-center justify-between rounded-xl border border-[#d0c5af] bg-[#faf8f4] p-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#735c00]">
                  {customerName}
                </p>
                <p className="text-xs text-[#565e74]">
                  {serviceDescription || "Direct facility bill"}
                  {roomNumber ? ` • Room ${roomNumber}` : ""}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500">Amount Due</span>
                <p className="text-2xl font-extrabold text-[#735c00]">
                  Rs {totalAmount.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635] mb-2">
                Select Tender Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "CASH", label: "Cash", icon: DollarSign },
                  { id: "CARD_TERMINAL", label: "Card POS", icon: CreditCard },
                  { id: "LANKAQR", label: "LankaQR", icon: QrCode },
                  { id: "BANK_TRANSFER", label: "Bank Transfer", icon: Building2 },
                  { id: "ONLINE_PAYMENT", label: "Online Gateway", icon: Receipt },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = method === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMethod(item.id)}
                      className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-xs font-bold transition ${
                        isSelected
                          ? "border-[#735c00] bg-[#735c00] text-white shadow-sm"
                          : "border-[#d0c5af] bg-white text-[#4d4635] hover:bg-[#faf8f4]"
                      }`}
                    >
                      <Icon size={18} className="mb-1" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cash Calculator */}
            {method === "CASH" ? (
              <div className="rounded-xl border border-[#d0c5af] bg-[#faf8f4] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                    Cash Tendered (Rs)
                  </label>
                  <button
                    type="button"
                    onClick={handleExactCash}
                    className="text-xs font-bold text-[#735c00] underline"
                  >
                    Exact Amount
                  </button>
                </div>
                <input
                  type="number"
                  min={totalAmount}
                  step="10"
                  value={tenderedAmount}
                  onChange={(e) => setTenderedAmount(Number(e.target.value) || 0)}
                  className="w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-mono text-lg font-bold text-[#1b1c1a] focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                />
                <div className="flex gap-2">
                  {[500, 1000, 2000, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleQuickCash(amt)}
                      className="flex-1 rounded-lg border border-[#d0c5af] bg-white py-1.5 text-xs font-bold text-[#735c00] hover:bg-[#735c00]/5"
                    >
                      +{amt}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-[#d0c5af]/60 pt-2 text-sm">
                  <span className="font-bold text-[#4d4635]">Change to Return:</span>
                  <span className="text-lg font-extrabold text-emerald-700 font-mono">
                    Rs {changeDue.toLocaleString()}
                  </span>
                </div>
              </div>
            ) : (
              /* Reference Number */
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635] mb-1">
                  Transaction Approval Code / Slip Reference *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. POS-AUTH-98421 or LankaQR Ref"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                />
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635] mb-1">
                Settlement Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Paid at exit boom barrier"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-[#d0c5af] bg-white p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#735c00]"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-[#d0c5af] py-3 text-sm font-bold text-[#565e74] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-xl bg-[#735c00] py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#d4af37] hover:text-[#241a00] disabled:opacity-50"
              >
                {submitting ? "Processing..." : `Confirm Rs ${totalAmount.toLocaleString()}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
