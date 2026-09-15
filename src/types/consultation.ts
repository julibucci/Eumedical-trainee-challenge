export type ConsultationStatus = "confirmada" | "pendiente" | "completada" | "cancelada";

export type MedicalSpecialty = "Cardiología" | "Medicina General" | "Nutrición" | "Traumatología";

export interface Consultation {
  id: string;
  doctor: string;
  specialty: MedicalSpecialty;
  status: ConsultationStatus;
  /** Ya formateada para mostrar, ej. "Martes 17 de septiembre". */
  date: string;
  /** Ej. "10:30 hs". */
  time: string;
  modality: string;
  /** Días hasta la consulta (determina la destacada en Consultas). Sin uso en el historial: 0. */
  daysUntil: number;
}
