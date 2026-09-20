import { describe, expect, it } from "vitest";
import { groupPrescriptionsByStatus } from "../utils/groupPrescriptionsByStatus";
import type { Prescription } from "../types/prescription";

function makePrescription(overrides: Partial<Prescription>): Prescription {
  return {
    id: "rx-1",
    medication: "Ibuprofeno 400mg",
    status: "vigente",
    dosage: "1 comprimido · 1 vez al día",
    doctor: "Dra. Carla Rivas",
    issuedDate: "1 sep 2024",
    expiresDate: "1 oct 2024",
    ...overrides,
  };
}

describe("groupPrescriptionsByStatus", () => {
  it("groups each prescription into its corresponding status", () => {
    const prescriptions = [
      makePrescription({ id: "rx-1", status: "vigente" }),
      makePrescription({ id: "rx-2", status: "porVencer" }),
      makePrescription({ id: "rx-3", status: "vencida" }),
    ];

    const groups = groupPrescriptionsByStatus(prescriptions);

    expect(groups.vigente).toEqual([prescriptions[0]]);
    expect(groups.porVencer).toEqual([prescriptions[1]]);
    expect(groups.vencida).toEqual([prescriptions[2]]);
  });

  it("does not duplicate or drop items between groups", () => {
    const prescriptions = [
      makePrescription({ id: "rx-1", status: "vigente" }),
      makePrescription({ id: "rx-2", status: "vigente" }),
      makePrescription({ id: "rx-3", status: "vencida" }),
    ];

    const groups = groupPrescriptionsByStatus(prescriptions);
    const totalGrouped =
      groups.vigente.length + groups.porVencer.length + groups.vencida.length;

    expect(totalGrouped).toBe(prescriptions.length);
  });

  it("returns the three groups empty when there are no prescriptions", () => {
    const groups = groupPrescriptionsByStatus([]);

    expect(groups).toEqual({ vigente: [], porVencer: [], vencida: [] });
  });
});
