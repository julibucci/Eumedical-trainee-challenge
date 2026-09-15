export type NotificationType = "receta" | "consulta" | "documento";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  /** Ya formateado para mostrar, ej. "Hace 2 horas", "Ayer", "12 sep". */
  timestamp: string;
  read: boolean;
  /** Solo aplica a type "receta": decide si el ícono va en rojo (alta) o ámbar (media). */
  urgency?: "alta" | "media";
  /** Ruta a la que navega al hacer click, si aplica. */
  href?: string;
}
