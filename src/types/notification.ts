export type NotificationType = "receta" | "consulta" | "documento";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  /** Already formatted for display, e.g. "Hace 2 horas", "Ayer", "12 sep". */
  timestamp: string;
  read: boolean;
  /** Only applies to type "receta": decides whether the icon is red (high) or amber (medium). */
  urgency?: "alta" | "media";
  /** Route to navigate to on click, if applicable. */
  href?: string;
}
