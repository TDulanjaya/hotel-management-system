"use client";

import React, { forwardRef, useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      containerClassName = "",
      className = "",
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const baseInputStyles =
      "h-12 w-full rounded-xl border bg-white/80 text-base text-[#1f1f1f] shadow-sm outline-none transition duration-300 placeholder:text-[#8a8175] focus:bg-white focus:shadow-md focus:ring-4 disabled:bg-gray-100 disabled:opacity-60";

    const stateStyles = error
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
      : "border-[#d6c8b4] focus:border-[#9b7a12] focus:ring-[#d4af37]/20";

    const paddingStyles = `${leftIcon ? "pl-12" : "pl-4"} ${rightIcon ? "pr-12" : "pr-4"}`;

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-semibold text-[#3f3a31]"
          >
            {label}
          </label>
        )}

        <div className="group relative flex items-center">
          {leftIcon && (
            <div className="pointer-events-none absolute left-4 flex items-center justify-center text-[#8a6a08] transition group-focus-within:scale-110 group-focus-within:text-[#5d4613]">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={`${baseInputStyles} ${stateStyles} ${paddingStyles} ${className}`.trim()}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-4 flex items-center justify-center text-[#8a6a08]">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p
            id={errorId}
            role="alert"
            className="mt-1.5 text-xs font-semibold text-red-600"
          >
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={helperId} className="mt-1.5 text-xs text-[#7f7663]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
