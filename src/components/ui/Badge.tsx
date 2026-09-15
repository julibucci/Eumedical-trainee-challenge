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

// Fondo suave + texto oscuro (no sólido), compartido entre dominios (Consultas/Historial y Recetas)
// para que "confirmada"/"vigente" (verde), "pendiente"/"porVencer" (ámbar) y
// "cancelada"/"vencida" (rojo) sean exactamente el mismo color.
const GREEN_SOFT = "bg-brand-medium-aqua/20 text-emerald-800";
const AMBER_SOFT = "bg-brand-yellow/20 text-amber-800";
const GRAY_SOFT = "bg-gray-100 text-gray-600";
const RED_SOFT = "bg-red-100 text-red-700";

const VARIANTS = {
  orange: "bg-brand-orange text-white",
  green: "bg-brand-medium-aqua text-white",
  gray: "bg-gray-200 text-gray-700",
  confirmada: GREEN_SOFT,
  vigente: GREEN_SOFT,
  pendiente: AMBER_SOFT,
  porVencer: AMBER_SOFT,
  completada: GRAY_SOFT,
  cancelada: RED_SOFT,
  vencida: RED_SOFT,
} as const;

/** Pill/círculo pequeño reutilizable para contadores y estados (recetas por vencer, estado de consulta, etc.). */
export function Badge({ children, variant = "orange", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold leading-none ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
