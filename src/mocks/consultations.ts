import type { Consultation } from "../types/consultation";

/** Misma fecha congelada que patientData.ts (16/09/2024) para que "en X días" sea coherente. */
export const consultations: Consultation[] = [
  {
    id: "cons-1",
    doctor: "Dr. Sebastián Torres",
    specialty: "Cardiología",
    status: "confirmada",
    date: "Martes 17 de septiembre",
    time: "10:30 hs",
    modality: "Videollamada",
    daysUntil: 1,
  },
  {
    id: "cons-2",
    doctor: "Dra. Laura Méndez",
    specialty: "Medicina General",
    status: "pendiente",
    date: "Lunes 23 de septiembre",
    time: "09:00 hs",
    modality: "Videollamada",
    daysUntil: 7,
  },
  {
    id: "cons-3",
    doctor: "Dra. Carla Rivas",
    specialty: "Nutrición",
    status: "confirmada",
    date: "Miércoles 2 de octubre",
    time: "14:30 hs",
    modality: "Videollamada",
    daysUntil: 16,
  },
];
