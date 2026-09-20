export type ActivityEventType = "consulta" | "documento" | "receta";

export type ActivityEvent = {
  id: string;
  type: ActivityEventType;
  /** Short date already formatted for display (e.g. "12 sep"). */
  date: string;
  title: string;
  subtitle: string;
};
