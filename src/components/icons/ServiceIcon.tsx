import type { LucideIcon } from "lucide-react";
import { CrossBadge } from "./CrossBadge";

type ServiceIconProps = {
  icon: LucideIcon;
  /** Ícono secundario en una insignia blanca, para componer el concepto (ver Brand Book: íconos compuestos, no de una sola pieza). */
  secondaryIcon?: LucideIcon;
  /** Clase de color de marca para el ícono principal, ej. "text-emerald-800". */
  accentClassName: string;
  /** Fondo del círculo que envuelve el ícono principal. */
  circleClassName?: string;
  label: string;
};

/** Ícono compuesto reutilizable para las 14 tarjetas de servicios extendidos: círculo de color de categoría + forma principal + insignia (segundo ícono o cruz de marca). */
export function ServiceIcon({ icon: Icon, secondaryIcon: Secondary, accentClassName, circleClassName = "bg-white", label }: ServiceIconProps) {
  return (
    <span className="relative inline-flex h-14 w-14 shrink-0 items-center justify-center" role="img" aria-label={label}>
      <span className={`flex h-14 w-14 items-center justify-center rounded-full shadow-sm ${circleClassName}`}>
        <Icon aria-hidden="true" strokeWidth={1.5} className={`h-7 w-7 ${accentClassName}`} />
      </span>
      {Secondary && (
        <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
          <Secondary aria-hidden="true" strokeWidth={2} className={`h-3.5 w-3.5 ${accentClassName}`} />
        </span>
      )}
      <CrossBadge size={9} className={Secondary ? "absolute -left-1 -top-1" : "absolute -bottom-1 -right-1"} />
    </span>
  );
}
