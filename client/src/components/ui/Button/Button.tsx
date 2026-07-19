"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "border border-[#735c00] bg-[#735c00] text-white hover:bg-[#d4af37] hover:text-[#241a00] shadow-sm hover:shadow",
  secondary:
    "border border-[#d0c5af] bg-[#f5f3ef] text-[#4d4635] hover:bg-[#e8e4db] hover:text-[#1b1c1a]",
  outline:
    "border border-[#735c00] bg-transparent text-[#735c00] hover:bg-[#735c00]/10",
  ghost:
    "border border-transparent bg-transparent text-[#4d4635] hover:bg-[#f5f3ef] hover:text-[#1b1c1a]",
  danger:
    "border border-red-600 bg-red-600 text-white hover:bg-red-700 shadow-sm",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5 font-bold",
  md: "px-4 py-2.5 text-sm rounded-xl gap-2 font-bold",
  lg: "px-6 py-3 text-base rounded-xl gap-2.5 font-bold",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = "",
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99]";

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
      fullWidth ? "w-full" : ""
    } ${className}`.trim();

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={combinedClassName}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
