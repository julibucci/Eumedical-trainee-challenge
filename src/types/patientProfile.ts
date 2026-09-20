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
  /** Object URL of the uploaded photo (mock, does not persist — see README). null = use initials. */
  avatarUrl: string | null;
  /** Optional: the patient decides whether to record pre-existing conditions. */
  preexistingConditions: string;
}

export interface NotificationPreferences {
  appointmentReminders: boolean;
  prescriptionAlerts: boolean;
  weeklyTips: boolean;
}
