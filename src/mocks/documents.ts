import type { MedicalDocument } from "../types/document";

export const documents: MedicalDocument[] = [
  {
    id: "doc-1",
    name: "Hemograma completo",
    type: "Análisis clínico",
    issuer: "Dra. L. Méndez",
    date: "12 sep 2024",
    size: "340 KB",
    format: "PDF",
  },
  {
    id: "doc-2",
    name: "Electrocardiograma",
    type: "Estudio cardiológico",
    issuer: "Dr. S. Torres",
    date: "28 ago 2024",
    size: "1.2 MB",
    format: "PDF",
  },
  {
    id: "doc-3",
    name: "Informe de seguimiento cardiológico",
    type: "Informe médico",
    issuer: "Dr. S. Torres",
    date: "28 ago 2024",
    size: "520 KB",
    format: "PDF",
  },
  {
    id: "doc-4",
    name: "Perfil lipídico",
    type: "Análisis clínico",
    issuer: "Dra. L. Méndez",
    date: "12 sep 2024",
    size: "290 KB",
    format: "PDF",
  },
  {
    id: "doc-5",
    name: "Plan nutricional personalizado",
    type: "Plan terapéutico",
    issuer: "Dra. C. Rivas",
    date: "10 ago 2024",
    size: "180 KB",
    format: "PDF",
  },
];
