/**
 * Common validation utilities for inputs across LuxeStay frontend.
 */

export function isValidEmail(email: string): boolean {
  if (!email || !email.trim()) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  if (!phone || !phone.trim()) return false;
  const digits = phone.replace(/[^0-9]/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

export function isValidDateRange(checkIn: string, checkOut: string): boolean {
  if (!checkIn || !checkOut) return false;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  return !isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start;
}

export function isValidPositiveNumber(value: any): boolean {
  const num = typeof value === "number" ? value : parseFloat(String(value));
  return !isNaN(num) && num > 0;
}
