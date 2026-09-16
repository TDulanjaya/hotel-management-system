// Format amount with currency symbol (default LKR / Rs)
export function formatCurrency(
  amount: number | string | null | undefined,
  currency: string = "LKR",
  options?: { showPrefix?: boolean; decimals?: number }
): string {
  const num = typeof amount === "number" ? amount : parseFloat(String(amount || 0));
  if (isNaN(num)) return "Rs 0.00";

  const decimals = options?.decimals ?? 2;
  const formattedNumber = num.toLocaleString("en-LK", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (currency === "LKR" || currency === "Rs") {
    return options?.showPrefix === false ? formattedNumber : `Rs ${formattedNumber}`;
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  } catch {
    return `${currency} ${formattedNumber}`;
  }
}

export default formatCurrency;
