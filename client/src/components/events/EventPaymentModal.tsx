"use client";

import React, { useState } from "react";
import { createPayment } from "@/lib/api/paymentsApi";
import { CheckCircle2, CreditCard, DollarSign, Printer, X, Receipt, Building, ShieldCheck } from "lucide-react";

export type EventPaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  eventBill?: any;
  onPaymentSuccess: () => void;
};

export default function EventPaymentModal({
  isOpen,
  onClose,
  event,
  eventBill,
  onPaymentSuccess,
}: EventPaymentModalProps) {
  const grandTotal = Number(eventBill?.totalAmount ?? event?.grandTotal ?? 0);
  const paidAmount = Number(eventBill?.paidAmount ?? 0);
  const balanceAmount = Math.max(0, Number(eventBill?.balanceAmount ?? (grandTotal - paidAmount)));

  const defaultStage = paidAmount === 0 ? "ADVANCE_DEPOSIT" : balanceAmount <= 0 ? "FINAL_SETTLEMENT" : "INTERIM_PAYMENT";
  const defaultAmount = paidAmount === 0 ? Math.round(grandTotal * 0.3) : balanceAmount;

  const [paymentStage, setPaymentStage] = useState<string>(defaultStage);
  const [method, setMethod] = useState<string>("BANK_TRANSFER");
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [transactionRef, setTransactionRef] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [completedPayment, setCompletedPayment] = useState<any>(null);

  if (!isOpen || !event) return null;

  const handleStageChange = (stage: string) => {
    setPaymentStage(stage);
    if (stage === "ADVANCE_DEPOSIT") {
      setAmount(Math.round(grandTotal * 0.3));
    } else if (stage === "FINAL_SETTLEMENT") {
      setAmount(balanceAmount);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (amount <= 0) {
      setError("Payment amount must be greater than zero.");
      return;
    }

    if (amount > balanceAmount + 0.01) {
      setError(`Payment cannot exceed the remaining balance of Rs ${balanceAmount.toLocaleString()}`);
      return;
    }

    if (["BANK_TRANSFER", "CHEQUE", "CARD_TERMINAL", "LANKAQR"].includes(method) && !transactionRef.trim()) {
      setError("Please provide a bank slip number, cheque number, or transaction reference.");
      return;
    }

    setSubmitting(true);
    try {
      const billId = eventBill?.id || event.id;
      const stageLabel =
        paymentStage === "ADVANCE_DEPOSIT"
          ? "Advance Booking Deposit"
          : paymentStage === "FINAL_SETTLEMENT"
          ? "Final Settlement"
          : "Interim Payment";

      const payload = {
        amount,
        method,
        referenceType: "EVENT_BILL",
        referenceId: billId,
        transactionReference: transactionRef.trim() || undefined,
        guestName: event.organizerName || event.eventName,
        roomNumber: event.roomNumber || undefined,
        notes: `[${stageLabel}] ${notes.trim()}`.trim(),
      };

      const res = await createPayment(payload);
      setCompletedPayment({
        ...res,
        amount,
        method,
        transactionRef,
        stageLabel,
        eventName: event.eventName,
        organizerName: event.organizerName,
        primaryDate: event.primaryDate,
        venueName: event.selectedVenue?.name || "LuxeStay Grand Ballroom",
        totalAmount: grandTotal,
        newBalance: Math.max(0, balanceAmount - amount),
      });

      onPaymentSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to record event payment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#d0c5af]/60 bg-[#fbf9f5] px-6 py-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#735c00]">
              Events & Banquets Billing
            </span>
            <h2 className="text-lg font-extrabold text-[#1b1c1a]">
              Record Event Payment & Confirmation
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        {completedPayment ? (
          /* Printable Tax Invoice Voucher */
          <div className="p-6">
            <div className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 p-3 text-emerald-800">
              <CheckCircle2 size={22} className="text-emerald-600" />
              <span className="font-bold">Payment Verified & Ledger Updated</span>
            </div>

            <div
              id="printable-event-voucher"
              className="rounded-xl border border-dashed border-[#d0c5af] bg-[#faf8f4] p-5 font-mono text-sm text-[#1b1c1a]"
            >
              <div className="border-b border-[#d0c5af]/60 pb-3 text-center">
                <h3 className="font-sans text-base font-extrabold text-[#735c00]">
                  LUXESTAY HOTEL & BANQUETS
                </h3>
                <p className="text-xs text-[#565e74]">Official Banquet Payment Receipt & Confirmation</p>
                <p className="mt-1 text-[11px] text-gray-500">
                  {new Date().toLocaleString("en-LK", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>

              <div className="my-3 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Receipt Ref:</span>
                  <span className="font-bold">
                    {completedPayment.id ? completedPayment.id.slice(-8).toUpperCase() : "EVT-REC"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Event Name:</span>
                  <span className="font-bold">{completedPayment.eventName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Organizer:</span>
                  <span className="font-bold">{completedPayment.organizerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Venue & Date:</span>
                  <span className="font-bold">
                    {completedPayment.venueName} · {completedPayment.primaryDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Stage:</span>
                  <span className="font-bold text-[#735c00]">{completedPayment.stageLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tender Method:</span>
                  <span className="font-bold">{completedPayment.method}</span>
                </div>
                {completedPayment.transactionRef && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Slip / Cheque Ref:</span>
                    <span className="font-bold">{completedPayment.transactionRef}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-[#d0c5af]/60 pt-3 space-y-1">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Grand Total:</span>
                  <span>Rs {completedPayment.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-emerald-800">
                  <span>Amount Paid Now:</span>
                  <span>Rs {completedPayment.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-[#735c00]">
                  <span>Remaining Balance:</span>
                  <span>Rs {completedPayment.newBalance.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 border-t border-dashed border-[#d0c5af] pt-2 text-center text-[10px] text-gray-500">
                This receipt confirms booking confirmation in LuxeStay Event Master Ledger.
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#735c00] py-3 text-sm font-bold text-[#735c00] hover:bg-[#735c00]/5"
              >
                <Printer size={16} />
                Print Voucher
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl bg-[#735c00] py-3 text-sm font-bold text-white hover:bg-[#8d6b00]"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-bold text-red-700">
                {error}
              </div>
            )}

            {/* Event Summary Banner */}
            <div className="rounded-xl border border-[#e2dacf] bg-[#faf8f4] p-4 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm text-[#1b1c1a]">{event.eventName}</span>
                <span className="font-semibold text-[#735c00]">
                  {event.selectedVenue?.name || "Assigned Hall"}
                </span>
              </div>
              <p className="text-gray-500">
                Organizer: <strong>{event.organizerName}</strong> · Date: <strong>{event.primaryDate}</strong>
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-[#e2dacf] pt-2 text-center">
                <div>
                  <span className="text-gray-500 block text-[11px]">Grand Total</span>
                  <strong className="text-sm">Rs {grandTotal.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-[11px]">Paid to Date</span>
                  <strong className="text-sm text-emerald-700">Rs {paidAmount.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-[11px]">Remaining Balance</span>
                  <strong className="text-sm text-[#ba1a1a]">Rs {balanceAmount.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {/* Stage Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635] mb-2">
                Payment Stage
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleStageChange("ADVANCE_DEPOSIT")}
                  className={`rounded-xl border p-2.5 font-bold transition text-center ${
                    paymentStage === "ADVANCE_DEPOSIT"
                      ? "border-[#735c00] bg-[#735c00] text-white shadow-sm"
                      : "border-[#d0c5af] bg-white text-[#4d4635] hover:bg-[#faf8f4]"
                  }`}
                >
                  Advance Deposit (30%)
                </button>
                <button
                  type="button"
                  onClick={() => handleStageChange("INTERIM_PAYMENT")}
                  className={`rounded-xl border p-2.5 font-bold transition text-center ${
                    paymentStage === "INTERIM_PAYMENT"
                      ? "border-[#735c00] bg-[#735c00] text-white shadow-sm"
                      : "border-[#d0c5af] bg-white text-[#4d4635] hover:bg-[#faf8f4]"
                  }`}
                >
                  Interim Milestone
                </button>
                <button
                  type="button"
                  onClick={() => handleStageChange("FINAL_SETTLEMENT")}
                  className={`rounded-xl border p-2.5 font-bold transition text-center ${
                    paymentStage === "FINAL_SETTLEMENT"
                      ? "border-[#735c00] bg-[#735c00] text-white shadow-sm"
                      : "border-[#d0c5af] bg-white text-[#4d4635] hover:bg-[#faf8f4]"
                  }`}
                >
                  Final Balance
                </button>
              </div>
            </div>

            {/* Amount Tendered */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635]">
                  Payment Amount (Rs) *
                </label>
                <span className="text-xs text-gray-500">
                  Max Due: Rs {balanceAmount.toLocaleString()}
                </span>
              </div>
              <input
                type="number"
                min={1}
                max={balanceAmount}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-mono text-lg font-bold text-[#1b1c1a] focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                required
              />
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635] mb-2">
                Tender Method *
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {["BANK_TRANSFER", "CHEQUE", "CARD_TERMINAL", "CASH", "LANKAQR"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m)}
                    className={`rounded-xl border p-2.5 font-bold transition text-center ${
                      method === m
                        ? "border-[#735c00] bg-[#735c00] text-white shadow-sm"
                        : "border-[#d0c5af] bg-white text-[#4d4635] hover:bg-[#faf8f4]"
                    }`}
                  >
                    {m.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction / Slip Reference */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635] mb-1">
                Bank Slip / Cheque No / Auth Code *
              </label>
              <input
                type="text"
                placeholder="e.g. SLIP-998234 / CHQ-002131 / APPR-8842"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                className="w-full rounded-xl border border-[#d0c5af] bg-white p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#735c00]"
                required={method !== "CASH"}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4635] mb-1">
                Payment Notes / Audit Remarks
              </label>
              <textarea
                rows={2}
                placeholder="Notes for accounting and event coordinators..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-[#d0c5af] bg-white p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#735c00]"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2 border-t border-[#d0c5af]">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-[#d0c5af] py-3 text-sm font-bold text-[#4d4635] hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-xl bg-[#735c00] py-3 text-sm font-bold text-white hover:bg-[#8d6b00] disabled:opacity-50 shadow-md"
              >
                {submitting ? "Processing..." : `Confirm Rs ${amount.toLocaleString()}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
