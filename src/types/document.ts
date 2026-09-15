export type DocumentType = "Análisis clínico" | "Estudio cardiológico" | "Informe médico" | "Plan terapéutico";

export interface MedicalDocument {
  id: string;
  name: string;
  type: DocumentType;
  issuer: string;
  /** Ya formateada para mostrar, ej. "12 sep 2024". */
  date: string;
  /** Ya formateado, ej. "340 KB" o "1.2 MB". */
  size: string;
  format: "PDF" | "JPG" | "PNG";
}
