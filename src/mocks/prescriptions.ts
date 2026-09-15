import type { Prescription } from "../types/prescription";

export const prescriptions: Prescription[] = [
  {
    id: "presc-1",
    medication: "Losartán 50mg",
    status: "vigente",
    dosage: "1 comprimido · 1 vez al día · en ayunas",
    doctor: "Dr. S. Torres",
    issuedDate: "1 sep 2024",
    expiresDate: "15 oct 2024",
  },
  {
    id: "presc-2",
    medication: "Atorvastatina 10mg",
    status: "vigente",
    dosage: "1 comprimido · 1 vez al día · por la noche",
    doctor: "Dr. S. Torres",
    issuedDate: "1 sep 2024",
    expiresDate: "15 oct 2024",
  },
  {
    id: "presc-3",
    medication: "Vitamina D 1000 UI",
    status: "porVencer",
    dosage: "1 cápsula · 1 vez al día · con comida",
    doctor: "Dra. L. Méndez",
    issuedDate: "10 ago 2024",
    expiresDate: "22 sep 2024",
  },
  {
    id: "presc-4",
    medication: "Melatonina 3mg",
    status: "vencida",
    dosage: "1 comprimido · al acostarse",
    doctor: "Dra. L. Méndez",
    issuedDate: "20 jul 2024",
    expiresDate: "20 ago 2024",
  },
  {
    id: "presc-5",
    medication: "Ibuprofeno 400mg",
    status: "vencida",
    dosage: "1 comprimido · según necesidad · máx 3 al día",
    doctor: "Dra. C. Rivas",
    issuedDate: "5 jul 2024",
    expiresDate: "5 ago 2024",
  },
];
