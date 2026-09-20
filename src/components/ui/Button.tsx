import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
  isLoading?: boolean;
};


const VARIANTS = {
  primary: "bg-brand-yellow text-brand-dark-blue hover:bg-brand-yellow/90",
  secondary: "border-2 border-brand-orange bg-transparent text-brand-dark-blue hover:bg-brand-orange/10",
} as const;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", fullWidth, isLoading, disabled, className = "", children, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 font-heading font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {isLoading ? "Cargando…" : children}
    </button>
  ),
);
Button.displayName = "Button";
