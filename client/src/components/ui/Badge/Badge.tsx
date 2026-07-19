"use client";

import React, { forwardRef } from "react";

export type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "gold"
  | "neutral";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-green-100 text-green-700 border border-green-200",
  warning: "bg-amber-100 text-amber-800 border border-amber-200",
  danger: "bg-red-100 text-red-700 border border-red-200",
  info: "bg-blue-100 text-blue-700 border border-blue-200",
  gold: "bg-[#735c00]/15 text-[#735c00] border border-[#d4af37]/40",
  neutral: "bg-[#f5f3ef] text-[#4d4635] border border-[#d0c5af]",
};

const dotColors: Record<BadgeVariant, string> = {
  success: "bg-green-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
  gold: "bg-[#735c00]",
  neutral: "bg-[#7f7663]",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { children, variant = "neutral", dot = false, className = "", ...props },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${variantStyles[variant]} ${className}`.trim()}
        {...props}
      >
        {dot && (
          <span
            className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
export default Badge;
