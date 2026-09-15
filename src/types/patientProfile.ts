export interface PatientProfile {
  fullName: string;
  initials: string;
  status: string;
  patientId: string;
  isVerified: boolean;
  email: string;
  phone: string;
  insurance: string;
}

export interface NotificationPreferences {
  appointmentReminders: boolean;
  prescriptionAlerts: boolean;
  weeklyTips: boolean;
}
