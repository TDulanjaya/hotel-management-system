"use client";

import React, { forwardRef } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

export type AlertVariant = "error" | "success" | "info" | "warning";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  onClose?: () => void;
  icon?: boolean;
}

const variantStyles: Record<AlertVariant, { container: string; icon: string }> = {
  error: {
    container: "border-red-200 bg-red-50 text-red-700",
    icon: "text-red-600",
  },
  success: {
    container: "border-green-200 bg-green-50 text-green-700",
    icon: "text-green-600",
  },
  info: {
    container: "border-[#d0c5af] bg-[#fbf9f5] text-[#4d4635]",
    icon: "text-[#735c00]",
  },
  warning: {
    container: "border-amber-200 bg-amber-50 text-amber-800",
    icon: "text-amber-600",
  },
};

const defaultIcons: Record<AlertVariant, React.ElementType> = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      children,
      variant = "error",
      title,
      onClose,
      icon = true,
      className = "",
      ...props
    },
    ref
  ) => {
    const IconComponent = defaultIcons[variant];
    const styles = variantStyles[variant];

    return (
      <div
        ref={ref}
        role="alert"
        aria-live="polite"
        className={`flex items-start gap-3 rounded-xl border p-4 text-sm font-semibold shadow-sm animate-[fadeUp_0.3s_ease-out] ${styles.container} ${className}`.trim()}
        {...props}
      >
        {icon && (
          <IconComponent className={`h-5 w-5 shrink-0 mt-0.5 ${styles.icon}`} />
        )}

        <div className="flex-1">
          {title && <h4 className="mb-1 font-bold leading-none">{title}</h4>}
          <div className="text-sm font-medium leading-relaxed">{children}</div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss alert"
            className="shrink-0 rounded-lg p-1 transition hover:bg-black/5"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = "Alert";
export default Alert;
