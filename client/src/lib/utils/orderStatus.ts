/**
 * Centralized status constants and display helpers for LuxeStay PMS.
 */

export const RESERVATION_STATUS = {
  CONFIRMED: "CONFIRMED",
  CHECKED_IN: "CHECKED_IN",
  CHECKED_OUT: "CHECKED_OUT",
  CANCELLED: "CANCELLED",
} as const;

export const ROOM_STATUS = {
  AVAILABLE: "AVAILABLE",
  OCCUPIED: "OCCUPIED",
  CLEANING: "CLEANING",
  MAINTENANCE: "MAINTENANCE",
} as const;

export const TABLE_STATUS = {
  AVAILABLE: "AVAILABLE",
  OCCUPIED: "OCCUPIED",
  RESERVED: "RESERVED",
  CLEANING: "CLEANING",
} as const;

export const KITCHEN_ORDER_STATUS = {
  QUEUED: "QUEUED",
  PREPARING: "PREPARING",
  READY: "READY",
  SERVED: "SERVED",
  CANCELLED: "CANCELLED",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PARTIAL: "PARTIAL",
  PAID: "PAID",
  REFUNDED: "REFUNDED",
} as const;

export const ORDER_STATUS = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  SERVED: "SERVED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type ReservationStatusType = keyof typeof RESERVATION_STATUS;
export type RoomStatusType = keyof typeof ROOM_STATUS;
export type TableStatusType = keyof typeof TABLE_STATUS;
export type KitchenStatusType = keyof typeof KITCHEN_ORDER_STATUS;
export type PaymentStatusType = keyof typeof PAYMENT_STATUS;
