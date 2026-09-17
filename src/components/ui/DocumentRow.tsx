import { useId, useState } from "react";
import { ClipboardList, Download, FileText, Leaf, Microscope, type LucideIcon } from "lucide-react";
import toast from "react-hot-toast";
import type { DocumentType, MedicalDocument } from "../../types/document";

const ICON_SIZE = 20;
const ICON_STROKE_WIDTH = 1.75;

const TYPE_CONFIG: Record<DocumentType, { icon: LucideIcon; bg: string }> = {
  "Análisis clínico": { icon: Microscope, bg: "bg-brand-medium-aqua/20" },
  "Estudio cardiológico": { icon: FileText, bg: "bg-brand-light-aqua/40" },
  "Informe médico": { icon: ClipboardList, bg: "bg-brand-pale-sage" },
  "Plan terapéutico": { icon: Leaf, bg: "bg-brand-yellow/20" },
};

function handleDownload(document: MedicalDocument) {
  // Mock: no hay archivo real. En producción descargaría el binario real del backend — ver README.
  toast(`Descargando "${document.name}" (mock)`);
}

type DocumentRowProps = {
  document: MedicalDocument;
};

/** Fila de documento con vista previa in-line expandible (mock, sin archivo real). */
export function DocumentRow({ document }: DocumentRowProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const previewId = useId();
  const { icon: Icon, bg } = TYPE_CONFIG[document.type];

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span aria-hidden="true" className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${bg}`}>
            <Icon size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} className="text-brand-dark-blue" />
          </span>
          <div>
            <p className="font-heading font-bold text-brand-dark-blue">{document.name}</p>
            <p className="text-sm text-gray-500">
              {document.type} · {document.issuer} · {document.date}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:shrink-0">
          <span className="text-sm text-gray-500">{document.size}</span>
          <button
            type="button"
            onClick={() => setIsPreviewOpen((current) => !current)}
            aria-expanded={isPreviewOpen}
            aria-controls={previewId}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold text-brand-dark-blue transition-colors hover:bg-gray-50"
          >
            Vista previa
          </button>
          <button
            type="button"
            onClick={() => handleDownload(document)}
            aria-label={`Descargar ${document.name}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-light-aqua/25 px-4 py-2 text-sm font-bold text-brand-dark-blue transition-colors hover:bg-brand-light-aqua/40"
          >
            <Download aria-hidden="true" size={16} strokeWidth={ICON_STROKE_WIDTH} />
            Descargar
          </button>
        </div>
      </div>

      {isPreviewOpen && (
        <div id={previewId} className="flex flex-col items-center gap-1 bg-gray-50 px-5 py-8 text-center">
          <FileText aria-hidden="true" size={40} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-400" />
          <p className="mt-2 font-bold text-gray-600">{document.name}</p>
          <p className="text-sm text-gray-400">
            {document.size} · {document.format}
          </p>
        </div>
      )}
    </div>
  );
}
