export type ConsultationStatus = "confirmada" | "pendiente" | "completada" | "cancelada";

export type MedicalSpecialty = "Cardiología" | "Medicina General" | "Nutrición" | "Traumatología";

export interface Consultation {
  id: string;
  doctor: string;
  specialty: MedicalSpecialty;
  status: ConsultationStatus;
  /** Already formatted for display, e.g. "Martes 17 de septiembre". */
  date: string;
  /** E.g. "10:30 hs". */
  time: string;
  modality: string;
  /** Days until the consultation (determines the highlighted one in Consultas). Unused in history: 0. */
  daysUntil: number;
}
