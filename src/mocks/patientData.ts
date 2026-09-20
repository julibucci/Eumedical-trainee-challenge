import type { ActivityEvent } from "../types/activity";

/** Mocked scenario, frozen at a fixed date (September 16, 2024) so that the
 * countdowns ("vence en 6 días", "próxima consulta") are consistent
 * with each other instead of being compared against today's real date. */
export const currentPatient = {
  firstName: "María",
  fullName: "María García",
  initials: "MG",
  status: "Paciente activa",
  today: "Lunes, 16 de septiembre de 2024",
};

export const nextAppointment = {
  doctor: "Dr. Sebastián Torres",
  specialty: "Cardiología",
  date: "Martes 17 de septiembre",
  time: "10:30 hs",
};

export const expiringPrescription = {
  medication: "Vitamina D 1000 UI",
  expiresOn: "22 de septiembre de 2024",
  daysLeft: 6,
};

export const recentActivity: ActivityEvent[] = [
  { id: "act-1", type: "consulta", date: "12 sep", title: "Consulta con Dra. Laura Méndez", subtitle: "Medicina General" },
  { id: "act-2", type: "documento", date: "12 sep", title: "Hemograma completo subido", subtitle: "PDF · 340 KB" },
  { id: "act-3", type: "receta", date: "1 sep", title: "Receta emitida", subtitle: "Losartán 50mg y Atorvastatina 10mg" },
  { id: "act-4", type: "consulta", date: "28 ago", title: "Consulta con Dr. Sebastián Torres", subtitle: "Cardiología" },
  { id: "act-5", type: "documento", date: "28 ago", title: "Electrocardiograma subido", subtitle: "PDF · 1.2 MB" },
  { id: "act-6", type: "receta", date: "10 ago", title: "Receta emitida", subtitle: "Vitamina D 1000 UI · 30 días" },
];

export const upcomingAppointments = [
  { id: "up-1", doctor: "Dra. Laura Méndez", date: "Lunes 23 sep", time: "09:00 hs", isNext: true },
  { id: "up-2", doctor: "Dra. Carla Rivas", date: "Miérc. 2 oct", time: "14:30 hs", isNext: false },
];

export const recentDocuments = [
  { id: "doc-1", name: "Hemograma completo", date: "12 sep 2024" },
  { id: "doc-2", name: "Electrocardiograma", date: "28 ago 2024" },
];

export const prescriptionsExpiringCount = 1;
