import { useState } from "react";
import { Download, Pill } from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "./Badge";
import { Button } from "./Button";
import type { Prescription, PrescriptionStatus } from "../../types/prescription";

const ICON_SIZE = 22;
const ICON_STROKE_WIDTH = 1.75;

const STATUS_CONFIG: Record<
  PrescriptionStatus,
  { badgeVariant: "vigente" | "porVencer" | "vencida"; badgeLabel: string; iconBg: string; iconColor: string }
> = {
  vigente: { badgeVariant: "vigente", badgeLabel: "Vigente", iconBg: "bg-brand-medium-aqua/20", iconColor: "text-brand-dark-blue" },
  porVencer: { badgeVariant: "porVencer", badgeLabel: "Por vencer", iconBg: "bg-brand-yellow/20", iconColor: "text-brand-dark-blue" },
  // "vencida" es un estado realmente negativo (receta expirada) — única excepción al rojo.
  vencida: { badgeVariant: "vencida", badgeLabel: "Vencida", iconBg: "bg-red-100", iconColor: "text-red-700" },
};

type PrescriptionCardProps = {
  prescription: Prescription;
  onDownload?: (prescription: Prescription) => void;
};

/** Tarjeta reutilizable de receta: el estado determina color, badge y botón de acción. */
export function PrescriptionCard({ prescription, onDownload }: PrescriptionCardProps) {
  const [isRequested, setIsRequested] = useState(false);
  const config = STATUS_CONFIG[prescription.status];
  const isExpired = prescription.status === "vencida";
  const needsRenewal = prescription.status === "porVencer" || prescription.status === "vencida";

  function handleRequestRenewal() {
    // Mock: en producción esto notificaría al médico emisor — ver README.
    setIsRequested(true);
    toast.success(`Renovación solicitada para ${prescription.medication}`);
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <span aria-hidden="true" className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${config.iconBg}`}>
          <Pill size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} className={config.iconColor} />
        </span>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-heading font-bold text-brand-dark-blue">{prescription.medication}</p>
            <Badge variant={config.badgeVariant}>{config.badgeLabel}</Badge>
          </div>
          <p className="text-sm text-gray-500">{prescription.dosage}</p>
          <p className="mt-1 text-xs text-gray-400">
            {prescription.doctor} · Emitida: {prescription.issuedDate} · Vence:{" "}
            <span className={isExpired ? "font-bold text-red-600" : undefined}>{prescription.expiresDate}</span>
          </p>
        </div>
      </div>

      <div className="sm:shrink-0">
        {needsRenewal ? (
          <Button onClick={handleRequestRenewal} disabled={isRequested}>
            {isRequested ? "Solicitud enviada" : "Solicitar renovación"}
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => onDownload?.(prescription)}
            aria-label={`Descargar receta de ${prescription.medication}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold text-brand-dark-blue transition-colors hover:bg-gray-50"
          >
            <Download aria-hidden="true" size={16} strokeWidth={ICON_STROKE_WIDTH} />
            Descargar
          </button>
        )}
      </div>
    </div>
  );
}
