export type DocumentType = "Análisis clínico" | "Estudio cardiológico" | "Informe médico" | "Plan terapéutico";

export interface MedicalDocument {
  id: string;
  name: string;
  type: DocumentType;
  issuer: string;
  /** Already formatted for display, e.g. "12 sep 2024". */
  date: string;
  /** Already formatted, e.g. "340 KB" or "1.2 MB". */
  size: string;
  format: "PDF" | "JPG" | "PNG";
}
