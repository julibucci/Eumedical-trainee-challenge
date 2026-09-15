import type { Prescription, PrescriptionStatus } from "../types/prescription";

export type PrescriptionGroups = Record<PrescriptionStatus, Prescription[]>;

export function groupPrescriptionsByStatus(prescriptions: Prescription[]): PrescriptionGroups {
  return {
    vigente: prescriptions.filter((prescription) => prescription.status === "vigente"),
    porVencer: prescriptions.filter((prescription) => prescription.status === "porVencer"),
    vencida: prescriptions.filter((prescription) => prescription.status === "vencida"),
  };
}
