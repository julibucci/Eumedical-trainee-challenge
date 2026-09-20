export type PrescriptionStatus = "vigente" | "porVencer" | "vencida";

export interface Prescription {
  id: string;
  medication: string;
  status: PrescriptionStatus;
  /** Already formatted, e.g. "1 comprimido · 1 vez al día · en ayunas". */
  dosage: string;
  doctor: string;
  issuedDate: string;
  expiresDate: string;
}
