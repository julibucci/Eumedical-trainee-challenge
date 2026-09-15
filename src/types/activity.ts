export type ActivityEventType = "consulta" | "documento" | "receta";

export type ActivityEvent = {
  id: string;
  type: ActivityEventType;
  /** Fecha corta ya formateada para mostrar (ej. "12 sep"). */
  date: string;
  title: string;
  subtitle: string;
};
