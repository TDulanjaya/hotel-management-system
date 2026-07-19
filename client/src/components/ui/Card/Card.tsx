"use client";

import React, { forwardRef } from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "bordered";
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = "default", hoverable = false, className = "", ...props }, ref) => {
    const variantStyles = {
      default: "rounded-2xl border border-[#d0c5af] bg-white shadow-sm",
      glass: "rounded-2xl border border-white/60 bg-white/80 shadow-md backdrop-blur-md",
      bordered: "rounded-2xl border-2 border-[#d0c5af] bg-[#fbf9f5]",
    };

    const hoverStyle = hoverable
      ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#d4af37]/50"
      : "";

    return (
      <div
        ref={ref}
        className={`${variantStyles[variant]} ${hoverStyle} ${className}`.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className = "", ...props }, ref) => (
    <div ref={ref} className={`mb-4 flex flex-col space-y-1.5 ${className}`.trim()} {...props}>
      {children}
    </div>
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ children, className = "", ...props }, ref) => (
    <h3 ref={ref} className={`text-xl font-bold text-[#1b1c1a] ${className}`.trim()} {...props}>
      {children}
    </h3>
  )
);
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ children, className = "", ...props }, ref) => (
    <p ref={ref} className={`text-sm text-[#7f7663] ${className}`.trim()} {...props}>
      {children}
    </p>
  )
);
CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className = "", ...props }, ref) => (
    <div ref={ref} className={`${className}`.trim()} {...props}>
      {children}
    </div>
  )
);
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className = "", ...props }, ref) => (
    <div ref={ref} className={`mt-6 flex items-center justify-between border-t border-[#f0eae1] pt-4 ${className}`.trim()} {...props}>
      {children}
    </div>
  )
);
CardFooter.displayName = "CardFooter";

export default Card;
