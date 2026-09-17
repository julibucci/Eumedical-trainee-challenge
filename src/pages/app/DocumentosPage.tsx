import { type ChangeEvent, type DragEvent, useId, useState } from "react";
import { FileText, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import { DocumentRow } from "../../components/ui/DocumentRow";
import { EumedicalCross } from "../../components/ui/EumedicalCross";
import { documents as initialDocuments } from "../../mocks/documents";
import type { MedicalDocument } from "../../types/document";

const ICON_STROKE_WIDTH = 1.75;

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatFromFile(file: File): MedicalDocument["format"] {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "jpg" || extension === "jpeg") return "JPG";
  if (extension === "png") return "PNG";
  return "PDF";
}

function isAcceptedFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((extension) => name.endsWith(extension));
}

export default function DocumentosPage() {
  const [documents, setDocuments] = useState<MedicalDocument[]>(initialDocuments);
  const [isDragging, setIsDragging] = useState(false);
  const inputId = useId();

  function addFiles(files: File[]) {
    const accepted: MedicalDocument[] = [];

    for (const file of files) {
      if (!isAcceptedFile(file)) {
        toast.error(`"${file.name}" no es un formato aceptado (PDF, JPG, PNG)`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error(`"${file.name}" supera el máximo de 10 MB`);
        continue;
      }
      accepted.push({
        id: `upload-${Date.now()}-${file.name}`,
        name: file.name.replace(/\.[^.]+$/, ""),
        type: "Informe médico",
        issuer: "Subido por vos",
        date: "16 sep 2024",
        size: formatFileSize(file.size),
        format: formatFromFile(file),
      });
    }

    if (accepted.length > 0) {
      // Mock: solo se agrega al estado local, sin subir a ningún backend real — ver README.
      setDocuments((current) => [...accepted, ...current]);
      toast.success(accepted.length === 1 ? "Estudio agregado" : `${accepted.length} estudios agregados`);
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  }

  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length > 0) addFiles(files);
    event.target.value = "";
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-medium text-brand-dark-blue sm:text-3xl">Documentos e informes</h2>
        <p className="mt-1 text-gray-500">Tus estudios, análisis e informes médicos</p>
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          isDragging ? "border-brand-medium-aqua bg-brand-medium-aqua/10" : "border-brand-medium-aqua/50 bg-brand-medium-aqua/5"
        }`}
      >
        <UploadCloud aria-hidden="true" size={32} strokeWidth={ICON_STROKE_WIDTH} className="text-brand-dark-blue" />
        <p className="font-bold text-brand-dark-blue">Arrastrá tus estudios aquí</p>
        <p className="text-sm text-gray-500">PDF, JPG, PNG · Máx. 10 MB por archivo</p>
        <label
          htmlFor={inputId}
          className="mt-1 cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-brand-dark-blue transition-colors hover:bg-gray-50"
        >
          Seleccionar archivos
        </label>
        <input
          id={inputId}
          type="file"
          multiple
          accept={ACCEPTED_EXTENSIONS.join(",")}
          onChange={handleFileInputChange}
          className="sr-only"
        />
      </div>

      {documents.length === 0 ? (
        <div className="relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
          <EumedicalCross
            size={140}
            color="#1e4865"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 opacity-[0.06]"
          />
          <FileText aria-hidden="true" size={32} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-400" />
          <h3 className="font-display text-lg font-medium text-brand-dark-blue">Todavía no subiste ningún estudio</h3>
          <p className="max-w-sm text-gray-500">Usá la zona de arriba para subir tu primer análisis, estudio o informe.</p>
        </div>
      ) : (
        <div>
          <p className="font-heading text-xs font-bold uppercase tracking-wide text-brand-dark-blue">
            {documents.length} {documents.length === 1 ? "documento" : "documentos"}
          </p>
          <div className="mt-3 rounded-2xl bg-white">
            {documents.map((document) => (
              <DocumentRow key={document.id} document={document} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
