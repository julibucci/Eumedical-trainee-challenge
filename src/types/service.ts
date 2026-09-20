import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

export type ServiceCategory = "atencion-medica" | "coordinacion-logistica" | "soporte-especializado";

export interface Service {
  id: string;
  category: ServiceCategory;
  /** Brand name of the service (already in English, not translated) — see src/i18n/content.ts for the description. */
  title: string;
  icon: LucideIcon;
  /** Second icon overlaid on a badge, to compose the concept (see ServiceIcon). */
  secondaryIcon?: LucideIcon;
}

export interface Capability {
  /** The text (title/description/detail) lives in src/i18n/content.ts, keyed by this id. */
  id: string;
  icon: ComponentType<{ tone?: "light" | "dark"; className?: string }>;
}

export interface JourneyStep {
  /** The title lives in src/i18n/content.ts, keyed by this id. */
  id: string;
  icon: LucideIcon;
}

export interface Metric {
  /** The label lives in src/i18n/content.ts, keyed by this id. */
  id: string;
  value: string;
}
