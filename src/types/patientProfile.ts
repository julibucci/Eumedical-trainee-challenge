export interface PatientProfile {
  fullName: string;
  initials: string;
  status: string;
  patientId: string;
  isVerified: boolean;
  email: string;
  phone: string;
  insurance: string;
  age: number | null;
  /** Object URL de la foto subida (mock, no persiste — ver README). null = usar iniciales. */
  avatarUrl: string | null;
  /** Opcional: el paciente decide si quiere registrar enfermedades preexistentes. */
  preexistingConditions: string;
}

export interface NotificationPreferences {
  appointmentReminders: boolean;
  prescriptionAlerts: boolean;
  weeklyTips: boolean;
}
