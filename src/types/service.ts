import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

export type ServiceCategory = "atencion-medica" | "coordinacion-logistica" | "soporte-especializado";

export interface Service {
  id: string;
  category: ServiceCategory;
  /** Nombre de marca del servicio (ya en inglés, no se traduce) — ver src/i18n/content.ts para la descripción. */
  title: string;
  icon: LucideIcon;
  /** Segundo ícono superpuesto en una insignia, para componer el concepto (ver ServiceIcon). */
  secondaryIcon?: LucideIcon;
}

export interface Capability {
  /** El texto (title/description/detail) vive en src/i18n/content.ts, keyed por este id. */
  id: string;
  icon: ComponentType<{ tone?: "light" | "dark"; className?: string }>;
}

export interface JourneyStep {
  /** El título vive en src/i18n/content.ts, keyed por este id. */
  id: string;
  icon: LucideIcon;
}

export interface Metric {
  /** El label vive en src/i18n/content.ts, keyed por este id. */
  id: string;
  value: string;
}
