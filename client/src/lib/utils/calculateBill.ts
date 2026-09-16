// Bill calculation helpers

export interface BillItem {
  id?: string;
  name: string;
  quantity: number;
  price: number;
}

export interface BillBreakdown {
  subtotal: number;
  serviceChargeAmount: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
}

export interface BillCalculationOptions {
  serviceChargeRate?: number; // e.g. 0.10 for 10%
  taxRate?: number;           // e.g. 0.05 for 5%
  discountAmount?: number;    // flat discount amount
}

// Calculate bill totals including tax, service charges, and discounts
export function calculateBill(
  items: BillItem[] = [],
  options: BillCalculationOptions = {}
): BillBreakdown {
  const {
    serviceChargeRate = 0,
    taxRate = 0,
    discountAmount = 0,
  } = options;

  const subtotal = items.reduce((sum, item) => {
    const qty = item.quantity > 0 ? item.quantity : 0;
    const price = item.price > 0 ? item.price : 0;
    return sum + qty * price;
  }, 0);

  const serviceChargeAmount = Math.round(subtotal * serviceChargeRate * 100) / 100;
  const taxableAmount = subtotal + serviceChargeAmount;
  const taxAmount = Math.round(taxableAmount * taxRate * 100) / 100;

  const validDiscount = Math.min(discountAmount, subtotal + serviceChargeAmount + taxAmount);
  const grandTotal = Math.max(0, Math.round((subtotal + serviceChargeAmount + taxAmount - validDiscount) * 100) / 100);

  return {
    subtotal,
    serviceChargeAmount,
    taxAmount,
    discountAmount: validDiscount,
    grandTotal,
  };
}

// Total up folio line items
export function calculateFolioTotal(lines: Array<{ amount?: number }>): number {
  if (!Array.isArray(lines)) return 0;
  return lines.reduce((sum, line) => sum + (Number(line.amount) || 0), 0);
}
