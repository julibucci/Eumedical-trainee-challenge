import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  variant?:
    | "orange"
    | "green"
    | "gray"
    | "confirmada"
    | "pendiente"
    | "completada"
    | "cancelada"
    | "vigente"
    | "porVencer"
    | "vencida";
  className?: string;
};


const GREEN_SOFT = "bg-brand-medium-aqua/20 text-brand-dark-blue";
const AMBER_SOFT = "bg-brand-yellow/25 text-brand-dark-blue";
const GRAY_SOFT = "bg-brand-grey text-brand-dark-blue/60";
const RED_SOFT = "bg-red-100 text-red-700";


const VARIANTS = {
  orange: "bg-brand-yellow text-brand-dark-blue",
  green: "bg-brand-medium-aqua text-brand-dark-blue",
  gray: "bg-brand-grey text-brand-dark-blue",
  confirmada: GREEN_SOFT,
  vigente: GREEN_SOFT,
  pendiente: AMBER_SOFT,
  porVencer: AMBER_SOFT,
  completada: GRAY_SOFT,
  cancelada: RED_SOFT,
  vencida: RED_SOFT,
} as const;

export function Badge({ children, variant = "orange", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-heading text-xs font-bold leading-none ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
