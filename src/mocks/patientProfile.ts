import type { NotificationPreferences, PatientProfile } from "../types/patientProfile";

export const patientProfile: PatientProfile = {
  fullName: "María García",
  initials: "MG",
  status: "Paciente activa",
  patientId: "24891",
  isVerified: true,
  email: "maria.garcia@email.com",
  phone: "+54 9 11 4567-8900",
  insurance: "OSDE 210",
  age: 34,
  avatarUrl: null,
  preexistingConditions: "",
};

export const initialNotificationPreferences: NotificationPreferences = {
  appointmentReminders: true,
  prescriptionAlerts: true,
  weeklyTips: false,
};
